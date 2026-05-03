import type { Message } from "../../types/Message";
import { MessageContent } from "../MessageContent";
import { ChatInput } from "../ChatInput";
import classes from "./Chat.module.scss";
import Thinking from "../../assets/thinking-light.svg";
import { useScrollToBottom } from "../../hooks/useScrollToBottom";
import { Modal } from "../../ui/Modal";
import { useState } from "react";

interface ChatProps {
  isServerReady: boolean;
  messages: Message[];
  isLoading: boolean;
  error: string;
  sendMessage: (text: string) => void;
  onClick: () => void;
  onClear: () => void;
}

export const Chat = ({
  isServerReady,
  messages,
  isLoading,
  error,
  sendMessage,
  onClick,
  onClear,
}: ChatProps) => {
  const { ref } = useScrollToBottom(messages, "auto");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div onDoubleClick={onClick} className={classes.mainWindow}>
        <div className={classes.chat} ref={ref}>
          {messages
            .filter((m) => m.role !== "system" && m.content)
            .map((m, i) => (
              <div
                key={i}
                className={`${classes.messageWrapper} ${m.role === "user" ? classes.userMessage : classes.aiMessage}`}
              >
                <MessageContent content={m.content} />
              </div>
            ))}
          {isLoading && <img src={Thinking} className={classes.thinking} />}
        </div>
        <ChatInput
          onSend={(text) => sendMessage(text)}
          disabled={isLoading || !isServerReady}
          onClearClicked={() => setIsModalOpen(true)}
        />
        {error && <div>{error}</div>}
      </div>
      {isModalOpen && (
        <Modal
          title="Confirm"
          text="Are you sure that you want to clear this chat?"
          onClose={() => setIsModalOpen(false)}
          onCancel={() => setIsModalOpen(false)}
          onSubmit={onClear}
        />
      )}
    </>
  );
};
