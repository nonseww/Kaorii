import { useState, useEffect } from "react";
import { Command } from "@tauri-apps/plugin-shell";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<any>([]);
  const [modelPath, setModelPath] = useState<string>("");
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
      const modelPath0 = await invoke<string>("get_model_path");
      setModelPath(modelPath0);

      const command = Command.sidecar("binaries/llama-server", [
        "-m",
        modelPath0,
        "--port",
        "8080",
        "-ngl",
        "99",
        "--host",
        "127.0.0.1",
      ]);

      command.stdout.on("data", (line) => console.log("LLAMA LOG:", line));
      command.stderr.on("data", (line) => console.error("LLAMA ERROR:", line));

      command.on("close", (data) =>
        console.log(`Сервер закрылся с кодом ${data.code}`),
      );
      command.on("error", (error) =>
        console.error(`Ошибка процесса: ${error}`),
      );

      const child = await command.spawn();
      console.log("Процесс запущен, PID:", child.pid);
    };

    startLlamaServer();

    const healthCheckInterval = setInterval(async () => {
      const isHealthy = await checkServerHealth();
      setIsServerReady(isHealthy);
    }, 2000);
    return () => clearInterval(healthCheckInterval);
  }, []);

  return (
    <>
      ready? : {isServerReady ? "yes" : "not yet"}, path: {modelPath}
    </>
  );
}

export default App;
