import { useState, useEffect } from "react";
import { Command } from "@tauri-apps/plugin-shell";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import type { Message } from "./types/Message";
import { Chat } from "./components/Chat";
import { SmallWidget } from "./components/SmallWidget";

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content:
        "Ты - универсальный ИИ-помощник. Отвечай вежливо и развернуто. Говори на том языке, который пользователь использует больше всего",
    },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isServerReady, setIsServerReady] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const toggleWindow = async () => {
    const nextState = !isExpanded;
    try {
      await invoke("resize_window", { expanded: nextState });
      setIsExpanded(nextState);
    } catch (error) {
      console.error("Resize error: ", error);
    }
  };

  const checkServerHealth = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8080/health");
      return response.status === 200;
    } catch (error) {
      return false;
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const newUserMessage: Message = { role: "user", content: text };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8080/v1/chat/completions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: updatedMessages,
            temperature: 0.4,
          }),
        },
      );

      const data = await response.json();
      const aiResponse: Message = {
        role: "assistant",
        content: data.choices[0].message.content,
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (err) {
      setError(err as string);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const startLlamaServer = async () => {
      const modelPath = await invoke<string>("get_model_path");

      const command = Command.sidecar("binaries/llama-server", [
        "-m",
        modelPath,
        "--port",
        "8080",
        "-ngl",
        "99",
        "--host",
        "127.0.0.1",
      ]);

      command.stdout.on("data", (line) => console.log("LLAMA LOG:", line));
      command.stderr.on("data", (line) => console.error("LLAMA ERROR:", line));

      command.on("close", (data) =>
        console.log(`Server is closed with ${data.code}`),
      );
      command.on("error", (error) => console.error(`Process error: ${error}`));

      const child = await command.spawn();
      console.log("PID:", child.pid);
    };

    startLlamaServer();

    const healthCheckInterval = setInterval(async () => {
      const isHealthy = await checkServerHealth();
      setIsServerReady(isHealthy);
    }, 2000);
    return () => clearInterval(healthCheckInterval);
  }, []);

  return (
    <>
      {isExpanded ? (
        <Chat
          isServerReady={isServerReady}
          messages={messages}
          isLoading={isLoading}
          error={error}
          sendMessage={sendMessage}
          onClick={toggleWindow}
        />
      ) : (
        <SmallWidget onClick={toggleWindow} />
      )}
    </>
  );
}

export default App;
