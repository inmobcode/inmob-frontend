import { eachDayOfInterval, format } from "date-fns";
import { es } from "date-fns/locale";
import { Fragment } from "react";

import type { AvailabilityCalendarProperty } from "@/lib/api/availability";
import { formatPrice, placeOf } from "@/components/public/property-card";
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

function regionOf(property: AvailabilityCalendarProperty): string {
  return property.region || property.area || property.country || "Otra ubicación";
}

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
}: {
  from: string;
  to: string;
  properties: AvailabilityRow[];
  /** The public calendar opens a listing beside itself: the visitor was reading dates. */
  openLinksInNewTab?: boolean;
}) {
  const startDate = new Date(`${from}T00:00:00`);
  const endDate = new Date(`${to}T00:00:00`);
  const dateRange = startDate <= endDate ? eachDayOfInterval({ start: startDate, end: endDate }) : [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = toDateStr(today);

  const regions = new Map<string, AvailabilityRow[]>();
  for (const property of properties) {
    const key = regionOf(property);
    if (!regions.has(key)) regions.set(key, []);
    regions.get(key)!.push(property);
  }
  const regionGroups = Array.from(regions.entries()).sort(([a], [b]) => a.localeCompare(b));

  if (dateRange.length === 0 || properties.length === 0) {
    return <p className="text-sm text-muted-foreground">No hay propiedades para mostrar.</p>;
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
              Propiedad
            </th>
            {dateRange.map((date, i) => {
              const dateStr = toDateStr(date);
              const isToday = dateStr === todayStr;
              const isMonthStart = i === 0 || date.getDate() === 1;
              return (
                <th
                  key={dateStr}
                  scope="col"
                  className={cn(
                    "sticky top-0 z-20 h-16 w-10 min-w-10 border-b border-foreground/5 bg-card p-1 text-center align-middle sm:w-11 sm:min-w-11",
                    isMonthStart && i !== 0 && "border-l border-foreground/10",
                    isToday && "bg-primary/10",
                  )}
                >
                  <div className="text-[10px] tracking-wide text-muted-foreground uppercase">
                    {format(date, "EEE", { locale: es })}
                  </div>
                  <div className={cn("font-display text-sm leading-none", isToday && "text-primary")}>
                    {format(date, "d")}
                  </div>
                  <div className="h-2.5 text-[9px] text-muted-foreground uppercase">
                    {isMonthStart ? format(date, "MMM", { locale: es }) : ""}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {regionGroups.map(([region, group]) => (
            <Fragment key={region}>
              <tr className="bg-foreground/[0.03]">
                <td className="sticky left-0 z-10 border-r border-b border-foreground/5 bg-foreground/[0.03] px-3 py-1.5 text-xs font-medium text-muted-foreground uppercase">
                  {region} · {group.length}
                </td>
                <td colSpan={dateRange.length} className="border-b border-foreground/5" />
              </tr>
              {group.map((property) => {
                const href = property.href;
                const price = formatPrice(property);
                const place = placeOf(property);
                const blocked = new Set(property.blockedDates);

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
                        {price ? ` · ${price}/noche` : ""}
                      </p>
                    </td>
                    {dateRange.map((date, i) => {
                      const dateStr = toDateStr(date);
                      const isPast = date < today;
                      const isToday = dateStr === todayStr;
                      const isMonthStart = i === 0 || date.getDate() === 1;
                      const isBlocked = blocked.has(dateStr);
                      const dayLabel = format(date, "EEE d MMM", { locale: es });
                      const tdClass = cn(
                        "border-b border-foreground/5 p-1 text-center",
                        isMonthStart && i !== 0 && "border-l border-foreground/10",
                        isToday && "bg-primary/10",
                      );

                      if (isPast) {
                        return (
                          <td key={dateStr} title={`${dayLabel} — Pasado`} className={tdClass}>
                            <div className={cn(CELL, "mx-auto bg-muted")} />
                          </td>
                        );
                      }

                      if (!isBlocked) {
                        return (
                          <td key={dateStr} title={`${dayLabel} — Disponible`} className={tdClass}>
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
                          <td key={dateStr} title={`${dayLabel} — Reservado`} className={tdClass}>
                            <div className={cn(CELL, "mx-auto bg-destructive")} />
                          </td>
                        );
                      }

                      const label = isCheckIn && isCheckOut ? "Check-in / check-out" : isCheckIn ? "Check-in" : "Check-out";
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
