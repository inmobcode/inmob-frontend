"use client";

import { KeyRound, Tag } from "lucide-react";
import { useTranslations } from "next-intl";

import type { ListingType } from "@/lib/api/properties";
import { cn } from "@/lib/utils";

// Words in "properties.listingType.<value>" (label, hint).
const OPTIONS: { value: ListingType; icon: typeof Tag }[] = [
  { value: "SALE", icon: Tag },
  { value: "RENT", icon: KeyRound },
];

/** Two large selectable cards for the Venta / Alquiler decision. */
export function ListingTypeCards({
  value,
  onChange,
}: {
  value: ListingType;
  onChange: (value: ListingType) => void;
}) {
  const t = useTranslations("properties.listingType");
  return (
    <div role="radiogroup" aria-label={t("label")} className="grid grid-cols-2 gap-3">
      {OPTIONS.map((option) => {
        const active = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex flex-col items-start gap-3 rounded-2xl p-4 text-left ring-1 transition-all outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              active
                ? "bg-primary text-primary-foreground ring-primary"
                : "bg-foreground/[0.04] ring-foreground/5 hover:bg-foreground/[0.07]",
            )}
          >
            <option.icon className="size-5" />
            <span className="flex flex-col gap-0.5">
              <span className="text-lg leading-none font-semibold">{t(`${option.value}.label`)}</span>
              <span
                className={cn("text-xs", active ? "text-primary-foreground/70" : "text-muted-foreground")}
              >
                {t(`${option.value}.hint`)}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
