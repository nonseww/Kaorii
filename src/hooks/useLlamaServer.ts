import { Command, Child } from "@tauri-apps/plugin-shell";
import { useEffect, useRef } from "react";
import { checkServerHealth } from "../services/checkServerHealth";
import { useAppStore } from "../store/useAppStore";

export const useLlamaServer = () => {
  const config = useAppStore((s) => s.config);
  const isConfigLoaded = useAppStore((s) => s.isConfigLoaded);
  const setIsServerReady = useAppStore((s) => s.setIsServerReady);
  const childRef = useRef<Child | null>(null);

  useEffect(() => {
    if (!isConfigLoaded) return;

    let healthCheckInterval: number | undefined;
    let isMounted = true;

    const manageServer = async () => {
      if (config.engine_type === "api") {
        setIsServerReady(true);
        if (childRef.current) {
          await childRef.current.kill();
          childRef.current = null;
        }
        return;
      }

      if (config.engine_type === "local") {
        setIsServerReady(false);

        if (!config.model_path) {
          return;
        }
      }

      if (childRef.current) {
        try {
          await childRef.current.kill();
          childRef.current = null;
          await new Promise((r) => setTimeout(r, 2500));
        } catch (e) {
          console.error("Error while killing process:", e);
        }
      }

      if (!isMounted) return;

      const command = Command.sidecar("binaries/llama-server", [
        "-m",
        config.model_path ?? "",
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

        if (!isMounted) {
          await child.kill();
          return;
        }

        console.log("New server spawned. PID:", child.pid);

        healthCheckInterval = setInterval(async () => {
          const isHealthy = await checkServerHealth();
          if (isMounted) {
            setIsServerReady(isHealthy);
          }
        }, 2000);
      } catch (e) {
        console.error(
          "Failed to spawn server. Port 8080 might still be blocked.",
          e,
        );
      }
    };

    manageServer();

    return () => {
      isMounted = false;
      if (healthCheckInterval) {
        clearInterval(healthCheckInterval);
      }
      if (childRef.current) {
        childRef.current.kill();
        childRef.current = null;
      }
    };
  }, [config.model_path, config.engine_type, isConfigLoaded]);
};
