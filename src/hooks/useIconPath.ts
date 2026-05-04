import { open } from "@tauri-apps/plugin-dialog";
import { useAppStore } from "../store/useAppStore";
import { invoke } from "@tauri-apps/api/core";
import { useCallback, useEffect } from "react";

export const useIconPath = () => {
  const store = useAppStore();

  const checkIconPath = useCallback(() => {
    invoke<string>("get_icon_path")
      .then((path) => store.setIconPath(path))
      .catch(() => store.setIconPath(null));
  }, []);

  useEffect(() => {
    checkIconPath();
  }, [checkIconPath]);

  const handleSelectIcon = async () => {
    const selected = await open({
      multiple: false,
      filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg", "svg"] }],
    });

    if (selected && typeof selected === "string") {
      try {
        await invoke("save_icon_path", { path: selected });
        store.setIconPath(selected);
      } catch (err) {
        console.error("Icon save failed:", err);
      }
    }
  };

  return { handleSelectIcon };
};
