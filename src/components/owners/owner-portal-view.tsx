import {
  addMonths,
  areIntervalsOverlapping,
  differenceInCalendarDays,
  format,
  isAfter,
  isBefore,
  max as latest,
  min as earliest,
  parseISO,
  startOfDay,
  startOfMonth,
} from "date-fns";
import { es } from "date-fns/locale";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";

import { OwnerStatementView } from "@/components/owners/owner-statement";
import { PhotoPlaceholder, formatPrice, placeOf } from "@/components/public/property-card";
import { SITE_WRAP, SiteFooter, SiteHeader, SiteRoot } from "@/components/public/site-chrome";
import type { BookingStatus, PaymentType } from "@/lib/api/bookings";
import type { OwnerPortal, OwnerPortalBooking, OwnerPortalProperty, OwnerPortalRecommendation } from "@/lib/api/owner-portal";
import type { PropertyStatus } from "@/lib/api/properties";
import type { RecommendationPriority, RecommendationStatus } from "@/lib/api/recommendations";
import { LISTING_TYPE_LABELS, categoryLabel } from "@/lib/properties-labels";
import { resolveSite, whatsappLink } from "@/lib/site-theme";
import { cn } from "@/lib/utils";
import { IMAGE_WIDTH, sizedImage } from "@/lib/image-url";

/** How far ahead the occupancy strip looks. */
const STRIP_MONTHS = 6;

const money = (currency: string, value: number) => `${currency} ${value.toLocaleString("es-AR")}`;

const BOOKING_PILL: Record<BookingStatus, { label: string; className: string }> = {
  PENDING: { label: "Pendiente", className: "bg-amber-100 text-amber-900" },
  CONFIRMED: { label: "Confirmada", className: "bg-site-accent text-site-accent-ink" },
  COMPLETED: { label: "Completada", className: "bg-site-surface text-site-ink" },
  CANCELLED: { label: "Cancelada", className: "bg-red-100 text-red-900" },
};

const PROPERTY_PILL: Record<PropertyStatus, { label: string; className: string }> = {
  PUBLISHED: { label: "Publicada", className: "bg-site-accent text-site-accent-ink" },
  DRAFT: { label: "Sin publicar", className: "bg-site-surface text-site-ink" },
  ARCHIVED: { label: "Archivada", className: "bg-site-surface text-site-quiet" },
};

const OWNER_PAYMENT_LABELS: Record<PaymentType, string> = {
  DEPOSIT: "Seña",
  BALANCE: "Saldo",
  COMMISSION: "Comisión",
};

const RECOMMENDATION_PRIORITY_PILL: Record<RecommendationPriority, { label: string; className: string }> = {
  LOW: { label: "Prioridad baja", className: "bg-site-surface text-site-quiet" },
  MEDIUM: { label: "Prioridad media", className: "bg-site-surface text-site-ink" },
  HIGH: { label: "Prioridad alta", className: "bg-site-accent text-site-accent-ink" },
};

const RECOMMENDATION_STATUS_LABELS: Record<RecommendationStatus, string> = {
  PROPOSED: "Propuesta",
  APPROVED: "Aprobada",
  DONE: "Hecha",
};

function Pill({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex h-6 w-fit shrink-0 items-center rounded-full px-2.5 text-xs font-medium", className)}>
      {children}
    </span>
  );
}

/** A booking's dates, when it has both. */
function stayOf(booking: OwnerPortalBooking) {
  if (!booking.startDate || !booking.endDate) return null;
  const start = parseISO(booking.startDate);
  const end = parseISO(booking.endDate);
  return { start, end, nights: Math.max(differenceInCalendarDays(end, start), 1) };
}

function paidOf(booking: OwnerPortalBooking) {
  return booking.payments.filter((payment) => payment.status === "PAID").reduce((sum, p) => sum + p.amount, 0);
}

/** Amounts per currency, so USD and EUR are never added together. */
function sumByCurrency(entries: { currency: string; amount: number }[]) {
  const totals = new Map<string, number>();
  for (const { currency, amount } of entries) totals.set(currency, (totals.get(currency) ?? 0) + amount);
  return [...totals.entries()].filter(([, amount]) => amount > 0);
}

/**
 * The next months of a rental at a glance: each stay drawn on a timeline,
 * confirmed ones solid and pending ones outlined, with a mark on today.
 */
