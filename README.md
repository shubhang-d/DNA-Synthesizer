# DNA-Synthesizer: Agentic Code Refactoring & Synthetic DNA Diffusion 🧬

![DNA-Synthesizer Banner](placeholder-banner.png) <!-- Placeholder for a banner image -->

A state-of-the-art, hardware-aware platform combining artificial intelligence, next-gen 3D WebGL visualizations, and agentic workflows to generate cell-type-specific regulatory DNA sequences. 

This project trains a customized 1D U-Net diffusion architecture to synthesize 200 base-pair resolution epigenetic DNA elements, wrapped in a premium, high-performance web interface.

---

## 🚀 Key Features

| Feature | Description |
| :--- | :--- |
| **🧬 Synthetic Sequence Generation** | A robust 1D Diffusion model utilizing Classifier-Free Guidance (CFG) for distinct cell-line generation (e.g., K562, HepG2, GM12878). Fully optimized for low-VRAM inference and training. |
| **✨ 3D 'Quantum Amethyst' Visualization** | A stunning, real-time WebGL molecular visualizer. Features procedural particle fields, dynamic bloom rendering, and interactive UI tilting driven by a dark indigo and violet clinical aesthetic. |
| **🤖 Agentic Technical Debt Auditing** | Intelligent agentic support designed for auto-analyzing the codebase to resolve technical debt, enforce scalable architectures, and maintain peak code health (CloudCode). |

---

## 🛠️ Tech Stack

This project bridges a heavy machine learning backend with an ultra-responsive frontend. 

**Frontend (Client)**
* **Next.js & React 19** - Framework for dynamic rendering and routing.
* **React-Three-Fiber & Three.js** - For deploying complex 3D molecular meshes directly to the browser.
* **Tailwind CSS v4 & Framer Motion** - Powering the "Obsidian Developer Terminal" and glassmorphism styling with butter-smooth micro-animations.

**Backend (Server)**
* **Python 3.12+ (UV Environment)** - High-speed package management and environment isolation.
* **PyTorch & Accelerate** - Model training, precision FP16 scheduling, and gradient accumulation.
* **DNA-Diffusion Models** - 1D Continuous Gaussian Diffusion architecture.
* **Flask** - A lightweight API layer serving sequence generation to the client.

---

## 📸 UI Screenshots

> **Note:** Below are placeholders for the new **'Obsidian Developer Terminal'** featuring the Quantum Amethyst aesthetics.

<div align="center">
  <img src="placeholder-screenshot-1.png" alt="Quantum Amethyst 3D Visualization" width="45%" />
  <img src="placeholder-screenshot-2.png" alt="Clinical Indigo UI Terminal" width="45%" />
</div>

---

## 🏗️ Architecture: The AI-to-WebGL Bridge

The architecture is split into two asynchronous environments:

1. **The Inference Engine (Python/Flask)**: Listens continuously on `127.0.0.1:5000`. Upon receiving generation parameters (cell line type and count), it unfreezes the safetensor checkpoints and routes the noise map through the reverse diffusion process.
2. **The Clinical Dashboard (Next.js/R3F)**: Resides on `localhost:3000`. It dispatches API requests while actively managing a heavy WebGL processing pipeline. The data matrix "decodes" the returned bases visually through a scrambled text effect, keeping the user immersed while the DNA object spins up and brightens based on generation state.

---

## ⚙️ Installation & Usage

To run the full stack, you must launch both servers simultaneously. Follow the instructions below to get your local environment running.

### 1. Python Backend (Machine Learning API)

We use [uv](https://github.com/astral-sh/uv) to wrangle the Python ecosystem.

```bash
# Clone the repository
git clone https://github.com/your-username/dna-synthesizer.git
cd dna-synthesizer

# Ensure you have the required dependencies
uv pip install torch accelerate safetensors einops flask flask-cors tqdm

# Launch the generation API
uv run python src/api.py
```
> ✅ You should see an output on port `5000` confirming the backend is ready.

*(Optional Training)*: If you wish to retrain the diffusion models locally:
```bash
uv run accelerate launch src/train.py
```

### 2. Next.js Frontend (Clinical Dashboard)

Open a **new, entirely separate terminal window** and navigate into the `frontend` directory.

```bash
cd frontend

# Install the necessary Node packages
npm install

# Boot up the interactive Next.js dashboard
npm run dev
```

> 🌐 The interface will successfully mount on `http://localhost:3000`. You can now select your cell target strings and witness the generation process firsthand!

---

*Engineered by the DNA-Synthesizer Team*
>>>>>>> origin/main
