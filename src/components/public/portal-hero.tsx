"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

import { AgencyMark, SITE_WRAP } from "@/components/public/site-chrome";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PublicAgency } from "@/lib/api/agency";
import { useLabels } from "@/lib/labels";
import type { ResolvedSite } from "@/lib/site-theme";
import { cn } from "@/lib/utils";
import { IMAGE_WIDTH, sizedImage } from "@/lib/image-url";

export type Operation = "" | "SALE" | "RENT";

export interface SearchValues {
  op: Operation;
  zone: string;
  type: string;
}

const ALL = "__all";
const OPERATIONS: Operation[] = ["", "SALE", "RENT"];

/**
 * The three questions people ask first: buy or rent, where, and what kind of
 * place. Results update as they choose; the button takes them to the list.
 */
export function SearchBar({
  values,
  onChange,
  zones,
  types,
  resultCount,
  onSubmit,
  layout = "bar",
  className,
}: {
  values: SearchValues;
  onChange: (next: Partial<SearchValues>) => void;
  zones: string[];
  types: string[];
  resultCount: number;
  onSubmit: () => void;
  /** `bar` lines the fields up on wide screens; `stack` keeps them in a column. */
  layout?: "bar" | "stack";
  className?: string;
}) {
  const t = useTranslations("site.search");
  const labels = useLabels();
  const button = resultCount === 0 ? t("noResults") : t("seeResults", { count: resultCount });

  return (
    <form
      role="search"
      aria-label={t("label")}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className={cn(
        "grid gap-3 rounded-xl bg-white p-3 text-site-ink",
        layout === "bar" &&
          "lg:grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-end",
        className,
      )}
    >
      <fieldset className="flex flex-col gap-1.5">
        <legend className="mb-1.5 px-1 text-xs text-site-quiet">
          {t("operation")}
        </legend>
        <div
          role="radiogroup"
          aria-label={t("operation")}
          className="flex h-11 rounded-lg bg-site-surface p-1"
        >
          {OPERATIONS.map((value) => (
            <button
              key={value || "all"}
              type="button"
              role="radio"
              aria-checked={values.op === value}
              onClick={() => onChange({ op: value })}
              className={cn(
                "flex-1 rounded-md px-3.5 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-site-accent",
                values.op === value
                  ? "bg-white text-site-ink shadow-sm"
                  : "text-site-quiet hover:text-site-ink",
              )}
            >
              {value ? labels.listingType(value) : t("allOperations")}
            </button>
          ))}
        </div>
      </fieldset>

      <SearchSelect
        label={t("zone")}
        value={values.zone}
        allLabel={t("allZones")}
        options={zones.map((zone) => ({ value: zone, label: zone }))}
        onChange={(zone) => onChange({ zone })}
      />
      <SearchSelect
        label={t("type")}
        value={values.type}
        allLabel={t("allTypes")}
        options={types.map((type) => ({
          value: type,
          label: labels.category(type),
        }))}
        onChange={(type) => onChange({ type })}
      />

      <button
        type="submit"
        className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-site-accent px-5 text-sm font-medium whitespace-nowrap text-site-accent-ink outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-site-accent focus-visible:ring-offset-2"
      >
        <Search className="size-4" aria-hidden />
        {button}
      </button>
    </form>
  );
}

