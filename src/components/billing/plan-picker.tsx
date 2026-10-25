"use client";

import { ArrowRight, Check } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

import type { PlanChoice } from "@/lib/api/billing";
import { localePath } from "@/i18n/config";
import { cn } from "@/lib/utils";

/** Where "Enterprise" leads: the contact form, with the message half-written (see ContactForm). */
export function enterpriseContactHref(locale: Parameters<typeof localePath>[0]) {
  return `${localePath(locale, "/help")}?plan=enterprise#contacto`;
}

const CARD =
  "flex w-full flex-col gap-1.5 rounded-xl border p-4 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2";

/**
 * The three plans, one under the other. Free trial and Pro call `onSelect`;
 * Enterprise is a link, because it's a conversation and not a checkout.
 */
export function PlanPicker({
  onSelect,
  selected,
  disabled,
  trialUnavailable,
}: {
  onSelect: (plan: PlanChoice) => void;
  selected?: PlanChoice | null;
  disabled?: boolean;
  /** The agency (or its card) already had its free trial: only Pro is open. */
  trialUnavailable?: boolean;
}) {
  const t = useTranslations("billing.plans");
  const locale = useLocale();

  return (
    <div className="flex flex-col gap-3">
      {(["trial", "pro"] as const).map((plan) => {
        const active = selected === plan;
        const blocked = plan === "trial" && trialUnavailable;
        return (
          <button
            key={plan}
            type="button"
            disabled={disabled || blocked}
            aria-pressed={active}
            onClick={() => onSelect(plan)}
            className={cn(
              CARD,
              "disabled:opacity-60",
              active ? "border-forest bg-mist/60" : "border-[#cfd5cc] bg-white hover:border-forest/40",
            )}
          >
            <span className="flex items-baseline justify-between gap-3">
              <span className="font-logo text-lg font-semibold">{t(`${plan}.name`)}</span>
              <span className="text-sm font-medium text-forest">{t(`${plan}.price`)}</span>
            </span>
            <span className="text-sm text-pretty text-quiet">
              {blocked ? t("trial.unavailable") : t(`${plan}.description`)}
            </span>
            {plan === "trial" && !blocked && (
              <span className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-forest">
                <Check className="size-3.5" aria-hidden />
                {t("trial.then")}
              </span>
            )}
          </button>
        );
      })}
      <Link href={enterpriseContactHref(locale)} className={cn(CARD, "border-[#cfd5cc] bg-white hover:border-forest/40")}>
        <span className="flex items-baseline justify-between gap-3">
          <span className="font-logo text-lg font-semibold">{t("enterprise.name")}</span>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-forest">
            {t("enterprise.price")}
            <ArrowRight className="size-3.5" aria-hidden />
          </span>
        </span>
        <span className="text-sm text-pretty text-quiet">{t("enterprise.description")}</span>
      </Link>
      <p className="text-center text-xs text-pretty text-quiet">{t("cardNote")}</p>
    </div>
  );
}
