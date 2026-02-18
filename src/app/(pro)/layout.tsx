// src/app/(pro)/layout.tsx
import type { Metadata } from "next";
import "./pro.css"; // keep if you have pro-only styles
import "@/app/globals.css";  // shared base
import type { Viewport } from 'next';
import { Great_Vibes } from 'next/font/google'
import Link from "next/link";

const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: '400'
})

export const viewport: Viewport = {
  themeColor: '#000000'  // or your desired color (e.g. black)
};

export default function ProLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pro-body min-h-dvh"> 
      <header className="border-b border-white/10 bg-black/30 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between py-3">
          <div className="font-medium">. Daniel Muljono</div>
          <Link href="/" className="ai-btn">
            <span className="ai-btn-inner">
              Back to Personal
            </span>
          </Link>

        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
