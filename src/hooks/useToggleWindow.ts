import { invoke } from "@tauri-apps/api/core";
import { useCallback } from "react";
import { useAppStore } from "../store/useAppStore";

export const useToggleWindow = () => {
  const isExpanded = useAppStore((s) => s.isExpanded);
  const setIsExpanded = useAppStore((s) => s.setIsExpanded);

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
