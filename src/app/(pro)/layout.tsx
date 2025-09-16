// app/(pro)/layout.tsx
export const metadata = {
  title: "Professional Resume – Daniel Muljono",
  description: "A focused, professional résumé view.",
  icons: {
    icon: "/pro-favicon.svg",
    shortcut: "/pro-favicon.svg",
    apple: "/pro-favicon.svg",
  },
  themeColor: "#0b1020",
};

import "../(pro)/pro.css";
import Link from "next/link";
import Image from "next/image";
import TeleportGate from "@/components/TeleportGate";

export default function ProLayout({ children }: { children: React.ReactNode }) {
  return (
    // ⬇️ Use a wrapper div instead of redefining <html>/<body>
    <div className="pro-body min-h-dvh">
      {/* Pro-only top bar (no main-site nav) */}
      <div className="pro-nav">
        <div
          className="pro-container"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Image src="/pro-favicon.svg" alt="Pro Icon" width={22} height={22} />
            <span className="pro-muted" style={{ fontSize: ".95rem" }}>
              Professional Mode
            </span>
          </div>

          <div className="pro-actions" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <TeleportGate display="button" target="/" label="Return to Pixel Resume" />
            <Link className="pro-btn" href="/resume.pdf" target="_blank" prefetch={false}>
              ⬇️ Download PDF
            </Link>
            <a className="pro-btn pro-btn-accent" href="mailto:you@example.com">
              Contact
            </a>
          </div>
        </div>
      </div>

      <div className="pro-container">{children}</div>

      <footer
        className="pro-container"
        style={{ paddingTop: 24, paddingBottom: 40, color: "#8f99b8", fontSize: ".8rem" }}
      >
        © {new Date().getFullYear()} Daniel Muljono • Professional Mode
      </footer>
    </div>
  );
}