function OccupancyStrip({ bookings, today }: { bookings: OwnerPortalBooking[]; today: Date }) {
  const from = startOfMonth(today);
  const to = addMonths(from, STRIP_MONTHS);
  const span = differenceInCalendarDays(to, from);
  const at = (date: Date) => (differenceInCalendarDays(date, from) / span) * 100;
  const months = Array.from({ length: STRIP_MONTHS }, (_, index) => addMonths(from, index));

  const stays = bookings
    .filter((booking) => booking.status !== "CANCELLED")
    .map((booking) => ({ booking, stay: stayOf(booking) }))
    .filter(
      (entry): entry is { booking: OwnerPortalBooking; stay: NonNullable<ReturnType<typeof stayOf>> } =>
        entry.stay != null && areIntervalsOverlapping({ start: entry.stay.start, end: entry.stay.end }, { start: from, end: to }),
    );
  const bookedNights = stays.reduce(
    (sum, { stay }) => sum + differenceInCalendarDays(earliest([stay.end, to]), latest([stay.start, today, from])),
    0,
  );

  return (
    <figure className="flex flex-col gap-3">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <span className="s-heading text-lg">
          {bookedNights > 0
            ? `${bookedNights} ${bookedNights === 1 ? "noche reservada" : "noches reservadas"} de acá a ${format(addMonths(from, STRIP_MONTHS - 1), "MMMM", { locale: es })}`
            : `Sin estadías de acá a ${format(addMonths(from, STRIP_MONTHS - 1), "MMMM", { locale: es })}`}
        </span>
        <span className="flex items-center gap-4 text-sm text-site-quiet">
          <span className="flex items-center gap-1.5">
            <span aria-hidden className="size-2.5 rounded-sm bg-site-accent" />
            Confirmada
          </span>
          <span className="flex items-center gap-1.5">
            <span aria-hidden className="size-2.5 rounded-sm border border-site-ink/50" />
            Pendiente
          </span>
        </span>
      </figcaption>

      <div className="relative">
        {/* Month columns: hairlines between them and the month name under each. */}
        <div className="grid" style={{ gridTemplateColumns: `repeat(${STRIP_MONTHS}, minmax(0, 1fr))` }}>
          {months.map((month) => (
            <div key={month.toISOString()} className="flex flex-col gap-2 border-l border-site-line first:border-l-0">
              <div className="h-10" />
              <span className="pl-2 text-xs text-site-quiet capitalize">{format(month, "MMM", { locale: es })}</span>
            </div>
          ))}
        </div>
        <div className="absolute inset-x-0 top-0 h-10 rounded-md bg-site-surface/70" aria-hidden />
        {stays.map(({ booking, stay }, index) => {
          const left = Math.max(at(stay.start), 0);
          const right = Math.min(at(stay.end), 100);
          return (
            <span
              key={index}
              title={`${format(stay.start, "d MMM", { locale: es })} – ${format(stay.end, "d MMM", { locale: es })} · ${BOOKING_PILL[booking.status].label}`}
              className={cn(
                "absolute top-1.5 h-7 rounded-[5px]",
                booking.status === "PENDING" ? "border-2 border-site-ink/50 bg-site-bg" : "bg-site-accent",
              )}
              style={{ left: `${left}%`, width: `max(${right - left}%, 6px)` }}
            />
          );
        })}
        {/* Today. */}
        <span
          aria-hidden
          className="absolute -top-1.5 flex h-[3.25rem] -translate-x-1/2 flex-col items-center"
          style={{ left: `${at(startOfDay(today))}%` }}
        >
          <span className="h-10 w-0.5 rounded-full bg-site-ink" />
          <span className="mt-1 text-[11px] font-medium leading-none">Hoy</span>
        </span>
      </div>
      <p className="sr-only">
        {stays.length === 0
          ? "No hay estadías en los próximos meses."
          : stays
              .map(({ booking, stay }) => `${format(stay.start, "d 'de' MMMM", { locale: es })} al ${format(stay.end, "d 'de' MMMM", { locale: es })}, ${BOOKING_PILL[booking.status].label.toLowerCase()}`)
              .join("; ")}
      </p>
    </figure>
  );
}

