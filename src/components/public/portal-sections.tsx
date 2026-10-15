"use client";

import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  PhotoPlaceholder,
  PublicPropertyCard,
} from "@/components/public/property-card";
import { SITE_WRAP } from "@/components/public/site-chrome";
import type {
  ButtonTarget,
  Destination,
  SiteSection,
  SiteTemplate,
} from "@/lib/api/agency";
import type { Property } from "@/lib/api/properties";
import {
  type ResolvedSite,
  formatEndDate,
  sectionLayout,
  whatsappLink,
} from "@/lib/site-theme";
import { placeMatches } from "@/lib/places";
import { richTextHtml } from "@/lib/rich-text";
import { cn } from "@/lib/utils";
import { IMAGE_WIDTH, sizedImage } from "@/lib/image-url";

const CARDS = "grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3";
const BLOCK = "py-14 lg:py-20";
const HEADING =
  "s-heading text-[clamp(2rem,4vw,3.25rem)] leading-[1.02] text-balance";
const BUTTON =
  "inline-flex h-11 w-fit items-center rounded-lg px-5 text-sm font-medium outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2";

export function inZone(property: Property, zone: string) {
  return placeMatches(property, zone);
}

/** Listings by id, in the order given; ones that were unpublished drop out. */
function pick(properties: Property[], ids: string[] | undefined) {
  return (ids ?? [])
    .map((id) => properties.find((property) => property.id === id))
    .filter((property): property is Property => Boolean(property));
}

/**
 * A row that scrolls sideways, one card at a time, with arrows on wide
 * screens and swipe on phones. The arrows grey out at either end.
 */
function Carousel({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setEdges({
      start: track.scrollLeft <= 4,
      end: track.scrollLeft + track.clientWidth >= track.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, [measure, children.length]);

  function scroll(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const item = track.firstElementChild as HTMLElement | null;
    const step = item ? item.offsetWidth + 24 : track.clientWidth * 0.8;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  const arrow =
    "flex size-10 items-center justify-center rounded-full border border-site-line bg-white outline-none transition-opacity hover:border-site-quiet focus-visible:ring-2 focus-visible:ring-site-accent disabled:opacity-30";

  return (
    <div className="flex flex-col gap-5">
      <div
        ref={trackRef}
        onScroll={measure}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="-mx-5 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-px-5 px-5 pb-2 outline-none [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-site-accent sm:-mx-8 sm:scroll-px-8 sm:px-8 [&::-webkit-scrollbar]:hidden"
      >
        {children.map((child, index) => (
          <div
            key={index}
            className="w-[82%] shrink-0 snap-start sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
          >
            {child}
          </div>
        ))}
      </div>
      {children.length > 1 && !(edges.start && edges.end) && (
        <div className="hidden justify-end gap-2 sm:flex">
          <button
            type="button"
            className={arrow}
            onClick={() => scroll(-1)}
            disabled={edges.start}
            aria-label="Anteriores"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            className={arrow}
            onClick={() => scroll(1)}
            disabled={edges.end}
            aria-label="Siguientes"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      )}
    </div>
  );
}

/** Where a block's button leads: a section of this page or the agency's WhatsApp. */
function buttonHref(
  target: ButtonTarget | null | undefined,
  site: ResolvedSite,
) {
  if (target === "whatsapp" && site.whatsapp)
    return { href: whatsappLink(site.whatsapp), external: true };
  if (target === "properties") return { href: "#propiedades", external: false };
  return { href: "#contacto", external: false };
}

function BlockButton({
  section,
  site,
  inverted = false,
}: {
  section: SiteSection;
  site: ResolvedSite;
  /** On an accent-colored background the button takes the ink color instead. */
  inverted?: boolean;
}) {
  const label = section.buttonLabel?.trim();
  if (!label) return null;
  const { href, external } = buttonHref(section.buttonTarget, site);
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={cn(
        BUTTON,
        inverted
          ? "bg-site-accent-ink text-site-accent focus-visible:ring-site-accent-ink"
          : "bg-site-accent text-site-accent-ink focus-visible:ring-site-accent",
      )}
    >
      {label}
    </a>
  );
}

function Cards({
  listings,
  layout,
  title,
  agencySlug,
  template,
  badge,
}: {
  listings: Property[];
  layout: "grid" | "carousel";
  title: string;
  agencySlug: string;
  template: SiteTemplate;
  badge?: string | null;
}) {
  if (listings.length === 0) return null;
  const cards = listings.map((property) => (
    <PublicPropertyCard
      key={property.id}
      property={property}
      agencySlug={agencySlug}
      template={template}
      badge={badge}
    />
  ));
  return layout === "carousel" ? (
    <Carousel label={title}>{cards}</Carousel>
  ) : (
    <div className={CARDS}>{cards}</div>
  );
}

/** A photo filling its box, with a placeholder when the agency hasn't added one. */
function Photo({
  url,
  label,
  className,
}: {
  url?: string | null;
  label: string;
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-2xl", className)}>
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={sizedImage(url, IMAGE_WIDTH.tile)}
          alt=""
          loading="lazy"
          className="size-full object-cover"
        />
      ) : (
        <PhotoPlaceholder label={label} />
      )}
    </div>
  );
}

