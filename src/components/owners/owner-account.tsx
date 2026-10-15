"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { OwnerStatementView } from "@/components/owners/owner-statement";
import { FormSection } from "@/components/properties/form-section";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api/client";
import { createOwnerPayout, deleteOwnerPayout, getOwnerStatement } from "@/lib/api/owner-accounts";
import type { PropertyOwner } from "@/lib/api/properties";
import { getAccessToken, useSessionUser } from "@/lib/auth/session";
import { cn } from "@/lib/utils";

const CURRENCIES = ["USD", "ARS", "EUR"];

function requireToken() {
  const token = getAccessToken();
  if (!token) throw new ApiError("No autenticado", 401);
  return token;
}

const today = () => new Date().toISOString().slice(0, 10);

/**
 * What the agency has collected for an owner, what is due to them and the
 * liquidaciones already handed over, with a form to register a new one.
 * Money matters: only owners and admins of the agency see it.
 */
export function OwnerAccount({ owner }: { owner: PropertyOwner }) {
  const user = useSessionUser();
  const queryClient = useQueryClient();
  const [adding, setAdding] = useState(false);
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [paidAt, setPaidAt] = useState(today());
  const [method, setMethod] = useState("");
  const [note, setNote] = useState("");

  const allowed = !!user && user.role !== "AGENT";
  const key = ["owner-statement", owner.id];

  const { data, isLoading, error } = useQuery({
    queryKey: key,
    queryFn: () => getOwnerStatement(requireToken(), owner.id),
    enabled: allowed,
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: key });

  const addMutation = useMutation({
    meta: { affectsSite: false },
    mutationFn: () =>
      createOwnerPayout(requireToken(), owner.id, {
        amount: Number(amount.replace(",", ".")),
        currency,
        paidAt,
        method: method.trim() || undefined,
        note: note.trim() || undefined,
      }),
    onSuccess: () => {
      toast.success("Liquidación registrada");
      setAdding(false);
      setAmount("");
      setMethod("");
      setNote("");
      setPaidAt(today());
      refresh();
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "No se pudo registrar la liquidación"),
  });

  const deleteMutation = useMutation({
    meta: { affectsSite: false },
    mutationFn: (payoutId: string) => deleteOwnerPayout(requireToken(), owner.id, payoutId),
    onSuccess: () => {
      toast.success("Liquidación eliminada");
      refresh();
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "No se pudo eliminar"),
  });

  if (!allowed) return null;

  const amountValue = Number(amount.replace(",", "."));
  const valid = amountValue > 0 && !!paidAt;
  // Offer the currency that still has a balance to settle.
  const owed = data?.totals.find((total) => total.balance > 0);

  return (
    <FormSection
      title="Estado de cuenta"
      description={`Lo cobrado por las reservas de ${owner.name}, lo que le corresponde (la comisión se descuenta) y lo que ya se le liquidó. Lo ve en su link de acceso.`}
      shown={false}
    >
      <div className="flex flex-col gap-6">
        {isLoading && <p className="text-sm text-muted-foreground">Cargando…</p>}
        {error && (
          <p className="text-sm text-muted-foreground">{error instanceof ApiError ? error.message : "No pudimos cargar el estado de cuenta."}</p>
        )}
        {data && (
          <OwnerStatementView
            statement={data}
            tone="app"
            renderPayoutAction={(payoutId) => (
              <button
                type="button"
                onClick={() => deleteMutation.mutate(payoutId)}
                disabled={deleteMutation.isPending}
                aria-label="Eliminar liquidación"
                className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground outline-none hover:bg-foreground/[0.06] hover:text-destructive focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <Trash2 className="size-4" />
              </button>
            )}
          />
        )}

        {!adding ? (
          <Button
            type="button"
            variant="outline"
            className="w-fit gap-2"
            onClick={() => {
              if (owed) {
                setCurrency(owed.currency);
                setAmount(String(owed.balance));
              }
              setAdding(true);
            }}
          >
            <Plus />
            Registrar liquidación
          </Button>
        ) : (
          <form
            className="flex flex-col gap-3 rounded-2xl bg-foreground/[0.04] p-4"
            onSubmit={(event) => {
              event.preventDefault();
              if (valid) addMutation.mutate();
            }}
          >
            <p className="text-sm font-medium">Nueva liquidación</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex gap-2">
                <Input
                  inputMode="decimal"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="Monto"
                  aria-label="Monto"
                  className="h-11 min-w-0 flex-1"
                />
                <div role="group" aria-label="Moneda" className="flex gap-0.5 rounded-full bg-foreground/[0.06] p-1">
                  {CURRENCIES.map((option) => (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={currency === option}
                      onClick={() => setCurrency(option)}
                      className={cn(
                        "rounded-full px-3 text-xs font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                        currency === option ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              <DatePicker value={paidAt} onChange={setPaidAt} placeholder="Fecha de la liquidación" surface="card" />
              <Input value={method} onChange={(event) => setMethod(event.target.value)} placeholder="Medio (transferencia, efectivo…)" aria-label="Medio" maxLength={50} className="h-11" />
              <Input value={note} onChange={(event) => setNote(event.target.value)} placeholder="Nota (opcional)" aria-label="Nota" maxLength={255} className="h-11" />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setAdding(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={!valid || addMutation.isPending}>
                Registrar
              </Button>
            </div>
          </form>
        )}
      </div>
    </FormSection>
  );
}
