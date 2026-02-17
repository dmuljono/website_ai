import Image from "next/image";
import ProjectCardSection from "./ProjectCardSection";

export function generateViewport() {
  return { themeColor: "#000000" };
}

const ulStyle = { listStyleType: "disc", paddingLeft: 20, lineHeight: 1.6 };

function NotifCard({
  app,
  title,
  time,
  iconSrc,
  iconAlt,
  iconBg = "#1f1f1f",
  children,
}: {
  app: string;
  title: string;
  time?: string;
  iconSrc: string;         // ✅ required per card
  iconAlt?: string;        // optional
  iconBg?: string;         // optional (lets you vary the tile background)
  children: React.ReactNode;
}) {
  return (
    <section
      className="
        relative overflow-hidden
        w-full max-w-[980px]
        mx-auto
        rounded-[28px]
        bg-[#151515]/80
        backdrop-blur-xl
        border border-white/10
        shadow-[0_30px_80px_rgba(0,0,0,0.6)]
      "
      style={{ padding: 24 }}
    >
      {/* Subtle highlight */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-0 right-0 h-56 bg-gradient-to-b from-white/10 to-transparent" />
        <div className="absolute inset-0 rounded-[28px] ring-1 ring-white/5" />
      </div>

      <div className="relative z-10 flex items-center gap-6">
        {/* App Icon */}
        <div
          className="h-16 w-16 shrink-0 rounded-[20px] overflow-hidden flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
          style={{ background: iconBg }}
        >
          <Image
            src={iconSrc}
            alt={iconAlt ?? `${app} icon`}
            width={64}
            height={64}
            draggable={false}
            className="object-cover select-none pointer-events-none"
          />

        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="text-[12px] tracking-wide uppercase text-white/50">
              {app}
            </div>
            {time && <div className="text-[12px] text-white/40">{time}</div>}
          </div>

          <div className="mt-1 text-[22px] sm:text-[24px] font-semibold text-white">
            {title}
          </div>

          <div className="mt-3 text-white/80">{children}</div>
        </div>
      </div>
    </section>
  );
}

export default function ProfessionalResumePage() {
  return (
    <main className="relative min-h-screen grid gap-8 px-6 py-10 text-white">
      {/* Gray-Black Sleek Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#0b0b0b] via-[#111111] to-[#050505]" />
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-black/30 via-transparent to-black/70" />

      <ProjectCardSection />

      {/* OVERVIEW */}
      <NotifCard
        app="Overview"
        title="Daniel Muljono"
        time="now"
        iconSrc="/images/icon_contacts.png"
        iconBg="#1f1f1f"
      >
        <div className="text-white/70">
          Associate (Graduate Associate Program), Tech & Ops — DBS Bank · Indonesia
        </div>
        <ul style={{ ...ulStyle, marginTop: 10 }}>
          <li>IT Risk & Governance</li>
          <li>Change Management (CR / CCB)</li>
          <li>Automation & AI Enablement</li>
        </ul>
      </NotifCard>

      {/* CURRENT ROLE */}
      <NotifCard
        app="Current Role"
        title="IT Risk Manager — DBS Bank"
        time="Active"
        iconSrc="/images/icon_tasks.png"
      >
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
          <strong>Associate → IT Risk Manager</strong>
          <span>2024 – Present</span>
        </div>
        <ul style={{ ...ulStyle, marginTop: 10 }}>
          <li>Govern end-to-end Change Requests (Normal, Urgent, Emergency).</li>
          <li>Identify scheduling conflicts across applications & infrastructure.</li>
          <li>Support local & regional Change Control Boards (CCB).</li>
          <li>Produce executive reporting (ITSC, Risk Forum).</li>
          <li>Participate in audit & DR simulation exercises.</li>
        </ul>
      </NotifCard>

      {/* AUTOMATION & AI */}
      <NotifCard
        app="Automation & AI"
        title="Governance Efficiency Systems"
        time="Impact"
        iconSrc="/images/icon_shortcuts.png"
      >
        <ul style={ulStyle}>
          <li><strong>PIC/EIC Auto-Assignment Matrix:</strong> Reduced manual effort drastically.</li>
          <li><strong>CR Summarization (DBSGPT):</strong> AI risk surfacing workflow.</li>
          <li><strong>Maker–Checker AI Agent:</strong> Structured validation system.</li>
          <li><strong>Executive Dashboards:</strong> Operational signals → leadership insights.</li>
        </ul>
      </NotifCard>

      {/* CORE CAPABILITIES */}
      <NotifCard
        app="Core Capabilities"
        title="Domains & Technical Stack"
        time="Skills"
        iconSrc="/images/icon_notes.png"
      >
        <ul style={ulStyle}>
          <li><strong>Risk Domains:</strong> IT Risk, Governance, Resilience</li>
          <li><strong>Automation:</strong> Python, SQL, Excel</li>
          <li><strong>AI:</strong> DBSGPT workflows</li>
          <li><strong>Tools:</strong> JIRA, Confluence, Git, Docker</li>
          <li><strong>Web:</strong> React, Next.js, Tailwind</li>
        </ul>
      </NotifCard>

      {/* EDUCATION */}
      <NotifCard
        app="Education"
        title="University Background"
        time="UCSD"
        iconSrc="/images/icon_books.png"
      >
        <ul style={ulStyle}>
          <li>
            <strong>B.S. Cognitive Science</strong> — University of California, San Diego
          </li>
        </ul>
      </NotifCard>
    </main>
  );
}
