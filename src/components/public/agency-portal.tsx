"use client";

import { useQuery } from "@tanstack/react-query";
import { Mail, MessageCircle, Phone, SlidersHorizontal, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { InquiryForm } from "@/components/public/inquiry-form";
import { PortalSections } from "@/components/public/portal-sections";
import {
  type Operation,
  PortalHero,
  SearchBar,
} from "@/components/public/portal-hero";
import {
  PropertyCardSkeleton,
  PublicPropertyCard,
  coverPhoto,
} from "@/components/public/property-card";
import {
  SITE_WRAP,
  SiteFooter,
  SiteHeader,
  SiteRoot,
} from "@/components/public/site-chrome";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PublicAgency, SiteTemplate } from "@/lib/api/agency";
import { listPublicProperties, type Property } from "@/lib/api/properties";
import { LISTING_TYPE_LABELS, categoryLabel } from "@/lib/properties-labels";
import { type ResolvedSite, whatsappLink } from "@/lib/site-theme";
import { richTextHtml } from "@/lib/rich-text";
import { cn } from "@/lib/utils";

type Sort = "recent" | "price-asc" | "price-desc";

interface Filters {
  op: Operation;
  zone: string;
  type: string;
  minPrice: string;
  maxPrice: string;
  beds: string;
  q: string;
  sort: Sort;
}

const EMPTY: Filters = {
  op: "",
  zone: "",
  type: "",
  minPrice: "",
  maxPrice: "",
  beds: "",
  q: "",
  sort: "recent",
};

function filtersFromParams(params: URLSearchParams): Filters {
  const op = params.get("op");
  const sort = params.get("sort");
  return {
    op: op === "SALE" || op === "RENT" ? op : "",
    zone: params.get("zona") ?? "",
    type: params.get("tipo") ?? "",
    minPrice: params.get("desde") ?? "",
    maxPrice: params.get("hasta") ?? "",
    beds: params.get("dorm") ?? "",
    q: params.get("q") ?? "",
    sort: sort === "price-asc" || sort === "price-desc" ? sort : "recent",
  };
}

const PARAM_NAMES: Record<keyof Filters, string> = {
  op: "op",
  zone: "zona",
  type: "tipo",
  minPrice: "desde",
  maxPrice: "hasta",
  beds: "dorm",
  q: "q",
  sort: "sort",
};

/** Distinct, non-empty values in the order they first appear. */
function distinct(values: (string | null | undefined)[]) {
  return [
    ...new Set(
      values.filter((value): value is string => Boolean(value && value.trim())),
    ),
  ];
}

function matches(property: Property, filters: Filters) {
  if (filters.op && property.listingType !== filters.op) return false;
  if (filters.type && property.category !== filters.type) return false;
  if (
    filters.zone &&
    ![property.area, property.region, property.country].includes(filters.zone)
  )
    return false;
  if (filters.beds && (property.bedrooms ?? 0) < Number(filters.beds))
    return false;
  if (
    filters.minPrice &&
    (property.price == null || property.price < Number(filters.minPrice))
  )
    return false;
  if (
    filters.maxPrice &&
    (property.price == null || property.price > Number(filters.maxPrice))
  )
    return false;
  if (filters.q) {
    const haystack = [
      property.title,
      property.area,
      property.region,
      property.country,
      property.content?.summary,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(filters.q.toLowerCase())) return false;
  }
  return true;
}

const BEDS = ["", "1", "2", "3", "4"];

/**
 * An agency's public home: the hero in the layout they picked, then their
 * listings with filters, then who they are and how to reach them.
 *
 * Agencies publish tens to a few hundred properties, so the whole catalog is
 * loaded once and filtered here: results change instantly as people choose.
 * `preview` renders the same page inside the dashboard's site editor, without
 * touching the address bar.
 */
/** How each layout lays out the listing. */
const LISTING_GRID: Record<SiteTemplate, string> = {
  portada: "grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3",
  dividido: "grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3",
  editorial: "grid gap-x-8 gap-y-12 md:grid-cols-2",
  compacto: "grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4",
  // The first listing takes a double cell, like the head of the collage.
  mosaico:
    "grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:[&>*:first-child]:col-span-2 lg:[&>*:first-child]:row-span-2",
};

/**
 * Renders a piece of the page in the desktop layout and, when the agency
 * picked a different one for phones, again in that one: CSS shows each on its
 * screen size, so it also works inside the editor's phone-sized preview.
 */
function ByViewport({
  site,
  children,
}: {
  site: ResolvedSite;
  children: (template: SiteTemplate) => React.ReactNode;
}) {
  if (site.template === site.templateMobile) return children(site.template);
  return (
    <>
      <div className="contents max-md:hidden">{children(site.template)}</div>
      <div className="contents md:hidden">{children(site.templateMobile)}</div>
    </>
  );
}

