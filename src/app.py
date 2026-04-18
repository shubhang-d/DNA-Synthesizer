import sys
import os
import torch
from flask import Flask, request, jsonify
from flask_cors import CORS
from safetensors.torch import load_file

# Add src to sys.path
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from model import UNet1D
from diffusion import GaussianDiffusion1D

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Force explicit CUDA to keep CPU free and load into high performance memory
device = torch.device('mps')
model = None
diffusion = None

def init_model():
    global model, diffusion
    print("Initializing DNA Diffusion Model on CUDA in FP16...")
    
    _model = UNet1D(seq_len=200, channels=4, dim=64, num_classes=4)
    _diffusion = GaussianDiffusion1D(_model, seq_len=200, channels=4, timesteps=50)

    checkpoint_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "checkpoints", "dna_diffusion_final.safetensors")
    if os.path.exists(checkpoint_path):
        state_dict = load_file(checkpoint_path)
        _model.load_state_dict(state_dict)
    else:
        # Fallback to model.safetensors if final is absent
        fallback_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "checkpoints", "model.safetensors")
        if os.path.exists(fallback_path):
            state_dict = load_file(fallback_path)
            _model.load_state_dict(state_dict)

    # Move to CUDA and forcibly cast to FP16 to keep VRAM low
    _model.to(device).half()
    _diffusion.to(device).half()
    _model.eval()
    
    model = _model
    diffusion = _diffusion

init_model()

IDX_TO_BASE = {0: 'A', 1: 'C', 2: 'G', 3: 'T'}

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"status": "running"})

@app.route('/api/generate', methods=['POST'])
def generate():
    try:
        data = request.json
        cell_type = int(data.get('cell_type', 0))
        batch_size = int(data.get('count', 5))
        
        classes = torch.full((batch_size,), cell_type, device=device, dtype=torch.long)
        
        with torch.no_grad():
            with torch.amp.autocast('mps', dtype=torch.float16):
                generated_tensor = diffusion.sample(classes=classes, batch_size=batch_size, cfg_scale=3.0)
        
        indices = torch.argmax(generated_tensor, dim=1)
        
        sequences = []
        for i in range(batch_size):
            seq = "".join([IDX_TO_BASE[idx.item()] for idx in indices[i]])
            sequences.append(seq)
            
        print("Generation Complete.")
        
        return jsonify({
            "sequences": sequences,
            "status": "success"
        })

    except Exception as e:
        print(f"Generation Error: {e}")
        return jsonify({"error": str(e), "status": "failed"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)