"use client";

import { Controller, useWatch, type UseFormReturn } from "react-hook-form";

import { ChipPicker } from "@/components/properties/form-controls";
import { FormSection as Section } from "@/components/properties/form-section";
import type { FormValues } from "@/components/properties/property-editor";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { INCLUDED_SERVICE_LABELS } from "@/lib/properties-labels";
import { INCLUDED_SERVICES } from "@/lib/property-catalogs";
import { cn } from "@/lib/utils";

const SUMMARY_LIMIT = 160;

function Counter({ length, limit }: { length: number; limit?: number }) {
  const over = limit != null && length > limit;
  return (
    <span className={cn("text-xs tabular-nums", over ? "text-amber-600" : "text-muted-foreground")}>
      {length}
      {limit != null && ` / ${limit}`}
    </span>
  );
}

export function ContentTab({ form, isRent }: { form: UseFormReturn<FormValues>; isRent: boolean }) {
  const values = useWatch({ control: form.control });
  const summary = values.summary ?? "";
  const description = values.description ?? "";

  return (
    <div className="flex max-w-2xl min-w-0 flex-col gap-12">
      <Section
        title="Texto de la ficha"
        description="Lo primero que lee el cliente. El resumen va destacado arriba y la descripción debajo."
        shown
      >
        <FieldGroup>
          <Field>
            <div className="flex items-baseline justify-between gap-3">
              <FieldLabel htmlFor="summary">Resumen</FieldLabel>
              <Counter length={summary.length} limit={SUMMARY_LIMIT} />
            </div>
            <Textarea id="summary" rows={3} {...form.register("summary")} />
            <FieldDescription>
              Una o dos frases que enganchen. Funciona mejor si no pasa de {SUMMARY_LIMIT} caracteres.
            </FieldDescription>
          </Field>
          <Field>
            <div className="flex items-baseline justify-between gap-3">
              <FieldLabel htmlFor="description">Descripción</FieldLabel>
              <Counter length={description.length} />
            </div>
            <Textarea id="description" rows={8} {...form.register("description")} />
            <FieldDescription>Los saltos de línea se respetan, así que podés separar en párrafos.</FieldDescription>
          </Field>
        </FieldGroup>
      </Section>

      {isRent && (
        <>
          <Section title="Servicios incluidos" description="Lo que está incluido en el precio del alquiler.">
            <Controller
              control={form.control}
              name="includedServices"
              render={({ field }) => (
                <ChipPicker
                  label="Servicios incluidos"
                  options={INCLUDED_SERVICES}
                  labels={INCLUDED_SERVICE_LABELS}
                  value={field.value}
                  onChange={field.onChange}
                  limit={20}
                />
              )}
            />
          </Section>

          <Section title="Políticas y términos" description="Condiciones de reserva, cancelación y uso de la propiedad.">
            <Field>
              <FieldLabel htmlFor="extraInfo" className="sr-only">
                Políticas y términos
              </FieldLabel>
              <Textarea id="extraInfo" rows={4} {...form.register("extraInfo")} />
            </Field>
          </Section>
        </>
      )}
    </div>
  );
}
