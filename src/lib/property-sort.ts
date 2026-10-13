import type { Property } from "@/lib/api/properties";

export type SortValue =
  | "updatedAt_desc"
  | "updatedAt_asc"
  | "price_desc"
  | "price_asc"
  | "title_asc"
  | "title_desc";

export const DEFAULT_SORT: SortValue = "updatedAt_desc";

export const SORT_OPTIONS: { value: SortValue; label: string }[] = [
  { value: "updatedAt_desc", label: "Más recientes" },
  { value: "updatedAt_asc", label: "Más antiguas" },
  { value: "price_desc", label: "Precio: mayor a menor" },
  { value: "price_asc", label: "Precio: menor a mayor" },
  { value: "title_asc", label: "Título: A-Z" },
  { value: "title_desc", label: "Título: Z-A" },
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
