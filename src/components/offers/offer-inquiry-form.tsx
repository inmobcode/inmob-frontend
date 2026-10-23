"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/api/client";
import { submitOfferInquiry } from "@/lib/api/offers";
import { cn } from "@/lib/utils";

function makeSchema(t: (key: "nameRequired" | "emailInvalid") => string) {
  return z.object({
    name: z.string().min(2, t("nameRequired")),
    email: z.string().email(t("emailInvalid")),
    phone: z.string(),
    message: z.string(),
  });
}

type FormValues = z.infer<ReturnType<typeof makeSchema>>;

export function OfferInquiryForm({
  offerToken,
  defaultMessage = "",
  framed = true,
}: {
  offerToken: string;
  /** Prefilled message, e.g. naming the property it's asked from. */
  defaultMessage?: string;
  /** false: no box or heading of its own, for a page that already titles it. */
  framed?: boolean;
}) {
  const t = useTranslations("site.inquiry");
  const common = useTranslations("common");
  const schema = useMemo(() => makeSchema(t), [t]);
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", phone: "", message: defaultMessage },
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      submitOfferInquiry(offerToken, {
        name: values.name,
        email: values.email,
        phone: values.phone || undefined,
        message: values.message || undefined,
      }),
    onSuccess: () => setSent(true),
    onError: (err) => setServerError(err instanceof ApiError ? err.message : common("unexpectedError")),
  });

  if (sent) {
    return (
      <p className="rounded-md border bg-zinc-50 p-4 text-sm text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
        {t("thanks")}
      </p>
    );
  }

  return (
    <form
      className={cn("space-y-4", framed && "max-w-md rounded-md border p-4")}
      onSubmit={form.handleSubmit((values) => {
        setServerError(null);
        mutation.mutate(values);
      })}
    >
      {framed && <h3 className="font-medium">{t("contactUs")}</h3>}
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">{t("name")}</FieldLabel>
          <Input id="name" {...form.register("name")} />
          <FieldError errors={[form.formState.errors.name]} />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">{t("email")}</FieldLabel>
          <Input id="email" type="email" {...form.register("email")} />
          <FieldError errors={[form.formState.errors.email]} />
        </Field>
        <Field>
          <FieldLabel htmlFor="phone">{t("phone")}</FieldLabel>
          <Input id="phone" {...form.register("phone")} />
        </Field>
        <Field>
          <FieldLabel htmlFor="message">{t("message")}</FieldLabel>
          <Textarea id="message" rows={3} {...form.register("message")} />
        </Field>
      </FieldGroup>
      {serverError && <p className="text-sm text-destructive">{serverError}</p>}
      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? t("sending") : t("submit")}
      </Button>
    </form>
  );
}
