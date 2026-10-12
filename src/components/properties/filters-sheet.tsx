"use client";

import { SlidersHorizontal } from "lucide-react";
import { useMemo, useRef, useState } from "react";

import { Segmented } from "@/components/properties/segmented";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Property } from "@/lib/api/properties";
import { gsap } from "@/lib/gsap";
import { media } from "@/lib/motion";
import {
  applyFilters,
  countActiveFilters,
  DEFAULT_FILTERS,
  type PropertyFilters,
} from "@/lib/property-filters";
import { categoryLabel, LISTING_TYPE_LABELS, STATUS_LABELS } from "@/lib/properties-labels";

const STATUS_OPTIONS = [
  { value: "ALL", label: "Todos" },
  { value: "PUBLISHED", label: STATUS_LABELS.PUBLISHED },
  { value: "DRAFT", label: STATUS_LABELS.DRAFT },
  { value: "ARCHIVED", label: STATUS_LABELS.ARCHIVED },
] as const;

const TYPE_OPTIONS = [
  { value: "ALL", label: "Todo" },
  { value: "SALE", label: LISTING_TYPE_LABELS.SALE },
  { value: "RENT", label: LISTING_TYPE_LABELS.RENT },
] as const;

const MIN_OPTIONS = [
  { value: "", label: "Todos" },
  ...[1, 2, 3, 4, 5].map((n) => ({ value: String(n), label: `${n}+` })),
];

function unique(values: (string | null | undefined)[]) {
  return [...new Set(values.filter((value): value is string => Boolean(value)))].sort((a, b) =>
    a.localeCompare(b, "es"),
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      <Label className="text-sm font-medium">{title}</Label>
      {children}
    </div>
  );
}

function SelectFilter({
  id,
  value,
  onChange,
  allLabel,
  options,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  allLabel: string;
  options: { value: string; label: string }[];
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id={id} className="h-10 w-full rounded-xl">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ALL">{allLabel}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function FiltersSheet({
  properties,
  value,
  onApply,
}: {
  properties: Property[];
  value: PropertyFilters;
  onApply: (filters: PropertyFilters) => void;
}) {
  const iconRef = useRef<SVGSVGElement>(null);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);

  const categories = useMemo(() => unique(properties.map((p) => p.category)), [properties]);
  const regions = useMemo(() => unique(properties.map((p) => p.region)), [properties]);
  const currencies = useMemo(() => unique(properties.map((p) => p.currency)), [properties]);
  const owners = useMemo(() => {
    const byId = new Map<string, string>();
    for (const property of properties) {
      if (property.owner) byId.set(property.owner.id, property.owner.name);
    }
    return [...byId].map(([id, name]) => ({ value: id, label: name }));
  }, [properties]);

  const resultCount = useMemo(
    () => applyFilters(properties, { ...draft, search: value.search }).length,
    [properties, draft, value.search],
  );
  const activeCount = countActiveFilters(value);

  // A small, quick shake of the icon on hover.
  function wiggle() {
    if (window.matchMedia(media.reduceMotion).matches) return;
    gsap.fromTo(
      iconRef.current,
      { rotation: 0 },
      {
        keyframes: [{ rotation: -9 }, { rotation: 7 }, { rotation: -4 }, { rotation: 0 }],
        duration: 0.5,
        ease: "power1.inOut",
        overwrite: true,
      },
    );
  }

  function update(patch: Partial<PropertyFilters>) {
    setDraft((current) => ({ ...current, ...patch }));
  }

  function handleOpenChange(next: boolean) {
    // Start every session from what is currently applied.
    if (next) setDraft(value);
    setOpen(next);
  }

  function apply() {
    onApply({ ...draft, search: value.search });
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <Tooltip>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Filtros"
              className="relative size-10 shrink-0 bg-foreground/[0.07] hover:bg-foreground/10 dark:bg-foreground/10"
              onPointerEnter={wiggle}
              onFocus={wiggle}
            >
              <SlidersHorizontal ref={iconRef} />
              {activeCount > 0 && (
                <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-primary text-[0.65rem] font-semibold text-primary-foreground tabular-nums ring-2 ring-background">
                  {activeCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom" sideOffset={10}>
          Filtros
        </TooltipContent>
      </Tooltip>
      <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-md">
        <SheetHeader className="gap-1 p-6 pb-4">
          <SheetTitle className="font-display text-3xl leading-none">Filtros</SheetTitle>
          <SheetDescription>Combiná los que necesites y aplicalos juntos.</SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-2">
          <Section title="Estado">
            <Segmented
              label="Estado"
              value={draft.status}
              options={[...STATUS_OPTIONS]}
              onChange={(status) => update({ status })}
            />
          </Section>

          <Section title="Tipo">
            <Segmented
              label="Tipo"
              value={draft.type}
              options={[...TYPE_OPTIONS]}
              onChange={(type) => update({ type })}
            />
          </Section>

          {categories.length > 0 && (
            <Section title="Categoría">
              <SelectFilter
                id="filter-category"
                value={draft.category}
                onChange={(category) => update({ category })}
                allLabel="Todas las categorías"
                options={categories.map((category) => ({ value: category, label: categoryLabel(category) }))}
              />
            </Section>
          )}

          {regions.length > 0 && (
            <Section title="Región">
              <SelectFilter
                id="filter-region"
                value={draft.region}
                onChange={(region) => update({ region })}
                allLabel="Todas las regiones"
                options={regions.map((region) => ({ value: region, label: region }))}
              />
            </Section>
          )}

          {owners.length > 0 && (
            <Section title="Propietario">
              <SelectFilter
                id="filter-owner"
                value={draft.owner}
                onChange={(owner) => update({ owner })}
                allLabel="Todos los propietarios"
                options={owners}
              />
            </Section>
          )}

          <Section title="Precio">
            {currencies.length > 1 && (
              <SelectFilter
                id="filter-currency"
                value={draft.currency}
                onChange={(currency) => update({ currency })}
                allLabel="Todas las monedas"
                options={currencies.map((currency) => ({ value: currency, label: currency }))}
              />
            )}
            <div className="grid grid-cols-2 gap-3">
              <Input
                inputMode="numeric"
                aria-label="Precio mínimo"
                placeholder="Mínimo"
                value={draft.minPrice}
                onChange={(event) => update({ minPrice: event.target.value.replace(/[^\d.,]/g, "") })}
                className="h-10 rounded-xl"
              />
              <Input
                inputMode="numeric"
                aria-label="Precio máximo"
                placeholder="Máximo"
                value={draft.maxPrice}
                onChange={(event) => update({ maxPrice: event.target.value.replace(/[^\d.,]/g, "") })}
                className="h-10 rounded-xl"
              />
            </div>
          </Section>

          <Section title="Dormitorios">
            <Segmented
              label="Dormitorios mínimos"
              value={draft.minBedrooms}
              options={MIN_OPTIONS}
              onChange={(minBedrooms) => update({ minBedrooms })}
            />
          </Section>

          <Section title="Baños">
            <Segmented
              label="Baños mínimos"
              value={draft.minBathrooms}
              options={MIN_OPTIONS}
              onChange={(minBathrooms) => update({ minBathrooms })}
            />
          </Section>
        </div>

        <SheetFooter className="flex-row gap-3 p-6 pt-4">
          <Button
            variant="ghost"
            className="h-10"
            onClick={() => setDraft({ ...DEFAULT_FILTERS, search: value.search })}
          >
            Limpiar
          </Button>
          <Button variant="highlight" className="h-10 flex-1" onClick={apply}>
            {resultCount === 1 ? "Ver 1 propiedad" : `Ver ${resultCount} propiedades`}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
