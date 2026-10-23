"use client";

import { useTranslations } from "next-intl";
import { Controller, type UseFormReturn } from "react-hook-form";

import { ChipPicker, Stepper, TagsInput } from "@/components/properties/form-controls";
import { FormSection as Section } from "@/components/properties/form-section";
import type { FormValues } from "@/components/properties/property-editor";
import { PoolsTab } from "@/components/properties/pools-tab";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { Property } from "@/lib/api/properties";
import { useLabels } from "@/lib/labels";
import {
  INDOOR_AMENITIES,
  OUTDOOR_AMENITIES,
  PROPERTY_STATUS_RENT,
  PROPERTY_STATUS_SALE,
} from "@/lib/property-catalogs";

const BEDROOM_TYPES = [
  "masterBedroomQty",
  "doubleBedroomQty",
  "twinBedroomQty",
  "singleBedroomQty",
  "bedroomWithBunkBedsQty",
  "guestBedroomQty",
] as const;

const LAYOUT_ROWS = [
  ["layoutKitchensCount", "layoutKitchensDescription"],
  ["layoutLivingRoomsCount", "layoutLivingRoomsDescription"],
  ["layoutGuestWCCount", "layoutGuestWCDescription"],
  ["layoutStaffQuartersCount", "layoutStaffQuartersDescription"],
] as const;

export function AmenitiesTab({
  form,
  property,
  isRent,
}: {
  form: UseFormReturn<FormValues>;
  property: Property;
  isRent: boolean;
}) {
  const t = useTranslations("properties.amenities");
  const labels = useLabels();
  const conditionOptions = isRent ? PROPERTY_STATUS_RENT : PROPERTY_STATUS_SALE;

  return (
    <div className="flex max-w-3xl flex-col gap-12">
      <Section
        title={t("general.title")}
        description={t("general.description")}
        shown
      >
        <Field>
          <FieldLabel htmlFor="amenitiesText">{t("general.label")}</FieldLabel>
          <Controller
            control={form.control}
            name="amenitiesText"
            render={({ field }) => (
              <TagsInput
                id="amenitiesText"
                label={t("general.label")}
                value={field.value}
                onChange={field.onChange}
                placeholder={t("general.placeholder")}
              />
            )}
          />
        </Field>
      </Section>

      <Section
        title={t("outdoor.title")}
        description={t("outdoor.description")}
        shown
      >
        <Controller
          control={form.control}
          name="outdoorAmenities"
          render={({ field }) => (
            <ChipPicker
              label={t("outdoor.title")}
              options={OUTDOOR_AMENITIES}
              labelOf={labels.outdoorAmenity}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </Section>

      <Section
        title={t("indoor.title")}
        description={t("indoor.description")}
        shown
      >
        <FieldGroup>
          <Controller
            control={form.control}
            name="indoorAmenities"
            render={({ field }) => (
              <ChipPicker
                label={t("indoor.title")}
                options={INDOOR_AMENITIES}
                labelOf={labels.indoorAmenity}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          {isRent && (
            <Field>
              <FieldLabel htmlFor="customFacilitiesText">{t("indoor.other")}</FieldLabel>
              <Controller
                control={form.control}
                name="customFacilitiesText"
                render={({ field }) => (
                  <TagsInput
                    id="customFacilitiesText"
                    label={t("indoor.other")}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t("indoor.otherPlaceholder")}
                  />
                )}
              />
            </Field>
          )}
        </FieldGroup>
      </Section>

      <Section
        title={isRent ? t("conditions.rentTitle") : t("conditions.saleTitle")}
        description={isRent ? t("conditions.rentDescription") : t("conditions.saleDescription")}
        shown
      >
        <Controller
          control={form.control}
          name="propertyStatus"
          render={({ field }) => (
            <ChipPicker
              label={isRent ? t("conditions.rentTitle") : t("conditions.saleTitle")}
              options={conditionOptions}
              labelOf={labels.propertyCondition}
              value={field.value}
              onChange={field.onChange}
              limit={20}
            />
          )}
        />
      </Section>

      {isRent ? (
        <Section title={t("bedrooms.title")} description={t("bedrooms.description")} shown>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {BEDROOM_TYPES.map((name) => (
              <Field key={name}>
                <FieldLabel htmlFor={name}>{t(`bedrooms.${name}`)}</FieldLabel>
                <Controller
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <Stepper id={name} label={t(`bedrooms.${name}`)} value={field.value} onChange={field.onChange} />
                  )}
                />
              </Field>
            ))}
          </div>
        </Section>
      ) : (
        <Section title={t("layout.title")} description={t("layout.description")} shown>
          <div className="flex flex-col gap-4">
            {LAYOUT_ROWS.map(([countField, descField]) => {
              const label = t(`layout.${countField}`);
              return (
              <div key={countField} className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,15rem)_1fr] sm:items-end">
                <Field>
                  <FieldLabel htmlFor={countField}>{label}</FieldLabel>
                  <Controller
                    control={form.control}
                    name={countField}
                    render={({ field }) => (
                      <Stepper id={countField} label={label} value={field.value} onChange={field.onChange} />
                    )}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor={descField} className="sr-only">
                    {t("layout.detailOf", { label })}
                  </FieldLabel>
                  <Input id={descField} placeholder={t("layout.detailPlaceholder")} {...form.register(descField)} />
                </Field>
              </div>
              );
            })}
            {(
              [
                ["layoutGardenAvailable", "layoutGardenDescription", t("layout.garden")],
                ["layoutStorageAvailable", "layoutStorageDescription", t("layout.storage")],
              ] as const
            ).map(([switchField, descField, label]) => (
              <div
                key={switchField}
                className="flex flex-col gap-3 rounded-2xl bg-foreground/[0.04] p-4 sm:flex-row sm:items-center"
              >
                <div className="flex items-center gap-3 sm:w-60">
                  <Controller
                    control={form.control}
                    name={switchField}
                    render={({ field }) => (
                      <Switch id={switchField} checked={field.value} onCheckedChange={field.onChange} />
                    )}
                  />
                  <label htmlFor={switchField} className="text-sm font-medium">
                    {label}
                  </label>
                </div>
                <Input
                  id={descField}
                  aria-label={t("layout.detailOf", { label })}
                  placeholder={t("layout.detailPlaceholder")}
                  className="flex-1"
                  {...form.register(descField)}
                />
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section title={t("more.title")} description={t("more.description")} shown>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="enjoy">{t("more.enjoy")}</FieldLabel>
            <Textarea id="enjoy" rows={4} {...form.register("enjoy")} />
            <FieldDescription>{t("more.enjoyHint")}</FieldDescription>
          </Field>
          {!isRent && (
            <Field className="max-w-60">
              <FieldLabel htmlFor="outdoorShower">{t("more.outdoorShower")}</FieldLabel>
              <Controller
                control={form.control}
                name="outdoorShower"
                render={({ field }) => (
                  <Stepper id="outdoorShower" label={t("more.outdoorShower")} value={field.value} onChange={field.onChange} />
                )}
              />
            </Field>
          )}
        </FieldGroup>
      </Section>

      {!isRent && (
        <Section title={t("pools.title")} description={t("pools.description")}>
          <PoolsTab propertyId={property.id} />
        </Section>
      )}
    </div>
  );
}
