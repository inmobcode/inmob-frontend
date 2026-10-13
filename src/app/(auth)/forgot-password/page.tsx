"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MailCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  AUTH_INPUT,
  AuthField,
  AuthFormError,
  AuthHeading,
  AuthSubmit,
  authErrorMessage,
  fieldA11y,
} from "@/components/auth/form-parts";
import { Input } from "@/components/ui/input";
import { requestPasswordReset } from "@/lib/api/auth";

const schema = z.object({
  email: z.string().email("Revisá el email: falta la @ o el dominio."),
});

type FormValues = z.infer<typeof schema>;

const BACK_LINK =
  "rounded-sm text-sm font-medium text-ink underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-forest";

export default function ForgotPasswordPage() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });
  const errors = form.formState.errors;

  async function onSubmit(values: FormValues) {
    setServerError(null);
    try {
      await requestPasswordReset(values);
      setSentTo(values.email);
    } catch (err) {
      setServerError(authErrorMessage(err, "forgot"));
    }
  }

  if (sentTo) {
    return (
      <div className="flex flex-col items-start gap-6" role="status">
        <span className="flex size-11 items-center justify-center rounded-lg bg-lime/25 text-forest">
          <MailCheck className="size-5" />
        </span>
        <AuthHeading
          title="Revisá tu email"
          text={`Si hay una cuenta con ${sentTo}, te llegó un link para crear una contraseña nueva. Puede tardar unos minutos; revisá también el correo no deseado.`}
        />
        <Link href="/login" className={BACK_LINK}>
          Volver a ingresar
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <AuthHeading
        title="Recuperá tu contraseña"
        text="Te mandamos un link a tu email para que crees una nueva."
      />
      <form
        className="flex flex-col gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        <AuthField id="email" label="Email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="tu@agencia.com"
            className={AUTH_INPUT}
            {...fieldA11y("email", { error: errors.email?.message })}
            {...form.register("email")}
          />
        </AuthField>
        <AuthFormError message={serverError} />
        <AuthSubmit
          pending={form.formState.isSubmitting}
          label="Enviar link"
          pendingLabel="Enviando…"
        />
      </form>
      <p className="text-center text-sm text-quiet">
        ¿Te acordaste?{" "}
        <Link href="/login" className={BACK_LINK}>
          Volver a ingresar
        </Link>
      </p>
    </div>
  );
}
