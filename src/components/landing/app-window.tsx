import { cn } from "@/lib/utils";

/**
 * A browser-style frame around a screenshot of the product. While there are no
 * real captures yet, `children` holds a drawn stand-in; pass `src` to use a
 * real image instead.
 */
export function AppWindow({
  src,
  alt = "",
  url = "app.inmobiliario.com",
  children,
  className,
}: {
  src?: string;
  alt?: string;
  url?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-3xl bg-card text-card-foreground shadow-[0_2px_4px_oklch(0.3_0.05_160/0.05),0_40px_80px_-24px_oklch(0.3_0.05_160/0.35)] ring-1 ring-foreground/10",
        className,
      )}
    >
      <div className="flex h-10 items-center gap-3 bg-foreground/[0.04] px-4">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
        </span>
        <span className="mx-auto hidden h-6 min-w-0 max-w-xs flex-1 items-center justify-center rounded-full bg-foreground/[0.05] px-3 text-xs text-muted-foreground sm:flex">
          <span className="truncate">{url}</span>
        </span>
        <span className="w-10 sm:hidden" />
      </div>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="block w-full" />
      ) : (
        <div className="relative bg-background">{children}</div>
      )}
    </div>
  );
}
