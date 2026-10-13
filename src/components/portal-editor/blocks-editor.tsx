"use client";

import {
  ArrowDown,
  ArrowUp,
  BadgePercent,
  ChevronDown,
  Compass,
  Eye,
  EyeOff,
  ImagePlus,
  LoaderCircle,
  MapPin,
  Megaphone,
  Plus,
  Star,
  TextQuote,
  Trash2,
  X,
} from "lucide-react";
import { useId, useRef, useState } from "react";
import { toast } from "sonner";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/rich-text/rich-text-editor";
import {
  type Destination,
  type SiteSection,
  uploadSiteImage,
} from "@/lib/api/agency";
import { ApiError } from "@/lib/api/client";
import type { Property } from "@/lib/api/properties";
import { getAccessToken } from "@/lib/auth/session";
import { compressToWebp } from "@/lib/image-compression";
import {
  BUTTON_TARGETS,
  SECTION_TYPES,
  newId,
  newSection,
  sectionLayout,
} from "@/lib/site-theme";
import { cn } from "@/lib/utils";

const MAX_SECTIONS = 12;
const MAX_PROPERTIES = 12;
const MAX_DESTINATIONS = 12;

const ICONS: Record<SiteSection["type"], typeof MapPin> = {
  location: MapPin,
  promo: BadgePercent,
  featured: Star,
  destinations: Compass,
  text: TextQuote,
  cta: Megaphone,
};

const ICON_BUTTON =
  "flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-foreground/[0.07] hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-30";
const PILL_ON = "bg-foreground text-background";
const PILL_OFF =
  "bg-foreground/[0.06] text-muted-foreground hover:bg-foreground/10 hover:text-foreground";

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
    </div>
  );
}

/** Small segmented choice, used for a block's layout and similar options. */
function Pills<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="flex flex-wrap gap-1.5"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "h-9 rounded-full px-3.5 text-sm font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
            value === option.value ? PILL_ON : PILL_OFF,
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function ImageUpload({
  value,
  onChange,
  compact = false,
}: {
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  compact?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function upload(file: File) {
    const token = getAccessToken();
    if (!token) return;
    setUploading(true);
    try {
      const compressed = await compressToWebp(file, { maxSide: 2000 });
      const { url } = await uploadSiteImage(token, compressed);
      onChange(url);
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "No se pudo subir la imagen",
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        aria-label={value ? "Cambiar imagen" : "Subir imagen"}
        className={cn(
          "relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-foreground/[0.06] text-muted-foreground outline-none hover:bg-foreground/10 focus-visible:ring-3 focus-visible:ring-ring/50",
          compact ? "size-14" : "h-20 w-32",
        )}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="size-full object-cover" />
        ) : (
          <ImagePlus className="size-5" strokeWidth={1.5} />
        )}
        {uploading && (
          <span className="absolute inset-0 flex items-center justify-center bg-foreground/50 text-background">
            <LoaderCircle className="size-4 animate-spin" />
          </span>
        )}
      </button>
      {!compact && (
        <div className="flex flex-wrap gap-1">
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="h-9 rounded-full bg-foreground/[0.06] px-3.5 text-sm font-medium outline-none hover:bg-foreground/10 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-60"
          >
            {value ? "Cambiar" : "Subir imagen"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="h-9 rounded-full px-3.5 text-sm text-muted-foreground outline-none hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              Quitar
            </button>
          )}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) upload(file);
          event.target.value = "";
        }}
      />
    </div>
  );
}

