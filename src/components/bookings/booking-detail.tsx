"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowLeft, Check, CircleCheck, X } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { AddPaymentDialog } from "@/components/bookings/add-payment-dialog";
import {
  BookingStatusPill,
  DateTile,
  PaidBar,
  datesOf,
  money,
  paymentsOf,
} from "@/components/bookings/booking-parts";
import { FormSection } from "@/components/properties/form-section";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  cancelBooking,
  completeBooking,
  confirmBooking,
  getBooking,
  markPaymentPaid,
} from "@/lib/api/bookings";
import { ApiError } from "@/lib/api/client";
import { getAccessToken } from "@/lib/auth/session";
import { PAYMENT_TYPE_LABELS } from "@/lib/properties-labels";
import { cn } from "@/lib/utils";

function requireToken() {
  const token = getAccessToken();
  if (!token) throw new ApiError("No autenticado", 401);
  return token;
}

function Skeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-8">
      <div className="h-5 w-24 rounded-full bg-muted" />
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="flex flex-col gap-6">
          <div className="h-20 rounded-3xl bg-muted" />
          <div className="h-64 rounded-3xl bg-muted" />
        </div>
        <div className="h-72 rounded-3xl bg-muted" />
      </div>
    </div>
  );
}

function Stat({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("tabular-nums", strong && "font-semibold")}>{value}</span>
    </div>
  );
}

