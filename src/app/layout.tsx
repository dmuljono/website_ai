// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";

const proUrl =
  process.env.NEXT_PUBLIC_PRO_URL?.replace(/\/$/, "") ||
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(proUrl),
  title: "Professional Resume – Daniel Muljono",
  description: "Concise, professional resume.",
  openGraph: {
    url: `${proUrl}/professional_resume`,
    title: "Professional Resume – Daniel Muljono",
    images: [{ url: "/og/pro.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Professional Resume – Daniel Muljono",
    images: ["/og/pro.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff", // pro light
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
