import { cn } from "@/lib/utils";

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  counts,
  label,
  contained = false,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  counts?: Record<string, number>;
  label: string;
  /** Compact pill-in-a-tray look, to tell a secondary group apart from the main tabs. */
  contained?: boolean;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn("flex flex-wrap gap-1.5", contained && "gap-0.5 rounded-full bg-foreground/[0.06] p-1")}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              contained ? "h-8 px-3.5" : "h-9 px-4",
              active
                ? contained
                  ? "bg-card text-foreground shadow-sm"
                  : "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
            )}
          >
            {option.label}
            {counts && (
              <span
                className={cn(
                  "text-xs tabular-nums",
                  active ? "text-primary-foreground/70" : "text-muted-foreground/70",
                )}
              >
                {counts[option.value] ?? 0}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
