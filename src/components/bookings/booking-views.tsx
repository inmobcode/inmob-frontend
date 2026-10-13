"use client";

import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarDays, Clock, UserRound } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import {
  BookingMenu,
  BookingStatusPill,
  DateTile,
  PaidBar,
  datesOf,
  money,
  RangeLabel,
  type BookingActions,
} from "@/components/bookings/booking-parts";
import { ControlsZone } from "@/components/properties/property-controls";
import type { Booking } from "@/lib/api/bookings";
import { cn } from "@/lib/utils";

const SURFACE =
  "booking-card group rounded-2xl bg-card shadow-[0_1px_2px_oklch(0.3_0.05_160/0.04),0_12px_32px_-12px_oklch(0.3_0.05_160/0.14)] ring-1 ring-foreground/5 outline-none transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_1px_2px_oklch(0.3_0.05_160/0.06),0_24px_44px_-12px_oklch(0.3_0.05_160/0.26)] focus-visible:ring-3 focus-visible:ring-ring/50";

const ago = (iso: string) => formatDistanceToNow(new Date(iso), { addSuffix: true, locale: es });

function Total({ booking, className }: { booking: Booking; className?: string }) {
  return booking.totalPrice ? (
    <span className={cn("tabular-nums", className)}>
      <span className="mr-1 text-xs font-medium text-muted-foreground">{booking.currency}</span>
      <span className="font-semibold">{booking.totalPrice.toLocaleString("es-AR")}</span>
    </span>
  ) : (
    <span className={cn("text-muted-foreground", className)}>Sin total</span>
  );
}

function When({ booking }: { booking: Booking }) {
  const dates = datesOf(booking);
  return (
    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <CalendarDays className="size-3.5 shrink-0" />
      <RangeLabel booking={booking} />
      {dates && <span>· {dates.nights} {dates.nights === 1 ? "noche" : "noches"}</span>}
    </span>
  );
}

function Client({ booking }: { booking: Booking }) {
  return (
    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <UserRound className="size-3.5 shrink-0" />
      <span className="truncate">{booking.clientName ?? "Sin cliente asignado"}</span>
    </span>
  );
}

export function BookingCard({ booking, actions }: { booking: Booking; actions: BookingActions }) {
  const { agencySlug } = useParams<{ agencySlug: string }>();
  const cancelled = booking.status === "CANCELLED";
  return (
    <Link href={`/${agencySlug}/bookings/${booking.id}`} className={cn(SURFACE, "flex flex-col gap-5 p-5", cancelled && "opacity-70")}>
      <div className="flex items-start gap-3.5">
        <DateTile booking={booking} />
        <div className="flex min-w-0 flex-1 flex-col gap-1 pt-0.5">
          <h3 className="font-display text-xl leading-tight text-balance line-clamp-2" title={booking.propertyTitle ?? undefined}>
            {booking.propertyTitle ?? "Reserva"}
          </h3>
          <Client booking={booking} />
        </div>
        <ControlsZone className="opacity-0 transition-opacity duration-200 group-focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100">
          <BookingMenu booking={booking} actions={actions} />
        </ControlsZone>
      </div>

      <div className="flex flex-col gap-3">
        <When booking={booking} />
        <Total booking={booking} className="text-2xl leading-none tracking-tight" />
        <PaidBar booking={booking} />
      </div>

      <div className="mt-auto flex items-center gap-3 text-xs text-muted-foreground">
        <BookingStatusPill status={booking.status} />
        <span className="ml-auto inline-flex items-center gap-1">
          <Clock className="size-3" />
          {ago(booking.updatedAt)}
        </span>
      </div>
    </Link>
  );
}

