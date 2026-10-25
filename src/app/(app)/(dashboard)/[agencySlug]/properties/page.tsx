"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RotateCcw, Search, SearchX } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useMemo, useRef, useState } from "react";

import { ImportLink } from "@/components/import/import-link";
import { OnboardingChecklist } from "@/components/welcome/onboarding-checklist";
import { PropertiesEmpty } from "@/components/properties/properties-empty";
import { CreatePropertyDialog } from "@/components/properties/create-property-dialog";
import { HelpLink } from "@/components/docs/help-link";
import { TrashLink } from "@/components/trash/trash-link";
import { ActiveFilters } from "@/components/properties/active-filters";
import { FiltersSheet } from "@/components/properties/filters-sheet";
import { PropertyCard, PropertyCardSkeleton } from "@/components/properties/property-card";
import { BulkBar } from "@/components/properties/bulk-bar";
import type { PropertyActions } from "@/components/properties/property-controls";
import { PropertiesTable, PropertyRow } from "@/components/properties/property-views";
import { PropertiesPagination } from "@/components/properties/properties-pagination";
import { ViewSwitch, type ViewMode } from "@/components/properties/view-switch";
import { SortSelect } from "@/components/properties/sort-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api/client";
import {
  archiveProperty,
  deleteProperty,
  listProperties,
  listTrashedProperties,
  restoreProperty,
  publishProperty,
  unpublishProperty,
} from "@/lib/api/properties";
import { getAccessToken } from "@/lib/auth/session";
import { gsap, useGSAP } from "@/lib/gsap";
import { Flip } from "@/lib/gsap-flip";
import { distance, duration, ease, media, rowStagger } from "@/lib/motion";
import { applyFilters, countActiveFilters, DEFAULT_FILTERS, type PropertyFilters } from "@/lib/property-filters";
import { DEFAULT_SORT, sortProperties, type SortValue } from "@/lib/property-sort";

const PAGE_SIZE = 25;

const SEARCH_CLASS =
  "h-10 rounded-full border-transparent bg-foreground/[0.07] pl-10 transition-[background-color,box-shadow,border-color] duration-500 ease-out focus-visible:border-primary/20 focus-visible:bg-card focus-visible:shadow-[0_8px_24px_-12px_oklch(0.3_0.05_160/0.3)] focus-visible:ring-0 dark:bg-foreground/10 dark:focus-visible:bg-card";

function SearchField({
  value,
  onChange,
  className,
  main = false,
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  /** The toolbar's field, the one the "/" shortcut focuses (not the compact bar's copy). */
  main?: boolean;
}) {
  const t = useTranslations("properties.page");
  return (
    <div className={`relative ${className ?? ""}`}>
      <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={t("searchPlaceholder")}
        aria-label={t("search")}
        data-list-search={main || undefined}
        className={SEARCH_CLASS}
      />
    </div>
  );
}

export default function PropertiesPage() {
  const t = useTranslations("properties.page");
  const tc = useTranslations("common");
  const { agencySlug } = useParams<{ agencySlug: string }>();
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["properties"],
    queryFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return listProperties(token);
    },
  });

  const [filters, setFilters] = useState<PropertyFilters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortValue>(DEFAULT_SORT);

  const gridRef = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const entered = useRef(false);
  const queryClient = useQueryClient();
  const [view, setView] = useState<ViewMode>("table");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Remembered per browser. Read after mount so the server and client first render match.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("properties-view");
      if (saved === "list" || saved === "grid") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setView(saved);
      }
    } catch {}
    // Deep link from the importer: «Revisar los borradores».
    if (new URLSearchParams(window.location.search).get("status") === "DRAFT") {
      setFilters((current) => ({ ...current, status: ["DRAFT"] }));
    }
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

  const sorted = useMemo(() => sortProperties(data ?? [], sort), [data, sort]);

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
      if (ok > 0 && action === "delete") {
        // Deleting moves them to the trash, so it needs no confirmation: the toast can undo it.
        toast.success(t("bulk.delete", { count: ok }), {
          action: {
            label: tc("undo"),
            onClick: () => {
              const token = getAccessToken();
              if (!token) return;
              Promise.allSettled(ids.map((id) => restoreProperty(token, id))).then(() =>
                queryClient.invalidateQueries({ queryKey: ["properties"] }),
              );
            },
          },
        });
      } else if (ok > 0) toast.success(t(`bulk.${action}`, { count: ok }));
      if (failed > 0) toast.error(t("bulk.failed", { count: failed }));
      setSelected((current) => {
        const next = new Set(current);
        for (const id of ids) next.delete(id);
        return next;
      });
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : tc("actionFailed")),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["properties"] }),
  });

  const trashLink = (
    <TrashLink href={`/${agencySlug}/properties/trash`} queryKey={["properties", "trash"]} list={listTrashedProperties} hideWhenEmpty />
  );

  const actions: PropertyActions = {
    publish: (ids) => bulkMutation.mutate({ action: "publish", ids }),
    unpublish: (ids) => bulkMutation.mutate({ action: "unpublish", ids }),
    archive: (ids) => bulkMutation.mutate({ action: "archive", ids }),
    requestDelete: (ids) => bulkMutation.mutate({ action: "delete", ids }),
  };

  // Escape clears the selection.
  useEffect(() => {
    if (selected.size === 0) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setSelected(new Set());
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected.size]);

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

  function changeSort(next: SortValue) {
    captureLayout();
    setSort(next);
    setPage(1);
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="sr-only">{t("title")}</h1>

      <OnboardingChecklist />

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
                main
                className="flex-1"
                value={filters.search}
                onChange={(search) => updateFilters({ search })}
              />
            </div>
          )}
          <div className="flex flex-wrap items-center gap-3 sm:ml-auto">
            {total > 0 && (
              <>
                <SortSelect value={sort} onChange={changeSort} />
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
            {trashLink}
            <ImportLink />
            <CreatePropertyDialog />
            <HelpLink section="propiedades" label={t("help")} />
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

      {isLoading && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-6">
          {Array.from({ length: 6 }, (_, index) => (
            <PropertyCardSkeleton key={index} />
          ))}
        </div>
      )}

      {data && total === 0 && (
        <PropertiesEmpty
          actions={
            <>
              <CreatePropertyDialog />
              <ImportLink />
              {trashLink}
            </>
          }
        />
      )}

      {data && total > 0 && filtered.length === 0 && (
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-card px-6 py-16 text-center ring-1 ring-foreground/5">
          <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
            <SearchX className="size-6" />
          </span>
          <div className="flex max-w-sm flex-col gap-1">
            <p className="font-display text-2xl">{t("noMatch.title")}</p>
            <p className="text-sm text-muted-foreground">{t("noMatch.body")}</p>
          </div>
          {hasFilters && (
            <Button variant="outline" onClick={clearFilters}>
              {tc("clearFilters")}
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

    </div>
  );
}
