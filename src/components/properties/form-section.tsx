import { Globe, Lock } from "lucide-react";

import { cn } from "@/lib/utils";

/** Says whether a block reaches the public portal today. */
export function Audience({ shown }: { shown: boolean }) {
  const Icon = shown ? Globe : Lock;
  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium",
        shown ? "bg-primary/10 text-primary" : "bg-foreground/[0.06] text-muted-foreground",
      )}
    >
      <Icon className="size-3" />
      {shown ? "Se muestra en el portal" : "Solo interno"}
    </span>
  );
}

/** A titled block of a tab, with the public/internal badge next to the title. */
export function FormSection({
  title,
  description,
  shown = false,
  children,
}: {
  title: string;
  description: string;
  /** true: public, false: internal, null: no badge. */
  shown?: boolean | null;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <h3 className="font-display text-xl leading-tight">{title}</h3>
          {shown !== null && <Audience shown={shown} />}
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}
