"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PropertyFilters } from "@/lib/property-filters";
import { STATUS_LABELS } from "@/lib/properties-labels";

type StatusValue = PropertyFilters["status"];

const STATUS_TABS: { value: StatusValue; label: string }[] = [
  { value: "ALL", label: "Todas" },
  { value: "PUBLISHED", label: STATUS_LABELS.PUBLISHED + "s" },
  { value: "DRAFT", label: STATUS_LABELS.DRAFT + "es" },
  { value: "ARCHIVED", label: STATUS_LABELS.ARCHIVED + "s" },
];

export function StatusSelect({
  value,
  onChange,
  counts,
}: {
  value: StatusValue;
  onChange: (value: StatusValue) => void;
  counts: Record<string, number>;
}) {
  return (
    <Select value={value} onValueChange={(next) => onChange(next as StatusValue)}>
      <SelectTrigger
        aria-label="Filtrar por estado"
        className="rounded-full border-transparent bg-foreground/[0.07] px-4 hover:bg-foreground/10 data-[size=default]:h-10 dark:bg-foreground/10 dark:hover:bg-foreground/15 [&>svg]:hidden"
      >
        <SelectValue className="flex-1">
          {/* Default state shows the control's own name; once a status is picked, that status. */}
          {value === "ALL" ? "Estado" : undefined}
        </SelectValue>
      </SelectTrigger>
      <SelectContent
        position="popper"
        align="start"
        sideOffset={8}
        className="min-w-40 rounded-2xl p-1.5 shadow-[0_16px_40px_-12px_oklch(0.3_0.05_160/0.3)] ring-foreground/5"
      >
        <div className="flex flex-col gap-1">
          {STATUS_TABS.map((tab) => (
            <SelectItem
              key={tab.value}
              value={tab.value}
              className="rounded-xl py-2.5 pr-3 pl-3.5 data-[state=checked]:bg-secondary data-[state=checked]:font-medium *:[span]:last:flex-1 [&>span:first-child]:hidden"
            >
              <StatusOption tab={tab} count={counts[tab.value] ?? 0} />
            </SelectItem>
          ))}
        </div>
      </SelectContent>
    </Select>
  );
}

function StatusOption({
  tab,
  count,
}: {
  tab: { value: StatusValue; label: string };
  count: number;
}) {
  return (
    <span className="flex w-full min-w-0 items-center gap-2.5">
      <span>{tab.label}</span>
      <span
        data-count
        className="ml-auto min-w-6 rounded-full bg-foreground/[0.07] px-2 py-0.5 text-center text-xs font-normal text-muted-foreground tabular-nums"
      >
        {count}
      </span>
    </span>
  );
}

export { STATUS_TABS };
