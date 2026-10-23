import { eachDayOfInterval, format } from "date-fns";
import { useTranslations } from "next-intl";
import { Fragment } from "react";

import type { AvailabilityCalendarProperty } from "@/lib/api/availability";
import { formatPrice, placeOf } from "@/components/public/property-card";
import { useFormat } from "@/i18n/format";
import { dayKind } from "@/lib/availability-range";
import { placeKey, placeLabel } from "@/lib/places";
import { cn } from "@/lib/utils";

const CELL = "h-8 w-8 shrink-0 rounded-sm sm:h-9 sm:w-9";

function toDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function regionOf(property: AvailabilityCalendarProperty, other: string): string {
  return property.region || property.area || property.country || other;
}

// The sticky header is opaque, so the mark is mixed into the card color instead of laid over it.
const MARKED_HEAD = "bg-[color-mix(in_oklch,var(--card),var(--highlight)_45%)]";

export type AvailabilityRow = AvailabilityCalendarProperty & {
  /** Where the property name links to. Resolved up front by the caller
   * (editor path, or public listing path) instead of a function prop, which
   * can't cross from a server page into this client-rendered grid. */
  href?: string;
};

/**
 * The agency-wide availability grid: one row per rental listing, one column
 * per day.
 */
export function AvailabilityGrid({
  from,
  to,
  properties,
  openLinksInNewTab = false,
  highlight = null,
}: {
  from: string;
  to: string;
  properties: AvailabilityRow[];
  /** The public calendar opens a listing beside itself: the visitor was reading dates. */
  openLinksInNewTab?: boolean;
  /** Days (inclusive, yyyy-MM-dd) to mark, e.g. the stay someone is looking for. */
  highlight?: { start: string; end: string } | null;
}) {
  const t = useTranslations("availability.grid");
  const { tag, dateLocale } = useFormat();
  const startDate = new Date(`${from}T00:00:00`);
  const endDate = new Date(`${to}T00:00:00`);
  const dateRange = startDate <= endDate ? eachDayOfInterval({ start: startDate, end: endDate }) : [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = toDateStr(today);

  // Group by place however it was spelled ("Islas Baleares" and "islas baleares" are one group).
  const regions = new Map<string, { label: string; rows: AvailabilityRow[] }>();
  for (const property of properties) {
    const name = regionOf(property, t("otherLocation"));
    const key = placeKey(name);
    if (!regions.has(key)) regions.set(key, { label: placeLabel(name), rows: [] });
    regions.get(key)!.rows.push(property);
  }
  const regionGroups = Array.from(regions.entries()).sort(([, a], [, b]) => a.label.localeCompare(b.label, "es"));

  if (dateRange.length === 0 || properties.length === 0) {
    return <p className="text-sm text-muted-foreground">{t("nothing")}</p>;
  }

  return (
    <div className="max-h-[70vh] max-w-full overflow-auto rounded-2xl ring-1 ring-foreground/5 [-webkit-overflow-scrolling:touch]">
      <table className="w-full min-w-max table-fixed border-collapse">
        <thead>
          <tr>
            <th
              scope="col"
              className="sticky top-0 left-0 z-30 h-16 w-[160px] min-w-[160px] border-r border-b border-foreground/5 bg-card p-3 text-left align-middle text-xs font-medium text-muted-foreground sm:w-[260px] sm:min-w-[260px]"
            >
              {t("property")}
            </th>
            {dateRange.map((date, i) => {
              const dateStr = toDateStr(date);
              const isToday = dateStr === todayStr;
              const isMonthStart = i === 0 || date.getDate() === 1;
              const marked = !!highlight && dateStr >= highlight.start && dateStr <= highlight.end;
              return (
                <th
                  key={dateStr}
                  scope="col"
                  className={cn(
                    "sticky top-0 z-20 h-16 w-10 min-w-10 border-b border-foreground/5 bg-card p-1 text-center align-middle sm:w-11 sm:min-w-11",
                    isMonthStart && i !== 0 && "border-l border-foreground/10",
                    isToday && "bg-primary/10",
                    marked && MARKED_HEAD,
                  )}
                >
                  <div className="text-[10px] tracking-wide text-muted-foreground uppercase">
                    {format(date, "EEE", { locale: dateLocale })}
                  </div>
                  <div className={cn("font-display text-sm leading-none", isToday && "text-primary")}>
                    {format(date, "d")}
                  </div>
                  <div className="h-2.5 text-[9px] text-muted-foreground uppercase">
                    {isMonthStart ? format(date, "MMM", { locale: dateLocale }) : ""}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {regionGroups.map(([key, { label, rows: group }]) => (
            <Fragment key={key}>
              <tr className="bg-foreground/[0.03]">
                <td className="sticky left-0 z-10 border-r border-b border-foreground/5 bg-foreground/[0.03] px-3 py-1.5 text-xs font-medium text-muted-foreground">
                  {label} · {group.length}
                </td>
                <td colSpan={dateRange.length} className="border-b border-foreground/5" />
              </tr>
              {group.map((property) => {
                const href = property.href;
                const price = formatPrice(property, tag);
                const place = placeOf(property);
                const blocked = new Set(property.blockedDates);
                const pending = new Set(property.pendingDates ?? []);

                return (
                  <tr key={property.id}>
                    <td className="sticky left-0 z-10 border-r border-b border-foreground/5 bg-card p-3 align-top">
                      {href ? (
                        <a
                          href={href}
                          target={openLinksInNewTab ? "_blank" : undefined}
                          rel={openLinksInNewTab ? "noreferrer" : undefined}
                          className="line-clamp-2 font-display text-sm leading-snug outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-ring/50"
                        >
                          {property.title}
                        </a>
                      ) : (
                        <p className="line-clamp-2 font-display text-sm leading-snug">{property.title}</p>
                      )}
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {place}
                        {price ? ` · ${t("perNight", { price })}` : ""}
                      </p>
                    </td>
                    {dateRange.map((date, i) => {
                      const dateStr = toDateStr(date);
                      const isPast = date < today;
                      const isToday = dateStr === todayStr;
                      const isMonthStart = i === 0 || date.getDate() === 1;
                      const marked = !!highlight && dateStr >= highlight.start && dateStr <= highlight.end;
                      const isBlocked = blocked.has(dateStr);
                      const dayLabel = format(date, "EEE d MMM", { locale: dateLocale });
                      const tdClass = cn(
                        "border-b border-foreground/5 p-1 text-center",
                        isMonthStart && i !== 0 && "border-l border-foreground/10",
                        isToday && "bg-primary/10",
                        marked && "bg-highlight/35",
                      );

                      if (isPast) {
                        return (
                          <td key={dateStr} title={`${dayLabel} — ${t("past")}`} className={tdClass}>
                            <div className={cn(CELL, "mx-auto bg-muted")} />
                          </td>
                        );
                      }

                      // A pending booking holds no dates yet, so it only paints days nobody else has.
                      const pendingKind = isBlocked ? "free" : dayKind(pending, dateStr);
                      if (pendingKind === "busy" || pendingKind === "in" || pendingKind === "out") {
                        const label =
                          pendingKind === "busy" ? t("pending") : t(pendingKind === "in" ? "pendingIn" : "pendingOut");
                        return (
                          <td key={dateStr} title={`${dayLabel} — ${label}`} className={tdClass}>
                            <div className={cn(CELL, "relative mx-auto overflow-hidden")}>
                              <div className="absolute inset-0 bg-primary" />
                              <div
                                className="absolute inset-0 bg-amber-400"
                                style={{
                                  clipPath:
                                    pendingKind === "busy"
                                      ? undefined
                                      : pendingKind === "in"
                                        ? "polygon(100% 0, 100% 100%, 0 100%)"
                                        : "polygon(0 0, 100% 0, 0 100%)",
                                }}
                              />
                            </div>
                          </td>
                        );
                      }

                      if (!isBlocked) {
                        return (
                          <td key={dateStr} title={`${dayLabel} — ${t("available")}`} className={tdClass}>
                            <div className={cn(CELL, "mx-auto bg-primary")} />
                          </td>
                        );
                      }

                      const prevBlocked = blocked.has(toDateStr(addDays(date, -1)));
                      const nextBlocked = blocked.has(toDateStr(addDays(date, 1)));
                      const isCheckIn = !prevBlocked;
                      const isCheckOut = !nextBlocked;

                      if (!isCheckIn && !isCheckOut) {
                        return (
                          <td key={dateStr} title={`${dayLabel} — ${t("booked")}`} className={tdClass}>
                            <div className={cn(CELL, "mx-auto bg-destructive")} />
                          </td>
                        );
                      }

                      const label = isCheckIn && isCheckOut ? t("turnover") : isCheckIn ? t("checkIn") : t("checkOut");
                      return (
                        <td key={dateStr} title={`${dayLabel} — ${label}`} className={tdClass}>
                          <div className={cn(CELL, "relative mx-auto overflow-hidden")}>
                            <div
                              className="absolute inset-0 bg-primary"
                              style={{ clipPath: isCheckIn ? "polygon(0 0, 100% 0, 0 100%)" : "polygon(100% 0, 100% 100%, 0 100%)" }}
                            />
                            <div
                              className="absolute inset-0 bg-destructive"
                              style={{ clipPath: isCheckIn ? "polygon(100% 0, 100% 100%, 0 100%)" : "polygon(0 0, 100% 0, 0 100%)" }}
                            />
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
