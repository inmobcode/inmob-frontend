import type { PropertyStatus } from "@/lib/api/properties";
import { STATUS_LABELS } from "@/lib/properties-labels";
import { cn } from "@/lib/utils";

const STATUS_PILL: Record<PropertyStatus, string> = {
  PUBLISHED: "bg-primary/10 text-primary",
  DRAFT: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  ARCHIVED: "bg-foreground/[0.07] text-muted-foreground",
};

/** Publicada / Borrador / Archivada as a small tinted pill. */
export function StatusPill({ status, className }: { status: PropertyStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center rounded-full px-2.5 text-xs font-medium",
        STATUS_PILL[status],
        className,
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
