"use client";

import { Minus, Plus, Search, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { DestinationField } from "@/components/marketplace/destination-field";
import { DateRangePicker } from "@/components/ui/date-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormat } from "@/i18n/format";
import type { MarketplaceFacets, MarketplaceQuery } from "@/lib/api/marketplace";
import { useLabels } from "@/lib/labels";
import { cn } from "@/lib/utils";

const ANY = "any";
const MAX_GUESTS = 16;
const PRICE_CAPS = [100000, 200000, 300000, 500000, 1000000];

type Operation = "RENT" | "SALE";

/** A labeled cell of the search ticket; on desktop the cells sit in one row split by hairlines. */
function Cell({ label, children, compact = false }: { label: string; children: React.ReactNode; compact?: boolean }) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5 px-1 py-2 lg:px-4 lg:py-1", compact && "lg:px-1.5 lg:py-0")}>
      {/* The compact bar keeps the label for screen readers only; its fields speak for themselves. */}
      <span className={cn("px-1 text-xs font-medium text-quiet", compact && "lg:sr-only")}>{label}</span>
      {children}
    </div>
  );
}

const TRIGGER =
  // Translucent like the date picker's, so over the glass bar every field shows what's behind it alike.
  "h-11! w-full rounded-xl border-0 bg-ink/[0.07] px-3.5 text-sm shadow-none transition-[background-color,box-shadow] duration-300 hover:bg-ink/10 data-[state=open]:bg-white data-[state=open]:shadow-[0_8px_24px_-12px_oklch(0.3_0.05_160/0.3)]";

function GuestsField({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const t = useTranslations("marketplace.search");
  const stepper =
    "flex size-9 items-center justify-center rounded-full border border-line outline-none transition-colors hover:border-ink disabled:pointer-events-none disabled:opacity-30 focus-visible:ring-3 focus-visible:ring-ring/50";
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className={cn(TRIGGER, "flex items-center gap-2.5 text-left")}>
          <Users className="size-4 text-quiet" />
          <span className={value ? "" : "text-quiet"}>
            {value ? t("guestsCount", { count: value }) : t("guestsPlaceholder")}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="landing w-72 rounded-2xl p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="font-medium">{t("guests")}</span>
            <span className="text-sm text-quiet">{t("guestsHint")}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label={t("oneLess")}
              className={stepper}
              disabled={value <= 0}
              onClick={() => onChange(value - 1)}
            >
              <Minus className="size-4" />
            </button>
            <span className="w-5 text-center tabular-nums">{value}</span>
            <button
              type="button"
              aria-label={t("oneMore")}
              className={stepper}
              disabled={value >= MAX_GUESTS}
              onClick={() => onChange(value + 1)}
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

/**
 * The search in the hero: a short-term rental (where, when, how many) or a
 * purchase (where, what, up to how much). It edits a draft and only applies
 * it on "Buscar", so the results don't jump while the fields are filled in.
 */
export function SearchPanel({
  facets,
  value,
  onSearch,
  compact = false,
}: {
  facets: MarketplaceFacets;
  value: MarketplaceQuery;
  onSearch: (query: MarketplaceQuery) => void;
  /** The sticky bar: tighter, translucent, labels hidden on desktop. */
  compact?: boolean;
}) {
  const t = useTranslations("marketplace.search");
  const tCard = useTranslations("marketplace.card");
  const labels = useLabels();
  const { number } = useFormat();
  const [operation, setOperation] = useState<Operation>(value.operation ?? "RENT");
  const [zone, setZone] = useState(value.zone ?? "");
  const [checkIn, setCheckIn] = useState(value.checkIn ?? "");
  const [checkOut, setCheckOut] = useState(value.checkOut ?? "");
  const [guests, setGuests] = useState(value.guests ?? 0);
  const [category, setCategory] = useState(value.category ?? "");
  const [maxPrice, setMaxPrice] = useState(value.maxPrice ? String(value.maxPrice) : "");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    onSearch(
      operation === "RENT"
        ? {
            operation,
            zone: zone.trim() || undefined,
            checkIn: checkIn || undefined,
            checkOut: checkOut || undefined,
            guests: guests || undefined,
            sort: value.sort,
          }
        : {
            operation,
            zone: zone.trim() || undefined,
            category: category || undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined,
            sort: value.sort,
          },
    );
  }

  const operations: { value: Operation; label: string }[] = [
    { value: "RENT", label: tCard("rent") },
    { value: "SALE", label: t("buy") },
  ];

  return (
    <form onSubmit={submit}>
      <div
        className={cn(
          "grid gap-1 text-ink lg:grid-cols-[1fr_1.2fr_1.3fr_1fr_auto] lg:items-end",
          compact
            ? // The dashboard's floating bar: glass over whatever scrolls under it.
              "rounded-[1.75rem] bg-paper/45 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_16px_40px_-12px_rgba(15,53,36,0.35)] ring-1 ring-ink/[0.07] backdrop-blur-xl backdrop-saturate-200 lg:items-center lg:rounded-full lg:p-1.5"
            : "rounded-[1.75rem] bg-paper p-3 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.5)] lg:divide-x lg:divide-line lg:p-3",
        )}
      >
        <Cell compact={compact} label={t("looking")}>
          <Select value={operation} onValueChange={(next) => setOperation(next as Operation)}>
            <SelectTrigger aria-label={t("lookingLabel")} className={TRIGGER}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="landing">
              {operations.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Cell>

        <Cell compact={compact} label={t("where")}>
          <DestinationField value={zone} onChange={setZone} zones={facets.zones} />
        </Cell>

        {operation === "RENT" ? (
          <>
            <Cell compact={compact} label={t("when")}>
              <DateRangePicker
                start={checkIn}
                end={checkOut}
                minDate={new Date()}
                placeholder={t("dates")}
                onChange={(start, end) => {
                  setCheckIn(start);
                  setCheckOut(end);
                }}
              />
            </Cell>
            <Cell compact={compact} label={t("who")}>
              <GuestsField value={guests} onChange={setGuests} />
            </Cell>
          </>
        ) : (
          <>
            <Cell compact={compact} label={t("what")}>
              <Select value={category || ANY} onValueChange={(next) => setCategory(next === ANY ? "" : next)}>
                <SelectTrigger aria-label={t("type")} className={TRIGGER}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="landing">
                  <SelectItem value={ANY}>{t("anyType")}</SelectItem>
                  {facets.categories.map((entry) => (
                    <SelectItem key={entry.value} value={entry.value}>
                      {labels.category(entry.value)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Cell>
            <Cell compact={compact} label={t("upTo")}>
              <Select value={maxPrice || ANY} onValueChange={(next) => setMaxPrice(next === ANY ? "" : next)}>
                <SelectTrigger aria-label={t("maxPrice")} className={TRIGGER}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="landing">
                  <SelectItem value={ANY}>{t("noCap")}</SelectItem>
                  {PRICE_CAPS.map((cap) => (
                    <SelectItem key={cap} value={String(cap)}>
                      USD {number(cap)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Cell>
          </>
        )}

        <div className={cn("pt-2 lg:pt-0", compact ? "lg:pl-1" : "lg:pl-3")}>
          <button
            type="submit"
            className={cn(
              "inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-lime px-6 font-medium text-forest-deep transition-[filter] outline-none hover:brightness-95 focus-visible:ring-3 focus-visible:ring-forest/40",
              compact ? "lg:h-11" : "lg:h-14",
            )}
          >
            <Search className="size-4" />
            {t("submit")}
          </button>
        </div>
      </div>
    </form>
  );
}
