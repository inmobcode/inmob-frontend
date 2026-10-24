"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { useFormat } from "@/i18n/format";
import type { Conversion, MoneyMonth, OccupancyRow, TeamRow } from "@/lib/api/reports";
import { niceScale } from "@/lib/reports";
import { cn } from "@/lib/utils";

const PANEL = "rounded-3xl bg-card p-5 shadow-[0_1px_2px_oklch(0.3_0.05_160/0.04),0_12px_32px_-12px_oklch(0.3_0.05_160/0.14)] ring-1 ring-foreground/5 sm:p-6";

/** A month key (yyyy-MM) as a date in the middle of it, so no time zone moves it. */
const monthDate = (month: string) => new Date(`${month}-15T12:00:00`);

export function ReportPanel({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn(PANEL, "flex flex-col gap-5", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <h2 className="font-display text-xl leading-tight">{title}</h2>
          {description && <p className="text-sm text-pretty text-muted-foreground">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

/** One headline figure, with what it means under it. */
export function StatTile({ label, value, hint }: { label: string; value: React.ReactNode; hint?: string }) {
  return (
    <div className={cn(PANEL, "flex flex-col gap-1.5")}>
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-display text-3xl leading-none tracking-tight tabular-nums">{value}</span>
      {hint && <span className="text-xs text-pretty text-muted-foreground">{hint}</span>}
    </div>
  );
}

const SERIES = [
  { key: "booked", swatch: "bg-report-booked" },
  { key: "collected", swatch: "bg-report-collected" },
] as const;

function Legend() {
  const t = useTranslations("reports.money");
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
      {SERIES.map((series) => (
        <li key={series.key} className="flex items-center gap-1.5">
          <span aria-hidden className={cn("size-2.5 rounded-[3px]", series.swatch)} />
          {t(series.key)}
        </li>
      ))}
    </ul>
  );
}

/**
 * Booked and collected per month, side by side on one money axis, with a
 * tooltip per month (also the commission and how many bookings). The same
 * numbers as a table one click away.
 */
export function MonthlyMoney({ rows, currency }: { rows: MoneyMonth[]; currency: string }) {
  const t = useTranslations("reports.money");
  const { date, number, money } = useFormat();
  const [asTable, setAsTable] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const max = Math.max(0, ...rows.flatMap((row) => [row.booked, row.collected]));
  const { top, ticks } = niceScale(max);
  // With many months, every other label, so they don't run into each other.
  const labelEvery = rows.length > 12 ? 2 : 1;
  const compact = (value: number) => number(value, { notation: "compact", maximumFractionDigits: 1 });
  const amount = (value: number) => money(currency, value);

  return (
    <ReportPanel
      title={t("title")}
      description={t("description")}
      action={
        <button
          type="button"
          onClick={() => setAsTable(!asTable)}
          className="rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground outline-none transition-colors hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {asTable ? t("asChart") : t("asTable")}
        </button>
      }
    >
      {asTable ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground">
                <th className="py-2 pr-3 font-medium">{t("month")}</th>
                <th className="py-2 pr-3 text-right font-medium">{t("booked")}</th>
                <th className="py-2 pr-3 text-right font-medium">{t("collected")}</th>
                <th className="py-2 pr-3 text-right font-medium">{t("commission")}</th>
                <th className="py-2 text-right font-medium">{t("bookings")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.month} className="border-t border-foreground/5 tabular-nums">
                  <td className="py-2 pr-3 first-letter:uppercase">{date(monthDate(row.month), "monthYear")}</td>
                  <td className="py-2 pr-3 text-right">{amount(row.booked)}</td>
                  <td className="py-2 pr-3 text-right">{amount(row.collected)}</td>
                  <td className="py-2 pr-3 text-right">{amount(row.commission)}</td>
                  <td className="py-2 text-right">{row.bookings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <Legend />
          {/* Room above the plot for the top value label. */}
          <div className="mt-3 flex gap-2">
            {/* Value axis: recessive, labels only. */}
            <div aria-hidden className="relative h-56 w-12 shrink-0 text-right text-[11px] text-muted-foreground tabular-nums">
              {ticks.map((tick) => (
                <span key={tick} className="absolute right-0 -translate-y-1/2" style={{ bottom: `${(tick / top) * 100}%` }}>
                  {compact(tick)}
                </span>
              ))}
            </div>
            <div className="relative min-w-0 flex-1">
              <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-56">
                {ticks.map((tick) => (
                  <span
                    key={tick}
                    className={cn("absolute inset-x-0 border-t", tick === 0 ? "border-foreground/20" : "border-foreground/[0.06]")}
                    style={{ bottom: `${(tick / top) * 100}%` }}
                  />
                ))}
              </div>
              <ol className="relative flex h-56 items-end" aria-label={t("chartLabel", { currency })}>
                {rows.map((row) => {
                  const open = active === row.month;
                  return (
                    <li
                      key={row.month}
                      tabIndex={0}
                      onMouseEnter={() => setActive(row.month)}
                      onMouseLeave={() => setActive((current) => (current === row.month ? null : current))}
                      onFocus={() => setActive(row.month)}
                      onBlur={() => setActive((current) => (current === row.month ? null : current))}
                      aria-label={t("monthSummary", {
                        month: date(monthDate(row.month), "monthYear"),
                        booked: amount(row.booked),
                        collected: amount(row.collected),
                      })}
                      // The whole column is the hit target, not just the bars.
                      className={cn(
                        "group relative flex h-full min-w-0 flex-1 items-end justify-center gap-[2px] rounded-lg px-[3px] outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                        open && "bg-foreground/[0.04]",
                      )}
                    >
                      {SERIES.map((series) => (
                        <span
                          key={series.key}
                          className={cn("w-full max-w-5 rounded-t-[4px]", series.swatch)}
                          style={{ height: `${(row[series.key] / top) * 100}%`, minHeight: row[series.key] > 0 ? 2 : 0 }}
                        />
                      ))}
                      {open && (
                        <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-max min-w-44 -translate-x-1/2 rounded-xl bg-popover px-3 py-2.5 text-xs text-popover-foreground shadow-lg ring-1 ring-foreground/10">
                          <p className="mb-1.5 font-medium first-letter:uppercase">{date(monthDate(row.month), "monthYear")}</p>
                          <dl className="grid grid-cols-[auto_auto] gap-x-4 gap-y-1 tabular-nums">
                            {SERIES.map((series) => (
                              <div key={series.key} className="contents">
                                <dt className="flex items-center gap-1.5 text-muted-foreground">
                                  <span aria-hidden className={cn("size-2 rounded-[2px]", series.swatch)} />
                                  {t(series.key)}
                                </dt>
                                <dd className="text-right">{amount(row[series.key])}</dd>
                              </div>
                            ))}
                            <dt className="text-muted-foreground">{t("commission")}</dt>
                            <dd className="text-right">{amount(row.commission)}</dd>
                            <dt className="text-muted-foreground">{t("bookings")}</dt>
                            <dd className="text-right">{row.bookings}</dd>
                          </dl>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>
              <div aria-hidden className="mt-2 flex">
                {rows.map((row, index) => (
                  <span key={row.month} className="min-w-0 flex-1 truncate text-center text-[11px] text-muted-foreground">
                    {index % labelEvery === 0
                      ? date(monthDate(row.month), index === 0 || row.month.endsWith("-01") ? "monthShortYear" : "monthShort")
                      : ""}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </ReportPanel>
  );
}

/** Each rental's occupancy as a bar, best first, with what makes up the nights under it. */
export function OccupancyList({ rows }: { rows: OccupancyRow[] }) {
  const t = useTranslations("reports.occupancy");
  const { number } = useFormat();
  const percent = (value: number) => number(value, { style: "percent", maximumFractionDigits: 0 });

  return (
    <ReportPanel title={t("title")} description={t("description")}>
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("empty")}</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {rows.map((row) => (
            <li key={row.propertyId} className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="min-w-0 truncate font-medium" title={row.title}>
                  {row.title}
                </span>
                <span className="shrink-0 tabular-nums">{row.rate == null ? "—" : percent(row.rate)}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-foreground/[0.07]">
                <div className="h-full rounded-full bg-report-booked" style={{ width: `${(row.rate ?? 0) * 100}%` }} />
              </div>
              <p className="text-xs text-muted-foreground tabular-nums">
                {t("nights", { taken: row.booked + row.external, available: row.nights - row.blocked })}
                {row.external > 0 && ` · ${t("external", { count: row.external })}`}
                {row.blocked > 0 && ` · ${t("blocked", { count: row.blocked })}`}
              </p>
            </li>
          ))}
        </ul>
      )}
    </ReportPanel>
  );
}

/** From inquiry to booking: each step with how many of the people who wrote in got there. */
export function ConversionFunnel({ data }: { data: Conversion }) {
  const t = useTranslations("reports.conversion");
  const { number } = useFormat();
  const percent = (value: number) => number(value, { style: "percent", maximumFractionDigits: 0 });
  const share = (value: number) => (data.clients > 0 ? percent(value / data.clients) : "—");
  const steps = [
    { key: "inquiries", value: data.inquiries, share: null },
    { key: "clients", value: data.clients, share: null },
    { key: "offered", value: data.offered, share: share(data.offered) },
    { key: "booked", value: data.booked, share: share(data.booked) },
  ] as const;

  return (
    <ReportPanel title={t("title")} description={t("description")}>
      <ol className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-foreground/[0.06]">
        {steps.map((step) => (
          <li key={step.key} className="flex flex-col gap-1 bg-card p-4">
            <span className="text-xs text-muted-foreground">{t(`steps.${step.key}`)}</span>
            <span className="font-display text-2xl leading-none tabular-nums">{step.value}</span>
            {step.share && <span className="text-xs text-muted-foreground tabular-nums">{t("ofPeople", { share: step.share })}</span>}
          </li>
        ))}
      </ol>
      {data.byType.length > 0 && (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="text-left text-xs text-muted-foreground">
              <th className="py-2 pr-3 font-medium">{t("source")}</th>
              <th className="py-2 pr-3 text-right font-medium">{t("steps.clients")}</th>
              <th className="py-2 pr-3 text-right font-medium">{t("steps.booked")}</th>
              <th className="py-2 text-right font-medium">{t("rate")}</th>
            </tr>
          </thead>
          <tbody>
            {data.byType.map((row) => (
              <tr key={row.type} className="border-t border-foreground/5 tabular-nums">
                <td className="py-2 pr-3">{t(`types.${row.type}`)}</td>
                <td className="py-2 pr-3 text-right">{row.clients}</td>
                <td className="py-2 pr-3 text-right">{row.booked}</td>
                <td className="py-2 text-right">{row.clients > 0 ? percent(row.booked / row.clients) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p className="text-sm text-muted-foreground">
        {data.replied > 0 && data.medianReplyHours != null
          ? t("replies", { count: data.replied, hours: number(data.medianReplyHours, { maximumFractionDigits: 1 }) })
          : t("noReplies")}
      </p>
    </ReportPanel>
  );
}

/** Each team member's results in the period, the amounts in the chosen currency. */
export function TeamTable({ rows, currency }: { rows: TeamRow[]; currency: string }) {
  const t = useTranslations("reports.team");
  const roles = useTranslations("team.roles");
  const { money } = useFormat();

  return (
    <ReportPanel title={t("title")} description={t("description", { currency })}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="text-left text-xs text-muted-foreground">
              <th className="py-2 pr-3 font-medium">{t("member")}</th>
              <th className="py-2 pr-3 text-right font-medium">{t("clients")}</th>
              <th className="py-2 pr-3 text-right font-medium">{t("offers")}</th>
              <th className="py-2 pr-3 text-right font-medium">{t("bookings")}</th>
              <th className="py-2 pr-3 text-right font-medium">{t("booked")}</th>
              <th className="py-2 text-right font-medium">{t("commission")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.userId} className={cn("border-t border-foreground/5 tabular-nums", !row.active && "text-muted-foreground")}>
                <td className="py-2.5 pr-3">
                  <span className="font-medium">{row.name}</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {roles(row.role)}
                    {!row.active && ` · ${t("inactive")}`}
                  </span>
                </td>
                <td className="py-2.5 pr-3 text-right">{row.clients}</td>
                <td className="py-2.5 pr-3 text-right">{row.offers}</td>
                <td className="py-2.5 pr-3 text-right">{row.bookings}</td>
                <td className="py-2.5 pr-3 text-right">{money(currency, row.booked[currency] ?? 0)}</td>
                <td className="py-2.5 text-right">{money(currency, row.commission[currency] ?? 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ReportPanel>
  );
}
