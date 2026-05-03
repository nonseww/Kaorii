import { create } from "zustand";
import type { Message } from "../types/Message";
import { prompts } from "../data/prompts";

interface AppState {
  modelPath: string | null;
  isServerReady: boolean;
  isCheckingModel: boolean;
  setModelPath: (path: string | null) => void;
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

export const useAppStore = create<AppState>((set) => ({
  modelPath: null,
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

  setModelPath: (path) => set({ modelPath: path }),
  setIsServerReady: (state) => set({ isServerReady: state }),
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
  setIsLoading: (state) => set({ isLoading: state }),
  setError: (e) => set({ error: e }),
  setIsExpanded: (state) => set({ isExpanded: state }),
  setIsCleared: (state) => set({ isCleared: state }),
  setIsCheckingModel: (state) => set({ isCheckingModel: state }),
}));
