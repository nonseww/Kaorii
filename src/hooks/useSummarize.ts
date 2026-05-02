import { invoke } from "@tauri-apps/api/core";
import { sendRequest } from "../services/sendRequest";
import type { Message } from "../types/Message";
import { useClipboard } from "./useClipboard";

interface Props {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setIsLoading: (state: boolean) => void;
  setError: (err: string) => void;
  isExpanded: boolean;
  toggleWindow: () => Promise<void>;
}

export const useSummarize = ({
  messages,
  setMessages,
  setIsLoading,
  setError,
  isExpanded,
  toggleWindow,
}: Props) => {
  const { getClipboardText } = useClipboard();

  const handleSummarize = async () => {
    await invoke("copy_selected_text");

    await new Promise((resolve) => setTimeout(resolve, 300));

    const text = await getClipboardText();

    if (!text) {
      console.log("Clipboard is empty");
    }

    if (!isExpanded) {
      await toggleWindow();
    }

    const summarizePrompt = `Сделай краткую выжимку (summary) следующего текста: \n\n${text}`;

    await sendRequest({
      messages,
      setMessages,
      text: summarizePrompt,
      setError,
      setIsLoading,
    });
  };

  return handleSummarize;
};
