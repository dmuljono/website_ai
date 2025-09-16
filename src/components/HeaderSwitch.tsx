"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";

export default function HeaderSwitch() {
  const pathname = usePathname();

  // Any paths where the global Header should be hidden
  const HIDE_ON_PREFIXES = [
    "/professional_resume", // your Professional Mode route
    // add more paths here if needed (e.g., "/print")
  ];

  const shouldHide = HIDE_ON_PREFIXES.some((p) =>
    pathname === p || pathname.startsWith(p + "/")
  );

  if (shouldHide) return null;
  return <Header />;
}
