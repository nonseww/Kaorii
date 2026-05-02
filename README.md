# LLM Helper

A lightweight, privacy-focused desktop AI assistant built with Tauri, React, and llama.cpp. This application lives in your system tray as a floating widget and provides instant access to a local Large Language Model (LLM) for grammar checking, code explanation, and general assistance.

# Key Features

- **100% Private & Local:** No data leaves your machine. All processing is done locally using llama.cpp.
- **GPU Accelerated:** Optimized for NVIDIA GPUs via CUDA, ensuring near-instant responses even on mid-range hardware.
- **Floating UI:** A minimalist, "Spotlight-style" widget that can be dragged anywhere on your screen and toggled between a compact icon and a full chat interface.
- **Smart Formatting:** Full Markdown support with syntax highlighting for code blocks (Python, C++, JS, etc.).
- **Context Aware:** Remembers conversation history for seamless follow-up questions.
- **Linux First:** Developed and tested on Linux (Mint/Cinnamon), with cross-platform compatibility in mind.

## Tech Stack

- Frontend: React 18, TypeScript, Vite.
- Styling: SCSS (CSS Modules).
- Backend: Rust (Tauri v2).
- AI Engine: llama-server (embedded as a Tauri Sidecar).
- Model Format: GGUF (optimized for local execution).

## Getting Started

### Prerequisites

1. **Rust & Cargo:** Install via rustup.rs.
2. **Node.js:** Latest LTS version.
3. **CUDA Toolkit:** (Optional, for NVIDIA users) To enable GPU acceleration.
4. **Model File:** Download a .gguf model (e.g., Gemma-2-2b-it or Llama-3.2-3B) and place it in the models/ directory.

### Installation

1. Clone the repository:

```bash
git clone https://github.com/nonseww/llm_helper.git
cd llm_helper
```

2. Install dependencies:

```Bash
npm install
```

3. Compile the AI Sidecar:
   You need to compile llama-server from the llama.cpp repository and place the binary in src-tauri/binaries/ with the appropriate architecture suffix.

4. Run in development mode:

```Bash
npm run tauri dev
```

## Roadmap

- [ ] Global hotkey support (e.g., Alt + Space to summon).
- [ ] Automated model downloading and setup.
- [ ] System tray integration.
- [ ] "Clipboard mode": automatically process selected text.

## License

Distributed under the MIT License. See `LICENSE` for more information.
