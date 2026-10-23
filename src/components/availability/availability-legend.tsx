import { useTranslations } from "next-intl";

const ITEMS = [
  { key: "available", className: "bg-primary" },
  { key: "booked", className: "bg-destructive" },
  { key: "turnover", className: "bg-gradient-to-br from-primary to-destructive" },
  { key: "past", className: "bg-muted" },
] as const;

const PENDING = { key: "pending", className: "bg-amber-400" } as const;

export function AvailabilityLegend({ showPending = false }: { showPending?: boolean }) {
  const t = useTranslations("availability.legend");
  return (
    <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
      {(showPending ? [...ITEMS.slice(0, 3), PENDING, ITEMS[3]] : ITEMS).map((item) => (
        <li key={item.key} className="flex items-center gap-2">
          <span className={`inline-block size-3 shrink-0 rounded-sm ${item.className}`} />
          {t(item.key)}
        </li>
      ))}
    </ul>
  );
}
