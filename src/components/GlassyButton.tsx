'use client'
import Link from "next/link";

export default function GlassyButton() {
  return (
    <Link
      href="/professional_resume"
      className="glassy-pro-btn group relative px-6 py-3 rounded-full 
                 bg-white/15 border border-white/30 
                 backdrop-blur-xl overflow-hidden"
      onMouseMove={(e) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        (e.currentTarget as HTMLElement).style.setProperty("--x", `${x}px`);
        (e.currentTarget as HTMLElement).style.setProperty("--y", `${y}px`);
      }}
    >
      <span className="relative z-10 text-white font-medium tracking-tight">
        View Professional Profile
      </span>

      {/* Cursor glow */}
      <span
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-300
        [mask-image:radial-gradient(120px_at_var(--x)_var(--y),white,transparent)]
        bg-white rounded-2xl"
      />

      {/* Rotating ring */}
      <span className="purple-ring pointer-events-none absolute inset-0 rounded-full" />
    </Link>
  )
}
