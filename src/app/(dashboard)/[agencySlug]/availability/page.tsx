"use client";

import { useQuery } from "@tanstack/react-query";
import { Link as LinkIcon, RotateCcw } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import { AvailabilityCalendarView } from "@/components/availability/availability-calendar-view";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/client";
import { getAvailabilityCalendar } from "@/lib/api/availability";
import { getAccessToken } from "@/lib/auth/session";
import { getPublicOrigin } from "@/lib/public-origin";
import { availabilityPath } from "@/lib/seo";

function requireToken() {
  const token = getAccessToken();
  if (!token) throw new ApiError("No autenticado", 401);
  return token;
}

export default function AvailabilityCalendarPage() {
  const { agencySlug } = useParams<{ agencySlug: string }>();

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
            Los próximos 90 días de tus propiedades en alquiler, todas juntas.
          </p>
        </div>
        <Button variant="outline" className="gap-2" onClick={copyLink}>
          <LinkIcon />
          Copiar link para compartir
        </Button>
      </div>

      {error && (
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

      {isLoading && <div className="h-96 animate-pulse rounded-2xl bg-muted" />}

      {data && data.properties.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-3xl bg-card px-6 py-16 text-center ring-1 ring-foreground/5">
          <p className="font-display text-2xl">Todavía no tenés propiedades en alquiler</p>
          <p className="text-sm text-muted-foreground">
            En cuanto cargues una, su disponibilidad aparece acá.
          </p>
        </div>
      )}

      {data && data.properties.length > 0 && (
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
