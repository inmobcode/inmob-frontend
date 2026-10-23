import { Lightbulb, Lock, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

import { cn } from "@/lib/utils";

export interface FigureMarker {
  /** Position over the screenshot, in % of its width and height. */
  x: number;
  y: number;
  label: React.ReactNode;
}

/**
 * A screenshot of the panel (from /public/docs) with numbered markers on top
 * and, below, what each number points at. Markers are HTML, not part of the
 * image, so they stay sharp and can be moved without retaking the capture.
 */
export function DocFigure({
  src,
  alt,
  width,
  height,
  markers = [],
  caption,
  className,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  markers?: FigureMarker[];
  caption?: React.ReactNode;
  /** Narrow captures (dialogs, side panels) set a max width here. */
  className?: string;
}) {
  return (
    <figure className={cn("flex flex-col gap-4", className)}>
      <div className="relative overflow-hidden rounded-2xl bg-card shadow-[0_12px_40px_-16px_oklch(0.3_0.05_160/0.3)] ring-1 ring-foreground/10">
        <Image src={src} alt={alt} width={width} height={height} sizes="(min-width: 1024px) 768px, 100vw" className="h-auto w-full" />
        {markers.map((marker, index) => (
          <span
            key={index}
            aria-hidden
            style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
            className="absolute flex size-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground shadow-md ring-2 ring-background sm:size-6 sm:text-xs"
          >
            {index + 1}
          </span>
        ))}
      </div>
      {(markers.length > 0 || caption) && (
        <figcaption className="flex flex-col gap-2.5">
          {markers.length > 0 && (
            <ol className="flex flex-col gap-2 text-sm leading-relaxed">
              {markers.map((marker, index) => (
                <li key={index} className="flex gap-2.5">
                  <span className="mt-px flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                    {index + 1}
                  </span>
                  <span>{marker.label}</span>
                </li>
              ))}
            </ol>
          )}
          {caption && <p className="text-sm text-muted-foreground">{caption}</p>}
        </figcaption>
      )}
    </figure>
  );
}

/** One tool of the dashboard: anchor target, heading and its explanation. */
export function DocSection({
  id,
  icon: Icon,
  title,
  intro,
  adminOnly = false,
  children,
}: {
  id: string;
  icon: LucideIcon;
  title: string;
  intro: string;
  /** Only owners and administrators see this tool. */
  adminOnly?: boolean;
  children: React.ReactNode;
}) {
  const t = useTranslations("docs.page");
  return (
    <section id={id} data-doc-section className="flex scroll-mt-28 flex-col gap-6 border-t border-border pt-12 first:border-t-0 first:pt-0">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-secondary text-primary">
            <Icon className="size-5" />
          </span>
          <h2 className="font-display text-3xl leading-none tracking-tight">{title}</h2>
          {adminOnly && (
            <span className="inline-flex h-6 items-center gap-1.5 rounded-full bg-foreground/[0.06] px-2.5 text-xs font-medium text-muted-foreground">
              <Lock className="size-3" />
              {t("adminOnly")}
            </span>
          )}
        </div>
        <p className="max-w-prose text-base text-pretty text-muted-foreground">{intro}</p>
      </div>
      {children}
    </section>
  );
}

export function DocH3({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-2 font-display text-xl leading-tight">{children}</h3>;
}

export function DocP({ children }: { children: React.ReactNode }) {
  return <p className="max-w-prose text-sm leading-relaxed text-pretty">{children}</p>;
}

/** Numbered how-to. */
export function DocSteps({ children }: { children: React.ReactNode }) {
  return (
    <ol className="flex max-w-prose list-none flex-col gap-3 text-sm leading-relaxed [counter-reset:step]">
      {children}
    </ol>
  );
}

export function DocStep({ children }: { children: React.ReactNode }) {
  return (
    <li className="relative pl-9 [counter-increment:step] before:absolute before:top-0 before:left-0 before:flex before:size-6 before:items-center before:justify-center before:rounded-full before:bg-foreground/[0.07] before:text-xs before:font-semibold before:content-[counter(step)]">
      {children}
    </li>
  );
}

export function DocList({ children }: { children: React.ReactNode }) {
  return (
    <ul className="flex max-w-prose list-disc flex-col gap-2 pl-5 text-sm leading-relaxed marker:text-muted-foreground">
      {children}
    </ul>
  );
}

/** Term on the left, what it means on the right; stacks on phones. */
export function DocTerms({ items }: { items: [React.ReactNode, React.ReactNode][] }) {
  return (
    <dl className="grid max-w-prose gap-x-6 gap-y-3 text-sm leading-relaxed sm:grid-cols-[10rem_1fr]">
      {items.map(([term, detail], index) => (
        <div key={index} className="contents">
          <dt className="font-medium">{term}</dt>
          <dd className="text-muted-foreground">{detail}</dd>
        </div>
      ))}
    </dl>
  );
}

export function DocTip({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex max-w-prose gap-3 rounded-2xl bg-primary/[0.06] px-4 py-3.5 text-sm leading-relaxed">
      <Lightbulb className="mt-0.5 size-4 shrink-0 text-primary" />
      <div>{children}</div>
    </div>
  );
}

export function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded-md bg-foreground/[0.07] px-1.5 align-[1px] font-sans text-xs font-medium">
      {children}
    </kbd>
  );
}

/** A status as the dashboard paints it, to name it in running text. */
export function DocPill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "primary" | "amber" }) {
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center rounded-full px-2 align-[1px] text-xs font-medium",
        tone === "primary" && "bg-primary/10 text-primary",
        tone === "amber" && "bg-amber-500/15 text-amber-700 dark:text-amber-400",
        tone === "neutral" && "bg-foreground/[0.07] text-muted-foreground",
      )}
    >
      {children}
    </span>
  );
}
