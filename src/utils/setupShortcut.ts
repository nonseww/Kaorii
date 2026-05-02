import { isRegistered, register } from "@tauri-apps/plugin-global-shortcut";

export const setupShortcut = async (shortcut: string, onPress: () => void) => {
  try {
    const registered = await isRegistered(shortcut);
    if (registered) {
      console.log("Shortcut already registered");
      return;
    }

    await register(shortcut, (event) => {
      if (event.state === "Pressed") {
        onPress();
      }
    });
  } catch (err) {
    console.error("Shortcut registration failed:", err);
  }
};
