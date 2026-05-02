import type { Message } from "../../types/Message";
import { MessageContent } from "../MessageContent";
import { ChatInput } from "../ChatInput";
import classes from "./Chat.module.scss";

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
  return (
    <div onClick={onClick} className={classes.mainWindow}>
      <h1>LLM_Helper!</h1>
      <h2>{isServerReady ? "Server is ready!" : "Wait..."}</h2>
      <div>
        {messages
          .filter((m) => m.role !== "system")
          .map((m, i) => (
            <div
              key={i}
              style={{
                textAlign: m.role === "user" ? "right" : "left",
                marginBottom: "10px",
              }}
            >
              <MessageContent content={m.content} />
            </div>
          ))}
        {isLoading && <p>Thinking...</p>}
      </div>
      <ChatInput onSend={(text) => sendMessage(text)} disabled={isLoading} />
      {error && <div>{error}</div>}
    </div>
  );
};
