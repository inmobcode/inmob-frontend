"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  AUTH_INPUT,
  AuthDivider,
  AuthField,
  AuthFormError,
  AuthHeading,
  AuthSubmit,
  authErrorMessage,
  fieldA11y,
} from "@/components/auth/form-parts";
import { PasswordInput } from "@/components/auth/password-input";
import { SocialButtons } from "@/components/auth/social-buttons";
import { Input } from "@/components/ui/input";
import { registerAgency } from "@/lib/api/auth";
import { setSession } from "@/lib/auth/session";

const PASSWORD_HINT = "Al menos 8 caracteres.";

const schema = z.object({
  agencyName: z.string().min(2, "Ingresá el nombre de tu agencia."),
  name: z.string().min(2, "Ingresá tu nombre."),
  email: z.string().email("Revisá el email: falta la @ o el dominio."),
  password: z.string().min(8, "La contraseña necesita al menos 8 caracteres."),
});

type FormValues = z.infer<typeof schema>;

const TEXT_FIELDS: {
  id: Exclude<keyof FormValues, "password">;
  label: string;
  autoComplete: string;
  type?: string;
}[] = [
  {
    id: "agencyName",
    label: "Nombre de la agencia",
    autoComplete: "organization",
  },
  { id: "name", label: "Tu nombre", autoComplete: "name" },
  { id: "email", label: "Email", autoComplete: "email", type: "email" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { agencyName: "", name: "", email: "", password: "" },
  });
  const errors = form.formState.errors;

  async function onSubmit(values: FormValues) {
    setServerError(null);
    try {
      const auth = await registerAgency(values);
      setSession(auth);
      router.push(`/${auth.user.agencySlug}/properties`);
    } catch (err) {
      setServerError(authErrorMessage(err, "register"));
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <AuthHeading
        title="Creá tu agencia"
        text="Después podés invitar a tu equipo."
      />

      <SocialButtons verb="Registrarte" />

      <AuthDivider>o con tu email</AuthDivider>

      <form
        className="flex flex-col gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        {TEXT_FIELDS.map((field) => (
          <AuthField
            key={field.id}
            id={field.id}
            label={field.label}
            error={errors[field.id]?.message}
          >
            <Input
              id={field.id}
              type={field.type ?? "text"}
              autoComplete={field.autoComplete}
              className={AUTH_INPUT}
              {...fieldA11y(field.id, { error: errors[field.id]?.message })}
              {...form.register(field.id)}
            />
          </AuthField>
        ))}
        <AuthField
          id="password"
          label="Contraseña"
          hint={PASSWORD_HINT}
          error={errors.password?.message}
        >
          <PasswordInput
            id="password"
            autoComplete="new-password"
            {...fieldA11y("password", {
              hint: PASSWORD_HINT,
              error: errors.password?.message,
            })}
            {...form.register("password")}
          />
        </AuthField>
        <AuthFormError message={serverError} />
        <AuthSubmit
          pending={form.formState.isSubmitting}
          label="Crear cuenta"
          pendingLabel="Creando cuenta…"
        />
      </form>

      <p className="text-center text-sm text-quiet">
        ¿Ya tenés cuenta?{" "}
        <Link
          href="/login"
          className="rounded-sm font-medium text-ink underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-forest"
        >
          Ingresá
        </Link>
      </p>
    </div>
  );
}
