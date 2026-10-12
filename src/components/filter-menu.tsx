"use client";

import { Check } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface FilterOption<T extends string> {
  value: T;
  label: string;
}

/**
 * A pill that opens a menu of checkboxes, to filter by one or several values.
 * Nothing selected means "no filter". The menu stays open while you tick.
 */
export function FilterMenu<T extends string>({
  name,
  plural = "seleccionados",
  options,
  value,
  onChange,
  counts,
}: {
  /** What the filter is called; shown on the pill while nothing is selected. */
  name: string;
  /** Used on the pill when several are selected, e.g. "2 estados". */
  plural?: string;
  options: FilterOption<T>[];
  value: T[];
  onChange: (value: T[]) => void;
  counts: Record<string, number>;
}) {
  const single = value.length === 1 ? options.find((option) => option.value === value[0]) : null;
  const label = value.length === 0 ? name : single ? single.label : `${value.length} ${plural}`;

  function toggle(item: T) {
    onChange(value.includes(item) ? value.filter((entry) => entry !== item) : [...value, item]);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          data-filter-menu
          aria-label={`Filtrar por ${name.toLowerCase()}`}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-foreground/[0.07] px-4 text-sm outline-none transition-colors hover:bg-foreground/10 focus-visible:ring-3 focus-visible:ring-ring/50 data-[state=open]:bg-card dark:bg-foreground/10 dark:hover:bg-foreground/15"
        >
          {label}
          {single && (
            <span className="min-w-6 rounded-full bg-foreground/[0.07] px-2 py-0.5 text-center text-xs text-muted-foreground tabular-nums">
              {counts[single.value] ?? 0}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={8}
        className="w-60 rounded-2xl p-1.5 shadow-[0_16px_40px_-12px_oklch(0.3_0.05_160/0.3)] ring-foreground/5"
      >
        <div className="flex flex-col gap-1">
          {options.map((option) => {
            const checked = value.includes(option.value);
            return (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={checked}
                onSelect={(event) => event.preventDefault()}
                onCheckedChange={() => toggle(option.value)}
                className="rounded-xl py-2.5 pr-3 pl-3.5 data-[state=checked]:bg-secondary data-[state=checked]:font-medium [&>span:first-child]:hidden"
              >
                <span
                  className={cn(
                    "flex size-4.5 shrink-0 items-center justify-center rounded-[5px] border-2 transition-colors",
                    checked ? "border-primary bg-primary text-primary-foreground" : "border-foreground/25",
                  )}
                >
                  {checked && <Check className="size-3" strokeWidth={3} />}
                </span>
                <span className="flex-1">{option.label}</span>
                <span className="min-w-6 rounded-full bg-foreground/[0.07] px-2 py-0.5 text-center text-xs font-normal text-muted-foreground tabular-nums">
                  {counts[option.value] ?? 0}
                </span>
              </DropdownMenuCheckboxItem>
            );
          })}
        </div>
        {value.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="rounded-xl py-2 pl-3.5 text-muted-foreground"
              onSelect={(event) => {
                event.preventDefault();
                onChange([]);
              }}
            >
              Mostrar todos
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
