import { invoke } from "@tauri-apps/api/core";
import { useCallback } from "react";

interface Props {
  isExpanded: boolean;
  setIsExpanded: (state: boolean) => void;
}

export const useToggleWindow = ({ isExpanded, setIsExpanded }: Props) => {
  return useCallback(async () => {
    const nextState = !isExpanded;
    try {
      await invoke("resize_window", { expanded: nextState });
      setIsExpanded(nextState);
    } catch (error) {
      console.error("Resize error: ", error);
    }
  }, [isExpanded, setIsExpanded]);
};
