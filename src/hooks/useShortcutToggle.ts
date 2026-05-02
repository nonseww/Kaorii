import { register } from "@tauri-apps/plugin-global-shortcut";
import { useEffect } from "react";

interface Props {
  toggleWindow: () => void;
  isExpanded: boolean;
}

export const useShortcutToggle = ({ toggleWindow, isExpanded }: Props) => {
  useEffect(() => {
    const setupShortcut = async () => {
      try {
        await register("Super+Alt+O", (event) => {
          if (event.state === "Pressed") {
            toggleWindow();
          }
        });
      } catch (err) {
        console.error("Shortcut registration failed:", err);
      }
    };
    setupShortcut();
  }, [isExpanded]);
};
