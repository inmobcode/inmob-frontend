import type { Booking } from "@/lib/api/bookings";

/** Where a booking stands on money: paid in full, partly paid, or nothing collected yet. */
export type PaymentState = "PAID" | "PARTIAL" | "UNPAID";
export const PAYMENT_STATES: PaymentState[] = ["UNPAID", "PARTIAL", "PAID"];

/**
 * Against the booking's total, or, without one, against the payments it plans.
 * The agency's commission is its own income, not the client's: it doesn't count.
 */
export function paymentStateOf(booking: Pick<Booking, "totalPrice" | "payments">): PaymentState {
  const payments = (booking.payments ?? []).filter((payment) => payment.type !== "COMMISSION");
  const paid = payments.filter((payment) => payment.status === "PAID").reduce((sum, payment) => sum + payment.amount, 0);
  const due = booking.totalPrice ?? payments.reduce((sum, payment) => sum + payment.amount, 0);
  if (paid <= 0) return "UNPAID";
  return due > 0 && paid < due ? "PARTIAL" : "PAID";
}

/**
 * Whether the stay touches the days from `from` to `to` (yyyy-MM-dd, both
 * included). A booking without dates (a sale) never does.
 */
export function staysWithin(booking: Pick<Booking, "startDate" | "endDate">, from: string, to: string) {
  if (!booking.startDate || !booking.endDate) return false;
  // Check-out day is free again: a stay that ends on `from` doesn't overlap.
  return booking.startDate <= to && booking.endDate > from;
}
