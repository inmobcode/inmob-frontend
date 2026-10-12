import { cookies } from "next/headers";

import { SessionWatcher } from "@/components/auth/session-watcher";
import { DashboardSidebar, MobileTopbar } from "@/components/dashboard/sidebar";
import { SIDEBAR_COOKIE } from "@/lib/sidebar";
import { ActionBar } from "@/components/dashboard/action-bar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // The collapsed state lives in a cookie so the server renders the right
  // width on the first paint instead of flashing expanded.
  const initialCollapsed = (await cookies()).get(SIDEBAR_COOKIE)?.value === "1";

  // The wrapper carries the sidebar colour so the content's rounded left
  // corners reveal it. The content scrolls on its own, keeping those
  // corners pinned to the viewport edges instead of scrolling away.
  return (
    <div className="flex h-svh bg-sidebar">
      <SessionWatcher />
      <DashboardSidebar initialCollapsed={initialCollapsed} />
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto bg-background md:rounded-l-[25px]">
        <MobileTopbar />
        <ActionBar />
        <main className="flex-1 p-4 sm:p-6 md:py-8 lg:pr-12">{children}</main>
      </div>
    </div>
  );
}
