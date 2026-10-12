"use client";

import { Controller, useWatch, type UseFormReturn } from "react-hook-form";

import { FormSection as Section } from "@/components/properties/form-section";
import { UnitInput } from "@/components/properties/form-controls";
import type { FormValues } from "@/components/properties/property-editor";
import { Segmented } from "@/components/properties/segmented";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";

const COMMON_CURRENCIES = ["USD", "EUR"];

export function PricesTab({ form, isRent }: { form: UseFormReturn<FormValues>; isRent: boolean }) {
  const values = useWatch({ control: form.control });
  const currency = values.currency || "USD";
  // Keep a currency that is already saved even when it is not one of the common ones.
  const options = (COMMON_CURRENCIES.includes(currency) ? COMMON_CURRENCIES : [...COMMON_CURRENCIES, currency]).map(
    (code) => ({ value: code, label: code }),
  );

  return (
    <div className="flex max-w-2xl min-w-0 flex-col gap-12">
      <Section
        title={isRent ? "Precio base por noche" : "Precio de venta"}
        description={
          isRent
            ? "El valor de referencia por noche. Las ofertas lo usan cuando no hay una tarifa por temporada."
            : "Aparece en la ficha y en las tarjetas de tu cartera."
        }
        shown
      >
        <FieldGroup>
          <Field>
            <FieldLabel>Moneda</FieldLabel>
            <Controller
              control={form.control}
              name="currency"
              render={({ field }) => (
                <div className="flex">
                  <Segmented
                    label="Moneda"
                    contained
                    value={field.value || "USD"}
                    options={options}
                    onChange={field.onChange}
                  />
                </div>
              )}
            />
          </Field>
          <Field className="max-w-sm">
            <FieldLabel htmlFor="price">{isRent ? "Precio por noche" : "Precio"}</FieldLabel>
            <UnitInput
              id="price"
              unit={currency}
              placeholder="0"
              className="h-12 text-lg tabular-nums"
              {...form.register("price")}
            />
            <FieldDescription>Dejalo vacío si preferís mostrar «Precio a consultar».</FieldDescription>
          </Field>
        </FieldGroup>
      </Section>
    </div>
  );
}
