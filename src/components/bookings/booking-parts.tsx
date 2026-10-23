"use client";

import { differenceInCalendarDays, parseISO } from "date-fns";
import {
  ArrowRight,
  Banknote,
  Check,
  CircleCheck,
  Copy,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFormat } from "@/i18n/format";
import type { Booking, BookingStatus } from "@/lib/api/bookings";
import { useLabels } from "@/lib/labels";
import { getPublicOrigin } from "@/lib/public-origin";
import { cn } from "@/lib/utils";

export const BOOKING_STATUSES: BookingStatus[] = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

export interface BookingActions {
  confirm: (id: string) => void;
  complete: (id: string) => void;
  cancel: (id: string) => void;
  /** Moves it to the trash. */
  remove: (id: string) => void;
}

const STATUS_STYLES: Record<BookingStatus, string> = {
  PENDING: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  CONFIRMED: "bg-primary/10 text-primary",
  COMPLETED: "bg-primary text-primary-foreground",
  CANCELLED: "bg-foreground/[0.07] text-muted-foreground",
};

export function BookingStatusPill({ status, className }: { status: BookingStatus; className?: string }) {
  const labels = useLabels();
  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center rounded-full px-2.5 text-xs font-medium",
        STATUS_STYLES[status],
        className,
      )}
    >
      {labels.bookingStatus(status)}
    </span>
  );
}

/** "EUR 4.200" in the page's language, with the booking's decimals if it has any. */
export function useMoney() {
  const { money } = useFormat();
  return (currency: string, value: number) => money(currency, value, {});
}

export function datesOf(booking: Booking) {
  if (!booking.startDate || !booking.endDate) return null;
  const start = parseISO(booking.startDate);
  const end = parseISO(booking.endDate);
  return { start, end, nights: Math.max(differenceInCalendarDays(end, start), 1) };
}

/** "12 oct → 19 oct", with the arrow as an icon. */
export function RangeLabel({ booking }: { booking: Booking }) {
  const t = useTranslations("bookings.parts");
  const { date } = useFormat();
  const dates = datesOf(booking);
  if (!dates) return <>{t("sale")}</>;
  return (
    <span className="inline-flex items-center gap-1.5">
      {date(dates.start, "dayMonthShort")}
      <ArrowRight className="size-3.5 shrink-0" />
      {date(dates.end, "dayMonthShort")}
    </span>
  );
}

export function paymentsOf(booking: Booking) {
  const payments = booking.payments ?? [];
  const paid = payments.filter((p) => p.status === "PAID").reduce((sum, p) => sum + p.amount, 0);
  const planned = payments.reduce((sum, p) => sum + p.amount, 0);
  const base = booking.totalPrice ?? planned;
  return { paid, base, ratio: base > 0 ? Math.min(paid / base, 1) : 0 };
}

/** Check-in day as a small calendar tile; sales (no dates) show a banknote. */
export function DateTile({ booking, className }: { booking: Booking; className?: string }) {
  const { tag } = useFormat();
  const dates = datesOf(booking);
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-secondary text-primary",
        className,
      )}
    >
      {dates ? (
        <>
          <span className="text-[11px] leading-none font-medium">
            {dates.start.toLocaleDateString(tag, { month: "short" })}
          </span>
          <span className="mt-0.5 font-display text-2xl leading-none">{dates.start.getDate()}</span>
        </>
      ) : (
        <Banknote className="size-6" />
      )}
    </span>
  );
}

export function PaidBar({ booking, className }: { booking: Booking; className?: string }) {
  const t = useTranslations("bookings.parts");
  const money = useMoney();
  const { paid, base, ratio } = paymentsOf(booking);
  if (base <= 0) return <p className={cn("text-sm text-muted-foreground", className)}>{t("noPrice")}</p>;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="h-1.5 overflow-hidden rounded-full bg-foreground/[0.08]">
        <div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${ratio * 100}%` }} />
      </div>
      <p className="text-xs text-muted-foreground tabular-nums">
        {t("collectedOf", { paid: money(booking.currency, paid), total: money(booking.currency, base) })}
      </p>
    </div>
  );
}

/** The client's read-only page for a booking. */
export const clientLinkPath = (booking: Pick<Booking, "token">) => `/booking/${booking.token}`;

/** Copies the client's page link, with a toast either way. */
export function useCopyClientLink() {
  const t = useTranslations("common");
  return async (booking: Pick<Booking, "token">) => {
    try {
      await navigator.clipboard.writeText(`${getPublicOrigin()}${clientLinkPath(booking)}`);
      toast.success(t("linkCopied"));
    } catch {
      toast.error(t("linkCopyFailed"));
    }
  };
}

export function BookingMenu({
  booking,
  actions,
  className,
}: {
  booking: Booking;
  actions: BookingActions;
  className?: string;
}) {
  const t = useTranslations("bookings.menu");
  const copyClientLink = useCopyClientLink();
  const router = useRouter();
  const { agencySlug } = useParams<{ agencySlug: string }>();
  const open = booking.status === "PENDING" || booking.status === "CONFIRMED";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={booking.propertyTitle ? t("actionsOf", { title: booking.propertyTitle }) : t("actions")}
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground/[0.06] text-foreground transition-colors outline-none hover:bg-foreground/10 focus-visible:ring-3 focus-visible:ring-ring/50 data-[state=open]:bg-foreground/10",
            className,
          )}
        >
          <MoreHorizontal className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-2xl p-1.5">
        <DropdownMenuItem className="rounded-xl py-2" onSelect={() => router.push(`/${agencySlug}/bookings/${booking.id}`)}>
          <Pencil />
          {t("view")}
        </DropdownMenuItem>
        <DropdownMenuItem className="rounded-xl py-2" onSelect={() => copyClientLink(booking)}>
          <Copy />
          {t("copyLink")}
        </DropdownMenuItem>
        <DropdownMenuItem className="rounded-xl py-2" onSelect={() => window.open(clientLinkPath(booking), "_blank", "noopener")}>
          <ExternalLink />
          {t("viewAsClient")}
        </DropdownMenuItem>
        {booking.status === "PENDING" && (
          <DropdownMenuItem className="rounded-xl py-2" onSelect={() => actions.confirm(booking.id)}>
            <Check />
            {t("confirm")}
          </DropdownMenuItem>
        )}
        {booking.status === "CONFIRMED" && (
          <DropdownMenuItem className="rounded-xl py-2" onSelect={() => actions.complete(booking.id)}>
            <CircleCheck />
            {t("complete")}
          </DropdownMenuItem>
        )}
        {open && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" className="rounded-xl py-2" onSelect={() => actions.cancel(booking.id)}>
              <X />
              {t("cancel")}
            </DropdownMenuItem>
          </>
        )}
        {!open && <DropdownMenuSeparator />}
        <DropdownMenuItem variant="destructive" className="rounded-xl py-2" onSelect={() => actions.remove(booking.id)}>
          <Trash2 />
          {t("delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
