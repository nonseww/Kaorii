import { useState } from "react";
import "./App.css";
import type { Message } from "./types/Message";
import { Chat } from "./components/Chat";
import { SmallWidget } from "./components/SmallWidget";
import { useLlamaServer } from "./hooks/useLlamaServer";
import { sendRequest } from "./services/sendRequest";
import { useToggleWindow } from "./hooks/useToggleWindow";
import { useShortcutToggle } from "./hooks/useShortcutToggle";
import { useShortcutSummarize } from "./hooks/useShortcutSummarize";
import { useSummarize } from "./hooks/useSummarize";

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content:
        "Ты - универсальный ИИ-помощник. Отвечай вежливо и развернуто. Говори на том языке, который пользователь использует больше всего",
    },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const isServerReady = useLlamaServer();
  const toggleWindow = useToggleWindow({ isExpanded, setIsExpanded });

  useShortcutToggle({ toggleWindow });

  const handleSummarize = useSummarize({
    messages,
    setMessages,
    setIsLoading,
    setError,
    isExpanded,
    toggleWindow,
  });

  useShortcutSummarize(handleSummarize);

  const sendMessage = async (text: string) => {
    await sendRequest({
      messages,
      setMessages,
      text,
      setError,
      setIsLoading,
    });
  };

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
