"use client";
import React, { useEffect, useRef, useState } from "react";
import { VIEW } from "./engine/constants";
import { createInitialState, stepUpdate } from "./engine/game";
import { drawFrame } from "./engine/draw";
import { loadThemeImages } from "./engine/assets";
import THEME from "./engine/theme";

export default function JourneyGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // UI state
  const [paused, setPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [debug, setDebug] = useState(false);
  const [showTouch, setShowTouch] = useState(true);

  // Refs mirrored for the loop
  const pausedRef = useRef(false);
  const gameOverRef = useRef(false);
  const debugRef = useRef(false);
  useEffect(() => { pausedRef.current = paused; }, [paused]);
  useEffect(() => { gameOverRef.current = gameOver; }, [gameOver]);
  useEffect(() => { debugRef.current = debug; }, [debug]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const state = createInitialState();
    const input: Record<string, boolean> = {};

    loadThemeImages(THEME);

    function restart() {
      const fresh = createInitialState();
      Object.assign(state, fresh);
      setGameOver(false);
      setPaused(false);
    }

    const onKey = (e: KeyboardEvent, down: boolean) => {
      const code = e.code;
      if (["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Space","KeyA","KeyD","KeyS"].includes(code)) e.preventDefault();
      input[code] = down;

      if (down && code === "Enter" && gameOverRef.current) restart();
      if (down && code === "KeyP") setPaused(p => !p);
    };

    const keydownHandler = (e: KeyboardEvent) => onKey(e, true);
    const keyupHandler   = (e: KeyboardEvent) => onKey(e, false);
    window.addEventListener("keydown", keydownHandler);
    window.addEventListener("keyup", keyupHandler);

    let raf = 0;
    let last = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;

      if (!pausedRef.current && !gameOverRef.current) {
        stepUpdate(
          state,
          input,
          dt,
          (over) => {
            if (over) {
              state.gameOver = true;
              setGameOver(true);
            }
          }
        );
      }

      drawFrame(ctx, state, THEME, debugRef.current);
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", keydownHandler);
      window.removeEventListener("keyup", keyupHandler);
    };
  }, []);

  // ── PSP frame & screen-hole measurements (from your PNG) ─────────────
  const frameW = 1152;
  const frameH = 768;
  const holeLeft = 256;
  const holeTop = 160;
  const holeW = 640;
  const holeH = 384;

  const leftPct = (holeLeft / frameW) * 100;
  const topPct  = (holeTop  / frameH) * 100;
  const wPct    = (holeW    / frameW) * 100;
  const hPct    = (holeH    / frameH) * 100;

  return (
    <div className="relative min-h-screen w-full bg-gray-800 flex flex-col items-center py-6 gap-4 font-['Press_Start_2P']">
      {/* BG LAYERS (z-0) */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/journey/bg-room.png')" }}
      />
      <div className="absolute inset-0 z-0 bg-black/40" />

      {/* 🌧️ Rain overlay: fixed px on small screens, % on sm+ */}
      <div
        className={`
          absolute pointer-events-none overflow-hidden z-0
          left-[0px] top-[0px] w-[600px] h-[400px]
          sm:left-[25%] sm:top-[0%] sm:w-[55%] sm:h-[47%]
        `}
        style={{
          backgroundImage: `
            url('/journey/rain-streak.png'),
            url('/journey/rain-streak2.png')
          `,
          backgroundRepeat: "repeat",
          backgroundSize: "32px 64px, 48px 96px",
          animation: "rainScroll 5s linear infinite, rainScroll2 8s linear infinite",
          opacity: 0.8,
          filter: "blur(2px)",
        }}
      />

      {/* FOREGROUND CONTENT (z-10) */}
      <div className="relative z-10 min-h-screen w-full flex flex-col items-center py-6 gap-4">
        {/* Title row */}
        <div>
          <h1 className="text-xl font-semibold text-white">My Journey</h1>
        </div>
        
        {/* Buttons row */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPaused(p => !p)}
            className="px-3 py-1 rounded-2xl border border-white text-white bg-transparent text-sm font-['Press_Start_2P']"
          >
            {paused ? "Resume" : "Pause (P)"}
          </button>
          <button
            onClick={() => setShowTouch(s => !s)}
            className="px-3 py-1 rounded-2xl border border-white text-white bg-transparent text-sm font-['Press_Start_2P']"
          >
            {showTouch ? "Hide" : "Show"} Touch
          </button>
          <button
            onClick={() => setDebug(d => !d)}
            className="px-3 py-1 rounded-2xl border border-white text-white bg-transparent text-sm font-['Press_Start_2P']"
          >
            Debug: {debug ? "On" : "Off"}
          </button>
        </div>

        {/* PSP FRAME WRAPPER */}
        <div
          style={{
            position: "relative",
            width: "min(100%, 1000px)",
            aspectRatio: `${frameW} / ${frameH}`,
          }}
        >
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
            <canvas
              ref={canvasRef}
              width={VIEW.width}
              height={VIEW.height}
              style={{ width: "100%", height: "100%", display: "block" }}
            />
          </div>

          <img
            src="/psp/psp_frame.png"
            alt="PSP frame"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              pointerEvents: "none",
              userSelect: "none",
            }}
          />
        </div>

        {showTouch && (
          <div className="flex gap-6">
            <TouchButton
              iconSrc="/controls/left.png"
              label="Move left"
              onPress={(held) => ((window as any)._leftHeld = held)}
            />
            <TouchButton
              iconSrc="/controls/right.png"
              label="Move right"
              onPress={(held) => ((window as any)._rightHeld = held)}
            />
            <TouchButton
              iconSrc="/controls/jump.png"
              label="Jump"
              onPress={(held) => ((window as any)._jumpHeld = held)}
            />
          </div>
        )}

        {/* Controls table */}
        <div className="text-sm text-white font-['Press_Start_2P']">
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 border border-white rounded-md p-3">
            <span>A / ←</span>      <span>Move left</span>
            <span>D / →</span>      <span>Move right</span>
            <span>Space / ↑</span>  <span>Jump</span>
            <span>Enter</span>      <span>Restart</span>
            <span>P</span>          <span>Pause</span>
          </div>
        </div>
      </div>

      {/* keyframes */}
      <style jsx global>{`
        @keyframes rainScroll {
          from { background-position: 0 -100%; }
          to   { background-position: 0 100%; }
        }
        @keyframes rainScroll2 {
          from { background-position: -50px -100%; }
          to   { background-position: 50px 100%; }
        }
      `}</style>
    </div>
  );
}

