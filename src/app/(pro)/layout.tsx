// src/app/(pro)/layout.tsx
import type { Metadata } from "next";
import "./pro.css"; // keep if you have pro-only styles
import "@/app/globals.css";  // shared base
import type { Viewport } from 'next';

export const viewport: Viewport = {
  themeColor: '#000000'  // or your desired color (e.g. black)
};

export default function ProLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pro-body min-h-dvh"> 
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between py-3">
          <div className="font-medium">Professional Mode</div>
          <a href="/" className="underline">Back to Personal</a>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
