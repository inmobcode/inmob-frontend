"use client";

import { Controller, type UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";

import { FormSection as Section } from "@/components/properties/form-section";
import type { FormValues } from "@/components/properties/property-editor";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export function EssentialsTab({ form }: { form: UseFormReturn<FormValues> }) {
  const t = useTranslations("properties.essentials");
  return (
    <div className="flex max-w-2xl min-w-0 flex-col gap-12">
      <Section
        title={t("management.title")}
        description={t("management.description")}
        shown={false}
      >
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="managementName">{t("management.name")}</FieldLabel>
            <Input id="managementName" autoComplete="off" {...form.register("managementName")} />
          </Field>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="managementEmail">Email</FieldLabel>
              <Input
                id="managementEmail"
                type="email"
                autoComplete="off"
                placeholder={t("management.emailPlaceholder")}
                {...form.register("managementEmail")}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="managementPhone">{t("management.phone")}</FieldLabel>
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
            <FieldLabel htmlFor="managementCompany">{t("management.company")}</FieldLabel>
            <Input id="managementCompany" autoComplete="off" {...form.register("managementCompany")} />
          </Field>
        </FieldGroup>
      </Section>

      <Section
        title={t("vendor.title")}
        description={t("vendor.description")}
        shown={false}
      >
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="vendorPropertyName">{t("vendor.name")}</FieldLabel>
            <Input id="vendorPropertyName" autoComplete="off" {...form.register("vendorPropertyName")} />
          </Field>
          <Field>
            <FieldLabel htmlFor="website">{t("vendor.website")}</FieldLabel>
            <Input id="website" type="url" placeholder="https://" {...form.register("website")} />
          </Field>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="commission">{t("vendor.commission")}</FieldLabel>
              <Input id="commission" placeholder={t("vendor.commissionPlaceholder")} {...form.register("commission")} />
            </Field>
            <Field>
              <FieldLabel htmlFor="license">{t("vendor.license")}</FieldLabel>
              <Input id="license" autoComplete="off" {...form.register("license")} />
            </Field>
          </div>
        </FieldGroup>
      </Section>

      <Section
        title={t("permissions.title")}
        description={t("permissions.description")}
        shown={false}
      >
        <div className="flex items-start justify-between gap-6 rounded-2xl bg-foreground/[0.04] p-5">
          <div className="flex flex-col gap-1">
            <label htmlFor="thirdPartyPermission" className="text-sm font-medium">
              {t("permissions.thirdParty")}
            </label>
            <FieldDescription>
              {t("permissions.thirdPartyHint")}
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
