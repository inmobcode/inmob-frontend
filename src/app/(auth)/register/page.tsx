"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { registerAgency } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { setSession } from "@/lib/auth/session";

const schema = z.object({
  agencyName: z.string().min(2, "Ingresá el nombre de tu agencia"),
  name: z.string().min(2, "Ingresá tu nombre"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    try {
      const auth = await registerAgency(values);
      setSession(auth);
      router.push("/properties");
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : "Error inesperado");
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Crear tu agencia</h1>
        <p className="text-sm text-zinc-500">
          Registrá tu agencia y empezá a cargar propiedades
        </p>
      </div>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="agencyName">Nombre de la agencia</FieldLabel>
            <Input id="agencyName" {...form.register("agencyName")} />
            <FieldError errors={[form.formState.errors.agencyName]} />
          </Field>
          <Field>
            <FieldLabel htmlFor="name">Tu nombre</FieldLabel>
            <Input id="name" {...form.register("name")} />
            <FieldError errors={[form.formState.errors.name]} />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" type="email" {...form.register("email")} />
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
          {form.formState.isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
        </Button>
      </form>
    </div>
  );
}
