"use client";

import { Controller, type UseFormReturn } from "react-hook-form";

import { FormSection as Section } from "@/components/properties/form-section";
import type { FormValues } from "@/components/properties/property-editor";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export function EssentialsTab({ form }: { form: UseFormReturn<FormValues> }) {
  return (
    <div className="flex max-w-2xl min-w-0 flex-col gap-12">
      <Section
        title="Gestión de la propiedad"
        description="La persona o empresa que la administra en el día a día."
        shown={false}
      >
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="managementName">Nombre</FieldLabel>
            <Input id="managementName" autoComplete="off" {...form.register("managementName")} />
          </Field>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="managementEmail">Email</FieldLabel>
              <Input
                id="managementEmail"
                type="email"
                autoComplete="off"
                placeholder="nombre@empresa.com"
                {...form.register("managementEmail")}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="managementPhone">Teléfono</FieldLabel>
              <Input
                id="managementPhone"
                type="tel"
                autoComplete="off"
                placeholder="+598 99 123 456"
                {...form.register("managementPhone")}
              />
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor="managementCompany">Empresa</FieldLabel>
            <Input id="managementCompany" autoComplete="off" {...form.register("managementCompany")} />
          </Field>
        </FieldGroup>
      </Section>

      <Section
        title="Proveedor y licencia"
        description="Datos de quien comercializa la propiedad y su habilitación."
        shown={false}
      >
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="vendorPropertyName">Nombre de la propiedad para el proveedor</FieldLabel>
            <Input id="vendorPropertyName" autoComplete="off" {...form.register("vendorPropertyName")} />
          </Field>
          <Field>
            <FieldLabel htmlFor="website">Sitio web del proveedor</FieldLabel>
            <Input id="website" type="url" placeholder="https://" {...form.register("website")} />
          </Field>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="commission">Comisión</FieldLabel>
              <Input id="commission" placeholder="Ej: 5 %" {...form.register("commission")} />
            </Field>
            <Field>
              <FieldLabel htmlFor="license">Número de licencia</FieldLabel>
              <Input id="license" autoComplete="off" {...form.register("license")} />
            </Field>
          </div>
        </FieldGroup>
      </Section>

      <Section
        title="Permisos"
        description="Qué podés hacer con esta propiedad fuera de tu portal."
        shown={false}
      >
        <div className="flex items-start justify-between gap-6 rounded-2xl bg-foreground/[0.04] p-5">
          <div className="flex flex-col gap-1">
            <label htmlFor="thirdPartyPermission" className="text-sm font-medium">
              Publicar en portales de terceros
            </label>
            <FieldDescription>
              Confirmás que tenés autorización para compartir esta propiedad con portales externos.
            </FieldDescription>
          </div>
          <Controller
            control={form.control}
            name="thirdPartyPermission"
            render={({ field }) => (
              <Switch id="thirdPartyPermission" checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
        </div>
      </Section>
    </div>
  );
}
