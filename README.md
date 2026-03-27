# DNA Synthesizer 🧬

A hardware-aware **1D Diffusion Model** for generating cell-type-specific regulatory DNA sequences. 

This project trains a customized U-Net-based diffusion architecture to synthesize 200 base-pair resolution epigenetic DNA elements. It employs Classifier-Free Guidance (CFG) to condition on distinct cell types (e.g., K562, HepG2, GM12878, hESCT0), allowing controlled synthesis of biological sequence data.

## 🚀 Key Features
* 🧠 **Diffusion Pipeline:** Employs a continuous-time Gaussian Diffusion module (`GaussianDiffusion1D`) with linear beta scheduling over standard biological tensors.
* 🧬 **Cell-Specific Conditioning:** Generates distinct binding/regulatory motifs specific to biological cell lines.
* 🕹️ **Hardware Optimizations:** Fully tailored to run efficiently on low-VRAM GPUs (e.g., NVIDIA RTX 3050 4G) out of the box:
  * Force-enabled **Mixed Precision (FP16)**.
  * **Gradient Accumulation** (`steps=8`) to simulate massive batch sizes.
  * **Thermal Protection:** Built-in sleep intervals between epochs to prevent laptop/compact GPU overheating.
  * **VRAM Safety Controller:** Monitors and aggressively protects memory overhead during runtime.

---

## 📂 Project Structure

```text
DNA-Synthesizer/
├── data/
│   └── genomic_data.tsv      # 19-column genomic TSV dataset (length 200bp)
├── checkpoints/
│   ├── model.safetensors                 # Periodic training backups
│   └── dna_diffusion_final.safetensors   # Final model weights
├── src/
│   ├── train.py              # Main accelerate training loop and data loading
│   ├── model.py              # Contains UNet1D, Attention, Resnet, and Embedding layers
│   ├── diffusion.py          # Forward and reverse diffusion sampling schedules
│   └── generate_results.py   # Synthesis script to generate new sequences from weights
└── README.md
```

## ⚙️ Installation

We use [uv](https://github.com/astral-sh/uv) as our primary package and environment manager. Ensure you have PyTorch installed with proper CUDA dependencies.

```bash
# Clone the repository
git clone https://github.com/your-username/dna-synthesizer.git
cd dna-synthesizer

# Ensure you have the required dependencies (uv sync if pyproject.toml is setup)
uv pip install torch accelerate safetensors einops tqdm
```

## 🏋️ Training the Model

The training script automatically locates your raw TSV sequences `data/genomic_data.tsv`. To launch a training block:

```bash
uv run accelerate launch src/train.py
```

**Resuming capability:** `train.py` automatically checks for `checkpoints/model.safetensors` on startup. If found, it safely unpacks the weights to resume training right where it crashed or exited—perfect for hardware-limited workflows!

## 🧪 Inference (Generating DNA)

Once your model has concluded training or you wish to sample from a saved state, run the generation script. By default, it generates `5` sequences for class `0` (K562):

```bash
uv run python src/generate_results.py
```

### Supported Cell Target Mappings:
* `0`: K562
* `1`: HepG2
* `2`: GM12878
* `3`: hESCT0
