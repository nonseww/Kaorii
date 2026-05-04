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
    let isMounted = true;

    const startLlamaServer = async () => {
      setIsServerReady(false);

      if (childRef.current) {
        console.log("Killing old server process...");
        try {
          await childRef.current.kill();
          childRef.current = null;
          await new Promise((r) => setTimeout(r, 2500));
        } catch (e) {
          console.error("Error while killing process:", e);
        }
      }

      if (!isMounted) return;

      console.log("Starting new server with:", modelPath);

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

      try {
        const child = await command.spawn();
        childRef.current = child;
        console.log("New server spawned. PID:", child.pid);
      } catch (e) {
        console.error(
          "Failed to spawn server. Port 8080 might still be blocked.",
          e,
        );
      }
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
        childRef.current = null;
      }
    };
  }, [modelPath]);
};