interface BlockProps {
  section: SiteSection;
  properties: Property[];
  agencySlug: string;
  template: SiteTemplate;
  site: ResolvedSite;
  onShowZone: (zone: string) => void;
}

function LocationBlock({
  section,
  properties,
  agencySlug,
  template,
  onShowZone,
}: BlockProps) {
  const layout = sectionLayout(section);
  const zone = section.zone?.trim() || null;
  const chosen = pick(properties, section.propertyIds);
  const listings =
    chosen.length > 0
      ? chosen
      : zone
        ? properties.filter((property) => inZone(property, zone))
        : [];
  const zoneCount = zone
    ? properties.filter((property) => inZone(property, zone)).length
    : 0;
  const title = section.title?.trim() || zone || "Destino";
  const id = `bloque-${section.id}`;

  const showAll = zone && zoneCount > 0 && (
    <button
      type="button"
      onClick={() => onShowZone(zone)}
      className={cn(
        BUTTON,
        "bg-site-accent text-site-accent-ink focus-visible:ring-site-accent",
      )}
    >
      Ver {zoneCount === 1 ? "la propiedad" : `las ${zoneCount} propiedades`} en{" "}
      {zone}
    </button>
  );
  const count = zone && zoneCount > 0 && (
    <p className="inline-flex items-center gap-1.5 text-sm opacity-75">
      <MapPin className="size-4" aria-hidden />
      {zoneCount === 1 ? "1 propiedad" : `${zoneCount} propiedades`} en {zone}
    </p>
  );
  const text = section.text && (
    <p className="max-w-prose text-lg leading-relaxed text-pretty whitespace-pre-line opacity-80">
      {section.text}
    </p>
  );

  if (layout === "banner") {
    return (
      <section
        aria-labelledby={id}
        className={cn(SITE_WRAP, BLOCK, "flex flex-col gap-10")}
      >
        <div className="relative isolate flex min-h-[26rem] flex-col justify-end overflow-hidden rounded-2xl bg-site-accent text-white">
          {section.imageUrl && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={section.imageUrl}
                alt=""
                loading="lazy"
                className="absolute inset-0 -z-10 size-full object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
              />
            </>
          )}
          <div className="flex flex-col items-start gap-4 p-8 sm:p-12">
            {count}
            <h2 id={id} className={HEADING}>
              {title}
            </h2>
            {text}
            {showAll && (
              <div className="pt-2 [&_button]:bg-white [&_button]:text-site-ink">
                {showAll}
              </div>
            )}
          </div>
        </div>
        <Cards
          listings={listings.slice(0, 3)}
          layout="grid"
          title={title}
          agencySlug={agencySlug}
          template={template}
        />
      </section>
    );
  }

  if (layout === "carousel") {
    return (
      <section
        aria-labelledby={id}
        className={cn(SITE_WRAP, BLOCK, "flex flex-col gap-8")}
      >
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex max-w-2xl flex-col gap-3">
            <div className="text-site-quiet">{count}</div>
            <h2 id={id} className={HEADING}>
              {title}
            </h2>
            {text}
          </div>
          {showAll}
        </div>
        <Cards
          listings={listings}
          layout="carousel"
          title={title}
          agencySlug={agencySlug}
          template={template}
        />
      </section>
    );
  }

  return (
    <section
      aria-labelledby={id}
      className={cn(SITE_WRAP, BLOCK, "flex flex-col gap-10")}
    >
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
        <Photo url={section.imageUrl} label={title} className="aspect-[4/3]" />
        <div className="flex flex-col items-start gap-5">
          <div className="text-site-quiet">{count}</div>
          <h2 id={id} className={HEADING}>
            {title}
          </h2>
          {text}
          {showAll}
        </div>
      </div>
      <Cards
        listings={listings.slice(0, 3)}
        layout="grid"
        title={title}
        agencySlug={agencySlug}
        template={template}
      />
    </section>
  );
}

