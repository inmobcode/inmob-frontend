"use client";

import { useTranslations } from "next-intl";
import { Controller, useWatch, type UseFormReturn } from "react-hook-form";

import { ChipPicker } from "@/components/properties/form-controls";
import { FormSection as Section } from "@/components/properties/form-section";
import { RichTextEditor } from "@/components/rich-text/rich-text-editor";
import type { FormValues } from "@/components/properties/property-editor";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useLabels } from "@/lib/labels";
import { richTextPlain } from "@/lib/rich-text";
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
  const t = useTranslations("properties.content");
  const labels = useLabels();
  const values = useWatch({ control: form.control });
  const summary = values.summary ?? "";
  const description = richTextPlain(values.description ?? "");

  return (
    <div className="flex max-w-2xl min-w-0 flex-col gap-12">
      <Section
        title={t("text.title")}
        description={t("text.description")}
        shown
      >
        <FieldGroup>
          <Field>
            <div className="flex items-baseline justify-between gap-3">
              <FieldLabel htmlFor="summary">{t("text.summary")}</FieldLabel>
              <Counter length={summary.length} limit={SUMMARY_LIMIT} />
            </div>
            <Textarea id="summary" rows={3} {...form.register("summary")} />
            <FieldDescription>
              {t("text.summaryHint", { limit: SUMMARY_LIMIT })}
            </FieldDescription>
          </Field>
          <Field>
            <div className="flex items-baseline justify-between gap-3">
              <FieldLabel htmlFor="description">{t("text.descriptionLabel")}</FieldLabel>
              <Counter length={description.length} />
            </div>
            <Controller
              control={form.control}
              name="description"
              render={({ field }) => (
                <RichTextEditor
                  id="description"
                  value={field.value}
                  onChange={field.onChange}
                  stickyToolbar
                  contentClassName="min-h-48"
                />
              )}
            />
            <FieldDescription>{t("text.descriptionHint")}</FieldDescription>
          </Field>
        </FieldGroup>
      </Section>

      {isRent && (
        <>
          <Section title={t("included.title")} description={t("included.description")}>
            <Controller
              control={form.control}
              name="includedServices"
              render={({ field }) => (
                <ChipPicker
                  label={t("included.title")}
                  options={INCLUDED_SERVICES}
                  labelOf={labels.includedService}
                  value={field.value}
                  onChange={field.onChange}
                  limit={20}
                />
              )}
            />
          </Section>

          <Section title={t("policies.title")} description={t("policies.description")}>
            <Field>
              <FieldLabel htmlFor="extraInfo" className="sr-only">
                {t("policies.title")}
              </FieldLabel>
              <Textarea id="extraInfo" rows={4} {...form.register("extraInfo")} />
            </Field>
          </Section>
        </>
      )}
    </div>
  );
}
