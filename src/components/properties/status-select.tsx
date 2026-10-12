"use client";

import { FilterMenu } from "@/components/filter-menu";
import type { PropertyStatus } from "@/lib/api/properties";
import { STATUS_LABELS } from "@/lib/properties-labels";

const OPTIONS: { value: PropertyStatus; label: string }[] = [
  { value: "PUBLISHED", label: STATUS_LABELS.PUBLISHED + "s" },
  { value: "DRAFT", label: STATUS_LABELS.DRAFT + "es" },
  { value: "ARCHIVED", label: STATUS_LABELS.ARCHIVED + "s" },
];

/** Multi-select of property statuses. Nothing selected means every status. */
export function StatusSelect({
  value,
  onChange,
  counts,
}: {
  value: PropertyStatus[];
  onChange: (value: PropertyStatus[]) => void;
  counts: Record<string, number>;
}) {
  return <FilterMenu name="Estado" plural="estados" options={OPTIONS} value={value} onChange={onChange} counts={counts} />;
}
