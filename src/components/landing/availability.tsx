"use client";

import { useEffect, useState } from "react";

import { SECTION, WRAP } from "@/components/landing/layout";
import { Heading } from "@/components/landing/sections";
import { cn } from "@/lib/utils";

const FACTS = [
  {
    title: "90 días de un vistazo",
    text: "Una grilla con todas tus propiedades. Ves qué está libre antes de responder una consulta.",
  },
  {
    title: "Vista mensual",
    text: "La ocupación de cada día. Elegís una propiedad y arrastrás sobre las noches libres para bloquearlas.",
  },
  {
    title: "Tarifas por temporada",
    text: "Cargás el precio por noche de cada período y el total de la reserva se calcula solo.",
  },
  {
    title: "Filtros por fecha y zona",
    text: "Pedí solo las propiedades libres del 10 al 17 en una ubicación y listo.",
  },
];

/**
 * Two months in one run of day numbers (October is 1 to 31, November 32 to 61)
 * so a drag can cross from one month to the next.
 */
const MONTHS = [
  { name: "Octubre 2026", offset: 3, days: 31, base: 0 },
  { name: "Noviembre 2026", offset: 6, days: 30, base: 31 },
];
const TOTAL = 61;
const BOOKED = new Set([
  3, 4, 5, 6, 7, 8, 9, 17, 18, 19, 20, 21, 22, 28, 29, 30, 36, 37, 38, 39, 40,
  45, 46, 47, 48, 49, 50, 51,
]);
const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];

/** A pair of months where free days can be blocked by dragging across them, like in the real calendar. */
function MonthFragment() {
  const [blocked, setBlocked] = useState<Set<number>>(() => new Set([13, 14]));
  const [drag, setDrag] = useState<{ start: number; end: number } | null>(null);

  const inDrag = (day: number) =>
    drag !== null &&
    day >= Math.min(drag.start, drag.end) &&
    day <= Math.max(drag.start, drag.end);

  function commit(range: { start: number; end: number }) {
    const from = Math.min(range.start, range.end);
    const to = Math.max(range.start, range.end);
    const free: number[] = [];
    for (let day = from; day <= to; day++) {
      if (day >= 1 && day <= TOTAL && !BOOKED.has(day)) free.push(day);
    }
    setBlocked((current) => {
      const next = new Set(current);
      // Dragging over days that are all blocked already lifts the block.
      const allBlocked = free.length > 0 && free.every((day) => next.has(day));
      for (const day of free) {
        if (allBlocked) next.delete(day);
        else next.add(day);
      }
      return next;
    });
  }

  // The drag can end anywhere on the page, not only over the grid.
  useEffect(() => {
    if (!drag) return;
    function end() {
      if (drag) commit(drag);
      setDrag(null);
    }
    const cancel = () => setDrag(null);
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", cancel);
    return () => {
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", cancel);
    };
  }, [drag]);

  return (
    <div className="grid overflow-hidden rounded-xl border border-line bg-white text-ink lg:grid-cols-[1fr_1fr_14rem]">
      {MONTHS.map((month) => {
        const cells = Array.from(
          { length: Math.ceil((month.offset + month.days) / 7) * 7 },
          (_, index) => index - month.offset + 1,
        );
        return (
          <div
            key={month.name}
            className="flex flex-col gap-3 border-b border-line p-5 lg:border-r lg:border-b-0"
          >
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-logo text-lg font-semibold">{month.name}</p>
              {month.base === 0 && (
                <p className="text-xs text-quiet">Casa frente al mar</p>
              )}
            </div>
            <div className="grid touch-pan-y grid-cols-7 gap-1 text-center text-[11px] select-none">
              {WEEKDAYS.map((day, index) => (
                <span key={index} className="py-1 text-quiet">
                  {day}
                </span>
              ))}
              {cells.map((day) => {
                if (day < 1 || day > month.days)
                  return <span key={day} className="h-9" />;
                const id = month.base + day;
                const booked = BOOKED.has(id);
                const isBlocked = blocked.has(id);
                return (
                  <button
                    key={day}
                    type="button"
                    disabled={booked}
                    aria-label={`${day} de ${month.name.split(" ")[0].toLowerCase()}, ${booked ? "reservado" : isBlocked ? "bloqueado" : "libre"}`}
                    aria-pressed={isBlocked}
                    onPointerDown={() => setDrag({ start: id, end: id })}
                    onPointerEnter={() =>
                      setDrag((current) =>
                        current ? { ...current, end: id } : current,
                      )
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        commit({ start: id, end: id });
                      }
                    }}
                    className={cn(
                      "flex h-9 items-center justify-center rounded-md tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-forest",
                      booked
                        ? "bg-forest text-paper"
                        : "cursor-pointer bg-mist/60 hover:bg-mist",
                      isBlocked &&
                        !booked &&
                        "bg-ink/20 text-ink/60 line-through hover:bg-ink/20",
                      inDrag(id) &&
                        !booked &&
                        "bg-lime/50 text-forest hover:bg-lime/50",
                    )}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
      <div className="flex flex-col gap-3 p-5 text-xs">
        <p className="text-quiet">Referencias</p>
        {[
          ["Reservado", "bg-forest"],
          ["Bloqueado", "bg-ink/20"],
          ["Libre", "bg-mist ring-1 ring-line"],
        ].map(([label, swatch]) => (
          <div key={label} className="flex items-center gap-2">
            <span className={cn("size-2.5 rounded-sm", swatch)} />
            <span>{label}</span>
          </div>
        ))}
        <p className="mt-3 text-quiet">Tarifas por noche</p>
        {[
          ["Temporada alta", "USD 600"],
          ["Temporada media", "USD 420"],
          ["Temporada baja", "USD 310"],
        ].map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-2">
            <span>{label}</span>
            <span className="font-medium tabular-nums">{value}</span>
          </div>
        ))}
        <p className="mt-auto pt-4 text-quiet">
          Probalo: arrastrá sobre los días libres para bloquearlos.
        </p>
      </div>
    </div>
  );
}

export function Availability() {
  return (
    <section
      id="disponibilidad"
      aria-labelledby="disponibilidad-titulo"
      className="scroll-mt-16 border-b border-line"
    >
      <div className={cn(WRAP, SECTION, "flex flex-col gap-12 md:gap-14")}>
        <Heading
          id="disponibilidad-titulo"
          claim="Cada noche, bajo control."
          rest="Sin planillas y sin reservas que se pisan."
          className="max-w-3xl"
        />
        <MonthFragment />
        <dl className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-10">
          {FACTS.map((fact) => (
            <div key={fact.title} className="border-t border-line py-6">
              <dt className="font-logo text-lg font-semibold">{fact.title}</dt>
              <dd className="mt-1 text-base leading-snug text-pretty text-quiet">
                {fact.text}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
