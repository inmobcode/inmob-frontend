const ITEMS = [
  { label: "Disponible", className: "bg-primary" },
  { label: "Reservado", className: "bg-destructive" },
  { label: "Check-in / check-out", className: "bg-gradient-to-br from-primary to-destructive" },
  { label: "Pasado", className: "bg-muted" },
];

export function AvailabilityLegend() {
  return (
    <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
      {ITEMS.map((item) => (
        <li key={item.label} className="flex items-center gap-2">
          <span className={`inline-block size-3 shrink-0 rounded-sm ${item.className}`} />
          {item.label}
        </li>
      ))}
    </ul>
  );
}
