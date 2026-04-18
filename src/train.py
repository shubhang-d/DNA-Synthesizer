import os
import time
import torch
import torch.nn.functional as F
from torch.utils.data import DataLoader, TensorDataset
from accelerate import Accelerator
from safetensors.torch import save_file, load_file
import argparse

from model import UNet1D
from diffusion import GaussianDiffusion1D
from validator import SequenceValidator

class VRAMSafetyController:
    def __init__(self, device, threshold=0.90):
        self.device = device
        self.threshold = threshold
        # RTX 3050 has 4GB or 6GB VRAM.
        if device.type == 'cuda':
            self.total_vram = torch.cuda.get_device_properties(device).total_memory
        else:
            self.total_vram = 0

    def check_and_adjust_batch_size(self, current_batch_size, min_batch_size=2):
        if self.total_vram == 0:
            return current_batch_size
            
        reserved_vram = torch.cuda.memory_reserved(self.device)
        ratio = reserved_vram / self.total_vram
        
        if ratio > self.threshold:
            new_batch_size = max(min_batch_size, current_batch_size // 2)
            print(f"⚠️ VRAM usage at {ratio*100:.1f}%! Reducing batch size: {current_batch_size} -> {new_batch_size}")
            torch.cuda.empty_cache()
            return new_batch_size
        return current_batch_size

def get_real_dataloader(filepath, batch_size, seq_len=200):
    import csv
    sequences = []
    classes = []
    
    # Map for DNA bases and cell types
    base_map = {'A': 0, 'C': 1, 'G': 2, 'T': 3}
    cell_type_map = {'K562': 0, 'HepG2': 1, 'GM12878': 2, 'hESCT0': 3}
    
    try:
        with open(filepath, 'r') as f:
            reader = csv.reader(f, delimiter='\t' if filepath.endswith('.tsv') else ',')
            header = next(reader)
            for row in reader:
                if len(row) == 2:
                    seq, ct = row[0], row[1]
                elif len(row) >= 16:
                    seq = row[10]
                    tag = row[15]
                    ct = next((k for k in cell_type_map if k in tag), None)
                else:
                    continue
                    
                if ct not in cell_type_map:
                    continue

                # Convert string to indices
                seq_indices = [base_map[b] for b in seq if b in base_map]
                if len(seq_indices) != seq_len:
                    continue
                
                sequences.append(seq_indices)
                classes.append(cell_type_map[ct])
    except Exception as e:
        print(f"Error reading dataset: {e}. Falling back to random data!")
        # Fallback to random if file doesn't exist to prevent crash during setup
        sequences = torch.randint(0, 4, (1024, seq_len)).tolist()
        classes = torch.randint(0, 4, (1024,)).tolist()

    x = torch.tensor(sequences, dtype=torch.long)
    x = F.one_hot(x, num_classes=4).float() # [num_samples, seq_len, 4]
    x = x.permute(0, 2, 1) # [num_samples, 4, seq_len]
    
    classes = torch.tensor(classes, dtype=torch.long)
    
    dataset = TensorDataset(x, classes)
    return DataLoader(dataset, batch_size=batch_size, shuffle=True)

def train(args):
    accelerator = Accelerator(
        gradient_accumulation_steps=args.gradient_accumulation_steps,
        mixed_precision=args.mixed_precision
    )
    
    device = accelerator.device
    vram_controller = VRAMSafetyController(device, threshold=0.90)

    model = UNet1D(seq_len=200, channels=4, dim=64, num_classes=4)
    diffusion = GaussianDiffusion1D(model, seq_len=200, channels=4, timesteps=50)
    
    optimizer = torch.optim.AdamW(model.parameters(), lr=args.learning_rate)
    
    data_path = 'data/genomic_data.tsv'
    accelerator.print(f"Using dataset path: {data_path}")
    dataloader = get_real_dataloader(data_path, args.batch_size)
    
    model, diffusion, optimizer, dataloader = accelerator.prepare(model, diffusion, optimizer, dataloader)
    
    checkpoint_path = os.path.join(args.checkpoint_dir, "model.safetensors")
    if os.path.exists(checkpoint_path):
        accelerator.print(f"Loading weights from {checkpoint_path}...")
        try:
            unwrapped_model = accelerator.unwrap_model(model)
            state_dict = load_file(checkpoint_path)
            unwrapped_model.load_state_dict(state_dict)
            accelerator.print("✅ Successfully loaded specific checkpoint.")
        except Exception as e:
            accelerator.print(f"⚠️ Failed to load checkpoint: {e}")
    
    validator = SequenceValidator(['K562', 'HepG2', 'GM12878', 'hESCT0'])
    
    os.makedirs(args.checkpoint_dir, exist_ok=True)
    best_loss = float('inf')
    
    epochs = args.epochs
    global_step = 0
    
    for epoch in range(epochs):
        model.train()
        total_loss = 0
        
        for batch_idx, (x, classes) in enumerate(dataloader):
            with accelerator.accumulate(model):
                b = x.shape[0]
                t = torch.randint(0, diffusion.timesteps, (b,), device=device).long()
                
                loss = diffusion.p_losses(x, t, classes=classes)
                
                accelerator.backward(loss)
                if accelerator.sync_gradients:
                    accelerator.clip_grad_norm_(model.parameters(), 1.0)
                    
                optimizer.step()
                optimizer.zero_grad()
                
            total_loss += loss.item()
            global_step += 1
            
        avg_loss = total_loss / len(dataloader)
        accelerator.print(f"Epoch {epoch+1}/{epochs} - Loss: {avg_loss:.4f}")
        
        # Checkpointed Training
        if avg_loss < best_loss:
            best_loss = avg_loss
            if accelerator.is_main_process:
                unwrapped_model = accelerator.unwrap_model(model)
                save_path = os.path.join(args.checkpoint_dir, "dna_diffusion_final.safetensors")
                save_file(unwrapped_model.state_dict(), save_path)
                accelerator.print(f"✅ Saved better checkpoint to {save_path}")
        
        # Validation & Safety
        if (epoch + 1) % args.val_freq == 0:
            model.eval()
            with torch.no_grad():
                # VRAM Safety Check before generation
                args.generation_batch_size = vram_controller.check_and_adjust_batch_size(args.generation_batch_size)
                
                # Generate random synthetic samples for validation
                val_classes = torch.arange(0, 4, device=device).repeat(args.generation_batch_size // 4 + 1)[:args.generation_batch_size]
                
                unwrapped_diffusion = accelerator.unwrap_model(diffusion)
                
                if accelerator.is_main_process:
                    accelerator.print(f"Running automated bio-validation on {args.generation_batch_size} generated samples...")
                    generated_tensor = unwrapped_diffusion.sample(classes=val_classes, batch_size=args.generation_batch_size, cfg_scale=3.0)
                    
                    results = validator.validate_batch(generated_tensor, val_classes)
                    validator.print_report(results)
        
        # Thermal Protection Break
        accelerator.print("Cooling break: sleeping for 30s to lower GPU temperature...")
        time.sleep(30)
            
if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--batch_size", type=int, default=1) # locked batch_size=1
    parser.add_argument("--generation_batch_size", type=int, default=16)
    parser.add_argument("--gradient_accumulation_steps", type=int, default=8) # locked gradient_accumulation_steps=8
    parser.add_argument("--mixed_precision", type=str, default="fp16")
    parser.add_argument("--learning_rate", type=float, default=2e-4)
    parser.add_argument("--epochs", type=int, default=50) # 50 epochs
    parser.add_argument("--checkpoint_dir", type=str, default="checkpoints")
    parser.add_argument("--val_freq", type=int, default=2) # print/val progress every 2 epochs
    
    args = parser.parse_args()
    train(args)
