import { placeMatches } from "@/lib/places";
import type {
  ListingType,
  Property,
  PropertyStatus,
} from "@/lib/api/properties";

export interface PropertyFilters {
  search: string;
  /** Any of these; empty means every status. */
  status: PropertyStatus[];
  type: ListingType | "ALL";
  category: string;
  region: string;
  owner: string;
  currency: string;
  minPrice: string;
  maxPrice: string;
  minBedrooms: string;
  minBathrooms: string;
}

/** "ALL" and "" both mean "no filter" for the field. */
export const DEFAULT_FILTERS: PropertyFilters = {
  search: "",
  status: [],
  type: "ALL",
  category: "ALL",
  region: "ALL",
  owner: "ALL",
  currency: "ALL",
  minPrice: "",
  maxPrice: "",
  minBedrooms: "",
  minBathrooms: "",
};

function toNumber(value: string) {
  const parsed = Number(value.replace(",", "."));
  return value.trim() === "" || Number.isNaN(parsed) ? null : parsed;
}

export function applyFilters(properties: Property[], filters: PropertyFilters) {
  const term = filters.search.trim().toLowerCase();
  const minPrice = toNumber(filters.minPrice);
  const maxPrice = toNumber(filters.maxPrice);
  const minBedrooms = toNumber(filters.minBedrooms);
  const minBathrooms = toNumber(filters.minBathrooms);

  return properties.filter((property) => {
    if (filters.status.length > 0 && !filters.status.includes(property.status))
      return false;
    if (filters.type !== "ALL" && property.listingType !== filters.type)
      return false;
    if (filters.category !== "ALL" && property.category !== filters.category)
      return false;
    if (filters.region !== "ALL" && !placeMatches(property, filters.region))
      return false;
    if (filters.owner !== "ALL" && property.owner?.id !== filters.owner)
      return false;
    if (filters.currency !== "ALL" && property.currency !== filters.currency)
      return false;
    if (minPrice != null && (property.price ?? -Infinity) < minPrice)
      return false;
    if (maxPrice != null && (property.price ?? Infinity) > maxPrice)
      return false;
    if (minBedrooms != null && (property.bedrooms ?? 0) < minBedrooms)
      return false;
    if (minBathrooms != null && (property.bathrooms ?? 0) < minBathrooms)
      return false;
    if (!term) return true;
    const haystack = [
      property.title,
      property.area,
      property.region,
      property.country,
      property.owner?.name,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(term);
  });
}

/** Number of filters in effect, not counting the free-text search. */
export function countActiveFilters(filters: PropertyFilters) {
  let count = 0;
  if (filters.status.length > 0) count++;
  if (filters.type !== "ALL") count++;
  if (filters.category !== "ALL") count++;
  if (filters.region !== "ALL") count++;
  if (filters.owner !== "ALL") count++;
  if (filters.currency !== "ALL") count++;
  if (filters.minPrice !== "" || filters.maxPrice !== "") count++;
  if (filters.minBedrooms !== "") count++;
  if (filters.minBathrooms !== "") count++;
  return count;
}
