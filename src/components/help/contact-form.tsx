"use client";

import { Check, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/api/client";
import { requestContact } from "@/lib/api/contact";
import { cn } from "@/lib/utils";

const CTA =
  "inline-flex h-12 items-center justify-center rounded-lg bg-lime px-6 text-base font-semibold text-forest-deep outline-none transition-[filter] hover:brightness-95 focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 disabled:opacity-60";
const FIELD_INPUT = "rounded-lg border border-line bg-white px-3.5";

const contactSchema = z.object({
  name: z.string().min(2, "Ingresá tu nombre"),
  email: z.string().email("Revisá el email: falta la @ o el dominio"),
  message: z.string().min(5, "Contanos un poco más"),
});

type ContactValues = z.infer<typeof contactSchema>;

/** The help/contact page's form. A separate path from "Pedir una demo": this
 * one is for existing agencies and anyone with a question, not prospects. */
export function ContactForm() {
  const [sent, setSent] = useState(false);
  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" },
  });
  const errors = form.formState.errors;

  async function onSubmit(values: ContactValues) {
    try {
      await requestContact(values);
      setSent(true);
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "No se pudo enviar el mensaje. Probá de nuevo en unos minutos.",
      );
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-xl border border-line bg-white p-8" role="status">
        <span className="flex size-10 items-center justify-center rounded-lg bg-lime text-forest-deep">
          <Check className="size-5" />
        </span>
        <p className="font-logo text-2xl font-semibold">Mensaje enviado</p>
        <p className="text-quiet">Te respondemos por email a la brevedad.</p>
      </div>
    );
  }

  return (
    <form
      className="flex flex-col gap-5 rounded-xl border border-line bg-white p-6 sm:p-8"
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-name">Tu nombre</Label>
        <Input
          id="contact-name"
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          className={cn("h-11", FIELD_INPUT)}
          {...form.register("name")}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-email">Email</Label>
        <Input
          id="contact-email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          className={cn("h-11", FIELD_INPUT)}
          {...form.register("email")}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-message">En qué te podemos ayudar</Label>
        <Textarea
          id="contact-message"
          rows={5}
          aria-invalid={Boolean(errors.message)}
          className={FIELD_INPUT}
          {...form.register("message")}
        />
        {errors.message && <p className="text-sm text-destructive">{errors.message.message}</p>}
      </div>
      <button type="submit" className={cn(CTA, "mt-2 gap-2")} disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? (
          <>
            <LoaderCircle className="size-4 animate-spin" />
            Enviando…
          </>
        ) : (
          "Enviar mensaje"
        )}
      </button>
    </form>
  );
}
