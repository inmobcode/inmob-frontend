"use client";

import { CalendarClock, UserRound } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { Collage, coversOf, OfferMenu, propertiesOf, type OfferActions } from "@/components/offers/offer-card";
import { OfferStatusPill } from "@/components/offers/offer-status-pill";
import { ControlsZone } from "@/components/properties/property-controls";
import { useFormat } from "@/i18n/format";
import type { Offer } from "@/lib/api/offers";
import { parseApiDate } from "@/lib/dates";
import { useLabels } from "@/lib/labels";
import { cn } from "@/lib/utils";

function Total({ offer, className }: { offer: Offer; className?: string }) {
  const t = useTranslations("offers.card");
  const { number } = useFormat();
  return offer.total ? (
    <span className={cn("tabular-nums", className)}>
      <span className="mr-1 text-xs font-medium text-muted-foreground">{offer.currency}</span>
      <span className="font-semibold">{number(offer.total)}</span>
    </span>
  ) : (
    <span className={cn("text-muted-foreground", className)}>{t("noTotal")}</span>
  );
}

function Expiry({ offer }: { offer: Offer }) {
  const t = useTranslations("offers.card");
  const { date } = useFormat();
  if (!offer.expiresAt) return null;
  const expired = offer.status === "EXPIRED";
  return (
    <span className={cn("inline-flex items-center gap-1.5", expired ? "text-destructive" : "text-muted-foreground")}>
      <CalendarClock className="size-4" />
      {t(expired ? "expired" : "expires", { date: date(parseApiDate(offer.expiresAt), "dayMonth") })}
    </span>
  );
}

const ROW_CLASS =
  "offer-card group flex flex-col gap-4 rounded-2xl bg-card p-3 shadow-[0_1px_2px_oklch(0.3_0.05_160/0.04),0_12px_32px_-12px_oklch(0.3_0.05_160/0.14)] ring-1 ring-foreground/5 outline-none transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_1px_2px_oklch(0.3_0.05_160/0.06),0_24px_44px_-12px_oklch(0.3_0.05_160/0.26)] focus-visible:ring-3 focus-visible:ring-ring/50 sm:flex-row";

/** One offer as a wide row: collage on the left, details in the middle, total and status on the right. */
export function OfferRow({ offer, actions }: { offer: Offer; actions: OfferActions }) {
  const t = useTranslations("offers.card");
  const labels = useLabels();
  const { ago } = useFormat();
  const { agencySlug } = useParams<{ agencySlug: string }>();
  const items = propertiesOf(offer);
  const updated = ago(parseApiDate(offer.updatedAt));
  const expired = offer.status === "EXPIRED";

  return (
    <Link href={`/${agencySlug}/offers/${offer.id}`} className={ROW_CLASS}>
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-secondary sm:w-56 sm:shrink-0">
        <div className={cn("size-full", expired && "opacity-70 grayscale")}>
          <Collage urls={coversOf(offer)} />
        </div>
        <span className="absolute bottom-2 left-2 inline-flex items-center rounded-full bg-foreground/55 px-2 py-0.5 text-xs font-medium text-background backdrop-blur">
          {t("properties", { count: items.length })}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:py-1">
        <p className="text-xs font-medium text-primary">{labels.offerOperation(offer.operation)}</p>
        <h3 className="font-display text-xl leading-tight text-balance line-clamp-2" title={offer.title}>
          {offer.title}
        </h3>
        {offer.referenceCode && (
          <p className="truncate text-xs font-medium text-muted-foreground" title={offer.referenceCode}>
            {t("reference", { code: offer.referenceCode })}
          </p>
        )}
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <UserRound className="size-3.5 shrink-0" />
          <span className="truncate">{offer.clientName?.trim() || t("noClient")}</span>
        </p>
        <div className="mt-auto pt-2 text-sm">
          <Expiry offer={offer} />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 sm:w-48 sm:flex-col sm:items-end sm:py-1 sm:text-right">
        <ControlsZone className="flex items-center gap-2">
          <OfferStatusPill status={offer.status} />
          <OfferMenu offer={offer} actions={actions} className="bg-foreground/[0.06] hover:bg-foreground/10" />
        </ControlsZone>
        <div className="flex flex-col gap-1 sm:items-end">
          <Total offer={offer} className="text-xl" />
          <span className="text-xs text-muted-foreground">{updated}</span>
        </div>
      </div>
    </Link>
  );
}

const HEAD = "px-4 py-3 text-left text-xs font-medium text-muted-foreground";

/** One offer per line, for scanning many at once. */
export function OffersTable({ offers, actions }: { offers: Offer[]; actions: OfferActions }) {
  const t = useTranslations("offers.table");
  const card = useTranslations("offers.card");
  const labels = useLabels();
  const { ago, date } = useFormat();
  const router = useRouter();
  const { agencySlug } = useParams<{ agencySlug: string }>();

  return (
    <div className="overflow-x-auto rounded-2xl bg-card shadow-[0_1px_2px_oklch(0.3_0.05_160/0.04),0_12px_32px_-12px_oklch(0.3_0.05_160/0.14)] ring-1 ring-foreground/5">
      <table className="w-full min-w-[820px] border-collapse text-sm">
        <thead>
          <tr>
            <th className={cn(HEAD, "pl-4")}>{t("offer")}</th>
            <th className={HEAD}>{t("reference")}</th>
            <th className={HEAD}>{t("status")}</th>
            <th className={cn(HEAD, "text-right")}>{t("properties")}</th>
            <th className={cn(HEAD, "text-right")}>{t("total")}</th>
            <th className={HEAD}>{t("expiry")}</th>
            <th className={HEAD}>{t("updated")}</th>
            <th className={cn(HEAD, "w-14")}>
              <span className="sr-only">{t("actions")}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {offers.map((offer) => {
            const expired = offer.status === "EXPIRED";
            return (
              <tr
                key={offer.id}
                onClick={() => router.push(`/${agencySlug}/offers/${offer.id}`)}
                className="offer-card cursor-pointer border-t border-foreground/5 transition-colors hover:bg-foreground/[0.03]"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={cn("size-12 shrink-0 overflow-hidden rounded-lg bg-secondary", expired && "opacity-70 grayscale")}>
                      <Collage urls={coversOf(offer).slice(0, 1)} />
                    </div>
                    <div className="flex min-w-0 flex-col">
                      <Link
                        href={`/${agencySlug}/offers/${offer.id}`}
                        onClick={(event) => event.stopPropagation()}
                        className="truncate font-medium outline-none hover:underline focus-visible:underline"
                        title={offer.title}
                      >
                        {offer.title}
                      </Link>
                      <span className="truncate text-xs text-muted-foreground">
                        {labels.offerOperation(offer.operation)} · {offer.clientName?.trim() || card("noClient")}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                  {offer.referenceCode || "—"}
                </td>
                <td className="px-4 py-3">
                  <OfferStatusPill status={offer.status} />
                </td>
                <td className="px-4 py-3 text-right tabular-nums">{propertiesOf(offer).length}</td>
                <td className="px-4 py-3 text-right">
                  <Total offer={offer} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {offer.expiresAt ? (
                    <span className={expired ? "text-destructive" : "text-muted-foreground"}>
                      {date(parseApiDate(offer.expiresAt), "medium")}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                  {ago(parseApiDate(offer.updatedAt))}
                </td>
                <td className="w-14 py-3 pr-4" onClick={(event) => event.stopPropagation()}>
                  <OfferMenu offer={offer} actions={actions} className="bg-foreground/[0.06] hover:bg-foreground/10" />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
