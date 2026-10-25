"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { PriceInput, Stepper } from "@/components/properties/form-controls";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAgency } from "@/lib/api/agency";
import { ApiError } from "@/lib/api/client";
import type { Client, ClientPreferences } from "@/lib/api/clients";
import { getAccessToken } from "@/lib/auth/session";

type Draft = { budgetMin: string; budgetMax: string; guests: string; zones: string; desiredFrom: string; desiredTo: string };

function draftOf(client: Client): Draft {
  return {
    budgetMin: client.budgetMin == null ? "" : String(Math.round(client.budgetMin)),
    budgetMax: client.budgetMax == null ? "" : String(Math.round(client.budgetMax)),
    guests: client.guests == null ? "" : String(client.guests),
    zones: client.zones ?? "",
    desiredFrom: client.desiredFrom ?? "",
    desiredTo: client.desiredTo ?? "",
  };
}

const number = (value: string) => (value.trim() === "" ? null : Number(value.replace(",", ".")));

/** What the client is looking for: budget, how many people, where and when. Internal to the team. */
export function ClientPreferencesForm({
  client,
  saving,
  onSave,
}: {
  client: Client;
  saving: boolean;
  /** Resolves once saved; the form then shows what was saved again. */
  onSave: (payload: Omit<ClientPreferences, "tags">) => Promise<unknown>;
}) {
  const t = useTranslations("clients.preferences");
  const saved = draftOf(client);
  const [draft, setDraft] = useState<Draft | null>(null);
  const value = draft ?? saved;
  const dirty = draft !== null && (Object.keys(saved) as (keyof Draft)[]).some((key) => draft[key] !== saved[key]);
  const { data: agency } = useQuery({
    queryKey: ["agency"],
    queryFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return getAgency(token);
    },
    staleTime: 5 * 60_000,
  });

  const min = number(value.budgetMin);
  const max = number(value.budgetMax);
  const budgetCrossed = min !== null && max !== null && min > max;

  function set(patch: Partial<Draft>) {
    setDraft({ ...value, ...patch });
  }

  function save() {
    const guests = number(value.guests);
    onSave({
      budgetMin: min,
      budgetMax: max,
      guests: guests && guests >= 1 ? Math.round(guests) : null,
      zones: value.zones.trim() || null,
      desiredFrom: value.desiredFrom || null,
      desiredTo: value.desiredTo || null,
    })
      .then(() => setDraft(null))
      // The error is already on a toast; the draft stays to fix and retry.
      .catch(() => {});
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="budget-min">{t("budgetMin")}</Label>
          <PriceInput id="budget-min" value={value.budgetMin} onChange={(budgetMin) => set({ budgetMin })} unit={agency?.currency} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="budget-max">{t("budgetMax")}</Label>
          <PriceInput id="budget-max" value={value.budgetMax} onChange={(budgetMax) => set({ budgetMax })} unit={agency?.currency} />
        </div>
        {budgetCrossed && <p className="text-sm text-destructive sm:col-span-2">{t("budgetCrossed")}</p>}
        <div className="flex flex-col gap-2">
          <Label htmlFor="guests">{t("guests")}</Label>
          <Stepper id="guests" label={t("guests")} min={1} value={value.guests} onChange={(guests) => set({ guests })} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="desired-dates">{t("dates")}</Label>
          <DateRangePicker
            id="desired-dates"
            countAs="days"
            placeholder={t("datesPlaceholder")}
            start={value.desiredFrom}
            end={value.desiredTo}
            onChange={(desiredFrom, desiredTo) => set({ desiredFrom, desiredTo })}
          />
        </div>
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="zones">{t("zones")}</Label>
          <Input
            id="zones"
            maxLength={300}
            placeholder={t("zonesPlaceholder")}
            value={value.zones}
            onChange={(event) => set({ zones: event.target.value })}
          />
        </div>
      </div>
      {dirty && (
        <div className="flex items-center gap-2">
          <Button size="sm" className="rounded-full px-4" disabled={saving || budgetCrossed} onClick={save}>
            {t("save")}
          </Button>
          <Button size="sm" variant="ghost" className="rounded-full px-4" disabled={saving} onClick={() => setDraft(null)}>
            {t("discard")}
          </Button>
        </div>
      )}
    </div>
  );
}
