import { differenceInCalendarDays, format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Check, Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";

import {
  PhotoPlaceholder,
  coverPhoto,
  placeOf,
} from "@/components/public/property-card";
import {
  SITE_WRAP,
  SiteFooter,
  SiteHeader,
  SiteRoot,
} from "@/components/public/site-chrome";
import type { BookingStatus, PublicBooking } from "@/lib/api/bookings";
import { parseApiDate } from "@/lib/dates";
import {
  LISTING_TYPE_LABELS,
  PAYMENT_TYPE_LABELS,
  categoryLabel,
} from "@/lib/properties-labels";
import { resolveSite, whatsappLink } from "@/lib/site-theme";
import { cn } from "@/lib/utils";
import { IMAGE_WIDTH, sizedImage } from "@/lib/image-url";

/** The headline and the line under it, written to the client, per status. */
const STATUS_COPY: Record<BookingStatus, { title: string; detail: string }> = {
  PENDING: {
    title: "Tu reserva está pendiente",
    detail:
      "La agencia todavía tiene que confirmarla. Te avisamos por email cuando esté confirmada.",
  },
  CONFIRMED: {
    title: "Tu reserva está confirmada",
    detail: "Las fechas son tuyas. Guardá este link para volver a ver los detalles.",
  },
  COMPLETED: {
    title: "Tu estadía terminó",
    detail: "Gracias por elegirnos. Acá quedan los detalles de la reserva.",
  },
  CANCELLED: {
    title: "Esta reserva fue cancelada",
    detail: "Si no esperabas este cambio, escribinos y lo revisamos.",
  },
};

const STATUS_PILL: Record<BookingStatus, { label: string; className: string }> = {
  PENDING: { label: "Pendiente", className: "bg-amber-100 text-amber-900" },
  CONFIRMED: { label: "Confirmada", className: "bg-site-accent text-site-accent-ink" },
  COMPLETED: { label: "Completada", className: "bg-site-surface text-site-ink" },
  CANCELLED: { label: "Cancelada", className: "bg-red-100 text-red-900" },
};

const money = (currency: string, value: number) =>
  `${currency} ${value.toLocaleString("es-AR")}`;

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="s-heading text-xl">{children}</h2>;
}

