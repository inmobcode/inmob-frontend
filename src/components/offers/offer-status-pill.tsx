import type { OfferStatus } from "@/lib/api/offers";
import { OFFER_STATUS_LABELS } from "@/lib/properties-labels";
import { cn } from "@/lib/utils";

const STYLES: Record<OfferStatus, string> = {
  DRAFT: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  SENT: "bg-primary/10 text-primary",
  VIEWED: "bg-highlight/40 text-highlight-foreground",
  EXPIRED: "bg-foreground/[0.07] text-muted-foreground",
};

export function OfferStatusPill({ status, className }: { status: OfferStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center rounded-full px-2.5 text-xs font-medium",
        STYLES[status],
        className,
      )}
    >
      {OFFER_STATUS_LABELS[status]}
    </span>
  );
}
