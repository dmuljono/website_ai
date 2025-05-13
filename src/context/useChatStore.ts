import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  id: number;
}

interface ChatState {
  messages: Message[];
  addMessage: (msg: Message) => void;
  setMessages: (msgs: Message[]) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [
        {
          role: 'assistant',
          content: "Hi I'm Daniel-Bot 🤖",
          id: Date.now(),
        },
        {
          role: 'assistant',
          content: 'Feel free to ask me anything!',
          id: Date.now() + 1,
        },
      ],
      addMessage: (msg) =>
        set((state) => ({
          messages: [...state.messages, msg],
        })),
      setMessages: (msgs) => set({ messages: msgs }),
      clearMessages: () => set({ messages: [] }),
    }),
    {
      name: 'chat-storage', // key in localStorage
    }
  )
);
