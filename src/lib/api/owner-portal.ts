import { apiFetch } from "./client";
import type { BookingStatus, PaymentType } from "./bookings";
import type { PublicAgency } from "./agency";
import type { PublicProperty } from "./offers";
import type { PropertyStatus } from "./properties";

export interface OwnerPortalPayment {
  amount: number;
  currency: string;
  type: PaymentType;
  status: "PENDING" | "PAID";
  paidAt: string | null;
}

export interface OwnerPortalBooking {
  startDate: string | null;
  endDate: string | null;
  status: BookingStatus;
  totalPrice: number | null;
  currency: string;
  payments: OwnerPortalPayment[];
}

export interface OwnerPortalProperty extends PublicProperty {
  status: PropertyStatus;
  /** Only published properties have a public page to link to. */
  published: boolean;
  bookings: OwnerPortalBooking[];
}

export interface OwnerPortal {
  ownerName: string;
  agencyName: string;
  agency: PublicAgency & { slug: string };
  properties: OwnerPortalProperty[];
}

export function getOwnerPortal(ownerToken: string) {
  return apiFetch<OwnerPortal>(`/api/public/owners/${ownerToken}`);
}
