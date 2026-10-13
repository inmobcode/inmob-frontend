"use client";

import { ArrowDownUp } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SORT_OPTIONS, type SortValue } from "@/lib/property-sort";

/** A pill that opens a menu to pick how the list/grid/table is ordered. */
export function SortSelect({
  value,
  onChange,
}: {
  value: SortValue;
  onChange: (value: SortValue) => void;
}) {
  const current = SORT_OPTIONS.find((option) => option.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Ordenar por"
          className="inline-flex h-10 items-center gap-2 rounded-full bg-foreground/[0.07] px-4 text-sm outline-none transition-colors hover:bg-foreground/10 focus-visible:ring-3 focus-visible:ring-ring/50 data-[state=open]:bg-card dark:bg-foreground/10 dark:hover:bg-foreground/15"
        >
          <ArrowDownUp className="size-3.5 text-muted-foreground" />
          {current?.label ?? "Ordenar por"}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={8}
        className="w-56 rounded-2xl p-1.5 shadow-[0_16px_40px_-12px_oklch(0.3_0.05_160/0.3)] ring-foreground/5"
      >
        <DropdownMenuRadioGroup value={value} onValueChange={(next) => onChange(next as SortValue)}>
          {SORT_OPTIONS.map((option) => (
            <DropdownMenuRadioItem
              key={option.value}
              value={option.value}
              className="rounded-xl py-2.5 pl-3.5 data-[state=checked]:bg-secondary data-[state=checked]:font-medium"
            >
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
