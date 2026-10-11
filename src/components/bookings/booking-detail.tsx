"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddPaymentDialog } from "@/components/bookings/add-payment-dialog";
import {
  cancelBooking,
  completeBooking,
  confirmBooking,
  getBooking,
  markPaymentPaid,
} from "@/lib/api/bookings";
import { ApiError } from "@/lib/api/client";
import { getAccessToken } from "@/lib/auth/session";
import { BOOKING_STATUS_LABELS, PAYMENT_TYPE_LABELS } from "@/lib/properties-labels";

export function BookingDetail({ bookingId }: { bookingId: string }) {
  const queryClient = useQueryClient();

  const { data: booking, isLoading } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return getBooking(token, bookingId);
    },
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["booking", bookingId] });
    queryClient.invalidateQueries({ queryKey: ["bookings"] });
  }

  const confirmMutation = useMutation({
    mutationFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return confirmBooking(token, bookingId);
    },
    onSuccess: () => {
      toast.success("Reserva confirmada");
      invalidate();
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "No se pudo confirmar"),
  });

  const cancelMutation = useMutation({
    mutationFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return cancelBooking(token, bookingId);
    },
    onSuccess: () => {
      toast.success("Reserva cancelada");
      invalidate();
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "No se pudo cancelar"),
  });

  const completeMutation = useMutation({
    mutationFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return completeBooking(token, bookingId);
    },
    onSuccess: () => {
      toast.success("Reserva completada");
      invalidate();
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "No se pudo completar"),
  });

  const markPaidMutation = useMutation({
    mutationFn: (paymentId: string) => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return markPaymentPaid(token, bookingId, paymentId);
    },
    onSuccess: invalidate,
  });

  if (isLoading || !booking) {
    return <p className="text-sm text-zinc-500">Cargando...</p>;
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{booking.propertyTitle ?? "Reserva"}</h1>
          <p className="text-sm text-zinc-500">{booking.clientName ?? "Sin cliente asignado"}</p>
        </div>
        <Badge>{BOOKING_STATUS_LABELS[booking.status]}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Detalles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p>
            Fechas:{" "}
            {booking.startDate && booking.endDate
              ? `${booking.startDate} → ${booking.endDate}`
              : "Sin fechas (venta)"}
          </p>
          <p>
            Precio total:{" "}
            {booking.totalPrice ? `${booking.currency} ${booking.totalPrice.toLocaleString()}` : "—"}
          </p>
          <p>
            Comisión:{" "}
            {booking.commissionAmount
              ? `${booking.currency} ${booking.commissionAmount.toLocaleString()}`
              : "—"}
          </p>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        {booking.status === "PENDING" && (
          <>
            <Button onClick={() => confirmMutation.mutate()} disabled={confirmMutation.isPending}>
              Confirmar
            </Button>
            <Button
              variant="outline"
              onClick={() => cancelMutation.mutate()}
              disabled={cancelMutation.isPending}
            >
              Cancelar
            </Button>
          </>
        )}
        {booking.status === "CONFIRMED" && (
          <>
            <Button onClick={() => completeMutation.mutate()} disabled={completeMutation.isPending}>
              Marcar como completada
            </Button>
            <Button
              variant="outline"
              onClick={() => cancelMutation.mutate()}
              disabled={cancelMutation.isPending}
            >
              Cancelar
            </Button>
          </>
        )}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Pagos</CardTitle>
          <AddPaymentDialog bookingId={booking.id} />
        </CardHeader>
        <CardContent className="space-y-3">
          {booking.payments && booking.payments.length > 0 ? (
            booking.payments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between rounded-md border p-3 text-sm"
              >
                <div>
                  <p className="font-medium">
                    {payment.currency} {payment.amount.toLocaleString()}
                  </p>
                  <p className="text-zinc-500">{PAYMENT_TYPE_LABELS[payment.type]}</p>
                </div>
                {payment.status === "PAID" ? (
                  <Badge>Pagado</Badge>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => markPaidMutation.mutate(payment.id)}
                  >
                    Marcar como pagado
                  </Button>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-zinc-500">Todavía no hay pagos registrados.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
