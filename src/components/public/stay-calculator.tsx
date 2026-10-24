"use client";

import { LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { DateRangePicker } from "@/components/ui/date-picker";
import { useFormat } from "@/i18n/format";
import { getPublicQuote, type Property, type Quote } from "@/lib/api/properties";
import { cn } from "@/lib/utils";

/** The rental's rules in a line each: minimum stay and the discounts it offers. */
export function useRuleLines(property: Pick<
  Property,
  | "minStay"
  | "weeklyDiscountPct"
  | "monthlyDiscountPct"
  | "lastMinuteDiscountPct"
  | "lastMinuteDays"
  | "earlyBirdDiscountPct"
  | "earlyBirdDays"
>) {
  const t = useTranslations("site.stay");
  const { number } = useFormat();
  const pct = (value: number) => number(value / 100, { style: "percent", maximumFractionDigits: 1 });
  return [
    property.minStay && property.minStay > 1 ? t("rules.minStay", { count: property.minStay }) : null,
    property.weeklyDiscountPct ? t("rules.weekly", { pct: pct(property.weeklyDiscountPct) }) : null,
    property.monthlyDiscountPct ? t("rules.monthly", { pct: pct(property.monthlyDiscountPct) }) : null,
    property.lastMinuteDiscountPct && property.lastMinuteDays
      ? t("rules.lastMinute", { pct: pct(property.lastMinuteDiscountPct), count: property.lastMinuteDays })
      : null,
    property.earlyBirdDiscountPct && property.earlyBirdDays
      ? t("rules.earlyBird", { pct: pct(property.earlyBirdDiscountPct), count: property.earlyBirdDays })
      : null,
  ].filter(Boolean) as string[];
}

/** A quote's lines, discounts and total; also used by the dashboard's "try a price". */
export function QuoteBreakdown({ quote, className }: { quote: Quote; className?: string }) {
  const t = useTranslations("site.stay");
  const { money, number } = useFormat();
  const amount = (value: number) => money(quote.currency, value, { maximumFractionDigits: 2 });
  return (
    <div className={cn("flex flex-col gap-2 text-sm", className)}>
      {quote.lines.map((line, index) => (
        <div key={index} className="flex items-baseline justify-between gap-3">
          <span className="opacity-75">
            {line.price == null
              ? t("onRequest", { count: line.nights })
              : t("line", { count: line.nights, price: amount(line.price) })}
            {line.label && ` · ${line.label}`}
          </span>
          <span className="tabular-nums">{line.amount == null ? "—" : amount(line.amount)}</span>
        </div>
      ))}
      {quote.discounts.map((discount) => (
        <div key={discount.kind} className="flex items-baseline justify-between gap-3">
          <span className="opacity-75">
            {t(`discounts.${discount.kind}`, { pct: number(discount.pct / 100, { style: "percent", maximumFractionDigits: 1 }) })}
          </span>
          <span className="tabular-nums">−{amount(discount.amount)}</span>
        </div>
      ))}
      <div className="flex items-baseline justify-between gap-3 border-t border-current/15 pt-2 font-medium">
        <span>{t("total", { count: quote.nights })}</span>
        <span className="tabular-nums">{quote.total == null ? t("totalOnRequest") : amount(quote.total)}</span>
      </div>
      {!quote.meetsMinStay && <p className="text-amber-700 dark:text-amber-400">{t("minStayWarning", { count: quote.minStay })}</p>}
      {!quote.available && <p className="text-amber-700 dark:text-amber-400">{t("unavailable")}</p>}
    </div>
  );
}

/**
 * "Calculá tu estadía" on a rental's public page: pick the dates and see the
 * price night by night with the discounts that apply, from the agency's own
 * rates. Only an estimate: the agency confirms it.
 */
export function StayCalculator({ agencySlug, property }: { agencySlug: string; property: Property }) {
  const t = useTranslations("site.stay");
  const rules = useRuleLines(property);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!start || !end) return;
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setFailed(false);
    getPublicQuote(agencySlug, property.slug, start, end)
      .then((result) => !cancelled && setQuote(result))
      .catch(() => !cancelled && setFailed(true))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [agencySlug, property.slug, start, end]);

  return (
    <div className="flex flex-col gap-3 border-t border-site-line pt-6">
      <h2 className="s-heading text-lg">{t("title")}</h2>
      {rules.length > 0 && (
        <ul className="flex flex-col gap-1 text-sm text-site-quiet">
          {rules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      )}
      <DateRangePicker
        start={start}
        end={end}
        minDate={new Date()}
        placeholder={t("pickDates")}
        onChange={(from, to) => {
          setStart(from);
          setEnd(to);
          if (!from || !to) setQuote(null);
        }}
      />
      {loading && <LoaderCircle className="size-4 animate-spin text-site-quiet" aria-label={t("loading")} />}
      {failed && <p className="text-sm text-site-quiet">{t("failed")}</p>}
      {quote && !loading && start && end && (
        <>
          <QuoteBreakdown quote={quote} />
          <p className="text-xs text-site-quiet">{t("estimate")}</p>
        </>
      )}
    </div>
  );
}
