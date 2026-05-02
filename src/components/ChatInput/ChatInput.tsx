import { useState } from "react";
import classes from "./ChatInput.module.scss";
import classNames from "classnames";

interface Props {
  onSend: (text: string) => void;
  disabled: boolean;
  onClearClicked: () => void;
}

export const ChatInput = ({ onSend, disabled, onClearClicked }: Props) => {
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
      <div className={classes.buttonsContainer}>
        <button
          onClick={onClearClicked}
          disabled={disabled}
          className={classNames(classes.button, classes.secondButton)}
        >
          Clear
        </button>
        <button
          onClick={handleSend}
          disabled={disabled}
          className={classes.button}
        >
          Send
        </button>
      </div>
    </div>
  );
};