export function AgencyPortal({
  agencySlug,
  agency,
  site,
  initialProperties,
  preview = false,
}: {
  agencySlug: string;
  agency: PublicAgency;
  site: ResolvedSite;
  initialProperties?: Property[];
  preview?: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<Filters>(() =>
    preview ? EMPTY : filtersFromParams(searchParams),
  );
  const [showMore, setShowMore] = useState(() =>
    Boolean(filters.minPrice || filters.maxPrice || filters.beds || filters.q),
  );

  const { data: properties, isLoading } = useQuery({
    queryKey: ["public-properties", agencySlug],
    queryFn: () => listPublicProperties(agencySlug),
    initialData: initialProperties,
  });

  const all = useMemo(() => properties ?? [], [properties]);
  const zones = useMemo(
    () => distinct(all.flatMap((p) => [p.area, p.region, p.country])),
    [all],
  );
  const types = useMemo(() => distinct(all.map((p) => p.category)), [all]);
  const results = useMemo(() => {
    const found = all.filter((property) => matches(property, filters));
    if (filters.sort === "recent") return found;
    // Listings without a price go last whichever way the list is sorted.
    const priced = (p: Property) =>
      p.price ?? (filters.sort === "price-asc" ? Infinity : -Infinity);
    return [...found].sort((a, b) =>
      filters.sort === "price-asc"
        ? priced(a) - priced(b)
        : priced(b) - priced(a),
    );
  }, [all, filters]);

  function update(next: Partial<Filters>) {
    const merged = { ...filters, ...next };
    setFilters(merged);
    if (preview) return;
    const params = new URLSearchParams();
    (Object.keys(merged) as (keyof Filters)[]).forEach((key) => {
      const value = merged[key];
      if (value && !(key === "sort" && value === "recent"))
        params.set(PARAM_NAMES[key], value);
    });
    const query = params.toString();
    router.replace(query ? `?${query}` : "?", { scroll: false });
  }

  function showResults() {
    document
      .getElementById("propiedades")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const active: { label: string; clear: Partial<Filters> }[] = [
    filters.op && {
      label: LISTING_TYPE_LABELS[filters.op],
      clear: { op: "" as Operation },
    },
    filters.zone && { label: filters.zone, clear: { zone: "" } },
    filters.type && { label: categoryLabel(filters.type), clear: { type: "" } },
    filters.beds && {
      label: `${filters.beds}+ dormitorios`,
      clear: { beds: "" },
    },
    filters.minPrice && {
      label: `Desde ${Number(filters.minPrice).toLocaleString("es-AR")}`,
      clear: { minPrice: "" },
    },
    filters.maxPrice && {
      label: `Hasta ${Number(filters.maxPrice).toLocaleString("es-AR")}`,
      clear: { maxPrice: "" },
    },
    filters.q && { label: `“${filters.q}”`, clear: { q: "" } },
  ].filter(Boolean) as { label: string; clear: Partial<Filters> }[];
  const advancedCount = [
    filters.beds,
    filters.minPrice,
    filters.maxPrice,
    filters.q,
  ].filter(Boolean).length;

  const onPhoto = (template: SiteTemplate) =>
    template === "portada" && Boolean(site.coverUrl);
  const coverPhotos = all
    .map((property) => coverPhoto(property)?.url)
    .filter((url): url is string => Boolean(url))
    .slice(0, 4);

  return (
    <SiteRoot site={site}>
      <ByViewport site={site}>
        {(template) => (
          <SiteHeader
            agency={agency}
            site={site}
            slug={agencySlug}
            overlay={onPhoto(template)}
          />
        )}
      </ByViewport>

      <main className="flex-1">
        <ByViewport site={site}>
          {(template) => (
            <PortalHero
              agency={agency}
              site={{ ...site, template }}
              photos={coverPhotos}
              search={(layout) => (
                <SearchBar
                  layout={layout}
                  values={filters}
                  onChange={update}
                  zones={zones}
                  types={types}
                  resultCount={results.length}
                  onSubmit={showResults}
                  className={cn(
                    template !== "portada" && "border border-site-line",
                    template === "portada" &&
                      !site.coverUrl &&
                      "shadow-lg shadow-black/10",
                    onPhoto(template) && "shadow-2xl shadow-black/25",
                  )}
                />
              )}
            />
          )}
        </ByViewport>

        <PortalSections
          sections={site.sections}
          properties={all}
          agencySlug={agencySlug}
          template={site.template}
          site={site}
          onShowZone={(zone) => {
            update({ ...EMPTY, zone, sort: filters.sort });
            showResults();
          }}
        />

        <section
          id="propiedades"
          aria-labelledby="propiedades-titulo"
          className="scroll-mt-4"
        >
          <div className={cn(SITE_WRAP, "flex flex-col gap-8 py-14 lg:py-20")}>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h2
                  id="propiedades-titulo"
                  className="s-heading text-3xl leading-tight"
                >
                  Propiedades
                </h2>
                <p className="text-site-quiet" aria-live="polite">
                  {isLoading && !properties
                    ? "Cargando propiedades…"
                    : results.length === 1
                      ? "1 propiedad"
                      : `${results.length} propiedades`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={filters.sort}
                  onValueChange={(sort) => update({ sort: sort as Sort })}
                >
                  <SelectTrigger
                    aria-label="Ordenar"
                    className="h-10! rounded-lg border-site-line bg-white px-3.5 shadow-none"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="end">
                    <SelectItem value="recent">Más recientes</SelectItem>
                    <SelectItem value="price-asc">Menor precio</SelectItem>
                    <SelectItem value="price-desc">Mayor precio</SelectItem>
                  </SelectContent>
                </Select>
                <button
                  type="button"
                  aria-expanded={showMore}
                  aria-controls="mas-filtros"
                  onClick={() => setShowMore((current) => !current)}
                  className={cn(
                    "inline-flex h-10 items-center gap-2 rounded-lg border px-3.5 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-site-accent",
                    showMore
                      ? "border-site-ink bg-site-ink text-white"
                      : "border-site-line bg-white hover:border-site-quiet",
                  )}
                >
                  <SlidersHorizontal className="size-4" aria-hidden />
                  Más filtros
                  {advancedCount > 0 && (
                    <span className="flex size-5 items-center justify-center rounded-full bg-site-accent text-xs text-site-accent-ink">
                      {advancedCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            <div
              id="mas-filtros"
              aria-hidden={!showMore}
              inert={!showMore}
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none",
                showMore
                  ? "grid-rows-[1fr] opacity-100"
                  : "-mt-8 grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <div className="grid gap-5 rounded-xl bg-site-surface p-5 md:grid-cols-[auto_1fr_1fr_1.4fr]">
                  <fieldset className="flex flex-col gap-1.5">
                    <legend className="mb-1.5 text-sm font-medium">
                      Dormitorios
                    </legend>
                    <div
                      role="radiogroup"
                      aria-label="Dormitorios"
                      className="flex gap-1"
                    >
                      {BEDS.map((beds) => (
                        <button
                          key={beds || "all"}
                          type="button"
                          role="radio"
                          aria-checked={filters.beds === beds}
                          onClick={() => update({ beds })}
                          className={cn(
                            "h-10 min-w-10 rounded-lg px-3 text-sm font-medium tabular-nums outline-none transition-colors focus-visible:ring-2 focus-visible:ring-site-accent",
                            filters.beds === beds
                              ? "bg-site-ink text-white"
                              : "bg-white hover:bg-white/70",
                          )}
                        >
                          {beds ? `${beds}+` : "Todos"}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  {(
                    [
                      ["minPrice", "Precio desde"],
                      ["maxPrice", "Precio hasta"],
                    ] as const
                  ).map(([key, label]) => (
                    <div key={key} className="flex flex-col gap-1.5">
                      <label
                        htmlFor={`filtro-${key}`}
                        className="text-sm font-medium"
                      >
                        {label}
                      </label>
                      <Input
                        id={`filtro-${key}`}
                        inputMode="numeric"
                        placeholder="Sin límite"
                        value={filters[key]}
                        onChange={(event) =>
                          update({
                            [key]: event.target.value.replace(/\D/g, ""),
                          })
                        }
                        className="h-10 rounded-lg border-0 bg-white px-3.5 shadow-none"
                      />
                    </div>
                  ))}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="filtro-q" className="text-sm font-medium">
                      Buscar
                    </label>
                    <Input
                      id="filtro-q"
                      type="search"
                      placeholder="Título, barrio o ciudad"
                      value={filters.q}
                      onChange={(event) => update({ q: event.target.value })}
                      className="h-10 rounded-lg border-0 bg-white px-3.5 shadow-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {active.length > 0 && (
              <div className="-mt-2 flex flex-wrap items-center gap-2">
                {active.map((filter) => (
                  <button
                    key={filter.label}
                    type="button"
                    onClick={() => update(filter.clear)}
                    aria-label={`Quitar filtro: ${filter.label}`}
                    className="inline-flex h-8 items-center gap-1.5 rounded-full border border-site-line bg-white pr-2.5 pl-3 text-sm outline-none transition-colors hover:border-site-quiet focus-visible:ring-2 focus-visible:ring-site-accent"
                  >
                    {filter.label}
                    <X className="size-3.5 text-site-quiet" aria-hidden />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => update({ ...EMPTY, sort: filters.sort })}
                  className="h-8 rounded-sm px-2 text-sm font-medium underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-site-accent"
                >
                  Limpiar filtros
                </button>
              </div>
            )}

            {isLoading && !properties ? (
              <ByViewport site={site}>
                {(template) => (
                  <div className={LISTING_GRID[template]}>
                    {[0, 1, 2].map((index) => (
                      <PropertyCardSkeleton key={index} template={template} />
                    ))}
                  </div>
                )}
              </ByViewport>
            ) : all.length === 0 ? (
              <div className="rounded-xl border border-dashed border-site-line px-6 py-16 text-center">
                <p className="s-heading text-xl">
                  Todavía no hay propiedades publicadas
                </p>
                <p className="mt-2 text-site-quiet">
                  Volvé pronto o escribinos y te contamos qué tenemos
                  disponible.
                </p>
              </div>
            ) : results.length === 0 ? (
              <div className="rounded-xl border border-dashed border-site-line px-6 py-16 text-center">
                <p className="s-heading text-xl">
                  Ninguna propiedad coincide con estos filtros
                </p>
                <button
                  type="button"
                  onClick={() => update({ ...EMPTY, sort: filters.sort })}
                  className="mt-4 inline-flex h-10 items-center rounded-lg bg-site-accent px-4 text-sm font-medium text-site-accent-ink outline-none hover:opacity-90 focus-visible:ring-2 focus-visible:ring-site-accent focus-visible:ring-offset-2"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <ByViewport site={site}>
                {(template) => (
                  <div className={LISTING_GRID[template]}>
                    {results.map((property) => (
                      <PublicPropertyCard
                        key={property.id}
                        property={property}
                        agencySlug={agencySlug}
                        template={template}
                      />
                    ))}
                  </div>
                )}
              </ByViewport>
            )}
          </div>
        </section>

        {site.showAbout && site.about && (
          <section
            id="nosotros"
            aria-labelledby="nosotros-titulo"
            className="scroll-mt-4 bg-site-surface"
          >
            <div
              className={cn(
                SITE_WRAP,
                "grid gap-6 py-14 lg:grid-cols-[1fr_1.5fr] lg:gap-16 lg:py-20",
              )}
            >
              <h2
                id="nosotros-titulo"
                className="s-heading text-3xl leading-tight text-balance"
              >
                Sobre {agency.name}
              </h2>
              {/* Formatted text, cleaned by the backend (app/utils/rich_text.py). */}
              <div
                className="rich-text max-w-prose text-lg leading-relaxed text-pretty"
                dangerouslySetInnerHTML={{ __html: richTextHtml(site.about) }}
              />
            </div>
          </section>
        )}

        <ContactSection agencySlug={agencySlug} agency={agency} site={site} />
      </main>

      <SiteFooter agency={agency} site={site} />
    </SiteRoot>
  );
}

function ContactSection({
  agencySlug,
  agency,
  site,
}: {
  agencySlug: string;
  agency: PublicAgency;
  site: ResolvedSite;
}) {
  const channels = [
    site.whatsapp && {
      icon: MessageCircle,
      label: "WhatsApp",
      value: site.whatsapp,
      href: whatsappLink(site.whatsapp),
    },
    site.phone && {
      icon: Phone,
      label: "Teléfono",
      value: site.phone,
      href: `tel:${site.phone.replace(/[^\d+]/g, "")}`,
    },
    agency.contactEmail && {
      icon: Mail,
      label: "Email",
      value: agency.contactEmail,
      href: `mailto:${agency.contactEmail}`,
    },
  ].filter(Boolean) as {
    icon: typeof Mail;
    label: string;
    value: string;
    href: string;
  }[];

  return (
    <section
      id="contacto"
      aria-labelledby="contacto-titulo"
      className="scroll-mt-4 border-t border-site-line"
    >
      <div
        className={cn(
          SITE_WRAP,
          "grid gap-10 py-14 lg:grid-cols-2 lg:gap-16 lg:py-20",
        )}
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h2
              id="contacto-titulo"
              className="s-heading text-3xl leading-tight text-balance"
            >
              ¿Buscás algo en particular?
            </h2>
            <p className="max-w-md text-lg text-pretty text-site-quiet">
              Contanos qué necesitás y te respondemos con opciones.
            </p>
          </div>
          {channels.length > 0 && (
            <ul className="flex flex-col divide-y divide-site-line border-y border-site-line">
              {channels.map((channel) => (
                <li key={channel.label}>
                  <a
                    href={channel.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-4 py-4 outline-none transition-colors hover:text-site-accent focus-visible:ring-2 focus-visible:ring-site-accent"
                  >
                    <channel.icon
                      className="size-5 shrink-0 text-site-quiet"
                      aria-hidden
                    />
                    <span className="w-24 text-sm text-site-quiet">
                      {channel.label}
                    </span>
                    <span className="font-medium">{channel.value}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-xl border border-site-line p-6 sm:p-8">
          <InquiryForm agencySlug={agencySlug} />
        </div>
      </div>
    </section>
  );
}
