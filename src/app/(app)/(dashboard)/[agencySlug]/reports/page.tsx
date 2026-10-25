"use client";

import { useQuery } from "@tanstack/react-query";
import { ChartColumn, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { HelpLink } from "@/components/docs/help-link";
import { Segmented } from "@/components/properties/segmented";
import {
  ConversionFunnel,
  MonthlyMoney,
  OccupancyList,
  StatTile,
  TeamTable,
} from "@/components/reports/report-views";
import { Button } from "@/components/ui/button";
import { useFormat } from "@/i18n/format";
import { getAgency } from "@/lib/api/agency";
import { ApiError } from "@/lib/api/client";
import { getReport } from "@/lib/api/reports";
import { getAccessToken, useSessionUser } from "@/lib/auth/session";
import { moneyTotals, overallOccupancy, PERIODS, periodRange, type Period } from "@/lib/reports";

function requireToken() {
  const token = getAccessToken();
  if (!token) throw new ApiError("No autenticado", 401);
  return token;
}

export default function ReportsPage() {
  const t = useTranslations("reports");
  const common = useTranslations("common");
  const { number } = useFormat();
  const user = useSessionUser();
  const isManager = !!user && user.role !== "AGENT";
  const [period, setPeriod] = useState<Period>("12m");
  const [picked, setPicked] = useState<string | null>(null);
  const range = useMemo(() => periodRange(period), [period]);

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["reports", range.from, range.to],
    queryFn: () => getReport(requireToken(), range.from, range.to),
    enabled: isManager,
    placeholderData: (previous) => previous,
  });
  const { data: agency } = useQuery({
    queryKey: ["agency"],
    queryFn: () => getAgency(requireToken()),
    enabled: isManager,
    staleTime: 5 * 60_000,
  });

  // Money is never added across currencies: one at a time, the agency's own first.
  const currencies = Object.keys(data?.money ?? {});
  const fallback = agency && currencies.includes(agency.currency) ? agency.currency : (currencies[0] ?? agency?.currency ?? "USD");
  const currency = picked && currencies.includes(picked) ? picked : fallback;
  const rows = data?.money[currency] ?? [];
  const totals = moneyTotals(rows);
  const occupancy = data ? overallOccupancy(data.occupancy) : null;
  const percent = (value: number | null) => (value == null ? "—" : number(value, { style: "percent", maximumFractionDigits: 0 }));
  // The currency small beside the figure, so a long amount stays on one line.
  const amount = (value: number) => (
    <>
      <span className="mr-1.5 text-base font-medium tracking-normal text-muted-foreground">{currency}</span>
      {number(value, { maximumFractionDigits: 0 })}
    </>
  );

  if (user && !isManager) {
    return (
      <div className="flex max-w-xl flex-col items-start gap-3 rounded-3xl bg-card p-6 ring-1 ring-foreground/5">
        <h1 className="font-display text-2xl">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("managersOnly")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="sr-only">{t("title")}</h1>

      <div className="flex flex-wrap items-center gap-3">
        <Segmented
          contained
          label={t("period")}
          value={period}
          onChange={setPeriod}
          options={PERIODS.map((value) => ({ value, label: t(`periods.${value}`) }))}
        />
        {currencies.length > 1 && (
          <Segmented
            contained
            label={t("currency")}
            value={currency}
            onChange={setPicked}
            options={currencies.map((code) => ({ value: code, label: code }))}
          />
        )}
        <div className="ml-auto">
          <HelpLink section="reportes" label={t("help")} />
        </div>
      </div>

      {error && (
        <div className="flex flex-col items-start gap-4 rounded-2xl bg-card p-6 ring-1 ring-foreground/5">
          <div>
            <p className="font-display text-xl">{t("loadFailed")}</p>
            <p className="text-sm text-muted-foreground">
              {error instanceof ApiError ? error.message : common("checkConnection")}
            </p>
          </div>
          <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
            <RotateCcw />
            {common("retry")}
          </Button>
        </div>
      )}

      {(isLoading || !user) && (
        <div className="flex animate-pulse flex-col gap-6" aria-hidden>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className="h-28 rounded-3xl bg-muted" />
            ))}
          </div>
          <div className="h-80 rounded-3xl bg-muted" />
        </div>
      )}

      {data && (
        <div className={isFetching ? "opacity-60 transition-opacity" : "transition-opacity"}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <StatTile label={t("kpi.booked")} value={amount(totals.booked)} hint={t("kpi.bookedHint", { count: totals.bookings })} />
              <StatTile label={t("kpi.collected")} value={amount(totals.collected)} hint={t("kpi.collectedHint")} />
              <StatTile label={t("kpi.commission")} value={amount(totals.commission)} hint={t("kpi.commissionHint")} />
              <StatTile label={t("kpi.occupancy")} value={percent(occupancy)} hint={t("kpi.occupancyHint")} />
              <StatTile
                label={t("kpi.conversion")}
                value={percent(data.conversion.rate)}
                hint={t("kpi.conversionHint", { booked: data.conversion.booked, clients: data.conversion.clients })}
              />
            </div>

            {totals.booked === 0 && totals.collected === 0 && data.conversion.inquiries === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-3xl bg-card px-6 py-14 text-center ring-1 ring-foreground/5">
                <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
                  <ChartColumn className="size-6" />
                </span>
                <p className="font-display text-2xl">{t("emptyTitle")}</p>
                <p className="max-w-md text-sm text-muted-foreground">{t("emptyBody")}</p>
              </div>
            ) : (
              <MonthlyMoney rows={rows} currency={currency} />
            )}

            <div className="grid items-start gap-6 lg:grid-cols-2">
              <OccupancyList rows={data.occupancy} />
              <ConversionFunnel data={data.conversion} />
            </div>

            <TeamTable rows={data.team} currency={currency} />
          </div>
        </div>
      )}
    </div>
  );
}
