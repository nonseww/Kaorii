import { useEffect, useRef } from "react";
import { setupShortcut } from "../utils/setupShortcut";

export const useShortcut = (onTrigger: () => void, shortcut: string) => {
  const onTriggerRef = useRef(onTrigger);

  useEffect(() => {
    onTriggerRef.current = onTrigger;
  }, [onTrigger]);

  useEffect(() => {
    setupShortcut(shortcut, () => {
      onTriggerRef.current();
    });
  }, [shortcut]);
};
