"use client";

import { MapPin, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useId, useMemo, useRef, useState } from "react";

import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import type { MarketplaceZone } from "@/lib/api/marketplace";
import { cn } from "@/lib/utils";

// Key-less place search over OpenStreetMap: towns, cities, provinces and countries.
const PHOTON_URL = "https://photon.komoot.io/api/";

interface Suggestion {
  name: string;
  detail: string;
  /** A destination that already has listings. */
  withListings: boolean;
}

/** Lowercase and without accents, so "cordoba" finds "Córdoba". */
const fold = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

interface PhotonFeature {
  properties: { name?: string; state?: string; country?: string; osm_value?: string };
}

// Kinds of place worth travelling to, most relevant first: a town before a
// same-named village on the other side of the world.
const PLACE_KINDS = ["country", "state", "province", "region", "city", "town", "suburb", "village"];

async function searchPlaces(text: string, signal: AbortSignal): Promise<Suggestion[]> {
  const params = new URLSearchParams({ q: text, limit: "12", lang: "default" });
  for (const kind of PLACE_KINDS) params.append("osm_tag", `place:${kind}`);
  const response = await fetch(`${PHOTON_URL}?${params}`, { signal });
  if (!response.ok) return [];
  const { features } = (await response.json()) as { features: PhotonFeature[] };
  const rank = (feature: PhotonFeature) => {
    const index = PLACE_KINDS.indexOf(feature.properties.osm_value ?? "");
    return index === -1 ? PLACE_KINDS.length : index;
  };
  const seen = new Set<string>();
  const places: Suggestion[] = [];
  for (const { properties } of [...features].sort((a, b) => rank(a) - rank(b))) {
    if (!properties.name) continue;
    const detail = [properties.state, properties.country].filter((part) => part && part !== properties.name).join(", ");
    const key = fold(`${properties.name}|${detail}`);
    if (seen.has(key)) continue;
    seen.add(key);
    places.push({ name: properties.name, detail, withListings: false });
  }
  return places.slice(0, 5);
}

/**
 * Where to: type any place. Destinations with listings come first; below
 * them, real places from the map, so a search can aim anywhere even before
 * there are listings there. Enter keeps whatever was typed.
 */
export function DestinationField({
  value,
  onChange,
  zones,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  zones: MarketplaceZone[];
  className?: string;
}) {
  const t = useTranslations("marketplace.destination");
  const id = useId();
  const [text, setText] = useState(value);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [places, setPlaces] = useState<Suggestion[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const term = fold(text.trim());
  const known = useMemo<Suggestion[]>(
    () =>
      zones
        .filter((zone) => !term || fold([zone.name, zone.region, zone.country].join(" ")).includes(term))
        .slice(0, term ? 5 : 6)
        .map((zone) => ({
          name: zone.name,
          detail: [zone.region, zone.country].filter(Boolean).join(", "),
          withListings: true,
        })),
    [zones, term],
  );

  // Places from the map, a moment after typing stops; the ones already listed aren't repeated.
  useEffect(() => {
    if (term.length < 2) return;
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      searchPlaces(text.trim(), controller.signal)
        .then(setPlaces)
        .catch(() => {});
    }, 250);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [term, text]);

  const knownNames = new Set(known.map((entry) => fold(entry.name)));
  // Short or empty text shows only the destinations with listings.
  const shownPlaces = term.length >= 2 ? places : [];
  const listed = [...known, ...shownPlaces.filter((place) => !knownNames.has(fold(place.name)))];
  // What was typed is always an option, even if no place by that name shows up.
  const typed: Suggestion | null =
    term.length >= 2 && !listed.some((entry) => fold(entry.name) === term)
      ? { name: text.trim(), detail: t("typed"), withListings: false }
      : null;
  const suggestions = typed ? [typed, ...listed] : listed;

  function choose(name: string) {
    setText(name);
    onChange(name);
    setOpen(false);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActive((index) => Math.min(index + 1, suggestions.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter" && open) {
      // Picks the highlighted suggestion; without one, what was typed. The form isn't sent yet.
      event.preventDefault();
      const picked = suggestions[active];
      choose(picked && term ? picked.name : text.trim());
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  const listId = `${id}-list`;
  const withListings = listed.filter((entry) => entry.withListings);
  const elsewhere = listed.filter((entry) => !entry.withListings);

  return (
    <Popover open={open && suggestions.length > 0} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div className={cn("relative", className)}>
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-quiet" />
          <input
            ref={inputRef}
            role="combobox"
            aria-label={t("label")}
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            value={text}
            placeholder={t("placeholder")}
            onChange={(event) => {
              setText(event.target.value);
              onChange(event.target.value);
              setActive(0);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            className="h-11 w-full rounded-xl bg-ink/[0.07] pr-3 pl-10 text-sm transition-[background-color,box-shadow] duration-300 outline-none placeholder:text-quiet hover:bg-ink/10 focus:bg-white focus:shadow-[0_8px_24px_-12px_oklch(0.3_0.05_160/0.3)]"
          />
        </div>
      </PopoverAnchor>
      <PopoverContent
        align="start"
        sideOffset={8}
        className="landing w-(--radix-popover-trigger-width) min-w-72 gap-0 rounded-2xl p-1.5"
        onOpenAutoFocus={(event) => event.preventDefault()}
        onInteractOutside={(event) => {
          if (event.target instanceof Node && inputRef.current?.parentElement?.contains(event.target)) event.preventDefault();
        }}
      >
        <ul id={listId} role="listbox" aria-label="Destinos" className="flex flex-col">
          {[
            { title: "", items: typed ? [typed] : [] },
            { title: term ? t("withListings") : t("destinations"), items: withListings },
            { title: t("elsewhere"), items: elsewhere },
          ]
            .filter((group) => group.items.length > 0)
            .map((group) => (
              <li key={group.title} role="presentation" className="flex flex-col">
                {group.title && <span className="px-2.5 pt-2 pb-1 text-xs font-medium text-quiet">{group.title}</span>}
                <ul role="group" className="flex flex-col">
                  {group.items.map((entry) => {
                    const index = suggestions.indexOf(entry);
                    return (
                      <li
                        key={`${entry.name}-${entry.detail}`}
                        role="option"
                        aria-selected={index === active}
                        onMouseEnter={() => setActive(index)}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => choose(entry.name)}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2",
                          index === active && "bg-mist",
                        )}
                      >
                        <span
                          className={cn(
                            "flex size-8 shrink-0 items-center justify-center rounded-lg",
                            entry.withListings ? "bg-forest text-lime" : "bg-mist text-quiet",
                          )}
                        >
                          {entry === typed ? <Search className="size-4" /> : <MapPin className="size-4" />}
                        </span>
                        <span className="flex min-w-0 flex-col">
                          <span className="truncate text-sm font-medium">{entry.name}</span>
                          {entry.detail && <span className="truncate text-xs text-quiet">{entry.detail}</span>}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
