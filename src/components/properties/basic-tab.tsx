"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Controller, useWatch, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { CategoryChips } from "@/components/properties/category-chips";
import { Stepper, TagsInput, UnitInput } from "@/components/properties/form-controls";
import { ListingTypeCards } from "@/components/properties/listing-type-cards";
import type { FormValues } from "@/components/properties/property-editor";
import { PropertyCard } from "@/components/properties/property-card";
import { AssigneeSelect } from "@/components/shared/assignee-select";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApiError } from "@/lib/api/client";
import { updateProperty, type Property } from "@/lib/api/properties";
import { getAccessToken, useSessionUser } from "@/lib/auth/session";
import { useLabels } from "@/lib/labels";
import {
  ACCOMMODATION_TYPES,
  ENERGY_CERTIFICATE_OPTIONS,
  LOCATION_CATEGORY_OPTIONS,
  REAL_ESTATE_TYPES,
} from "@/lib/property-catalogs";

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

/** Who looks after the property. Saved on its own, apart from the form; only owners and admins can change it. */
function ResponsibleField({ property }: { property: Property }) {
  const t = useTranslations("properties.basic");
  const user = useSessionUser();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (assignedAgentId: string | null) => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return updateProperty(token, property.id, { assignedAgentId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["property", property.id] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast.success(t("responsibleUpdated"));
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : t("responsibleFailed")),
  });

  if (!user || user.role === "AGENT") return null;
  return (
    <Field>
      <FieldLabel>{t("responsible")}</FieldLabel>
      <AssigneeSelect
        value={property.assignedAgentId}
        disabled={mutation.isPending}
        onChange={(userId) => mutation.mutate(userId)}
      />
      <FieldDescription>
        {t("responsibleHint")}
      </FieldDescription>
    </Field>
  );
}

