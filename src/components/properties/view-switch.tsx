"use client";

import { Columns3, LayoutGrid, Rows3, Table2, type LucideIcon } from "lucide-react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type ViewMode = "grid" | "list" | "table" | "board";

const VIEWS: { value: ViewMode; label: string; icon: LucideIcon }[] = [
  { value: "table", label: "Tabla", icon: Table2 },
  { value: "list", label: "Lista", icon: Rows3 },
  { value: "grid", label: "Cuadrícula", icon: LayoutGrid },
  { value: "board", label: "Tablero", icon: Columns3 },
];

const DEFAULT_VIEWS: ViewMode[] = ["table", "list", "grid"];

/** Icon-only switch between the ways of laying out the properties. */
export function ViewSwitch({
  value,
  onChange,
  views = DEFAULT_VIEWS,
}: {
  value: ViewMode;
  onChange: (value: ViewMode) => void;
  /** Which layouts to offer; the board only makes sense for clients. */
  views?: ViewMode[];
}) {
  return (
    <div
      role="group"
      aria-label="Cambiar la vista"
      className="flex gap-0.5 rounded-full bg-foreground/[0.06] p-1"
    >
      {VIEWS.filter((view) => views.includes(view.value)).map((view) => {
        const active = view.value === value;
        return (
          <Tooltip key={view.value}>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label={view.label}
                aria-pressed={active}
                onClick={() => onChange(view.value)}
                className={cn(
                  "flex size-8 items-center justify-center rounded-full transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  active
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
                )}
              >
                <view.icon className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={10}>
              {view.label}
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