/** A checklist of the agency's published listings, capped at twelve. */
function PropertyPicker({
  label,
  selected,
  onChange,
  properties,
}: {
  label: string;
  selected: string[];
  onChange: (ids: string[]) => void;
  properties: Property[];
}) {
  const full = selected.length >= MAX_PROPERTIES;
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 text-sm font-medium">
        {label}{" "}
        <span className="font-normal text-muted-foreground">
          ({selected.length} de {MAX_PROPERTIES} como máximo)
        </span>
      </legend>
      {properties.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Todavía no tenés propiedades publicadas.
        </p>
      ) : (
        <ul className="flex max-h-64 flex-col overflow-y-auto rounded-lg border border-border">
          {properties.map((property) => {
            const checked = selected.includes(property.id);
            const place = [property.area, property.region]
              .filter(Boolean)
              .join(", ");
            return (
              <li
                key={property.id}
                className="border-b border-border last:border-b-0"
              >
                <label
                  className={cn(
                    "flex cursor-pointer items-center gap-3 px-3 py-2.5 hover:bg-foreground/[0.03]",
                    !checked && full && "cursor-not-allowed opacity-50",
                  )}
                >
                  <Checkbox
                    checked={checked}
                    disabled={!checked && full}
                    onCheckedChange={(next) =>
                      onChange(
                        next
                          ? [...selected, property.id]
                          : selected.filter((id) => id !== property.id),
                      )
                    }
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">
                      {property.title}
                    </span>
                    {place && (
                      <span className="block truncate text-xs text-muted-foreground">
                        {place}
                      </span>
                    )}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      )}
    </fieldset>
  );
}

function ZoneInput({
  id,
  value,
  onChange,
  zones,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  zones: string[];
  placeholder?: string;
}) {
  return (
    <>
      <Input
        id={id}
        list={`${id}-zones`}
        value={value}
        maxLength={120}
        placeholder={placeholder ?? zones[0] ?? "Ibiza"}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 px-3.5"
      />
      <datalist id={`${id}-zones`}>
        {zones.map((zone) => (
          <option key={zone} value={zone} />
        ))}
      </datalist>
    </>
  );
}

/** The places inside a "destinations" block: name, zone and photo each. */
function DestinationsList({
  destinations,
  onChange,
  zones,
}: {
  destinations: Destination[];
  onChange: (destinations: Destination[]) => void;
  zones: string[];
}) {
  const id = useId();
  const patch = (destinationId: string, next: Partial<Destination>) =>
    onChange(
      destinations.map((item) =>
        item.id === destinationId ? { ...item, ...next } : item,
      ),
    );

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-2 text-sm font-medium">Destinos</legend>
      <ul className="flex flex-col gap-2">
        {destinations.map((destination, index) => (
          <li
            key={destination.id}
            className="flex items-start gap-3 rounded-lg border border-border p-2.5"
          >
            <ImageUpload
              compact
              value={destination.imageUrl}
              onChange={(imageUrl) => patch(destination.id, { imageUrl })}
            />
            <div className="grid min-w-0 flex-1 gap-2">
              <Input
                aria-label={`Nombre del destino ${index + 1}`}
                value={destination.name ?? ""}
                maxLength={80}
                placeholder="Mykonos"
                onChange={(event) =>
                  patch(destination.id, { name: event.target.value })
                }
                className="h-9 px-3"
              />
              <ZoneInput
                id={`${id}-${destination.id}`}
                value={destination.zone ?? ""}
                onChange={(zone) => patch(destination.id, { zone })}
                zones={zones}
                placeholder="Zona (si es distinta del nombre)"
              />
            </div>
            <button
              type="button"
              className={ICON_BUTTON}
              aria-label={`Quitar ${destination.name || "destino"}`}
              onClick={() =>
                onChange(
                  destinations.filter((item) => item.id !== destination.id),
                )
              }
            >
              <X className="size-4" />
            </button>
          </li>
        ))}
      </ul>
      {destinations.length < MAX_DESTINATIONS && (
        <button
          type="button"
          onClick={() =>
            onChange([
              ...destinations,
              { id: newId(), name: "", zone: "", imageUrl: null },
            ])
          }
          className="inline-flex h-9 w-fit items-center gap-1.5 rounded-full bg-foreground/[0.06] px-3.5 text-sm font-medium outline-none hover:bg-foreground/10 focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Plus className="size-4" />
          Agregar destino
        </button>
      )}
    </fieldset>
  );
}

function ButtonFields({
  section,
  onChange,
}: {
  section: SiteSection;
  onChange: (next: Partial<SiteSection>) => void;
}) {
  const id = useId();
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field
        label="Texto del botón"
        htmlFor={`${id}-label`}
        hint="Vacío: sin botón."
      >
        <Input
          id={`${id}-label`}
          value={section.buttonLabel ?? ""}
          maxLength={40}
          placeholder="Escribinos"
          onChange={(event) => onChange({ buttonLabel: event.target.value })}
          className="h-10 px-3.5"
        />
      </Field>
      <Field label="Lleva a" htmlFor={`${id}-target`}>
        <select
          id={`${id}-target`}
          value={section.buttonTarget ?? "contact"}
          onChange={(event) =>
            onChange({
              buttonTarget: event.target.value as SiteSection["buttonTarget"],
            })
          }
          className="h-10 rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {BUTTON_TARGETS.map((target) => (
            <option key={target.value} value={target.value}>
              {target.label}
            </option>
          ))}
        </select>
      </Field>
    </div>
  );
}

