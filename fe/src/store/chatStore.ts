import { ChatbotChatType } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const chatbotStore = create<ChatbotChatType>()(
  persist(
    (set) => ({
      messages: [],

      setMessages: (messages) =>
        set((state) => ({
          messages:
            typeof messages === "function"
              ? messages(state.messages)
              : messages,
        })),
    }),
    {
      name: "chatbot-messages", // sessionStorage key
      storage: {
        getItem: (name) => {
          const value = sessionStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name);
        },
      },
    }
  )
);
