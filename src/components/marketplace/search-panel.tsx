"use client";

import { Minus, Plus, Search, Users } from "lucide-react";
import { useState } from "react";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { MarketplaceFacets, MarketplaceQuery } from "@/lib/api/marketplace";
import { categoryLabel } from "@/lib/properties-labels";
import { cn } from "@/lib/utils";

const ANY = "any";
const MAX_GUESTS = 16;
const PRICE_CAPS = [100000, 200000, 300000, 500000, 1000000];

type Operation = "RENT" | "SALE";

/** A labeled cell of the search ticket; on desktop the cells sit in one row split by hairlines. */
function Cell({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5 px-1 py-2 lg:px-4 lg:py-1", className)}>
      <span className="px-1 text-xs font-medium text-quiet">{label}</span>
      {children}
    </div>
  );
}

const TRIGGER =
  "h-11! w-full rounded-xl border-0 bg-mist px-3.5 text-sm shadow-none data-[state=open]:bg-white data-[state=open]:ring-1 data-[state=open]:ring-line";

function GuestsField({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const stepper =
    "flex size-9 items-center justify-center rounded-full border border-line outline-none transition-colors hover:border-ink disabled:pointer-events-none disabled:opacity-30 focus-visible:ring-3 focus-visible:ring-ring/50";
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className={cn(TRIGGER, "flex items-center gap-2.5 text-left")}>
          <Users className="size-4 text-quiet" />
          <span className={value ? "" : "text-quiet"}>
            {value ? `${value} ${value === 1 ? "huésped" : "huéspedes"}` : "¿Cuántos van?"}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="landing w-72 rounded-2xl p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="font-medium">Huéspedes</span>
            <span className="text-sm text-quiet">Contando chicos</span>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" aria-label="Uno menos" className={stepper} disabled={value <= 0} onClick={() => onChange(value - 1)}>
              <Minus className="size-4" />
            </button>
            <span className="w-5 text-center tabular-nums">{value}</span>
            <button
              type="button"
              aria-label="Uno más"
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
}: {
  facets: MarketplaceFacets;
  value: MarketplaceQuery;
  onSearch: (query: MarketplaceQuery) => void;
}) {
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
            zone: zone || undefined,
            checkIn: checkIn || undefined,
            checkOut: checkOut || undefined,
            guests: guests || undefined,
            sort: value.sort,
          }
        : {
            operation,
            zone: zone || undefined,
            category: category || undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined,
            sort: value.sort,
          },
    );
  }

  const tabs: { value: Operation; label: string; count: number }[] = [
    { value: "RENT", label: "Alquiler temporario", count: facets.operations.RENT },
    { value: "SALE", label: "Comprar", count: facets.operations.SALE },
  ];

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <div role="tablist" aria-label="Qué buscás" className="flex gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={operation === tab.value}
            onClick={() => setOperation(tab.value)}
            className={cn(
              "inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-lime/60",
              operation === tab.value ? "bg-paper text-ink" : "text-paper/75 hover:bg-paper/10 hover:text-paper",
            )}
          >
            {tab.label}
            <span className={cn("text-xs tabular-nums", operation === tab.value ? "text-quiet" : "text-paper/50")}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div className="grid gap-1 rounded-[1.75rem] bg-paper p-3 text-ink shadow-[0_30px_60px_-30px_rgba(0,0,0,0.5)] lg:grid-cols-[1.2fr_1.3fr_1fr_auto] lg:items-end lg:divide-x lg:divide-line lg:p-3">
        <Cell label="Dónde">
          <Select value={zone || ANY} onValueChange={(next) => setZone(next === ANY ? "" : next)}>
            <SelectTrigger aria-label="Dónde" className={TRIGGER}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="landing">
              <SelectItem value={ANY}>Cualquier lugar</SelectItem>
              {facets.zones.map((entry) => (
                <SelectItem key={entry.name} value={entry.name}>
                  {entry.name}
                  <span className="text-quiet">{[entry.region, entry.country].filter(Boolean).join(", ")}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Cell>

        {operation === "RENT" ? (
          <>
            <Cell label="Cuándo">
              <DateRangePicker
                start={checkIn}
                end={checkOut}
                minDate={new Date()}
                placeholder="Entrada y salida"
                onChange={(start, end) => {
                  setCheckIn(start);
                  setCheckOut(end);
                }}
              />
            </Cell>
            <Cell label="Quiénes">
              <GuestsField value={guests} onChange={setGuests} />
            </Cell>
          </>
        ) : (
          <>
            <Cell label="Qué">
              <Select value={category || ANY} onValueChange={(next) => setCategory(next === ANY ? "" : next)}>
                <SelectTrigger aria-label="Tipo de propiedad" className={TRIGGER}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="landing">
                  <SelectItem value={ANY}>Cualquier tipo</SelectItem>
                  {facets.categories.map((entry) => (
                    <SelectItem key={entry.value} value={entry.value}>
                      {categoryLabel(entry.value)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Cell>
            <Cell label="Hasta">
              <Select value={maxPrice || ANY} onValueChange={(next) => setMaxPrice(next === ANY ? "" : next)}>
                <SelectTrigger aria-label="Precio máximo" className={TRIGGER}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="landing">
                  <SelectItem value={ANY}>Sin tope</SelectItem>
                  {PRICE_CAPS.map((cap) => (
                    <SelectItem key={cap} value={String(cap)}>
                      USD {cap.toLocaleString("es-AR")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Cell>
          </>
        )}

        <div className="pt-2 lg:pt-0 lg:pl-3">
          <button
            type="submit"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-lime px-6 font-medium text-forest-deep transition-[filter] outline-none hover:brightness-95 focus-visible:ring-3 focus-visible:ring-forest/40 lg:h-14"
          >
            <Search className="size-4" />
            Buscar
          </button>
        </div>
      </div>
    </form>
  );
}
