"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Lock, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { createAvailabilityBlock, getAvailabilityCalendar } from "@/lib/api/availability";
import { ApiError } from "@/lib/api/client";
import { getAccessToken } from "@/lib/auth/session";
import { dayKind, isFreeFor, nightTaken, stayFromDrag, type DayKind } from "@/lib/availability-range";
import { cn } from "@/lib/utils";

const WEEKS = 6;
const ALL = "__all__";
const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const key = (date: Date) => format(date, "yyyy-MM-dd");

function requireToken() {
  const token = getAccessToken();
  if (!token) throw new ApiError("No autenticado", 401);
  return token;
}

// A check-in day is taken from the afternoon (lower right half), a check-out
// day until the morning (upper left half), the same as in the 90-day grid.
const RED = "var(--destructive)";
const KIND_BACKGROUND: Partial<Record<DayKind, string>> = {
  busy: RED,
  in: `linear-gradient(to bottom right, transparent 50%, ${RED} 50%)`,
  out: `linear-gradient(to bottom right, ${RED} 50%, transparent 50%)`,
  turnover: `linear-gradient(to bottom right, ${RED} 0 35%, transparent 35% 65%, ${RED} 65%)`,
};

/**
 * The agency's rentals on a month calendar. With every property, each day shows
 * how many are taken that night; pick one property and the days show its
 * bookings and blocks, and dragging across free nights blocks them.
 */
