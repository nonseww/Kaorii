import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { useCallback, useEffect } from "react";
import { useAppStore } from "../store/useAppStore";

export const useModelPath = () => {
  const store = useAppStore();

  const checkModelPath = useCallback(() => {
    invoke<string>("get_model_path")
      .then((path) => store.setModelPath(path))
      .catch(() => store.setModelPath(null))
      .finally(() => store.setIsCheckingModel(false));
  }, []);

  useEffect(() => {
    checkModelPath();
  }, [checkModelPath]);

  const handleSelectModel = async () => {
    const selectedModel = await open({
      multiple: false,
      filters: [{ name: "AI model", extensions: ["gguf"] }],
    });

    if (selectedModel && typeof selectedModel === "string") {
      try {
        store.setIsServerReady(false);
        await invoke("save_model_path", { path: selectedModel });
        store.setModelPath(selectedModel);
        store.clearMessages();
        return true;
      } catch (e) {
        console.error("Failed to save path", e);
        return false;
      }
    }
  };

  return { checkModelPath, handleSelectModel };
};
