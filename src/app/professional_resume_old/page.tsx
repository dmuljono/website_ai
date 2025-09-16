export const metadata = {
  title: "Daniel Muljono – Professional Resume",
  description: "Concise professional resume: experience, projects, skills, education.",
};

import TeleportGate from "@/components/TeleportGate";

export default function ProfessionalResumePage() {
  return (
    <main className="relative mx-auto max-w-5xl px-6 py-16 print:p-0">
      {/* Clean return button */}
      <div className="mb-8 flex items-center justify-between print:hidden">
        <div className="text-sm text-neutral-500">Professional Mode</div>
        <TeleportGate
          mode="route"
          target="/"
          label="Return to Pixel Resume"
          display="button"   // <<< ensures no portal overlay
        />
      </div>

      {/* Resume content sections … */}
    </main>
  );
}
