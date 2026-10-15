import { describe, expect, it } from "vitest";

import { dayKind, isFreeFor, nightTaken, stayFromDrag } from "./availability-range";

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

describe("dayKind / nightTaken", () => {
  const blocked = new Set(["2026-11-10", "2026-11-11", "2026-11-12", "2026-11-20"]);
  it("tells check-in, inside, check-out and one-day blocks apart", () => {
    expect(dayKind(blocked, "2026-11-09")).toBe("free");
    expect(dayKind(blocked, "2026-11-10")).toBe("in");
    expect(dayKind(blocked, "2026-11-11")).toBe("busy");
    expect(dayKind(blocked, "2026-11-12")).toBe("out");
    expect(dayKind(blocked, "2026-11-20")).toBe("turnover");
  });
  it("counts a night only when the day and the next are blocked", () => {
    expect(nightTaken(blocked, "2026-11-11")).toBe(true);
    expect(nightTaken(blocked, "2026-11-12")).toBe(false);
    expect(nightTaken(blocked, "2026-11-20")).toBe(false);
  });
});

describe("stayFromDrag", () => {
  it("covers the dragged days as nights, in either direction", () => {
    expect(stayFromDrag("2026-11-20", "2026-11-22")).toEqual({ first: "2026-11-20", last: "2026-11-22", checkOut: "2026-11-23", nights: 3 });
    expect(stayFromDrag("2026-11-22", "2026-11-20").first).toBe("2026-11-20");
    expect(stayFromDrag("2026-11-30", "2026-11-30")).toEqual({ first: "2026-11-30", last: "2026-11-30", checkOut: "2026-12-01", nights: 1 });
  });
});
