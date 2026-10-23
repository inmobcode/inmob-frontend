import type { OfferStatus } from "@/lib/api/offers";
import { useLabels } from "@/lib/labels";
import { cn } from "@/lib/utils";

const STYLES: Record<OfferStatus, string> = {
  DRAFT: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  SENT: "bg-primary/10 text-primary",
  VIEWED: "bg-highlight/40 text-highlight-foreground",
  EXPIRED: "bg-foreground/[0.07] text-muted-foreground",
};

export function OfferStatusPill({ status, className }: { status: OfferStatus; className?: string }) {
  const labels = useLabels();
  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center rounded-full px-2.5 text-xs font-medium",
        STYLES[status],
        className,
      )}
    >
      {labels.offerStatus(status)}
    </span>
  );
}
