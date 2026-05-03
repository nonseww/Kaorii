import { useEffect, useRef, useState } from "react";
import classes from "./ChatInput.module.scss";
import Chevron from "../../assets/Chevron.svg";
import { Icon } from "../../ui/Icon";

interface Props {
  onSend: (text: string) => void;
  disabled: boolean;
  onClearClicked: () => void;
}

export const ChatInput = ({ onSend, disabled }: Props) => {
  const [text, setText] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText("");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      textareaRef.current?.focus();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={classes.container}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        placeholder="Ask..."
        className={classes.textarea}
        ref={textareaRef}
        autoFocus
      />
      <button
        onClick={handleSend}
        disabled={disabled}
        className={classes.sendButton}
      >
        <Icon src={Chevron} />
      </button>
    </div>
  );
};
