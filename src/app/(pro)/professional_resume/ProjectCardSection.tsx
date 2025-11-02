"use client";

import dynamic from "next/dynamic";

// Toggle which implementation you want to show:
const ProCardCSS = dynamic(() => import("./ProCardCSS"), { ssr: false });
// const ScrollFlipCardScene = dynamic(() => import("./ScrollFlipCardScene"), { ssr: false });

export default function ProjectCardSection() {
  return (
    <>
      {/* CSS 3D version (stable in dev) */}
      <ProCardCSS />

      {/* If you want to test WebGL later, swap the comments above/below: */}
      {/* <section className="relative h-[160vh] !overflow-visible">
        <div className="sticky top-0 h-screen !overflow-visible">
          <ScrollFlipCardScene />
        </div>
      </section> */}
    </>
  );
}
