"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, RotateCcw, Search, SearchX } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useMemo, useRef, useState } from "react";

import { CreatePropertyDialog } from "@/components/properties/create-property-dialog";
import { ActiveFilters } from "@/components/properties/active-filters";
import { FiltersSheet } from "@/components/properties/filters-sheet";
import { PropertyCard, PropertyCardSkeleton } from "@/components/properties/property-card";
import { BulkBar } from "@/components/properties/bulk-bar";
import type { PropertyActions } from "@/components/properties/property-controls";
import { PropertiesTable, PropertyRow } from "@/components/properties/property-views";
import { PropertiesPagination } from "@/components/properties/properties-pagination";
import { ViewSwitch, type ViewMode } from "@/components/properties/view-switch";
import { Segmented } from "@/components/properties/segmented";
import { StatusSelect } from "@/components/properties/status-select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api/client";
import {
  archiveProperty,
  deleteProperty,
  listProperties,
  publishProperty,
  unpublishProperty,
} from "@/lib/api/properties";
import { getAccessToken } from "@/lib/auth/session";
import { Flip, gsap, useGSAP } from "@/lib/gsap";
import { distance, duration, ease, media, rowStagger } from "@/lib/motion";
import { applyFilters, countActiveFilters, DEFAULT_FILTERS, type PropertyFilters } from "@/lib/property-filters";

const PAGE_SIZE = 25;

const TYPE_TABS: { value: PropertyFilters["type"]; label: string }[] = [
  { value: "ALL", label: "Todo" },
  { value: "SALE", label: "Venta" },
  { value: "RENT", label: "Alquiler" },
];

const SEARCH_CLASS =
  "h-10 rounded-full border-transparent bg-foreground/[0.07] pl-10 transition-[background-color,box-shadow,border-color] duration-500 ease-out focus-visible:border-primary/20 focus-visible:bg-card focus-visible:shadow-[0_8px_24px_-12px_oklch(0.3_0.05_160/0.3)] focus-visible:ring-0 dark:bg-foreground/10 dark:focus-visible:bg-card";