function PromoBlock({ section, properties, agencySlug, template }: BlockProps) {
  const layout = sectionLayout(section);
  const listings = pick(properties, section.propertyIds);
  const badge = section.badge?.trim() || null;
  const title = section.title?.trim() || "Promoción";
  const id = `bloque-${section.id}`;
  const ends = section.endsAt && (
    <p className="text-sm opacity-75">
      Válido hasta el {formatEndDate(section.endsAt)}
    </p>
  );
  const text = section.text && (
    <p className="max-w-prose text-lg leading-relaxed text-pretty whitespace-pre-line opacity-85">
      {section.text}
    </p>
  );

  if (layout === "carousel") {
    return (
      <section
        aria-labelledby={id}
        className={cn(SITE_WRAP, BLOCK, "flex flex-col gap-8")}
      >
        <div className="flex max-w-2xl flex-col items-start gap-4">
          {badge && (
            <span className="rounded-md bg-site-accent px-2.5 py-1 text-sm font-semibold text-site-accent-ink">
              {badge}
            </span>
          )}
          <h2 id={id} className={HEADING}>
            {title}
          </h2>
          <div className="text-site-quiet">{text}</div>
          <div className="text-site-quiet">{ends}</div>
        </div>
        <Cards
          listings={listings}
          layout="carousel"
          title={title}
          agencySlug={agencySlug}
          template={template}
          badge={badge}
        />
      </section>
    );
  }

  // "banner" puts the text over the photo; "band" is a solid accent panel with the photo beside it.
  const overPhoto = layout === "banner" && Boolean(section.imageUrl);
  return (
    <section
      aria-labelledby={id}
      className={cn(SITE_WRAP, "flex flex-col gap-10 py-10 lg:py-14")}
    >
      <div
        className={cn(
          "relative isolate grid overflow-hidden rounded-2xl",
          overPhoto
            ? "min-h-[24rem] items-end text-white"
            : "bg-site-accent text-site-accent-ink",
          !overPhoto &&
            layout === "band" &&
            section.imageUrl &&
            "lg:grid-cols-[1.1fr_1fr]",
        )}
      >
        {overPhoto && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={section.imageUrl!}
              alt=""
              loading="lazy"
              className="absolute inset-0 -z-10 size-full object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/30 to-black/10"
            />
          </>
        )}
        <div className="flex flex-col items-start gap-5 p-8 sm:p-12">
          {badge && (
            <span
              className={cn(
                "rounded-md px-2.5 py-1 text-sm font-semibold",
                overPhoto
                  ? "bg-site-accent text-site-accent-ink"
                  : "bg-site-accent-ink text-site-accent",
              )}
            >
              {badge}
            </span>
          )}
          <h2 id={id} className={HEADING}>
            {title}
          </h2>
          {text}
          {ends}
        </div>
        {!overPhoto && layout === "band" && section.imageUrl && (
          <div className="relative min-h-56">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={section.imageUrl}
              alt=""
              loading="lazy"
              className="absolute inset-0 size-full object-cover"
            />
          </div>
        )}
      </div>
      <Cards
        listings={listings}
        layout="grid"
        title={title}
        agencySlug={agencySlug}
        template={template}
        badge={badge}
      />
    </section>
  );
}

