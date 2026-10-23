import { Bath, BedDouble, Home, Ruler } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { LOCALE_TAGS } from "@/i18n/config";
import { Link } from "@/i18n/navigation";
import type { Property } from "@/lib/api/properties";
import type { SiteTemplate } from "@/lib/api/agency";
import { useLabels } from "@/lib/labels";
import { cn } from "@/lib/utils";
import { IMAGE_WIDTH, sizedImage } from "@/lib/image-url";

export function coverPhoto(property: Pick<Property, "photos">) {
  const photos = [...property.photos].sort((a, b) => a.position - b.position);
  return photos.find((photo) => photo.isCover) ?? photos[0] ?? null;
}

/** "EUR 650", with the digits grouped the way `tag` (a BCP 47 language tag) does. */
export function formatPrice(property: Pick<Property, "price" | "currency">, tag: string) {
  if (!property.price) return null;
  return `${property.currency} ${property.price.toLocaleString(tag)}`;
}

/** Rentals are priced by the night: their price reads "EUR 650 /por noche". */
export function isPricedPerNight(property: Pick<Property, "listingType">) {
  return property.listingType === "RENT";
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
  label,
}: {
  className?: string;
  label?: string;
}) {
  const t = useTranslations("site.property");
  return (
    <div
      className={cn(
        "flex size-full flex-col items-center justify-center gap-2 bg-site-surface text-site-quiet",
        className,
      )}
    >
      <Home className="size-7" strokeWidth={1.25} aria-hidden />
      <span className="text-xs">{label ?? t("photosSoon")}</span>
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
  const t = useTranslations("site.property");
  const tag = LOCALE_TAGS[useLocale()];
  const number = (value: number) => value.toLocaleString(tag);
  const specs = [
    property.bedrooms != null && {
      icon: BedDouble,
      text: t("bedroomsShort", { count: property.bedrooms, value: number(property.bedrooms) }),
      label: t("bedroomsLong", { count: property.bedrooms, value: number(property.bedrooms) }),
    },
    property.bathrooms != null && {
      icon: Bath,
      text: t("bathrooms", { count: property.bathrooms, value: number(property.bathrooms) }),
      label: t("bathrooms", { count: property.bathrooms, value: number(property.bathrooms) }),
    },
    property.areaSqm != null && {
      icon: Ruler,
      text: `${number(property.areaSqm)} m²`,
      label: t("areaLong", { value: number(property.areaSqm) }),
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
  const t = useTranslations("site.property");
  const labels = useLabels();
  const cover = coverPhoto(property);
  const price = formatPrice(property, LOCALE_TAGS[useLocale()]);
  const unit = isPricedPerNight(property) ? t("perNight") : null;
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
            src={sizedImage(cover.url, IMAGE_WIDTH.card)}
            alt=""
            loading="lazy"
            className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <PhotoPlaceholder />
        )}
        <span className="absolute top-3 left-3 rounded-md bg-white/95 px-2 py-1 text-xs font-medium text-site-ink">
          {labels.listingType(property.listingType)}
        </span>
        {badge && (
          <span className="absolute top-3 right-3 rounded-md bg-site-accent px-2 py-1 text-xs font-semibold text-site-accent-ink">
            {badge}
          </span>
        )}
      </div>

      <div className={cn("flex flex-1 flex-col", compact ? "gap-1" : "gap-1.5")}>
        <p className="text-sm text-site-quiet">
          {place
            ? t("categoryIn", { category: labels.category(property.category), place })
            : labels.category(property.category)}
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
        {/* `mt-auto`: pins the price to the card's bottom edge no matter how
            many lines the title/summary above it take, so prices line up
            across cards in the same grid row (the grid stretches every card
            to the row's tallest). */}
        <p
          className={cn(
            "mt-auto tabular-nums",
            compact ? "text-sm font-semibold" : "text-lg font-semibold",
          )}
        >
          {price ? (
            <>
              {price}
              {unit && (
                <span className="font-normal text-site-quiet">{unit}</span>
              )}
            </>
          ) : (
            <span className="font-medium text-site-quiet">
              {t("priceOnRequest")}
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
