"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FileText, RotateCcw, Search, SearchX } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { CreateOfferDialog } from "@/components/offers/create-offer-dialog";
import { OfferCard, OfferCardSkeleton, type OfferActions } from "@/components/offers/offer-card";
import { FilterMenu } from "@/components/filter-menu";
import { OffersTable, OfferRow } from "@/components/offers/offer-views";
import { ViewSwitch, type ViewMode } from "@/components/properties/view-switch";
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
import { deleteOffer, listOffers, sendOffer, type OfferOperation, type OfferStatus } from "@/lib/api/offers";
import { getAccessToken } from "@/lib/auth/session";
import { gsap, useGSAP } from "@/lib/gsap";
import { distance, duration, ease, media, rowStagger } from "@/lib/motion";
import { OFFER_OPERATION_LABELS, OFFER_STATUS_LABELS } from "@/lib/properties-labels";

const STATUS_OPTIONS: { value: OfferStatus; label: string }[] = [
  { value: "DRAFT", label: OFFER_STATUS_LABELS.DRAFT + "es" },
  { value: "SENT", label: OFFER_STATUS_LABELS.SENT + "s" },
  { value: "VIEWED", label: OFFER_STATUS_LABELS.VIEWED + "s" },
  { value: "EXPIRED", label: OFFER_STATUS_LABELS.EXPIRED + "s" },
];

const OPERATION_OPTIONS: { value: OfferOperation; label: string }[] = [
  { value: "SALE", label: OFFER_OPERATION_LABELS.SALE },
  { value: "RENT", label: OFFER_OPERATION_LABELS.RENT },
  { value: "BOTH", label: OFFER_OPERATION_LABELS.BOTH },
];

function requireToken() {
  const token = getAccessToken();
  if (!token) throw new ApiError("No autenticado", 401);
  return token;
}

