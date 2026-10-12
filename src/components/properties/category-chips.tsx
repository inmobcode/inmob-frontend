"use client";

import { useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { distance, duration, ease, media, stagger } from "@/lib/motion";
import { categoryLabel } from "@/lib/properties-labels";
import { cn } from "@/lib/utils";

/** Remounted (via `key`) whenever the listing type changes, so the options re-enter each time. */
export function CategoryChips({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(media.allowMotion, () => {
        gsap.from("[data-chip]", {
          opacity: 0,
          y: distance.sm,
          duration: duration.base,
          ease: ease.out,
          stagger: stagger.tight,
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} role="radiogroup" aria-label="Categoría" className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={active}
            data-chip
            onClick={() => onChange(option)}
            className={cn(
              "h-9 rounded-full px-4 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              active
                ? "bg-primary text-primary-foreground"
                : "bg-foreground/[0.06] text-muted-foreground hover:bg-foreground/10 hover:text-foreground",
            )}
          >
            {categoryLabel(option)}
          </button>
        );
      })}
    </div>
  );
}
