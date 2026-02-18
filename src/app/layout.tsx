// src/app/layout.tsx
import type { Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#000000", // safe default
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
