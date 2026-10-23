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
import { ChevronLeft, ChevronRight, Lock, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { useFormat } from "@/i18n/format";
import { createAvailabilityBlock, getAvailabilityCalendar } from "@/lib/api/availability";
import { ApiError } from "@/lib/api/client";
import { getAccessToken } from "@/lib/auth/session";
import { dayKind, isFreeFor, nightTaken, stayFromDrag, type DayKind } from "@/lib/availability-range";
import { cn } from "@/lib/utils";

const WEEKS = 6;
// How many properties a day lists before "+N más".
const SHOWN_PER_DAY = 3;

// Each property keeps its own color across the whole month, so a booking can be followed from day to day.
const PROPERTY_TINTS = [
  "bg-primary/15 text-primary",
  "bg-amber-500/20 text-amber-800 dark:text-amber-300",
  "bg-sky-500/20 text-sky-800 dark:text-sky-300",
  "bg-violet-500/20 text-violet-800 dark:text-violet-300",
  "bg-rose-500/20 text-rose-800 dark:text-rose-300",
  "bg-teal-500/20 text-teal-800 dark:text-teal-300",
];
const PROPERTY_DOTS = ["bg-primary", "bg-amber-500", "bg-sky-500", "bg-violet-500", "bg-rose-500", "bg-teal-500"];
function indexOf(id: string) {
  let hash = 0;
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash % PROPERTY_TINTS.length;
}
const dotOf = (id: string) => PROPERTY_DOTS[indexOf(id)];
function tintOf(id: string) {
  return PROPERTY_TINTS[indexOf(id)];
}
const ALL = "__all__";
const key = (date: Date) => format(date, "yyyy-MM-dd");

function requireToken() {
  const token = getAccessToken();
  if (!token) throw new ApiError("No autenticado", 401);
  return token;
}

// A check-in day is taken from the afternoon (lower right half), a check-out
// day until the morning (upper left half), the same as in the 90-day grid.
const RED = "var(--destructive)";
const AMBER = "oklch(0.83 0.16 80)";
const PENDING_BACKGROUND: Partial<Record<DayKind, string>> = {
  busy: AMBER,
  in: `linear-gradient(to bottom right, transparent 50%, ${AMBER} 50%)`,
  out: `linear-gradient(to bottom right, ${AMBER} 50%, transparent 50%)`,
};
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
export function AvailabilityMonthView({ viewControl }: { viewControl?: React.ReactNode }) {
  const t = useTranslations("availability.month");
  const tc = useTranslations("common");
  const { date: formatDate } = useFormat();
  const longDay = (value: Date) => formatDate(value, "weekdayLong");
  const shortDay = (iso: string) => formatDate(parseISO(iso), "dayMonthShort");
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
  const pendingBy = useMemo(
    () => new Map(properties.map((property) => [property.id, new Set(property.pendingDates ?? [])])),
    [properties],
  );
  const selectedBlocked = selected ? (blockedBy.get(selected.id) ?? new Set<string>()) : null;
  const selectedPending = selected ? (pendingBy.get(selected.id) ?? new Set<string>()) : null;
  const todayKey = key(new Date());

  const range = drag ? stayFromDrag(drag.anchor, drag.current) : pending ? stayFromDrag(pending.first, pending.last) : null;
  const inRange = (day: string) => !!range && day >= range.first && day <= range.last;

  const blockMutation = useMutation({
    mutationFn: ({ first, checkOut }: { first: string; checkOut: string }) =>
      createAvailabilityBlock(requireToken(), selected!.id, { startDate: first, endDate: checkOut, note: note.trim() || undefined }),
    onSuccess: () => {
      toast.success(t("blocked"));
      setPending(null);
      setNote("");
      queryClient.invalidateQueries({ queryKey: ["availability-calendar-month"] });
      queryClient.invalidateQueries({ queryKey: ["availability-calendar"] });
      queryClient.invalidateQueries({ queryKey: ["availability", selected?.id] });
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : t("blockFailed")),
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
      toast.error(t("rangeTaken"));
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
  // A night with a pending booking and nobody else on it.
  const waiting = (propertyKey: string, day: string) =>
    !taken(propertyKey, day) && nightTaken(pendingBy.get(propertyKey) ?? new Set(), day);
  const focusTaken = focusDay ? properties.filter((property) => taken(property.id, focusDay)) : [];
  const focusWaiting = focusDay ? properties.filter((property) => waiting(property.id, focusDay)) : [];
  const focusFree = focusDay ? properties.filter((property) => !taken(property.id, focusDay) && !waiting(property.id, focusDay)) : [];
  const hasPending = properties.some((property) => (property.pendingDates?.length ?? 0) > 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" aria-label={t("previous")} onClick={() => setMonth(addMonths(month, -1))}>
            <ChevronLeft />
          </Button>
          <Button variant="outline" size="icon" aria-label={t("next")} onClick={() => setMonth(addMonths(month, 1))}>
            <ChevronRight />
          </Button>
        </div>
        <h2 className="min-w-40 font-display text-2xl capitalize" aria-live="polite">
          {formatDate(month, "monthYear")}
        </h2>
        <Button variant="ghost" size="sm" onClick={() => setMonth(startOfMonth(new Date()))}>
          {t("today")}
        </Button>
        <div className="w-full sm:ml-auto sm:w-72">
          <Combobox
            ariaLabel={t("property")}
            value={propertyId}
            onChange={changeProperty}
            allValue={ALL}
            allLabel={t("allProperties")}
            searchPlaceholder={t("searchProperty")}
            emptyText={t("noProperty")}
            options={properties.map((property) => ({ value: property.id, label: property.title }))}
          />
        </div>
        {viewControl && <div className="w-full sm:w-auto">{viewControl}</div>}
      </div>

      <p className="text-sm text-muted-foreground">
        {selected
          ? t("hintSelected")
          : t("hintAll")}
      </p>

      {hasPending && (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <span aria-hidden className="inline-block size-3 shrink-0 rounded-sm bg-amber-400" />
          {t("pendingHint")}
        </p>
      )}

      {error && (
        <div className="flex flex-col items-start gap-3 rounded-2xl bg-card p-6 ring-1 ring-foreground/5">
          <p className="text-sm text-muted-foreground">
            {error instanceof ApiError ? error.message : t("loadFailed")}
          </p>
          <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
            <RotateCcw />
            {tc("retry")}
          </Button>
        </div>
      )}

      {isLoading && <div className="h-[34rem] animate-pulse rounded-2xl bg-muted" />}

      {data && properties.length === 0 && (
        <p className="rounded-2xl bg-card px-6 py-12 text-center text-sm text-muted-foreground ring-1 ring-foreground/5">
          {t("noRentals")}
        </p>
      )}

      {data && properties.length > 0 && (
        <div className="overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/5">
          <div className="grid grid-cols-7 border-b border-foreground/5 text-center text-xs text-muted-foreground">
            {days.slice(0, 7).map((day) => formatDate(day, "weekdayShort")).map((weekday) => (
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
              const busyOnes = selected ? [] : properties.filter((property) => taken(property.id, day));
              const waitingOnes = selected ? [] : properties.filter((property) => waiting(property.id, day));
              const occupied = busyOnes.length;
              const listed = [...busyOnes.map((property) => ({ property, pending: false })), ...waitingOnes.map((property) => ({ property, pending: true }))];
              const pendingKind = selectedPending && kind === "free" ? dayKind(selectedPending, day) : "free";
              const canPick = !!selected && selectable(day);

              const cell = (
                <button
                  key={day}
                  type="button"
                  data-day={day}
                  onPointerDown={(event) => onPointerDown(event, day)}
                  onClick={(event) => onDayClick(event, day)}
                  aria-label={selected ? longDay(date) : t("dayLabel", { day: longDay(date), occupied, total: properties.length })}
                  aria-pressed={marked || day === focusDay}
                  className={cn(
                    "relative flex min-h-28 flex-col items-start gap-1 border-r border-b border-foreground/5 p-2 text-left outline-none transition-colors focus-visible:z-10 focus-visible:ring-3 focus-visible:ring-ring/50 [&:nth-child(7n)]:border-r-0",
                    outside && "bg-foreground/[0.025] text-muted-foreground/60",
                    past && !outside && "text-muted-foreground",
                    canPick ? "cursor-cell hover:bg-primary/10" : selected ? "cursor-default" : "hover:bg-foreground/[0.04]",
                    day === focusDay && !selected && "bg-primary/10",
                    marked && "bg-primary/20 ring-2 ring-primary ring-inset",
                  )}
                >
                  {selected && pendingKind !== "free" && pendingKind !== "turnover" && (
                    <span aria-hidden className="pointer-events-none absolute inset-0 opacity-80" style={{ background: PENDING_BACKGROUND[pendingKind] }} />
                  )}
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
                    <>
                      <span
                        className={cn(
                          "absolute top-2 right-2 text-xs tabular-nums",
                          occupied === properties.length && occupied > 0 ? "font-semibold text-destructive" : "text-muted-foreground",
                        )}
                      >
                        {occupied}/{properties.length}
                      </span>
                      <span className="relative flex w-full flex-col gap-0.5">
                        {listed.slice(0, SHOWN_PER_DAY).map(({ property, pending }) => (
                          <span
                            key={property.id}
                            className={cn(
                              "block truncate rounded px-1.5 py-0.5 text-[11px] leading-tight font-medium",
                              pending ? "border border-dashed border-amber-500 bg-amber-400/15 text-amber-800 dark:text-amber-300" : tintOf(property.id),
                            )}
                          >
                            {pending && "⏳ "}
                            {property.title}
                          </span>
                        ))}
                        {listed.length > SHOWN_PER_DAY && (
                          <span className="px-1.5 text-[11px] text-muted-foreground">{t("more", { count: listed.length - SHOWN_PER_DAY })}</span>
                        )}
                      </span>
                    </>
                  )}

                  {selected && (kind === "in" || kind === "out" || kind === "turnover") && (
                    <span className="relative mt-auto w-full text-[10px] leading-none font-medium text-foreground/70">
                      {kind === "in" ? t("checkIn") : kind === "out" ? t("checkOut") : t("turnover")}
                    </span>
                  )}
                </button>
              );

              // Hovering a day with bookings names them; a light card, not a tooltip dump.
              if (selected || listed.length === 0) return cell;
              return (
                <HoverCard key={day}>
                  <HoverCardTrigger asChild>{cell}</HoverCardTrigger>
                  <HoverCardContent>
                    <p className="flex items-baseline justify-between gap-3 text-xs text-muted-foreground">
                      <span className="first-letter:uppercase">{longDay(date)}</span>
                      <span className="tabular-nums">{t("occupiedOf", { occupied, total: properties.length })}</span>
                    </p>
                    <ul className="mt-2 flex flex-col gap-1.5">
                      {listed.map(({ property, pending }) => (
                        <li key={property.id} className="flex items-center gap-2">
                          <span aria-hidden className={cn("size-2 shrink-0 rounded-full", pending ? "bg-amber-400" : dotOf(property.id))} />
                          <span className="min-w-0 flex-1 truncate">{property.title}</span>
                          {pending && <span className="shrink-0 text-xs text-amber-700 dark:text-amber-300">{t("pending")}</span>}
                        </li>
                      ))}
                    </ul>
                  </HoverCardContent>
                </HoverCard>
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
            {t.rich("blockSummary", {
              title: selected.title,
              count: range.nights,
              from: shortDay(range.first),
              to: shortDay(range.checkOut),
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </p>
          <Input
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder={t("note")}
            aria-label={t("noteLabel")}
            maxLength={255}
            className="h-10 min-w-48 flex-1"
          />
          <Button type="button" variant="ghost" onClick={() => setPending(null)}>
            {tc("cancel")}
          </Button>
          <Button type="submit" disabled={blockMutation.isPending}>
            {t("block")}
          </Button>
        </form>
      )}

      {!selected && focusDay && data && (
        <section className="flex flex-col gap-3 rounded-2xl bg-card p-5 ring-1 ring-foreground/5" aria-live="polite">
          <h3 className="font-display text-lg first-letter:uppercase">{longDay(parseISO(focusDay))}</h3>
          <div className={cn("grid gap-4", focusWaiting.length > 0 ? "sm:grid-cols-3" : "sm:grid-cols-2")}>
            <PropertyList title={t("lists.taken", { count: focusTaken.length })} items={focusTaken} agencySlug={agencySlug} onPick={changeProperty} />
            {focusWaiting.length > 0 && (
              <PropertyList title={t("lists.waiting", { count: focusWaiting.length })} items={focusWaiting} agencySlug={agencySlug} onPick={changeProperty} />
            )}
            <PropertyList title={t("lists.free", { count: focusFree.length })} items={focusFree} agencySlug={agencySlug} onPick={changeProperty} />
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
  const t = useTranslations("availability.month");
  return (
    <div>
      <h4 className="mb-1.5 text-sm font-medium">{title}</h4>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("lists.none")}</p>
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
                {t("lists.viewMonth")}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
