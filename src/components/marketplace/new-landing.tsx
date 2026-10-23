"use client";

import { useQuery } from "@tanstack/react-query";
import { differenceInCalendarDays, parseISO } from "date-fns";
import { ArrowUpRight, Compass, List, Map as MapIcon, X } from "lucide-react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { BlurEdge } from "@/components/dashboard/scroll-panel";
import { LogoIcon } from "@/components/logo-icon";
import { ListingCard } from "@/components/marketplace/listing-card";
import { SearchPanel } from "@/components/marketplace/search-panel";
import { SiteFooter } from "@/components/marketplace/site-footer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormat } from "@/i18n/format";
import { Link, useRouter } from "@/i18n/navigation";
import {
  searchMarketplace,
  type MarketplaceFacets,
  type MarketplaceQuery,
  type MarketplaceSort,
} from "@/lib/api/marketplace";
import { useLabels } from "@/lib/labels";
import { cn } from "@/lib/utils";

const ResultsMap = dynamic(() => import("@/components/marketplace/results-map"), {
  ssr: false,
  loading: () => <div className="size-full animate-pulse bg-mist" />,
});

const PATH = "/landing-test";
const WRAP = "mx-auto w-full max-w-7xl px-5 sm:px-8";

const SORTS: MarketplaceSort[] = ["recent", "price_asc", "price_desc"];

/** The search lives in the URL, so a result list can be shared or reloaded as is. */
function readQuery(params: URLSearchParams): MarketplaceQuery {
  const number = (key: string) => (params.get(key) ? Number(params.get(key)) : undefined);
  const operation = params.get("op");
  const sort = params.get("sort");
  return {
    operation: operation === "RENT" || operation === "SALE" ? operation : undefined,
    zone: params.get("zone") ?? undefined,
    category: params.get("type") ?? undefined,
    checkIn: params.get("in") ?? undefined,
    checkOut: params.get("out") ?? undefined,
    guests: number("guests"),
    maxPrice: number("max"),
    sort: SORTS.includes(sort as MarketplaceSort) ? (sort as MarketplaceSort) : undefined,
  };
}

function writeQuery(query: MarketplaceQuery) {
  const params = new URLSearchParams();
  const entries: [string, string | number | undefined][] = [
    ["op", query.operation],
    ["zone", query.zone],
    ["type", query.category],
    ["in", query.checkIn],
    ["out", query.checkOut],
    ["guests", query.guests],
    ["max", query.maxPrice],
    ["sort", query.sort && query.sort !== "recent" ? query.sort : undefined],
  ];
  for (const [key, value] of entries) if (value !== undefined && value !== "") params.set(key, String(value));
  return params.toString();
}

/**
 * Nothing matched. With a place that has nothing yet, it says so by name and
 * points to the destinations that do; otherwise it suggests loosening filters.
 */
