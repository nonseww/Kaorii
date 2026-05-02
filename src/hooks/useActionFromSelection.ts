import { invoke } from "@tauri-apps/api/core";
import { Message } from "../types/Message";
import { useClipboard } from "./useClipboard";
import { sendRequest } from "../services/sendRequest";

interface Props {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setIsLoading: (state: boolean) => void;
  setError: (err: string) => void;
  isExpanded: boolean;
  toggleWindow: () => Promise<void>;
}

export const useActionFromSelection = (props: Props) => {
  const {
    messages,
    setMessages,
    setIsLoading,
    setError,
    isExpanded,
    toggleWindow,
  } = props;
  const { getClipboardText } = useClipboard();

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
        messages,
        setMessages,
        text: finalPrompt,
        setError,
        setIsLoading,
      });

      await invoke("focus_window");
    } catch (err) {
      console.log(err);
    }
  };
  return runAction;
};
