import type { Metadata } from "next";

import { SessionWatcher } from "@/components/auth/session-watcher";

export const metadata: Metadata = {
  title: "Portal",
  robots: { index: false, follow: false },
};

/**
 * Full-screen tools that need the whole window (the portal editor), without
 * the dashboard's sidebar. Still behind login: see `src/proxy.ts`.
 */
export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-svh flex-col overflow-hidden bg-background">
      <SessionWatcher />
      {children}
    </div>
  );
}
