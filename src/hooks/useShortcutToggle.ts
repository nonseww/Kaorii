import { useEffect, useRef } from "react";
import { setupShortcut } from "../utils/setupShortcut";
import { shortcuts } from "../data/shortcuts";

interface Props {
  toggleWindow: () => void;
}

export const useShortcutToggle = ({ toggleWindow }: Props) => {
  const toggleRef = useRef(toggleWindow);

  useEffect(() => {
    toggleRef.current = toggleWindow;
  }, [toggleWindow]);

  useEffect(() => {
    setupShortcut(shortcuts.toggleWindow, () => {
      toggleRef.current();
    });
  }, []);
};
