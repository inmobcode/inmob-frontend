import { BedDouble, Bath, Ruler } from "lucide-react";
import Link from "next/link";

import type { MarketplaceProperty } from "@/lib/api/marketplace";
import { categoryLabel } from "@/lib/properties-labels";
import { cn } from "@/lib/utils";

export function listingHref(property: MarketplaceProperty) {
  return `/page/${property.agency.slug}/properties/${property.slug}`;
}

export function coverOf(property: MarketplaceProperty) {
  const photos = [...property.photos].sort((a, b) => Number(b.isCover) - Number(a.isCover) || a.position - b.position);
  return photos[0]?.url ?? null;
}

export function placeOf(property: MarketplaceProperty) {
  return [property.area, property.region, property.country].filter(Boolean).join(", ");
}

export function shortPrice(property: MarketplaceProperty) {
  if (!property.price) return null;
  return `${property.currency} ${property.price.toLocaleString("es-AR", { maximumFractionDigits: 0 })}`;
}

/**
 * One listing in the results: photo, what and where, the key figures and the
 * price, and the agency that publishes it, which is who the inquiry goes to.
 */
export function ListingCard({
  property,
  active = false,
  nights,
  onHover,
}: {
  property: MarketplaceProperty;
  active?: boolean;
  /** Nights of the searched stay, to show the stay's total next to the nightly price. */
  nights?: number;
  onHover?: (id: string | null) => void;
}) {
  const cover = coverOf(property);
  const price = shortPrice(property);
  const isRent = property.listingType === "RENT";
  const total = isRent && nights && property.price ? property.price * nights : null;

  return (
    <Link
      id={`listing-${property.id}`}
      href={listingHref(property)}
      onMouseEnter={() => onHover?.(property.id)}
      onMouseLeave={() => onHover?.(null)}
      onFocus={() => onHover?.(property.id)}
      onBlur={() => onHover?.(null)}
      className="group flex scroll-mt-28 flex-col gap-3 rounded-2xl outline-none focus-visible:ring-3 focus-visible:ring-forest/40 focus-visible:ring-offset-4"
    >
      <div
        className={cn(
          "relative aspect-[4/3] overflow-hidden rounded-2xl bg-mist transition-shadow",
          active && "ring-3 ring-forest ring-offset-2 ring-offset-paper",
        )}
      >
        {cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt=""
            loading="lazy"
            className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        )}
        <span className="absolute top-3 left-3 rounded-full bg-paper/95 px-2.5 py-1 text-xs font-medium text-ink">
          {isRent ? "Alquiler temporario" : "Venta"}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline justify-between gap-3">
          <p className="truncate text-sm text-quiet">
            {categoryLabel(property.category)}
            {placeOf(property) && ` en ${placeOf(property)}`}
          </p>
        </div>
        <h3 className="font-display text-lg leading-snug text-balance">{property.title}</h3>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-quiet">
          {property.bedrooms != null && (
            <span className="inline-flex items-center gap-1">
              <BedDouble className="size-3.5" />
              {property.bedrooms} dorm.
            </span>
          )}
          {property.bathrooms != null && (
            <span className="inline-flex items-center gap-1">
              <Bath className="size-3.5" />
              {property.bathrooms} baños
            </span>
          )}
          {property.areaSqm != null && (
            <span className="inline-flex items-center gap-1">
              <Ruler className="size-3.5" />
              {property.areaSqm.toLocaleString("es-AR")} m²
            </span>
          )}
        </div>
        <p className="mt-1 tabular-nums">
          {price ? (
            <>
              <span className="font-semibold">{price}</span>
              {isRent && <span className="text-quiet"> por noche</span>}
              {total && (
                <span className="block text-sm text-quiet">
                  {property.currency} {total.toLocaleString("es-AR")} por {nights} {nights === 1 ? "noche" : "noches"}
                </span>
              )}
            </>
          ) : (
            <span className="text-quiet">Precio a consultar</span>
          )}
        </p>
        <p className="mt-1 flex items-center gap-2 border-t border-line pt-2.5 text-sm text-quiet">
          {property.agency.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={property.agency.logoUrl} alt="" className="size-5 rounded-full object-cover" />
          ) : (
            <span aria-hidden className="flex size-5 items-center justify-center rounded-full bg-mist text-[10px] font-semibold text-ink">
              {property.agency.name.charAt(0).toUpperCase()}
            </span>
          )}
          Publicada por <span className="font-medium text-ink">{property.agency.name}</span>
        </p>
      </div>
    </Link>
  );
}
