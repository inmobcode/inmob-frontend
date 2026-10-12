"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { PasswordInput } from "@/components/auth/password-input";
import { SocialButtons } from "@/components/auth/social-buttons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
      router.push("/properties");
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : "Error inesperado");
    }
  }

  const text = (id: keyof FormValues, label: string, autoComplete: string, type = "text") => (
    <div className="flex flex-col gap-2.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        autoComplete={autoComplete}
        aria-invalid={Boolean(errors[id])}
        className="h-12 rounded-xl px-4"
        {...form.register(id)}
      />
      {errors[id] && <p className="text-sm text-destructive">{errors[id]?.message}</p>}
    </div>
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-4xl leading-none tracking-tight">Creá tu agencia</h1>
        <p className="text-muted-foreground">Registrala y empezá a cargar propiedades.</p>
      </div>

      <SocialButtons verb="Registrarte" />

      <p className="text-center text-sm text-muted-foreground">o registrate con tu email</p>

      <form className="flex flex-col gap-5" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        {text("agencyName", "Nombre de la agencia", "organization")}
        {text("name", "Tu nombre", "name")}
        {text("email", "Email", "email", "email")}
        <div className="flex flex-col gap-2.5">
          <Label htmlFor="password">Contraseña</Label>
          <PasswordInput
            id="password"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.password)}
            {...form.register("password")}
          />
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>
        {serverError && (
          <p role="alert" className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {serverError}
          </p>
        )}
        <Button type="submit" size="lg" className="h-12 gap-2 rounded-full text-base" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <>
              <LoaderCircle className="animate-spin" />
              Creando cuenta…
            </>
          ) : (
            "Crear cuenta"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        ¿Ya tenés cuenta?{" "}
        <Link href="/login" className="font-medium text-foreground underline-offset-4 outline-none hover:underline focus-visible:underline">
          Ingresá
        </Link>
      </p>
    </div>
  );
}
