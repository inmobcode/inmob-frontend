import Link from "next/link";

/** Full-page message used by the app's 404 and error screens. */
export function StatusScreen({
  code,
  title,
  description,
  actions,
}: {
  code?: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
}) {
  return (
    <main className="flex min-h-[60vh] flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      {code && <p className="font-mono text-sm text-muted-foreground">{code}</p>}
      <h1 className="font-heading text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">{actions}</div>
    </main>
  );
}

const BUTTON =
  "inline-flex h-10 items-center rounded-lg border border-border px-4 text-sm font-medium outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring";

export function StatusButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className={BUTTON}>
      {children}
    </Link>
  );
}

export function StatusAction({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className={BUTTON}>
      {children}
    </button>
  );
}
