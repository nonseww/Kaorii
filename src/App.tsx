import { useState } from "react";
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

  const runAction = useActionFromSelection({
    messages,
    setMessages,
    setIsLoading,
    setError,
    isExpanded,
    toggleWindow,
  });

  const handleSummarize = () =>
    runAction((text) => `Сделай краткую выжимку этого текста: \n\n${text}`);

  const handleTranslate = () =>
    runAction(
      (text) =>
        `Переведи этот текст на русский язык, сохранив смысл и стиль: \n\n${text}`,
    );

  const handleExplainCode = () =>
    runAction((text) => `Подробно объясни данный код: \n\n${text}`);

  useShortcut(handleSummarize, "Control+Alt+S");
  useShortcut(handleTranslate, "Control+Alt+T");
  useShortcut(handleExplainCode, "Control+Alt+C");

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
