import { Bath, BedDouble, Building2, Camera, Clock, LandPlot, MapPin, Ruler } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import type { Property } from "@/lib/api/properties";
import {
  ControlsZone,
  PropertyMenu,
  SelectToggle,
  ViewOnSiteButton,
  type PropertyActions,
} from "@/components/properties/property-controls";
import { StatusPill } from "@/components/properties/status-pill";
import { useFormat } from "@/i18n/format";
import { useLabels } from "@/lib/labels";
import { parseApiDate } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { IMAGE_WIDTH, sizedImage } from "@/lib/image-url";

export function coverOf(property: Property) {
  const photos = [...property.photos].sort((a, b) => a.position - b.position);
  return photos.find((photo) => photo.isCover) ?? photos[0] ?? null;
}


export function initials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "?"
  );
}

/** One figure of the spec row. `label` is read by screen readers and shown as a tooltip. */
function Spec({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Bath;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5" title={label}>
      <Icon className="size-4 text-muted-foreground" aria-hidden />
      <span aria-label={label}>{children}</span>
    </span>
  );
}

const CARD_CLASS =
  "property-card group flex flex-col overflow-hidden rounded-2xl bg-card shadow-[0_1px_2px_oklch(0.3_0.05_160/0.04),0_12px_32px_-12px_oklch(0.3_0.05_160/0.14)] ring-1 ring-foreground/5 outline-none transition-[box-shadow,transform] duration-300";

/** `preview` renders the card as a static block (no link), for live previews in forms. */
export function PropertyCard({
  property,
  preview = false,
  actions,
  selected = false,
  selecting = false,
  onToggle,
}: {
  property: Property;
  preview?: boolean;
  actions?: PropertyActions;
  selected?: boolean;
  /** True while anything is selected, so every card shows its checkbox. */
  selecting?: boolean;
  onToggle?: () => void;
}) {
  const t = useTranslations("properties.card");
  const labels = useLabels();
  const { number, ago } = useFormat();
  const { agencySlug } = useParams<{ agencySlug: string }>();
  const cover = coverOf(property);
  const amount = property.price ? number(property.price) : null;
  const location = [property.area, property.region, property.country].filter(Boolean).join(", ");
  const updated = ago(parseApiDate(property.updatedAt));
  const archived = property.status === "ARCHIVED";

  const inner = (
    <>
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={sizedImage(cover.url, IMAGE_WIDTH.card)}
            alt={property.title}
            loading="lazy"
            className={cn(
              "size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105",
              archived && "opacity-80 grayscale",
            )}
          />
        ) : (
          <div className="flex size-full items-center justify-center text-primary/30">
            <Building2 className="size-14" strokeWidth={1.25} />
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/20 to-transparent" />
        {property.photos.length > 0 && (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-foreground/55 px-2.5 py-1 text-xs font-medium text-background backdrop-blur">
            <Camera className="size-3.5" />
            {property.photos.length}
          </span>
        )}
        {actions && onToggle && (
          <ControlsZone
            className={cn(
              "absolute inset-x-3 top-3 flex items-center justify-between transition-opacity duration-200 [@media(hover:none)]:opacity-100",
              selecting || selected
                ? "opacity-100"
                : "opacity-0 group-focus-within:opacity-100 group-hover:opacity-100",
            )}
          >
            <SelectToggle
              checked={selected}
              onToggle={onToggle}
              label={selected ? t("unselect", { title: property.title }) : t("select", { title: property.title })}
            />
            <div className="flex items-center gap-1.5">
              <ViewOnSiteButton property={property} />
              <PropertyMenu property={property} actions={actions} />
            </div>
          </ControlsZone>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex flex-col gap-1.5">
          <p className="text-xs font-medium text-primary">
            {labels.listingType(property.listingType)} · {labels.category(property.category)}
          </p>
          <h3 className="font-display text-xl leading-tight text-balance line-clamp-2" title={property.title}>
            {property.title}
          </h3>
          {location && (
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-3.5 shrink-0" />
              <span className="truncate">{location}</span>
            </p>
          )}
        </div>

        {/* Everything below is pinned to the bottom so prices line up across a row of cards. */}
        <div className="mt-auto flex flex-col gap-3">
          <p className="flex h-8 items-baseline gap-1.5 tabular-nums">
            {amount ? (
              <>
                <span className="text-sm font-medium text-muted-foreground">{property.currency}</span>
                <span className="text-2xl leading-none font-semibold tracking-tight">{amount}</span>
              </>
            ) : (
              <span className="text-lg leading-none font-medium text-muted-foreground">{t("priceOnRequest")}</span>
            )}
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm tabular-nums">
            {property.bedrooms != null && (
              <Spec icon={BedDouble} label={t("bedrooms", { count: property.bedrooms, value: number(property.bedrooms) })}>
                {number(property.bedrooms)}
              </Spec>
            )}
            {property.bathrooms != null && (
              <Spec icon={Bath} label={t("bathrooms", { count: property.bathrooms, value: number(property.bathrooms) })}>
                {number(property.bathrooms)}
              </Spec>
            )}
            {property.areaSqm != null && (
              <Spec icon={Ruler} label={t("builtArea", { value: number(property.areaSqm) })}>
                {number(property.areaSqm)} m²
              </Spec>
            )}
            {property.plotArea != null && (
              <Spec icon={LandPlot} label={t("plotArea", { value: number(property.plotArea) })}>
                {number(property.plotArea)} m²
              </Spec>
            )}
          </div>

          <div className="mt-1 flex h-6 items-center gap-3 text-xs text-muted-foreground">
            <StatusPill status={property.status} />
            <div className="ml-auto flex min-w-0 items-center gap-3">
              {property.owner && (
                <span className="inline-flex min-w-0 items-center gap-1.5" title={t("owner", { name: property.owner.name })}>
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-secondary text-[0.6rem] font-semibold text-secondary-foreground">
                    {initials(property.owner.name)}
                  </span>
                  <span className="truncate">{property.owner.name}</span>
                </span>
              )}
              <span className="inline-flex shrink-0 items-center gap-1" title={t("updated", { ago: updated })}>
                <Clock className="size-3" />
                {updated}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  if (preview) return <div className={CARD_CLASS}>{inner}</div>;

  return (
    <Link
      href={`/${agencySlug}/properties/${property.id}`}
      data-flip-id={property.id}
      className={cn(
        CARD_CLASS,
        selected && "ring-2 ring-primary",
        "hover:-translate-y-0.5 hover:shadow-[0_1px_2px_oklch(0.3_0.05_160/0.06),0_24px_44px_-12px_oklch(0.3_0.05_160/0.26)] focus-visible:ring-3 focus-visible:ring-ring/50",
      )}
    >
      {inner}
    </Link>
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/5">
      <div className="aspect-[4/3] bg-secondary" />
      <div className="flex flex-col gap-4 p-5">
        <div className="flex flex-col gap-2">
          <div className="h-3 w-24 rounded-full bg-muted" />
          <div className="h-6 w-4/5 rounded-full bg-muted" />
          <div className="h-4 w-1/2 rounded-full bg-muted" />
        </div>
        <div className="h-8 w-2/5 rounded-full bg-muted" />
        <div className="h-4 w-3/5 rounded-full bg-muted" />
        <div className="h-4 w-full rounded-full bg-muted" />
      </div>
    </div>
  );
}
