import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Bath, BedDouble, Building2, Camera, LandPlot, MapPin, Ruler, User } from "lucide-react";
import Link from "next/link";

import type { Property, PropertyStatus } from "@/lib/api/properties";
import { categoryLabel, LISTING_TYPE_LABELS, STATUS_LABELS } from "@/lib/properties-labels";
import { cn } from "@/lib/utils";

const STATUS_DOT: Record<PropertyStatus, string> = {
  PUBLISHED: "bg-primary",
  DRAFT: "bg-amber-500",
  ARCHIVED: "bg-muted-foreground",
};

function coverOf(property: Property) {
  const photos = [...property.photos].sort((a, b) => a.position - b.position);
  return photos.find((photo) => photo.isCover) ?? photos[0] ?? null;
}

function formatPrice(property: Property) {
  if (!property.price) return null;
  return `${property.currency} ${property.price.toLocaleString("es-AR")}`;
}

function Spec({ icon: Icon, children }: { icon: typeof Bath; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Icon className="size-4 text-muted-foreground" />
      {children}
    </span>
  );
}

export function PropertyCard({ property }: { property: Property }) {
  const cover = coverOf(property);
  const price = formatPrice(property);
  const location = [property.area, property.region, property.country].filter(Boolean).join(", ");
  const updated = formatDistanceToNow(new Date(property.updatedAt), { addSuffix: true, locale: es });

  return (
    <Link
      href={`/properties/${property.id}`}
      data-flip-id={property.id}
      className="property-card group flex flex-col overflow-hidden rounded-2xl bg-card shadow-[0_1px_2px_oklch(0.3_0.05_160/0.04),0_12px_32px_-12px_oklch(0.3_0.05_160/0.14)] ring-1 ring-foreground/5 outline-none transition-shadow hover:shadow-[0_1px_2px_oklch(0.3_0.05_160/0.06),0_20px_40px_-12px_oklch(0.3_0.05_160/0.24)] focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover.url}
            alt={property.title}
            loading="lazy"
            className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-primary/30">
            <Building2 className="size-14" strokeWidth={1.25} />
          </div>
        )}
        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-card/90 px-2.5 py-1 text-xs font-medium backdrop-blur">
          <span className={cn("size-1.5 rounded-full", STATUS_DOT[property.status])} />
          {STATUS_LABELS[property.status]}
        </span>
        {property.photos.length > 0 && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-foreground/55 px-2.5 py-1 text-xs font-medium text-background backdrop-blur">
            <Camera className="size-3.5" />
            {property.photos.length}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-col gap-1.5">
          <p className="text-[0.7rem] font-semibold tracking-[0.12em] text-primary uppercase">
            {LISTING_TYPE_LABELS[property.listingType]} · {categoryLabel(property.category)}
          </p>
          <h3 className="font-display text-xl leading-tight text-balance line-clamp-2">
            {property.title}
          </h3>
          {location && (
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-3.5 shrink-0" />
              <span className="truncate">{location}</span>
            </p>
          )}
        </div>

        <p className="font-display text-2xl tabular-nums">
          {price ?? <span className="text-base text-muted-foreground">Precio a consultar</span>}
        </p>

        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm tabular-nums">
          {property.bedrooms != null && <Spec icon={BedDouble}>{property.bedrooms.toLocaleString("es-AR")}</Spec>}
          {property.bathrooms != null && <Spec icon={Bath}>{property.bathrooms.toLocaleString("es-AR")}</Spec>}
          {property.areaSqm != null && <Spec icon={Ruler}>{property.areaSqm.toLocaleString("es-AR")} m²</Spec>}
          {property.plotArea != null && <Spec icon={LandPlot}>{property.plotArea.toLocaleString("es-AR")} m²</Spec>}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-2 text-xs text-muted-foreground">
          <span className="inline-flex min-w-0 items-center gap-1.5">
            <User className="size-3.5 shrink-0" />
            <span className="truncate">{property.owner?.name ?? "Sin propietario"}</span>
          </span>
          <span className="shrink-0">Actualizada {updated}</span>
        </div>
      </div>
    </Link>
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/5">
      <div className="aspect-[4/3] bg-secondary" />
      <div className="flex flex-col gap-3 p-5">
        <div className="h-3 w-24 rounded-full bg-muted" />
        <div className="h-6 w-4/5 rounded-full bg-muted" />
        <div className="h-4 w-1/2 rounded-full bg-muted" />
        <div className="h-7 w-2/5 rounded-full bg-muted" />
        <div className="h-4 w-3/5 rounded-full bg-muted" />
      </div>
    </div>
  );
}
