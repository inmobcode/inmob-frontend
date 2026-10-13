"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Check, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/api/client";
import { submitPropertyInquiry } from "@/lib/api/properties";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Ingresá tu nombre."),
  email: z.string().email("Revisá el email: falta la @ o el dominio."),
  phone: z.string(),
  message: z.string(),
});

type FormValues = z.infer<typeof schema>;

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
          ? "Revisá los datos y probá de nuevo."
          : "No se pudo enviar la consulta. Probá de nuevo en unos minutos.",
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
        <p className="s-heading text-xl">Consulta enviada</p>
        <p className="text-pretty text-site-quiet">
          La agencia te va a responder por email o por teléfono.
        </p>
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
          ["name", "Nombre", "text", "name"],
          ["email", "Email", "email", "email"],
          ["phone", "Teléfono (opcional)", "tel", "tel"],
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
          Mensaje (opcional)
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
            Enviando…
          </>
        ) : (
          "Enviar consulta"
        )}
      </button>
    </form>
  );
}