export function AvailabilityMonthView() {
  const { agencySlug } = useParams<{ agencySlug: string }>();
  const queryClient = useQueryClient();
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [propertyId, setPropertyId] = useState(ALL);
  const [drag, setDrag] = useState<{ anchor: string; current: string } | null>(null);
  const [pending, setPending] = useState<{ first: string; last: string } | null>(null);
  const [focusDay, setFocusDay] = useState<string | null>(null);
  const [note, setNote] = useState("");

  // Six full weeks starting on Monday, so the month always fills the same grid.
  const gridStart = startOfWeek(month, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: addDays(gridStart, WEEKS * 7 - 1) });
  const from = key(gridStart);

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["availability-calendar-month", from],
    queryFn: () => getAvailabilityCalendar(requireToken(), { from, days: WEEKS * 7 }),
  });

  const properties = useMemo(() => data?.properties ?? [], [data]);
  const blockedBy = useMemo(
    () => new Map(properties.map((property) => [property.id, new Set(property.blockedDates)])),
    [properties],
  );
  const selected = propertyId === ALL ? null : (properties.find((property) => property.id === propertyId) ?? null);
  const selectedBlocked = selected ? (blockedBy.get(selected.id) ?? new Set<string>()) : null;
  const todayKey = key(new Date());

  const range = drag ? stayFromDrag(drag.anchor, drag.current) : pending ? stayFromDrag(pending.first, pending.last) : null;
  const inRange = (day: string) => !!range && day >= range.first && day <= range.last;

  const blockMutation = useMutation({
    mutationFn: ({ first, checkOut }: { first: string; checkOut: string }) =>
      createAvailabilityBlock(requireToken(), selected!.id, { startDate: first, endDate: checkOut, note: note.trim() || undefined }),
    onSuccess: () => {
      toast.success("Fechas bloqueadas");
      setPending(null);
      setNote("");
      queryClient.invalidateQueries({ queryKey: ["availability-calendar-month"] });
      queryClient.invalidateQueries({ queryKey: ["availability-calendar"] });
      queryClient.invalidateQueries({ queryKey: ["availability", selected?.id] });
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "No se pudieron bloquear las fechas"),
  });

  function changeProperty(next: string) {
    setPropertyId(next);
    setDrag(null);
    setPending(null);
    setFocusDay(null);
  }

  function selectable(day: string) {
    // Past days and nights already taken can't be blocked.
    return !!selectedBlocked && day >= todayKey && !nightTaken(selectedBlocked, day);
  }

  function settle(first: string, last: string) {
    const stay = stayFromDrag(first, last);
    if (!selectedBlocked || stay.first < todayKey || !isFreeFor([...selectedBlocked], stay.first, stay.checkOut)) {
      toast.error("Ese rango incluye noches ocupadas o ya pasadas.");
      setPending(null);
      return;
    }
    setPending({ first: stay.first, last: stay.last });
  }

  function dayUnderPointer(event: React.PointerEvent) {
    const cell = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>("[data-day]");
    return cell?.dataset.day ?? null;
  }

  function onPointerDown(event: React.PointerEvent, day: string) {
    if (!selected || event.button !== 0 || !selectable(day)) return;
    setPending(null);
    setDrag({ anchor: day, current: day });
  }

  function onPointerMove(event: React.PointerEvent) {
    if (!drag) return;
    const day = dayUnderPointer(event);
    if (day && day !== drag.current) setDrag({ ...drag, current: day });
  }

  function onPointerUp() {
    if (!drag) return;
    const { anchor, current } = drag;
    setDrag(null);
    settle(anchor, current);
  }

  // Keyboard and one-by-one clicking: the first click starts a stay, the next one stretches it.
  function onDayClick(event: React.MouseEvent, day: string) {
    if (!selected) {
      setFocusDay(day === focusDay ? null : day);
      return;
    }
    // A mouse click that ended a drag was already handled on pointer up.
    if (event.detail !== 0 || !selectable(day)) return;
    if (pending) settle(pending.first, day);
    else settle(day, day);
  }

  const taken = (propertyKey: string, day: string) => nightTaken(blockedBy.get(propertyKey) ?? new Set(), day);
  const focusTaken = focusDay ? properties.filter((property) => taken(property.id, focusDay)) : [];
  const focusFree = focusDay ? properties.filter((property) => !taken(property.id, focusDay)) : [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" aria-label="Mes anterior" onClick={() => setMonth(addMonths(month, -1))}>
            <ChevronLeft />
          </Button>
          <Button variant="outline" size="icon" aria-label="Mes siguiente" onClick={() => setMonth(addMonths(month, 1))}>
            <ChevronRight />
          </Button>
        </div>
        <h2 className="min-w-40 font-display text-2xl capitalize" aria-live="polite">
          {format(month, "MMMM yyyy", { locale: es })}
        </h2>
        <Button variant="ghost" size="sm" onClick={() => setMonth(startOfMonth(new Date()))}>
          Hoy
        </Button>
        <div className="w-full sm:ml-auto sm:w-72">
          <Combobox
            ariaLabel="Propiedad"
            value={propertyId}
            onChange={changeProperty}
            allValue={ALL}
            allLabel="Todas las propiedades"
            searchPlaceholder="Buscar propiedad…"
            emptyText="Ninguna propiedad coincide."
            options={properties.map((property) => ({ value: property.id, label: property.title }))}
          />
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        {selected
          ? "Arrastrá sobre las noches libres para bloquearlas. Con el teclado: Enter en el primer día y Enter en el último."
          : "Cada día muestra cuántas propiedades están ocupadas esa noche. Elegí una propiedad para ver sus reservas y bloquear fechas."}
      </p>

      {error && (
        <div className="flex flex-col items-start gap-3 rounded-2xl bg-card p-6 ring-1 ring-foreground/5">
          <p className="text-sm text-muted-foreground">
            {error instanceof ApiError ? error.message : "No pudimos cargar el calendario."}
          </p>
          <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
            <RotateCcw />
            Reintentar
          </Button>
        </div>
      )}

      {isLoading && <div className="h-[34rem] animate-pulse rounded-2xl bg-muted" />}

      {data && properties.length === 0 && (
        <p className="rounded-2xl bg-card px-6 py-12 text-center text-sm text-muted-foreground ring-1 ring-foreground/5">
          Todavía no tenés propiedades en alquiler.
        </p>
      )}

      {data && properties.length > 0 && (
        <div className="overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/5">
          <div className="grid grid-cols-7 border-b border-foreground/5 text-center text-xs text-muted-foreground">
            {WEEKDAYS.map((weekday) => (
              <span key={weekday} className="py-2.5">
                {weekday}
              </span>
            ))}
          </div>
          <div
            className={cn("grid grid-cols-7 select-none", selected && "touch-none")}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={() => setDrag(null)}
          >
            {days.map((date) => {
              const day = key(date);
              const outside = !isSameMonth(date, month);
              const past = day < todayKey;
              const kind = selectedBlocked ? dayKind(selectedBlocked, day) : "free";
              const marked = inRange(day);
              const occupied = selected ? 0 : properties.filter((property) => taken(property.id, day)).length;
              const share = properties.length > 0 ? occupied / properties.length : 0;
              const canPick = !!selected && selectable(day);

              return (
                <button
                  key={day}
                  type="button"
                  data-day={day}
                  onPointerDown={(event) => onPointerDown(event, day)}
                  onClick={(event) => onDayClick(event, day)}
                  aria-label={`${format(date, "EEEE d 'de' MMMM", { locale: es })}${selected ? "" : `: ${occupied} de ${properties.length} ocupadas`}`}
                  aria-pressed={marked || day === focusDay}
                  className={cn(
                    "relative flex min-h-24 flex-col items-start gap-1 border-r border-b border-foreground/5 p-2 text-left outline-none transition-colors focus-visible:z-10 focus-visible:ring-3 focus-visible:ring-ring/50 [&:nth-child(7n)]:border-r-0",
                    outside && "bg-foreground/[0.025] text-muted-foreground/60",
                    past && !outside && "text-muted-foreground",
                    canPick ? "cursor-cell hover:bg-primary/10" : selected ? "cursor-default" : "hover:bg-foreground/[0.04]",
                    day === focusDay && !selected && "bg-primary/10",
                    marked && "bg-primary/20 ring-2 ring-primary ring-inset",
                  )}
                >
                  {selected && KIND_BACKGROUND[kind] && (
                    <span aria-hidden className="pointer-events-none absolute inset-0 opacity-75" style={{ background: KIND_BACKGROUND[kind] }} />
                  )}
                  <span
                    className={cn(
                      "relative flex size-6 items-center justify-center rounded-full text-sm tabular-nums",
                      isToday(date) && "bg-primary font-semibold text-primary-foreground",
                      selected && kind === "busy" && !isToday(date) && "font-medium text-white",
                    )}
                  >
                    {format(date, "d")}
                  </span>

                  {!selected && properties.length > 0 && (
                    <span className="relative mt-auto w-full">
                      <span className="mb-1 block text-xs tabular-nums">
                        {occupied}/{properties.length}
                      </span>
                      <span className="block h-1.5 overflow-hidden rounded-full bg-foreground/[0.07]">
                        <span
                          className={cn("block h-full rounded-full", share >= 1 ? "bg-destructive" : "bg-primary")}
                          style={{ width: `${share * 100}%` }}
                        />
                      </span>
                    </span>
                  )}

                  {selected && (kind === "in" || kind === "out" || kind === "turnover") && (
                    <span className="relative mt-auto w-full text-[10px] leading-none font-medium text-foreground/70">
                      {kind === "in" ? "Entra" : kind === "out" ? "Sale" : "Sale y entra"}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {selected && range && pending && (
        <form
          className="flex flex-wrap items-center gap-3 rounded-2xl bg-card p-4 ring-1 ring-foreground/5"
          onSubmit={(event) => {
            event.preventDefault();
            blockMutation.mutate({ first: range.first, checkOut: range.checkOut });
          }}
        >
          <Lock className="size-4 text-muted-foreground" aria-hidden />
          <p className="text-sm">
            Bloquear <strong>{selected.title}</strong>: {range.nights} {range.nights === 1 ? "noche" : "noches"}, del{" "}
            {format(parseISO(range.first), "d MMM", { locale: es })} al {format(parseISO(range.checkOut), "d MMM", { locale: es })}.
          </p>
          <Input
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Nota (opcional)"
            aria-label="Nota del bloqueo"
            maxLength={255}
            className="h-10 min-w-48 flex-1"
          />
          <Button type="button" variant="ghost" onClick={() => setPending(null)}>
            Cancelar
          </Button>
          <Button type="submit" disabled={blockMutation.isPending}>
            Bloquear
          </Button>
        </form>
      )}

      {!selected && focusDay && data && (
        <section className="flex flex-col gap-3 rounded-2xl bg-card p-5 ring-1 ring-foreground/5" aria-live="polite">
          <h3 className="font-display text-lg capitalize">{format(parseISO(focusDay), "EEEE d 'de' MMMM", { locale: es })}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <PropertyList title={`Ocupadas (${focusTaken.length})`} items={focusTaken} agencySlug={agencySlug} onPick={changeProperty} />
            <PropertyList title={`Libres (${focusFree.length})`} items={focusFree} agencySlug={agencySlug} onPick={changeProperty} />
          </div>
        </section>
      )}
    </div>
  );
}

function PropertyList({
  title,
  items,
  agencySlug,
  onPick,
}: {
  title: string;
  items: { id: string; title: string }[];
  agencySlug: string;
  onPick: (id: string) => void;
}) {
  return (
    <div>
      <h4 className="mb-1.5 text-sm font-medium">{title}</h4>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Ninguna.</p>
      ) : (
        <ul className="flex flex-col">
          {items.map((property) => (
            <li key={property.id} className="flex items-center justify-between gap-3 border-b border-foreground/8 py-1.5 last:border-b-0">
              <Link href={`/${agencySlug}/properties/${property.id}`} className="truncate text-sm hover:underline">
                {property.title}
              </Link>
              <button
                type="button"
                onClick={() => onPick(property.id)}
                className="shrink-0 rounded-full px-2 py-0.5 text-xs text-muted-foreground outline-none hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                Ver mes
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
