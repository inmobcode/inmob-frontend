import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { SessionWatcher } from "@/components/auth/session-watcher";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pageTitles");
  return {
    title: t("portal"),
    robots: { index: false, follow: false },
  };
}

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
