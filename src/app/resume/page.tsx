'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Resume() {
  const [blurred, setBlurred] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setBlurred(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  const scrollBox = (img: string, title: string, content: React.ReactNode) => (
    <div className="relative w-full h-[420px] sm:h-[500px]">
      <Image
        src={`/ui/${img}`}
        alt={title}
        fill
        className="object-contain pointer-events-none select-none"
        priority
      />
      <div className="absolute inset-0 flex items-center justify-center px-42 py-8 z-10">
        <div className="w-full max-w-full text-black font-['Press_Start_2P'] text-[10px] leading-relaxed flex flex-col gap-3 overflow-y-auto">
          <h2 className="text-blue-700 mb-2">{title}</h2>
          {content}
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen">
      {/* Animate blur from clear to blurred */}
      <div
        className={`absolute inset-0 bg-cover bg-center z-0 transition-all duration-1000 ease-in-out ${
          blurred ? 'blur-md' : 'blur-none'
        }`}
        style={{ backgroundImage: "url('/bg/yosemite-morning-pixel.png')" }}
      />

      {/* Foreground content */}
      <div className="relative z-10 py-10 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {scrollBox('paper1.png', '🧍 Personal', (
            <>
              <p>I'm Daniel Muljono — a 25-year-old tech-driven individual based in Indonesia.</p>
              <p>I blend fintech, luxury lifestyle, anime, and retro games.</p>
              <p>This site reflects my personal + professional identity.</p>
            </>
          ))}

          {scrollBox('paper2.png', '🎓 Education + Job', (
            <>
              <p>B.S. in Information Systems from UCSD</p>
              <p>Associate at DBS Bank – Graduate Associate Program</p>
              <p>Work: automation tooling, API rollout, GPT integrations</p>
            </>
          ))}

          {scrollBox('paper3.png', '🧪 Projects', (
            <ul className="list-disc pl-8 space-y-1">
              <li>Task triage chatbot (Zustand + GPT)</li>
              <li>Ticket summarizer automation (Python)</li>
              <li>Internal platform refactor (Next.js + Tailwind)</li>
            </ul>
          ))}

          {scrollBox('paper4.png', '🛠 Skills', (
            <ul className="list-disc pl-8 space-y-1">
              <li>Python, JavaScript, SQL</li>
              <li>Next.js, Zustand, TailwindCSS</li>
              <li>Git, Figma, JIRA, DataOps</li>
            </ul>
          ))}
        </div>
       <div className="text-center mt-10">
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block relative w-[360px] h-[90px] mx-auto transition-transform duration-300 hover:scale-105 active:scale-95 "
          >
            {/* Oversized pixel button image for visual effect */}
            <img
              src="/ui/download-button.png"
              alt="Download Resume Button"
              className="w-[500%] h-[500%] object-contain absolute top-7/20 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none animate-[pixel-glow_2s_infinite]"
            />


            {/* Download text */}
            <span className="absolute inset-0 flex items-center justify-center font-['Press_Start_2P'] text-black text-[14px] tracking-tight">
              ▶ Download Resume
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