export function BasicTab({
  form,
  property,
}: {
  form: UseFormReturn<FormValues>;
  property: Property;
}) {
  const t = useTranslations("properties.basic");
  const labels = useLabels();
  const values = useWatch({ control: form.control });
  const listingType = values.listingType ?? property.listingType;
  const isRent = listingType === "RENT";
  const categoryOptions = isRent ? ACCOMMODATION_TYPES : REAL_ESTATE_TYPES;

  // What the card in /properties would look like with the values typed so far.
  const preview: Property = {
    ...property,
    title: values.title?.trim() || t("untitled"),
    listingType,
    category: values.category ?? property.category,
    bedrooms: toNumber(values.bedrooms),
    bathrooms: toNumber(values.bathrooms),
    areaSqm: toNumber(values.areaSqm),
    plotArea: toNumber(values.plotArea),
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12">
      <div className="flex max-w-2xl min-w-0 flex-col gap-10">
        <Section title={t("identity.title")} description={t("identity.description")}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="title">{t("identity.titleLabel")}</FieldLabel>
              <Input id="title" className="h-12 text-base" {...form.register("title")} />
              <FieldError errors={[form.formState.errors.title]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="agentFriendlyName">{t("identity.privateName")}</FieldLabel>
              <Input id="agentFriendlyName" {...form.register("agentFriendlyName")} />
              <FieldDescription>
                {t("identity.privateNameHint")}
              </FieldDescription>
            </Field>
            <ResponsibleField property={property} />
            <Field>
              <FieldLabel>{t("identity.operation")}</FieldLabel>
              <Controller
                control={form.control}
                name="listingType"
                render={({ field }) => (
                  <ListingTypeCards
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      const next = value === "RENT" ? ACCOMMODATION_TYPES : REAL_ESTATE_TYPES;
                      if (!next.includes(form.getValues("category"))) {
                        form.setValue("category", next[0], { shouldDirty: true });
                      }
                    }}
                  />
                )}
              />
              <FieldDescription>
                {t("identity.operationHint")}
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel>{t("identity.category")}</FieldLabel>
              <Controller
                control={form.control}
                name="category"
                render={({ field }) => (
                  <CategoryChips
                    key={listingType}
                    options={categoryOptions}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </Field>
          </FieldGroup>
        </Section>

        <Section title={t("features.title")} description={t("features.description")}>
          <FieldGroup>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="bedrooms">{t("features.bedrooms")}</FieldLabel>
                <Controller
                  control={form.control}
                  name="bedrooms"
                  render={({ field }) => (
                    <Stepper id="bedrooms" label={t("features.bedrooms")} value={field.value} onChange={field.onChange} />
                  )}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="bathrooms">{t("features.bathrooms")}</FieldLabel>
                <Controller
                  control={form.control}
                  name="bathrooms"
                  render={({ field }) => (
                    <Stepper id="bathrooms" label={t("features.bathrooms")} value={field.value} onChange={field.onChange} />
                  )}
                />
              </Field>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="areaSqm">{t("features.areaSqm")}</FieldLabel>
                <UnitInput id="areaSqm" unit="m²" {...form.register("areaSqm")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="plotArea">{t("features.plotArea")}</FieldLabel>
                <UnitInput id="plotArea" unit="m²" {...form.register("plotArea")} />
              </Field>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="parkingSpaces">{t("features.parking")}</FieldLabel>
                <Controller
                  control={form.control}
                  name="parkingSpaces"
                  render={({ field }) => (
                    <Stepper id="parkingSpaces" label={t("features.parking")} value={field.value} onChange={field.onChange} />
                  )}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="storageSpaces">{t("features.storage")}</FieldLabel>
                <Controller
                  control={form.control}
                  name="storageSpaces"
                  render={({ field }) => (
                    <Stepper id="storageSpaces" label={t("features.storage")} value={field.value} onChange={field.onChange} />
                  )}
                />
              </Field>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="staffRoom">{t("features.staffRoom")}</FieldLabel>
                <Controller
                  control={form.control}
                  name="staffRoom"
                  render={({ field }) => (
                    <Stepper
                      id="staffRoom"
                      label={t("features.staffRoom")}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="floorNumbersText">{t("features.floors")}</FieldLabel>
                <Controller
                  control={form.control}
                  name="floorNumbersText"
                  render={({ field }) => (
                    <TagsInput
                      id="floorNumbersText"
                      label={t("features.floors")}
                      value={field.value}
                      onChange={field.onChange}
                      validate={(tag) => /^-?\d+$/.test(tag)}
                      placeholder={t("features.floorsPlaceholder")}
                    />
                  )}
                />
                <FieldDescription>{t("features.floorsHint")}</FieldDescription>
              </Field>
            </div>
          </FieldGroup>
        </Section>

        <Section
          title={isRent ? t("rent.title") : t("sale.title")}
          description={isRent ? t("rent.description") : t("sale.description")}
        >
          <FieldGroup>
            {isRent ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="guests">{t("rent.guests")}</FieldLabel>
                  <Input id="guests" placeholder={t("example", { value: 8 })} {...form.register("guests")} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="stars">{t("rent.stars")}</FieldLabel>
                  <Controller
                    control={form.control}
                    name="stars"
                    render={({ field }) => (
                      <Stepper id="stars" label={t("rent.stars")} max={5} value={field.value} onChange={field.onChange} />
                    )}
                  />
                </Field>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="constructionYear">{t("sale.constructionYear")}</FieldLabel>
                    <Input
                      id="constructionYear"
                      inputMode="numeric"
                      maxLength={4}
                      placeholder={t("example", { value: "2018" })}
                      {...form.register("constructionYear")}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="renovationYear">{t("sale.renovationYear")}</FieldLabel>
                    <Input
                      id="renovationYear"
                      inputMode="numeric"
                      maxLength={4}
                      placeholder={t("example", { value: "2024" })}
                      {...form.register("renovationYear")}
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="energyCertificate">{t("sale.energyCertificate")}</FieldLabel>
                    <Controller
                      control={form.control}
                      name="energyCertificate"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger id="energyCertificate" className="w-full">
                            <SelectValue placeholder={t("unspecified")} />
                          </SelectTrigger>
                          <SelectContent>
                            {ENERGY_CERTIFICATE_OPTIONS.map((value) => (
                              <SelectItem key={value} value={value}>
                                {labels.energyCertificate(value)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="locationCategory">{t("sale.locationCategory")}</FieldLabel>
                    <Controller
                      control={form.control}
                      name="locationCategory"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger id="locationCategory" className="w-full">
                            <SelectValue placeholder={t("unspecified")} />
                          </SelectTrigger>
                          <SelectContent>
                            {LOCATION_CATEGORY_OPTIONS.map((value) => (
                              <SelectItem key={value} value={value}>
                                {labels.locationCategory(value)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </Field>
                </div>
              </>
            )}
          </FieldGroup>
        </Section>
      </div>

      <aside className="hidden lg:block">
        <div className="sticky top-28 flex flex-col gap-3">
          <p className="text-sm font-medium text-muted-foreground">{t("preview")}</p>
          <PropertyCard property={preview} preview />
        </div>
      </aside>
    </div>
  );
}
