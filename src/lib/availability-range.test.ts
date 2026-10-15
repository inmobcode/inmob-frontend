import { describe, expect, it } from "vitest";

import { isFreeFor } from "./availability-range";

// A booking from the 10th (check-in) to the 14th (check-out) blocks 10..14.
const booked = ["2026-11-10", "2026-11-11", "2026-11-12", "2026-11-13", "2026-11-14"];

describe("isFreeFor", () => {
  it("is free when nothing is blocked", () => {
    expect(isFreeFor([], "2026-11-01", "2026-11-05")).toBe(true);
  });
  it("is taken when a night falls inside a booking", () => {
    expect(isFreeFor(booked, "2026-11-08", "2026-11-11")).toBe(false);
    expect(isFreeFor(booked, "2026-11-12", "2026-11-13")).toBe(false);
  });
  it("lets a stay end on a check-in day and start on a check-out day", () => {
    expect(isFreeFor(booked, "2026-11-07", "2026-11-10")).toBe(true);
    expect(isFreeFor(booked, "2026-11-14", "2026-11-17")).toBe(true);
  });
  it("handles back-to-back bookings and month ends", () => {
    const backToBack = [...booked, "2026-11-15", "2026-11-16"];
    expect(isFreeFor(backToBack, "2026-11-14", "2026-11-15")).toBe(false);
    expect(isFreeFor([], "2026-10-30", "2026-11-02")).toBe(true);
  });
});
