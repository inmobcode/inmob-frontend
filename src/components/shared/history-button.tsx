"use client";

import { useQuery } from "@tanstack/react-query";
import { History } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useFormat } from "@/i18n/format";
import { ApiError } from "@/lib/api/client";
import { getHistory, type HistoryEntity, type HistoryEvent } from "@/lib/api/history";
import type { BookingStatus } from "@/lib/api/bookings";
import type { OfferOperation, OfferStatus } from "@/lib/api/offers";
import type { ListingType, PropertyStatus } from "@/lib/api/properties";
import { getAccessToken } from "@/lib/auth/session";
import { parseApiDate } from "@/lib/dates";
import { useLabels } from "@/lib/labels";
import { cn } from "@/lib/utils";

/** Fields with a name in "history.fields"; the rest go under "other". */
const NAMED = new Set([
  "title",
  "price",
  "currency",
  "status",
  "listing_type",
  "category",
  "assigned_agent_id",
  "owner_id",
  "country",
  "region",
  "area",
  "address",
  "bedrooms",
  "bathrooms",
  "area_sqm",
  "guests",
  "min_stay",
  "weekly_discount_pct",
  "monthly_discount_pct",
  "last_minute_discount_pct",
  "last_minute_days",
  "early_bird_discount_pct",
  "early_bird_days",
  "start_date",
  "end_date",
  "total_price",
  "commission_amount",
  "client_id",
  "client_name",
  "client_email",
  "client_phone",
  "notes",
  "expires_at",
  "operation",
  "show_price",
  "branded",
  "reference_code",
  "welcome_title",
  "welcome_content",
  "is_template",
  "photos",
  "rates",
  "content",
  "classification",
  "pools",
  "sections",
  "properties",
  "services",
  "payments",
]);

/**
 * "Historial" for a property, offer or booking: every change, newest first,
 * with who made it and what each field went from and to.
 */
export function HistoryButton({ entity, id, className }: { entity: HistoryEntity; id: string; className?: string }) {
  const t = useTranslations("history");
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button type="button" variant="ghost" className={cn("gap-1.5", className)} onClick={() => setOpen(true)} title={t("title")}>
        <History />
        <span className="hidden lg:inline">{t("button")}</span>
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85svh] gap-0 overflow-y-auto rounded-3xl p-0 sm:max-w-lg" showCloseButton>
          <div className="flex flex-col gap-1.5 px-7 pt-7 pb-5">
            <DialogTitle className="font-display text-3xl leading-none tracking-tight">{t("title")}</DialogTitle>
            <DialogDescription>{t("description")}</DialogDescription>
          </div>
          <div className="px-7 pb-7">{open && <HistoryList entity={entity} id={id} />}</div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function HistoryList({ entity, id }: { entity: HistoryEntity; id: string }) {
  const t = useTranslations("history");
  const { data, isLoading, error } = useQuery({
    queryKey: ["history", entity, id],
    queryFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return getHistory(token, entity, id);
    },
  });

  if (isLoading) {
    return (
      <div className="flex animate-pulse flex-col gap-3" aria-hidden>
        <div className="h-14 rounded-2xl bg-muted" />
        <div className="h-14 rounded-2xl bg-muted" />
      </div>
    );
  }
  if (error) return <p className="text-sm text-destructive">{t("loadFailed")}</p>;
  if (!data || data.length === 0) return <p className="text-sm text-muted-foreground">{t("empty")}</p>;

  return (
    <ol className="flex flex-col gap-5">
      {data.map((event) => (
        <HistoryItem key={event.id} event={event} entity={entity} />
      ))}
    </ol>
  );
}

function HistoryItem({ event, entity }: { event: HistoryEvent; entity: HistoryEntity }) {
  const t = useTranslations("history");
  const labels = useLabels();
  const { date, ago, money, number } = useFormat();
  const when = parseApiDate(event.at);
  const who = event.userName ?? (event.byUser ? t("formerMember") : t("noUser"));

  function format(field: string, value: unknown): string | null {
    if (value === null || value === undefined || value === "") return null;
    if (typeof value === "boolean") return value ? t("yes") : t("no");
    if (field === "status") {
      const status = String(value);
      if (entity === "bookings") return labels.bookingStatus(status as BookingStatus);
      if (entity === "offers") return labels.offerStatus(status as OfferStatus);
      return labels.propertyStatus(status as PropertyStatus);
    }
    if (field === "listing_type") return labels.listingType(value as ListingType);
    if (field === "operation") return labels.offerOperation(value as OfferOperation);
    if (field === "category") return labels.category(String(value));
    if (field.endsWith("_pct") && typeof value === "number") return `${number(value)} %`;
    if ((field === "price" || field === "total_price" || field === "commission_amount") && typeof value === "number") {
      return money("", value, { maximumFractionDigits: 2 }).trim();
    }
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
      return date(value.length > 10 ? parseApiDate(value) : new Date(`${value}T12:00:00`), "medium");
    }
    // Ids (client, owner, assignee) say nothing on their own: just that it changed.
    if (field.endsWith("_id")) return null;
    return String(value);
  }

  const entries = Object.entries(event.changes);
  const named = entries.filter(([field]) => NAMED.has(field));
  const others = entries.length - named.length;

  return (
    <li className="flex flex-col gap-2 border-l-2 border-foreground/10 pl-4">
      <p className="text-sm">
        <span className="font-medium">{t(`actions.${event.action}`)}</span>
        <span className="text-muted-foreground">
          {" · "}
          {who}
          {" · "}
          <time dateTime={event.at} title={date(when, "dateTime")}>
            {ago(when)}
          </time>
        </span>
      </p>
      {entries.length > 0 && (
        <ul className="flex flex-col gap-1 text-sm">
          {named.map(([field, change]) => {
            const from = format(field, change.from);
            const to = format(field, change.to);
            return (
              <li key={field} className="text-muted-foreground">
                {/* Only NAMED fields get here, and each has its name in the messages. */}
                <span className="text-foreground">{t(`fields.${field}` as "fields.title")}</span>
                {!change.changed && (from || to) && (
                  <>
                    {": "}
                    <span className={cn(!from && "italic")}>{from ?? t("noValue")}</span>
                    {" → "}
                    <span className="text-foreground">{to ?? t("noValue")}</span>
                  </>
                )}
              </li>
            );
          })}
          {others > 0 && <li className="text-muted-foreground">{t("others", { count: others })}</li>}
        </ul>
      )}
    </li>
  );
}
