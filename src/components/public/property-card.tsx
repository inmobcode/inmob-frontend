import { Bath, BedDouble, Home, Ruler } from "lucide-react";
import Link from "next/link";

import type { Property } from "@/lib/api/properties";
import type { SiteTemplate } from "@/lib/api/agency";
import { LISTING_TYPE_LABELS, categoryLabel } from "@/lib/properties-labels";
import { cn } from "@/lib/utils";

export function coverPhoto(property: Property) {
  const photos = [...property.photos].sort((a, b) => a.position - b.position);
  return photos.find((photo) => photo.isCover) ?? photos[0] ?? null;
}

export function formatPrice(property: Pick<Property, "price" | "currency">) {
  if (!property.price) return null;
  return `${property.currency} ${property.price.toLocaleString("es-AR")}`;
}

export function placeOf(
  property: Pick<Property, "area" | "region" | "country">,
) {
  return [property.area, property.region, property.country]
    .filter(Boolean)
    .join(", ");
}

/** Shown wherever a property has no photo yet, so the card still looks intentional. */
export function PhotoPlaceholder({
  className,
  label = "Fotos próximamente",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <div
      className={cn(
        "flex size-full flex-col items-center justify-center gap-2 bg-site-surface text-site-quiet",
        className,
      )}
    >
      <Home className="size-7" strokeWidth={1.25} aria-hidden />
      <span className="text-xs">{label}</span>
    </div>
  );
}

export function PropertySpecs({
  property,
  className,
}: {
  property: Property;
  className?: string;
}) {
  const number = (value: number) => value.toLocaleString("es-AR");
  const specs = [
    property.bedrooms != null && {
      icon: BedDouble,
      text: `${number(property.bedrooms)} dorm.`,
      label: `${number(property.bedrooms)} dormitorios`,
    },
    property.bathrooms != null && {
      icon: Bath,
      text: `${number(property.bathrooms)} baños`,
      label: `${number(property.bathrooms)} baños`,
    },
    property.areaSqm != null && {
      icon: Ruler,
      text: `${number(property.areaSqm)} m²`,
      label: `${number(property.areaSqm)} metros cuadrados`,
    },
  ].filter(Boolean) as { icon: typeof Bath; text: string; label: string }[];
  if (specs.length === 0) return null;
  return (
    <ul
      className={cn(
        "flex flex-wrap gap-x-4 gap-y-1 text-sm text-site-quiet",
        className,
      )}
    >
      {specs.map((spec) => (
        <li
          key={spec.label}
          className="inline-flex items-center gap-1.5"
          aria-label={spec.label}
        >
          <spec.icon className="size-4" aria-hidden />
          <span aria-hidden>{spec.text}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * One listing. The template decides its proportions: `editorial` cards are
 * wider with the summary, `compacto` ones are small and dense.
 */
export function PublicPropertyCard({
  property,
  agencySlug,
  template = "portada",
  badge,
}: {
  property: Property;
  agencySlug: string;
  template?: SiteTemplate;
  /** A promotion's label, shown in the accent color on the photo. */
  badge?: string | null;
}) {
  const cover = coverPhoto(property);
  const price = formatPrice(property);
  const place = placeOf(property);
  const compact = template === "compacto";
  const editorial = template === "editorial";

  return (
    <Link
      href={`/page/${agencySlug}/properties/${property.slug}`}
      className="group flex flex-col gap-3.5 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-site-accent focus-visible:ring-offset-4"
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-xl",
          editorial
            ? "aspect-[3/2]"
            : compact
              ? "aspect-[4/3]"
              : "aspect-[4/3]",
        )}
      >
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover.url}
            alt=""
            loading="lazy"
            className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <PhotoPlaceholder />
        )}
        <span className="absolute top-3 left-3 rounded-md bg-white/95 px-2 py-1 text-xs font-medium text-site-ink">
          {LISTING_TYPE_LABELS[property.listingType]}
        </span>
        {badge && (
          <span className="absolute top-3 right-3 rounded-md bg-site-accent px-2 py-1 text-xs font-semibold text-site-accent-ink">
            {badge}
          </span>
        )}
      </div>

      <div className={cn("flex flex-col", compact ? "gap-1" : "gap-1.5")}>
        <p className="text-sm text-site-quiet">
          {categoryLabel(property.category)}
          {place && ` en ${place}`}
        </p>
        <h3
          className={cn(
            "s-heading leading-snug text-balance transition-colors group-hover:text-site-accent",
            compact ? "text-base" : editorial ? "text-2xl" : "text-xl",
          )}
        >
          {property.title}
        </h3>
        {editorial && property.content?.summary && (
          <p className="line-clamp-2 text-pretty text-site-quiet">
            {property.content.summary}
          </p>
        )}
        {!compact && <PropertySpecs property={property} className="mt-1" />}
        <p
          className={cn(
            "tabular-nums",
            compact ? "text-sm font-semibold" : "mt-1 text-lg font-semibold",
          )}
        >
          {price ?? (
            <span className="font-medium text-site-quiet">
              Precio a consultar
            </span>
          )}
        </p>
      </div>
    </Link>
  );
}

export function PropertyCardSkeleton({
  template = "portada",
}: {
  template?: SiteTemplate;
}) {
  return (
    <div className="flex animate-pulse flex-col gap-3.5" aria-hidden>
      <div
        className={cn(
          "rounded-xl bg-site-surface",
          template === "editorial" ? "aspect-[3/2]" : "aspect-[4/3]",
        )}
      />
      <div className="h-4 w-1/2 rounded-full bg-site-surface" />
      <div className="h-5 w-4/5 rounded-full bg-site-surface" />
      <div className="h-4 w-1/3 rounded-full bg-site-surface" />
    </div>
  );
}
