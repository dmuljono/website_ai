import ProjectCardSection from "./ProjectCardSection";

export function generateViewport() {
  return { themeColor: "#000000" };
}

export default function ProfessionalResumePage() {
  return (
    <main className="grid gap-6">
      {/* Header Card */}
      <section className="pro-card" style={{ padding: 20 }}>
        <h1 className="pro-h1">Daniel Muljono</h1>
        <div className="pro-muted" style={{ marginTop: 6 }}>
          Associate, DBS Bank (Graduate Associate Program) · Indonesia
        </div>
        <div className="pro-chip" style={{ marginTop: 10 }}>
          <span>Automation</span> • <span>API Rollout</span> • <span>GPT Integrations</span>
        </div>
      </section>

      {/* Profile */}
      <section className="pro-card" style={{ padding: 20 }}>
        <h2 className="pro-h2">Profile</h2>
        <p className="pro-muted" style={{ maxWidth: 70 + "ch" }}>
          Results-oriented technologist focused on reliability, compliant delivery, and measurable impact.
          Experience shipping automation tools, rolling out internal APIs, and integrating GPT features to streamline operations.
        </p>
      </section>

      {/* Two-column: Experience / Projects */}
      <section className="grid gap-6" style={{ gridTemplateColumns: "1fr", display: "grid" }}>
        <div className="pro-card" style={{ padding: 20 }}>
          <h2 className="pro-h2">Experience</h2>
          <div className="pro-muted" style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <strong style={{ color: "white" }}>Associate, DBS Bank (GAP)</strong>
            <span>2022 – Present</span>
          </div>
          <ul className="pro-list">
            <li>Developed automation tools that improved operational efficiency and reliability.</li>
            <li>Led rollout of internal APIs with governance and compliance considerations.</li>
            <li>Integrated GPT for task triage and summarization to reduce manual toil.</li>
          </ul>
        </div>

        <div className="pro-card" style={{ padding: 20 }}>
          <h2 className="pro-h2">Selected Projects</h2>
          <ul className="pro-list">
            <li><strong>Ticket Summarizer Automation</strong> — Python + GPT; reduced triage time by ~40%.</li>
            <li><strong>Task Triage Chatbot</strong> — Zustand + GPT to support internal operations.</li>
            <li><strong>Internal Platform Refactor</strong> — Next.js + Tailwind; improved maintainability.</li>
          </ul>
        </div>
      </section>

      {/* Skills / Education */}
      <section className="grid gap-6" style={{ gridTemplateColumns: "1fr 1fr", display: "grid" }}>
        <div className="pro-card" style={{ padding: 20 }}>
          <h2 className="pro-h2">Skills</h2>
          <ul className="pro-list">
            <li><strong>Languages:</strong> Python, JavaScript, SQL</li>
            <li><strong>Frameworks:</strong> Next.js, React, Tailwind</li>
            <li><strong>Tools:</strong> Zustand, Git, Docker, Figma, JIRA, DataOps</li>
          </ul>
        </div>

        <div className="pro-card" style={{ padding: 20 }}>
          <h2 className="pro-h2">Education</h2>
          <ul className="pro-list">
            <li><strong>B.S. in Information Systems</strong> — University of California, San Diego</li>
          </ul>
        </div>
      </section>
      <ProjectCardSection />
    </main>
  );
}
