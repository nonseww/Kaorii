import { useEffect, useRef } from "react";
import { setupShortcut } from "../utils/setupShortcut";

export const useShortcutSummarize = (onTrigger: () => void) => {
  const onTriggerRef = useRef(onTrigger);

  useEffect(() => {
    onTriggerRef.current = onTrigger;
  }, [onTrigger]);

  useEffect(() => {
    const shortcut = "Control+Alt+S";

    setupShortcut(shortcut, () => {
      onTriggerRef.current();
    });
  }, []);
};
