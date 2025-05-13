'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import DanielPhoneFrame from './DanielPhoneFrame';
import { useChatStore, Message } from '@/context/useChatStore';

export default function ChatBot() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const messages = useChatStore((state) => state.messages);
  const addMessage = useChatStore((state) => state.addMessage);

  // Typing blip sound loop
  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;

    if (isLoading) {
      const playRandomBeep = () => {
        new Audio('/sounds/iphone-blip.mp3').play();
        const delay = 300 + Math.random() * 400;
        timeout = setTimeout(playRandomBeep, delay);
      };
      playRandomBeep();
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isLoading]);

  const playSound = (type: 'send' | 'receive') => {
    const file = type === 'send' ? 'message-send' : 'message-received';
    new Audio(`/sounds/${file}.mp3`).play();
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      role: 'user',
      content: input,
      id: Date.now()
    };

    addMessage(newMessage);
    playSound('send');
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ messages: [...messages, newMessage] }),
      });
      const data = await res.json();

      if (data?.reply) {
        addMessage({
          role: 'assistant',
          content: data.reply,
          id: Date.now() + 1,
        });
        playSound('receive');
      } else {
        throw new Error('No reply from server');
      }
    } catch (err) {
      console.error('Chat error:', err);
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
            {msg.content}
          </motion.div>
        ))}

        {isLoading && (
          <motion.div
            className="bg-[#e2dcc5] text-black px-4 py-2 w-fit border-4 border-[#b7ad9b] shadow-[3px_3px_0px_rgba(0,0,0,0.4)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="animate-pulse">Daniel-Bot is typing...</span>
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
