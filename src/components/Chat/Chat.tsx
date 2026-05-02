import type { Message } from "../../types/Message";
import { MessageContent } from "../MessageContent";
import { ChatInput } from "../ChatInput";
import classes from "./Chat.module.scss";
import { useDragWindow } from "../../hooks/useDragWindow";

interface ChatProps {
  isServerReady: boolean;
  messages: Message[];
  isLoading: boolean;
  error: string;
  sendMessage: (text: string) => void;
  onClick: () => void;
}

export const Chat = ({
  isServerReady,
  messages,
  isLoading,
  error,
  sendMessage,
  onClick,
}: ChatProps) => {
  const { handleMouseDown, handleMouseMove, handleMouseUp } = useDragWindow();

  return (
    <div
      onDoubleClick={onClick}
      className={classes.mainWindow}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <h1 className={classes.title}>LLM_Helper is here :)</h1>
      <div className={classes.chat}>
        {messages
          .filter((m) => m.role !== "system")
          .map((m, i) => (
            <div
              key={i}
              className={`${classes.messageWrapper} ${m.role === "user" ? classes.userMessage : classes.aiMessage}`}
            >
              <MessageContent content={m.content} />
            </div>
          ))}
        {isLoading && <p>Thinking...</p>}
      </div>
      <ChatInput
        onSend={(text) => sendMessage(text)}
        disabled={isLoading || !isServerReady}
      />
      {error && <div>{error}</div>}
    </div>
  );
};