function FeaturedBlock({
  section,
  properties,
  agencySlug,
  template,
}: BlockProps) {
  const listings = pick(properties, section.propertyIds);
  const title = section.title?.trim() || "Propiedades destacadas";
  const id = `bloque-${section.id}`;
  if (listings.length === 0) return null;
  return (
    <section
      aria-labelledby={id}
      className={cn(SITE_WRAP, BLOCK, "flex flex-col gap-8")}
    >
      <div className="flex max-w-2xl flex-col gap-3">
        <h2 id={id} className={HEADING}>
          {title}
        </h2>
        {section.text && (
          <p className="text-lg text-pretty text-site-quiet">{section.text}</p>
        )}
      </div>
      <Cards
        listings={listings}
        layout={sectionLayout(section) === "carousel" ? "carousel" : "grid"}
        title={title}
        agencySlug={agencySlug}
        template={template}
      />
    </section>
  );
}

function DestinationTile({
  destination,
  properties,
  onShowZone,
}: {
  destination: Destination;
  properties: Property[];
  onShowZone: (zone: string) => void;
}) {
  const name =
    destination.name?.trim() || destination.zone?.trim() || "Destino";
  const zone = destination.zone?.trim() || destination.name?.trim() || null;
  const count = zone
    ? properties.filter((property) => inZone(property, zone)).length
    : 0;
  return (
    <button
      type="button"
      onClick={() => zone && onShowZone(zone)}
      disabled={!zone}
      className="group relative isolate flex aspect-[4/5] w-full flex-col justify-end overflow-hidden rounded-2xl text-left text-white outline-none focus-visible:ring-2 focus-visible:ring-site-accent focus-visible:ring-offset-2"
    >
      {destination.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={sizedImage(destination.imageUrl, IMAGE_WIDTH.card)}
          alt=""
          loading="lazy"
          className="absolute inset-0 -z-10 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      ) : (
        <div className="absolute inset-0 -z-10 bg-site-accent" />
      )}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-black/65 via-black/10 to-transparent"
      />
      <div className="flex flex-col gap-1 p-5">
        <span className="s-heading text-2xl leading-tight">{name}</span>
        <span className="text-sm opacity-85">
          {count === 0
            ? "Próximamente"
            : count === 1
              ? "1 propiedad"
              : `${count} propiedades`}
        </span>
      </div>
    </button>
  );
}

function DestinationsBlock({ section, properties, onShowZone }: BlockProps) {
  const destinations = section.destinations ?? [];
  const title = section.title?.trim() || "Destinos";
  const id = `bloque-${section.id}`;
  if (destinations.length === 0) return null;
  const tiles = destinations.map((destination) => (
    <DestinationTile
      key={destination.id}
      destination={destination}
      properties={properties}
      onShowZone={onShowZone}
    />
  ));
  return (
    <section
      aria-labelledby={id}
      className={cn(SITE_WRAP, BLOCK, "flex flex-col gap-8")}
    >
      <div className="flex max-w-2xl flex-col gap-3">
        <h2 id={id} className={HEADING}>
          {title}
        </h2>
        {section.text && (
          <p className="text-lg text-pretty text-site-quiet">{section.text}</p>
        )}
      </div>
      {sectionLayout(section) === "carousel" ? (
        <Carousel label={title}>{tiles}</Carousel>
      ) : (
        <div
          className={cn(
            "grid grid-cols-2 gap-4",
            // Three or fewer fill the row; more wrap in rows of four.
            destinations.length <= 3 ? "lg:grid-cols-3" : "lg:grid-cols-4",
          )}
        >
          {tiles}
        </div>
      )}
    </section>
  );
}

