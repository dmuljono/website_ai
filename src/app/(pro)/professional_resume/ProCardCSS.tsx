"use client";

import { useEffect, useRef } from "react";

/**
 * CSS 3D card that flips 0→180° as you scroll through the sticky section.
 * - No WebGL. No GPU context loss.
 * - Uses the same assets (/public/images/card-front.png, card-back.png).
 */
export default function ProCardCSS() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current!;
    const card = cardRef.current!;
    let raf = 0;

    const onScroll = () => {
      if (!section) return;
      const rect = section.getBoundingClientRect();
      // progress 0..1 while the sticky viewport is on screen
      const visibleH = window.innerHeight;
      // section is exactly 160vh tall; flip during the sticky viewport (full screen)
      const start = 0; // when section's sticky viewport begins
      const end = visibleH; // end of the sticky viewport
      // map rect.top (0..-visibleH) to 0..1
      const t = Math.min(1, Math.max(0, -rect.top / visibleH));

      // rotateY 0..180deg
      const deg = 180 * t;

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        card.style.transform = `translateZ(0) rotateY(${deg}deg)`;
      });
    };

    onScroll(); // initial
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // credit-card ratio ≈ 1.586:1
  const widthRem = 22; // tweak size here
  const heightRem = widthRem / 1.586;

  return (
    <section
      ref={sectionRef}
      className="relative h-[160vh] !overflow-visible"
      aria-label="Projects – scroll to flip"
    >
      <div className="sticky top-0 h-screen flex items-center justify-center bg-transparent">
        {/* perspective container */}
        <div
          className="relative"
          style={{
            perspective: "1600px",
            perspectiveOrigin: "50% 45%",
          }}
        >
          {/* the 3D card */}
          <div
            ref={cardRef}
            className="relative will-change-transform rounded-2xl"
            style={{
              width: `${widthRem}rem`,
              height: `${heightRem}rem`,
              transformStyle: "preserve-3d",
              transition: "transform 0.06s linear",
              borderRadius: "1rem",
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.06)",
            }}
          >
            {/* FRONT */}
            <div
              className="absolute inset-0 overflow-hidden rounded-2xl"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(0deg)",
              }}
            >
              <img
                src="/images/card-front.png"
                alt="Project front"
                className="w-full h-full object-cover select-none pointer-events-none"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            {/* BACK */}
            <div
              className="absolute inset-0 overflow-hidden rounded-2xl"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <img
                src="/images/card-back.png"
                alt="Project back"
                className="w-full h-full object-cover select-none pointer-events-none"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
          </div>

          {/* Minimal label */}
          <div className="mt-4 text-center text-xs text-white/70">
            Scroll to flip (0° → 180°)
          </div>
        </div>
      </div>
    </section>
  );
}
