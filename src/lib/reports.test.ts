import { describe, expect, it } from "vitest";

import type { OccupancyRow } from "@/lib/api/reports";

import { moneyTotals, niceScale, overallOccupancy, periodRange } from "./reports";

describe("periodRange", () => {
  const today = new Date(2026, 9, 24);

  it("covers whole months, this one included", () => {
    expect(periodRange("3m", today)).toEqual({ from: "2026-08-01", to: "2026-10-31" });
    expect(periodRange("12m", today)).toEqual({ from: "2025-11-01", to: "2026-10-31" });
  });

  it("has this year so far and last year", () => {
    expect(periodRange("year", today)).toEqual({ from: "2026-01-01", to: "2026-10-31" });
    expect(periodRange("lastYear", today)).toEqual({ from: "2025-01-01", to: "2025-12-31" });
  });
});

describe("niceScale", () => {
  it("rounds the top up to 1, 2, 2.5 or 5 steps", () => {
    expect(niceScale(870)).toEqual({ top: 1000, ticks: [0, 250, 500, 750, 1000] });
    expect(niceScale(4200)).toEqual({ top: 6000, ticks: [0, 2000, 4000, 6000] });
    expect(niceScale(0)).toEqual({ top: 1, ticks: [0, 1] });
  });
});

describe("overallOccupancy", () => {
  const row = (nights: number, booked: number, external: number, blocked: number) =>
    ({ nights, booked, external, blocked }) as OccupancyRow;

  it("weighs each property by its available nights", () => {
    expect(overallOccupancy([row(30, 15, 0, 0), row(30, 0, 5, 20)])).toBeCloseTo(20 / 40);
  });

  it("is null with nothing available", () => {
    expect(overallOccupancy([row(30, 0, 0, 30)])).toBeNull();
    expect(overallOccupancy([])).toBeNull();
  });
});

describe("moneyTotals", () => {
  it("adds up the months", () => {
    const month = (booked: number, collected: number) => ({ month: "2026-01", booked, collected, commission: 10, bookings: 1 });
    expect(moneyTotals([month(100, 50), month(200, 0)])).toEqual({ booked: 300, collected: 50, commission: 20, bookings: 2 });
  });
});
