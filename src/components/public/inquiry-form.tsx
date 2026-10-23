"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Check, LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/api/client";
import { submitPropertyInquiry } from "@/lib/api/properties";
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

const FIELD =
  "h-11 rounded-lg border border-[#d6d9d5] bg-white px-3.5 shadow-none";

/**
 * Sends a question to the agency; it lands in their clients list. With a
 * `propertyId` it's about that listing, without one it's a general question.
 */
export function InquiryForm({
  agencySlug,
  propertyId,
  defaultMessage = "",
  className,
}: {
  agencySlug: string;
  propertyId?: string;
  defaultMessage?: string;
  className?: string;
}) {
  const t = useTranslations("site.inquiry");
  const schema = useMemo(() => makeSchema(t), [t]);
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", phone: "", message: defaultMessage },
  });
  const errors = form.formState.errors;

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      submitPropertyInquiry(agencySlug, {
        name: values.name,
        email: values.email,
        phone: values.phone || undefined,
        message: values.message || undefined,
        propertyId,
      }),
    onSuccess: () => setSent(true),
    onError: (err) =>
      setServerError(
        err instanceof ApiError && err.status < 500
          ? t("checkData")
          : t("sendFailed"),
      ),
  });

  if (sent) {
    return (
      <div
        className={cn("flex flex-col items-start gap-3", className)}
        role="status"
      >
        <span className="flex size-10 items-center justify-center rounded-lg bg-site-accent text-site-accent-ink">
          <Check className="size-5" />
        </span>
        <p className="s-heading text-xl">{t("sentTitle")}</p>
        <p className="text-pretty text-site-quiet">{t("sentBody")}</p>
      </div>
    );
  }

  return (
    <form
      className={cn("flex flex-col gap-4", className)}
      noValidate
      onSubmit={form.handleSubmit((values) => {
        setServerError(null);
        mutation.mutate(values);
      })}
    >
      {(
        [
          ["name", t("name"), "text", "name"],
          ["email", t("email"), "email", "email"],
          ["phone", t("phone"), "tel", "tel"],
        ] as const
      ).map(([id, label, type, autoComplete]) => {
        const error = errors[id]?.message;
        const fieldId = `inquiry-${propertyId ?? "general"}-${id}`;
        return (
          <div key={id} className="flex flex-col gap-1.5">
            <label htmlFor={fieldId} className="text-sm font-medium">
              {label}
            </label>
            <Input
              id={fieldId}
              type={type}
              autoComplete={autoComplete}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `${fieldId}-error` : undefined}
              className={FIELD}
              {...form.register(id)}
            />
            {error && (
              <p id={`${fieldId}-error`} className="text-sm text-destructive">
                {error}
              </p>
            )}
          </div>
        );
      })}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={`inquiry-${propertyId ?? "general"}-message`}
          className="text-sm font-medium"
        >
          {t("message")}
        </label>
        <Textarea
          id={`inquiry-${propertyId ?? "general"}-message`}
          rows={3}
          className="min-h-24 rounded-lg border border-[#d6d9d5] bg-white px-3.5 py-2.5 shadow-none"
          {...form.register("message")}
        />
      </div>
      {serverError && (
        <p
          role="alert"
          className="rounded-lg bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive"
        >
          {serverError}
        </p>
      )}
      <button
        type="submit"
        disabled={mutation.isPending}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-site-accent px-5 font-medium text-site-accent-ink outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-site-accent focus-visible:ring-offset-2 disabled:opacity-70"
      >
        {mutation.isPending ? (
          <>
            <LoaderCircle className="size-4 animate-spin" />
            {t("sending")}
          </>
        ) : (
          t("submit")
        )}
      </button>
    </form>
  );
}
