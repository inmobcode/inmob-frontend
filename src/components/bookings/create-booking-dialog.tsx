"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApiError } from "@/lib/api/client";
import { listClients } from "@/lib/api/clients";
import { listProperties } from "@/lib/api/properties";
import { createBooking } from "@/lib/api/bookings";
import { getAccessToken } from "@/lib/auth/session";

export function CreateBookingDialog({
  defaultPropertyId,
  defaultClientId,
  defaultOfferId,
  defaultTotalPrice,
}: {
  defaultPropertyId?: string;
  defaultClientId?: string;
  defaultOfferId?: string;
  defaultTotalPrice?: number;
}) {
  const [open, setOpen] = useState(false);
  const [propertyId, setPropertyId] = useState(defaultPropertyId ?? "");
  const [clientId, setClientId] = useState(defaultClientId ?? "");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalPrice, setTotalPrice] = useState(defaultTotalPrice?.toString() ?? "");
  const [commission, setCommission] = useState("");
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
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        totalPrice: totalPrice ? Number(totalPrice) : undefined,
        commissionAmount: commission ? Number(commission) : undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      setOpen(false);
    },
    onError: (err) => setServerError(err instanceof ApiError ? err.message : "Error inesperado"),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Nueva reserva</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva reserva</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="property">Propiedad</FieldLabel>
              <Select value={propertyId} onValueChange={setPropertyId}>
                <SelectTrigger id="property" className="w-full">
                  <SelectValue placeholder="Elegí una propiedad" />
                </SelectTrigger>
                <SelectContent>
                  {properties?.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="client">Cliente (opcional)</FieldLabel>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger id="client" className="w-full">
                  <SelectValue placeholder="Sin cliente asignado" />
                </SelectTrigger>
                <SelectContent>
                  {clients?.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="startDate">Check-in (opcional)</FieldLabel>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="endDate">Check-out (opcional)</FieldLabel>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="totalPrice">Precio total</FieldLabel>
                <Input
                  id="totalPrice"
                  inputMode="decimal"
                  value={totalPrice}
                  onChange={(e) => setTotalPrice(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="commission">Comisión</FieldLabel>
                <Input
                  id="commission"
                  inputMode="decimal"
                  value={commission}
                  onChange={(e) => setCommission(e.target.value)}
                />
              </Field>
            </div>
          </FieldGroup>
          {serverError && <p className="text-sm text-destructive">{serverError}</p>}
          <DialogFooter>
            <Button disabled={!propertyId || mutation.isPending} onClick={() => mutation.mutate()}>
              {mutation.isPending ? "Creando..." : "Crear"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
