'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import DanielPhoneFrame from './DanielPhoneFrame';

export default function ChatBot() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi I'm Daniel-Bot 🤖", id: Date.now() },
    { role: 'assistant', content: 'Feel free to ask me anything!', id: Date.now() + 1 },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const playSound = (type: 'send' | 'received') => {
    const audio = new Audio(`/sounds/message-${type}.mp3`);
    audio.play();
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessage = { role: 'user', content: input, id: Date.now() };
    setMessages((prev) => [...prev, newMessage]);
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
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.reply, id: Date.now() + 2 },
        ]);
        playSound('received');
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
    <div className="w-full max-w-2xl">
      <div
        ref={chatRef}
        className="bg-white text-black rounded-xl shadow-lg h-[400px] overflow-y-auto p-4 space-y-2"
      >
        {messages.map((msg, index) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`px-4 py-2 rounded-xl max-w-[80%] whitespace-pre-line ${
              msg.role === 'user'
                ? 'bg-blue-500 text-white self-end ml-auto'
                : 'bg-gray-200 text-black'
            }`}
          >
            {msg.content}
          </motion.div>
        ))}
        {isLoading && (
          <motion.div
            className="bg-gray-200 text-black px-4 py-2 rounded-xl max-w-[80%]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="animate-pulse">Daniel-Bot is typing...</span>
          </motion.div>
        )}
      </div>
      <div className="flex mt-4 gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 rounded-lg p-2 border border-gray-300 text-white"
          placeholder="Ask me anything..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}
