import { create } from "zustand";
import type { Message } from "../types/Message";
import { prompts } from "../data/prompts";
import { AppConfig } from "../types/AppConfig";
import { invoke } from "@tauri-apps/api/core";

interface AppState {
  config: AppConfig;
  isServerReady: boolean;
  isCheckingModel: boolean;
  setConfig: (config: AppConfig) => void;
  loadConfig: () => Promise<void>;
  updateConfig: (partialConfig: Partial<AppConfig>) => void;
  setIsServerReady: (state: boolean) => void;
  setIsCheckingModel: (state: boolean) => void;

  messages: Message[];
  isLoading: boolean;
  error: string;
  isExpanded: boolean;
  isCleared: boolean;
  addMessage: (m: Message) => void;
  setMessages: (ms: Message[]) => void;
  clearMessages: () => void;
  setIsLoading: (state: boolean) => void;
  setError: (e: string) => void;
  setIsExpanded: (state: boolean) => void;
  setIsCleared: (state: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  config: {
    model_path: null,
    icon_path: null,
    api_model: null,
    api_key_masked: null,
  },
  isServerReady: false,
  isCheckingModel: true,
  messages: [
    {
      role: "system",
      content: prompts().systemInit,
    },
  ],
  isLoading: false,
  error: "",
  isExpanded: false,
  isCleared: true,

  // config
  setConfig: (config) => set({ config: config }),
  loadConfig: async () => {
    try {
      const config = await invoke<AppConfig>("get_config");
      set({ config });
    } catch (err) {
      console.error("Failed to load config:", err);
    }
  },
  updateConfig: async (partialConfig) => {
    let updatedConfig = { ...get().config, ...partialConfig };

    if (partialConfig.api_key_masked) {
      await invoke("save_api_key", { key: partialConfig.api_key_masked });
      const masked = `${partialConfig.api_key_masked}`.slice(0, 15) + "...";
      updatedConfig = { ...updatedConfig, api_key_masked: masked };
    }

    set({ config: updatedConfig });

    try {
      await invoke("update_config", { config: updatedConfig });
    } catch (err) {
      console.error("Failed to save config:", err);
    }
  },
  setIsServerReady: (state) => set({ isServerReady: state }),

  // messages
  addMessage: (m) => set((state) => ({ messages: [...state.messages, m] })),
  setMessages: (ms) => set({ messages: ms }),
  clearMessages: () => {
    set({
      messages: [
        {
          role: "system",
          content: prompts().systemInit,
        },
      ],
    });
    set({ isCleared: true });
  },

  //states
  setIsLoading: (state) => set({ isLoading: state }),
  setError: (e) => set({ error: e }),
  setIsExpanded: (state) => set({ isExpanded: state }),
  setIsCleared: (state) => set({ isCleared: state }),
  setIsCheckingModel: (state) => set({ isCheckingModel: state }),
}));
