import { useState, useEffect } from "react";
import "./App.css";
import type { Message } from "./types/Message";
import { Chat } from "./components/Chat";
import { SmallWidget } from "./components/SmallWidget";
import { useLlamaServer } from "./hooks/useLlamaServer";
import { sendRequest } from "./services/sendRequest";
import { useToggleWindow } from "./hooks/useToggleWindow";
import { useShortcutToggle } from "./hooks/useShortcutToggle";
import { useShortcut } from "./hooks/useShortcut";
import { useActionFromSelection } from "./hooks/useActionFromSelection";
import { invoke } from "@tauri-apps/api/core";
import { prompts } from "./data/prompts";
import { shortcuts } from "./data/shortcuts";

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: prompts().systemInit,
    },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const isServerReady = useLlamaServer();
  const toggleWindow = useToggleWindow({ isExpanded, setIsExpanded });

  useShortcutToggle({ toggleWindow });

  const runAction = useActionFromSelection({
    messages,
    setMessages,
    setIsLoading,
    setError,
    isExpanded,
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

  useShortcut(handleSummarize, shortcuts.summarize);
  useShortcut(handleTranslate, shortcuts.translate);
  useShortcut(handleExplainCode, shortcuts.explainCode);
  useShortcut(() => handleMoveToSide("left"), shortcuts.moveToSideLeft);
  useShortcut(() => handleMoveToSide("right"), shortcuts.moveToSideRight);

  const sendMessage = async (text: string) => {
    await sendRequest({
      messages,
      setMessages,
      text,
      setError,
      setIsLoading,
      role: "user",
      temperature: 0.4,
    });
  };

  const sendGreeting = async () => {
    await sendRequest({
      messages,
      setMessages,
      text: prompts().greeting,
      setError,
      setIsLoading,
      role: "user",
      temperature: 0.7,
      saveToHistory: false,
    });
  };

  useEffect(() => {
    if (messages.length === 1 && isServerReady && !isLoading) {
      sendGreeting();
    }
  }, [isServerReady]);

  return (
    <>
      {isExpanded ? (
        <Chat
          isServerReady={isServerReady}
          messages={messages}
          isLoading={isLoading}
          error={error}
          sendMessage={sendMessage}
          onClick={toggleWindow}
          onClear={() => setMessages([])}
        />
      ) : (
        <SmallWidget onClick={toggleWindow} />
      )}
    </>
  );
}

export default App;
