"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api/client";
import {
  createRatePeriod,
  deleteRatePeriod,
  listRatePeriods,
  type RatePeriodPayload,
} from "@/lib/api/rate-periods";
import { getAccessToken } from "@/lib/auth/session";

const EMPTY_FORM = {
  label: "",
  startDate: "",
  endDate: "",
  officialPricePerNight: "",
  managementFeePct: "10",
  agencyCommissionPct: "20",
  minStay: "",
};

export function RatesTab({ propertyId }: { propertyId: string }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: periods } = useQuery({
    queryKey: ["rate-periods", propertyId],
    queryFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return listRatePeriods(token, propertyId);
    },
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["rate-periods", propertyId] });
  }

  const createMutation = useMutation({
    mutationFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      const payload: Partial<RatePeriodPayload> = {
        label: form.label || undefined,
        startDate: form.startDate,
        endDate: form.endDate,
        officialPricePerNight: form.officialPricePerNight ? Number(form.officialPricePerNight) : undefined,
        managementFeePct: Number(form.managementFeePct) || 10,
        agencyCommissionPct: Number(form.agencyCommissionPct) || 20,
        minStay: form.minStay ? Number(form.minStay) : undefined,
      };
      return createRatePeriod(token, propertyId, payload);
    },
    onSuccess: () => {
      setForm(EMPTY_FORM);
      setError(null);
      invalidate();
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : "No se pudo crear el período"),
  });

  const removeMutation = useMutation({
    mutationFn: (periodId: string) => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return deleteRatePeriod(token, propertyId, periodId);
    },
    onSuccess: invalidate,
  });

  return (
    <div className="space-y-6">
      <div className="space-y-3 rounded-md border p-4">
        <h4 className="text-sm font-medium">Nuevo período</h4>
        <div className="grid grid-cols-2 gap-3">
          <Input
            placeholder="Etiqueta (ej. Temporada alta)"
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
            className="col-span-2"
          />
          <Input
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
          />
          <Input
            type="date"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
          />
          <Input
            placeholder="Precio oficial/noche"
            inputMode="decimal"
            value={form.officialPricePerNight}
            onChange={(e) => setForm({ ...form, officialPricePerNight: e.target.value })}
          />
          <Input
            placeholder="Estadía mínima (noches)"
            inputMode="numeric"
            value={form.minStay}
            onChange={(e) => setForm({ ...form, minStay: e.target.value })}
          />
          <Input
            placeholder="% fee de management"
            inputMode="decimal"
            value={form.managementFeePct}
            onChange={(e) => setForm({ ...form, managementFeePct: e.target.value })}
          />
          <Input
            placeholder="% comisión agencia"
            inputMode="decimal"
            value={form.agencyCommissionPct}
            onChange={(e) => setForm({ ...form, agencyCommissionPct: e.target.value })}
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button
          type="button"
          size="sm"
          disabled={!form.startDate || !form.endDate || createMutation.isPending}
          onClick={() => createMutation.mutate()}
        >
          Agregar período
        </Button>
      </div>

      {periods && periods.length > 0 ? (
        <div className="space-y-2">
          {periods.map((period) => (
            <div key={period.id} className="flex items-center justify-between rounded-md border p-3 text-sm">
              <div>
                <p className="font-medium">{period.label || "Sin etiqueta"}</p>
                <p className="text-zinc-500">
                  {period.startDate} → {period.endDate}
                  {period.officialPricePerNight ? ` · ${period.officialPricePerNight}/noche` : ""}
                  {period.minStay ? ` · mín. ${period.minStay} noches` : ""}
                </p>
              </div>
              <Button type="button" size="sm" variant="ghost" onClick={() => removeMutation.mutate(period.id)}>
                Quitar
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-zinc-500">Todavía no hay períodos de tarifa.</p>
      )}
    </div>
  );
}
