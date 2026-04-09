import sys
import os
import torch
from safetensors.torch import load_file

# Add src to sys.path
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from model import UNet1D
from diffusion import GaussianDiffusion1D

def generate_sequences():
    # Set device
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

    # Initialize model and diffusion
    print("Initializing model...")
    model = UNet1D(seq_len=200, channels=4, dim=64, num_classes=4)
    diffusion = GaussianDiffusion1D(model, seq_len=200, channels=4, timesteps=50)

    # Load weights
    checkpoint_path = "checkpoints/dna_diffusion_final.safetensors"
    print(f"Loading weights from {checkpoint_path}...")
    try:
        state_dict = load_file(checkpoint_path)
        model.load_state_dict(state_dict)
        print("✅ Weights loaded successfully.")
    except Exception as e:
        print(f"⚠️ Error loading weights: {e}")
        return

    # Move to device
    model.to(device)
    diffusion.to(device)
    model.eval()

    # Generate 5 DNA sequences for cell_type=0
    batch_size = 5
    cell_type = 0
    classes = torch.full((batch_size,), cell_type, device=device, dtype=torch.long)

    print(f"Generating {batch_size} sequences for cell type {cell_type} (K562)...")
    with torch.no_grad():
        generated_tensor = diffusion.sample(classes=classes, batch_size=batch_size, cfg_scale=3.0)

    # Convert the (batch_size, 4, seq_len) continuous tensor to nucleotide sequences
    # We find the channel with the maximum activation for each position
    indices = torch.argmax(generated_tensor, dim=1) # Shape: (batch_size, seq_len)
    
    # Map index back to base (0: A, 1: C, 2: G, 3: T based on train.py base_map)
    idx_to_base = {0: 'A', 1: 'C', 2: 'G', 3: 'T'}

    print("\n--- Generated Sequences ---")
    for i in range(batch_size):
        seq = "".join([idx_to_base[idx.item()] for idx in indices[i]])
        print(f"Seq {i+1}: {seq}")

if __name__ == "__main__":
    generate_sequences()