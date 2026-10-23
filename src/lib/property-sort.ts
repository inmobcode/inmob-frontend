import type { Property } from "@/lib/api/properties";

export type SortValue =
  | "updatedAt_desc"
  | "updatedAt_asc"
  | "price_desc"
  | "price_asc"
  | "title_asc"
  | "title_desc";

export const DEFAULT_SORT: SortValue = "updatedAt_desc";

/** In menu order; their names live in "properties.sort.<value>". */
export const SORT_OPTIONS: SortValue[] = [
  "updatedAt_desc",
  "updatedAt_asc",
  "price_desc",
  "price_asc",
  "title_asc",
  "title_desc",
];

/** Properties without a price always sort last, in either direction. */
export function sortProperties(properties: Property[], sort: SortValue): Property[] {
  switch (sort) {
    case "updatedAt_asc":
      return [...properties].sort(
        (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
      );
    case "price_desc":
      return [...properties].sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
    case "price_asc":
      return [...properties].sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    case "title_asc":
      return [...properties].sort((a, b) => a.title.localeCompare(b.title));
    case "title_desc":
      return [...properties].sort((a, b) => b.title.localeCompare(a.title));
    case "updatedAt_desc":
    default:
      return [...properties].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
  }
}