export function BookingView({ booking }: { booking: PublicBooking }) {
  const { agency, property } = booking;
  const site = resolveSite(agency.site);
  const copy = STATUS_COPY[booking.status];
  const pill = STATUS_PILL[booking.status];
  const cover = coverPhoto(property);
  const place = placeOf(property);
  const firstName = booking.clientName?.trim().split(/\s+/)[0];

  const start = booking.startDate ? parseISO(booking.startDate) : null;
  const end = booking.endDate ? parseISO(booking.endDate) : null;
  const nights = start && end ? Math.max(differenceInCalendarDays(end, start), 1) : null;

  const paid = booking.payments
    .filter((payment) => payment.status === "PAID")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const total =
    booking.totalPrice ??
    booking.payments.reduce((sum, payment) => sum + payment.amount, 0);
  const due = Math.max(total - paid, 0);
  const ratio = total > 0 ? Math.min(paid / total, 1) : 0;

  const contacts = [
    site.whatsapp && {
      icon: MessageCircle,
      label: "WhatsApp",
      href: whatsappLink(
        site.whatsapp,
        `Hola, tengo una consulta sobre mi reserva en "${property.title}".`,
      ),
    },
    agency.contactEmail && {
      icon: Mail,
      label: agency.contactEmail,
      href: `mailto:${agency.contactEmail}`,
    },
    site.phone && {
      icon: Phone,
      label: site.phone,
      href: `tel:${site.phone.replace(/[^\d+]/g, "")}`,
    },
  ].filter(Boolean) as { icon: typeof Mail; label: string; href: string }[];

  return (
    <SiteRoot site={site}>
      <SiteHeader agency={agency} site={site} slug={agency.slug} />

      <main className={cn(SITE_WRAP, "flex max-w-3xl! flex-1 flex-col gap-12 py-10 sm:py-14")}>
        <header className="flex flex-col gap-3">
          <span
            className={cn(
              "inline-flex h-7 w-fit items-center gap-1.5 rounded-full px-3 text-sm font-medium",
              pill.className,
            )}
          >
            {booking.status === "CONFIRMED" ? (
              <Check className="size-3.5" aria-hidden />
            ) : booking.status === "PENDING" ? (
              <Clock className="size-3.5" aria-hidden />
            ) : null}
            {pill.label}
          </span>
          <h1 className="s-heading text-4xl text-balance sm:text-5xl">
            {firstName ? `${firstName}, ${copy.title.charAt(0).toLowerCase()}${copy.title.slice(1)}` : copy.title}
          </h1>
          <p className="max-w-xl text-site-quiet">{copy.detail}</p>
        </header>

        <article className="grid overflow-hidden rounded-xl border border-site-line sm:grid-cols-[16rem_minmax(0,1fr)]">
          <div className="aspect-[16/10] bg-site-surface sm:aspect-auto sm:min-h-44">
            {cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={sizedImage(cover.url, IMAGE_WIDTH.card)} alt="" className="size-full object-cover" />
            ) : (
              <PhotoPlaceholder />
            )}
          </div>
          <div className="flex flex-col gap-2 p-5 sm:p-6">
            <p className="text-sm text-site-quiet">
              {LISTING_TYPE_LABELS[property.listingType]} · {categoryLabel(property.category)}
            </p>
            <p className="s-heading text-2xl text-balance">{property.title}</p>
            {place && (
              <p className="flex items-center gap-1.5 text-sm text-site-quiet">
                <MapPin className="size-4 shrink-0" aria-hidden />
                {place}
              </p>
            )}
            {property.published && (
              <Link
                href={`/page/${agency.slug}/properties/${property.slug}`}
                className="mt-auto w-fit pt-2 text-sm font-medium underline decoration-site-line underline-offset-4 outline-none hover:decoration-site-ink focus-visible:ring-2 focus-visible:ring-site-accent"
              >
                Ver la propiedad
              </Link>
            )}
          </div>
        </article>

        {start && end && nights && (
          <section className="flex flex-col gap-4">
            <SectionTitle>Tu estadía</SectionTitle>
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-site-line bg-site-line sm:grid-cols-3">
              {[
                { label: "Check-in", value: format(start, "EEE d 'de' MMMM", { locale: es }), sub: format(start, "yyyy") },
                { label: "Check-out", value: format(end, "EEE d 'de' MMMM", { locale: es }), sub: format(end, "yyyy") },
                { label: "Duración", value: `${nights} ${nights === 1 ? "noche" : "noches"}`, sub: null },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col gap-1 bg-site-bg p-5 last:col-span-2 sm:last:col-span-1"
                >
                  <dt className="text-sm text-site-quiet">{item.label}</dt>
                  <dd className="s-heading text-lg first-letter:uppercase">{item.value}</dd>
                  {item.sub && <dd className="text-sm text-site-quiet">{item.sub}</dd>}
                </div>
              ))}
            </dl>
          </section>
        )}

        {total > 0 && (
          <section className="flex flex-col gap-4">
            <SectionTitle>Pagos</SectionTitle>
            <div className="flex flex-col gap-5 rounded-xl border border-site-line p-5 sm:p-6">
              <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-site-quiet">Total</span>
                  <span className="s-heading text-3xl tabular-nums">
                    {money(booking.currency, total)}
                  </span>
                </div>
                <div className="flex gap-6 text-sm tabular-nums">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-site-quiet">Pagado</span>
                    <span className="font-medium">{money(booking.currency, paid)}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-site-quiet">Falta pagar</span>
                    <span className="font-medium">{money(booking.currency, due)}</span>
                  </div>
                </div>
              </div>
              <div
                className="h-2 overflow-hidden rounded-full bg-site-surface"
                role="progressbar"
                aria-label="Pagado"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(ratio * 100)}
              >
                <div className="h-full rounded-full bg-site-accent" style={{ width: `${ratio * 100}%` }} />
              </div>

              {booking.payments.length > 0 && (
                <ul className="flex flex-col divide-y divide-site-line border-t border-site-line">
                  {booking.payments.map((payment, index) => (
                    <li key={index} className="flex items-center justify-between gap-4 py-3 last:pb-0">
                      <div className="flex flex-col">
                        <span className="font-medium">{PAYMENT_TYPE_LABELS[payment.type]}</span>
                        <span className="text-sm text-site-quiet">
                          {payment.status === "PAID"
                            ? payment.paidAt
                              ? `Pagado el ${format(parseApiDate(payment.paidAt), "d 'de' MMMM", { locale: es })}`
                              : "Pagado"
                            : "Pendiente"}
                        </span>
                      </div>
                      <span className={cn("tabular-nums", payment.status === "PAID" ? "font-medium" : "text-site-quiet")}>
                        {money(payment.currency, payment.amount)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}

        {contacts.length > 0 && (
          <section className="flex flex-col gap-4">
            <SectionTitle>¿Necesitás cambiar algo?</SectionTitle>
            <p className="-mt-2 text-site-quiet">Escribile a {agency.name} y te ayudan con tu reserva.</p>
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
      </main>

      <SiteFooter agency={agency} site={site} />
    </SiteRoot>
  );
}