const PLACEHOLDERS: Record<
  SiteSection["type"],
  { title: string; text: string }
> = {
  location: {
    title: "Ibiza",
    text: "Calas de agua turquesa, pueblos blancos y atardeceres. Tenemos villas y departamentos en toda la isla.",
  },
  promo: {
    title: "Verano en la costa",
    text: "Reservando antes del 30 de noviembre, 15% de descuento en estadías de una semana o más.",
  },
  featured: {
    title: "Recién llegadas",
    text: "Las últimas propiedades que sumamos.",
  },
  destinations: { title: "Dónde tenemos propiedades", text: "" },
  text: {
    title: "Tasamos tu propiedad sin costo",
    text: "Te decimos cuánto vale en el mercado de hoy y cómo venderla más rápido.",
  },
  cta: {
    title: "¿Querés vender tu propiedad?",
    text: "Te acompañamos desde la tasación hasta la escritura.",
  },
};

function BlockFields({
  section,
  onChange,
  properties,
  zones,
}: {
  section: SiteSection;
  onChange: (next: Partial<SiteSection>) => void;
  properties: Property[];
  zones: string[];
}) {
  const id = useId();
  const type = SECTION_TYPES.find((option) => option.value === section.type);
  const layout = sectionLayout(section);
  const placeholders = PLACEHOLDERS[section.type];
  // A location shows its zone's listings unless the agency picks them; picking starts with an empty list.
  const [pickListings, setPickListings] = useState(
    (section.propertyIds ?? []).length > 0,
  );

  const usesImage =
    (section.type === "location" && layout !== "carousel") ||
    section.type === "promo" ||
    (section.type === "text" && layout !== "centered") ||
    (section.type === "cta" && layout === "photo");

  return (
    <div className="flex flex-col gap-5 border-t border-border px-4 pt-5 pb-5">
      {type && type.layouts.length > 1 && (
        <Field label="Diseño">
          <Pills
            label="Diseño del bloque"
            value={layout}
            options={type.layouts}
            onChange={(next) => onChange({ layout: next })}
          />
        </Field>
      )}

      <Field label="Título" htmlFor={`${id}-title`}>
        <Input
          id={`${id}-title`}
          value={section.title ?? ""}
          maxLength={120}
          placeholder={placeholders.title}
          onChange={(event) => onChange({ title: event.target.value })}
          className="h-10 px-3.5"
        />
      </Field>

      {section.type === "location" && (
        <Field
          label="Zona"
          htmlFor={`${id}-zone`}
          hint="Se cuentan las propiedades cuyo barrio, región o país coincide con esta zona."
        >
          <ZoneInput
            id={`${id}-zone`}
            value={section.zone ?? ""}
            onChange={(zone) => onChange({ zone })}
            zones={zones}
          />
        </Field>
      )}

      {section.type === "promo" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Etiqueta" htmlFor={`${id}-badge`}>
            <Input
              id={`${id}-badge`}
              value={section.badge ?? ""}
              maxLength={40}
              placeholder="15% OFF"
              onChange={(event) => onChange({ badge: event.target.value })}
              className="h-10 px-3.5"
            />
          </Field>
          <Field label="Válido hasta (opcional)" htmlFor={`${id}-ends`}>
            <Input
              id={`${id}-ends`}
              type="date"
              value={section.endsAt ?? ""}
              onChange={(event) =>
                onChange({ endsAt: event.target.value || null })
              }
              className="h-10 px-3.5"
            />
          </Field>
        </div>
      )}

      <Field label="Texto" htmlFor={`${id}-text`}>
        {/* The free text block takes formatting; in the rest the text is a short line. */}
        {section.type === "text" ? (
          <RichTextEditor
            id={`${id}-text`}
            value={section.text ?? ""}
            placeholder={placeholders.text}
            onChange={(html) => onChange({ text: html })}
          />
        ) : (
          <Textarea
            id={`${id}-text`}
            rows={3}
            maxLength={1000}
            value={section.text ?? ""}
            placeholder={placeholders.text}
            onChange={(event) => onChange({ text: event.target.value })}
            className="px-3.5 py-2.5"
          />
        )}
      </Field>

      {usesImage && (
        <Field
          label={section.type === "location" ? "Foto de la zona" : "Imagen"}
        >
          <ImageUpload
            value={section.imageUrl}
            onChange={(imageUrl) => onChange({ imageUrl })}
          />
        </Field>
      )}

      {(section.type === "text" || section.type === "cta") && (
        <ButtonFields section={section} onChange={onChange} />
      )}

      {section.type === "destinations" && (
        <DestinationsList
          destinations={section.destinations ?? []}
          onChange={(destinations) => onChange({ destinations })}
          zones={zones}
        />
      )}

      {section.type === "location" && (
        <div className="flex flex-col gap-3">
          <Field label="Propiedades del bloque">
            <Pills
              label="Qué propiedades mostrar"
              value={pickListings ? "pick" : "zone"}
              options={[
                { value: "zone", label: "Las de la zona" },
                { value: "pick", label: "Elegirlas" },
              ]}
              onChange={(mode) => {
                setPickListings(mode === "pick");
                if (mode === "zone") onChange({ propertyIds: [] });
              }}
            />
          </Field>
          {pickListings && (
            <PropertyPicker
              label="Propiedades elegidas"
              selected={section.propertyIds ?? []}
              onChange={(propertyIds) => onChange({ propertyIds })}
              properties={properties}
            />
          )}
        </div>
      )}

      {(section.type === "promo" || section.type === "featured") && (
        <PropertyPicker
          label={
            section.type === "promo" ? "Propiedades incluidas" : "Propiedades"
          }
          selected={section.propertyIds ?? []}
          onChange={(propertyIds) => onChange({ propertyIds })}
          properties={properties}
        />
      )}
    </div>
  );
}

