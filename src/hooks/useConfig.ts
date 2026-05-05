import { useAppStore } from "../store/useAppStore";
import { open } from "@tauri-apps/plugin-dialog";

export const useConfig = () => {
  const store = useAppStore();

  const handleSelectModel = async () => {
    const selectedModel = await open({
      multiple: false,
      filters: [{ name: "AI model", extensions: ["gguf"] }],
    });

    if (selectedModel && typeof selectedModel === "string") {
      try {
        store.setError("");
        store.setIsServerReady(false);
        await store.updateConfig({ model_path: selectedModel });
        store.clearMessages();
        return true;
      } catch (e) {
        console.error("Failed to save path", e);
        return false;
      }
    }
  };

  const handleSelectApiModel = async ({
    modelName,
    apiKey,
  }: {
    modelName: string;
    apiKey: string;
  }) => {
    if (modelName && apiKey) {
      try {
        store.setError("");
        store.setIsServerReady(false);
        await store.updateConfig({
          api_key_masked: apiKey,
          api_model: modelName,
        });
        store.clearMessages();
        return true;
      } catch (e) {
        console.error("Failed to save api model:", e);
        return false;
      }
    }
  };

  const handleSelectIcon = async () => {
    const selectedIcon = await open({
      multiple: false,
      filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg", "svg"] }],
    });

    if (selectedIcon && typeof selectedIcon === "string") {
      try {
        await store.updateConfig({ icon_path: selectedIcon });
      } catch (err) {
        console.error("Icon save failed:", err);
      }
    }
  };

  return { handleSelectIcon, handleSelectApiModel, handleSelectModel };
};
