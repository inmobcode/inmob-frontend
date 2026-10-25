import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * A 1–5 rating as five stars, filled up to the rating (halves round to the
 * nearest whole star). Colored by `currentColor`; `label` is what a screen
 * reader hears instead ("4 de 5 estrellas").
 */
export function Stars({ rating, label, className }: { rating: number; label: string; className?: string }) {
  const filled = Math.round(rating);
  return (
    <span role="img" aria-label={label} className={cn("inline-flex items-center gap-0.5", className)}>
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          aria-hidden
          className={cn("size-[1em]", value <= filled ? "fill-current" : "opacity-25")}
          strokeWidth={1.5}
        />
      ))}
    </span>
  );
}
