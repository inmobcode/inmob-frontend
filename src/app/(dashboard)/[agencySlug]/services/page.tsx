"use client";

import { useQuery } from "@tanstack/react-query";
import { MapPin, RotateCcw, Search, SearchX, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

import { FilterMenu } from "@/components/filter-menu";
import { NewItemButton } from "@/components/new-item-button";
import { ServiceDialog } from "@/components/services/service-dialog";
import { ServiceTypeIcon } from "@/components/services/service-type-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api/client";
import { listServices, type Service, type ServiceType } from "@/lib/api/services";
import { getAccessToken } from "@/lib/auth/session";
import { SERVICE_TYPE_LABELS, SERVICE_TYPES, formatMoney, unitPer } from "@/lib/service-labels";
import { cn } from "@/lib/utils";

function requireToken() {
  const token = getAccessToken();
  if (!token) throw new ApiError("No autenticado", 401);
  return token;
}

const TYPE_OPTIONS = SERVICE_TYPES.map((type) => ({ value: type.value, label: type.label }));

function ServiceCard({ service, onOpen }: { service: Service; onOpen: () => void }) {
  const per = unitPer(service.unit);
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex flex-col overflow-hidden rounded-3xl bg-card text-left shadow-[0_1px_2px_oklch(0.3_0.05_160/0.04),0_12px_32px_-12px_oklch(0.3_0.05_160/0.14)] ring-1 ring-foreground/5 transition-shadow outline-none hover:shadow-[0_1px_2px_oklch(0.3_0.05_160/0.06),0_18px_40px_-14px_oklch(0.3_0.05_160/0.22)] focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
        {service.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={service.imageUrl}
            alt=""
            className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-primary/40">
            <ServiceTypeIcon type={service.type} className="size-10" strokeWidth={1.25} />
          </div>
        )}
        {!service.active && (
          <span className="absolute top-3 left-3 rounded-full bg-background/95 px-2.5 py-1 text-xs font-medium text-muted-foreground">
            No disponible
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-5">
        <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          <ServiceTypeIcon type={service.type} className="size-3.5" />
          {SERVICE_TYPE_LABELS[service.type]}
        </span>
        <span className="font-display text-xl leading-snug">{service.name}</span>
        {service.zones.length > 0 && (
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" />
            <span className="truncate">{service.zones.join(", ")}</span>
          </span>
        )}
        <span className="mt-auto pt-3 tabular-nums">
          {service.price != null ? (
            <>
              <span className="font-semibold">{formatMoney(service.currency, service.price)}</span>
              {per && <span className="text-muted-foreground"> {per}</span>}
            </>
          ) : (
            <span className="text-muted-foreground">Precio a consultar</span>
          )}
        </span>
      </div>
    </button>
  );
}

export default function ServicesPage() {
  const [types, setTypes] = useState<ServiceType[]>([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Service | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogKey, setDialogKey] = useState(0);

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["services"],
    queryFn: () => listServices(requireToken()),
  });

  const counts = useMemo(() => {
    const result: Record<string, number> = { ALL: data?.length ?? 0 };
    for (const service of data ?? []) result[service.type] = (result[service.type] ?? 0) + 1;
    return result;
  }, [data]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (data ?? []).filter((service) => {
      if (types.length > 0 && !types.includes(service.type)) return false;
      if (!term) return true;
      return [service.name, service.provider, ...service.zones].filter(Boolean).join(" ").toLowerCase().includes(term);
    });
  }, [data, types, search]);

  function open(service: Service | null) {
    setEditing(service);
    setDialogKey((key) => key + 1);
    setDialogOpen(true);
  }

  const total = data?.length ?? 0;
  const newButton = <NewItemButton label="Nuevo servicio" onClick={() => open(null)} />;

  return (
    <div className="flex flex-col gap-8">
      <h1 className="sr-only">Servicios</h1>

      {!(data && total === 0) && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-3">
          {total > 0 && (
            <div className="relative w-full sm:max-w-md sm:min-w-64 sm:flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por nombre, zona o proveedor"
                aria-label="Buscar servicios"
                className="h-10 rounded-full border-transparent bg-foreground/[0.07] pl-10 focus-visible:border-primary/20 focus-visible:bg-card focus-visible:ring-0 dark:bg-foreground/10"
              />
            </div>
          )}
          <div className="flex flex-wrap items-center gap-3 sm:ml-auto">
            {total > 0 && (
              <FilterMenu
                name="Tipo"
                plural="tipos"
                options={TYPE_OPTIONS}
                value={types}
                onChange={setTypes}
                counts={counts}
              />
            )}
            {newButton}
          </div>
        </div>
      )}

      {error && (
        <div className="flex flex-col items-start gap-4 rounded-2xl bg-card p-6 ring-1 ring-foreground/5">
          <div>
            <p className="font-display text-xl">No pudimos cargar los servicios</p>
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

      {isLoading && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,280px),1fr))] gap-6">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="h-80 animate-pulse rounded-3xl bg-muted" />
          ))}
        </div>
      )}

      {data && total === 0 && (
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-card px-6 py-16 text-center ring-1 ring-foreground/5">
          <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
            <Sparkles className="size-6" />
          </span>
          <div className="flex max-w-sm flex-col gap-1">
            <p className="font-display text-2xl">Armá tu librería de servicios</p>
            <p className="text-sm text-muted-foreground">
              Mayordomo, chef, yate, traslados, excursiones… Cargalos una vez y sumalos a las ofertas que mandás.
            </p>
          </div>
          {newButton}
        </div>
      )}

      {data && total > 0 && filtered.length === 0 && (
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-card px-6 py-16 text-center ring-1 ring-foreground/5">
          <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
            <SearchX className="size-6" />
          </span>
          <p className="font-display text-2xl">Ningún servicio coincide</p>
          <Button
            variant="outline"
            onClick={() => {
              setTypes([]);
              setSearch("");
            }}
          >
            Limpiar filtros
          </Button>
        </div>
      )}

      {filtered.length > 0 && (
        <div className={cn("grid grid-cols-[repeat(auto-fill,minmax(min(100%,280px),1fr))] gap-6")}>
          {filtered.map((service) => (
            <ServiceCard key={service.id} service={service} onOpen={() => open(service)} />
          ))}
        </div>
      )}

      <ServiceDialog key={dialogKey} open={dialogOpen} onOpenChange={setDialogOpen} service={editing} />
    </div>
  );
}
