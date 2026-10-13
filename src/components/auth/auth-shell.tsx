"use client";

import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

/**
 * The auth screens' frame. Sign-up is a long form and scrolls like a page; the
 * other screens are short, so they're pinned to the viewport and never scroll.
 * If a very short screen can't fit them, only the form column scrolls.
 */
export function AuthShell({ children }: { children: React.ReactNode }) {
  const pinned = !usePathname().startsWith("/register");

  return (
    <div
      data-pinned={pinned || undefined}
      className={cn(
        "auth group/auth grid flex-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]",
        pinned ? "h-svh overflow-hidden" : "min-h-svh",
      )}
    >
      {children}
    </div>
  );
}
