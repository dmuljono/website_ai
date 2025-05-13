'use client';

export default function Resume() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black/60 backdrop-blur-sm p-6">
      <div className="max-w-xl w-full bg-[#e2dcc5] text-black border-4 border-[#b7ad9b] shadow-[4px_4px_0_rgba(0,0,0,0.4)] p-6 rounded-sm">
        <h2 className="font-['Press_Start_2P'] text-xs text-black mb-4 tracking-tight">
          ▶ Resume
        </h2>
        <ul className="list-disc pl-6 font-['Press_Start_2P'] text-[10px] leading-relaxed text-black space-y-2">
          <li>👨‍💼 Associate, DBS Bank – Tech Graduate Programme (2024–Present)</li>
          <li>🎓 B.S. in Information Systems, [Your University]</li>
          <li>💼 Projects: Data automation, internal AI chatbot integration, API platform rollout</li>
          <li>📈 Skills: Python, SQL, JavaScript, Next.js, Git, DataOps, Tailwind</li>
        </ul>
        <p className="mt-4 text-blue-700 underline font-['Press_Start_2P'] text-[10px]">
          <a href="/resume.pdf" target="_blank">Download PDF Resume</a>
        </p>
      </div>
    </div>
  );
}
