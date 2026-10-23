"use client";

import { Building2, ChevronDown, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Controller, useFieldArray, useWatch, type Control } from "react-hook-form";

import { fitsOperation } from "@/components/offers/offer-operation";
import { PropertyPicker } from "@/components/properties/property-picker";
import { RichTextEditor } from "@/components/rich-text/rich-text-editor";
import { UnitInput } from "@/components/properties/form-controls";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DiscountType, OfferOperation } from "@/lib/api/offers";
import type { Property } from "@/lib/api/properties";
import type { ServiceType, ServiceUnit } from "@/lib/api/services";
import { useFormat } from "@/i18n/format";
import { useLabels } from "@/lib/labels";
import { DISCOUNT_TYPES } from "@/lib/properties-labels";
import { cn } from "@/lib/utils";
import { IMAGE_WIDTH, sizedImage } from "@/lib/image-url";

/** A service in the offer form; numbers stay as typed text until saving. */
export interface OfferServiceFormValue {
  /** "" when it didn't come from the library (or it was deleted). */
  serviceId: string;
  name: string;
  type: ServiceType;
  description: string;
  imageUrl: string;
  unit: ServiceUnit;
  /** "" = a consultar. */
  unitPrice: string;
  quantity: string;
  /** yyyy-MM-dd or "". */
  date: string;
  note: string;
}

/** The shape of the offer form that these pieces read and write. */
export interface OfferFormValues {
  title: string;
  /** The agency's own tracking code, free text and optional. */
  referenceCode: string;
  operation: OfferOperation;
  currency: string;
  showPrice: boolean;
  branded: boolean;
  welcomeTitle: string;
  welcomeDateLabel: string;
  welcomeContent: string;
  /** "" = no client. */
  clientId: string;
  services: OfferServiceFormValue[];
  sections: {
    title: string;
    text: string;
    properties: {
      propertyId: string;
      priceOverride: string;
      discountType: DiscountType;
      discountValue: string;
      securityDeposit: string;
      bottomText: string;
    }[];
  }[];
}

export function emptyOfferProperty() {
  return {
    propertyId: "",
    priceOverride: "",
    discountType: "NONE" as const,
    discountValue: "0",
    securityDeposit: "",
    bottomText: "",
  };
}

function toNumber(value: string | undefined) {
  if (!value || value.trim() === "") return null;
  const parsed = Number(value.replace(",", "."));
  return Number.isNaN(parsed) ? null : parsed;
}

/** Price of one offer line: the override when set, otherwise the property's own price, minus any discount. */
export function linePrice(
  item: OfferFormValues["sections"][number]["properties"][number] | undefined,
  property: Property | undefined,
) {
  if (!item) return { base: null as number | null, final: null as number | null };
  const base = toNumber(item.priceOverride) ?? property?.price ?? null;
  if (base == null) return { base: null, final: null };
  const value = toNumber(item.discountValue) ?? 0;
  const final =
    item.discountType === "PERCENT"
      ? base * (1 - value / 100)
      : item.discountType === "FIXED"
        ? base - value
        : base;
  return { base, final: Math.max(0, final) };
}

function coverOf(property: Property | undefined) {
  if (!property) return null;
  const photos = [...property.photos].sort((a, b) => a.position - b.position);
  return (photos.find((photo) => photo.isCover) ?? photos[0])?.url ?? null;
}

function Thumb({ property, className }: { property: Property | undefined; className?: string }) {
  const url = coverOf(property);
  return (
    <span className={cn("flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary text-primary/40", className)}>
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={sizedImage(url, IMAGE_WIDTH.thumb)} alt="" className="size-full object-cover" />
      ) : (
        <Building2 className="size-1/2" strokeWidth={1.5} />
      )}
    </span>
  );
}

