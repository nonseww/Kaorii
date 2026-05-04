import { useEffect } from "react";
import { Chat } from "./components/Chat";
import { SmallWidget } from "./components/SmallWidget";
import { useLlamaServer } from "./hooks/useLlamaServer";
import { useToggleWindow } from "./hooks/useToggleWindow";
import { useShortcutToggle } from "./hooks/useShortcutToggle";
import { useShortcut } from "./hooks/useShortcut";
import { shortcuts } from "./data/shortcuts";
import { useModelPath } from "./hooks/useModelPath";
import { useAppStore } from "./store/useAppStore";
import { useAppActions } from "./hooks/useAppActions";
import "./App.css";

function App() {
  const store = useAppStore();
  const toggleWindow = useToggleWindow();
  useLlamaServer();
  const { handleSelectModel } = useModelPath();
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
    if (
      store.messages.length === 1 &&
      store.isServerReady &&
      !store.isLoading
    ) {
      sendGreeting();
      store.setIsCleared(false);
    }
  }, [store.isServerReady, store.isCleared]);

  return (
    <>
      {store.isExpanded ? (
        <Chat
          handleSelectModel={handleSelectModel}
          toggleWindow={toggleWindow}
        />
      ) : (
        <SmallWidget onClick={toggleWindow} />
      )}
    </>
  );
}

export default App;
