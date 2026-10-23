"use client";

import { Home, KeyRound, Layers } from "lucide-react";
import { useTranslations } from "next-intl";

import type { OfferOperation } from "@/lib/api/offers";
import type { ListingType } from "@/lib/api/properties";
import { cn } from "@/lib/utils";

/** Whether a property of this listing type fits an offer of this operation. */
export function fitsOperation(operation: OfferOperation, listingType: ListingType) {
  return operation === "BOTH" || operation === listingType;
}

// Words in "offers.operation.<value>" (label, description).
export const OPERATION_CHOICES: { value: OfferOperation; icon: typeof Home }[] = [
  { value: "SALE", icon: Home },
  { value: "RENT", icon: KeyRound },
  { value: "BOTH", icon: Layers },
];

/** Three tiles to pick whether an offer is for sale, rent or both. */
export function OperationPicker({
  value,
  onChange,
  invalid,
}: {
  value: OfferOperation | undefined;
  onChange: (value: OfferOperation) => void;
  invalid?: boolean;
}) {
  const t = useTranslations("offers.operation");
  return (
    <div role="radiogroup" aria-label={t("label")} aria-invalid={invalid} className="grid grid-cols-3 gap-2">
      {OPERATION_CHOICES.map((choice) => {
        const active = choice.value === value;
        return (
          <button
            key={choice.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(choice.value)}
            className={cn(
              "flex flex-col items-start gap-2 rounded-2xl p-3.5 text-left ring-1 transition-[background-color,box-shadow] outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              active
                ? "bg-primary/[0.06] ring-2 ring-primary"
                : invalid
                  ? "ring-destructive/60 hover:bg-foreground/[0.03]"
                  : "ring-foreground/10 hover:bg-foreground/[0.03]",
            )}
          >
            <choice.icon className={cn("size-5", active ? "text-primary" : "text-muted-foreground")} aria-hidden />
            <span className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">{t(`${choice.value}.label`)}</span>
              <span className="text-xs leading-snug text-muted-foreground">{t(`${choice.value}.description`)}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

