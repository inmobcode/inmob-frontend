const ITEMS = [
  { label: "Disponible", className: "bg-primary" },
  { label: "Reservado", className: "bg-destructive" },
  { label: "Check-in / check-out", className: "bg-gradient-to-br from-primary to-destructive" },
  { label: "Pasado", className: "bg-muted" },
];

const PENDING = { label: "Reserva pendiente", className: "bg-amber-400" };

export function AvailabilityLegend({ showPending = false }: { showPending?: boolean }) {
  return (
    <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
      {(showPending ? [...ITEMS.slice(0, 3), PENDING, ITEMS[3]] : ITEMS).map((item) => (
        <li key={item.label} className="flex items-center gap-2">
          <span className={`inline-block size-3 shrink-0 rounded-sm ${item.className}`} />
          {item.label}
        </li>
      ))}
    </ul>
  );
}
