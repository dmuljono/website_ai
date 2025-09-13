"use client";
import React, { useEffect, useRef, useState } from "react";
import { VIEW } from "./engine/constants";
import { createInitialState, stepUpdate } from "./engine/game";
import { drawFrame } from "./engine/draw";
import { loadThemeImages } from "./engine/assets";
import THEME from "./engine/theme";

export default function JourneyGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [paused, setPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [hiScore, setHiScore] = useState(0);
  const [debug, setDebug] = useState(false);
  const [showTouch, setShowTouch] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    let raf = 0;
    let last = performance.now();

    const state = createInitialState();
    const input: Record<string, boolean> = {};

    const onKey = (e: KeyboardEvent, down: boolean) => {
      const code = e.code;
      if (["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Space","KeyA","KeyD","KeyS"].includes(code)) e.preventDefault();
      input[code] = down;
      if (down && code === "Enter" && gameOver) restart();
      if (down && code === "KeyP") setPaused(p=>!p);
    };
    const keydownHandler = (e: KeyboardEvent) => onKey(e, true);
    const keyupHandler = (e: KeyboardEvent) => onKey(e, false);
    window.addEventListener("keydown", keydownHandler);
    window.addEventListener("keyup", keyupHandler);

    // preload any theme images used
    loadThemeImages(THEME);

    function restart() {
      const fresh = createInitialState();
      Object.assign(state, fresh);
      setScore(0); setGameOver(false); setPaused(false);
    }

    const loop = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;

      if (!paused && !gameOver) {
        stepUpdate(state, input, dt, (newScore) => setScore(newScore), (over) => {
          if (over) { setHiScore(h => Math.max(h, Math.floor(state.score))); setGameOver(true); }
        });
      }

      drawFrame(ctx, state, THEME, debug);
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("keydown", keydownHandler); window.removeEventListener("keyup", keyupHandler); };
  }, [paused, gameOver, debug]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center py-6 gap-3">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold">Journey Runner</h1>
        <button onClick={()=>setPaused(p=>!p)} className="px-3 py-1 rounded-2xl bg-white shadow text-sm">{paused?"Resume":"Pause (P)"}</button>
        <button onClick={()=>setShowTouch(s=>!s)} className="px-3 py-1 rounded-2xl bg-white shadow text-sm">{showTouch?"Hide":"Show"} Touch</button>
        <button onClick={()=>setDebug(d=>!d)} className="px-3 py-1 rounded-2xl bg-white shadow text-sm">Debug: {debug?"On":"Off"}</button>
        <span className="text-sm text-gray-600">Score: {score} · Hi: {hiScore}</span>
      </div>
      <canvas ref={canvasRef} width={VIEW.width} height={VIEW.height} className="rounded-xl bg-white shadow border border-black/10" />
      {showTouch && (
        <div className="flex gap-6 mt-3">
          <TouchButton label="◀" onPress={(held)=>((window as any)._leftHeld = held)} />
          <TouchButton label="▶" onPress={(held)=>((window as any)._rightHeld = held)} />
          <TouchButton label="⤒" onPress={(held)=>((window as any)._jumpHeld = held)} />
          <TouchButton label="🪵" onPress={(held)=>((window as any)._duckHeld = held)} />
        </div>
      )}
      <p className="text-sm text-gray-600">A/← left, D/→ right, Space/↑ jump, S/↓ duck. Enter restart. P pause.</p>
    </div>
  );
}

function TouchButton({ label, onPress }: { label: string; onPress: (held:boolean)=>void }){
  const [held,setHeld] = useState(false);
  useEffect(()=>{
    (window as any)._leftHeld ??= false;
    (window as any)._rightHeld ??= false;
    (window as any)._jumpHeld ??= false;
    (window as any)._duckHeld ??= false;
  },[]);
  return (
    <button
      className={`w-16 h-16 rounded-full bg-white shadow grid place-items-center text-xl select-none active:scale-95 ${held?"ring-2 ring-black/20":""}`}
      onMouseDown={()=>{setHeld(true); onPress(true);}}
      onMouseUp={()=>{setHeld(false); onPress(false);}}
      onMouseLeave={()=>{setHeld(false); onPress(false);}}
      onTouchStart={(e)=>{e.preventDefault(); setHeld(true); onPress(true);}}
      onTouchEnd={(e)=>{e.preventDefault(); setHeld(false); onPress(false);}}
    >{label}</button>
  );
}