export function BookingDetail({ bookingId }: { bookingId: string }) {
  const { agencySlug } = useParams<{ agencySlug: string }>();
  const queryClient = useQueryClient();
  const [confirmingCancel, setConfirmingCancel] = useState(false);

  const { data: booking, isLoading, error } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => getBooking(requireToken(), bookingId),
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["booking", bookingId] });
    queryClient.invalidateQueries({ queryKey: ["bookings"] });
  }

  function transition(done: string, fn: (token: string, id: string) => Promise<unknown>) {
    return {
      mutationFn: () => fn(requireToken(), bookingId),
      onSuccess: () => {
        toast.success(done);
        invalidate();
      },
      onError: (err: unknown) => toast.error(err instanceof ApiError ? err.message : "No se pudo completar la acción"),
    };
  }
  const confirmMutation = useMutation(transition("Reserva confirmada", confirmBooking));
  const completeMutation = useMutation(transition("Reserva completada", completeBooking));
  const cancelMutation = useMutation(transition("Reserva cancelada", cancelBooking));

  const markPaidMutation = useMutation({
    mutationFn: (paymentId: string) => markPaymentPaid(requireToken(), bookingId, paymentId),
    onSuccess: () => {
      toast.success("Pago marcado como cobrado");
      invalidate();
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "No se pudo marcar el pago"),
  });

  if (error) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-2xl bg-card p-6 ring-1 ring-foreground/5">
        <div>
          <p className="font-display text-xl">No encontramos la reserva</p>
          <p className="text-sm text-muted-foreground">
            {error instanceof ApiError ? error.message : "Revisá tu conexión e intentá de nuevo."}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/${agencySlug}/bookings`}>
            <ArrowLeft />
            Volver a reservas
          </Link>
        </Button>
      </div>
    );
  }
  if (isLoading || !booking) return <Skeleton />;

  const dates = datesOf(booking);
  const { paid, base } = paymentsOf(booking);
  const payments = booking.payments ?? [];
  const busy = confirmMutation.isPending || completeMutation.isPending || cancelMutation.isPending;
  const open = booking.status === "PENDING" || booking.status === "CONFIRMED";

  return (
    <div className="flex flex-col gap-8">
      <Link
        href={`/${agencySlug}/bookings`}
        className="inline-flex w-fit items-center gap-1.5 rounded-full text-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <ArrowLeft className="size-4" />
        Reservas
      </Link>

      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="flex min-w-0 flex-col gap-12">
          <header className="flex items-center gap-5">
            <DateTile booking={booking} className="size-20 rounded-3xl [&_.font-display]:text-4xl" />
            <div className="flex min-w-0 flex-col gap-2">
              <h1 className="font-display text-4xl leading-none tracking-tight text-balance">
                {booking.propertyTitle ?? "Reserva"}
              </h1>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-muted-foreground">
                <BookingStatusPill status={booking.status} />
                {booking.clientId && booking.clientName ? (
                  <Link href={`/${agencySlug}/clients/${booking.clientId}`} className="outline-none hover:text-foreground hover:underline focus-visible:underline">
                    {booking.clientName}
                  </Link>
                ) : (
                  <span>Sin cliente asignado</span>
                )}
              </div>
            </div>
          </header>

          <FormSection
            title="Estadía"
            description={dates ? "Fechas del alquiler." : "Es una operación de venta, no tiene fechas."}
            shown={false}
          >
            {dates ? (
              <div className="grid max-w-md grid-cols-2 gap-3">
                {[
                  { label: "Check-in", date: dates.start },
                  { label: "Check-out", date: dates.end },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col gap-1 rounded-2xl bg-card p-4 ring-1 ring-foreground/5">
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                    <span className="font-display text-xl first-letter:uppercase">
                      {format(item.date, "EEE d 'de' MMM", { locale: es })}
                    </span>
                    <span className="text-xs text-muted-foreground">{format(item.date, "yyyy")}</span>
                  </div>
                ))}
                <p className="col-span-2 text-sm text-muted-foreground">
                  {dates.nights} {dates.nights === 1 ? "noche" : "noches"}
                </p>
              </div>
            ) : null}
          </FormSection>

          <FormSection title="Pagos" description="Anticipos, saldo y comisión, con lo que ya se cobró." shown={false}>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <PaidBar booking={booking} className="min-w-0 flex-1" />
                <AddPaymentDialog bookingId={booking.id} currency={booking.currency} />
              </div>

              {payments.length > 0 ? (
                <ul className="flex flex-col gap-2">
                  {payments.map((payment) => (
                    <li
                      key={payment.id}
                      className="flex items-center gap-4 rounded-2xl bg-card p-4 ring-1 ring-foreground/5"
                    >
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span className="font-medium tabular-nums">{money(payment.currency, payment.amount)}</span>
                        <span className="text-xs text-muted-foreground">
                          {PAYMENT_TYPE_LABELS[payment.type]}
                          {payment.status === "PAID" && payment.paidAt && (
                            <>
                              {" · "}
                              {format(new Date(payment.paidAt), "d MMM", { locale: es })}
                              {payment.method && ` · ${payment.method}`}
                            </>
                          )}
                        </span>
                      </div>
                      {payment.status === "PAID" ? (
                        <span className="inline-flex h-6 items-center gap-1 rounded-full bg-primary/10 px-2.5 text-xs font-medium text-primary">
                          <Check className="size-3" />
                          Cobrado
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full px-4"
                          disabled={markPaidMutation.isPending}
                          onClick={() => markPaidMutation.mutate(payment.id)}
                        >
                          Marcar como cobrado
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">Todavía no hay pagos registrados.</p>
              )}
            </div>
          </FormSection>
        </div>

        <aside className="flex flex-col gap-6 rounded-3xl bg-card p-6 shadow-[0_1px_2px_oklch(0.3_0.05_160/0.04),0_12px_32px_-12px_oklch(0.3_0.05_160/0.14)] ring-1 ring-foreground/5 lg:sticky lg:top-24">
          <div className="flex flex-col gap-3">
            <h2 className="font-display text-xl leading-tight">Resumen</h2>
            <div className="flex flex-col gap-2">
              <Stat label="Precio total" value={booking.totalPrice ? money(booking.currency, booking.totalPrice) : "—"} strong />
              <Stat label="Comisión" value={booking.commissionAmount ? money(booking.currency, booking.commissionAmount) : "—"} />
              <Stat label="Cobrado" value={money(booking.currency, paid)} />
              <Stat label="Por cobrar" value={money(booking.currency, Math.max(base - paid, 0))} />
            </div>
          </div>

          {open && (
            <div className="flex flex-col gap-2">
              {booking.status === "PENDING" && (
                <Button className="h-10 rounded-full" disabled={busy} onClick={() => confirmMutation.mutate()}>
                  <Check />
                  Confirmar reserva
                </Button>
              )}
              {booking.status === "CONFIRMED" && (
                <Button className="h-10 rounded-full" disabled={busy} onClick={() => completeMutation.mutate()}>
                  <CircleCheck />
                  Marcar como completada
                </Button>
              )}
              <Button
                variant="ghost"
                className="h-10 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                disabled={busy}
                onClick={() => setConfirmingCancel(true)}
              >
                <X />
                Cancelar reserva
              </Button>
            </div>
          )}
        </aside>
      </div>

      <AlertDialog open={confirmingCancel} onOpenChange={setConfirmingCancel}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-2xl">¿Cancelar esta reserva?</AlertDialogTitle>
            <AlertDialogDescription>
              Las fechas se liberan y la reserva queda como cancelada. Los pagos ya registrados no se borran.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Volver</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                cancelMutation.mutate();
                setConfirmingCancel(false);
              }}
            >
              Cancelar reserva
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
