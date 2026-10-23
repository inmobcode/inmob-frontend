"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  AUTH_INPUT,
  AuthDivider,
  AuthField,
  AuthFormError,
  AuthHeading,
  AuthSubmit,
  authErrorKey,
  fieldA11y,
} from "@/components/auth/form-parts";
import { PasswordInput } from "@/components/auth/password-input";
import { SocialButtons } from "@/components/auth/social-buttons";
import { Input } from "@/components/ui/input";
import { login } from "@/lib/api/auth";
import { getAgencySlug, setSession } from "@/lib/auth/session";
import { readNext } from "@/lib/auth/oauth";

const makeSchema = (t: (key: "emailInvalid" | "passwordRequired") => string) =>
  z.object({
    email: z.string().email(t("emailInvalid")),
    password: z.string().min(1, t("passwordRequired")),
  });

type FormValues = z.infer<ReturnType<typeof makeSchema>>;

const LINK =
  "rounded-sm font-medium text-ink underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-forest";

export default function LoginPage() {
  const t = useTranslations("auth.login");
  const tAuth = useTranslations("auth");
  const schema = useMemo(() => makeSchema((key) => tAuth(`validation.${key}`)), [tAuth]);
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  // Starts true on both server and first client render so we never paint the
  // form before checking for an existing session; useLayoutEffect below
  // resolves it synchronously, before the browser paints, so an already
  // logged-in visitor never sees the login form flash.
  const [checkingSession, setCheckingSession] = useState(true);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });
  const errors = form.formState.errors;

  useLayoutEffect(() => {
    const slug = getAgencySlug();
    if (slug) {
      router.replace(readNext(slug));
      return;
    }
    // Intentional: must flip before paint (see comment above), so it can't wait for an event.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCheckingSession(false);
  }, [router]);

  async function onSubmit(values: FormValues) {
    setServerError(null);
    try {
      const auth = await login(values);
      setSession(auth);
      router.push(readNext(auth.user.agencySlug));
    } catch (err) {
      setServerError(tAuth(`errors.${authErrorKey(err, "login")}`));
    }
  }

  if (checkingSession) return null;

  return (
    <div className="flex flex-col gap-8 [@media(max-height:820px)]:gap-6">
      <AuthHeading title={t("title")} />

      <SocialButtons />

      <AuthDivider>{tAuth("orEmail")}</AuthDivider>

      <form
        className="flex flex-col gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        <AuthField id="email" label={tAuth("email")} error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder={tAuth("emailPlaceholder")}
            className={AUTH_INPUT}
            {...fieldA11y("email", { error: errors.email?.message })}
            {...form.register("email")}
          />
        </AuthField>
        <AuthField
          id="password"
          label={tAuth("password")}
          error={errors.password?.message}
          aside={
            <Link
              href="/forgot-password"
              className="rounded-sm text-sm text-quiet underline-offset-4 outline-none hover:text-ink hover:underline focus-visible:ring-2 focus-visible:ring-forest"
            >
              {t("forgot")}
            </Link>
          }
        >
          <PasswordInput
            id="password"
            autoComplete="current-password"
            {...fieldA11y("password", { error: errors.password?.message })}
            {...form.register("password")}
          />
        </AuthField>
        <AuthFormError message={serverError} />
        <AuthSubmit
          pending={form.formState.isSubmitting}
          label={t("submit")}
          pendingLabel={t("submitting")}
        />
      </form>

      <p className="text-center text-sm text-quiet">
        {t("noAccount")}{" "}
        <Link href="/register" className={LINK}>
          {t("register")}
        </Link>
      </p>
    </div>
  );
}
