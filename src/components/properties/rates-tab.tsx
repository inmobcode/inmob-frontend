"use client";

import { ArrowRight } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/api/client";
import {
  createRatePeriod,
  deleteRatePeriod,
  listRatePeriods,
  type RatePeriodPayload,
} from "@/lib/api/rate-periods";
import { getAccessToken } from "@/lib/auth/session";
import { useFormat } from "@/i18n/format";

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
  const t = useTranslations("properties.rates");
  const { number } = useFormat();
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
    onError: (err) => setError(err instanceof ApiError ? err.message : t("createFailed")),
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
        <h4 className="text-sm font-medium">{t("new")}</h4>
        <div className="grid grid-cols-2 gap-3">
          <Input
            placeholder={t("label")}
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
            className="col-span-2"
          />
          <div className="col-span-2">
            <DateRangePicker
              start={form.startDate}
              end={form.endDate}
              countAs="days"
              placeholder={t("dates")}
              hints={{ first: t("firstDay"), second: t("lastDay") }}
              onChange={(startDate, endDate) => setForm({ ...form, startDate, endDate })}
            />
          </div>
          <Input
            placeholder={t("price")}
            inputMode="decimal"
            value={form.officialPricePerNight}
            onChange={(e) => setForm({ ...form, officialPricePerNight: e.target.value })}
          />
          <Input
            placeholder={t("minStay")}
            inputMode="numeric"
            value={form.minStay}
            onChange={(e) => setForm({ ...form, minStay: e.target.value })}
          />
          {/* They start filled with the defaults, so the placeholder never shows: each needs its own label. */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="rate-management-fee">{t("managementFee")}</Label>
            <Input
              id="rate-management-fee"
              placeholder={t("managementFee")}
              inputMode="decimal"
              value={form.managementFeePct}
              onChange={(e) => setForm({ ...form, managementFeePct: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="rate-agency-commission">{t("commission")}</Label>
            <Input
              id="rate-agency-commission"
              placeholder={t("commission")}
              inputMode="decimal"
              value={form.agencyCommissionPct}
              onChange={(e) => setForm({ ...form, agencyCommissionPct: e.target.value })}
            />
          </div>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button
          type="button"
          size="sm"
          disabled={!form.startDate || !form.endDate || createMutation.isPending}
          onClick={() => createMutation.mutate()}
        >
          {t("add")}
        </Button>
      </div>

      {periods && periods.length > 0 ? (
        <div className="space-y-2">
          {periods.map((period) => (
            <div key={period.id} className="flex items-center justify-between rounded-md border p-3 text-sm">
              <div>
                <p className="font-medium">{period.label || t("noLabel")}</p>
                <p className="text-zinc-500">
                  {period.startDate} <ArrowRight className="inline size-3.5 align-[-2px]" /> {period.endDate}
                  {period.officialPricePerNight ? ` · ${t("perNight", { price: number(period.officialPricePerNight) })}` : ""}
                  {period.minStay ? ` · ${t("minNights", { count: period.minStay })}` : ""}
                </p>
              </div>
              <Button type="button" size="sm" variant="ghost" onClick={() => removeMutation.mutate(period.id)}>
                {t("remove")}
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-zinc-500">{t("empty")}</p>
      )}
    </div>
  );
}
