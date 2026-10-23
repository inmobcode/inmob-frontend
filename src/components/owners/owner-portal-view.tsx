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
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useTranslations } from "next-intl";

import { OwnerStatementView } from "@/components/owners/owner-statement";
import { PhotoPlaceholder, formatPrice, placeOf } from "@/components/public/property-card";
import { SITE_WRAP, SiteFooter, SiteHeader, SiteRoot } from "@/components/public/site-chrome";
import { useFormat } from "@/i18n/format";
import { Link } from "@/i18n/navigation";
import type { BookingStatus } from "@/lib/api/bookings";
import type { OwnerPortal, OwnerPortalBooking, OwnerPortalProperty, OwnerPortalRecommendation } from "@/lib/api/owner-portal";
import type { PropertyStatus } from "@/lib/api/properties";
import type { RecommendationPriority } from "@/lib/api/recommendations";
import { useLabels } from "@/lib/labels";
import { resolveSite, whatsappLink } from "@/lib/site-theme";
import { cn } from "@/lib/utils";
import { IMAGE_WIDTH, sizedImage } from "@/lib/image-url";

/** How far ahead the occupancy strip looks. */
const STRIP_MONTHS = 6;

// The words for each status live in "site.owner" (bookingStatus, propertyStatus, payment, priority, recommendation).
const BOOKING_PILL: Record<BookingStatus, string> = {
  PENDING: "bg-amber-100 text-amber-900",
  CONFIRMED: "bg-site-accent text-site-accent-ink",
  COMPLETED: "bg-site-surface text-site-ink",
  CANCELLED: "bg-red-100 text-red-900",
};

const PROPERTY_PILL: Record<PropertyStatus, string> = {
  PUBLISHED: "bg-site-accent text-site-accent-ink",
  DRAFT: "bg-site-surface text-site-ink",
  ARCHIVED: "bg-site-surface text-site-quiet",
};

