import { readText } from "@tauri-apps/plugin-clipboard-manager";

export const useClipboard = () => {
  const getClipboardText = async () => {
    try {
      const content = await readText();
      return content;
    } catch (err) {
      console.error("Failed to read clipboard:", err);
      return null;
    }
  };

  return { getClipboardText };
};
