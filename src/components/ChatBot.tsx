'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import DanielPhoneFrame from './DanielPhoneFrame';
import { useChatStore, Message } from '@/context/useChatStore';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function getOrCreateSessionId() {
  const key = "dt_session_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

export default function ChatBot() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const messages = useChatStore((state) => state.messages);
  const addMessage = useChatStore((state) => state.addMessage);
  const setMessages = useChatStore((state) => state.setMessages); // ✅ ADD THIS
  const [statusText, setStatusText] = useState("Daniel-Bot is typing...");

  // ✅ ADD THIS: Load history on mount
  useEffect(() => {
    const sessionId = getOrCreateSessionId();

    (async () => {
      try {
        const res = await fetch(`/api/history?sessionId=${encodeURIComponent(sessionId)}`);
        const data = await res.json();

        const restored: Message[] = (data.history ?? []).flatMap((x: any, i: number) => [
          { role: "user", content: x.user, id: Date.now() + i * 2 },
          { role: "assistant", content: x.assistant, id: Date.now() + i * 2 + 1 },
        ]);

        if (restored.length) setMessages(restored);
      } catch (e) {
        console.error("Failed to load history:", e);
      }
    })();
  }, [setMessages]);

  // Typing Hmm sound loop
  useEffect(() => {
    if (isLoading) {
      const audio = new Audio('/sounds/minecraft-villager-sound-effect.mp3');
      audio.volume = 0.15; // 0–1
      audio.play();
    }
  }, [isLoading]);

  const playSound = (type: 'send' | 'receive') => {
    const file = type === 'send' ? 'message-send' : 'message-received';
    new Audio(`/sounds/${file}.mp3`).play();
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const sessionId = getOrCreateSessionId(); // ✅ ADD THIS

    const newMessage: Message = {
      role: 'user',
      content: input,
      id: Date.now()
    };

    addMessage(newMessage);
    playSound('send');
    setInput('');
    setIsLoading(true);
    setStatusText("Starting…");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // ✅ CHANGE THIS: include sessionId
        body: JSON.stringify({ messages: [...messages, newMessage], sessionId }),
      });

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No stream");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";

        for (const part of parts) {
          const lines = part.split("\n");
          const event =
            lines.find((l) => l.startsWith("event:"))?.replace("event:", "").trim() ?? "";
          const dataLine = lines.find((l) => l.startsWith("data:"));
          if (!dataLine) continue;

          const data = JSON.parse(dataLine.replace("data:", "").trim());

          if (event === "status") {
            setStatusText(data.text);
          }

          if (event === "final") {
            addMessage({
              role: "assistant",
              content: data.text,
              id: Date.now() + 1,
            });
            playSound("receive");
            setIsLoading(false);
          }

          if (event === "error") {
            throw new Error(data.text || "Stream error");
          }
        }
      }
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="w-full max-w-2xl font-['Press_Start_2P'] text-[10px] text-gray-100">
      <DanielPhoneFrame isTalking={isLoading} />

      {/* Chat Box */}
      <div
        ref={chatRef}
        className="bg-[#0f172a] border-4 border-[#334155] rounded-sm h-[400px] overflow-y-auto p-4 space-y-4 shadow-[4px_4px_0px_rgba(0,0,0,0.7)]"
      >
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`
              px-4 py-3 w-fit max-w-[80%] whitespace-pre-line leading-tight rounded-none border-4
              ${msg.role === 'user'
                ? 'bg-[#2c2f70] text-white border-[#1a1c44] self-end ml-auto shadow-[3px_3px_0px_rgba(0,0,0,0.7)]'
                : 'bg-[#e2dcc5] text-black border-[#b7ad9b] shadow-[3px_3px_0px_rgba(0,0,0,0.4)]'}
            `}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {msg.content}
            </ReactMarkdown>
          </motion.div>
        ))}

        {isLoading && (
          <motion.div
            className="bg-[#e2dcc5] text-black px-4 py-2 w-fit border-4 border-[#b7ad9b] shadow-[3px_3px_0px_rgba(0,0,0,0.4)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="animate-pulse">{statusText}</span>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="flex mt-4 gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Say something..."
          className="flex-1 px-3 py-2 bg-[#111827] text-white border-4 border-[#334155] placeholder-gray-500 shadow-inner rounded-none font-mono tracking-tight"
        />
        <button
          onClick={handleSend}
          className="bg-[#2c2f70] border-4 border-[#1a1c44] px-3 py-2 text-white rounded-none shadow-[2px_2px_0px_rgba(0,0,0,0.6)] hover:brightness-110"
        >
          Send
        </button>
      </div>
    </div>
  );
}