function TouchButton({
  iconSrc,
  label,
  onPress,
  size = 80,
}: {
  iconSrc: string;
  label: string;
  onPress: (held: boolean) => void;
  size?: number;
}) {
  const [held, setHeld] = useState(false);

  useEffect(() => {
    (window as any)._leftHeld ??= false;
    (window as any)._rightHeld ??= false;
    (window as any)._jumpHeld ??= false;
  }, []);

  const pressDown = (e?: React.SyntheticEvent) => { e?.preventDefault?.(); setHeld(true); onPress(true); };
  const pressUp   = (e?: React.SyntheticEvent) => { e?.preventDefault?.(); setHeld(false); onPress(false); };

  return (
    <button
      aria-label={label}
      className={`rounded-full bg-black shadow relative overflow-hidden active:scale-95 ${
        held ? "ring-2 ring-black/20" : ""
      }`}
      style={{ width: size, height: size }}
      onMouseDown={pressDown}
      onMouseUp={pressUp}
      onMouseLeave={pressUp}
      onTouchStart={pressDown}
      onTouchEnd={pressUp}
    >
      <img
        src={iconSrc}
        alt=""
        draggable={false}
        style={{
          position: "absolute",
          inset: 0,
          margin: "auto",
          maxWidth: "101%",
          maxHeight: "101%",
          objectFit: "contain",
          pointerEvents: "none",
          userSelect: "none",
        }}
      />
    </button>
  );
}