function SearchSelect({
  label,
  value,
  allLabel,
  options,
  onChange,
}: {
  label: string;
  value: string;
  allLabel: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <span className="px-1 text-xs text-site-quiet" aria-hidden>
        {label}
      </span>
      <Select
        value={value || ALL}
        onValueChange={(next) => onChange(next === ALL ? "" : next)}
      >
        <SelectTrigger
          aria-label={label}
          className="h-11! w-full rounded-lg border-0 bg-site-surface px-3.5 text-sm shadow-none"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{allLabel}</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

/** The top of the agency's home page, in the layout the agency picked. */
export function PortalHero({
  agency,
  site,
  search,
  photos = [],
}: {
  agency: PublicAgency;
  site: ResolvedSite;
  /** The search bar, rendered by the page so it shares the listing's filters. */
  search: (layout: "bar" | "stack") => React.ReactNode;
  /** Cover photos of some listings, for the `mosaico` collage when the agency picked none. */
  photos?: string[];
}) {
  const t = useTranslations("site.portal");
  const heroTitle = site.heroTitle ?? t("defaultHeroTitle");
  const subtitle = site.heroSubtitle && (
    <p className="max-w-xl text-lg text-pretty opacity-85">
      {site.heroSubtitle}
    </p>
  );

  if (site.template === "editorial") {
    return (
      <section
        className={cn(
          SITE_WRAP,
          "grid items-center gap-10 py-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-20",
        )}
      >
        <div className="flex flex-col gap-6">
          <h1 className="s-heading text-[clamp(2.75rem,5.4vw,5rem)] leading-[1] text-balance">
            {heroTitle}
          </h1>
          {subtitle}
          {search("stack")}
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-site-surface max-lg:max-h-[28rem] max-lg:aspect-[4/3]">
          {site.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={site.coverUrl}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center p-10">
              <AgencyMark agency={agency} />
            </div>
          )}
        </div>
      </section>
    );
  }

  if (site.template === "dividido") {
    // Edge to edge: the accent color holds the words, the cover photo the other half.
    return (
      <section className="grid lg:min-h-[clamp(32rem,70svh,44rem)] lg:grid-cols-2">
        <div className="relative order-first aspect-[4/3] bg-site-surface lg:order-last lg:aspect-auto">
          {site.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={site.coverUrl} alt="" className="absolute inset-0 size-full object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center p-10">
              <AgencyMark agency={agency} />
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center gap-6 bg-site-accent px-5 py-12 text-site-accent-ink sm:px-8 lg:py-16 lg:pr-14 lg:pl-[max(2rem,calc((100vw-72rem)/2+2rem))]">
          <h1 className="s-heading text-[clamp(2.5rem,4.6vw,4.25rem)] leading-[1.02] text-balance">
            {heroTitle}
          </h1>
          {subtitle}
          <div className="text-site-ink">{search("stack")}</div>
        </div>
      </section>
    );
  }

  if (site.template === "mosaico") {
    // The photos the agency picked; without them, its listings' covers make the collage.
    const picked = site.mosaicPhotos.length > 0 ? site.mosaicPhotos : photos;
    const tiles = (picked.length > 0 ? picked : site.coverUrl ? [site.coverUrl] : []).slice(0, 4);
    return (
      <section className={cn(SITE_WRAP, "flex flex-col gap-8 py-10 lg:py-14")}>
        <div className="flex flex-col gap-3">
          <h1 className="s-heading max-w-4xl text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.02] text-balance">
            {heroTitle}
          </h1>
          {subtitle && <div className="text-site-quiet">{subtitle}</div>}
        </div>
        {tiles.length > 0 && (
          <div
            className={cn(
              "grid h-[clamp(16rem,40vw,30rem)] gap-2 sm:gap-3",
              tiles.length === 1 && "grid-cols-1",
              tiles.length === 2 && "grid-cols-2",
              tiles.length === 3 && "grid-cols-[2fr_1fr] grid-rows-2",
              tiles.length === 4 && "grid-cols-2 grid-rows-2 sm:grid-cols-[2fr_1fr_1fr]",
            )}
          >
            {tiles.map((url, index) => (
              <div
                key={url + index}
                className={cn(
                  "overflow-hidden rounded-xl bg-site-surface",
                  tiles.length >= 3 && index === 0 && "row-span-2",
                  tiles.length === 4 && index === 0 && "max-sm:col-span-2 max-sm:row-span-1",
                  tiles.length === 4 && index === 3 && "sm:col-start-2 sm:col-span-2 max-sm:hidden",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={sizedImage(url, IMAGE_WIDTH.tile)} alt="" className="size-full object-cover" />
              </div>
            ))}
          </div>
        )}
        {search("bar")}
      </section>
    );
  }

  if (site.template === "compacto") {
    return (
      <section className="border-b border-site-line">
        <div className={cn(SITE_WRAP, "flex flex-col gap-6 py-10 lg:py-14")}>
          <div className="flex flex-col gap-3">
            <h1 className="s-heading text-[clamp(2rem,3.6vw,3rem)] leading-[1.05] text-balance">
              {heroTitle}
            </h1>
            {subtitle && <div className="text-site-quiet">{subtitle}</div>}
          </div>
          {search("bar")}
        </div>
      </section>
    );
  }

  // Portada: the cover photo fills the top, with the headline and search on it.
  // Without a cover, the accent color fills that space instead.
  return (
    <section
      className={cn(
        "relative isolate flex min-h-[clamp(30rem,78svh,46rem)] flex-col justify-end overflow-hidden",
        site.coverUrl ? "text-white" : "bg-site-accent text-site-accent-ink",
      )}
    >
      {site.coverUrl && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={site.coverUrl}
            alt=""
            className="absolute inset-0 -z-10 size-full object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 via-black/25 to-black/35"
          />
        </>
      )}
      <div
        className={cn(SITE_WRAP, "flex flex-col gap-6 pt-32 pb-10 lg:pb-14")}
      >
        <h1 className="s-heading max-w-3xl text-[clamp(2.5rem,6vw,4.75rem)] leading-[1.02] text-balance">
          {heroTitle}
        </h1>
        {subtitle}
        {search("bar")}
      </div>
    </section>
  );
}
