import { SessionWatcher } from "@/components/auth/session-watcher";
import { DocsHeader } from "@/components/docs/docs-header";

/**
 * The dashboard's documentation, on its own page without the sidebar so it
 * doesn't read as one more section of the panel. Still behind login: see `src/proxy.ts`.
 */
export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <SessionWatcher />
      <DocsHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 md:py-14">{children}</main>
    </div>
  );
}