function SearchField({ value, onChange, className }: { value: string; onChange: (value: string) => void; className?: string }) {
  return (
    <div className={`relative ${className ?? ""}`}>
      <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Buscar por título, zona o propietario"
        aria-label="Buscar propiedades"
        className={SEARCH_CLASS}
      />
    </div>
  );
}

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
  const queryClient = useQueryClient();
  const [view, setView] = useState<ViewMode>("table");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState<string[] | null>(null);

  // Remembered per browser. Read after mount so the server and client first render match.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("properties-view");
      if (saved === "list" || saved === "grid") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setView(saved);
      }
    } catch {}
  }, []);

  function changeView(next: ViewMode) {
    if (next === view) return;
    flipState.current = null;
    entered.current = false; // the new layout enters like a fresh page instead of morphing
    setView(next);
    try {
      window.localStorage.setItem("properties-view", next);
    } catch {}
  }

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

  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const paged = useMemo(
    () => filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [filtered, safePage],
  );

  function goToPage(next: number) {
    captureLayout();
    setPage(next);
  }

  // Snapshot the cards before a filter change so Flip can glide them to
  // their new positions once React has re-rendered.
  function captureLayout() {
    if (gridRef.current) {
      flipState.current = Flip.getState(gridRef.current.querySelectorAll(".property-card"));
    }
  }

  const visibleKey = paged.map((property) => property.id).join(",");

  // Only what is on screen counts as selected, so a filter never hides a selection that still acts.
  const selectedIds = filtered.filter((property) => selected.has(property.id)).map((property) => property.id);
  const selectedSet = new Set(selectedIds);

  function toggleOne(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAllVisible() {
    setSelected(new Set(filtered.map((property) => property.id)));
  }

  function toggleAllVisible() {
    if (selectedIds.length === filtered.length) setSelected(new Set());
    else selectAllVisible();
  }

  const bulkMutation = useMutation({
    mutationFn: async ({
      action,
      ids,
    }: {
      action: "publish" | "unpublish" | "archive" | "delete";
      ids: string[];
    }) => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      const run = {
        publish: publishProperty,
        unpublish: unpublishProperty,
        archive: archiveProperty,
        delete: deleteProperty,
      }[action];
      const results = await Promise.allSettled(ids.map((id) => run(token, id)));
      return {
        ok: results.filter((result) => result.status === "fulfilled").length,
        failed: results.filter((result) => result.status === "rejected").length,
      };
    },
    onSuccess: ({ ok, failed }, { action, ids }) => {
      const noun = ok === 1 ? "propiedad" : "propiedades";
      const done = {
        publish: "publicada",
        unpublish: "despublicada",
        archive: "archivada",
        delete: "eliminada",
      }[action];
      if (ok > 0) toast.success(`${ok} ${noun} ${done}${ok === 1 ? "" : "s"}`);
      if (failed > 0) toast.error(`No se pudieron procesar ${failed}. Intentá de nuevo.`);
      setSelected((current) => {
        const next = new Set(current);
        for (const id of ids) next.delete(id);
        return next;
      });
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "No se pudo completar la acción"),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["properties"] }),
  });

  const actions: PropertyActions = {
    publish: (ids) => bulkMutation.mutate({ action: "publish", ids }),
    unpublish: (ids) => bulkMutation.mutate({ action: "unpublish", ids }),
    archive: (ids) => bulkMutation.mutate({ action: "archive", ids }),
    requestDelete: (ids) => setDeleting(ids),
  };

  // Escape clears the selection.
  useEffect(() => {
    if (selected.size === 0) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !deleting) setSelected(new Set());
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected.size, deleting]);

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
            stagger: rowStagger,
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
    { scope: gridRef, dependencies: [visibleKey, isLoading, view] },
  );

  // When the toolbar has scrolled out of view, a compact search + filters bar
  // takes its place at the top, so you can keep searching without scrolling back.
  const total = sorted.length;
  const toolbarRef = useRef<HTMLDivElement>(null);
  const compactRef = useRef<HTMLDivElement>(null);
  const [toolbarGone, setToolbarGone] = useState(false);
  const hasToolbar = total > 0;

  useEffect(() => {
    const element = toolbarRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setToolbarGone(!entry.isIntersecting && entry.boundingClientRect.bottom < 0),
      { threshold: 0 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [hasToolbar]);

  useGSAP(
    () => {
      const bar = compactRef.current;
      if (!bar) return;
      const reduce = window.matchMedia(media.reduceMotion).matches;
      gsap.to(bar, {
        autoAlpha: toolbarGone ? 1 : 0,
        y: toolbarGone ? 0 : -distance.md,
        duration: reduce ? 0 : duration.base,
        ease: toolbarGone ? ease.out : ease.in,
        overwrite: true,
      });
    },
    { dependencies: [toolbarGone] },
  );

  const hasFilters = countActiveFilters(filters) > 0 || filters.search.trim() !== "";

  function clearFilters() {
    captureLayout();
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  }

  function updateFilters(patch: Partial<PropertyFilters>) {
    captureLayout();
    setFilters((current) => ({ ...current, ...patch }));
    setPage(1);
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="sr-only">Propiedades</h1>

      {/* Compact bar: zero height, so it never moves the page, and hidden until the toolbar is gone. */}
      {hasToolbar && (
        <div className="pointer-events-none sticky top-[5.5rem] z-30 -mb-8 h-0 md:top-8">
          <div
            ref={compactRef}
            aria-hidden={!toolbarGone}
            inert={!toolbarGone}
            style={{ opacity: 0, visibility: "hidden", transform: "translateY(-24px)" }}
            className="pointer-events-auto mx-auto flex w-full max-w-xl items-center gap-2 rounded-full bg-card/30 p-1.5 shadow-[inset_0_1px_0_oklch(1_0_0/0.7),0_16px_40px_-12px_oklch(0.3_0.05_160/0.35)] ring-1 ring-foreground/[0.07] backdrop-blur-xl backdrop-saturate-200"
          >
            <SearchField className="flex-1" value={filters.search} onChange={(search) => updateFilters({ search })} />
            <FiltersSheet
              properties={sorted}
              value={filters}
              onApply={(next) => {
                captureLayout();
                setFilters(next);
                setPage(1);
              }}
            />
          </div>
        </div>
      )}

      {!(data && total === 0) && (
        <div ref={toolbarRef} className="flex flex-wrap items-center gap-x-3 gap-y-3">
          {total > 0 && (
            <div className="flex w-full items-center gap-2 sm:max-w-xl sm:min-w-72 sm:flex-1">
              <SearchField
                className="flex-1"
                value={filters.search}
                onChange={(search) => updateFilters({ search })}
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
                <FiltersSheet
                  properties={sorted}
                  value={filters}
                  onApply={(next) => {
                    captureLayout();
                    setFilters(next);
                    setPage(1);
                  }}
                />
                <ViewSwitch value={view} onChange={changeView} />
              </>
            )}
            <CreatePropertyDialog />
          </div>
        </div>
      )}

      {total > 0 && (
        <ActiveFilters
          filters={filters}
          properties={sorted}
          onChange={updateFilters}
          onClear={() => {
            captureLayout();
            setFilters((current) => ({ ...DEFAULT_FILTERS, search: current.search }));
            setPage(1);
          }}
        />
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

      {paged.length > 0 && view === "grid" && (
        <div
          ref={gridRef}
          className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-6"
        >
          {paged.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              actions={actions}
              selected={selectedSet.has(property.id)}
              selecting={selectedIds.length > 0}
              onToggle={() => toggleOne(property.id)}
            />
          ))}
        </div>
      )}

      {paged.length > 0 && view === "list" && (
        <div ref={gridRef} className="flex flex-col gap-4">
          {paged.map((property) => (
            <PropertyRow
              key={property.id}
              property={property}
              actions={actions}
              selected={selectedSet.has(property.id)}
              selecting={selectedIds.length > 0}
              onToggle={() => toggleOne(property.id)}
            />
          ))}
        </div>
      )}

      {paged.length > 0 && view === "table" && (
        <div ref={gridRef}>
          <PropertiesTable
            properties={paged}
            actions={actions}
            selectedIds={selectedSet}
            onToggle={toggleOne}
            onToggleAll={toggleAllVisible}
          />
        </div>
      )}

      {paged.length > 0 && <PropertiesPagination page={safePage} pageCount={pageCount} onChange={goToPage} />}

      {selectedIds.length > 0 && (
        <BulkBar
          ids={selectedIds}
          total={filtered.length}
          actions={actions}
          onSelectAll={selectAllVisible}
          onClear={() => setSelected(new Set())}
        />
      )}

      <AlertDialog open={deleting != null} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-2xl">
              {deleting?.length === 1 ? "¿Eliminar esta propiedad?" : `¿Eliminar ${deleting?.length ?? 0} propiedades?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Se borran para siempre, junto con sus fotos y su información. Si solo querés sacarlas del portal, mejor
              archivalas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (deleting) bulkMutation.mutate({ action: "delete", ids: deleting });
                setDeleting(null);
              }}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
