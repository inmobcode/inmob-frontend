"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarPlus, Copy, Eye, LayoutTemplate, Monitor, Smartphone } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { BookingStatusPill } from "@/components/bookings/booking-parts";
import { CreateBookingDialog } from "@/components/bookings/create-booking-dialog";
import { Button } from "@/components/ui/button";
import { useFormat } from "@/i18n/format";
import { ApiError } from "@/lib/api/client";
import { duplicateOffer, type Offer } from "@/lib/api/offers";
import { getAccessToken } from "@/lib/auth/session";
import { parseApiDate } from "@/lib/dates";

function requireToken() {
  const token = getAccessToken();
  if (!token) throw new ApiError("No autenticado", 401);
  return token;
}

/** Opens shown before "see all". */
const FIRST_OPENS = 5;

/** How often and when the client opened the link, newest first. */
export function OfferOpens({ offer }: { offer: Offer }) {
  const t = useTranslations("offers.opens");
  const { date, ago } = useFormat();
  const [all, setAll] = useState(false);
  const views = offer.views ?? [];
  const count = offer.viewCount ?? 0;
  const shown = all ? views : views.slice(0, FIRST_OPENS);

  return (
    <div className="flex flex-col gap-2">
      <p className="flex items-center gap-1.5 text-sm font-medium">
        <Eye className="size-4" />
        {t("title")}
      </p>
      {count === 0 || !offer.lastViewedAt ? (
        <p className="text-sm text-muted-foreground">{offer.status === "DRAFT" ? t("notSent") : t("none")}</p>
      ) : (
        <>
          <p className="text-sm">
            {t("summary", { count, ago: ago(parseApiDate(offer.lastViewedAt)) })}
          </p>
          {offer.firstViewedAt && count > 1 && (
            <p className="text-xs text-muted-foreground">
              {t("first", { date: date(parseApiDate(offer.firstViewedAt), "dayMonthTime") })}
            </p>
          )}
          {shown.length > 0 && (
            <ul className="flex flex-col gap-1.5 text-xs text-muted-foreground">
              {shown.map((view) => {
                const Icon = view.device === "MOBILE" ? Smartphone : Monitor;
                return (
                  <li key={view.at} className="flex items-center gap-2">
                    {view.device ? (
                      <Icon className="size-3.5 shrink-0" aria-label={t(`device.${view.device}`)} />
                    ) : (
                      <span className="size-3.5 shrink-0" />
                    )}
                    <time dateTime={view.at}>{date(parseApiDate(view.at), "dayMonthTime")}</time>
                  </li>
                );
              })}
            </ul>
          )}
          {!all && views.length > FIRST_OPENS && (
            <button
              type="button"
              onClick={() => setAll(true)}
              className="self-start text-xs font-medium text-primary underline-offset-4 outline-none hover:underline focus-visible:underline"
            >
              {t("seeAll", { count: views.length })}
            </button>
          )}
        </>
      )}
    </div>
  );
}

/**
 * The bookings made from the offer, and the button to make one with the
 * offer's client, properties, currency and prices already filled in.
 */
export function OfferBookings({ offer }: { offer: Offer }) {
  const t = useTranslations("offers.booking");
  const router = useRouter();
  const { agencySlug } = useParams<{ agencySlug: string }>();
  const items = offer.sections.flatMap((section) => section.properties);
  const bookings = offer.bookings ?? [];

  /** The offer's price for that property; a rental's is per night, so it's multiplied by the nights. */
  function suggestPrice(propertyId: string, nights: number | null) {
    const item = items.find((entry) => entry.propertyId === propertyId);
    if (!item) return null;
    const price = item.displayPrice ?? item.priceOverride ?? item.property.price ?? null;
    if (price == null) return offer.servicesTotal ?? null;
    const stay = item.property.listingType === "RENT" ? (nights && nights > 0 ? price * nights : null) : price;
    if (stay == null) return null;
    return stay + (offer.servicesTotal ?? 0);
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="flex items-center gap-1.5 text-sm font-medium">
        <CalendarPlus className="size-4" />
        {t("title")}
      </p>
      {bookings.length > 0 ? (
        <ul className="flex flex-col gap-1.5">
          {bookings.map((booking) => (
            <li key={booking.id}>
              <Link
                href={`/${agencySlug}/bookings/${booking.id}`}
                className="flex items-center gap-2 rounded-xl bg-card px-3 py-2 text-sm outline-none ring-1 ring-foreground/5 transition-colors hover:bg-card/70 focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <span className="min-w-0 flex-1 truncate">{booking.propertyTitle ?? t("booking")}</span>
                <BookingStatusPill status={booking.status} />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">{t("none")}</p>
      )}
      {items.length > 0 && (
        <CreateBookingDialog
          defaultOfferId={offer.id}
          defaultClientId={offer.clientId ?? undefined}
          defaultCurrency={offer.currency}
          defaultPropertyId={items.length === 1 ? items[0].propertyId : undefined}
          propertyIds={items.map((item) => item.propertyId)}
          suggestPrice={suggestPrice}
          hint={offer.servicesTotal ? t("hintWithServices") : t("hint")}
          onCreated={(booking) => {
            toast.success(t("created"));
            router.push(`/${agencySlug}/bookings/${booking.id}`);
          }}
          trigger={
            <Button type="button" variant="outline" className="h-10 gap-2">
              <CalendarPlus />
              {t("create")}
            </Button>
          }
        />
      )}
    </div>
  );
}

/**
 * Copies of the offer: a new draft to send someone else, or a template to
 * start future offers from. A template offers to start an offer from it.
 */
export function OfferCopies({ offer, dirty }: { offer: Offer; dirty: boolean }) {
  const t = useTranslations("offers.templates");
  const router = useRouter();
  const queryClient = useQueryClient();
  const { agencySlug } = useParams<{ agencySlug: string }>();

  const copyMutation = useMutation({
    mutationFn: (asTemplate: boolean) => duplicateOffer(requireToken(), offer.id, { asTemplate }),
    onSuccess: (copy, asTemplate) => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      if (asTemplate) {
        toast.success(t("saved"));
        return;
      }
      router.push(`/${agencySlug}/offers/${copy.id}`);
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : t("copyFailed")),
  });

  return (
    <div className="flex flex-col gap-2">
      {/* Copies are made from what's saved. */}
      {dirty && <p className="text-xs text-muted-foreground">{t("saveFirst")}</p>}
      {offer.isTemplate ? (
        <Button
          type="button"
          className="h-10 gap-2"
          disabled={copyMutation.isPending || dirty}
          onClick={() => copyMutation.mutate(false)}
        >
          <LayoutTemplate />
          {t("useThis")}
        </Button>
      ) : (
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="gap-1.5"
            disabled={copyMutation.isPending || dirty}
            onClick={() => copyMutation.mutate(false)}
          >
            <Copy />
            {t("duplicate")}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="gap-1.5"
            disabled={copyMutation.isPending || dirty}
            onClick={() => copyMutation.mutate(true)}
          >
            <LayoutTemplate />
            {t("saveAsTemplate")}
          </Button>
        </div>
      )}
    </div>
  );
}