function OfferLine({
  control,
  sectionIndex,
  index,
  properties,
  currency,
  onRemove,
}: {
  control: Control<OfferFormValues>;
  sectionIndex: number;
  index: number;
  properties: Property[];
  currency: string;
  onRemove: () => void;
}) {
  const t = useTranslations("offers.items");
  const labels = useLabels();
  const { number } = useFormat();
  const money = (value: number) => number(value, { maximumFractionDigits: 0 });
  const name = `sections.${sectionIndex}.properties.${index}` as const;
  const item = useWatch({ control, name });
  const property = properties.find((entry) => entry.id === item?.propertyId);
  const operation = useWatch({ control, name: "operation" }) ?? "BOTH";
  const misfit = property && !fitsOperation(operation, property.listingType);
  const { base, final } = linePrice(item, property);
  const adjusted = item && (item.discountType !== "NONE" || toNumber(item.priceOverride) != null);
  // Lines that already carry adjustments, or are still empty, start expanded.
  const [open, setOpen] = useState(() => !item?.propertyId || Boolean(adjusted));

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-card p-4 ring-1 ring-foreground/5">
      <div className="flex flex-wrap items-center gap-3">
        <Thumb property={property} className="size-12" />
        <div className="min-w-0 flex-1 basis-56">
          <Controller
            control={control}
            name={`${name}.propertyId`}
            render={({ field }) => (
              <PropertyPicker
                properties={properties}
                operation={operation}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        <div className="flex items-center gap-3">
          {final != null ? (
            <div className="flex flex-col items-end leading-tight tabular-nums">
              {adjusted && base != null && final !== base && (
                <span className="text-xs text-muted-foreground line-through">
                  {currency} {money(base)}
                </span>
              )}
              <span className="font-semibold">
                <span className="mr-1 text-xs font-medium text-muted-foreground">{currency}</span>
                {money(final)}
              </span>
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">{property ? t("noPrice") : ""}</span>
          )}
          <button
            type="button"
            aria-expanded={open}
            aria-label={open ? t("hideAdjustments") : t("showAdjustments")}
            onClick={() => setOpen((value) => !value)}
            className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors outline-none hover:bg-foreground/5 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <ChevronDown className={cn("size-4 transition-transform duration-300", open && "rotate-180")} />
          </button>
          <button
            type="button"
            aria-label={t("removeProperty")}
            onClick={onRemove}
            className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors outline-none hover:bg-destructive/10 hover:text-destructive focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>

      {misfit && (
        <p className="text-sm text-destructive">
          {t("misfit", {
            listing: labels.listingType(property.listingType).toLowerCase(),
            offer: labels.listingType(operation === "SALE" ? "SALE" : "RENT").toLowerCase(),
          })}
        </p>
      )}

      {open && (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-1 duration-300">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel>{t("price")}</FieldLabel>
              <Controller
                control={control}
                name={`${name}.priceOverride`}
                render={({ field }) => (
                  <UnitInput
                    unit={currency}
                    placeholder={property?.price ? money(property.price) : t("pricePlaceholder")}
                    {...field}
                  />
                )}
              />
            </Field>
            <Field>
              <FieldLabel>{t("deposit")}</FieldLabel>
              <Controller
                control={control}
                name={`${name}.securityDeposit`}
                render={({ field }) => <UnitInput unit={currency} placeholder={t("optional")} {...field} />}
              />
            </Field>
            <Field>
              <FieldLabel>{t("discount")}</FieldLabel>
              <Controller
                control={control}
                name={`${name}.discountType`}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DISCOUNT_TYPES.map((value) => (
                        <SelectItem key={value} value={value}>
                          {labels.discountType(value)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
            {item?.discountType !== "NONE" && (
              <Field>
                <FieldLabel>{t("discountValue")}</FieldLabel>
                <Controller
                  control={control}
                  name={`${name}.discountValue`}
                  render={({ field }) => (
                    <UnitInput unit={item?.discountType === "PERCENT" ? "%" : currency} {...field} />
                  )}
                />
              </Field>
            )}
          </div>
          <Field>
            <FieldLabel>{t("shortText")}</FieldLabel>
            <Controller
              control={control}
              name={`${name}.bottomText`}
              render={({ field }) => <Input placeholder={t("shortTextPlaceholder")} {...field} />}
            />
          </Field>
        </div>
      )}
    </div>
  );
}

/** One group of properties in the offer, with its own title and text. */
export function OfferSectionBlock({
  control,
  sectionIndex,
  properties,
  currency,
  onRemoveSection,
}: {
  control: Control<OfferFormValues>;
  sectionIndex: number;
  properties: Property[];
  currency: string;
  onRemoveSection: () => void;
}) {
  const t = useTranslations("offers.items");
  const { fields, append, remove } = useFieldArray({
    control,
    name: `sections.${sectionIndex}.properties`,
  });

  return (
    <div className="flex flex-col gap-5 rounded-3xl bg-foreground/[0.03] p-5">
      <div className="flex items-start gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <Controller
            control={control}
            name={`sections.${sectionIndex}.title`}
            render={({ field }) => (
              <Input
                aria-label={t("sectionTitle")}
                placeholder={t("sectionTitlePlaceholder")}
                className="h-11 bg-card text-base font-medium"
                {...field}
              />
            )}
          />
          <Controller
            control={control}
            name={`sections.${sectionIndex}.text`}
            render={({ field }) => (
              <RichTextEditor
                variant="inline"
                ariaLabel={t("sectionText")}
                placeholder={t("sectionTextPlaceholder")}
                value={field.value}
                onChange={field.onChange}
                className="bg-card"
              />
            )}
          />
        </div>
        <button
          type="button"
          aria-label={t("deleteSection")}
          title={t("deleteSection")}
          onClick={onRemoveSection}
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors outline-none hover:bg-destructive/10 hover:text-destructive focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Trash2 className="size-4" />
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {fields.map((field, index) => (
          <OfferLine
            key={field.id}
            control={control}
            sectionIndex={sectionIndex}
            index={index}
            properties={properties}
            currency={currency}
            onRemove={() => remove(index)}
          />
        ))}
        <div>
          <Button type="button" variant="outline" className="h-10 gap-2 px-5" onClick={() => append(emptyOfferProperty())}>
            <Plus />
            {t("addProperty")}
          </Button>
        </div>
      </div>
    </div>
  );
}
