"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = {
  mode?: "route" | "scroll";
  target?: string;                  // route path or CSS selector (for scroll)
  label?: string;                   // accessible label
  display?: "portal" | "button";    // "portal" = swirly image + overlay, "button" = clean button
  className?: string;
  imageSrc?: string;                // teleporter image path (used only in portal mode)
  imageAlt?: string;                // teleporter image alt (used only in portal mode)
};

export default function TeleportGate({
  mode = "route",
  target = "/professional_resume",
  label = "Teleport",
  display = "portal",
  className = "",
  imageSrc = "/teleporter.png",     // place your image at /public/teleporter.png
  imageAlt = "Teleport portal",
}: Props) {
  const [open, setOpen] = useState(false);       // fullscreen overlay state (portal mode)
  const [pressing, setPressing] = useState(false); // click ripple (portal mode only)
  const router = useRouter();
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const performTeleport = () => {
    // Skip animations for reduced-motion users
    if (prefersReducedMotion) {
      if (mode === "route") router.push(target);
      else document.querySelector(target)?.scrollIntoView({ behavior: "auto", block: "start" });
      return;
    }

    // Only animate when in portal mode
    if (display === "portal") {
      setPressing(true);
      setOpen(true);
    }

    timeoutRef.current = window.setTimeout(() => {
      if (mode === "route") {
        router.push(target);
      } else {
        document.querySelector(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      // Clean up portal animation after navigation/scroll
      if (display === "portal") {
        window.setTimeout(() => {
          setOpen(false);
          setPressing(false);
        }, 220);
      }
    }, display === "portal" && !prefersReducedMotion ? 1100 : 0);
  };

  return (
    <div className={className}>
      {display === "portal" ? (
        // ===== Swirly image teleporter button =====
        <button
          type="button"
          onClick={performTeleport}
          onMouseDown={() => setPressing(true)}
          onMouseUp={() => setPressing(false)}
          onMouseLeave={() => setPressing(false)}
          className="relative inline-grid place-items-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2"
          aria-label={label}
        >
          {/* idle swirl / hover faster / active brightest */}
          <span
            className={`relative block h-24 w-24 sm:h-28 sm:w-28 will-change-transform ${
              pressing ? "portal-press" : "portal-idle"
            }`}
          >
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              sizes="112px"
              className="rounded-full object-contain"
              priority={false}
            />
          </span>

          {/* click ripple */}
          <span
            aria-hidden
            className={`pointer-events-none absolute inset-0 rounded-full ${
              pressing ? "animate-ripple" : "opacity-0"
            }`}
          />
        </button>
      ) : (
        // ===== Clean professional return button (no swirl, no overlay) =====
        <button
          type="button"
          onClick={performTeleport}
          className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-800 shadow-sm transition hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 active:scale-[0.99]"
          aria-label={label}
        >
          {/* optional left arrow glyph */}
          <span aria-hidden>←</span>
          <span>{label}</span>
        </button>
      )}

      {/* ===== Fullscreen portal overlay — only for portal mode ===== */}
      {display === "portal" && (
        <div
          aria-hidden
          className={`fixed inset-0 z-[9999] transition-opacity duration-300 ${
            open ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          {/* Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,16,32,0)_0%,rgba(10,16,32,0.6)_55%,rgba(10,16,32,0.9)_100%)]" />
          {/* Scanlines */}
          <div className="absolute inset-0 opacity-30 mix-blend-overlay [background-image:repeating-linear-gradient(0deg,rgba(255,255,255,.15)_0_1px,transparent_1px_3px)]" />
          {/* Portal core */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className={`portal ${open ? "portal--open" : ""}`} />
          </div>
          {/* Chromatic ring pulse */}
          <div
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${
              open ? "animate-[ringPulse_1100ms_ease-in-out_forwards]" : ""
            }`}
          >
            <div className="h-[260px] w-[260px] rounded-full border-2 border-[rgba(80,255,160,0.7)] blur-[0.3px] [filter:saturate(1.4)]" />
          </div>
        </div>
      )}

      {/* ===== Styles ===== */}
      <style jsx>{`
        /* Swirl/shimmer only used by portal-mode image button */
        .portal-idle {
          animation: swirl 9s linear infinite, shimmer 2400ms ease-in-out infinite;
        }
        button:hover .portal-idle {
          animation: swirl 4.5s linear infinite, shimmer 1600ms ease-in-out infinite;
          filter: drop-shadow(0 0 10px rgba(120, 255, 200, 0.35));
        }
        .portal-press {
          animation: swirl 2.2s linear infinite, shimmer 1000ms ease-in-out infinite;
          transform: scale(0.98);
          filter: drop-shadow(0 0 16px rgba(120, 255, 200, 0.55));
        }
        @keyframes swirl {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes shimmer {
          0% {
            filter: hue-rotate(0deg) saturate(1);
          }
          50% {
            filter: hue-rotate(-10deg) saturate(1.15);
          }
          100% {
            filter: hue-rotate(0deg) saturate(1);
          }
        }

        /* Click ripple ring (portal button) */
        .animate-ripple {
          animation: ripple 600ms ease-out forwards;
          box-shadow: 0 0 0 0 rgba(80, 255, 160, 0.5);
        }
        @keyframes ripple {
          from {
            transform: scale(1);
            opacity: 0.6;
            box-shadow: 0 0 0 0 rgba(80, 255, 160, 0.5);
          }
          to {
            transform: scale(1.35);
            opacity: 0;
            box-shadow: 0 0 0 18px rgba(80, 255, 160, 0);
          }
        }

        /* Fullscreen portal */
        .portal {
          width: 240px;
          height: 240px;
          border-radius: 50%;
          image-rendering: pixelated;
          background: radial-gradient(closest-side, rgba(30, 255, 160, 0.85), rgba(30, 255, 160, 0) 70%),
            repeating-conic-gradient(
              from 0deg,
              rgba(210, 255, 230, 0.85) 0deg 6deg,
              rgba(60, 200, 130, 0.85) 6deg 12deg,
              rgba(20, 140, 90, 0.85) 12deg 18deg,
              rgba(5, 100, 60, 0.85) 18deg 24deg,
              rgba(0, 0, 0, 0) 24deg 30deg
            );
          box-shadow: 0 0 0 2px rgba(50, 200, 140, 0.8) inset, 0 0 60px 8px rgba(60, 255, 190, 0.35),
            0 0 120px 18px rgba(20, 180, 120, 0.25);
          transform: scale(0.4) rotate(0deg);
          opacity: 0;
        }
        .portal--open {
          animation: portalOpen 1100ms cubic-bezier(0.2, 0.75, 0.2, 1) forwards;
        }
        @keyframes portalOpen {
          0% {
            transform: scale(0.4) rotate(0deg);
            opacity: 0;
          }
          40% {
            transform: scale(0.9) rotate(180deg);
            opacity: 1;
          }
          70% {
            transform: scale(1.08) rotate(360deg);
          }
          100% {
            transform: scale(18) rotate(540deg);
            opacity: 1;
          }
        }
        @keyframes ringPulse {
          0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -50%) scale(8);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
