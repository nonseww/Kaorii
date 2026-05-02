import { useState, useEffect } from "react";
import { Command } from "@tauri-apps/plugin-shell";
import "./App.css";

function App() {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<any>([]);
  const [isServerReady, setIsServerReady] = useState<boolean>(false);

  const checkServerHealth = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8080/health");
      return response.status === 200;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    const startLlamaServer = async () => {
      const command = Command.sidecar("binaries/llama-server", [
        "-m",
        "models/gemma-2-2b-it-Q4_K_M.gguf",
        "--port",
        "8080",
      ]);

      const child = await command.spawn();
    };

    startLlamaServer();

    const healthCheckInterval = setInterval(async () => {
      const isHealthy = await checkServerHealth();
      setIsServerReady(isHealthy);
    }, 2000);
    return () => clearInterval(healthCheckInterval);
  }, []);

  return <>ready? : {isServerReady ? "yes" : "not yet"}</>;
}

export default App;