export default function OffersPage() {
  const queryClient = useQueryClient();
  const gridRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<OfferStatus[]>([]);
  const [operation, setOperation] = useState<OfferOperation[]>([]);
  const [view, setView] = useState<ViewMode>("grid");

  // Remembered per browser; read after mount so the server and client first render match.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("offers-view");
      if (saved === "list" || saved === "table") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setView(saved);
      }
    } catch {}
  }, []);

  function changeView(next: ViewMode) {
    setView(next);
    try {
      window.localStorage.setItem("offers-view", next);
    } catch {}
  }
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["offers"],
    queryFn: () => listOffers(requireToken()),
  });

  const sorted = useMemo(
    () => [...(data ?? [])].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [data],
  );

  const counts = useMemo(() => {
    const result: Record<string, number> = { ALL: sorted.length };
    for (const offer of sorted) result[offer.status] = (result[offer.status] ?? 0) + 1;
    return result;
  }, [sorted]);

  const operationCounts = useMemo(() => {
    const result: Record<string, number> = { ALL: sorted.length };
    for (const offer of sorted) result[offer.operation] = (result[offer.operation] ?? 0) + 1;
    return result;
  }, [sorted]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return sorted.filter((offer) => {
      if (status.length > 0 && !status.includes(offer.status)) return false;
      if (operation.length > 0 && !operation.includes(offer.operation)) return false;
      if (!term) return true;
      return [offer.title, offer.clientName, offer.clientEmail].filter(Boolean).join(" ").toLowerCase().includes(term);
    });
  }, [sorted, status, operation, search]);

  const sendMutation = useMutation({
    mutationFn: (id: string) => sendOffer(requireToken(), id),
    onSuccess: () => toast.success("Oferta marcada como enviada"),
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "No se pudo enviar la oferta"),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["offers"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteOffer(requireToken(), id),
    onSuccess: () => toast.success("Oferta eliminada"),
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "No se pudo eliminar la oferta"),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["offers"] }),
  });

  const actions: OfferActions = {
    send: (id) => sendMutation.mutate(id),
    requestDelete: (id) => setDeleting(id),
  };

  const total = sorted.length;
  const visibleKey = filtered.map((offer) => offer.id).join(",");
  const hasFilters = status.length > 0 || operation.length > 0 || search.trim() !== "";

  // Cards settle in one after another whenever the visible set changes.
  useGSAP(
    () => {
      if (!gridRef.current || filtered.length === 0) return;
      const mm = gsap.matchMedia();
      mm.add(media.allowMotion, () => {
        gsap.from(".offer-card", {
          opacity: 0,
          y: distance.md,
          duration: duration.macro,
          ease: ease.out,
          stagger: rowStagger,
        });
      });
      return () => mm.revert();
    },
    { scope: gridRef, dependencies: [visibleKey, view] },
  );

  return (
    <div className="flex flex-col gap-8">
      <h1 className="sr-only">Ofertas</h1>

      {!(data && total === 0) && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-3">
          {total > 0 && (
            <div className="relative w-full sm:max-w-xl sm:min-w-72 sm:flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por título o cliente"
                aria-label="Buscar ofertas"
                className="h-10 rounded-full border-transparent bg-foreground/[0.07] pl-10 transition-[background-color,box-shadow,border-color] duration-500 ease-out focus-visible:border-primary/20 focus-visible:bg-card focus-visible:shadow-[0_8px_24px_-12px_oklch(0.3_0.05_160/0.3)] focus-visible:ring-0 dark:bg-foreground/10 dark:focus-visible:bg-card"
              />
            </div>
          )}
          <div className="flex flex-wrap items-center gap-3 sm:ml-auto">
            {total > 0 && (
              <>
                <FilterMenu
                  name="Operación"
                  plural="operaciones"
                  options={OPERATION_OPTIONS}
                  value={operation}
                  onChange={setOperation}
                  counts={operationCounts}
                />
                <FilterMenu
                  name="Estado"
                  plural="estados"
                  options={STATUS_OPTIONS}
                  value={status}
                  onChange={setStatus}
                  counts={counts}
                />
                <ViewSwitch value={view} onChange={changeView} />
              </>
            )}
            <CreateOfferDialog />
          </div>
        </div>
      )}

      {error && (
        <div className="flex flex-col items-start gap-4 rounded-2xl bg-card p-6 ring-1 ring-foreground/5">
          <div>
            <p className="font-display text-xl">No pudimos cargar las ofertas</p>
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
            <OfferCardSkeleton key={index} />
          ))}
        </div>
      )}

      {data && total === 0 && (
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-card px-6 py-16 text-center ring-1 ring-foreground/5">
          <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
            <FileText className="size-6" />
          </span>
          <div className="flex max-w-sm flex-col gap-1">
            <p className="font-display text-2xl">Armá tu primera oferta</p>
            <p className="text-sm text-muted-foreground">
              Elegí propiedades, sumá descuentos y compartí un link con tu cliente.
            </p>
          </div>
          <CreateOfferDialog />
        </div>
      )}

      {data && total > 0 && filtered.length === 0 && (
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-card px-6 py-16 text-center ring-1 ring-foreground/5">
          <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
            <SearchX className="size-6" />
          </span>
          <div className="flex max-w-sm flex-col gap-1">
            <p className="font-display text-2xl">Nada coincide con eso</p>
            <p className="text-sm text-muted-foreground">Probá con otro nombre o quitá los filtros.</p>
          </div>
          {hasFilters && (
            <Button
              variant="outline"
              onClick={() => {
                setStatus([]);
                setOperation([]);
                setSearch("");
              }}
            >
              Quitar filtros
            </Button>
          )}
        </div>
      )}

      {filtered.length > 0 && view === "grid" && (
        <div ref={gridRef} className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-6">
          {filtered.map((offer) => (
            <OfferCard key={offer.id} offer={offer} actions={actions} />
          ))}
        </div>
      )}

      {filtered.length > 0 && view === "list" && (
        <div ref={gridRef} className="flex flex-col gap-4">
          {filtered.map((offer) => (
            <OfferRow key={offer.id} offer={offer} actions={actions} />
          ))}
        </div>
      )}

      {filtered.length > 0 && view === "table" && (
        <div ref={gridRef}>
          <OffersTable offers={filtered} actions={actions} />
        </div>
      )}

      <AlertDialog open={deleting != null} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-2xl">¿Eliminar esta oferta?</AlertDialogTitle>
            <AlertDialogDescription>
              El link público deja de funcionar y no se puede recuperar. Las propiedades no se tocan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (deleting) deleteMutation.mutate(deleting);
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