function TextBlock({ section, site }: BlockProps) {
  const layout = sectionLayout(section);
  const title = section.title?.trim();
  const id = `bloque-${section.id}`;
  const body = (
    <>
      {title && (
        <h2 id={id} className={HEADING}>
          {title}
        </h2>
      )}
      {section.text && (
        // Formatted text, cleaned by the backend (app/utils/rich_text.py).
        <div
          className="rich-text max-w-prose text-lg leading-relaxed text-pretty text-site-quiet"
          dangerouslySetInnerHTML={{ __html: richTextHtml(section.text) }}
        />
      )}
      <BlockButton section={section} site={site} />
    </>
  );

  if (layout === "centered" || !section.imageUrl) {
    return (
      <section
        aria-labelledby={title ? id : undefined}
        className={cn(SITE_WRAP, BLOCK)}
      >
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
          {body}
        </div>
      </section>
    );
  }

  return (
    <section
      aria-labelledby={title ? id : undefined}
      className={cn(SITE_WRAP, BLOCK)}
    >
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
        <Photo
          url={section.imageUrl}
          label=""
          className={cn(
            "aspect-[4/3]",
            layout === "image-right" && "lg:order-2",
          )}
        />
        <div className="flex flex-col items-start gap-5">{body}</div>
      </div>
    </section>
  );
}

function CtaBlock({ section, site }: BlockProps) {
  const photo = sectionLayout(section) === "photo" && Boolean(section.imageUrl);
  const title = section.title?.trim() || "¿Querés vender tu propiedad?";
  const id = `bloque-${section.id}`;
  return (
    <section aria-labelledby={id} className={cn(SITE_WRAP, "py-10 lg:py-14")}>
      <div
        className={cn(
          "relative isolate flex flex-col items-start gap-6 overflow-hidden rounded-2xl p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between",
          photo ? "min-h-72 text-white" : "bg-site-accent text-site-accent-ink",
        )}
      >
        {photo && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={section.imageUrl!}
              alt=""
              loading="lazy"
              className="absolute inset-0 -z-10 size-full object-cover"
            />
            <div aria-hidden className="absolute inset-0 -z-10 bg-black/55" />
          </>
        )}
        <div className="flex max-w-2xl flex-col gap-3">
          <h2
            id={id}
            className="s-heading text-[clamp(1.75rem,3.2vw,2.75rem)] leading-[1.05] text-balance"
          >
            {title}
          </h2>
          {section.text && (
            <p className="text-lg text-pretty opacity-85">{section.text}</p>
          )}
        </div>
        <div
          className={cn(
            "shrink-0",
            photo && "[&_a]:bg-white [&_a]:text-site-ink",
          )}
        >
          <BlockButton section={section} site={site} inverted={!photo} />
        </div>
      </div>
    </section>
  );
}

const BLOCKS: Record<
  SiteSection["type"],
  (props: BlockProps) => React.ReactNode
> = {
  location: LocationBlock,
  promo: PromoBlock,
  featured: FeaturedBlock,
  destinations: DestinationsBlock,
  text: TextBlock,
  cta: CtaBlock,
};

/** The agency's own blocks, in the order they set, between the hero and the full listing. */
export function PortalSections({
  sections,
  ...props
}: Omit<BlockProps, "section"> & { sections: SiteSection[] }) {
  if (sections.length === 0) return null;
  return (
    <div className="flex flex-col">
      {sections.map((section) => {
        const Block = BLOCKS[section.type];
        return Block ? (
          <Block key={section.id} section={section} {...props} />
        ) : null;
      })}
    </div>
  );
}
