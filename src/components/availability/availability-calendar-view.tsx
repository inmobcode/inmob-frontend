"use client";

import { SearchX } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { AvailabilityGrid, type AvailabilityRow } from "@/components/availability/availability-grid";
import { AvailabilityLegend } from "@/components/availability/availability-legend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/combobox";
import { DateRangePicker } from "@/components/ui/date-picker";
import { isFreeFor } from "@/lib/availability-range";
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
  viewControl,
}: {
  from: string;
  to: string;
  properties: AvailabilityRow[];
  /** The public calendar opens a listing beside itself: the visitor was reading dates. */
  openLinksInNewTab?: boolean;
  /** Something to put at the far right of the filters (the dashboard's view switch). */
  viewControl?: React.ReactNode;
}) {
  const t = useTranslations("availability.grid");
  const [search, setSearch] = useState("");
  const [place, setPlace] = useState(ALL_PLACES);
  const [range, setRange] = useState({ start: "", end: "" });
  const [onlyFree, setOnlyFree] = useState(true);
  const hasRange = !!range.start && !!range.end;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Every place a listing is in (area, region or country), each spelled once.
  const places = useMemo(
    () => uniquePlaces(properties.flatMap((property) => [property.area, property.region, property.country])),
    [properties],
  );

  const term = normalize(search);
  const filtered = properties.filter(
    (property) =>
      (place === ALL_PLACES || placeMatches(property, place)) &&
      (!term || normalize(property.title).includes(term)) &&
      (!hasRange || !onlyFree || isFreeFor(property.blockedDates, range.start, range.end)),
  );
  const shown = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > shown.length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setVisibleCount(PAGE_SIZE);
          }}
          placeholder={t("searchPlaceholder")}
          aria-label={t("search")}
          data-list-search
          className="h-10 w-full sm:w-64"
        />
        {places.length > 0 && (
          <Combobox
            ariaLabel={t("location")}
            value={place}
            onChange={(next) => {
              setPlace(next);
              setVisibleCount(PAGE_SIZE);
            }}
            allValue={ALL_PLACES}
            allLabel={t("allLocations")}
            searchPlaceholder={t("searchLocation")}
            emptyText={t("noLocation")}
            options={places.map((option) => ({ value: option, label: option }))}
            className="w-full sm:w-56"
          />
        )}

        <div className="flex w-full flex-wrap items-center gap-3 sm:ml-auto sm:w-auto sm:flex-nowrap">
          {hasRange && (
            <>
              <label className="flex cursor-pointer items-center gap-2 text-sm whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={onlyFree}
                  onChange={(event) => {
                    setOnlyFree(event.target.checked);
                    setVisibleCount(PAGE_SIZE);
                  }}
                  className="size-4 accent-[var(--primary)]"
                />
                {t("onlyFree")}
              </label>
              <Button variant="ghost" size="sm" onClick={() => setRange({ start: "", end: "" })}>
                {t("clearDates")}
              </Button>
            </>
          )}
          <div className="w-full sm:w-72">
            <DateRangePicker
              start={range.start}
              end={range.end}
              onChange={(start, end) => {
                setRange({ start, end });
                setVisibleCount(PAGE_SIZE);
              }}
              placeholder={t("pickDates")}
              minDate={new Date(`${from}T00:00:00`)}
            />
          </div>
          {viewControl && <div className="w-full sm:w-auto">{viewControl}</div>}
        </div>
      </div>

      <AvailabilityLegend showPending={properties.some((property) => (property.pendingDates?.length ?? 0) > 0)} />

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl bg-card px-6 py-12 text-center ring-1 ring-foreground/5">
          <SearchX className="size-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {hasRange && onlyFree
              ? t("noneFree")
              : search.trim()
                ? t("noneMatch", { search: search.trim() })
                : t("noneInLocation")}
          </p>
        </div>
      ) : (
        <>
          <AvailabilityGrid
            from={from}
            to={to}
            properties={shown}
            openLinksInNewTab={openLinksInNewTab}
            highlight={hasRange ? { start: range.start, end: range.end } : null}
          />
          {hasMore && (
            <Button variant="outline" className="self-center" onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}>
              {t("seeMore")}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