function BookingRow({ booking, today }: { booking: OwnerPortalBooking; today: Date }) {
  const stay = stayOf(booking);
  const pill = BOOKING_PILL[booking.status];
  const paid = paidOf(booking);
  const total = booking.totalPrice ?? 0;
  const ratio = total > 0 ? Math.min(paid / total, 1) : 0;
  const past = stay ? isBefore(stay.end, today) : false;
  const ownerPayments = booking.payments.filter((payment) => payment.type !== "COMMISSION");

  return (
    <li className={cn("grid gap-x-6 gap-y-3 py-5 sm:grid-cols-[minmax(0,1fr)_14rem]", past && "opacity-70")}>
      <div className="flex flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="s-heading text-lg first-letter:uppercase">
            {stay
              ? `${format(stay.start, "EEE d 'de' MMM", { locale: es })} – ${format(stay.end, "EEE d 'de' MMM", { locale: es })}`
              : "Sin fechas"}
          </span>
          <Pill className={pill.className}>{pill.label}</Pill>
        </div>
        <span className="text-sm text-site-quiet">
          {stay ? `${stay.nights} ${stay.nights === 1 ? "noche" : "noches"}` : "Venta"}
          {ownerPayments.length > 0 &&
            ` · ${ownerPayments
              .map((payment) => `${OWNER_PAYMENT_LABELS[payment.type]} ${payment.status === "PAID" ? "pagada" : "pendiente"}`)
              .join(", ")}`}
        </span>
      </div>
      {total > 0 && (
        <div className="flex flex-col gap-2 sm:items-end">
          <span className="text-sm tabular-nums">
            <span className="font-medium">{money(booking.currency, paid)}</span>
            <span className="text-site-quiet"> de {money(booking.currency, total)}</span>
          </span>
          <div
            className="h-1.5 w-full overflow-hidden rounded-full bg-site-surface"
            role="progressbar"
            aria-label="Cobrado"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(ratio * 100)}
          >
            <div className="h-full rounded-full bg-site-accent" style={{ width: `${ratio * 100}%` }} />
          </div>
        </div>
      )}
    </li>
  );
}

