"use client";

import { Building2, Check, ChevronDown, Search } from "lucide-react";
import { useMemo, useRef, useState } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { OfferOperation } from "@/lib/api/offers";
import type { ListingType, Property } from "@/lib/api/properties";
import { cn } from "@/lib/utils";

type Tab = "ALL" | ListingType;

const TABS: { value: Tab; label: string }[] = [
  { value: "ALL", label: "Todas" },
  { value: "SALE", label: "Venta" },
  { value: "RENT", label: "Alquiler" },
];

/** Lowercase and without accents, so "pileta" finds "Píleta" and "bariloche" finds "Bariloche". */
const fold = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

const money = (value: number) => value.toLocaleString("es-AR", { maximumFractionDigits: 0 });

function coverOf(property: Property) {
  const photos = [...property.photos].sort((a, b) => a.position - b.position);
  return (photos.find((photo) => photo.isCover) ?? photos[0])?.url ?? null;
}

/** Sale and rent in two different colors, so they're told apart at a glance. */
export function ListingBadge({ listingType }: { listingType: ListingType }) {
  return (
    <span
      className={cn(
        "inline-flex h-5 shrink-0 items-center rounded-full px-2 text-[0.7rem] font-medium",
        listingType === "SALE"
          ? "bg-primary/10 text-primary"
          : "bg-amber-500/15 text-amber-800 dark:text-amber-300",
      )}
    >
      {listingType === "SALE" ? "Venta" : "Alquiler"}
    </span>
  );
}

function Thumb({ property, className }: { property: Property; className?: string }) {
  const url = coverOf(property);
  return (
    <span className={cn("flex shrink-0 items-center justify-center overflow-hidden rounded-md bg-secondary text-primary/40", className)}>
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="size-full object-cover" />
      ) : (
        <Building2 className="size-1/2" strokeWidth={1.5} />
      )}
    </span>
  );
}

/**
 * Picks the property for one line of an offer: tabs for sale / rent on top
 * (the one the offer's operation leaves out is disabled), a search by name or place, and
 * the list. Arrow keys move through the results and Enter picks one.
 */
