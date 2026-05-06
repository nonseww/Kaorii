import { useEffect } from "react";
import { useLlamaServer } from "./useLlamaServer";
import { useAppActions } from "./useAppActions";
import { useShortcutToggle } from "./useShortcutToggle";
import { useShortcut } from "./useShortcut";
import { shortcuts } from "../data/shortcuts";
import { useToggleWindow } from "./useToggleWindow";
import { useAppStore } from "../store/useAppStore";

export const useAppInit = () => {
  const toggleWindow = useToggleWindow();
  const store = useAppStore();

  useLlamaServer();

  const {
    handleSummarize,
    handleTranslate,
    handleExplainCode,
    handleMoveToSide,
    sendGreeting,
  } = useAppActions();

  useShortcutToggle({ toggleWindow });
  useShortcut(handleSummarize, shortcuts.summarize);
  useShortcut(handleTranslate, shortcuts.translate);
  useShortcut(handleExplainCode, shortcuts.explainCode);
  useShortcut(() => handleMoveToSide("left"), shortcuts.moveToSideLeft);
  useShortcut(() => handleMoveToSide("right"), shortcuts.moveToSideRight);

  useEffect(() => {
    store.loadConfig();
  }, []);

  useEffect(() => {
    if (
      store.messages.length === 1 &&
      store.isServerReady &&
      !store.isLoading
    ) {
      console.log("greet!");
      sendGreeting();
      store.setIsCleared(false);
    }
  }, [store.isServerReady, store.isCleared, store.config.engine_type]);
};
