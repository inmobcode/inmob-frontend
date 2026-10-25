import { differenceInCalendarDays, parseISO } from "date-fns";
import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";

import { placeOf } from "@/components/public/property-card";
import { PrintButton } from "@/components/public/print-button";
import { SiteRoot } from "@/components/public/site-chrome";
import { useFormat } from "@/i18n/format";
import { Link } from "@/i18n/navigation";
import type { PublicBooking } from "@/lib/api/bookings";
import { parseApiDate } from "@/lib/dates";
import { useLabels } from "@/lib/labels";
import { resolveSite } from "@/lib/site-theme";
import { cn } from "@/lib/utils";

/**
 * A proof of the booking and what was paid, laid out to print on one page or
 * save as a PDF from the browser's print dialog. It is not an invoice, and
 * says so. Like the booking page, it shows no commission and no notes.
 */
export function BookingReceipt({ booking, token }: { booking: PublicBooking; token: string }) {
  const t = useTranslations("site.receipt");
  const labels = useLabels();
  const { date, money: formatMoney } = useFormat();
  const money = (currency: string, value: number) => formatMoney(currency, value, {});
  const { agency, property } = booking;
  const site = resolveSite(agency.site);
  const place = placeOf(property);

  const start = booking.startDate ? parseISO(booking.startDate) : null;
  const end = booking.endDate ? parseISO(booking.endDate) : null;
  const nights = start && end ? Math.max(differenceInCalendarDays(end, start), 1) : null;

  const paid = booking.payments
    .filter((payment) => payment.status === "PAID")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const total = booking.totalPrice ?? booking.payments.reduce((sum, payment) => sum + payment.amount, 0);
  const due = Math.max(total - paid, 0);

  const rows: { label: string; value: string }[] = [
    { label: t("client"), value: booking.clientName ?? "—" },
    { label: t("property"), value: place ? `${property.title} · ${place}` : property.title },
    ...(start && end && nights
      ? [
          { label: t("checkIn"), value: date(start, "long") },
          { label: t("checkOut"), value: date(end, "long") },
          { label: t("duration"), value: t("nights", { count: nights }) },
        ]
      : []),
    ...(booking.guests ? [{ label: t("guests"), value: t("guestsCount", { count: booking.guests }) }] : []),
    { label: t("status"), value: labels.bookingStatus(booking.status) },
  ];

  return (
    <SiteRoot site={site} className="bg-site-surface print:bg-white">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-8 print:max-w-none print:p-0">
        <div className="flex items-center justify-between gap-3 print:hidden">
          <Link
            href={`/booking/${token}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-site-quiet outline-none hover:text-site-ink focus-visible:ring-2 focus-visible:ring-site-accent"
          >
            <ChevronLeft className="size-4" aria-hidden />
            {t("back")}
          </Link>
          <PrintButton
            label={t("print")}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-site-accent px-4 text-sm font-medium text-site-accent-ink outline-none hover:opacity-90 focus-visible:ring-2 focus-visible:ring-site-accent focus-visible:ring-offset-2"
          />
        </div>

        <article className="flex flex-col gap-8 rounded-xl border border-site-line bg-site-bg p-6 sm:p-10 print:rounded-none print:border-0 print:p-0">
          <header className="flex flex-wrap items-start justify-between gap-6">
            <div className="flex flex-col gap-1">
              {agency.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={agency.logoUrl} alt={agency.name} className="mb-2 h-10 w-auto max-w-40 object-contain object-left" />
              ) : null}
              <p className="s-heading text-xl">{agency.name}</p>
              {agency.contactEmail && <p className="text-sm text-site-quiet">{agency.contactEmail}</p>}
              {site.phone && <p className="text-sm text-site-quiet">{site.phone}</p>}
            </div>
            <div className="flex flex-col gap-1 text-sm sm:text-right">
              <p className="s-heading text-2xl">{t("title")}</p>
              <p className="text-site-quiet">{t("reference", { reference: booking.reference })}</p>
              <p className="text-site-quiet">{t("issued", { date: date(new Date(), "long") })}</p>
            </div>
          </header>

          <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-[10rem_1fr]">
            {rows.map((row) => (
              <div key={row.label} className="contents">
                <dt className="text-site-quiet">{row.label}</dt>
                <dd className="font-medium">{row.value}</dd>
              </div>
            ))}
          </dl>

          <section className="flex flex-col gap-3">
            <h2 className="s-heading text-lg">{t("payments")}</h2>
            {booking.payments.length > 0 ? (
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-site-line text-left text-site-quiet">
                    <th className="py-2 pr-3 font-normal">{t("date")}</th>
                    <th className="py-2 pr-3 font-normal">{t("concept")}</th>
                    <th className="py-2 pr-3 font-normal">{t("method")}</th>
                    <th className="py-2 text-right font-normal">{t("amount")}</th>
                  </tr>
                </thead>
                <tbody>
                  {booking.payments.map((payment, index) => (
                    <tr key={index} className={cn("border-b border-site-line", payment.status !== "PAID" && "text-site-quiet")}>
                      <td className="py-2 pr-3 whitespace-nowrap">
                        {payment.status === "PAID"
                          ? payment.paidAt
                            ? date(parseApiDate(payment.paidAt), "medium")
                            : t("paid")
                          : t("pending")}
                      </td>
                      <td className="py-2 pr-3">{labels.paymentType(payment.type)}</td>
                      <td className="py-2 pr-3">{payment.method ?? "—"}</td>
                      <td className="py-2 text-right tabular-nums">{money(payment.currency, payment.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-site-quiet">{t("noPayments")}</p>
            )}
          </section>

          {total > 0 && (
            <dl className="ml-auto grid w-full max-w-xs grid-cols-[1fr_auto] gap-x-6 gap-y-2 text-sm">
              <dt className="text-site-quiet">{t("total")}</dt>
              <dd className="text-right tabular-nums">{money(booking.currency, total)}</dd>
              <dt className="text-site-quiet">{t("paidTotal")}</dt>
              <dd className="text-right tabular-nums">{money(booking.currency, paid)}</dd>
              <dt className="border-t border-site-line pt-2 font-medium">{t("due")}</dt>
              <dd className="border-t border-site-line pt-2 text-right font-semibold tabular-nums">
                {money(booking.currency, due)}
              </dd>
            </dl>
          )}

          <p className="text-xs text-site-quiet">{t("notInvoice", { agency: agency.name })}</p>
        </article>
      </div>
    </SiteRoot>
  );
}
