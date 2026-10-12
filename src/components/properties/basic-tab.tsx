"use client";

import { Controller, useWatch, type UseFormReturn } from "react-hook-form";

import { CategoryChips } from "@/components/properties/category-chips";
import { Stepper, TagsInput, UnitInput } from "@/components/properties/form-controls";
import { ListingTypeCards } from "@/components/properties/listing-type-cards";
import type { FormValues } from "@/components/properties/property-editor";
import { PropertyCard } from "@/components/properties/property-card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Property } from "@/lib/api/properties";
import { LOCATION_CATEGORY_LABELS } from "@/lib/properties-labels";
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

export function BasicTab({
  form,
  property,
}: {
  form: UseFormReturn<FormValues>;
  property: Property;
}) {
  const values = useWatch({ control: form.control });
  const listingType = values.listingType ?? property.listingType;
  const isRent = listingType === "RENT";
  const categoryOptions = isRent ? ACCOMMODATION_TYPES : REAL_ESTATE_TYPES;

  // What the card in /properties would look like with the values typed so far.
  const preview: Property = {
    ...property,
    title: values.title?.trim() || "Sin título",
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
        <Section title="Identidad" description="Cómo se llama y qué tipo de propiedad es.">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="title">Título</FieldLabel>
              <Input id="title" className="h-12 text-base" {...form.register("title")} />
              <FieldError errors={[form.formState.errors.title]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="agentFriendlyName">Nombre privado</FieldLabel>
              <Input id="agentFriendlyName" {...form.register("agentFriendlyName")} />
              <FieldDescription>
                Solo lo ven vos y tu equipo. Sirve para distinguir propiedades parecidas.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel>Operación</FieldLabel>
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
                Cambiarla muestra u oculta secciones, como las de Alquiler.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel>Categoría</FieldLabel>
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

        <Section title="Características" description="Lo que ven los clientes en la ficha.">
          <FieldGroup>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="bedrooms">Dormitorios</FieldLabel>
                <Controller
                  control={form.control}
                  name="bedrooms"
                  render={({ field }) => (
                    <Stepper id="bedrooms" label="dormitorios" value={field.value} onChange={field.onChange} />
                  )}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="bathrooms">Baños</FieldLabel>
                <Controller
                  control={form.control}
                  name="bathrooms"
                  render={({ field }) => (
                    <Stepper id="bathrooms" label="baños" value={field.value} onChange={field.onChange} />
                  )}
                />
              </Field>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="areaSqm">Superficie cubierta</FieldLabel>
                <UnitInput id="areaSqm" unit="m²" {...form.register("areaSqm")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="plotArea">Superficie del terreno</FieldLabel>
                <UnitInput id="plotArea" unit="m²" {...form.register("plotArea")} />
              </Field>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="parkingSpaces">Cocheras</FieldLabel>
                <Controller
                  control={form.control}
                  name="parkingSpaces"
                  render={({ field }) => (
                    <Stepper id="parkingSpaces" label="cocheras" value={field.value} onChange={field.onChange} />
                  )}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="storageSpaces">Depósitos</FieldLabel>
                <Controller
                  control={form.control}
                  name="storageSpaces"
                  render={({ field }) => (
                    <Stepper id="storageSpaces" label="depósitos" value={field.value} onChange={field.onChange} />
                  )}
                />
              </Field>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="staffRoom">Habitaciones de servicio</FieldLabel>
                <Controller
                  control={form.control}
                  name="staffRoom"
                  render={({ field }) => (
                    <Stepper
                      id="staffRoom"
                      label="habitaciones de servicio"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="floorNumbersText">Pisos</FieldLabel>
                <Controller
                  control={form.control}
                  name="floorNumbersText"
                  render={({ field }) => (
                    <TagsInput
                      id="floorNumbersText"
                      label="Pisos"
                      value={field.value}
                      onChange={field.onChange}
                      validate={(tag) => /^-?\d+$/.test(tag)}
                      placeholder="Escribí un piso y Enter"
                    />
                  )}
                />
                <FieldDescription>Podés cargar varios, como 1, 2 y 3.</FieldDescription>
              </Field>
            </div>
          </FieldGroup>
        </Section>

        <Section
          title={isRent ? "Datos del alquiler" : "Datos de la venta"}
          description={
            isRent
              ? "Capacidad y categoría del alojamiento."
              : "Antigüedad, eficiencia energética y tipo de ubicación."
          }
        >
          <FieldGroup>
            {isRent ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="guests">Huéspedes</FieldLabel>
                  <Input id="guests" placeholder="Ej: 8" {...form.register("guests")} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="stars">Estrellas</FieldLabel>
                  <Controller
                    control={form.control}
                    name="stars"
                    render={({ field }) => (
                      <Stepper id="stars" label="estrellas" max={5} value={field.value} onChange={field.onChange} />
                    )}
                  />
                </Field>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="constructionYear">Año de construcción</FieldLabel>
                    <Input
                      id="constructionYear"
                      inputMode="numeric"
                      maxLength={4}
                      placeholder="Ej: 2018"
                      {...form.register("constructionYear")}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="renovationYear">Año de renovación</FieldLabel>
                    <Input
                      id="renovationYear"
                      inputMode="numeric"
                      maxLength={4}
                      placeholder="Ej: 2024"
                      {...form.register("renovationYear")}
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="energyCertificate">Certificado energético</FieldLabel>
                    <Controller
                      control={form.control}
                      name="energyCertificate"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger id="energyCertificate" className="w-full">
                            <SelectValue placeholder="Sin especificar" />
                          </SelectTrigger>
                          <SelectContent>
                            {ENERGY_CERTIFICATE_OPTIONS.map((value) => (
                              <SelectItem key={value} value={value}>
                                {value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="locationCategory">Tipo de ubicación</FieldLabel>
                    <Controller
                      control={form.control}
                      name="locationCategory"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger id="locationCategory" className="w-full">
                            <SelectValue placeholder="Sin especificar" />
                          </SelectTrigger>
                          <SelectContent>
                            {LOCATION_CATEGORY_OPTIONS.map((value) => (
                              <SelectItem key={value} value={value}>
                                {LOCATION_CATEGORY_LABELS[value] ?? value}
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
          <p className="text-sm font-medium text-muted-foreground">Así se ve en tu cartera</p>
          <PropertyCard property={preview} preview />
        </div>
      </aside>
    </div>
  );
}