function EmptyResults({
  query,
  facets,
  onSearch,
}: {
  query: MarketplaceQuery;
  facets: MarketplaceFacets;
  onSearch: (query: MarketplaceQuery) => void;
}) {
  const t = useTranslations("marketplace.empty");
  const hasDates = Boolean(query.checkIn && query.checkOut);
  const elsewhere = facets.zones.filter((zone) => zone.name !== query.zone && zone.coverUrl).slice(0, 4);
  const button =
    "inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-medium outline-none focus-visible:ring-3 focus-visible:ring-forest/30";

  return (
    <div className="flex flex-col gap-10 border-y border-line py-12 lg:py-16">
      <div className="flex max-w-2xl flex-col gap-4">
        <span className="flex size-12 items-center justify-center rounded-full bg-forest text-lime">
          <Compass className="size-5" />
        </span>
        <h3 className="font-display text-[clamp(1.75rem,3.2vw,2.5rem)] leading-tight tracking-tight text-balance">
          {query.zone ? (
            <>
              {t("zoneTitle", { zone: query.zone })}{" "}
              <span className="text-quiet">{hasDates ? t("zoneDates") : t("zoneSoon")}</span>
            </>
          ) : (
            <>
              {t("title")} <span className="text-quiet">{t("titleTail")}</span>
            </>
          )}
        </h3>
        <p className="text-quiet">
          {query.zone
            ? t("zoneBody")
            : t("body")}
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {query.zone && (
            <button
              type="button"
              onClick={() => onSearch({ ...query, zone: undefined })}
              className={cn(button, "bg-forest text-paper hover:bg-forest-deep")}
            >
              {t("everywhere")}
            </button>
          )}
          {hasDates && (
            <button
              type="button"
              onClick={() => onSearch({ ...query, checkIn: undefined, checkOut: undefined })}
              className={cn(button, "border border-line hover:border-ink")}
            >
              {t("noDates")}
            </button>
          )}
          {!query.zone && !hasDates && (
            <button
              type="button"
              onClick={() => onSearch({})}
              className={cn(button, "bg-forest text-paper hover:bg-forest-deep")}
            >
              {t("all")}
            </button>
          )}
        </div>
      </div>

      {elsewhere.length > 0 && (
        <div className="flex flex-col gap-4">
          <h4 className="text-sm font-medium text-quiet">{t("destinations")}</h4>
          <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {elsewhere.map((zone) => (
              <li key={zone.name}>
                <button
                  type="button"
                  onClick={() => onSearch({ ...query, zone: zone.name })}
                  className="group flex w-full flex-col gap-2 rounded-2xl text-left outline-none focus-visible:ring-3 focus-visible:ring-forest/30"
                >
                  <span className="block aspect-[4/3] overflow-hidden rounded-2xl bg-mist">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={zone.coverUrl!}
                      alt=""
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  </span>
                  <span className="flex flex-col">
                    <span className="font-medium">{zone.name}</span>
                    {(zone.region || zone.country) && (
                      <span className="text-sm text-quiet">{[zone.region, zone.country].filter(Boolean).join(", ")}</span>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function NewLanding({ facets }: { facets: MarketplaceFacets }) {
  const t = useTranslations("marketplace");
  const labels = useLabels();
  const { number, date } = useFormat();
  const shortDate = (iso: string) => date(parseISO(iso), "dayMonthShort");
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = useMemo(() => readQuery(new URLSearchParams(searchParams.toString())), [searchParams]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);
  const heroSearchRef = useRef<HTMLDivElement>(null);
  // The hero's search is out of view: the compact one takes over, with the top blur under it.
  const [pinned, setPinned] = useState(false);
  const [moreBelow, setMoreBelow] = useState(true);
  // The blurs fade to paper, so over the dark footer they'd read as a haze: they step aside there.
  const [footerAtBottom, setFooterAtBottom] = useState(false);
  const [footerAtTop, setFooterAtTop] = useState(false);

  useEffect(() => {
    const target = heroSearchRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) =>
      setPinned(!entry.isIntersecting && entry.boundingClientRect.top < 0),
    );
    observer.observe(target);
    function onScroll() {
      const root = document.documentElement;
      setMoreBelow(root.scrollHeight - window.scrollY - window.innerHeight > 8);
      const footerTop = document.getElementById("pie")?.getBoundingClientRect().top ?? Infinity;
      setFooterAtBottom(footerTop < window.innerHeight - 24);
      setFooterAtTop(footerTop < 112);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const {
    data: results,
    isLoading,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["marketplace", query],
    queryFn: () => searchMarketplace(query),
    placeholderData: (previous) => previous,
  });

  const go = useCallback(
    (next: MarketplaceQuery, scroll = true) => {
      const qs = writeQuery(next);
      router.replace(qs ? `${PATH}?${qs}` : PATH, { scroll: false });
      if (scroll) document.getElementById("resultados")?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [router],
  );

  const selectOnMap = useCallback((id: string) => {
    setActiveId(id);
    document.getElementById(`listing-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const nights =
    query.checkIn && query.checkOut
      ? Math.max(differenceInCalendarDays(parseISO(query.checkOut), parseISO(query.checkIn)), 0) || undefined
      : undefined;

  // What's applied, each with its own way out.
  const applied = [
    query.operation && {
      label: query.operation === "RENT" ? t("card.rent") : t("card.sale"),
      clear: { operation: undefined, checkIn: undefined, checkOut: undefined, guests: undefined, maxPrice: undefined },
    },
    query.zone && { label: query.zone, clear: { zone: undefined } },
    query.category && { label: labels.category(query.category), clear: { category: undefined } },
    query.checkIn &&
      query.checkOut && {
        label: `${shortDate(query.checkIn)} – ${shortDate(query.checkOut)}`,
        clear: { checkIn: undefined, checkOut: undefined },
      },
    query.guests && {
      label: t("search.guestsCount", { count: query.guests }),
      clear: { guests: undefined },
    },
    query.maxPrice && { label: t("results.upTo", { amount: `USD ${number(query.maxPrice)}` }), clear: { maxPrice: undefined } },
  ].filter(Boolean) as { label: string; clear: Partial<MarketplaceQuery> }[];
  const filtered = applied.length > 0;
  const heroPhotos = facets.zones
    .map((zone) => zone.coverUrl)
    .filter((url): url is string => Boolean(url))
    .slice(0, 3);
  const count = results?.length ?? 0;

  return (
    <div className="landing flex min-h-svh flex-1 flex-col">
      <BlurEdge edge="top" visible={pinned && !footerAtTop} fixed />
      {/* Only over the paper sections: on the green hero it would read as a haze. */}
      <BlurEdge edge="bottom" visible={pinned && moreBelow && !footerAtBottom} fixed />
      {/* The search follows you once the hero's is gone. */}
      <div
        aria-hidden={!pinned}
        inert={!pinned}
        className={cn(
          "fixed inset-x-0 top-3 z-40 px-3 transition-[opacity,transform] duration-300 ease-out sm:top-4 sm:px-8",
          pinned ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-6 opacity-0",
        )}
      >
        <div className="mx-auto max-w-6xl">
          <SearchPanel
            key={`bar-${writeQuery(query)}`}
            compact
            facets={facets}
            value={query}
            onSearch={(next) => go(next)}
          />
        </div>
      </div>
      {/* Hero: the forest block holds the one decision that matters, the search. */}
      <section className="bg-forest text-paper">
        <header className={cn(WRAP, "flex h-16 items-center justify-between gap-4")}>
          <Link href={PATH} className="inline-flex items-center gap-2 font-display text-xl tracking-tight">
            <LogoIcon className="text-lime" />
            Tivvo
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            <button
              type="button"
              onClick={() => go({ operation: "RENT" })}
              className="hidden h-9 rounded-full px-3.5 text-paper/80 hover:bg-paper/10 hover:text-paper sm:inline-flex sm:items-center"
            >
              {t("nav.rentals")}
            </button>
            <button
              type="button"
              onClick={() => go({ operation: "SALE" })}
              className="hidden h-9 rounded-full px-3.5 text-paper/80 hover:bg-paper/10 hover:text-paper sm:inline-flex sm:items-center"
            >
              {t("search.buy")}
            </button>
            <Link
              href="/"
              className="inline-flex h-9 items-center gap-1 rounded-full border border-paper/25 px-3.5 text-paper hover:bg-paper/10"
            >
              {t("nav.agency")}
              <ArrowUpRight className="size-3.5" />
            </Link>
          </nav>
        </header>

        <div className={cn(WRAP, "flex flex-col gap-10 pt-14 pb-16 lg:pt-20 lg:pb-24")}>
          <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
            <div className="flex max-w-3xl flex-col gap-5">
              <h1 className="font-display text-[clamp(2.75rem,6.5vw,5.5rem)] leading-[0.98] tracking-tight text-balance">
                {t("hero.title")} <span className="text-paper/45">{t("hero.titleTail")}</span>
              </h1>
              <p className="max-w-xl text-lg text-paper/75">
                {t("hero.lead")}
              </p>
            </div>
            {/* Real listings, not stock photos: one tall and two stacked. */}
            {heroPhotos.length >= 3 && (
              <div aria-hidden className="hidden h-[23rem] grid-cols-[1.15fr_1fr] grid-rows-2 gap-3 lg:grid">
                {heroPhotos.map((url, index) => (
                  <div
                    key={url}
                    className={cn("overflow-hidden rounded-2xl bg-forest-deep", index === 0 && "row-span-2")}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="size-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div ref={heroSearchRef}>
            <SearchPanel key={writeQuery(query)} facets={facets} value={query} onSearch={(next) => go(next)} />
          </div>
        </div>
      </section>

      <main className="flex-1">
        {/* A way in by place, straight into the results. */}
        {facets.zones.length > 0 && (
          <section className={cn(WRAP, "flex flex-col gap-12 py-14 lg:py-20")}>
            {facets.zones.length > 0 && (
              <div className="flex flex-col gap-4">
                <h2 className="font-display text-2xl tracking-tight">{t("byDestination")}</h2>
                <ul className="-mx-5 flex snap-x scroll-px-5 gap-4 overflow-x-auto px-5 pb-3 sm:-mx-8 sm:scroll-px-8 sm:px-8">
                  {facets.zones.map((zone) => (
                    <li key={zone.name} className="w-56 shrink-0 snap-start lg:w-64">
                      <button
                        type="button"
                        onClick={() => go({ ...query, zone: zone.name })}
                        className="group flex w-full flex-col gap-2.5 text-left outline-none focus-visible:ring-3 focus-visible:ring-forest/30 rounded-2xl"
                      >
                        <span className="block aspect-[4/5] overflow-hidden rounded-2xl bg-mist">
                          {zone.coverUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={zone.coverUrl}
                              alt=""
                              loading="lazy"
                              className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                            />
                          )}
                        </span>
                        <span className="flex flex-col">
                          <span className="font-medium">{zone.name}</span>
                          {(zone.region || zone.country) && (
                            <span className="text-sm text-quiet">
                              {[zone.region, zone.country].filter(Boolean).join(", ")}
                            </span>
                          )}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* Results: a list, or a list beside the map. */}
        <section id="resultados" className="scroll-mt-4 border-t border-line">
          <div className={cn(WRAP, "flex flex-col gap-6 py-12 lg:py-16")}>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h2 className="font-display text-3xl tracking-tight">
                  {filtered ? t("results.title") : t("results.latest")}
                </h2>
                <p className="text-quiet">
                  {query.checkIn && query.checkOut
                    ? t("results.free")
                    : filtered
                      ? t("results.chosen")
                      : t("results.latestHint")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={query.sort ?? "recent"}
                  onValueChange={(sort) => go({ ...query, sort: sort as MarketplaceSort }, false)}
                >
                  <SelectTrigger aria-label={t("results.sort")} className="h-10! rounded-full border-line bg-paper px-4 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="landing">
                    {SORTS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {t(`results.sorts.${option}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <button
                  type="button"
                  onClick={() => setShowMap((value) => !value)}
                  aria-pressed={showMap}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 text-sm hover:border-ink"
                >
                  {showMap ? <List className="size-4" /> : <MapIcon className="size-4" />}
                  {showMap ? t("results.list") : t("results.map")}
                </button>
              </div>
            </div>

            {applied.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {applied.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => go({ ...query, ...item.clear }, false)}
                    className="inline-flex h-8 items-center gap-1.5 rounded-full bg-mist pr-2.5 pl-3 text-sm hover:bg-line"
                  >
                    {item.label}
                    <X className="size-3.5" aria-label={t("results.remove")} />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => go({}, false)}
                  className="h-8 px-2 text-sm font-medium underline-offset-4 hover:underline"
                >
                  {t("results.clearAll")}
                </button>
              </div>
            )}

            <div className={cn(showMap && "grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]")}>
              <div
                className={cn(showMap && "max-lg:hidden", isPlaceholderData && "opacity-60 transition-opacity")}
              >
                {isLoading ? (
                  <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                    {[0, 1, 2].map((index) => (
                      <div key={index} className="flex animate-pulse flex-col gap-3">
                        <div className="aspect-[4/3] rounded-2xl bg-mist" />
                        <div className="h-4 w-2/3 rounded-full bg-mist" />
                        <div className="h-4 w-1/3 rounded-full bg-mist" />
                      </div>
                    ))}
                  </div>
                ) : count === 0 ? (
                  <EmptyResults query={query} facets={facets} onSearch={(next) => go(next, false)} />
                ) : (
                  <div
                    className={cn(
                      "grid gap-x-6 gap-y-10 sm:grid-cols-2",
                      showMap ? "xl:grid-cols-2" : "lg:grid-cols-3",
                    )}
                  >
                    {results!.map((property) => (
                      <ListingCard
                        key={property.id}
                        property={property}
                        nights={nights}
                        active={activeId === property.id}
                        onHover={setActiveId}
                      />
                    ))}
                  </div>
                )}
              </div>
              {showMap && (
                <div className="h-[70svh] overflow-hidden rounded-2xl border border-line lg:sticky lg:top-6 lg:h-[calc(100svh-3rem)]">
                  <ResultsMap properties={results ?? []} activeId={activeId} onSelect={selectOnMap} />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* How it works: a real sequence, so numbered. */}
        <section id="como-funciona" className="scroll-mt-24 border-t border-line bg-mist/60">
          <div className={cn(WRAP, "grid gap-10 py-14 lg:grid-cols-[1fr_2fr] lg:gap-16 lg:py-20")}>
            <h2 className="font-display text-3xl leading-tight tracking-tight text-balance">
              {t("how.title")} <span className="text-quiet">{t("how.titleTail")}</span>
            </h2>
            <ol className="grid gap-8 sm:grid-cols-3">
              {(["search", "ask", "arrange"] as const).map((key) => ({
                title: t(`how.${key}.title`),
                text: t(`how.${key}.text`),
              })).map((step, index) => (
                <li key={step.title} className="flex flex-col gap-2 border-t border-ink/15 pt-4">
                  <span className="font-display text-sm text-quiet tabular-nums">{index + 1}</span>
                  <span className="font-display text-xl">{step.title}</span>
                  <p className="text-quiet">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

      </main>

      <SiteFooter facets={facets} />
    </div>
  );
}
