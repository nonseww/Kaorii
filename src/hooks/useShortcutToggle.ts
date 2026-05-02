import { useEffect, useRef } from "react";
import { setupShortcut } from "../utils/setupShortcut";

interface Props {
  toggleWindow: () => void;
}

export const useShortcutToggle = ({ toggleWindow }: Props) => {
  const toggleRef = useRef(toggleWindow);

  useEffect(() => {
    toggleRef.current = toggleWindow;
  }, [toggleWindow]);

  useEffect(() => {
    const shortcut = "Control+Alt+O";
    setupShortcut(shortcut, () => {
      toggleRef.current();
    });
  }, []);
};
