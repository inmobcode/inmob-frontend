"use client";

import { useQuery } from "@tanstack/react-query";
import { Building2, RotateCcw, Search, SearchX } from "lucide-react";
import { useMemo, useRef, useState } from "react";

import { CreatePropertyDialog } from "@/components/properties/create-property-dialog";
import { FiltersSheet } from "@/components/properties/filters-sheet";
import { PropertyCard, PropertyCardSkeleton } from "@/components/properties/property-card";
import { Segmented } from "@/components/properties/segmented";
import { StatusSelect } from "@/components/properties/status-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api/client";
import { listProperties } from "@/lib/api/properties";
import { getAccessToken } from "@/lib/auth/session";
import { Flip, gsap, useGSAP } from "@/lib/gsap";
import { distance, duration, ease, media, stagger } from "@/lib/motion";
import { applyFilters, countActiveFilters, DEFAULT_FILTERS, type PropertyFilters } from "@/lib/property-filters";

const TYPE_TABS: { value: PropertyFilters["type"]; label: string }[] = [
  { value: "ALL", label: "Todo" },
  { value: "SALE", label: "Venta" },
  { value: "RENT", label: "Alquiler" },
];

export default function PropertiesPage() {
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["properties"],
    queryFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return listProperties(token);
    },
  });

  const [filters, setFilters] = useState<PropertyFilters>(DEFAULT_FILTERS);

  const gridRef = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const entered = useRef(false);

  const sorted = useMemo(
    () =>
      [...(data ?? [])].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      ),
    [data],
  );

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: sorted.length };
    for (const property of sorted) counts[property.status] = (counts[property.status] ?? 0) + 1;
    return counts;
  }, [sorted]);

  const filtered = useMemo(() => applyFilters(sorted, filters), [sorted, filters]);

  // Snapshot the cards before a filter change so Flip can glide them to
  // their new positions once React has re-rendered.
  function captureLayout() {
    if (gridRef.current) {
      flipState.current = Flip.getState(gridRef.current.querySelectorAll(".property-card"));
    }
  }

  const visibleKey = filtered.map((property) => property.id).join(",");

  useGSAP(
    () => {
      const grid = gridRef.current;
      if (!grid || filtered.length === 0) return;
      const mm = gsap.matchMedia();
      mm.add(media.allowMotion, () => {
        const cards = grid.querySelectorAll(".property-card");
        if (!entered.current) {
          entered.current = true;
          gsap.from(cards, {
            opacity: 0,
            y: distance.md,
            duration: duration.macro,
            ease: ease.out,
            stagger: stagger.tight,
          });
        } else if (flipState.current) {
          Flip.from(flipState.current, {
            targets: cards,
            duration: duration.macro,
            ease: ease.inOut,
            onEnter: (entering) =>
              gsap.fromTo(
                entering,
                { opacity: 0, scale: 0.94 },
                { opacity: 1, scale: 1, duration: duration.base, ease: ease.out },
              ),
          });
        }
        flipState.current = null;
      });
      return () => mm.revert();
    },
    { scope: gridRef, dependencies: [visibleKey, isLoading] },
  );

  const hasFilters = countActiveFilters(filters) > 0 || filters.search.trim() !== "";
  const total = sorted.length;

  function clearFilters() {
    captureLayout();
    setFilters(DEFAULT_FILTERS);
  }

  function updateFilters(patch: Partial<PropertyFilters>) {
    captureLayout();
    setFilters((current) => ({ ...current, ...patch }));
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="sr-only">Propiedades</h1>

      {!(data && total === 0) && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-3">
          {total > 0 && (
            <div className="flex w-full items-center gap-2 sm:max-w-md sm:min-w-64 sm:flex-1">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={filters.search}
                  onChange={(event) => updateFilters({ search: event.target.value })}
                  placeholder="Buscar por título, zona o propietario"
                  aria-label="Buscar propiedades"
                  className="h-10 rounded-full border-transparent bg-foreground/[0.07] pl-10 transition-[background-color,box-shadow,border-color] duration-500 ease-out focus-visible:border-primary/20 focus-visible:bg-card focus-visible:shadow-[0_8px_24px_-12px_oklch(0.3_0.05_160/0.3)] focus-visible:ring-0 dark:bg-foreground/10 dark:focus-visible:bg-card"
                />
              </div>
              <FiltersSheet
                properties={sorted}
                value={filters}
                onApply={(next) => {
                  captureLayout();
                  setFilters(next);
                }}
              />
            </div>
          )}
          <div className="flex flex-wrap items-center gap-3 sm:ml-auto">
            {total > 0 && (
              <>
                <Segmented
                  contained
                  label="Filtrar por tipo"
                  value={filters.type}
                  options={TYPE_TABS}
                  onChange={(type) => updateFilters({ type })}
                />
                <StatusSelect
                  value={filters.status}
                  counts={statusCounts}
                  onChange={(status) => updateFilters({ status })}
                />
              </>
            )}
            <CreatePropertyDialog />
          </div>
        </div>
      )}

      {error && (
        <div className="flex flex-col items-start gap-4 rounded-2xl bg-card p-6 ring-1 ring-foreground/5">
          <div>
            <p className="font-display text-xl">No pudimos cargar las propiedades</p>
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
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-6">
          {Array.from({ length: 6 }, (_, index) => (
            <PropertyCardSkeleton key={index} />
          ))}
        </div>
      )}

      {data && total === 0 && (
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-card px-6 py-16 text-center ring-1 ring-foreground/5">
          <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
            <Building2 className="size-6" />
          </span>
          <div className="flex max-w-sm flex-col gap-1">
            <p className="font-display text-2xl">Cargá tu primera propiedad</p>
            <p className="text-sm text-muted-foreground">
              Sumá fotos, precio y características para tenerla lista cuando quieras publicarla.
            </p>
          </div>
          <CreatePropertyDialog />
        </div>
      )}

      {data && total > 0 && filtered.length === 0 && (
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-card px-6 py-16 text-center ring-1 ring-foreground/5">
          <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
            <SearchX className="size-6" />
          </span>
          <div className="flex max-w-sm flex-col gap-1">
            <p className="font-display text-2xl">Nada coincide con esos filtros</p>
            <p className="text-sm text-muted-foreground">
              Probá con otra zona o quitá algún filtro para ver más propiedades.
            </p>
          </div>
          {hasFilters && (
            <Button variant="outline" onClick={clearFilters}>
              Quitar filtros
            </Button>
          )}
        </div>
      )}

      {filtered.length > 0 && (
        <div
          ref={gridRef}
          className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-6"
        >
          {filtered.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
