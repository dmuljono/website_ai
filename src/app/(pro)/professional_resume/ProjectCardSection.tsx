"use client";

import dynamic from "next/dynamic";

const ProCardCSS = dynamic(() => import("./ProCardCSS"), { ssr: false });

export default function ProjectCardSection() {
  return (
    <section className="relative w-full h-[100vh] flex items-center justify-center overflow-hidden">

      {/* Rotated Teal Fintech Lava Plate */}
      <div className="absolute inset-0 z-0 transform rotate-45 scale-125 rounded-[2rem] overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.8)]">

        {/* Base graphite */}
        

        {/* Animated blobs */}
        {/* Blob A */}
        <div className="absolute inset-0 flex items-center justify-center blob-a-wrapper z-10">
          <div className="w-[700px] h-[700px] rounded-full blur-3xl opacity-40 mix-blend-screen bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.6),transparent_70%)]" />
        </div>


        {/* Blob B */}
        <div className="absolute inset-0 flex items-center justify-center blob-b-wrapper z-10">
          <div className="w-[900px] h-[900px] rounded-full blur-3xl opacity-25 mix-blend-screen bg-[radial-gradient(circle_at_center,rgba(255,0,60,0.7),transparent_70%)]" />
        </div>


        {/* Blob C */}
        <div className="absolute inset-0 flex items-center justify-center blob-c-wrapper z-10">
          <div className="w-[900px] h-[900px] rounded-full blur-3xl opacity-25 mix-blend-screen bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.7),transparent_70%)]" />
        </div>


        {/* Dark wash for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/70" />
      </div>

      {/* Upright Content */}
      <div className="relative z-10 w-full h-[100vh] flex items-center justify-center rotate-45">
        <ProCardCSS />
      </div>

    </section>
  );
}
