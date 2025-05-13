'use client';

export default function About() {
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/bg/skyscraper-evening-pixel.png')" }}
    >
      <div className="flex items-center justify-center min-h-screen bg-black/60 p-6">
        <div className="max-w-xl w-full bg-[#e2dcc5] text-black border-4 border-[#b7ad9b] shadow-[4px_4px_0_rgba(0,0,0,0.4)] p-6 rounded-sm">
          <h2 className="font-['Press_Start_2P'] text-xs text-black mb-4 tracking-tight">
            ▶ About Daniel
          </h2>
          <p className="font-['Press_Start_2P'] text-[10px] leading-relaxed mb-3">
            I'm Daniel Muljono — a 25-year-old tech-driven professional working at DBS Bank through the Graduate Associate Programme.
          </p>
          <p className="font-['Press_Start_2P'] text-[10px] leading-relaxed mb-3">
            I’m passionate about AI, investing, luxury goods, anime, gaming, and golf.
          </p>
          <p className="font-['Press_Start_2P'] text-[10px] leading-relaxed">
            This site’s chatbot reflects my personality — so feel free to ask it anything you'd ask me IRL.
          </p>
        </div>
      </div>
    </div>
  );
}
