"use client";

import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Bath, BedDouble, Building2, Camera, MapPin, Ruler } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { coverOf, initials } from "@/components/properties/property-card";
import { ControlsZone, PropertyMenu, SelectToggle, type PropertyActions } from "@/components/properties/property-controls";
import type { Property, PropertyStatus } from "@/lib/api/properties";
import { categoryLabel, LISTING_TYPE_LABELS, STATUS_LABELS } from "@/lib/properties-labels";
import { cn } from "@/lib/utils";

const STATUS_PILL: Record<PropertyStatus, string> = {
  PUBLISHED: "bg-primary/10 text-primary",
  DRAFT: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  ARCHIVED: "bg-foreground/[0.07] text-muted-foreground",
};

function StatusPill({ status }: { status: PropertyStatus }) {
  return (
    <span className={cn("inline-flex h-6 items-center rounded-full px-2.5 text-xs font-medium", STATUS_PILL[status])}>
      {STATUS_LABELS[status]}
    </span>
  );
}

const number = (value: number) => value.toLocaleString("es-AR");

function Price({ property, className }: { property: Property; className?: string }) {
  return property.price ? (
    <span className={cn("tabular-nums", className)}>
      <span className="mr-1 text-xs font-medium text-muted-foreground">{property.currency}</span>
      <span className="font-semibold">{number(property.price)}</span>
    </span>
  ) : (
    <span className={cn("text-muted-foreground", className)}>A consultar</span>
  );
}

function Thumb({ property, className }: { property: Property; className?: string }) {
  const cover = coverOf(property);
  const archived = property.status === "ARCHIVED";
  return (
    <div className={cn("relative overflow-hidden bg-secondary", className)}>
      {cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={cover.url}
          alt=""
          loading="lazy"
          className={cn("size-full object-cover", archived && "opacity-80 grayscale")}
        />
      ) : (
        <div className="flex size-full items-center justify-center text-primary/30">
          <Building2 className="size-1/3" strokeWidth={1.25} />
        </div>
      )}
    </div>
  );
}

const ROW_CLASS =
  "property-card group flex flex-col gap-4 rounded-2xl bg-card p-3 shadow-[0_1px_2px_oklch(0.3_0.05_160/0.04),0_12px_32px_-12px_oklch(0.3_0.05_160/0.14)] ring-1 ring-foreground/5 outline-none transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_1px_2px_oklch(0.3_0.05_160/0.06),0_24px_44px_-12px_oklch(0.3_0.05_160/0.26)] focus-visible:ring-3 focus-visible:ring-ring/50 sm:flex-row";

