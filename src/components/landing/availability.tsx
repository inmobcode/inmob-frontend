"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { SECTION, WRAP } from "@/components/landing/layout";
import { Heading } from "@/components/landing/sections";
import { useFormat } from "@/i18n/format";
import { cn } from "@/lib/utils";

const FACTS = ["grid", "month", "rates", "filters"] as const;

/**
 * Two months in one run of day numbers (October is 1 to 31, November 32 to 61)
 * so a drag can cross from one month to the next.
 */
const MONTHS = [
  { month: 9, offset: 3, days: 31, base: 0 },
  { month: 10, offset: 6, days: 30, base: 31 },
];
const TOTAL = 61;
const BOOKED = new Set([
  3, 4, 5, 6, 7, 8, 9, 17, 18, 19, 20, 21, 22, 28, 29, 30, 36, 37, 38, 39, 40,
  45, 46, 47, 48, 49, 50, 51,
]);
// A Monday (5 October 2026) and the six days after it, to name the weekdays.
const WEEK = Array.from({ length: 7 }, (_, index) => new Date(2026, 9, 5 + index));

/** A pair of months where free days can be blocked by dragging across them, like in the real calendar. */
function MonthFragment() {
  const t = useTranslations("landing.availability");
  const { tag, date } = useFormat();
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
            key={month.month}
            className="flex flex-col gap-3 border-b border-line p-5 lg:border-r lg:border-b-0"
          >
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-logo text-lg font-semibold first-letter:uppercase">
                {date(new Date(2026, month.month, 1), "monthYear")}
              </p>
              {month.base === 0 && (
                <p className="text-xs text-quiet">{t("property")}</p>
              )}
            </div>
            <div className="grid touch-pan-y grid-cols-7 gap-1 text-center text-[11px] select-none">
              {WEEK.map((day, index) => (
                <span key={index} className="py-1 text-quiet">
                  {new Intl.DateTimeFormat(tag, { weekday: "narrow" }).format(day)}
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
                    aria-label={t("dayLabel", {
                      day: date(new Date(2026, month.month, day), "dayMonth"),
                      status: booked ? "booked" : isBlocked ? "blocked" : "free",
                    })}
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
        <p className="text-quiet">{t("legend")}</p>
        {[
          [t("booked"), "bg-forest"],
          [t("blocked"), "bg-ink/20"],
          [t("free"), "bg-mist ring-1 ring-line"],
        ].map(([label, swatch]) => (
          <div key={label} className="flex items-center gap-2">
            <span className={cn("size-2.5 rounded-sm", swatch)} />
            <span>{label}</span>
          </div>
        ))}
        <p className="mt-3 text-quiet">{t("rates")}</p>
        {[
          [t("high"), "USD 600"],
          [t("mid"), "USD 420"],
          [t("low"), "USD 310"],
        ].map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-2">
            <span>{label}</span>
            <span className="font-medium tabular-nums">{value}</span>
          </div>
        ))}
        <p className="mt-auto pt-4 text-quiet">
          {t("tryIt")}
        </p>
      </div>
    </div>
  );
}

export function Availability() {
  const t = useTranslations("landing.availability");
  return (
    <section
      id="disponibilidad"
      aria-labelledby="disponibilidad-titulo"
      className="scroll-mt-16 border-b border-line"
    >
      <div className={cn(WRAP, SECTION, "flex flex-col gap-12 md:gap-14")}>
        <Heading
          id="disponibilidad-titulo"
          claim={t("claim")}
          rest={t("rest")}
          className="max-w-3xl"
        />
        <MonthFragment />
        <dl className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-10">
          {FACTS.map((fact) => (
            <div key={fact} className="border-t border-line py-6">
              <dt className="font-logo text-lg font-semibold">{t(`facts.${fact}.title`)}</dt>
              <dd className="mt-1 text-base leading-snug text-pretty text-quiet">
                {t(`facts.${fact}.text`)}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
