import { Command, Child } from "@tauri-apps/plugin-shell";
import { useEffect, useRef } from "react";
import { checkServerHealth } from "../services/checkServerHealth";
import { useAppStore } from "../store/useAppStore";

export const useLlamaServer = () => {
  const modelPath = useAppStore((s) => s.modelPath);
  const setIsServerReady = useAppStore((s) => s.setIsServerReady);
  const childRef = useRef<Child | null>(null);

  useEffect(() => {
    if (!modelPath) return;

    const startLlamaServer = async () => {
      if (childRef.current) {
        await childRef.current.kill();
        childRef.current = null;
        setIsServerReady(false);
      }

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

      const child = await command.spawn();
      childRef.current = child;
    };

    startLlamaServer();

    const healthCheckInterval = setInterval(async () => {
      const isHealthy = await checkServerHealth();
      setIsServerReady(isHealthy);
    }, 2000);
    return () => {
      clearInterval(healthCheckInterval);
      if (childRef.current) {
        childRef.current.kill();
      }
    };
  }, [modelPath, setIsServerReady]);
};
