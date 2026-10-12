import { Badge } from "@/components/ui/badge";
import type { OwnerPortal, OwnerPortalProperty } from "@/lib/api/owner-portal";
import { BOOKING_STATUS_LABELS, LISTING_TYPE_LABELS, PAYMENT_TYPE_LABELS } from "@/lib/properties-labels";

function PropertyBlock({ property }: { property: OwnerPortalProperty }) {
  const cover = property.photos.find((p) => p.isCover) ?? property.photos[0];

  return (
    <div className="overflow-hidden rounded-lg border bg-white dark:bg-zinc-950">
      <div className="flex gap-4 p-4">
        <div className="h-24 w-32 flex-shrink-0 overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-900">
          {cover && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover.url} alt={property.title} className="h-full w-full object-cover" />
          )}
        </div>
        <div>
          <p className="text-xs uppercase text-zinc-500">
            {LISTING_TYPE_LABELS[property.listingType]} · {property.category}
          </p>
          <h3 className="font-medium">{property.title}</h3>
          <p className="text-sm text-zinc-500">
            {[property.area, property.region, property.country].filter(Boolean).join(", ")}
          </p>
        </div>
      </div>

      <div className="border-t px-4 py-3">
        <p className="text-sm font-medium">Reservas</p>
        {property.bookings.length === 0 ? (
          <p className="mt-1 text-sm text-zinc-500">Todavía no hay reservas.</p>
        ) : (
          <div className="mt-2 space-y-3">
            {property.bookings.map((booking, i) => (
              <div key={i} className="rounded-md border p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span>
                    {booking.startDate ?? "—"} → {booking.endDate ?? "—"}
                  </span>
                  <Badge variant={booking.status === "CONFIRMED" ? "default" : "secondary"}>
                    {BOOKING_STATUS_LABELS[booking.status]}
                  </Badge>
                </div>
                {booking.totalPrice != null && (
                  <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                    Total: {booking.currency} {booking.totalPrice.toLocaleString()}
                  </p>
                )}
                {booking.payments.length > 0 && (
                  <ul className="mt-2 space-y-1 text-xs text-zinc-500">
                    {booking.payments.map((payment, j) => (
                      <li key={j}>
                        {PAYMENT_TYPE_LABELS[payment.type]}: {payment.currency}{" "}
                        {payment.amount.toLocaleString()} —{" "}
                        {payment.status === "PAID" ? `Pagado${payment.paidAt ? ` (${payment.paidAt})` : ""}` : "Pendiente"}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function OwnerPortalView({ portal }: { portal: OwnerPortal }) {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-sm text-zinc-500">{portal.agencyName}</p>
      <h1 className="mt-1 text-2xl font-semibold">Bienvenido, {portal.ownerName}</h1>
      <p className="mt-2 text-sm text-zinc-500">
        Estado de disponibilidad, reservas y pagos de tus propiedades.
      </p>

      {portal.properties.length === 0 ? (
        <p className="mt-8 text-sm text-zinc-500">Todavía no tenés propiedades asignadas.</p>
      ) : (
        <div className="mt-8 space-y-6">
          {portal.properties.map((property) => (
            <PropertyBlock key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
