'use client'

export default function GlassyButton() {
  return (
    <a
      href="/professional_resume"
      className="relative px-6 py-3 rounded-2xl bg-white/20 border border-white/40 backdrop-blur-xl overflow-hidden group"
      onMouseMove={(e) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        (e.currentTarget as HTMLElement).style.setProperty('--x', `${x}px`);
        (e.currentTarget as HTMLElement).style.setProperty('--y', `${y}px`);
      }}
    >
      View Professional Profile
      <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-300 [mask-image:radial-gradient(120px_at_var(--x)_var(--y),white,transparent)] bg-white rounded-2xl"/>
    </a>
  )
}
