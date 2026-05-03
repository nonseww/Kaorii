import { MessageContent } from "../MessageContent";
import { ChatInput } from "../ChatInput";
import classes from "./Chat.module.scss";
import Thinking from "../../assets/thinking-light.svg";
import { useScrollToBottom } from "../../hooks/useScrollToBottom";
import { Modal } from "../../ui/Modal";
import { useEffect, useState } from "react";
import { WindowBar } from "../WindowBar";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { Settings } from "../Settings";
import { useAppStore } from "../../store/useAppStore";
import { useAppActions } from "../../hooks/useAppActions";

interface ChatProps {
  handleSelectModel: () => Promise<boolean | void> | void;
  toggleWindow: () => void;
}

export const Chat = ({ handleSelectModel, toggleWindow }: ChatProps) => {
  const store = useAppStore();
  const { ref } = useScrollToBottom("auto");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const appWindow = getCurrentWindow();
  const { sendMessage } = useAppActions();

  const handleClose = async () => {
    await appWindow.close();
  };

  useEffect(() => {
    if (store.modelPath === null) {
      store.setError("> Invalid model path. Please, choice Model in Tools");
    } else {
      store.setError("");
    }
  }, [store.modelPath]);

  return (
    <>
      <div className={classes.mainWindow}>
        <WindowBar
          onMinimazeClick={toggleWindow}
          onCloseClick={handleClose}
          onSettings={() => setIsSettingsOpen((prev) => !prev)}
          onRestartChat={() => setIsModalOpen(true)}
        />
        {isSettingsOpen ? (
          <Settings handleSelectModel={handleSelectModel} />
        ) : (
          <>
            <div className={classes.chat} ref={ref}>
              {store.messages
                .filter((m) => m.role !== "system" && m.content)
                .map((m, i) => (
                  <div
                    key={i}
                    className={`${classes.messageWrapper} ${m.role === "user" ? classes.userMessage : classes.aiMessage}`}
                  >
                    <MessageContent content={m.content} />
                  </div>
                ))}
              {store.isLoading && (
                <img src={Thinking} className={classes.thinking} />
              )}
            </div>
            {store.error && <div className={classes.error}>{store.error}</div>}
            <ChatInput
              onSend={(text) => sendMessage(text)}
              disabled={
                store.isLoading || !store.isServerReady || !!store.error
              }
              onClearClicked={() => setIsModalOpen(true)}
            />
          </>
        )}
      </div>
      {isModalOpen && (
        <Modal
          title="Confirm"
          text="Are you sure that you want to clear this chat?"
          onClose={() => setIsModalOpen(false)}
          onCancel={() => setIsModalOpen(false)}
          onSubmit={store.clearMessages}
        />
      )}
    </>
  );
};
