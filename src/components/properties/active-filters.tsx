"use client";

import { X } from "lucide-react";

import type { Property } from "@/lib/api/properties";
import { categoryLabel, LISTING_TYPE_LABELS, STATUS_LABELS } from "@/lib/properties-labels";
import { DEFAULT_FILTERS, type PropertyFilters } from "@/lib/property-filters";

interface Chip {
  key: string;
  label: string;
  /** What to reset in the filters when the chip is removed. */
  clear: Partial<PropertyFilters>;
}

const STATUS_PLURAL: Record<string, string> = {
  PUBLISHED: STATUS_LABELS.PUBLISHED + "s",
  DRAFT: STATUS_LABELS.DRAFT + "es",
  ARCHIVED: STATUS_LABELS.ARCHIVED + "s",
};

function priceLabel(filters: PropertyFilters, currencyHint: string) {
  const unit = filters.currency !== "ALL" ? filters.currency : currencyHint;
  const prefix = unit ? `${unit} ` : "";
  if (filters.minPrice && filters.maxPrice) return `${prefix}${filters.minPrice} – ${filters.maxPrice}`;
  if (filters.minPrice) return `Desde ${prefix}${filters.minPrice}`;
  return `Hasta ${prefix}${filters.maxPrice}`;
}

/** The filters in effect, as removable chips under the toolbar. */
export function ActiveFilters({
  filters,
  properties,
  onChange,
  onClear,
}: {
  filters: PropertyFilters;
  properties: Property[];
  onChange: (patch: Partial<PropertyFilters>) => void;
  onClear: () => void;
}) {
  const currencies = [...new Set(properties.map((property) => property.currency))];
  const ownerName = properties.find((property) => property.owner?.id === filters.owner)?.owner?.name;
  const chips: Chip[] = [];

  for (const status of filters.status) {
    chips.push({
      key: `status-${status}`,
      label: STATUS_PLURAL[status],
      clear: { status: filters.status.filter((item) => item !== status) },
    });
  }
  if (filters.type !== "ALL")
    chips.push({ key: "type", label: LISTING_TYPE_LABELS[filters.type], clear: { type: DEFAULT_FILTERS.type } });
  if (filters.category !== "ALL")
    chips.push({ key: "category", label: categoryLabel(filters.category), clear: { category: "ALL" } });
  if (filters.region !== "ALL") chips.push({ key: "region", label: filters.region, clear: { region: "ALL" } });
  if (filters.owner !== "ALL")
    chips.push({ key: "owner", label: ownerName ?? "Propietario", clear: { owner: "ALL" } });
  if (filters.currency !== "ALL") chips.push({ key: "currency", label: filters.currency, clear: { currency: "ALL" } });
  if (filters.minPrice || filters.maxPrice)
    chips.push({
      key: "price",
      label: priceLabel(filters, currencies.length === 1 ? currencies[0] : ""),
      clear: { minPrice: "", maxPrice: "" },
    });
  if (filters.minBedrooms) chips.push({ key: "beds", label: `${filters.minBedrooms}+ dormitorios`, clear: { minBedrooms: "" } });
  if (filters.minBathrooms) chips.push({ key: "baths", label: `${filters.minBathrooms}+ baños`, clear: { minBathrooms: "" } });

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-300">
      <span className="mr-1 text-sm text-muted-foreground">Filtros:</span>
      {chips.map((chip) => (
        <span
          key={chip.key}
          className="inline-flex h-8 items-center gap-1 rounded-full bg-primary/10 pr-1 pl-3 text-sm font-medium text-primary"
        >
          {chip.label}
          <button
            type="button"
            aria-label={`Quitar el filtro ${chip.label}`}
            onClick={() => onChange(chip.clear)}
            className="flex size-6 items-center justify-center rounded-full outline-none transition-colors hover:bg-primary/15 focus-visible:ring-2 focus-visible:ring-ring/60"
          >
            <X className="size-3.5" />
          </button>
        </span>
      ))}
      {chips.length > 1 && (
        <button
          type="button"
          onClick={onClear}
          className="px-2 text-sm font-medium text-muted-foreground underline-offset-4 outline-none hover:text-foreground hover:underline focus-visible:underline"
        >
          Quitar todos
        </button>
      )}
    </div>
  );
}
