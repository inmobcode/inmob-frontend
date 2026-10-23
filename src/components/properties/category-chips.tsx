"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";

import { gsap, useGSAP } from "@/lib/gsap";
import { distance, duration, ease, media, stagger } from "@/lib/motion";
import { useLabels } from "@/lib/labels";
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
  const t = useTranslations("properties.create");
  const labels = useLabels();
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
    <div ref={ref} role="radiogroup" aria-label={t("category")} className="flex flex-wrap gap-2">
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
            {labels.category(option)}
          </button>
        );
      })}
    </div>
  );
}
