import { apiFetch } from "./client";

/** One currency's line of an owner's account: what the agency has collected and owes. */
export interface OwnerStatementTotal {
  currency: string;
  /**
   * The gross figures (booked, collected) and the commission only come when the
   * commission is shown: next to `due` they would give it away.
   */
  /** Sum of the bookings' prices. */
  booked?: number;
  /** What was actually collected from the guests. */
  collected?: number;
  /** The agency's commission. */
  commission?: number;
  /** What is owed to the owner so far: the collected money minus the commission. */
  due: number;
  /** Already handed over to the owner (liquidaciones). */
  paidOut: number;
  /** Left to hand over; negative if more was handed over than collected. */
  balance: number;
}

export interface OwnerStatementBooking {
  propertyTitle: string | null;
  startDate: string | null;
  endDate: string | null;
  status: "PENDING" | "CONFIRMED" | "COMPLETED";
  currency: string;
  total?: number;
  collected?: number;
  commission?: number;
  due: number;
}

export interface OwnerPayout {
  id: string;
  amount: number;
  currency: string;
  /** yyyy-MM-dd */
  paidAt: string;
  method: string | null;
  note: string | null;
}

export interface OwnerStatement {
  totals: OwnerStatementTotal[];
  bookings: OwnerStatementBooking[];
  payouts: OwnerPayout[];
}

export function getOwnerStatement(token: string, ownerId: string) {
  return apiFetch<OwnerStatement>(`/api/owner-accounts/${ownerId}`, { token });
}

export function createOwnerPayout(
  token: string,
  ownerId: string,
  payload: { amount: number; currency: string; paidAt: string; method?: string; note?: string },
) {
  return apiFetch<OwnerPayout>(`/api/owner-accounts/${ownerId}/payouts`, {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function deleteOwnerPayout(token: string, ownerId: string, payoutId: string) {
  return apiFetch<void>(`/api/owner-accounts/${ownerId}/payouts/${payoutId}`, { method: "DELETE", token });
}
