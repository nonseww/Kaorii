import { useState } from "react";
import classes from "./ChatInput.module.scss";

interface Props {
  onSend: (text: string) => void;
  disabled: boolean;
}

export const ChatInput = ({ onSend, disabled }: Props) => {
  const [text, setText] = useState<string>("");
  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText("");
    }
  };

  return (
    <div className={classes.container}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder="Ask..."
        className={classes.textarea}
      />
      <button
        onClick={handleSend}
        disabled={disabled}
        className={classes.button}
      >
        Send
      </button>
    </div>
  );
};
