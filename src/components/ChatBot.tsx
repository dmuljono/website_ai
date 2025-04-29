'use client';
const sendSound = typeof window !== 'undefined' ? new Audio('/sounds/message-send.mp3') : null;
const receiveSound = typeof window !== 'undefined' ? new Audio('/sounds/message-received.mp3') : null;


import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatBot() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hellooo, I'm Daniel-Bot 👋" },
    { role: "assistant", content: "Feel free to ask me anything!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    // 🔊 Play send sound
    if (sendSound) {
    sendSound.currentTime = 0;
    sendSound.play();
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) throw new Error(`API error ${res.status}`);

      const data = await res.json();

        // 🔊 Play receive sound
        if (receiveSound) {
        receiveSound.currentTime = 0;
        receiveSound.play();
        }

        setMessages([...newMessages, { role: "assistant", content: data.reply }]);
        setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch (err) {
        console.error("Chat error:", err);
        setMessages([...newMessages, { role: "assistant", content: "Something went wrong 😔" }]);
    } finally {
        setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-[#1e1e1e] rounded-2xl shadow-xl p-6 font-sans">
      <div className="h-96 overflow-y-auto space-y-4 mb-4 px-2">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-gray-700 text-gray-100 rounded-bl-sm'
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="flex justify-start"
          >
            <div className="bg-gray-700 text-gray-300 px-4 py-2 rounded-2xl text-sm animate-pulse">
              Daniel-Bot is typing...
            </div>
          </motion.div>
        )}
      </div>

      <div className="flex">
        <input
          className="flex-1 rounded-l-xl px-4 py-2 bg-[#2a2a2a] text-white border-none focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about Daniel..."
        />
        <button
          className="bg-blue-600 text-white px-5 py-2 rounded-r-xl hover:bg-blue-500"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