/** One property as a wide row: photo on the left, details in the middle, price and status on the right. */
export function PropertyRow({
  property,
  actions,
  selected,
  selecting,
  onToggle,
}: {
  property: Property;
  actions: PropertyActions;
  selected: boolean;
  selecting: boolean;
  onToggle: () => void;
}) {
  const location = [property.area, property.region, property.country].filter(Boolean).join(", ");
  const updated = formatDistanceToNow(new Date(property.updatedAt), { addSuffix: true, locale: es });

  return (
    <Link href={`/properties/${property.id}`} data-flip-id={property.id} className={cn(ROW_CLASS, selected && "ring-2 ring-primary")}>
      <div className="relative sm:w-56 sm:shrink-0">
        <Thumb property={property} className="aspect-[4/3] w-full rounded-xl" />
        {property.photos.length > 0 && (
          <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-foreground/55 px-2 py-0.5 text-xs font-medium text-background backdrop-blur">
            <Camera className="size-3" />
            {property.photos.length}
          </span>
        )}
        <ControlsZone
          className={cn(
            "absolute bottom-2 left-2 transition-opacity duration-200 [@media(hover:none)]:opacity-100",
            selecting || selected ? "opacity-100" : "opacity-0 group-focus-within:opacity-100 group-hover:opacity-100",
          )}
        >
          <SelectToggle
            checked={selected}
            onToggle={onToggle}
            label={selected ? `Quitar ${property.title} de la selección` : `Seleccionar ${property.title}`}
          />
        </ControlsZone>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:py-1">
        <p className="text-xs font-medium text-primary">
          {LISTING_TYPE_LABELS[property.listingType]} · {categoryLabel(property.category)}
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
        <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-2 text-sm tabular-nums">
          {property.bedrooms != null && (
            <span className="inline-flex items-center gap-1.5" title={`${number(property.bedrooms)} dormitorios`}>
              <BedDouble className="size-4 text-muted-foreground" />
              {number(property.bedrooms)}
            </span>
          )}
          {property.bathrooms != null && (
            <span className="inline-flex items-center gap-1.5" title={`${number(property.bathrooms)} baños`}>
              <Bath className="size-4 text-muted-foreground" />
              {number(property.bathrooms)}
            </span>
          )}
          {property.areaSqm != null && (
            <span className="inline-flex items-center gap-1.5" title="Superficie construida">
              <Ruler className="size-4 text-muted-foreground" />
              {number(property.areaSqm)} m²
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 sm:w-44 sm:flex-col sm:items-end sm:py-1 sm:text-right">
        <ControlsZone className="flex items-center gap-2">
          <StatusPill status={property.status} />
          <PropertyMenu property={property} actions={actions} className="bg-foreground/[0.06] hover:bg-foreground/10" />
        </ControlsZone>
        <div className="flex flex-col gap-1 sm:items-end">
          <Price property={property} className="text-xl" />
          <span className="truncate text-xs text-muted-foreground">
            {property.owner ? `${property.owner.name} · ${updated}` : updated}
          </span>
        </div>
      </div>
    </Link>
  );
}

const HEAD = "px-4 py-3 text-left text-xs font-medium text-muted-foreground";

/** Dense, sortable-looking table: one property per line. */
export function PropertiesTable({
  properties,
  actions,
  selectedIds,
  onToggle,
  onToggleAll,
}: {
  properties: Property[];
  actions: PropertyActions;
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  onToggleAll: () => void;
}) {
  const allSelected = properties.length > 0 && properties.every((property) => selectedIds.has(property.id));
  const someSelected = !allSelected && properties.some((property) => selectedIds.has(property.id));
  const router = useRouter();

  return (
    <div className="overflow-x-auto rounded-2xl bg-card shadow-[0_1px_2px_oklch(0.3_0.05_160/0.04),0_12px_32px_-12px_oklch(0.3_0.05_160/0.14)] ring-1 ring-foreground/5">
      <table className="w-full min-w-[900px] border-collapse text-sm">
        <thead>
          <tr>
            <th className={cn(HEAD, "w-12 pr-0")}>
              <SelectToggle
                checked={allSelected}
                indeterminate={someSelected}
                onToggle={onToggleAll}
                label={allSelected ? "Quitar la selección de todas" : "Seleccionar todas"}
                className="size-5"
              />
            </th>
            <th className={cn(HEAD, "pl-3")}>Propiedad</th>
            <th className={HEAD}>Estado</th>
            <th className={cn(HEAD, "text-right")}>Precio</th>
            <th className={cn(HEAD, "text-right")}>Dorm.</th>
            <th className={cn(HEAD, "text-right")}>Baños</th>
            <th className={cn(HEAD, "text-right")}>Superficie</th>
            <th className={HEAD}>Propietario</th>
            <th className={HEAD}>Actualizada</th>
            <th className={cn(HEAD, "w-14")}>
              <span className="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {properties.map((property) => {
            const location = [property.area, property.region].filter(Boolean).join(", ");
            return (
              <tr
                key={property.id}
                data-flip-id={property.id}
                onClick={() => router.push(`/properties/${property.id}`)}
                className={cn(
                  "property-card cursor-pointer border-t border-foreground/5 transition-colors hover:bg-foreground/[0.03]",
                  selectedIds.has(property.id) && "bg-primary/[0.06] hover:bg-primary/[0.08]",
                )}
              >
                <td className="w-12 py-3 pr-0 pl-4" onClick={(event) => event.stopPropagation()}>
                  <SelectToggle
                    checked={selectedIds.has(property.id)}
                    onToggle={() => onToggle(property.id)}
                    label={`Seleccionar ${property.title}`}
                    className="size-5"
                  />
                </td>
                <td className="py-3 pr-4 pl-3">
                  <div className="flex items-center gap-3">
                    <Thumb property={property} className="size-12 shrink-0 rounded-lg" />
                    <div className="flex min-w-0 flex-col">
                      <Link
                        href={`/properties/${property.id}`}
                        onClick={(event) => event.stopPropagation()}
                        className="truncate font-medium outline-none hover:underline focus-visible:underline"
                        title={property.title}
                      >
                        {property.title}
                      </Link>
                      <span className="truncate text-xs text-muted-foreground">
                        {LISTING_TYPE_LABELS[property.listingType]} · {categoryLabel(property.category)}
                        {location && ` · ${location}`}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <StatusPill status={property.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Price property={property} />
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {property.bedrooms != null ? number(property.bedrooms) : "—"}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {property.bathrooms != null ? number(property.bathrooms) : "—"}
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap tabular-nums">
                  {property.areaSqm != null ? `${number(property.areaSqm)} m²` : "—"}
                </td>
                <td className="px-4 py-3">
                  {property.owner ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-[0.6rem] font-semibold text-secondary-foreground">
                        {initials(property.owner.name)}
                      </span>
                      <span className="max-w-36 truncate">{property.owner.name}</span>
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                  {formatDistanceToNow(new Date(property.updatedAt), { addSuffix: true, locale: es })}
                </td>
                <td className="w-14 py-3 pr-4" onClick={(event) => event.stopPropagation()}>
                  <PropertyMenu property={property} actions={actions} className="bg-foreground/[0.06] hover:bg-foreground/10" />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
