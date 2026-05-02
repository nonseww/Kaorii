import type { Message } from "../types/Message";

interface Props {
  messages: Message[];
  setMessages: (data: Message[]) => void;
  text: string;
  setError: (err: string) => void;
  setIsLoading: (state: boolean) => void;
}

export const sendRequest = async ({
  messages,
  setMessages,
  text,
  setError,
  setIsLoading,
}: Props) => {
  if (!text.trim()) return;

  const newUserMessage: Message = { role: "user", content: text };
  const updatedMessages = [...messages, newUserMessage];
  setMessages(updatedMessages);
  setIsLoading(true);
  setError("");

  try {
    const response = await fetch("http://127.0.0.1:8080/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: updatedMessages,
        temperature: 0.4,
      }),
    });

    const data = await response.json();
    const aiResponse: Message = {
      role: "assistant",
      content: data.choices[0].message.content,
    };

    setMessages([...updatedMessages, aiResponse]);
  } catch (err) {
    setError(err as string);
  } finally {
    setIsLoading(false);
  }
};
