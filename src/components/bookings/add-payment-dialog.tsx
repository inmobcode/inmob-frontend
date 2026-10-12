"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle, Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addPayment, type PaymentType } from "@/lib/api/bookings";
import { ApiError } from "@/lib/api/client";
import { getAccessToken } from "@/lib/auth/session";
import { PAYMENT_TYPE_LABELS } from "@/lib/properties-labels";
import { cn } from "@/lib/utils";

export function AddPaymentDialog({ bookingId, currency }: { bookingId: string; currency: string }) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<PaymentType>("DEPOSIT");
  const [serverError, setServerError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return addPayment(token, bookingId, { amount: Number(amount), type, currency });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booking", bookingId] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      handleOpenChange(false);
    },
    onError: (err) => setServerError(err instanceof ApiError ? err.message : "Error inesperado"),
  });

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setAmount("");
      setType("DEPOSIT");
      setServerError(null);
    }
  }

  const valid = Number(amount) > 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="h-9 gap-1.5 rounded-full px-4">
          <Plus />
          Agregar pago
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-0 rounded-3xl p-0 sm:max-w-md" showCloseButton>
        <form
          className="flex flex-col"
          onSubmit={(event) => {
            event.preventDefault();
            if (!valid) return;
            setServerError(null);
            mutation.mutate();
          }}
        >
          <div className="flex flex-col gap-1.5 px-7 pt-7 pb-5">
            <DialogTitle className="font-display text-3xl leading-none tracking-tight">Agregar pago</DialogTitle>
            <DialogDescription>Queda pendiente hasta que lo marques como cobrado.</DialogDescription>
          </div>

          <div className="flex flex-col gap-5 px-7 pb-2">
            <div className="flex flex-col gap-2.5">
              <Label>Tipo</Label>
              <div role="group" aria-label="Tipo de pago" className="flex flex-wrap gap-1.5">
                {(Object.keys(PAYMENT_TYPE_LABELS) as PaymentType[]).map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={type === value}
                    onClick={() => setType(value)}
                    className={cn(
                      "inline-flex h-9 items-center rounded-full px-4 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                      type === value
                        ? "bg-primary text-primary-foreground"
                        : "bg-foreground/[0.06] text-muted-foreground hover:bg-foreground/10 hover:text-foreground",
                    )}
                  >
                    {PAYMENT_TYPE_LABELS[value]}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2.5">
              <Label htmlFor="amount">Monto</Label>
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                  {currency}
                </span>
                <Input
                  id="amount"
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder="0"
                  className="h-11 pl-14 tabular-nums"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value.replace(/[^\d.]/g, ""))}
                />
              </div>
            </div>
            {serverError && <p className="text-sm text-destructive">{serverError}</p>}
          </div>

          <div className="flex items-center justify-end gap-2 px-7 pt-5 pb-7">
            <Button type="button" variant="ghost" className="h-10 px-5" onClick={() => handleOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="highlight" className="h-10 gap-2 px-6" disabled={!valid || mutation.isPending}>
              {mutation.isPending ? (
                <>
                  <LoaderCircle className="animate-spin" />
                  Guardando…
                </>
              ) : (
                "Guardar pago"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
