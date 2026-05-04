import { useAppStore } from "../store/useAppStore";
import type { Message } from "../types/Message";

interface Props {
  text: string;
  role: "user" | "assistant" | "system";
  temperature: number;
  saveToHistory?: boolean;
}

export const sendRequest = async ({
  text,
  role,
  temperature,
  saveToHistory = true,
}: Props) => {
  if (!text.trim()) return;

  const store = useAppStore.getState();
  const newUserMessage: Message = { role: role, content: text };
  const apiMessages = [...store.messages, newUserMessage];
  if (saveToHistory) {
    store.setMessages(apiMessages);
  } else {
    store.setMessages([...store.messages, { role: "user", content: "" }]);
  }
  store.setIsLoading(true);
  store.setError("");

  try {
    const response = await fetch("http://127.0.0.1:8080/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: apiMessages,
        temperature: temperature,
      }),
    });

    const data = await response.json();
    const aiResponse: Message = {
      role: "assistant",
      content: data.choices[0].message.content,
    };

    store.setMessages(
      saveToHistory
        ? [...apiMessages, aiResponse]
        : [...store.messages, { role: "user", content: "" }, aiResponse],
    );
  } catch (err) {
    store.setError(err instanceof Error ? err.message : String(err));
  } finally {
    store.setIsLoading(false);
  }
};
