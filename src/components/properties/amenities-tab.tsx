"use client";

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
import {
  INDOOR_AMENITY_LABELS,
  OUTDOOR_AMENITY_LABELS,
  PROPERTY_CONDITION_LABELS,
} from "@/lib/properties-labels";
import {
  INDOOR_AMENITIES,
  OUTDOOR_AMENITIES,
  PROPERTY_STATUS_RENT,
  PROPERTY_STATUS_SALE,
} from "@/lib/property-catalogs";

const BEDROOM_TYPES = [
  ["masterBedroomQty", "Principal"],
  ["doubleBedroomQty", "Doble"],
  ["twinBedroomQty", "Dos camas"],
  ["singleBedroomQty", "Individual"],
  ["bedroomWithBunkBedsQty", "Cuchetas"],
  ["guestBedroomQty", "Para invitados"],
] as const;

const LAYOUT_ROWS = [
  ["layoutKitchensCount", "layoutKitchensDescription", "Cocinas"],
  ["layoutLivingRoomsCount", "layoutLivingRoomsDescription", "Livings"],
  ["layoutGuestWCCount", "layoutGuestWCDescription", "Toilette de huéspedes"],
  ["layoutStaffQuartersCount", "layoutStaffQuartersDescription", "Cuartos de servicio"],
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
  const conditionOptions = isRent ? PROPERTY_STATUS_RENT : PROPERTY_STATUS_SALE;

  return (
    <div className="flex max-w-3xl flex-col gap-12">
      <Section
        title="Amenities generales"
        description="La lista corta que aparece en la ficha pública. Escribí cada una y presioná Enter."
        shown
      >
        <Field>
          <FieldLabel htmlFor="amenitiesText">Amenities</FieldLabel>
          <Controller
            control={form.control}
            name="amenitiesText"
            render={({ field }) => (
              <TagsInput
                id="amenitiesText"
                label="Amenities"
                value={field.value}
                onChange={field.onChange}
                placeholder="Ej: Piscina, Parrilla, Wifi"
              />
            )}
          />
        </Field>
      </Section>

      <Section
        title="Comodidades exteriores"
        description="Lo que hay fuera de la casa: piscina, parrilla, canchas y más."
      >
        <Controller
          control={form.control}
          name="outdoorAmenities"
          render={({ field }) => (
            <ChipPicker
              label="Comodidades exteriores"
              options={OUTDOOR_AMENITIES}
              labels={OUTDOOR_AMENITY_LABELS}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </Section>

      <Section
        title="Comodidades interiores"
        description="Instalaciones y equipamiento dentro de la propiedad."
      >
        <FieldGroup>
          <Controller
            control={form.control}
            name="indoorAmenities"
            render={({ field }) => (
              <ChipPicker
                label="Comodidades interiores"
                options={INDOOR_AMENITIES}
                labels={INDOOR_AMENITY_LABELS}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          {isRent && (
            <Field>
              <FieldLabel htmlFor="customFacilitiesText">Otras facilidades</FieldLabel>
              <Controller
                control={form.control}
                name="customFacilitiesText"
                render={({ field }) => (
                  <TagsInput
                    id="customFacilitiesText"
                    label="Otras facilidades"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Algo que no está en la lista"
                  />
                )}
              />
            </Field>
          )}
        </FieldGroup>
      </Section>

      <Section
        title={isRent ? "Servicios y condiciones" : "Condición"}
        description={
          isRent
            ? "Personal, mascotas, eventos y otras condiciones del alquiler."
            : "Estado comercial y características generales de la propiedad."
        }
      >
        <Controller
          control={form.control}
          name="propertyStatus"
          render={({ field }) => (
            <ChipPicker
              label={isRent ? "Servicios y condiciones" : "Condición"}
              options={conditionOptions}
              labels={PROPERTY_CONDITION_LABELS}
              value={field.value}
              onChange={field.onChange}
              limit={20}
            />
          )}
        />
      </Section>

      {isRent ? (
        <Section title="Dormitorios por tipo" description="Cuántas habitaciones hay de cada clase.">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {BEDROOM_TYPES.map(([name, label]) => (
              <Field key={name}>
                <FieldLabel htmlFor={name}>{label}</FieldLabel>
                <Controller
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <Stepper id={name} label={label} value={field.value} onChange={field.onChange} />
                  )}
                />
              </Field>
            ))}
          </div>
        </Section>
      ) : (
        <Section title="Distribución" description="Ambientes de la propiedad, con un detalle opcional de cada uno.">
          <div className="flex flex-col gap-4">
            {LAYOUT_ROWS.map(([countField, descField, label]) => (
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
                    Detalle de {label.toLowerCase()}
                  </FieldLabel>
                  <Input id={descField} placeholder="Detalle (opcional)" {...form.register(descField)} />
                </Field>
              </div>
            ))}
            {(
              [
                ["layoutGardenAvailable", "layoutGardenDescription", "Jardín"],
                ["layoutStorageAvailable", "layoutStorageDescription", "Depósito"],
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
                  aria-label={`Detalle de ${label.toLowerCase()}`}
                  placeholder="Detalle (opcional)"
                  className="flex-1"
                  {...form.register(descField)}
                />
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section title="Más detalles" description="Texto libre para tu equipo.">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="enjoy">Qué se disfruta</FieldLabel>
            <Textarea id="enjoy" rows={4} {...form.register("enjoy")} />
            <FieldDescription>Una descripción corta de la experiencia de estar en la propiedad.</FieldDescription>
          </Field>
          {!isRent && (
            <Field className="max-w-60">
              <FieldLabel htmlFor="outdoorShower">Duchas exteriores</FieldLabel>
              <Controller
                control={form.control}
                name="outdoorShower"
                render={({ field }) => (
                  <Stepper id="outdoorShower" label="duchas exteriores" value={field.value} onChange={field.onChange} />
                )}
              />
            </Field>
          )}
        </FieldGroup>
      </Section>

      {!isRent && (
        <Section title="Piscinas y jacuzzis" description="Cada una con su tipo y medidas.">
          <PoolsTab propertyId={property.id} />
        </Section>
      )}
    </div>
  );
}
