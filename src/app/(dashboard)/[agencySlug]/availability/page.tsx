"use client";

import { useQuery } from "@tanstack/react-query";
import { Link as LinkIcon, RotateCcw } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { AvailabilityCalendarView } from "@/components/availability/availability-calendar-view";
import { AvailabilityMonthView } from "@/components/availability/availability-month-view";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/client";
import { getAvailabilityCalendar } from "@/lib/api/availability";
import { getAccessToken } from "@/lib/auth/session";
import { getPublicOrigin } from "@/lib/public-origin";
import { availabilityPath } from "@/lib/seo";
import { cn } from "@/lib/utils";

type View = "grid" | "month";

const VIEWS: { value: View; label: string }[] = [
  { value: "grid", label: "Próximos 90 días" },
  { value: "month", label: "Mensual" },
];

function requireToken() {
  const token = getAccessToken();
  if (!token) throw new ApiError("No autenticado", 401);
  return token;
}

export default function AvailabilityCalendarPage() {
  const { agencySlug } = useParams<{ agencySlug: string }>();
  const [view, setView] = useState<View>("grid");

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["availability-calendar"],
    queryFn: () => getAvailabilityCalendar(requireToken()),
  });

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`${getPublicOrigin()}${availabilityPath(agencySlug)}`);
      toast.success("Link copiado");
    } catch {
      toast.error("No se pudo copiar el link");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl leading-none">Disponibilidad</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {view === "grid"
              ? "Los próximos 90 días de tus propiedades en alquiler, todas juntas."
              : "Un mes a la vez: cuántas propiedades están ocupadas cada día, y bloqueo de fechas."}
          </p>
        </div>
        <Button variant="outline" className="gap-2" onClick={copyLink}>
          <LinkIcon />
          Copiar link para compartir
        </Button>
      </div>

      <div role="group" aria-label="Cambiar la vista" className="flex w-fit gap-0.5 rounded-full bg-foreground/[0.06] p-1">
        {VIEWS.map((item) => (
          <button
            key={item.value}
            type="button"
            aria-pressed={view === item.value}
            onClick={() => setView(item.value)}
            className={cn(
              "h-8 rounded-full px-4 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              view === item.value ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {view === "month" && <AvailabilityMonthView />}

      {view === "grid" && error && (
        <div className="flex flex-col items-start gap-4 rounded-2xl bg-card p-6 ring-1 ring-foreground/5">
          <div>
            <p className="font-display text-xl">No pudimos cargar la disponibilidad</p>
            <p className="text-sm text-muted-foreground">
              {error instanceof ApiError ? error.message : "Revisá tu conexión e intentá de nuevo."}
            </p>
          </div>
          <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
            <RotateCcw />
            Reintentar
          </Button>
        </div>
      )}

      {view === "grid" && isLoading && <div className="h-96 animate-pulse rounded-2xl bg-muted" />}

      {view === "grid" && data && data.properties.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-3xl bg-card px-6 py-16 text-center ring-1 ring-foreground/5">
          <p className="font-display text-2xl">Todavía no tenés propiedades en alquiler</p>
          <p className="text-sm text-muted-foreground">
            En cuanto cargues una, su disponibilidad aparece acá.
          </p>
        </div>
      )}

      {view === "grid" && data && data.properties.length > 0 && (
        <AvailabilityCalendarView
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
