"use client";

import { useEffect, useRef } from "react";
import { Great_Vibes } from "next/font/google";
import Image from "next/image";
import Link from "next/dist/client/link";

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
});

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
      const visibleH = window.innerHeight;
      const t = Math.min(1, Math.max(0, -rect.top / visibleH));

      const deg = 180 * t * 10;

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        card.style.transform = `translateZ(0) rotateY(${deg}deg)`;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const widthRem = 22;
  const heightRem = widthRem / 1.586;

  // iOS-ish glass sheen overlay (NO blur)
  const GlassSheen = () => (
    <div className="pointer-events-none absolute inset-0">
      {/* soft tint */}
      <div className="absolute inset-0 bg-white/6" />

      {/* top specular highlight */}
      <div className="absolute -top-24 left-0 right-0 h-64 bg-gradient-to-b from-white/18 to-transparent" />

      {/* diagonal shimmer */}
      <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.10)_35%,transparent_70%)] opacity-40" />

      {/* edge ring */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-white/18" />

      {/* subtle noise */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E)",
        }}
      />
    </div>
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-[160vh] !overflow-visible"
      aria-label="Projects – scroll to flip"
    >
      <div className="sticky top-0 h-screen flex items-center justify-center bg-transparent">
        <div
          className="relative"
          style={{ perspective: "1600px", perspectiveOrigin: "50% 45%" }}
        >
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
              style={{ backfaceVisibility: "hidden", transform: "rotateY(0deg)" }}
            >
              <Image
                src="/images/card-front2.png"
                alt="Project front"
                width={1200}
                height={1200}
                draggable={false}
                className="absolute top-1/2 left-1/2 select-none pointer-events-none"
                style={{
                  width: "auto",
                  height: "100%",
                  maxWidth: "none",
                  maxHeight: "none",
                  transformOrigin: "center",
                  transform: "translate(-50%, -50%) rotate(90deg) scale(1.6)",
                }}
              />


              {/* keep your vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

              {/* glass sheen */}
              <GlassSheen />
            </div>

            {/* BACK */}
            <div
              className="absolute inset-0 overflow-hidden rounded-2xl"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <Image
                src="/images/card-back2.png"
                alt="Project back"
                width={1200}
                height={1200}
                draggable={false}
                className="absolute top-1/2 left-1/2 select-none pointer-events-none"
                style={{
                  width: "auto",
                  height: "100%",
                  maxWidth: "none",
                  maxHeight: "none",
                  transformOrigin: "center",
                  transform: "translate(-50%, -50%) rotate(90deg) scale(1.6)",
                }}
              />


              <Link
                href="/professional"
                className={`${greatVibes.className} absolute bottom-10 left-1/2 -translate-x-1/2
                text-5xl bg-gradient-to-r from-white via-gray-300 to-white bg-[length:200%_auto]
                bg-clip-text text-transparent animate-[shine_3s_linear_infinite]
                drop-shadow-[0_0_10px_rgba(255,255,255,0.35)]`}
              >
                {/* Daniel’s Ace of Spades */}
              </Link>


              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

              <GlassSheen />
            </div>
          </div>

          <div className="mt-4 text-center text-xs text-white/70">{/* */}</div>
        </div>
      </div>
    </section>
  );
}
