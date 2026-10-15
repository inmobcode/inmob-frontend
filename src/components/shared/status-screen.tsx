import Link from "next/link";

import { LogoIcon } from "@/components/logo-icon";
import { cn } from "@/lib/utils";

const PRIMARY =
  "inline-flex h-12 items-center rounded-lg bg-lime px-6 text-base font-semibold text-forest-deep outline-none transition-[filter] hover:brightness-95 focus-visible:ring-2 focus-visible:ring-paper focus-visible:ring-offset-2 focus-visible:ring-offset-forest";

export function StatusButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className={PRIMARY}>
      {children}
    </Link>
  );
}

export function StatusAction({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className={PRIMARY}>
      {children}
    </button>
  );
}

export interface StatusLinkItem {
  href: string;
  label: string;
  hint: string;
}

/**
 * The oversized code. Every 0 is a ring; the first one holds the isotipo, like
 * the property we went looking for. It drifts around inside (the screen's only
 * unprompted motion, off with prefers-reduced-motion) or, on an error, sits tilted.
 */
function Glyph({ code, searching, compact }: { code: string; searching: boolean; compact: boolean }) {
  let ringsSeen = 0;
  return (
    <p
      aria-hidden="true"
      className={cn(
        "flex items-center justify-center font-logo leading-none font-semibold tracking-tighter text-paper select-none",
        compact ? "gap-[0.04em] text-[clamp(5rem,16vw,9rem)]" : "gap-[0.04em] text-[clamp(6rem,min(26vw,32svh),20rem)]",
      )}
    >
      {code.split("").map((char, index) => {
        if (char !== "0") return <span key={index}>{char}</span>;
        const holdsMark = ringsSeen++ === 0;
        return (
          <span key={index} className="relative inline-flex h-[0.72em] w-[0.72em] items-center justify-center">
            <svg viewBox="0 0 100 100" className="absolute inset-0 size-full" fill="none">
              <circle cx="50" cy="50" r="43" stroke="currentColor" strokeWidth="14" />
            </svg>
            {holdsMark && (
              <span className={cn("relative flex w-[0.3em] justify-center", searching ? "status-roam" : "-rotate-12")}>
                <LogoIcon className="w-full text-lime" />
              </span>
            )}
          </span>
        );
      })}
    </p>
  );
}

/**
 * Full-page message for the app's 404 and error screens: a forest block with
 * the code as the hero, a short two-tone headline, one way out and a ruled list
 * of other places to go.
 */
export function StatusScreen({
  code,
  title,
  tail,
  actions,
  links,
  searching = false,
  compact = false,
}: {
  code: string;
  title: string;
  /** What follows the headline, dimmed. */
  tail: string;
  actions?: React.ReactNode;
  links?: StatusLinkItem[];
  /** The isotipo roams inside the 0 (a page that wasn't found). */
  searching?: boolean;
  /** Inside the dashboard panel instead of filling the window. */
  compact?: boolean;
}) {
  const body = (
    <main className={cn("flex flex-1 flex-col bg-forest text-paper", compact && "rounded-2xl")}>
      {!compact && (
        <header className="border-b border-paper/15">
          <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 sm:px-8">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-sm font-logo text-xl leading-none font-semibold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-lime"
            >
              <LogoIcon className="h-[0.95em] text-lime" />
              Tivvo
            </Link>
            <span className="text-sm text-paper/55">Error {code}</span>
          </div>
        </header>
      )}

      <div
        className={cn(
          "mx-auto flex w-full max-w-[1100px] flex-1 flex-col items-center justify-center px-5 text-center sm:px-8",
          compact ? "gap-6 py-14" : "gap-8 py-10",
        )}
      >
        <Glyph code={code} searching={searching} compact={compact} />
        <h1 className="max-w-2xl font-logo text-2xl leading-snug font-medium tracking-tight sm:text-3xl">
          <span className="sr-only">Error {code}. </span>
          {title} <span className="text-paper/50">{tail}</span>
        </h1>
        {actions && <div className="flex flex-wrap items-center justify-center gap-3">{actions}</div>}
      </div>

      {links && links.length > 0 && (
        <nav aria-label="Otros lugares" className="border-t border-paper/15">
          <ul className="mx-auto grid max-w-[1440px] sm:grid-cols-3 sm:divide-x sm:divide-paper/15">
            {links.map((link) => (
              <li key={link.href} className="border-b border-paper/15 last:border-b-0 sm:border-b-0">
                <Link
                  href={link.href}
                  className="group flex items-center justify-between gap-4 px-5 py-5 outline-none transition-colors hover:bg-paper/[0.04] focus-visible:bg-paper/[0.06] sm:px-8"
                >
                  <span className="flex flex-col gap-0.5 text-left">
                    <span className="font-medium">{link.label}</span>
                    <span className="text-sm text-paper/55">{link.hint}</span>
                  </span>
                  <span aria-hidden="true" className="text-lg text-paper/55 transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </main>
  );

  // `.landing` brings the paper/ink/forest/lime tokens the utilities above read.
  return compact ? <div className="landing flex flex-1 flex-col rounded-2xl">{body}</div> : <div className="landing flex min-h-svh flex-col">{body}</div>;
}
