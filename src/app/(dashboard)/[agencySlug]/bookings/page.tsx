"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarX2, RotateCcw, Search, SearchX } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { BOOKING_STATUSES, type BookingActions } from "@/components/bookings/booking-parts";
import { BookingCard, BookingCardSkeleton, BookingRow, BookingsTable } from "@/components/bookings/booking-views";
import { CreateBookingDialog } from "@/components/bookings/create-booking-dialog";
import { HelpHint, HelpLink } from "@/components/docs/help-link";
import { FilterMenu } from "@/components/filter-menu";
import { TrashLink } from "@/components/trash/trash-link";
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
import {
  cancelBooking,
  completeBooking,
  confirmBooking,
  deleteBooking,
  listBookings,
  listTrashedBookings,
  restoreBooking,
  type BookingStatus,
} from "@/lib/api/bookings";
import { ApiError } from "@/lib/api/client";
import { listProperties } from "@/lib/api/properties";
import { getAccessToken } from "@/lib/auth/session";
import { gsap, useGSAP } from "@/lib/gsap";
import { distance, duration, ease, media, rowStagger } from "@/lib/motion";
import { placeMatches, uniquePlaces } from "@/lib/places";

const STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING: "Pendientes",
  CONFIRMED: "Confirmadas",
  COMPLETED: "Completadas",
  CANCELLED: "Canceladas",
};

const STATUS_OPTIONS = BOOKING_STATUSES.map((value) => ({ value, label: STATUS_LABELS[value] }));

function requireToken() {
  const token = getAccessToken();
  if (!token) throw new ApiError("No autenticado", 401);
  return token;
}

