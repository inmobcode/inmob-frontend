"use client";

import { SearchX } from "lucide-react";
import { useMemo, useState } from "react";

import { AvailabilityGrid, type AvailabilityRow } from "@/components/availability/availability-grid";
import { AvailabilityLegend } from "@/components/availability/availability-legend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/combobox";
import { placeMatches, uniquePlaces } from "@/lib/places";

const PAGE_SIZE = 25;
const ALL_PLACES = "__all__";

function normalize(text: string) {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

/**
 * Search box + "Ver más" pagination wrapped around the availability grid, so
 * an agency with a long rental portfolio doesn't render every property's
 * 90-day row at once. Shared between the dashboard tool and its public link.
 */
export function AvailabilityCalendarView({
  from,
  to,
  properties,
  openLinksInNewTab = false,
}: {
  from: string;
  to: string;
  properties: AvailabilityRow[];
  /** The public calendar opens a listing beside itself: the visitor was reading dates. */
  openLinksInNewTab?: boolean;
}) {
  const [search, setSearch] = useState("");
  const [place, setPlace] = useState(ALL_PLACES);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Every place a listing is in (area, region or country), each spelled once.
  const places = useMemo(
    () => uniquePlaces(properties.flatMap((property) => [property.area, property.region, property.country])),
    [properties],
  );

  const term = normalize(search);
  const filtered = properties.filter(
    (property) =>
      (place === ALL_PLACES || placeMatches(property, place)) && (!term || normalize(property.title).includes(term)),
  );
  const shown = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > shown.length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            placeholder="Buscar propiedad…"
            aria-label="Buscar propiedad"
            className="h-10 w-full sm:w-64"
          />
          {places.length > 0 && (
            <Combobox
              ariaLabel="Ubicación"
              value={place}
              onChange={(next) => {
                setPlace(next);
                setVisibleCount(PAGE_SIZE);
              }}
              allValue={ALL_PLACES}
              allLabel="Todas las ubicaciones"
              searchPlaceholder="Buscar ubicación…"
              emptyText="Ninguna ubicación coincide."
              options={places.map((option) => ({ value: option, label: option }))}
              className="w-full sm:w-56"
            />
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Mostrando {shown.length} de {filtered.length} {filtered.length === 1 ? "propiedad" : "propiedades"}
          {!search.trim() && place === ALL_PLACES && " · próximos 90 días"}
        </p>
      </div>

      <AvailabilityLegend />

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl bg-card px-6 py-12 text-center ring-1 ring-foreground/5">
          <SearchX className="size-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {search.trim()
              ? `Ninguna propiedad coincide con "${search.trim()}".`
              : "Ninguna propiedad está en esa ubicación."}
          </p>
        </div>
      ) : (
        <>
          <AvailabilityGrid from={from} to={to} properties={shown} openLinksInNewTab={openLinksInNewTab} />
          {hasMore && (
            <Button variant="outline" className="self-center" onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}>
              Ver más
            </Button>
          )}
        </>
      )}
    </div>
  );
}
