"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { LoaderCircle } from "lucide-react";

import { NewItemButton } from "@/components/new-item-button";
import { PropertyPicker } from "@/components/properties/property-picker";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DateRangePicker } from "@/components/ui/date-range-picker";
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
      handleOpenChange(false);
    },
    onError: (err) => setServerError(err instanceof ApiError ? err.message : "Error inesperado"),
  });

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setPropertyId(defaultPropertyId ?? "");
      setClientId(defaultClientId ?? "");
      setStartDate("");
      setEndDate("");
      setTotalPrice(defaultTotalPrice?.toString() ?? "");
      setCommission("");
      setServerError(null);
    }
  }

  const number = (value: string) => value.replace(/[^\d.]/g, "");

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <NewItemButton label="Nueva reserva" />
      </DialogTrigger>
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
            <DialogTitle className="font-display text-3xl leading-none tracking-tight">Nueva reserva</DialogTitle>
            <DialogDescription>Elegí la propiedad. Las fechas son para alquileres; una venta va sin ellas.</DialogDescription>
          </div>

          <div className="flex flex-col gap-5 px-7 pb-2">
            <div className="flex flex-col gap-2.5">
              <Label htmlFor="property">Propiedad</Label>
              <PropertyPicker
                id="property"
                properties={properties ?? []}
                value={propertyId}
                onChange={setPropertyId}
                className="h-11"
              />
            </div>
            <div className="flex flex-col gap-2.5">
              <Label htmlFor="client">
                Cliente <span className="font-normal text-muted-foreground">(opcional)</span>
              </Label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger id="client" className="h-11 w-full">
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
            </div>
            <div className="flex flex-col gap-2.5">
              <Label htmlFor="dates">
                Fechas <span className="font-normal text-muted-foreground">(solo alquileres)</span>
              </Label>
              <DateRangePicker
                id="dates"
                start={startDate}
                end={endDate}
                onChange={(from, to) => {
                  setStartDate(from);
                  setEndDate(to);
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2.5">
                <Label htmlFor="totalPrice">Precio total</Label>
                <Input
                  id="totalPrice"
                  inputMode="decimal"
                  placeholder="0"
                  className="h-11 px-4 tabular-nums"
                  value={totalPrice}
                  onChange={(e) => setTotalPrice(number(e.target.value))}
                />
              </div>
              <div className="flex flex-col gap-2.5">
                <Label htmlFor="commission">Comisión</Label>
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
              Cancelar
            </Button>
            <Button type="submit" variant="highlight" className="h-10 gap-2 px-6" disabled={!propertyId || mutation.isPending}>
              {mutation.isPending ? (
                <>
                  <LoaderCircle className="animate-spin" />
                  Creando…
                </>
              ) : (
                "Crear reserva"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
