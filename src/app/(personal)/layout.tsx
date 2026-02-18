// src/app/(personal)/layout.tsx
import type { Metadata, Viewport } from "next";
import "@/app/globals.css";
import "./personal.css";       
import Header from "@/components/Header";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";


export const metadata: Metadata = {
  title: {
    default: "Daniel Muljono – Portfolio",
    template: "%s · Daniel Muljono",
  },
  description: "Personal projects, journey, and pixel resume.",
  icons: { icon: "/favicon.ico" },
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
