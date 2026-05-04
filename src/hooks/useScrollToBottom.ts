import { useEffect, useRef } from "react";
import { useAppStore } from "../store/useAppStore";

export const useScrollToBottom = (type: "auto" | "smooth") => {
  const ref = useRef<HTMLDivElement>(null);
  const messages = useAppStore((s) => s.messages);

  const scrollToBottom = () => {
    if (ref.current) {
      ref.current.scrollTo({
        top: ref.current.scrollHeight,
        behavior: type,
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return { ref };
};
