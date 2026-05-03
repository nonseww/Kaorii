import type { Message } from "../types/Message";

interface Props {
  messages: Message[];
  setMessages: (data: Message[]) => void;
  text: string;
  setError: (err: string) => void;
  setIsLoading: (state: boolean) => void;
  role: "user" | "assistant" | "system";
  temperature: number;
  saveToHistory?: boolean;
}

export const sendRequest = async ({
  messages,
  setMessages,
  text,
  setError,
  setIsLoading,
  role,
  temperature,
  saveToHistory = true,
}: Props) => {
  if (!text.trim()) return;

  const newUserMessage: Message = { role: role, content: text };
  const apiMessages = [...messages, newUserMessage];
  if (saveToHistory) {
    setMessages(apiMessages);
  } else {
    setMessages([...messages, { role: "user", content: "" }]);
  }
  setIsLoading(true);
  setError("");

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

    setMessages(
      saveToHistory
        ? [...apiMessages, aiResponse]
        : [...messages, { role: "user", content: "" }, aiResponse],
    );
  } catch (err) {
    setError(err instanceof Error ? err.message : String(err));
  } finally {
    setIsLoading(false);
  }
};
