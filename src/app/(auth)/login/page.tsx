"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { login } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { setSession } from "@/lib/auth/session";

const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Ingresá tu contraseña"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    try {
      const auth = await login(values);
      setSession(auth);
      router.push("/properties");
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : "Error inesperado");
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Iniciar sesión</h1>
        <p className="text-sm text-zinc-500">Entrá al panel de tu agencia</p>
      </div>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" type="email" placeholder="tu@agencia.com" {...form.register("email")} />
            <FieldError errors={[form.formState.errors.email]} />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Contraseña</FieldLabel>
            <Input id="password" type="password" {...form.register("password")} />
            <FieldError errors={[form.formState.errors.password]} />
          </Field>
        </FieldGroup>
        {serverError && <p className="text-sm text-destructive">{serverError}</p>}
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </div>
  );
}