export function OfferPropertyPicker({
  properties,
  operation,
  value,
  onChange,
}: {
  properties: Property[];
  operation: OfferOperation;
  value: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("ALL");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const selected = properties.find((entry) => entry.id === value);

  // The offer's operation already narrows the list; the tabs narrow it further.
  const fitting = useMemo(
    () => properties.filter((entry) => operation === "BOTH" || entry.listingType === operation),
    [properties, operation],
  );
  const counts = useMemo(
    () => ({
      ALL: fitting.length,
      SALE: fitting.filter((entry) => entry.listingType === "SALE").length,
      RENT: fitting.filter((entry) => entry.listingType === "RENT").length,
    }),
    [fitting],
  );
  const results = useMemo(() => {
    const term = fold(query.trim());
    return fitting.filter((entry) => {
      if (tab !== "ALL" && entry.listingType !== tab) return false;
      if (!term) return true;
      return fold([entry.title, entry.area, entry.region, entry.country].filter(Boolean).join(" ")).includes(term);
    });
  }, [fitting, tab, query]);

  /** Whether a tab can hold properties this offer accepts. */
  function fitsTab(value: Tab) {
    return value === "ALL" || operation === "BOTH" || value === operation;
  }

  function choose(id: string) {
    onChange(id);
    setOpen(false);
  }

  function moveTo(index: number) {
    const next = Math.max(0, Math.min(index, results.length - 1));
    setActive(next);
    listRef.current?.querySelectorAll<HTMLElement>("[role=option]")[next]?.scrollIntoView({ block: "nearest" });
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      setQuery("");
      setActive(0);
      // Start on the tab of the property already chosen, so it's in view.
      setTab(selected && fitsTab(selected.listingType) ? selected.listingType : "ALL");
    }
  }

  const empty =
    fitting.length === 0
      ? `No tenés propiedades en ${operation === "SALE" ? "venta" : "alquiler"}.`
      : query.trim()
        ? `Ninguna propiedad coincide con «${query.trim()}».`
        : "No hay propiedades en esta pestaña.";

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Propiedad"
          className="flex h-10 w-full items-center justify-between gap-2 rounded-xl border border-transparent bg-foreground/[0.07] pr-3 pl-3.5 text-left text-sm transition-[background-color,box-shadow,border-color] duration-300 ease-out outline-none hover:bg-foreground/10 focus-visible:border-primary/20 focus-visible:bg-card focus-visible:shadow-[0_8px_24px_-12px_oklch(0.3_0.05_160/0.3)] data-[state=open]:bg-card dark:bg-foreground/10"
        >
          {selected ? (
            <span className="flex min-w-0 items-center gap-2">
              <span className="truncate">{selected.title}</span>
              <ListingBadge listingType={selected.listingType} />
            </span>
          ) : (
            <span className="text-muted-foreground">Elegir propiedad</span>
          )}
          <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={8}
        className="w-(--radix-popover-trigger-width) min-w-80 gap-0 overflow-hidden rounded-2xl p-0"
        onOpenAutoFocus={(event) => {
          // Focus goes to the search box, not the first tab.
          event.preventDefault();
          (event.currentTarget as HTMLElement).querySelector("input")?.focus();
        }}
      >
        <div className="flex flex-col gap-2 border-b border-foreground/5 p-2">
          <div role="tablist" aria-label="Operación" className="flex gap-0.5 rounded-full bg-foreground/[0.06] p-1">
              {TABS.map((item) => {
                const current = item.value === tab;
                const off = !fitsTab(item.value);
                return (
                  <button
                    key={item.value}
                    type="button"
                    role="tab"
                    aria-selected={current}
                    disabled={off}
                    title={off ? `La oferta es solo de ${operation === "SALE" ? "venta" : "alquiler"}` : undefined}
                    onClick={() => {
                      setTab(item.value);
                      setActive(0);
                    }}
                    className={cn(
                      "inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-full text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                      current ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                      "disabled:pointer-events-none disabled:opacity-40",
                    )}
                  >
                    {item.label}
                    <span className={cn("text-xs tabular-nums", current ? "text-muted-foreground" : "text-muted-foreground/70")}>
                      {counts[item.value]}
                    </span>
                  </button>
                );
              })}
            </div>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActive(0);
              }}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  moveTo(active + 1);
                } else if (event.key === "ArrowUp") {
                  event.preventDefault();
                  moveTo(active - 1);
                } else if (event.key === "Enter") {
                  event.preventDefault();
                  if (results[active]) choose(results[active].id);
                }
              }}
              placeholder="Buscar por nombre o zona"
              aria-label="Buscar propiedad"
              aria-controls="offer-property-results"
              className="h-10 w-full rounded-xl bg-foreground/[0.05] pr-3 pl-9 text-sm outline-none placeholder:text-muted-foreground focus-visible:bg-foreground/[0.07]"
            />
          </div>
        </div>

        {/* Four results tall (56px each plus padding); the rest scroll. */}
        <div ref={listRef} id="offer-property-results" role="listbox" aria-label="Propiedades" className="max-h-[14.75rem] overflow-y-auto p-1.5">
          {results.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">{empty}</p>
          ) : (
            results.map((entry, index) => {
              const place = [entry.area, entry.region].filter(Boolean).join(", ");
              const price = entry.price
                ? `${entry.currency} ${money(entry.price)}${entry.listingType === "RENT" ? " /noche" : ""}`
                : null;
              const isSelected = entry.id === value;
              return (
                <div
                  key={entry.id}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => choose(entry.id)}
                  onMouseMove={() => setActive(index)}
                  className={cn(
                    "flex cursor-default items-center gap-3 rounded-xl px-2.5 py-2",
                    index === active && "bg-foreground/[0.06]",
                  )}
                >
                  <Thumb property={entry} className="size-10" />
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className={cn("truncate text-sm", isSelected && "font-medium")}>{entry.title}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {[place, price].filter(Boolean).join(" · ")}
                    </span>
                  </span>
                  {(operation === "BOTH" && tab === "ALL") && <ListingBadge listingType={entry.listingType} />}
                  <Check className={cn("size-4 shrink-0 text-primary", !isSelected && "invisible")} aria-hidden />
                </div>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
