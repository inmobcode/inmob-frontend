"use client";

import { Controller, useWatch, type UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";

import { FormSection as Section } from "@/components/properties/form-section";
import { PriceInput } from "@/components/properties/form-controls";
import type { FormValues } from "@/components/properties/property-editor";
import { Segmented } from "@/components/properties/segmented";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";

const COMMON_CURRENCIES = ["USD", "EUR"];

export function PricesTab({ form, isRent }: { form: UseFormReturn<FormValues>; isRent: boolean }) {
  const t = useTranslations("properties.prices");
  const values = useWatch({ control: form.control });
  const currency = values.currency || "USD";
  // Keep a currency that is already saved even when it is not one of the common ones.
  const options = (COMMON_CURRENCIES.includes(currency) ? COMMON_CURRENCIES : [...COMMON_CURRENCIES, currency]).map(
    (code) => ({ value: code, label: code }),
  );

  return (
    <div className="flex max-w-2xl min-w-0 flex-col gap-12">
      <Section
        title={isRent ? t("rentTitle") : t("saleTitle")}
        description={isRent ? t("rentDescription") : t("saleDescription")}
        shown
      >
        <FieldGroup>
          <Field>
            <FieldLabel>{t("currency")}</FieldLabel>
            <Controller
              control={form.control}
              name="currency"
              render={({ field }) => (
                <div className="flex">
                  <Segmented
                    label={t("currency")}
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
            <FieldLabel htmlFor="price">{isRent ? t("perNight") : t("price")}</FieldLabel>
            <Controller
              control={form.control}
              name="price"
              render={({ field }) => (
                <PriceInput
                  id="price"
                  unit={currency}
                  placeholder="0"
                  className="h-12 text-lg"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <FieldDescription>{t("emptyHint")}</FieldDescription>
          </Field>
        </FieldGroup>
      </Section>
    </div>
  );
}