function RecommendationRow({ recommendation, currency }: { recommendation: OwnerPortalRecommendation; currency: string }) {
  const priority = RECOMMENDATION_PRIORITY_PILL[recommendation.priority];
  const done = recommendation.status === "DONE";

  return (
    <li className={cn("flex flex-col gap-1.5 py-5", done && "opacity-70")}>
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="s-heading text-lg">{recommendation.title}</span>
        <Pill className={priority.className}>{priority.label}</Pill>
        <span className="text-sm text-site-quiet">{RECOMMENDATION_STATUS_LABELS[recommendation.status]}</span>
      </div>
      {recommendation.details && <p className="text-sm text-site-quiet">{recommendation.details}</p>}
      <div className="flex flex-wrap items-center gap-4 text-sm text-site-quiet">
        {recommendation.estCost != null && <span>Costo estimado: {money(currency, recommendation.estCost)}</span>}
        {recommendation.pdfUrl && (
          <a
            href={recommendation.pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-site-ink underline underline-offset-2 hover:no-underline"
          >
            Ver propuesta
          </a>
        )}
      </div>
    </li>
  );
}

function PropertySection({
  property,
  agencySlug,
  agencyName,
  today,
}: {
  property: OwnerPortalProperty;
  agencySlug: string;
  agencyName: string;
  today: Date;
}) {
  const photos = [...property.photos].sort((a, b) => a.position - b.position);
  const cover = photos.find((photo) => photo.isCover) ?? photos[0];
  const place = placeOf(property);
  const price = formatPrice(property);
  const status = PROPERTY_PILL[property.status];
  const isRent = property.listingType === "RENT";

  return (
    <article className="flex flex-col gap-8 border-t border-site-line pt-10 first:border-t-0 first:pt-0">
      <div className="grid gap-6 sm:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] sm:gap-8">
        <div className="aspect-[4/3] overflow-hidden rounded-xl bg-site-surface">
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={sizedImage(cover.url, IMAGE_WIDTH.card)} alt="" className="size-full object-cover" />
          ) : (
            <PhotoPlaceholder />
          )}
        </div>
        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <Pill className={status.className}>{status.label}</Pill>
            <span className="text-sm text-site-quiet">
              {LISTING_TYPE_LABELS[property.listingType]} · {categoryLabel(property.category)}
            </span>
          </div>
          <h2 className="s-heading text-[clamp(1.6rem,3vw,2.25rem)] leading-tight text-balance">{property.title}</h2>
          {place && (
            <p className="flex items-start gap-1.5 text-site-quiet">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
              {place}
            </p>
          )}
          <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-2">
            <p className="tabular-nums">
              <span className="block text-sm text-site-quiet">{isRent ? "Precio por noche" : "Precio publicado"}</span>
              <span className="s-heading text-2xl">{price ?? "Sin precio cargado"}</span>
            </p>
            {property.published ? (
              <Link
                href={`/page/${agencySlug}/properties/${property.slug}`}
                className="inline-flex h-10 items-center rounded-lg border border-site-line px-4 text-sm font-medium outline-none hover:bg-site-surface focus-visible:ring-2 focus-visible:ring-site-accent"
              >
                Ver en el sitio de {agencyName}
              </Link>
            ) : (
              <span className="text-sm text-site-quiet">Todavía no está en el sitio de {agencyName}.</span>
            )}
          </div>
        </div>
      </div>

      {isRent && <OccupancyStrip bookings={property.bookings} today={today} />}

      {(isRent || property.bookings.length > 0) && (
        <section aria-label={`Reservas de ${property.title}`} className="flex flex-col">
          <h3 className="s-heading text-xl">Reservas</h3>
          {property.bookings.length === 0 ? (
            <p className="pt-2 text-site-quiet">
              Todavía no hay reservas. Cuando {agencyName} cargue una, la vas a ver acá con sus fechas y pagos.
            </p>
          ) : (
            <ul className="divide-y divide-site-line">
              {property.bookings.map((booking, index) => (
                <BookingRow key={index} booking={booking} today={today} />
              ))}
            </ul>
          )}
        </section>
      )}

      {property.recommendations.length > 0 && (
        <section aria-label={`Mejoras sugeridas para ${property.title}`} className="flex flex-col">
          <h3 className="s-heading text-xl">Mejoras sugeridas</h3>
          <ul className="divide-y divide-site-line">
            {property.recommendations.map((recommendation) => (
              <RecommendationRow key={recommendation.id} recommendation={recommendation} currency={property.currency} />
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}

export function OwnerPortalView({ portal }: { portal: OwnerPortal }) {
  const { agency, properties } = portal;
  const site = resolveSite(agency.site);
  const today = startOfDay(new Date());

  const published = properties.filter((property) => property.published).length;
  const allBookings = properties.flatMap((property) =>
    property.bookings.map((booking) => ({ booking, property, stay: stayOf(booking) })),
  );
  const next = allBookings
    .filter(({ booking, stay }) => booking.status !== "CANCELLED" && stay && !isAfter(today, stay.end))
    .sort((a, b) => a.stay!.start.getTime() - b.stay!.start.getTime())[0];
  const collected = sumByCurrency(
    allBookings.flatMap(({ booking }) =>
      booking.payments
        .filter((payment) => payment.status === "PAID" && payment.type !== "COMMISSION")
        .map((payment) => ({ currency: payment.currency, amount: payment.amount })),
    ),
  );

  // Without the gross figures in the statement, the commission is hidden.
  const netOnly = portal.statement.totals.some((total) => total.collected === undefined);
  const due = sumByCurrency(portal.statement.totals.map((total) => ({ currency: total.currency, amount: total.due })));

  const hasRentals = properties.some((property) => property.listingType === "RENT");
  const figures = [
    {
      label: "En el sitio",
      value: properties.length === 0 ? "—" : `${published} de ${properties.length}`,
      detail: properties.length === 1 ? "propiedad publicada" : "propiedades publicadas",
    },
    hasRentals &&
      (next && !isAfter(next.stay!.start, today)
        ? {
            label: "Estadía en curso",
            value: `Hasta el ${format(next.stay!.end, "d 'de' MMMM", { locale: es })}`,
            detail: next.property.title,
          }
        : {
            label: "Próxima estadía",
            value: next ? format(next.stay!.start, "d 'de' MMMM", { locale: es }) : "Ninguna",
            detail: next ? next.property.title : "No hay reservas por delante",
          }),
    allBookings.length > 0 &&
      (netOnly
        ? {
            // The commission is hidden, so the gross collected would give it away next to what's due.
            label: "Te corresponde",
            value: due.length > 0 ? due.map(([currency, amount]) => money(currency, amount)).join(" + ") : "—",
            detail: due.length > 0 ? "de lo cobrado de tus reservas" : "Todavía no hay pagos",
          }
        : {
            label: "Cobrado",
            value: collected.length > 0 ? collected.map(([currency, amount]) => money(currency, amount)).join(" + ") : "—",
            detail: collected.length > 0 ? "en pagos de tus reservas" : "Todavía no hay pagos",
          }),
  ].filter(Boolean) as { label: string; value: string; detail: string }[];

  const contacts = [
    site.whatsapp && {
      icon: MessageCircle,
      label: "WhatsApp",
      href: whatsappLink(site.whatsapp, "Hola, soy propietario y tengo una consulta sobre mis propiedades."),
    },
    agency.contactEmail && { icon: Mail, label: agency.contactEmail, href: `mailto:${agency.contactEmail}` },
    site.phone && { icon: Phone, label: site.phone, href: `tel:${site.phone.replace(/[^\d+]/g, "")}` },
  ].filter(Boolean) as { icon: typeof Mail; label: string; href: string }[];

  return (
    <SiteRoot site={site}>
      <SiteHeader agency={agency} site={site} slug={agency.slug} />

      <main className="flex flex-1 flex-col">
        <section className="bg-site-surface">
          <div className={cn(SITE_WRAP, "flex flex-col gap-10 py-12 sm:py-16")}>
            <div className="flex max-w-2xl flex-col gap-3">
              <h1 className="s-heading text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.05] text-balance">
                Hola, {portal.ownerName}
              </h1>
              <p className="text-lg text-site-quiet">
                {hasRentals
                  ? `Así están hoy tus propiedades con ${agency.name}: si están publicadas, cuándo hay huéspedes y qué se cobró.`
                  : `Así están hoy tus propiedades con ${agency.name}: si están publicadas y a qué precio.`}
              </p>
            </div>
            <dl
              className="grid border-t border-site-ink/15 sm:grid-cols-(--figures)"
              style={{ "--figures": `repeat(${figures.length}, minmax(0, 1fr))` } as React.CSSProperties}
            >
              {figures.map((figure) => (
                <div
                  key={figure.label}
                  className="flex min-w-0 flex-col gap-1 border-b border-site-ink/15 py-5 sm:border-b-0 sm:border-l sm:px-6 sm:first:border-l-0 sm:first:pl-0"
                >
                  <dt className="text-sm text-site-quiet">{figure.label}</dt>
                  <dd className="s-heading text-2xl tabular-nums">{figure.value}</dd>
                  <dd className="truncate text-sm text-site-quiet">{figure.detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <div className={cn(SITE_WRAP, "flex flex-col gap-14 py-12 sm:py-16")}>
          {(portal.statement.totals.length > 0 || portal.statement.payouts.length > 0) && (
            <section aria-labelledby="estado-de-cuenta" className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <h2 id="estado-de-cuenta" className="s-heading text-2xl">
                  Estado de cuenta
                </h2>
                <p className="max-w-xl text-site-quiet">Lo que se cobró de tus reservas, lo que te corresponde y lo que {agency.name} ya te liquidó.</p>
              </div>
              <OwnerStatementView statement={portal.statement} tone="site" />
            </section>
          )}

          {properties.length === 0 ? (
            <p className="max-w-xl text-lg text-site-quiet">
              Todavía no tenés propiedades asignadas. Cuando {agency.name} te asigne una, aparece acá.
            </p>
          ) : (
            properties.map((property) => (
              <PropertySection
                key={property.id}
                property={property}
                agencySlug={agency.slug}
                agencyName={agency.name}
                today={today}
              />
            ))
          )}

          {contacts.length > 0 && (
            <section className="flex flex-col gap-4 border-t border-site-line pt-10">
              <h2 className="s-heading text-xl">¿Querés cambiar algo?</h2>
              <p className="-mt-2 max-w-xl text-site-quiet">
                Precio, fechas bloqueadas o fotos: escribile a {agency.name} y lo actualizan.
              </p>
              <div className="flex flex-wrap gap-2">
                {contacts.map((contact, index) => (
                  <a
                    key={contact.href}
                    href={contact.href}
                    target={contact.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className={cn(
                      "inline-flex h-11 items-center gap-2 rounded-lg px-4 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-site-accent focus-visible:ring-offset-2",
                      index === 0
                        ? "bg-site-accent text-site-accent-ink hover:opacity-90"
                        : "border border-site-line hover:bg-site-surface",
                    )}
                  >
                    <contact.icon className="size-4" aria-hidden />
                    {contact.label}
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <SiteFooter agency={agency} site={site} />
    </SiteRoot>
  );
}
