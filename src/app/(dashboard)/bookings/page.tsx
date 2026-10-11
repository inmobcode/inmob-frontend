"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreateBookingDialog } from "@/components/bookings/create-booking-dialog";
import { listBookings } from "@/lib/api/bookings";
import { ApiError } from "@/lib/api/client";
import { getAccessToken } from "@/lib/auth/session";
import { BOOKING_STATUS_LABELS } from "@/lib/properties-labels";

export default function BookingsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["bookings"],
    queryFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return listBookings(token);
    },
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Reservas</CardTitle>
          <CardDescription>Administración de reservas, confirmaciones y cancelaciones.</CardDescription>
        </div>
        <CreateBookingDialog />
      </CardHeader>
      <CardContent>
        {isLoading && <p className="text-sm text-zinc-500">Cargando...</p>}
        {error && (
          <p className="text-sm text-destructive">
            {error instanceof ApiError ? error.message : "No se pudieron cargar las reservas"}
          </p>
        )}
        {data && data.length === 0 && (
          <p className="text-sm text-zinc-500">Todavía no hay reservas.</p>
        )}
        {data && data.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Propiedad</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Fechas</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <Link href={`/bookings/${booking.id}`} className="hover:underline">
                      {booking.propertyTitle ?? booking.propertyId}
                    </Link>
                  </TableCell>
                  <TableCell>{booking.clientName ?? "—"}</TableCell>
                  <TableCell>
                    {booking.startDate && booking.endDate
                      ? `${booking.startDate} → ${booking.endDate}`
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {booking.totalPrice
                      ? `${booking.currency} ${booking.totalPrice.toLocaleString()}`
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={booking.status === "CANCELLED" ? "outline" : "default"}>
                      {BOOKING_STATUS_LABELS[booking.status]}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
