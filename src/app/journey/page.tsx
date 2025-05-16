// /src/app/journey/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Journey() {
  const sections = [
    { left: 200, text: "Hi, I'm Daniel. This world reflects my story." },
    { left: 800, text: "🎓 Graduated in Information Systems, passionate about product & design." },
    { left: 1600, text: "💼 Associate @ DBS Bank, driving automation and AI projects." },
    { left: 2400, text: "🎮 Gamer, pixel art lover, retro vibe collector." }
  ];

  const [scrollX, setScrollX] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollX(window.scrollX);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative w-[4000px] h-screen overflow-x-scroll bg-sky-400">
      {/* Parallax layers */}
      <div
        className="absolute inset-0 z-0 bg-repeat-x"
        style={{
          backgroundImage: "url('/bg/beach.png')",
          backgroundSize: "contain",
          transform: `translateX(-${scrollX * 0.2}px)`
        }}
      />
      <div
        className="absolute inset-0 z-10 bg-repeat-x"
        style={{
          backgroundImage: "url('/bg/palmtrees.png')",
          backgroundSize: "contain",
          transform: `translateX(-${scrollX * 0.4}px)`
        }}
      />
      {/* Ground */}
      <div className="absolute bottom-0 left-0 w-full h-[100px] bg-green-700 z-30" />

      {/* Mario sprite */}
      <div
        className="fixed bottom-[100px] left-[80px] z-40 transition-transform duration-100"
        style={{ transform: `translateX(${scrollX}px)` }}
      >
        <Image src="/ui/mario.png" alt="Mario" width={48} height={48} />
      </div>

      {/* Info boxes */}
      {sections.map((s, i) => (
        <div
          key={i}
          className="absolute bottom-[160px] w-[300px] bg-yellow-200 border border-black p-2 font-['Press_Start_2P'] text-[10px] z-50"
          style={{ left: `${s.left}px` }}
        >
          {s.text}
        </div>
      ))}
    </div>
  );
}
