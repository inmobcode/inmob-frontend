"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { addPayment, type PaymentType } from "@/lib/api/bookings";
import { ApiError } from "@/lib/api/client";
import { getAccessToken } from "@/lib/auth/session";
import { PAYMENT_TYPE_LABELS } from "@/lib/properties-labels";

export function AddPaymentDialog({ bookingId }: { bookingId: string }) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<PaymentType>("DEPOSIT");
  const [serverError, setServerError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return addPayment(token, bookingId, { amount: Number(amount), type });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booking", bookingId] });
      setAmount("");
      setOpen(false);
    },
    onError: (err) => setServerError(err instanceof ApiError ? err.message : "Error inesperado"),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Agregar pago
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar pago</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="amount">Monto</FieldLabel>
              <Input
                id="amount"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="type">Tipo</FieldLabel>
              <Select value={type} onValueChange={(value) => setType(value as PaymentType)}>
                <SelectTrigger id="type" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PAYMENT_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
          {serverError && <p className="text-sm text-destructive">{serverError}</p>}
          <DialogFooter>
            <Button disabled={!amount || mutation.isPending} onClick={() => mutation.mutate()}>
              {mutation.isPending ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
