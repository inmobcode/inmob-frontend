"use client";

import {
  ArrowDown,
  ArrowUp,
  BadgePercent,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Compass,
  Eye,
  EyeOff,
  ImagePlus,
  LoaderCircle,
  MapPin,
  Megaphone,
  Plus,
  Search,
  Star,
  TextQuote,
  Trash2,
  X,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useId, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/rich-text/rich-text-editor";
import {
  type Destination,
  type SectionLayout,
  type SiteSection,
  uploadSiteImage,
} from "@/lib/api/agency";
import { ApiError } from "@/lib/api/client";
import type { Property } from "@/lib/api/properties";
import { getAccessToken } from "@/lib/auth/session";
import { compressToWebp } from "@/lib/image-compression";
import { placeLabel, samePlace, uniquePlaces } from "@/lib/places";
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
const PROPERTY_PAGE_SIZE = 8;

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
  const t = useTranslations("portalEditor.blocks");
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
        err instanceof ApiError ? err.message : t("imageFailed"),
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
        aria-label={value ? t("changeImage") : t("uploadImage")}
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
            {value ? t("change") : t("uploadImage")}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="h-9 rounded-full px-3.5 text-sm text-muted-foreground outline-none hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {t("remove")}
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

/** A checklist of the agency's published listings, capped at twelve, with a search box and pagination for agencies with many listings. */
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
  const t = useTranslations("portalEditor.blocks");
  const locale = useLocale();
  const full = selected.length >= MAX_PROPERTIES;
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return properties;
    return properties.filter((property) =>
      [property.title, property.area, property.region, property.country]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [properties, query]);

  const pageCount = Math.max(Math.ceil(filtered.length / PROPERTY_PAGE_SIZE), 1);
  const clampedPage = Math.min(page, pageCount - 1);
  const paged = filtered.slice(
    clampedPage * PROPERTY_PAGE_SIZE,
    clampedPage * PROPERTY_PAGE_SIZE + PROPERTY_PAGE_SIZE,
  );

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 text-sm font-medium">
        {label}{" "}
        <span className="font-normal text-muted-foreground">
          {t("picker.count", { count: selected.length, max: MAX_PROPERTIES })}
        </span>
      </legend>
      {properties.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {t("picker.empty")}
        </p>
      ) : (
        <>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(0);
              }}
              placeholder={t("picker.searchPlaceholder")}
              aria-label={t("picker.searchIn", { label: locale === "de" ? label : label.toLowerCase() })}
              className="h-9 pl-9"
            />
          </div>
          {filtered.length === 0 ? (
            <p className="px-1 text-sm text-muted-foreground">
              {t("picker.noMatch")}
            </p>
          ) : (
            <ul className="flex flex-col overflow-hidden rounded-lg border border-border">
              {paged.map((property) => {
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
          {pageCount > 1 && (
            <div className="flex items-center justify-between px-1 text-sm text-muted-foreground">
              <button
                type="button"
                className={cn(ICON_BUTTON, "size-7")}
                aria-label={t("picker.previous")}
                disabled={clampedPage === 0}
                onClick={() => setPage(clampedPage - 1)}
              >
                <ChevronLeft className="size-4" />
              </button>
              <span>
                {t("picker.page", { page: clampedPage + 1, total: pageCount })}
              </span>
              <button
                type="button"
                className={cn(ICON_BUTTON, "size-7")}
                aria-label={t("picker.next")}
                disabled={clampedPage === pageCount - 1}
                onClick={() => setPage(clampedPage + 1)}
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          )}
        </>
      )}
    </fieldset>
  );
}

const NO_ZONE = "__none__";

/**
 * Picks one of the places the agency's listings are in. A zone saved earlier
 * that isn't in the list any more (or was typed by hand) stays selectable, so
 * opening the block never silently changes it.
 */
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
  const t = useTranslations("portalEditor.blocks");
  const known = zones.some((zone) => samePlace(zone, value));
  const options = value && !known ? [value, ...zones] : zones;
  // Compare ignoring case so "islas baleares" shows "Islas Baleares" as chosen.
  const selected = value ? (options.find((zone) => samePlace(zone, value)) ?? value) : NO_ZONE;

  return (
    <Select value={selected} onValueChange={(next) => onChange(next === NO_ZONE ? "" : next)}>
      <SelectTrigger id={id} className="h-10 w-full px-3.5">
        <SelectValue placeholder={placeholder ?? t("zonePicker.pick")} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={NO_ZONE}>{placeholder ?? t("zonePicker.none")}</SelectItem>
        {options.map((zone) => (
          <SelectItem key={zone} value={zone}>
            {placeLabel(zone)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
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
  const t = useTranslations("portalEditor.blocks");
  const id = useId();
  const patch = (destinationId: string, next: Partial<Destination>) =>
    onChange(
      destinations.map((item) =>
        item.id === destinationId ? { ...item, ...next } : item,
      ),
    );

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-2 text-sm font-medium">{t("destinations.title")}</legend>
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
                aria-label={t("destinations.name", { number: index + 1 })}
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
                placeholder={t("destinations.zone")}
              />
            </div>
            <button
              type="button"
              className={ICON_BUTTON}
              aria-label={t("destinations.remove", { name: destination.name || t("destinations.fallback") })}
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
          {t("destinations.add")}
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
  const t = useTranslations("portalEditor");
  const id = useId();
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field
        label={t("blocks.button.label")}
        htmlFor={`${id}-label`}
        hint={t("blocks.button.hint")}
      >
        <Input
          id={`${id}-label`}
          value={section.buttonLabel ?? ""}
          maxLength={40}
          placeholder={t("blocks.button.placeholder")}
          onChange={(event) => onChange({ buttonLabel: event.target.value })}
          className="h-10 px-3.5"
        />
      </Field>
      <Field label={t("blocks.button.target")} htmlFor={`${id}-target`}>
        <Select
          value={section.buttonTarget ?? "contact"}
          onValueChange={(value) =>
            onChange({ buttonTarget: value as SiteSection["buttonTarget"] })
          }
        >
          <SelectTrigger id={`${id}-target`} className="h-10 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {BUTTON_TARGETS.map((target) => (
              <SelectItem key={target} value={target}>
                {t(`buttonTargets.${target}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    </div>
  );
}

type EditorTranslator = ReturnType<typeof useTranslations<"portalEditor">>;

/** "Banner", "Carrusel"…: a layout's name in its block type. */
function layoutName(t: EditorTranslator, type: SiteSection["type"], layout: SectionLayout) {
  return t(`sections.${type}.layouts.${layout}` as never);
}

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
  const t = useTranslations("portalEditor");
  const id = useId();
  const type = SECTION_TYPES.find((option) => option.value === section.type);
  const layout = sectionLayout(section);
  const placeholders = {
    title: t(`placeholders.${section.type}.title`),
    text: section.type === "destinations" ? "" : t(`placeholders.${section.type}.text`),
  };
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
        <Field label={t("blocks.layout")}>
          <Pills
            label={t("blocks.layoutLabel")}
            value={layout}
            options={type.layouts.map((value) => ({ value, label: layoutName(t, type.value, value) }))}
            onChange={(next) => onChange({ layout: next })}
          />
        </Field>
      )}

      <Field label={t("blocks.title")} htmlFor={`${id}-title`}>
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
          label={t("blocks.zone")}
          htmlFor={`${id}-zone`}
          hint={t("blocks.zoneHint")}
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
          <Field label={t("blocks.badge")} htmlFor={`${id}-badge`}>
            <Input
              id={`${id}-badge`}
              value={section.badge ?? ""}
              maxLength={40}
              placeholder="15% OFF"
              onChange={(event) => onChange({ badge: event.target.value })}
              className="h-10 px-3.5"
            />
          </Field>
          <Field label={t("blocks.endsAt")} htmlFor={`${id}-ends`}>
            <DatePicker
              id={`${id}-ends`}
              size="sm"
              value={section.endsAt ?? ""}
              onChange={(endsAt) => onChange({ endsAt: endsAt || null })}
              placeholder={t("blocks.noDate")}
            />
          </Field>
        </div>
      )}

      <Field label={t("blocks.text")} htmlFor={`${id}-text`}>
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
          label={section.type === "location" ? t("blocks.zonePhoto") : t("blocks.image")}
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
          <Field label={t("blocks.listings")}>
            <Pills
              label={t("blocks.listingsLabel")}
              value={pickListings ? "pick" : "zone"}
              options={[
                { value: "zone", label: t("blocks.fromZone") },
                { value: "pick", label: t("blocks.pick") },
              ]}
              onChange={(mode) => {
                setPickListings(mode === "pick");
                if (mode === "zone") onChange({ propertyIds: [] });
              }}
            />
          </Field>
          {pickListings && (
            <PropertyPicker
              label={t("blocks.picked")}
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
            section.type === "promo" ? t("blocks.included") : t("blocks.properties")
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
function blockName(section: SiteSection, untitled: string) {
  return (
    section.title?.trim() ||
    (section.type === "location" ? section.zone?.trim() : null) ||
    (section.type === "destinations"
      ? (section.destinations ?? [])
          .map((d) => d.name)
          .filter(Boolean)
          .join(", ")
      : null) ||
    untitled
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
  const t = useTranslations("portalEditor");
  const [open, setOpen] = useState<string | null>(null);
  const [adding, setAdding] = useState(sections.length === 0);
  const zones = uniquePlaces(properties.flatMap((p) => [p.area, p.region, p.country]));

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
            const layoutLabel = type ? layoutName(t, type.value, sectionLayout(section)) : null;
            const expanded = open === section.id;
            const hidden = section.visible === false;
            const name = blockName(section, t("blocks.untitled"));
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
                        {type && t(`sections.${type.value}.label`)}
                        {layoutLabel &&
                          type &&
                          type.layouts.length > 1 &&
                          ` · ${layoutLabel}`}
                        {hidden && ` · ${t("blocks.hidden")}`}
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
                    aria-label={hidden ? t("blocks.showNamed", { name }) : t("blocks.hideNamed", { name })}
                    title={hidden ? t("blocks.show") : t("blocks.hide")}
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
                    aria-label={t("blocks.moveUp", { name })}
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                  >
                    <ArrowUp className="size-4" />
                  </button>
                  <button
                    type="button"
                    className={ICON_BUTTON}
                    aria-label={t("blocks.moveDown", { name })}
                    disabled={index === sections.length - 1}
                    onClick={() => move(index, 1)}
                  >
                    <ArrowDown className="size-4" />
                  </button>
                  <button
                    type="button"
                    className={cn(ICON_BUTTON, "hover:text-destructive")}
                    aria-label={t("blocks.delete", { name })}
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
          {t("blocks.max", { max: MAX_SECTIONS })}
        </p>
      ) : adding ? (
        <div className="flex flex-col gap-2 rounded-xl border border-dashed border-border p-2">
          <div className="flex items-center justify-between px-2 pt-1">
            <p className="text-sm font-medium">{t("blocks.addTitle")}</p>
            {sections.length > 0 && (
              <button
                type="button"
                className={ICON_BUTTON}
                aria-label={t("blocks.close")}
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
                    <span className="text-sm font-medium">{t(`sections.${type.value}.label`)}</span>
                    <span className="text-xs text-pretty text-muted-foreground">
                      {t(`sections.${type.value}.description`)}
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
          {t("blocks.add")}
        </button>
      )}
    </div>
  );
}
