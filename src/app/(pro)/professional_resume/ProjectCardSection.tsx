"use client";

import dynamic from "next/dynamic";

const ProCardCSS = dynamic(() => import("./ProCardCSS"), { ssr: false });
// const ScrollFlipCardScene = dynamic(() => import("./ScrollFlipCardScene"), { ssr: false });

export default function ProjectCardSection() {
  return (
    <section className="relative w-full h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Rotated background block */}
      <div className="absolute inset-0 z-0 transform rotate-45 bg-[#1a1a1a] rounded-[2rem] shadow-xl scale-125" />

      {/* Upright content on top */}
      <div className="relative w-full h-[100vh] flex items-center justify-center overflow-hidden rotate-45">
        <ProCardCSS />
      </div>

      {/* Optional WebGL version (commented out) */}
      {/*
      <section className="relative h-[160vh] !overflow-visible">
        <div className="sticky top-0 h-screen !overflow-visible">
          <ScrollFlipCardScene />
        </div>
      </section>
      */}
    </section>
  );
}
