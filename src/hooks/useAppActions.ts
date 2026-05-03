import { invoke } from "@tauri-apps/api/core";
import { prompts } from "../data/prompts";
import { useActionFromSelection } from "./useActionFromSelection";
import { useToggleWindow } from "./useToggleWindow";
import { sendRequest } from "../services/sendRequest";

export const useAppActions = () => {
  const toggleWindow = useToggleWindow();
  const runAction = useActionFromSelection({
    toggleWindow,
  });
  const handleSummarize = () => runAction((text) => prompts(text).summarize);
  const handleTranslate = () => runAction((text) => prompts(text).translate);
  const handleExplainCode = () =>
    runAction((text) => prompts(text).explainCode);
  const handleMoveToSide = async (side: "left" | "right") => {
    try {
      await invoke("move_app_to_side", { side });
    } catch (err) {
      console.error("Failed to move window:", err);
    }
  };
  const sendMessage = async (text: string) => {
    await sendRequest({
      text,
      role: "user",
      temperature: 0.4,
    });
  };

  const sendGreeting = async () => {
    await sendRequest({
      text: prompts().greeting,
      role: "user",
      temperature: 0.7,
      saveToHistory: false,
    });
  };

  return {
    handleSummarize,
    handleTranslate,
    handleExplainCode,
    handleMoveToSide,
    sendMessage,
    sendGreeting,
  };
};
