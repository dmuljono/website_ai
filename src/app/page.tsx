'use client';

import ChatBot from '@/components/ChatBot';

export default function Home() {
  return (
    <div
      className="min-h-screen bg-[#0c0e1c] bg-cover bg-bottom"
      style={{ backgroundImage: "url('/bg-night-pixel.png')" }}
    >
      <main className="flex flex-col items-center justify-center min-h-screen bg-black/60 p-4">
        <h1 className="text-sm font-['Press_Start_2P'] text-white mb-6 tracking-tight drop-shadow-[1px_1px_0_rgba(0,0,0,0.8)]">
          ▶ Say Hello to Daniel-Bot
        </h1>
        <ChatBot />
      </main>
    </div>
  );
}
