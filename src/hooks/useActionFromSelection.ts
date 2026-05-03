import { invoke } from "@tauri-apps/api/core";
import { useClipboard } from "./useClipboard";
import { sendRequest } from "../services/sendRequest";
import { useAppStore } from "../store/useAppStore";

interface Props {
  toggleWindow: () => Promise<void>;
}

export const useActionFromSelection = ({ toggleWindow }: Props) => {
  const { getClipboardText } = useClipboard();
  const isExpanded = useAppStore((s) => s.isExpanded);

  const runAction = async (
    promptGenerator: (selectedText: string) => string,
  ) => {
    try {
      await invoke("copy_selected_text");

      await new Promise((resolve) => setTimeout(resolve, 300));

      const text = await getClipboardText();

      if (!text || text === null) {
        console.log("Clipboard is empty");
        return;
      }

      if (!isExpanded) {
        await toggleWindow();
      }

      const finalPrompt = promptGenerator(text);

      await sendRequest({
        text: finalPrompt,
        role: "user",
        temperature: 0.4,
      });
    } catch (err) {
      console.log(err);
    }
  };
  return runAction;
};
