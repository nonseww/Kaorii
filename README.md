# Kaorii

A lightweight, privacy-focused desktop AI assistant built with Tauri, React, and llama.cpp. Kaorii lives as a floating widget on your desktop, providing instant access to a local Large Language Model (LLM) for high-speed AI assistance without compromising your data.

# Key Features

- **100% Private & Local:** No data leaves your machine. All processing is done locally using llama.cpp.
- **GPU Accelerated:** Optimized for NVIDIA GPUs via CUDA, ensuring near-instant responses even on mid-range hardware.
- **Floating UI:** A minimalist, "Spotlight-style" widget that can be dragged anywhere on your screen and toggled between a compact icon and a full chat interface.
- **Smart Formatting:** Full Markdown support with syntax highlighting for code blocks (Python, C++, JS, etc.).
- **Context Aware:** Remembers conversation history for seamless follow-up questions.
- **Linux First:** Developed and tested on Linux (Mint/Cinnamon), with cross-platform compatibility in mind.

## Global Hotkeys

Kaorii is designed to be used without leaving your current workflow.

---

| Shortcut         | Action                                                           |
| ---------------- | ---------------------------------------------------------------- |
| `Ctrl + Alt + O` | **Toggle Window** — Expand to Chat or collapse to Widget         |
| `Ctrl + Alt + S` | **Summarize** — Get a summary of the currently selected text     |
| `Ctrl + Alt + T` | **Translate** — Translate selected text to Russian               |
| `Ctrl + Alt + C` | **Explain Code** — Detailed explanation of the highlighted code  |
| `Ctrl + Alt + ←` | **Move Left** — Snap the widget to the left side of the screen   |
| `Ctrl + Alt + →` | **Move Right** — Snap the widget to the right side of the screen |

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
git clone https://github.com/nonseww/Kaorii.git
cd Kaorii
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

- [x] Global Hotkeys: System-wide shortcuts for all major actions.
- [x] Selection Intelligence: Automatic capturing of highlighted text from X11 Primary selection.
- [x] Custom Window UI: Frameless, draggable interface with custom title bar controls.
- [ ] Multi-Model Support: Easily switch between local LLMs and Cloud APIs (OpenRouter, NVIDIA).
- [ ] Voice Commands: Speech-to-text integration for hands-free assistance.
- [ ] System Tray: Minimize to tray and background execution.

## License

Distributed under the MIT License. See `LICENSE` for more information.
