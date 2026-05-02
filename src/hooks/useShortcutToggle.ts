import { isRegistered, register } from "@tauri-apps/plugin-global-shortcut";
import { useEffect, useRef } from "react";

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
    const setupShortcut = async () => {
      try {
        const registered = await isRegistered(shortcut);
        if (registered) {
          console.log("Shortcut already registered");
          return;
        }

        await register(shortcut, (event) => {
          if (event.state === "Pressed") {
            console.log("pressed");
            toggleRef.current();
          }
        });
      } catch (err) {
        console.error("Shortcut registration failed:", err);
      }
    };
    setupShortcut();
  }, []);
};
