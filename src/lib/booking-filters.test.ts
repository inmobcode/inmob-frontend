import { describe, expect, it } from "vitest";

import type { Booking, Payment } from "@/lib/api/bookings";

import {
  applyBookingFilters,
  countBookingFilters,
  NO_BOOKING_FILTERS,
  paymentStateOf,
  placeContains,
  staysWithin,
  type BookingFilters,
} from "./booking-filters";

const pay = (amount: number, status: Payment["status"], type: Payment["type"] = "DEPOSIT") =>
  ({ amount, status, type }) as Payment;

describe("paymentStateOf", () => {
  it("compares what was collected with the total", () => {
    expect(paymentStateOf({ totalPrice: 1000, payments: [] })).toBe("UNPAID");
    expect(paymentStateOf({ totalPrice: 1000, payments: [pay(300, "PAID"), pay(700, "PENDING")] })).toBe("PARTIAL");
    expect(paymentStateOf({ totalPrice: 1000, payments: [pay(300, "PAID"), pay(700, "PAID")] })).toBe("PAID");
  });

  it("leaves the agency's commission out", () => {
    expect(paymentStateOf({ totalPrice: 1000, payments: [pay(150, "PAID", "COMMISSION")] })).toBe("UNPAID");
  });

  it("uses the planned payments when there's no total", () => {
    expect(paymentStateOf({ totalPrice: null, payments: [pay(200, "PAID"), pay(200, "PENDING")] })).toBe("PARTIAL");
    expect(paymentStateOf({ totalPrice: null, payments: [pay(200, "PAID")] })).toBe("PAID");
  });
});

describe("staysWithin", () => {
  const stay = { startDate: "2026-12-10", endDate: "2026-12-15" };

  it("matches stays that touch the range", () => {
    expect(staysWithin(stay, "2026-12-01", "2026-12-10")).toBe(true);
    expect(staysWithin(stay, "2026-12-14", "2026-12-20")).toBe(true);
    expect(staysWithin(stay, "2026-12-11", "2026-12-12")).toBe(true);
  });

  it("treats check-out day as free", () => {
    expect(staysWithin(stay, "2026-12-15", "2026-12-20")).toBe(false);
    expect(staysWithin(stay, "2026-12-01", "2026-12-09")).toBe(false);
  });

  it("never matches a booking without dates", () => {
    expect(staysWithin({ startDate: null, endDate: null }, "2026-12-01", "2026-12-31")).toBe(false);
  });
});

describe("placeContains", () => {
  const place = { area: "Palma de Mallorca", region: "Islas Baleares", country: "España", address: "Calle Sol 4" };

  it("finds any part of the place, ignoring case and accents", () => {
    expect(placeContains(place, "balear")).toBe(true);
    expect(placeContains(place, "ESPANA")).toBe(true);
    expect(placeContains(place, "calle sol")).toBe(true);
    expect(placeContains(place, "ibiza")).toBe(false);
  });

  it("lets everything through with nothing typed, and nothing without a place", () => {
    expect(placeContains(place, "  ")).toBe(true);
    expect(placeContains(undefined, "palma")).toBe(false);
  });
});

describe("applyBookingFilters", () => {
  const booking = (over: Partial<Booking>) =>
    ({ status: "CONFIRMED", propertyId: "p1", totalPrice: 100, payments: [], startDate: null, endDate: null, ...over }) as Booking;
  const places: Record<string, { area: string }> = { p1: { area: "Palma" }, p2: { area: "Ibiza" } };
  const bookings = [
    booking({ propertyId: "p1", startDate: "2026-12-10", endDate: "2026-12-15" }),
    booking({ propertyId: "p2", status: "PENDING" }),
  ];
  const run = (filters: Partial<BookingFilters>) =>
    applyBookingFilters(bookings, { ...NO_BOOKING_FILTERS, ...filters }, (id) => places[id] as never);

  it("combines every filter", () => {
    expect(run({})).toHaveLength(2);
    expect(run({ status: ["PENDING"] })).toEqual([bookings[1]]);
    expect(run({ location: "palm" })).toEqual([bookings[0]]);
    expect(run({ propertyId: "p2", location: "palm" })).toEqual([]);
    expect(run({ from: "2026-12-12", to: "2026-12-20" })).toEqual([bookings[0]]);
    expect(run({ payment: ["UNPAID"] })).toHaveLength(2);
  });

  it("counts what's in use", () => {
    expect(countBookingFilters(NO_BOOKING_FILTERS)).toBe(0);
    expect(countBookingFilters({ ...NO_BOOKING_FILTERS, status: ["PENDING", "CONFIRMED"], location: "x", from: "a", to: "b" })).toBe(4);
  });
});