const RECOMMENDATION_PRIORITY_PILL: Record<RecommendationPriority, string> = {
  LOW: "bg-site-surface text-site-quiet",
  MEDIUM: "bg-site-surface text-site-ink",
  HIGH: "bg-site-accent text-site-accent-ink",
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
  const t = useTranslations("site.owner");
  const labels = useLabels();
  const { dateLocale, date } = useFormat();
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
            ? t("nightsUntil", { count: bookedNights, month: format(addMonths(from, STRIP_MONTHS - 1), "LLLL", { locale: dateLocale }) })
            : t("noStaysUntil", { month: format(addMonths(from, STRIP_MONTHS - 1), "LLLL", { locale: dateLocale }) })}
        </span>
        <span className="flex items-center gap-4 text-sm text-site-quiet">
          <span className="flex items-center gap-1.5">
            <span aria-hidden className="size-2.5 rounded-sm bg-site-accent" />
            {labels.bookingStatus("CONFIRMED")}
          </span>
          <span className="flex items-center gap-1.5">
            <span aria-hidden className="size-2.5 rounded-sm border border-site-ink/50" />
            {labels.bookingStatus("PENDING")}
          </span>
        </span>
      </figcaption>

      <div className="relative">
        {/* Month columns: hairlines between them and the month name under each. */}
        <div className="grid" style={{ gridTemplateColumns: `repeat(${STRIP_MONTHS}, minmax(0, 1fr))` }}>
          {months.map((month) => (
            <div key={month.toISOString()} className="flex flex-col gap-2 border-l border-site-line first:border-l-0">
              <div className="h-10" />
              <span className="pl-2 text-xs text-site-quiet capitalize">{format(month, "LLL", { locale: dateLocale })}</span>
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
              title={`${date(stay.start, "dayMonthShort")} – ${date(stay.end, "dayMonthShort")} · ${labels.bookingStatus(booking.status)}`}
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
          <span className="mt-1 text-[11px] font-medium leading-none">{t("today")}</span>
        </span>
      </div>
      <p className="sr-only">
        {stays.length === 0
          ? t("noStays")
          : stays
              .map(({ booking, stay }) =>
                t("stayRange", {
                  from: date(stay.start, "dayMonth"),
                  to: date(stay.end, "dayMonth"),
                  status: labels.bookingStatus(booking.status).toLowerCase(),
                }),
              )
              .join("; ")}
      </p>
    </figure>
  );
}

function BookingRow({ booking, today }: { booking: OwnerPortalBooking; today: Date }) {
  const t = useTranslations("site.owner");
  const labels = useLabels();
  const { date, money: formatMoney } = useFormat();
  const money = (currency: string, value: number) => formatMoney(currency, value, {});
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
              ? `${date(stay.start, "weekdayDayMonthShort")} – ${date(stay.end, "weekdayDayMonthShort")}`
              : t("noDates")}
          </span>
          <Pill className={pill}>{labels.bookingStatus(booking.status)}</Pill>
        </div>
        <span className="text-sm text-site-quiet">
          {stay ? t("nights", { count: stay.nights }) : t("sale")}
          {ownerPayments.length > 0 &&
            ` · ${ownerPayments
              .map((payment) =>
                t(payment.status === "PAID" ? "paymentPaid" : "paymentPending", {
                  payment: t(`payment.${payment.type === "DEPOSIT" ? "DEPOSIT" : "BALANCE"}`),
                }),
              )
              .join(", ")}`}
        </span>
      </div>
      {total > 0 && (
        <div className="flex flex-col gap-2 sm:items-end">
          <span className="text-sm tabular-nums">
            <span className="font-medium">{money(booking.currency, paid)}</span>
            <span className="text-site-quiet"> {t("ofTotal", { total: money(booking.currency, total) })}</span>
          </span>
          <div
            className="h-1.5 w-full overflow-hidden rounded-full bg-site-surface"
            role="progressbar"
            aria-label={t("collected")}
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
  const t = useTranslations("site.owner");
  const { money: formatMoney } = useFormat();
  const money = (code: string, value: number) => formatMoney(code, value, {});
  const priority = RECOMMENDATION_PRIORITY_PILL[recommendation.priority];
  const done = recommendation.status === "DONE";

  return (
    <li className={cn("flex flex-col gap-1.5 py-5", done && "opacity-70")}>
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="s-heading text-lg">{recommendation.title}</span>
        <Pill className={priority}>{t(`priority.${recommendation.priority}`)}</Pill>
        <span className="text-sm text-site-quiet">{t(`recommendation.${recommendation.status}`)}</span>
      </div>
      {recommendation.details && <p className="text-sm text-site-quiet">{recommendation.details}</p>}
      <div className="flex flex-wrap items-center gap-4 text-sm text-site-quiet">
        {recommendation.estCost != null && <span>{t("estimatedCost", { amount: money(currency, recommendation.estCost) })}</span>}
        {recommendation.pdfUrl && (
          <a
            href={recommendation.pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-site-ink underline underline-offset-2 hover:no-underline"
          >
            {t("seeProposal")}
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
  const t = useTranslations("site.owner");
  const labels = useLabels();
  const { tag } = useFormat();
  const photos = [...property.photos].sort((a, b) => a.position - b.position);
  const cover = photos.find((photo) => photo.isCover) ?? photos[0];
  const place = placeOf(property);
  const price = formatPrice(property, tag);
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
            <Pill className={status}>{t(`propertyStatus.${property.status}`)}</Pill>
            <span className="text-sm text-site-quiet">
              {labels.listingType(property.listingType)} · {labels.category(property.category)}
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
              <span className="block text-sm text-site-quiet">{isRent ? t("pricePerNight") : t("listedPrice")}</span>
              <span className="s-heading text-2xl">{price ?? t("noPrice")}</span>
            </p>
            {property.published ? (
              <Link
                href={`/page/${agencySlug}/properties/${property.slug}`}
                className="inline-flex h-10 items-center rounded-lg border border-site-line px-4 text-sm font-medium outline-none hover:bg-site-surface focus-visible:ring-2 focus-visible:ring-site-accent"
              >
                {t("seeOnSite", { agency: agencyName })}
              </Link>
            ) : (
              <span className="text-sm text-site-quiet">{t("notOnSite", { agency: agencyName })}</span>
            )}
          </div>
        </div>
      </div>

      {isRent && <OccupancyStrip bookings={property.bookings} today={today} />}

      {(isRent || property.bookings.length > 0) && (
        <section aria-label={t("bookingsOf", { title: property.title })} className="flex flex-col">
          <h3 className="s-heading text-xl">{t("bookings")}</h3>
          {property.bookings.length === 0 ? (
            <p className="pt-2 text-site-quiet">{t("noBookings", { agency: agencyName })}</p>
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
        <section aria-label={t("improvementsFor", { title: property.title })} className="flex flex-col">
          <h3 className="s-heading text-xl">{t("improvements")}</h3>
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
  const t = useTranslations("site.owner");
  const { date, money: formatMoney } = useFormat();
  const money = (currency: string, value: number) => formatMoney(currency, value, {});
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
      label: t("onSite"),
      value: properties.length === 0 ? "—" : t("publishedOf", { published, total: properties.length }),
      detail: t("publishedDetail", { count: properties.length }),
    },
    hasRentals &&
      (next && !isAfter(next.stay!.start, today)
        ? {
            label: t("currentStay"),
            value: t("until", { date: date(next.stay!.end, "dayMonth") }),
            detail: next.property.title,
          }
        : {
            label: t("nextStay"),
            value: next ? date(next.stay!.start, "dayMonth") : t("none"),
            detail: next ? next.property.title : t("nothingAhead"),
          }),
    allBookings.length > 0 &&
      (netOnly
        ? {
            // The commission is hidden, so the gross collected would give it away next to what's due.
            label: t("yourShare"),
            value: due.length > 0 ? due.map(([currency, amount]) => money(currency, amount)).join(" + ") : "—",
            detail: due.length > 0 ? t("yourShareDetail") : t("noPayments"),
          }
        : {
            label: t("collected"),
            value: collected.length > 0 ? collected.map(([currency, amount]) => money(currency, amount)).join(" + ") : "—",
            detail: collected.length > 0 ? t("collectedDetail") : t("noPayments"),
          }),
  ].filter(Boolean) as { label: string; value: string; detail: string }[];

  const contacts = [
    site.whatsapp && {
      icon: MessageCircle,
      label: "WhatsApp",
      href: whatsappLink(site.whatsapp, t("whatsappMessage")),
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
                {t("hello", { name: portal.ownerName })}
              </h1>
              <p className="text-lg text-site-quiet">
                {t(hasRentals ? "introRentals" : "introSales", { agency: agency.name })}
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
                  {t("statementTitle")}
                </h2>
                <p className="max-w-xl text-site-quiet">{t("statementBody", { agency: agency.name })}</p>
              </div>
              <OwnerStatementView statement={portal.statement} tone="site" />
            </section>
          )}

          {properties.length === 0 ? (
            <p className="max-w-xl text-lg text-site-quiet">
              {t("noProperties", { agency: agency.name })}
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
              <h2 className="s-heading text-xl">{t("changeTitle")}</h2>
              <p className="-mt-2 max-w-xl text-site-quiet">{t("changeBody", { agency: agency.name })}</p>
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
