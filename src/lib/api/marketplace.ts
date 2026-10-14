import { apiFetch } from "./client";
import type { PublicProperty } from "./offers";

/** A published listing from any agency, with the agency that publishes it. */
export type MarketplaceProperty = PublicProperty & {
  agency: { name: string; slug: string; logoUrl: string | null };
};

export interface MarketplaceZone {
  name: string;
  region: string | null;
  country: string | null;
  count: number;
  coverUrl: string | null;
}

export interface MarketplaceFacets {
  total: number;
  agencies: number;
  operations: { SALE: number; RENT: number };
  zones: MarketplaceZone[];
  categories: { value: string; count: number }[];
}

export type MarketplaceSort = "recent" | "price_asc" | "price_desc";

export interface MarketplaceQuery {
  operation?: "SALE" | "RENT";
  zone?: string;
  category?: string;
  /** yyyy-MM-dd; only rentals have dates. */
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  sort?: MarketplaceSort;
}

export function searchMarketplace(query: MarketplaceQuery) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== "") params.set(key, String(value));
  }
  const qs = params.toString();
  return apiFetch<MarketplaceProperty[]>(`/api/marketplace/properties${qs ? `?${qs}` : ""}`);
}

export function getMarketplaceFacets() {
  return apiFetch<MarketplaceFacets>("/api/marketplace/facets");
}
