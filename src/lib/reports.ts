import { endOfMonth, endOfYear, format, startOfMonth, startOfYear, subMonths, subYears } from "date-fns";

import type { MoneyMonth, OccupancyRow } from "@/lib/api/reports";

/** The periods the reports page offers, as keys of "reports.periods". */
export const PERIODS = ["3m", "6m", "12m", "year", "lastYear"] as const;
export type Period = (typeof PERIODS)[number];

const day = (value: Date) => format(value, "yyyy-MM-dd");

/** Whole months, this one included for the rolling periods. */
export function periodRange(period: Period, today = new Date()): { from: string; to: string } {
  switch (period) {
    case "year":
      return { from: day(startOfYear(today)), to: day(endOfMonth(today)) };
    case "lastYear": {
      const last = subYears(today, 1);
      return { from: day(startOfYear(last)), to: day(endOfYear(last)) };
    }
    default: {
      const months = Number(period.replace("m", ""));
      return { from: day(startOfMonth(subMonths(today, months - 1))), to: day(endOfMonth(today)) };
    }
  }
}

/** Sums of a currency's months. */
export function moneyTotals(rows: MoneyMonth[]) {
  return rows.reduce(
    (sum, row) => ({
      booked: sum.booked + row.booked,
      collected: sum.collected + row.collected,
      commission: sum.commission + row.commission,
      bookings: sum.bookings + row.bookings,
    }),
    { booked: 0, collected: 0, commission: 0, bookings: 0 },
  );
}

/**
 * The agency's occupancy over all its rentals: taken nights over available
 * ones, so a property with more nights on the market weighs more. Null
 * when no night was available.
 */
export function overallOccupancy(rows: OccupancyRow[]) {
  let taken = 0;
  let available = 0;
  for (const row of rows) {
    taken += row.booked + row.external;
    available += row.nights - row.blocked;
  }
  return available > 0 ? taken / available : null;
}

/**
 * A round top for a value axis and its steps: 0, step, 2·step… ≥ max, using
 * 1, 2, 2.5 or 5 times a power of ten, about `count` steps.
 */
export function niceScale(max: number, count = 4) {
  if (!(max > 0)) return { top: 1, ticks: [0, 1] };
  const raw = max / count;
  const power = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((factor) => factor * power).find((candidate) => candidate >= raw) ?? 10 * power;
  const top = Math.ceil(max / step) * step;
  const ticks = Array.from({ length: Math.round(top / step) + 1 }, (_, index) => index * step);
  return { top, ticks };
}
