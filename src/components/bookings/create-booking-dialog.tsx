"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { differenceInCalendarDays } from "date-fns";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { LoaderCircle } from "lucide-react";

import { NewItemButton } from "@/components/new-item-button";
import { PropertyPicker } from "@/components/properties/property-picker";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DateRangePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApiError } from "@/lib/api/client";
import { listClients } from "@/lib/api/clients";
import { getQuote, listProperties } from "@/lib/api/properties";
import { createBooking, type Booking } from "@/lib/api/bookings";
import { getAccessToken } from "@/lib/auth/session";

/** Nights between two yyyy-MM-dd dates, or null until both are picked. */
function nightsOf(start: string, end: string) {
  if (!start || !end) return null;
  return differenceInCalendarDays(new Date(`${end}T12:00:00`), new Date(`${start}T12:00:00`));
}

export function CreateBookingDialog({
  defaultPropertyId,
  defaultClientId,
  defaultOfferId,
  defaultTotalPrice,
  defaultCurrency,
  propertyIds,
  suggestPrice,
  trigger,
  hint,
  onCreated,
}: {
  defaultPropertyId?: string;
  defaultClientId?: string;
  defaultOfferId?: string;
  defaultTotalPrice?: number;
  defaultCurrency?: string;
  /** Only these properties can be picked (an offer's, when booking from it). */
  propertyIds?: string[];
  /** The total to fill in for a property and stay; it stops once the total is typed by hand. */
  suggestPrice?: (propertyId: string, nights: number | null) => number | null;
  /** What opens the dialog; the "new booking" button by default. */
  trigger?: React.ReactNode;
  /** A line under the description, e.g. what the suggested total includes. */
  hint?: string;
  onCreated?: (booking: Booking) => void;
}) {
  const t = useTranslations("bookings.create");
  const common = useTranslations("common");
  const [open, setOpen] = useState(false);
  const [propertyId, setPropertyId] = useState(defaultPropertyId ?? "");
  const [clientId, setClientId] = useState(defaultClientId ?? "");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalPrice, setTotalPrice] = useState(defaultTotalPrice?.toString() ?? "");
  const [commission, setCommission] = useState("");
  const [guests, setGuests] = useState("");
  // Typing the total by hand keeps it: picking another property or dates no longer replaces it.
  const [priceTouched, setPriceTouched] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: properties } = useQuery({
    queryKey: ["properties"],
    queryFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return listProperties(token);
    },
  });
  const pickable = propertyIds ? (properties ?? []).filter((property) => propertyIds.includes(property.id)) : properties;

  // Without an offer's prices, a rental's total comes from its rates and pricing rules.
  const picked = properties?.find((property) => property.id === propertyId);
  const { data: quote } = useQuery({
    queryKey: ["quote", propertyId, startDate, endDate],
    queryFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return getQuote(token, propertyId, startDate, endDate);
    },
    enabled: open && !suggestPrice && picked?.listingType === "RENT" && Boolean(startDate && endDate),
  });
  useEffect(() => {
    if (quote && !priceTouched && quote.total != null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTotalPrice(String(quote.total));
    }
  }, [quote, priceTouched]);

  function suggest(nextProperty: string, start: string, end: string) {
    if (!suggestPrice || priceTouched || !nextProperty) return;
    const price = suggestPrice(nextProperty, nightsOf(start, end));
    setTotalPrice(price == null ? "" : String(Math.round(price * 100) / 100));
  }

  const { data: clients } = useQuery({
    queryKey: ["clients"],
    queryFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return listClients(token);
    },
  });

  const mutation = useMutation({
    mutationFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return createBooking(token, {
        propertyId,
        clientId: clientId || undefined,
        offerId: defaultOfferId,
        // The offer's currency, else the property's (the API would otherwise assume USD).
        currency: defaultCurrency ?? properties?.find((property) => property.id === propertyId)?.currency,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        totalPrice: totalPrice ? Number(totalPrice) : undefined,
        commissionAmount: commission ? Number(commission) : undefined,
        guests: Number(guests) >= 1 ? Math.round(Number(guests)) : undefined,
      });
    },
    onSuccess: (booking) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      if (defaultOfferId) {
        queryClient.invalidateQueries({ queryKey: ["offers"] });
        queryClient.invalidateQueries({ queryKey: ["offer", defaultOfferId] });
      }
      handleOpenChange(false);
      onCreated?.(booking);
    },
    onError: (err) => setServerError(err instanceof ApiError ? err.message : common("unexpectedError")),
  });

  function handleOpenChange(next: boolean) {
    setOpen(next);
    // Opening with a property already chosen fills in its price.
    if (next && defaultPropertyId) suggest(defaultPropertyId, "", "");
    if (!next) {
      setPriceTouched(false);
      setPropertyId(defaultPropertyId ?? "");
      setClientId(defaultClientId ?? "");
      setStartDate("");
      setEndDate("");
      setTotalPrice(defaultTotalPrice?.toString() ?? "");
      setCommission("");
      setGuests("");
      setServerError(null);
    }
  }

  const number = (value: string) => value.replace(/[^\d.]/g, "");

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger ?? <NewItemButton label={t("new")} />}</DialogTrigger>
      <DialogContent className="gap-0 rounded-3xl p-0 sm:max-w-lg" showCloseButton>
        <form
          className="flex flex-col"
          onSubmit={(event) => {
            event.preventDefault();
            if (!propertyId) return;
            setServerError(null);
            mutation.mutate();
          }}
        >
          <div className="flex flex-col gap-1.5 px-7 pt-7 pb-5">
            <DialogTitle className="font-display text-3xl leading-none tracking-tight">{t("new")}</DialogTitle>
            <DialogDescription>{t("description")}</DialogDescription>
            {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
          </div>

          <div className="flex flex-col gap-5 px-7 pb-2">
            <div className="flex flex-col gap-2.5">
              <Label htmlFor="property">{t("property")}</Label>
              <PropertyPicker
                id="property"
                properties={pickable ?? []}
                value={propertyId}
                onChange={(next) => {
                  setPropertyId(next);
                  suggest(next, startDate, endDate);
                }}
                className="h-11"
              />
            </div>
            <div className="flex flex-col gap-2.5">
              <Label htmlFor="client">
                {t("client")} <span className="font-normal text-muted-foreground">{common("optional")}</span>
              </Label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger id="client" className="h-11 w-full">
                  <SelectValue placeholder={t("noClient")} />
                </SelectTrigger>
                <SelectContent>
                  {clients?.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2.5">
              <Label htmlFor="dates">
                {t("dates")} <span className="font-normal text-muted-foreground">{t("rentalsOnly")}</span>
              </Label>
              <DateRangePicker
                id="dates"
                start={startDate}
                end={endDate}
                minDate={new Date()}
                onChange={(from, to) => {
                  setStartDate(from);
                  setEndDate(to);
                  suggest(propertyId, from, to);
                }}
              />
              {quote && startDate && endDate && !suggestPrice && (
                <div className="flex flex-col gap-1 text-xs">
                  {!quote.meetsMinStay && (
                    <p className="text-amber-700 dark:text-amber-400">{t("minStay", { count: quote.minStay })}</p>
                  )}
                  {!quote.available && <p className="text-amber-700 dark:text-amber-400">{t("unavailable")}</p>}
                  {quote.total != null && !priceTouched && <p className="text-muted-foreground">{t("quoted")}</p>}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2.5">
              <Label htmlFor="guests">
                {t("guests")} <span className="font-normal text-muted-foreground">{common("optional")}</span>
              </Label>
              <Input
                id="guests"
                inputMode="numeric"
                placeholder="0"
                className="h-11 w-32 px-4 tabular-nums"
                value={guests}
                onChange={(e) => setGuests(e.target.value.replace(/\D/g, "").slice(0, 3))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2.5">
                <Label htmlFor="totalPrice">{t("totalPrice")}</Label>
                <Input
                  id="totalPrice"
                  inputMode="decimal"
                  placeholder="0"
                  className="h-11 px-4 tabular-nums"
                  value={totalPrice}
                  onChange={(e) => {
                    setPriceTouched(true);
                    setTotalPrice(number(e.target.value));
                  }}
                />
              </div>
              <div className="flex flex-col gap-2.5">
                <Label htmlFor="commission">{t("commission")}</Label>
                <Input
                  id="commission"
                  inputMode="decimal"
                  placeholder="0"
                  className="h-11 px-4 tabular-nums"
                  value={commission}
                  onChange={(e) => setCommission(number(e.target.value))}
                />
              </div>
            </div>
            {serverError && <p className="text-sm text-destructive">{serverError}</p>}
          </div>

          <div className="flex items-center justify-end gap-2 px-7 pt-5 pb-7">
            <Button type="button" variant="ghost" className="h-10 px-5" onClick={() => handleOpenChange(false)}>
              {common("cancel")}
            </Button>
            <Button type="submit" variant="highlight" className="h-10 gap-2 px-6" disabled={!propertyId || mutation.isPending}>
              {mutation.isPending ? (
                <>
                  <LoaderCircle className="animate-spin" />
                  {common("creating")}
                </>
              ) : (
                t("submit")
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
