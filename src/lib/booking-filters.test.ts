import { describe, expect, it } from "vitest";

import type { Payment } from "@/lib/api/bookings";

import { paymentStateOf, staysWithin } from "./booking-filters";

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
