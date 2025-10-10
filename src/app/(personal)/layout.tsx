// src/app/(personal)/layout.tsx
import type { Metadata, Viewport } from "next";
import "@/app/globals.css";
import "./personal.css";       
import Header from "@/components/Header";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";


export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Daniel Muljono – Portfolio",
    template: "%s · Daniel Muljono"
  },
  description: "Personal projects, journey, and pixel resume.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png"
  },
  openGraph: {
    type: "website",
    url: "https://<your-domain>/",
    title: "Daniel Muljono - Portfolio",
    siteName: "Daniel Muljono - Portfolio",
    images: [{ url: "/og/personal.png" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Daniel Muljono - Portfolio",
    images: ["/og/personal.png"]
  },
  themeColor: "#000000"
};

export const viewport: Viewport = {
  themeColor: "#000000", // personal dark
};

export default function PersonalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="personal-scope min-h-dvh bg-black text-white">
      <Header />
      <main>{children}</main>
    </div>
  );
}
