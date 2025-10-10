// src/app/(pro)/layout.tsx
import type { Metadata } from "next";
import "./pro.css"; // keep if you have pro-only styles
import "@/app/globals.css";  // shared base


export const metadata: Metadata = {
  title: "Professional Resume – Daniel Muljono",
  description: "Concise, professional resume.",
  icons: { icon: "/pro-favicon.ico" }, // optional separate favicon
  openGraph: {
    type: "profile",
    url: "https://<your-domain>/professional_resume",
    title: "Professional Resume – Daniel Muljono",
    images: [{ url: "/og/pro.png" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Professional Resume – Daniel Muljono",
    images: ["/og/pro.png"]
  },
  themeColor: "#ffffff"
};

export default function ProLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pro-scope min-h-dvh bg-white text-black">
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
