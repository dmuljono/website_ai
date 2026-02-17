'use client';

import { useEffect, useMemo, useState } from 'react';
import GlassyButton from '@/components/GlassyButton';
import Image from "next/image";


export default function About() {
  const [crows, setCrows] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCrows((prev) => [...prev.slice(-5), Date.now()]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/bg/skyscraper-evening-pixel.png')" }}
    >
      {/* Flapping Crows Layer */}
      <div className="pointer-events-none absolute inset-0 z-20">
        {crows.map((id) => {
          const speed = Math.random() * 4 + 6;
          const top = Math.random() * 60 + 10;
          return <FlappingCrow key={id} speed={speed} top={top} />;
        })}
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen bg-black/60 p-6 relative z-30 gap-6">
        <div className="max-w-xl w-full bg-[#e2dcc5] text-black border-4 border-[#b7ad9b] shadow-[4px_4px_0_rgba(0,0,0,0.4)] p-6 rounded-sm">
          <h2 className="font-['Press_Start_2P'] text-xs text-black mb-4 tracking-tight">
            ▶ About Daniel
          </h2>

          <p className="font-['Press_Start_2P'] text-[10px] leading-relaxed mb-3">
            I&apos;m Daniel Muljono — a 25-year-old tech-driven professional working at DBS Bank through the Graduate Associate Programme.
          </p>

          <p className="font-['Press_Start_2P'] text-[10px] leading-relaxed mb-3">
            I&apos;m passionate about AI, investing, luxury goods, anime, gaming, and golf.
          </p>

          <p className="font-['Press_Start_2P'] text-[10px] leading-relaxed">
            This site&apos;s chatbot reflects my personality — so feel free to ask it anything you&apos;d ask me IRL.
          </p>
        </div>

        <div className="w-full flex justify-center">
          <GlassyButton />
        </div>
      </div>
    </div>
  );
}

function FlappingCrow({ speed, top }: { speed: number; top: number }) {
  const [frame, setFrame] = useState(0);

  // useMemo so frames reference is stable
  const frames = useMemo(() => ['/ui/crow_up.png', '/ui/crow_mid.png', '/ui/crow_down.png'], []);

  useEffect(() => {
    const flap = setInterval(() => {
      setFrame((prev) => (prev + 1) % frames.length);
    }, 150);

    return () => clearInterval(flap);
  }, [frames.length]);

  return (
    <div
      className="absolute w-[48px]"
      style={{
        top: `${top}vh`,
        animation: `crow-fly ${speed}s linear forwards`,
      }}
    >
      <Image
        src={frames[frame]}
        alt="Flapping Crow"
        width={48}
        height={48}
        priority={false}
      />
    </div>
  );
}
