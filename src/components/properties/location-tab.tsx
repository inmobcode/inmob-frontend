"use client";

import { LoaderCircle, MapPin, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useWatch, Controller, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { ChipToggleGroup } from "@/components/properties/form-controls";
import type { FormValues } from "@/components/properties/property-editor";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { formatCoordinate, geocode, parseGoogleMapsCoords } from "@/lib/geo";
import { useLabels } from "@/lib/labels";
import { LOCATION_FEATURES, VIEW_OPTIONS } from "@/lib/property-catalogs";

const LocationMap = dynamic(() => import("@/components/properties/location-map"), {
  ssr: false,
  loading: () => <div className="size-full animate-pulse bg-secondary" />,
});

function toNumber(value: string | undefined) {
  if (!value || value.trim() === "") return null;
  const parsed = Number(value.replace(",", "."));
  return Number.isNaN(parsed) ? null : parsed;
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h3 className="font-display text-xl leading-tight">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}

export function LocationTab({ form }: { form: UseFormReturn<FormValues> }) {
  const t = useTranslations("properties.location");
  const labels = useLabels();
  const values = useWatch({ control: form.control });
  const [searching, setSearching] = useState(false);
  const [linkNote, setLinkNote] = useState<string | null>(null);

  const lat = toNumber(values.lat);
  const lng = toNumber(values.lng);
  const addressQuery = [values.address, values.area, values.region, values.country]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(", ");

  function setCoordinates(latitude: number, longitude: number) {
    form.setValue("lat", formatCoordinate(latitude), { shouldDirty: true });
    form.setValue("lng", formatCoordinate(longitude), { shouldDirty: true });
  }

  async function findOnMap() {
    setSearching(true);
    try {
      const found = await geocode(addressQuery);
      if (!found) {
        toast.error(t("notFound"));
        return;
      }
      setCoordinates(found.lat, found.lng);
      toast.success(t("found"));
    } catch {
      toast.error(t("searchFailed"));
    } finally {
      setSearching(false);
    }
  }

  function handleMapsLink(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed) return setLinkNote(null);
    const found = parseGoogleMapsCoords(trimmed);
    if (found) {
      setCoordinates(found.lat, found.lng);
      setLinkNote(t("linkTaken"));
    } else if (/goo\\.gl|maps\\.app/.test(trimmed)) {
      setLinkNote(t("linkShort"));
    } else {
      setLinkNote(null);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
      <div className="flex max-w-2xl min-w-0 flex-col gap-10">
        <Section title={t("shown.title")} description={t("shown.description")}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="visibleLocation">{t("shown.label")}</FieldLabel>
              <Input id="visibleLocation" {...form.register("visibleLocation")} />
              <FieldDescription>
                {t("shown.hint")}
              </FieldDescription>
            </Field>
            <div className="inline-flex w-fit max-w-full items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm">
              <MapPin className="size-4 shrink-0 text-primary" />
              <span className="truncate">
                {values.visibleLocation?.trim() || (
                  <span className="text-muted-foreground">{t("shown.empty")}</span>
                )}
              </span>
            </div>
          </FieldGroup>
        </Section>

        <Section title={t("where.title")} description={t("where.description")}>
          <FieldGroup>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="country">{t("where.country")}</FieldLabel>
                <Input id="country" {...form.register("country")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="region">{t("where.region")}</FieldLabel>
                <Input id="region" {...form.register("region")} />
              </Field>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="area">{t("where.area")}</FieldLabel>
                <Input id="area" {...form.register("area")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="address">{t("where.address")}</FieldLabel>
                <Input id="address" {...form.register("address")} />
              </Field>
            </div>
            <div>
              <Button
                type="button"
                variant="outline"
                className="h-10 gap-2 px-5"
                onClick={findOnMap}
                disabled={searching || addressQuery === ""}
              >
                {searching ? <LoaderCircle className="animate-spin" /> : <Search />}
                {t("where.search")}
              </Button>
            </div>
            <Field>
              <FieldLabel htmlFor="googleMapUrl">{t("where.mapsLink")}</FieldLabel>
              <Input
                id="googleMapUrl"
                placeholder={t("where.mapsPlaceholder")}
                {...form.register("googleMapUrl", { onChange: (event) => handleMapsLink(event.target.value) })}
              />
              <FieldDescription>
                {linkNote ?? t("where.mapsHint")}
              </FieldDescription>
            </Field>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="lat">{t("where.lat")}</FieldLabel>
                <Input id="lat" inputMode="decimal" placeholder="-34.9011" {...form.register("lat")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="lng">{t("where.lng")}</FieldLabel>
                <Input id="lng" inputMode="decimal" placeholder="-56.1645" {...form.register("lng")} />
              </Field>
            </div>
          </FieldGroup>
        </Section>

        <Section title={t("surroundings.title")} description={t("surroundings.description")}>
          <FieldGroup>
            <Field>
              <FieldLabel>{t("surroundings.features")}</FieldLabel>
              <Controller
                control={form.control}
                name="locationFeatures"
                render={({ field }) => (
                  <ChipToggleGroup
                    label={t("surroundings.features")}
                    options={LOCATION_FEATURES}
                    labelOf={labels.locationFeature}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </Field>
            <Field>
              <FieldLabel>{t("surroundings.views")}</FieldLabel>
              <Controller
                control={form.control}
                name="view"
                render={({ field }) => (
                  <ChipToggleGroup
                    label={t("surroundings.views")}
                    options={VIEW_OPTIONS}
                    labelOf={labels.view}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </Field>
          </FieldGroup>
        </Section>

        <Section title={t("links.title")} description={t("links.description")}>
          <FieldGroup>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="brochureUrl">{t("links.brochure")}</FieldLabel>
                <Input id="brochureUrl" placeholder="https://" {...form.register("brochureUrl")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="websiteUrl">{t("links.website")}</FieldLabel>
                <Input id="websiteUrl" placeholder="https://" {...form.register("websiteUrl")} />
              </Field>
            </div>
          </FieldGroup>
        </Section>
      </div>

      <aside className="order-first lg:order-none">
        <div className="sticky top-28 flex flex-col gap-3">
          <p className="text-sm font-medium text-muted-foreground">{t("map.title")}</p>
          <div className="h-72 overflow-hidden rounded-2xl bg-secondary ring-1 ring-foreground/5 lg:h-[420px]">
            <LocationMap
              lat={lat}
              lng={lng}
              onChange={(latitude, longitude) => setCoordinates(latitude, longitude)}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {lat != null && lng != null
              ? t("map.hintPinned")
              : t("map.hintEmpty")}
          </p>
        </div>
      </aside>
    </div>
  );
}