/** What a block shows as its name in the list: its title, or something that identifies it. */
function blockName(section: SiteSection) {
  return (
    section.title?.trim() ||
    (section.type === "location" ? section.zone?.trim() : null) ||
    (section.type === "destinations"
      ? (section.destinations ?? [])
          .map((d) => d.name)
          .filter(Boolean)
          .join(", ")
      : null) ||
    "Sin título"
  );
}

/**
 * The portal's own blocks: add one of six kinds, pick its layout, edit it,
 * hide it without losing it, reorder or delete it. Changes reach the preview
 * right away and the portal when the page is saved.
 */
export function BlocksEditor({
  sections,
  onChange,
  properties,
}: {
  sections: SiteSection[];
  onChange: (sections: SiteSection[]) => void;
  properties: Property[];
}) {
  const [open, setOpen] = useState<string | null>(null);
  const [adding, setAdding] = useState(sections.length === 0);
  const zones = [
    ...new Set(
      properties
        .flatMap((p) => [p.area, p.region, p.country])
        .filter(Boolean) as string[],
    ),
  ];

  function patch(id: string, next: Partial<SiteSection>) {
    onChange(
      sections.map((section) =>
        section.id === id ? { ...section, ...next } : section,
      ),
    );
  }

  function move(index: number, delta: number) {
    const next = [...sections];
    const [item] = next.splice(index, 1);
    next.splice(index + delta, 0, item);
    onChange(next);
  }

  function add(type: SiteSection["type"]) {
    const section = newSection(type);
    onChange([...sections, section]);
    setOpen(section.id);
    setAdding(false);
  }

  return (
    <div className="flex flex-col gap-3">
      {sections.length > 0 && (
        <ol className="flex flex-col gap-2">
          {sections.map((section, index) => {
            const Icon = ICONS[section.type];
            const type = SECTION_TYPES.find(
              (option) => option.value === section.type,
            );
            const layoutLabel = type?.layouts.find(
              (layout) => layout.value === sectionLayout(section),
            )?.label;
            const expanded = open === section.id;
            const hidden = section.visible === false;
            const name = blockName(section);
            return (
              <li
                key={section.id}
                className={cn(
                  "rounded-xl bg-foreground/[0.04]",
                  hidden && "opacity-60",
                )}
              >
                <div className="flex items-center gap-0.5 py-1.5 pr-1.5 pl-2">
                  <button
                    type="button"
                    aria-expanded={expanded}
                    onClick={() => setOpen(expanded ? null : section.id)}
                    className="flex min-w-0 flex-1 items-center gap-3 rounded-md px-1.5 py-1.5 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-background text-muted-foreground">
                      <Icon className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">
                        {name}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {type?.label}
                        {layoutLabel &&
                          type &&
                          type.layouts.length > 1 &&
                          ` · ${layoutLabel}`}
                        {hidden && " · oculto"}
                      </span>
                    </span>
                    <ChevronDown
                      className={cn(
                        "size-4 shrink-0 text-muted-foreground transition-transform",
                        expanded && "rotate-180",
                      )}
                    />
                  </button>
                  <button
                    type="button"
                    className={ICON_BUTTON}
                    aria-label={hidden ? `Mostrar ${name}` : `Ocultar ${name}`}
                    title={
                      hidden ? "Mostrar en el portal" : "Ocultar del portal"
                    }
                    onClick={() => patch(section.id, { visible: hidden })}
                  >
                    {hidden ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    className={ICON_BUTTON}
                    aria-label={`Subir ${name}`}
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                  >
                    <ArrowUp className="size-4" />
                  </button>
                  <button
                    type="button"
                    className={ICON_BUTTON}
                    aria-label={`Bajar ${name}`}
                    disabled={index === sections.length - 1}
                    onClick={() => move(index, 1)}
                  >
                    <ArrowDown className="size-4" />
                  </button>
                  <button
                    type="button"
                    className={cn(ICON_BUTTON, "hover:text-destructive")}
                    aria-label={`Borrar ${name}`}
                    onClick={() =>
                      onChange(
                        sections.filter((item) => item.id !== section.id),
                      )
                    }
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                {expanded && (
                  <BlockFields
                    section={section}
                    onChange={(next) => patch(section.id, next)}
                    properties={properties}
                    zones={zones}
                  />
                )}
              </li>
            );
          })}
        </ol>
      )}

      {sections.length >= MAX_SECTIONS ? (
        <p className="text-sm text-muted-foreground">
          Llegaste al máximo de {MAX_SECTIONS} bloques.
        </p>
      ) : adding ? (
        <div className="flex flex-col gap-2 rounded-xl border border-dashed border-border p-2">
          <div className="flex items-center justify-between px-2 pt-1">
            <p className="text-sm font-medium">¿Qué bloque querés agregar?</p>
            {sections.length > 0 && (
              <button
                type="button"
                className={ICON_BUTTON}
                aria-label="Cerrar"
                onClick={() => setAdding(false)}
              >
                <X className="size-4" />
              </button>
            )}
          </div>
          <div className="grid gap-1">
            {SECTION_TYPES.map((type) => {
              const Icon = ICONS[type.value];
              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => add(type.value)}
                  className="flex items-start gap-3 rounded-lg p-2.5 text-left outline-none transition-colors hover:bg-foreground/[0.05] focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-foreground/[0.06] text-muted-foreground">
                    <Icon className="size-4" />
                  </span>
                  <span className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium">{type.label}</span>
                    <span className="text-xs text-pretty text-muted-foreground">
                      {type.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-dashed border-border text-sm font-medium outline-none transition-colors hover:border-foreground/30 hover:bg-foreground/[0.03] focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Plus className="size-4" />
          Agregar bloque
        </button>
      )}
    </div>
  );
}
