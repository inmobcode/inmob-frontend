"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { PasswordInput } from "@/components/auth/password-input";
import { SocialButtons } from "@/components/auth/social-buttons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { getAccessToken, setSession } from "@/lib/auth/session";
import { readNext } from "@/lib/auth/oauth";

const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Ingresá tu contraseña"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { email: "", password: "" } });
  const errors = form.formState.errors;

  useEffect(() => {
    if (getAccessToken()) router.replace(readNext());
  }, [router]);

  async function onSubmit(values: FormValues) {
    setServerError(null);
    try {
      const auth = await login(values);
      setSession(auth);
      router.push(readNext());
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : "Error inesperado");
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-4xl leading-none tracking-tight">Te damos la bienvenida</h1>
        <p className="text-muted-foreground">Entrá al panel de tu agencia.</p>
      </div>

      <SocialButtons />

      <p className="text-center text-sm text-muted-foreground">o ingresá con tu email</p>

      <form className="flex flex-col gap-5" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <div className="flex flex-col gap-2.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="tu@agencia.com"
            aria-invalid={Boolean(errors.email)}
            className="h-12 rounded-xl px-4"
            {...form.register("email")}
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>
        <div className="flex flex-col gap-2.5">
          <Label htmlFor="password">Contraseña</Label>
          <PasswordInput
            id="password"
            autoComplete="current-password"
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
              Entrando…
            </>
          ) : (
            "Entrar"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        ¿Todavía no tenés cuenta?{" "}
        <Link href="/register" className="font-medium text-foreground underline-offset-4 outline-none hover:underline focus-visible:underline">
          Creá tu agencia
        </Link>
      </p>
    </div>
  );
}
