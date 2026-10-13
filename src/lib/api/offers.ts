import { apiFetch } from "./client";
import type { Property } from "./properties";

export type OfferStatus = "DRAFT" | "SENT" | "VIEWED" | "EXPIRED";
/** Which properties the offer holds: only for sale, only for rent, or both. */
export type OfferOperation = "SALE" | "RENT" | "BOTH";
export type DiscountType = "NONE" | "PERCENT" | "FIXED";

export type PublicProperty = Omit<
  Property,
  "agencyId" | "status" | "owner" | "ownerId" | "createdAt" | "updatedAt"
>;

export interface OfferPropertyItem {
  id: string;
  propertyId: string;
  priceOverride: number | null;
  position: number;
  discountType: DiscountType;
  discountValue: number;
  securityDeposit: number | null;
  bottomText: string | null;
  displayPrice: number | null;
  initialPrice: number | null;
  property: Property | PublicProperty;
}

export interface OfferSection {
  id: string | null;
  title: string | null;
  text: string | null;
  position: number;
  properties: OfferPropertyItem[];
}

export interface Offer {
  id: string;
  agencyId?: string;
  clientId?: string | null;
  token: string;
  title: string;
  operation: OfferOperation;
  currency: string;
  showPrice: boolean;
  branded: boolean;
  status: OfferStatus;
  expiresAt: string | null;
  welcomeTitle: string | null;
  welcomeDateLabel: string | null;
  welcomeContent: string | null;
  clientName: string | null;
  clientEmail: string | null;
  clientPhone: string | null;
  sections: OfferSection[];
  total: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface OfferPropertyInput {
  propertyId: string;
  priceOverride?: number | null;
  discountType?: DiscountType;
  discountValue?: number;
  securityDeposit?: number | null;
  bottomText?: string | null;
}

export interface OfferSectionInput {
  title?: string | null;
  text?: string | null;
  properties: OfferPropertyInput[];
}

export interface SaveOfferPayload {
  title: string;
  operation?: OfferOperation;
  currency?: string;
  showPrice?: boolean;
  branded?: boolean;
  expiresAt?: string | null;
  welcomeTitle?: string | null;
  welcomeDateLabel?: string | null;
  welcomeContent?: string | null;
  clientName?: string | null;
  clientEmail?: string | null;
  clientPhone?: string | null;
  sections?: OfferSectionInput[];
}

export function listOffers(token: string) {
  return apiFetch<Offer[]>("/api/offers/", { token });
}

export function createOffer(token: string, payload: SaveOfferPayload) {
  return apiFetch<Offer>("/api/offers/", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function getOffer(token: string, id: string) {
  return apiFetch<Offer>(`/api/offers/${id}`, { token });
}

export function updateOffer(
  token: string,
  id: string,
  payload: Partial<SaveOfferPayload>,
) {
  return apiFetch<Offer>(`/api/offers/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

export function deleteOffer(token: string, id: string) {
  return apiFetch<void>(`/api/offers/${id}`, { method: "DELETE", token });
}

export function sendOffer(token: string, id: string) {
  return apiFetch<Offer>(`/api/offers/${id}/send`, { method: "POST", token });
}

export function getPublicOffer(offerToken: string) {
  return apiFetch<Offer>(`/api/public/offers/${offerToken}`);
}

export function submitOfferInquiry(
  offerToken: string,
  payload: { name: string; email: string; phone?: string; message?: string },
) {
  return apiFetch<Offer>(`/api/public/offers/${offerToken}/inquiries`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
