"use client";

import { useQuery } from "@tanstack/react-query";
import { Link as LinkIcon, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { AvailabilityCalendarView } from "@/components/availability/availability-calendar-view";
import { AvailabilityMonthView } from "@/components/availability/availability-month-view";
import { HelpLink } from "@/components/docs/help-link";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ApiError } from "@/lib/api/client";
import { getAvailabilityCalendar } from "@/lib/api/availability";
import { useAgencySitePath } from "@/lib/agency-site";
import { getAccessToken } from "@/lib/auth/session";
import { getPublicOrigin } from "@/lib/public-origin";
import { availabilityPath } from "@/lib/seo";

type View = "grid" | "month";

const VIEWS: View[] = ["grid", "month"];

function requireToken() {
  const token = getAccessToken();
  if (!token) throw new ApiError("No autenticado", 401);
  return token;
}

export default function AvailabilityCalendarPage() {
  const t = useTranslations("availability.page");
  const tc = useTranslations("common");
  const sitePath = useAgencySitePath();
  const { agencySlug } = useParams<{ agencySlug: string }>();
  const [view, setView] = useState<View>("grid");

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["availability-calendar"],
    queryFn: () => getAvailabilityCalendar(requireToken()),
  });

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`${getPublicOrigin()}${sitePath(availabilityPath(agencySlug))}`);
      toast.success(tc("linkCopied"));
    } catch {
      toast.error(tc("linkCopyFailed"));
    }
  }

  // Switches between the 90-day grid and the month; each view puts it at the end of its own filters.
  const viewControl = (
    <Select value={view} onValueChange={(next) => setView(next as View)}>
      <SelectTrigger aria-label={t("view")} className="h-10 w-full sm:w-44">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {VIEWS.map((item) => (
          <SelectItem key={item} value={item}>
            {t(`views.${item}`)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl leading-none">{t("title")}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {view === "grid"
              ? t("gridLead")
              : t("monthLead")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <HelpLink section="disponibilidad" label={t("help")} />
          <Button variant="outline" className="gap-2" onClick={copyLink}>
            <LinkIcon />
            {t("copyLink")}
          </Button>
        </div>
      </div>

      {view === "month" && <AvailabilityMonthView viewControl={viewControl} />}

      {view === "grid" && error && (
        <div className="flex flex-col items-start gap-4 rounded-2xl bg-card p-6 ring-1 ring-foreground/5">
          <div>
            <p className="font-display text-xl">{t("loadFailed")}</p>
            <p className="text-sm text-muted-foreground">
              {error instanceof ApiError ? error.message : tc("checkConnection")}
            </p>
          </div>
          <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
            <RotateCcw />
            {tc("retry")}
          </Button>
        </div>
      )}

      {view === "grid" && isLoading && <div className="h-96 animate-pulse rounded-2xl bg-muted" />}

      {view === "grid" && data && data.properties.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-3xl bg-card px-6 py-16 text-center ring-1 ring-foreground/5">
          <p className="font-display text-2xl">{t("empty.title")}</p>
          <p className="text-sm text-muted-foreground">{t("empty.body")}</p>
        </div>
      )}

      {view === "grid" && data && data.properties.length > 0 && (
        <AvailabilityCalendarView
          viewControl={viewControl}
          from={data.from}
          to={data.to}
          properties={data.properties.map((property) => ({
            ...property,
            href: `/${agencySlug}/properties/${property.id}`,
          }))}
        />
      )}
    </div>
  );
}
