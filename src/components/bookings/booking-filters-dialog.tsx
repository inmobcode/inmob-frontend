"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { BOOKING_STATUSES } from "@/components/bookings/booking-parts";
import { ChipToggleGroup } from "@/components/properties/form-controls";
import { PlaceAutocomplete } from "@/components/shared/place-autocomplete";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { DateRangePicker } from "@/components/ui/date-picker";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useFormat } from "@/i18n/format";
import type { Booking, BookingStatus } from "@/lib/api/bookings";
import type { Property } from "@/lib/api/properties";
import {
  applyBookingFilters,
  countBookingFilters,
  NO_BOOKING_FILTERS,
  PAYMENT_STATES,
  paymentStateOf,
  type BookingFilters,
  type PaymentState,
} from "@/lib/booking-filters";
import { uniquePlaces } from "@/lib/places";

function Section({ title, htmlFor, children }: { title: string; htmlFor?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      <Label htmlFor={htmlFor} className="text-sm font-medium">
        {title}
      </Label>
      {children}
    </div>
  );
}

/**
 * The bookings list's filters in one dialog: status, payment, property,
 * location (typed freely, with the places in use suggested) and dates. They
 * apply on "Mostrar", which says how many bookings will show.
 */
export function BookingFiltersDialog({
  bookings,
  propertyById,
  value,
  onApply,
}: {
  bookings: Booking[];
  propertyById: Map<string, Property>;
  value: BookingFilters;
  onApply: (filters: BookingFilters) => void;
}) {
  const t = useTranslations("bookings.filters");
  const list = useTranslations("bookings.list");
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);

  const statusCounts = useMemo(() => {
    const result: Record<string, number> = {};
    for (const booking of bookings) result[booking.status] = (result[booking.status] ?? 0) + 1;
    return result;
  }, [bookings]);
  const paymentCounts = useMemo(() => {
    const result: Record<string, number> = {};
    for (const booking of bookings) {
      const state = paymentStateOf(booking);
      result[state] = (result[state] ?? 0) + 1;
    }
    return result;
  }, [bookings]);
  // The properties that have bookings, by name.
  const propertyOptions = useMemo(() => {
    const seen = new Map<string, string>();
    for (const booking of bookings) if (!seen.has(booking.propertyId)) seen.set(booking.propertyId, booking.propertyTitle ?? "—");
    return [...seen].map(([id, title]) => ({ value: id, label: title })).sort((a, b) => a.label.localeCompare(b.label));
  }, [bookings]);
  // Every place the booked properties are in, each spelled once, to suggest.
  const places = useMemo(
    () =>
      uniquePlaces(
        bookings.flatMap((booking) => {
          const property = propertyById.get(booking.propertyId);
          return property ? [property.area, property.region, property.country] : [];
        }),
      ),
    [bookings, propertyById],
  );

  const resultCount = useMemo(
    () => applyBookingFilters(bookings, draft, (id) => propertyById.get(id)).length,
    [bookings, draft, propertyById],
  );
  const activeCount = countBookingFilters(value);

  function update(patch: Partial<BookingFilters>) {
    setDraft((current) => ({ ...current, ...patch }));
  }

  function handleOpenChange(next: boolean) {
    // Every opening starts from what's applied.
    if (next) setDraft(value);
    setOpen(next);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label={activeCount > 0 ? t("titleCount", { count: activeCount }) : t("title")}
              className="relative size-10 shrink-0 bg-foreground/[0.07] hover:bg-foreground/10 dark:bg-foreground/10"
            >
              <SlidersHorizontal />
              {activeCount > 0 && (
                <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-primary text-[0.65rem] font-semibold text-primary-foreground tabular-nums ring-2 ring-background">
                  {activeCount}
                </span>
              )}
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom" sideOffset={10}>
          {t("title")}
        </TooltipContent>
      </Tooltip>
      <DialogContent className="max-h-[90svh] gap-0 overflow-y-auto rounded-3xl p-0 sm:max-w-lg" showCloseButton>
        <div className="flex flex-col gap-1.5 px-7 pt-7 pb-5">
          <DialogTitle className="font-display text-3xl leading-none tracking-tight">{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </div>

        <div className="flex flex-col gap-6 px-7 pb-2">
          <Section title={list("status")}>
            <ChipToggleGroup
              label={list("status")}
              options={BOOKING_STATUSES}
              labelOf={(status) => list(`statusPlural.${status as BookingStatus}`)}
              counts={statusCounts}
              value={draft.status}
              onChange={(status) => update({ status: status as BookingStatus[] })}
            />
          </Section>

          <Section title={list("payment")}>
            <ChipToggleGroup
              label={list("payment")}
              options={PAYMENT_STATES}
              labelOf={(state) => list(`paymentState.${state as PaymentState}`)}
              counts={paymentCounts}
              value={draft.payment}
              onChange={(payment) => update({ payment: payment as PaymentState[] })}
            />
          </Section>

          {propertyOptions.length > 1 && (
            <Section title={list("property")} htmlFor="filter-property">
              <Combobox
                id="filter-property"
                ariaLabel={list("property")}
                value={draft.propertyId}
                onChange={(propertyId) => update({ propertyId })}
                allValue="ALL"
                allLabel={t("allProperties")}
                searchPlaceholder={t("searchProperty")}
                emptyText={t("noProperty")}
                options={propertyOptions}
                className="rounded-xl"
              />
            </Section>
          )}

          <Section title={list("location")} htmlFor="filter-location">
            <PlaceAutocomplete
              id="filter-location"
              ariaLabel={list("location")}
              value={draft.location}
              onChange={(location) => update({ location })}
              places={places}
              placeholder={t("locationPlaceholder")}
              clearLabel={t("clearLocation")}
            />
          </Section>

          <Section title={list("dates")}>
            <DateRangePicker
              countAs="days"
              placeholder={t("datesPlaceholder")}
              hints={{ first: list("datesHintFirst"), second: list("datesHintSecond") }}
              start={draft.from}
              end={draft.to}
              onChange={(from, to) => update({ from, to })}
            />
            <p className="text-xs text-muted-foreground">{t("datesHint")}</p>
          </Section>
        </div>

        <div className="flex items-center gap-3 px-7 pt-5 pb-7">
          <Button variant="ghost" className="h-10" onClick={() => setDraft(NO_BOOKING_FILTERS)}>
            {t("clear")}
          </Button>
          <Button
            variant="highlight"
            className="h-10 flex-1"
            disabled={resultCount === 0}
            onClick={() => {
              onApply(draft);
              setOpen(false);
            }}
          >
            {resultCount === 0 ? t("none") : t("show", { count: resultCount })}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** The filters in use as removable chips under the toolbar. */
export function ActiveBookingFilters({
  filters,
  bookings,
  onChange,
}: {
  filters: BookingFilters;
  bookings: Booking[];
  onChange: (filters: BookingFilters) => void;
}) {
  const t = useTranslations("bookings.filters");
  const list = useTranslations("bookings.list");
  const { date } = useFormat();
  const chips: { key: string; label: string; next: BookingFilters }[] = [];
  for (const status of filters.status) {
    chips.push({
      key: `status-${status}`,
      label: list(`statusPlural.${status}`),
      next: { ...filters, status: filters.status.filter((item) => item !== status) },
    });
  }
  for (const state of filters.payment) {
    chips.push({
      key: `payment-${state}`,
      label: list(`paymentState.${state}`),
      next: { ...filters, payment: filters.payment.filter((item) => item !== state) },
    });
  }
  if (filters.propertyId !== "ALL") {
    const title = bookings.find((booking) => booking.propertyId === filters.propertyId)?.propertyTitle;
    chips.push({ key: "property", label: title ?? list("property"), next: { ...filters, propertyId: "ALL" } });
  }
  if (filters.location.trim()) {
    chips.push({ key: "location", label: filters.location.trim(), next: { ...filters, location: "" } });
  }
  if (filters.from && filters.to) {
    const day = (iso: string) => date(new Date(`${iso}T12:00:00`), "dayMonthShort");
    chips.push({ key: "dates", label: `${day(filters.from)} – ${day(filters.to)}`, next: { ...filters, from: "", to: "" } });
  }
  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <span
          key={chip.key}
          className="inline-flex h-8 items-center gap-1 rounded-full bg-secondary pr-1 pl-3 text-sm text-primary"
        >
          {chip.label}
          <button
            type="button"
            aria-label={t("remove", { name: chip.label })}
            onClick={() => onChange(chip.next)}
            className="flex size-6 items-center justify-center rounded-full outline-none hover:bg-primary/10 focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <X className="size-3.5" />
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={() => onChange(NO_BOOKING_FILTERS)}
        className="rounded-full px-3 py-1.5 text-sm text-muted-foreground outline-none hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {t("clearAll")}
      </button>
    </div>
  );
}
