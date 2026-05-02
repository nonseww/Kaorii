import { Command } from "@tauri-apps/plugin-shell";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { checkServerHealth } from "../services/checkServerHealth";

export const useLlamaServer = () => {
  const [isServerReady, setIsServerReady] = useState(false);

  useEffect(() => {
    const startLlamaServer = async () => {
      const modelPath = await invoke<string>("get_model_path");

      const command = Command.sidecar("binaries/llama-server", [
        "-m",
        modelPath,
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
        console.log(`Server is closed with ${data.code}`),
      );
      command.on("error", (error) => console.error(`Process error: ${error}`));

      const child = await command.spawn();
      console.log("PID:", child.pid);
    };

    startLlamaServer();

    const healthCheckInterval = setInterval(async () => {
      const isHealthy = await checkServerHealth();
      setIsServerReady(isHealthy);
    }, 2000);
    return () => clearInterval(healthCheckInterval);
  }, []);

  return isServerReady;
};
