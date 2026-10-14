import type { Metadata } from "next";
import { cookies } from "next/headers";

import { SessionWatcher } from "@/components/auth/session-watcher";
import { DashboardSidebar, MobileTopbar } from "@/components/dashboard/sidebar";
import { SIDEBAR_COOKIE } from "@/lib/sidebar";
import { Shortcuts } from "@/components/dashboard/shortcuts";
import { ActionBar } from "@/components/dashboard/action-bar";
import { PanelCorners, ScrollPanel } from "@/components/dashboard/scroll-panel";

// Every section under here sets its own title; this is just the shared "keep out of search engines" default.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // The collapsed state lives in a cookie so the server renders the right
  // width on the first paint instead of flashing expanded.
  const initialCollapsed = (await cookies()).get(SIDEBAR_COOKIE)?.value === "1";

  // The wrapper carries the sidebar colour; the content panel scrolls on its
  // own and its rounded left corners are painted by <PanelCorners />.
  return (
    <div className="flex h-svh bg-sidebar">
      <SessionWatcher />
      <DashboardSidebar initialCollapsed={initialCollapsed} />
      <div className="relative flex min-w-0 flex-1">
        <ScrollPanel className="flex min-w-0 flex-1 flex-col overflow-y-auto bg-background">
          <MobileTopbar />
          <ActionBar />
          <main className="flex-1 p-4 sm:p-6 md:py-8 lg:pr-12">{children}</main>
        </ScrollPanel>
        <PanelCorners />
      </div>
      <Shortcuts />
    </div>
  );
}