export default function BookingsPage() {
  const { agencySlug } = useParams<{ agencySlug: string }>();
  const queryClient = useQueryClient();
  const gridRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<BookingStatus[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<ViewMode>("grid");
  const [cancelling, setCancelling] = useState<string | null>(null);

  // Remembered per browser; read after mount so the server and client first render match.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("bookings-view");
      if (saved === "list" || saved === "table") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setView(saved);
      }
    } catch {}
  }, []);

  function changeView(next: ViewMode) {
    setView(next);
    try {
      window.localStorage.setItem("bookings-view", next);
    } catch {}
  }

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["bookings"],
    queryFn: () => listBookings(requireToken()),
  });

  // A booking has no place of its own: it is where its property is.
  const { data: properties } = useQuery({
    queryKey: ["properties"],
    queryFn: () => listProperties(requireToken()),
    staleTime: 60_000,
  });
  const propertyById = useMemo(() => new Map((properties ?? []).map((property) => [property.id, property])), [properties]);

  const sorted = useMemo(
    () => [...(data ?? [])].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [data],
  );

  const counts = useMemo(() => {
    const result: Record<string, number> = { ALL: sorted.length };
    for (const booking of sorted) result[booking.status] = (result[booking.status] ?? 0) + 1;
    return result;
  }, [sorted]);

  // The places of the properties that have bookings, each spelled once.
  const places = useMemo(() => {
    const found = sorted.flatMap((booking) => {
      const property = propertyById.get(booking.propertyId);
      return property ? [property.area, property.region, property.country] : [];
    });
    return uniquePlaces(found).map((place) => ({ value: place, label: place }));
  }, [sorted, propertyById]);

  const placeCounts = useMemo(() => {
    const result: Record<string, number> = { ALL: sorted.length };
    for (const { value } of places) {
      result[value] = sorted.filter((booking) => {
        const property = propertyById.get(booking.propertyId);
        return !!property && placeMatches(property, value);
      }).length;
    }
    return result;
  }, [sorted, places, propertyById]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return sorted.filter((booking) => {
      if (status.length > 0 && !status.includes(booking.status)) return false;
      if (locations.length > 0) {
        const property = propertyById.get(booking.propertyId);
        if (!property || !locations.some((place) => placeMatches(property, place))) return false;
      }
      if (!term) return true;
      return [booking.propertyTitle, booking.clientName].filter(Boolean).join(" ").toLowerCase().includes(term);
    });
  }, [sorted, status, locations, propertyById, search]);

  function action(done: string, fn: (token: string, id: string) => Promise<unknown>) {
    return {
      mutationFn: (id: string) => fn(requireToken(), id),
      onSuccess: () => toast.success(done),
      onError: (err: unknown) => toast.error(err instanceof ApiError ? err.message : "No se pudo completar la acción"),
      onSettled: () => queryClient.invalidateQueries({ queryKey: ["bookings"] }),
    };
  }
  const confirmMutation = useMutation(action("Reserva confirmada", confirmBooking));
  const completeMutation = useMutation(action("Reserva completada", completeBooking));
  const cancelMutation = useMutation(action("Reserva cancelada", cancelBooking));
  // Deleting moves it to the trash, so it needs no confirmation: the toast can undo it.
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBooking(requireToken(), id),
    onSuccess: (_: unknown, id: string) =>
      toast.success("Reserva movida a la papelera", {
        action: {
          label: "Deshacer",
          onClick: () =>
            restoreBooking(requireToken(), id)
              .then(() => queryClient.invalidateQueries({ queryKey: ["bookings"] }))
              .catch(() => toast.error("No se pudo restaurar la reserva")),
        },
      }),
    onError: (err: unknown) => toast.error(err instanceof ApiError ? err.message : "No se pudo eliminar la reserva"),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["bookings"] }),
  });

  const actions: BookingActions = {
    confirm: (id) => confirmMutation.mutate(id),
    complete: (id) => completeMutation.mutate(id),
    cancel: (id) => setCancelling(id),
    remove: (id) => deleteMutation.mutate(id),
  };

  const trashLink = (
    <TrashLink href={`/${agencySlug}/bookings/trash`} queryKey={["bookings", "trash"]} list={listTrashedBookings} />
  );

  const total = sorted.length;
  const visibleKey = filtered.map((booking) => booking.id).join(",");
  const hasFilters = status.length > 0 || locations.length > 0 || search.trim() !== "";

  // Cards settle in one after another whenever the visible set changes.
  useGSAP(
    () => {
      if (!gridRef.current || filtered.length === 0) return;
      const mm = gsap.matchMedia();
      mm.add(media.allowMotion, () => {
        gsap.from(".booking-card", {
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
      <h1 className="sr-only">Reservas</h1>

      {!(data && total === 0) && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-3">
          {total > 0 && (
            <div className="relative w-full sm:max-w-xl sm:min-w-72 sm:flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por propiedad o cliente"
                aria-label="Buscar reservas"
                className="h-10 rounded-full border-transparent bg-foreground/[0.07] pl-10 transition-[background-color,box-shadow,border-color] duration-500 ease-out focus-visible:border-primary/20 focus-visible:bg-card focus-visible:shadow-[0_8px_24px_-12px_oklch(0.3_0.05_160/0.3)] focus-visible:ring-0 dark:bg-foreground/10 dark:focus-visible:bg-card"
              />
            </div>
          )}
          <div className="flex flex-wrap items-center gap-3 sm:ml-auto">
            {total > 0 && (
              <>
                <FilterMenu
                  name="Estado"
                  plural="estados"
                  options={STATUS_OPTIONS}
                  value={status}
                  onChange={setStatus}
                  counts={counts}
                />
                {places.length > 0 && (
                  <FilterMenu
                    name="Ubicación"
                    plural="ubicaciones"
                    options={places}
                    value={locations}
                    onChange={setLocations}
                    counts={placeCounts}
                  />
                )}
                <ViewSwitch value={view} onChange={changeView} />
              </>
            )}
            <HelpLink section="reservas" label="Ayuda con reservas" />
            {trashLink}
            <CreateBookingDialog />
          </div>
        </div>
      )}

      {error && (
        <div className="flex flex-col items-start gap-4 rounded-2xl bg-card p-6 ring-1 ring-foreground/5">
          <div>
            <p className="font-display text-xl">No pudimos cargar las reservas</p>
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
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] gap-6">
          {Array.from({ length: 6 }, (_, index) => (
            <BookingCardSkeleton key={index} />
          ))}
        </div>
      )}

      {data && total === 0 && (
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-card px-6 py-16 text-center ring-1 ring-foreground/5">
          <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
            <CalendarX2 className="size-6" />
          </span>
          <div className="flex max-w-sm flex-col gap-1">
            <p className="font-display text-2xl">Todavía no hay reservas</p>
            <p className="text-sm text-muted-foreground">
              Cargá la primera para seguir fechas, pagos y comisión en un solo lugar.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <CreateBookingDialog />
            {trashLink}
          </div>
          <HelpHint section="reservas">Cómo cargar una reserva y sus pagos</HelpHint>
        </div>
      )}

      {data && total > 0 && filtered.length === 0 && (
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-card px-6 py-16 text-center ring-1 ring-foreground/5">
          <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
            <SearchX className="size-6" />
          </span>
          <div className="flex max-w-sm flex-col gap-1">
            <p className="font-display text-2xl">Nada coincide con eso</p>
            <p className="text-sm text-muted-foreground">Probá con otro nombre o quitá el filtro de estado.</p>
          </div>
          {hasFilters && (
            <Button
              variant="outline"
              onClick={() => {
                setStatus([]);
                setLocations([]);
                setSearch("");
              }}
            >
              Quitar filtros
            </Button>
          )}
        </div>
      )}

      {filtered.length > 0 && view === "grid" && (
        <div ref={gridRef} className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] gap-6">
          {filtered.map((booking) => (
            <BookingCard key={booking.id} booking={booking} actions={actions} />
          ))}
        </div>
      )}

      {filtered.length > 0 && view === "list" && (
        <div ref={gridRef} className="flex flex-col gap-4">
          {filtered.map((booking) => (
            <BookingRow key={booking.id} booking={booking} actions={actions} />
          ))}
        </div>
      )}

      {filtered.length > 0 && view === "table" && (
        <div ref={gridRef}>
          <BookingsTable bookings={filtered} actions={actions} />
        </div>
      )}

      <AlertDialog open={cancelling != null} onOpenChange={(open) => !open && setCancelling(null)}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-2xl">¿Cancelar esta reserva?</AlertDialogTitle>
            <AlertDialogDescription>
              Las fechas se liberan y la reserva queda como cancelada. Los pagos ya registrados no se borran.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Volver</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (cancelling) cancelMutation.mutate(cancelling);
                setCancelling(null);
              }}
            >
              Cancelar reserva
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
