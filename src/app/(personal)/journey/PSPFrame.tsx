// src/app/journey/PSPFrame.tsx
"use client";
import React from "react";
import Image from "next/image";

type ScreenRect = {
  left: number;   // px offset from the left of the PSP image
  top: number;    // px offset from the top of the PSP image
  width: number;  // px width of the transparent screen hole
  height: number; // px height of the transparent screen hole
  frameWidth: number; // the design pixel width of psp_frame.png
  frameHeight: number; // the design pixel height of psp_frame.png
};

export default function PSPFrame({
  children,
  frameSrc = "/psp/psp_frame.png",
  screenRect,
  className,
}: React.PropsWithChildren<{
  frameSrc?: string;
  screenRect: ScreenRect;
  className?: string;
}>) {
  const { left, top, width, height, frameWidth, frameHeight } = screenRect;

  // Convert the screen rect into percentages so it scales responsively
  const leftPct = (left / frameWidth) * 100;
  const topPct = (top / frameHeight) * 100;
  const wPct = (width / frameWidth) * 100;
  const hPct = (height / frameHeight) * 100;

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "min(100%, 900px)", // responsive max width; tweak as you like
        aspectRatio: `${frameWidth} / ${frameHeight}`, // keep PSP photo’s aspect
      }}
    >
      {/* Your canvas (or whatever) goes UNDER the frame, positioned to the window */}
      <div
        style={{
          position: "absolute",
          left: `${leftPct}%`,
          top: `${topPct}%`,
          width: `${wPct}%`,
          height: `${hPct}%`,
          overflow: "hidden",
        }}
      >
        {/* Make the child stretch to fill the window */}
        <div style={{ width: "100%", height: "100%" }}>{children}</div>
      </div>

      {/* The PSP frame image on top */}
      <Image
        src={frameSrc}
        alt="PSP frame"
        fill
        priority
        sizes="(max-width: 768px) 100vw, 600px"
        style={{
          objectFit: "cover",
          pointerEvents: "none",
          userSelect: "none",
        }}
      />
    </div>
  );
}
