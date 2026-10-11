import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { ActionBar } from "@/components/dashboard/action-bar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col">
        <ActionBar />
        <main className="flex-1 bg-zinc-50 p-6 dark:bg-black">{children}</main>
      </div>
    </div>
  );
}