export function BookingRow({ booking, actions }: { booking: Booking; actions: BookingActions }) {
  const { agencySlug } = useParams<{ agencySlug: string }>();
  const cancelled = booking.status === "CANCELLED";
  return (
    <Link
      href={`/${agencySlug}/bookings/${booking.id}`}
      className={cn(SURFACE, "flex flex-col gap-4 p-4 sm:flex-row sm:items-center", cancelled && "opacity-70")}
    >
      <div className="flex min-w-0 items-center gap-3.5 sm:w-80 sm:shrink-0">
        <DateTile booking={booking} />
        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="truncate font-display text-lg leading-tight" title={booking.propertyTitle ?? undefined}>
            {booking.propertyTitle ?? "Reserva"}
          </h3>
          <Client booking={booking} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5 sm:w-52 sm:shrink-0">
        <When booking={booking} />
        <Total booking={booking} className="text-lg" />
      </div>

      <PaidBar booking={booking} className="min-w-0 flex-1" />

      <div className="flex items-center justify-between gap-3 sm:w-48 sm:shrink-0 sm:flex-col sm:items-end sm:gap-2">
        <ControlsZone className="flex items-center gap-2">
          <BookingStatusPill status={booking.status} />
          <BookingMenu booking={booking} actions={actions} />
        </ControlsZone>
        <span className="text-xs text-muted-foreground">{ago(booking.updatedAt)}</span>
      </div>
    </Link>
  );
}

const HEAD = "px-4 py-3 text-left text-xs font-medium text-muted-foreground";

export function BookingsTable({ bookings, actions }: { bookings: Booking[]; actions: BookingActions }) {
  const router = useRouter();
  const { agencySlug } = useParams<{ agencySlug: string }>();
  return (
    <div className="overflow-x-auto rounded-2xl bg-card shadow-[0_1px_2px_oklch(0.3_0.05_160/0.04),0_12px_32px_-12px_oklch(0.3_0.05_160/0.14)] ring-1 ring-foreground/5">
      <table className="w-full min-w-[860px] border-collapse text-sm">
        <thead>
          <tr>
            <th className={cn(HEAD, "pl-4")}>Reserva</th>
            <th className={HEAD}>Estado</th>
            <th className={HEAD}>Fechas</th>
            <th className={cn(HEAD, "text-right")}>Total</th>
            <th className={cn(HEAD, "text-right")}>Cobrado</th>
            <th className={HEAD}>Actualizada</th>
            <th className={cn(HEAD, "w-14")}>
              <span className="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => {
            const { paid } = paymentsPaid(booking);
            return (
              <tr
                key={booking.id}
                onClick={() => router.push(`/${agencySlug}/bookings/${booking.id}`)}
                className="booking-card cursor-pointer border-t border-foreground/5 transition-colors hover:bg-foreground/[0.03]"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <DateTile booking={booking} className="size-11 rounded-xl [&_.font-display]:text-lg" />
                    <div className="flex min-w-0 flex-col">
                      <Link
                        href={`/${agencySlug}/bookings/${booking.id}`}
                        onClick={(event) => event.stopPropagation()}
                        className="truncate font-medium outline-none hover:underline focus-visible:underline"
                      >
                        {booking.propertyTitle ?? "Reserva"}
                      </Link>
                      <span className="truncate text-xs text-muted-foreground">{booking.clientName ?? "Sin cliente asignado"}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <BookingStatusPill status={booking.status} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-muted-foreground"><RangeLabel booking={booking} /></td>
                <td className="px-4 py-3 text-right">
                  <Total booking={booking} />
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap text-muted-foreground tabular-nums">
                  {paid > 0 ? money(booking.currency, paid) : "—"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{ago(booking.updatedAt)}</td>
                <td className="w-14 py-3 pr-4" onClick={(event) => event.stopPropagation()}>
                  <BookingMenu booking={booking} actions={actions} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function paymentsPaid(booking: Booking) {
  const paid = (booking.payments ?? []).filter((p) => p.status === "PAID").reduce((sum, p) => sum + p.amount, 0);
  return { paid };
}

export function BookingCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-5 rounded-2xl bg-card p-5 ring-1 ring-foreground/5">
      <div className="flex items-center gap-3.5">
        <div className="size-14 rounded-2xl bg-muted" />
        <div className="flex flex-1 flex-col gap-2">
          <div className="h-5 w-4/5 rounded-full bg-muted" />
          <div className="h-4 w-1/2 rounded-full bg-muted" />
        </div>
      </div>
      <div className="flex flex-col gap-2.5">
        <div className="h-4 w-2/3 rounded-full bg-muted" />
        <div className="h-7 w-1/3 rounded-full bg-muted" />
        <div className="h-4 w-full rounded-full bg-muted" />
      </div>
    </div>
  );
}
