"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  AUTH_INPUT,
  AuthField,
  AuthFormError,
  AuthHeading,
  AuthSubmit,
  authErrorKey,
  fieldA11y,
} from "@/components/auth/form-parts";
import { Input } from "@/components/ui/input";
import { resendEmailCode, verifyEmail } from "@/lib/api/auth";
import { readNext } from "@/lib/auth/oauth";
import { setSession } from "@/lib/auth/session";
import { continueToPlan } from "@/lib/auth/start-plan";

/** The API won't send another code sooner than this (VERIFY_CODE_RESEND_SECONDS). */
const RESEND_SECONDS = 60;

const makeSchema = (t: (key: "codeFormat") => string) =>
  z.object({ code: z.string().regex(/^\d{6}$/, t("codeFormat")) });

type FormValues = z.infer<ReturnType<typeof makeSchema>>;

const LINK =
  "rounded-sm text-sm font-medium text-ink underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-forest";

/**
 * Where a new account (or one that never confirmed its email) enters the
 * dashboard: the emailed code is what turns the account into a session.
 * `?email=` comes from /register or /login; `?plan=` is the plan picked at
 * sign-up, whose payment opens right after.
 */
function VerifyEmailForm() {
  const t = useTranslations("auth.verify");
  const tAuth = useTranslations("auth");
  const schema = useMemo(() => makeSchema((key) => tAuth(`validation.${key}`)), [tAuth]);
  const locale = useLocale();
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email");
  const requestedPlan = params.get("plan");
  const plan = requestedPlan === "trial" || requestedPlan === "pro" ? requestedPlan : null;
  const [serverError, setServerError] = useState<string | null>(null);
  // A code was just sent to get here, so resending starts on hold.
  const [resendIn, setResendIn] = useState(RESEND_SECONDS);
  const [resent, setResent] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { code: "" },
  });
  const errors = form.formState.errors;

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setTimeout(() => setResendIn((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendIn]);

  async function onSubmit(values: FormValues) {
    if (!email) return;
    setServerError(null);
    let auth;
    try {
      auth = await verifyEmail({ email, code: values.code });
      setSession(auth);
    } catch (err) {
      setServerError(tAuth(`errors.${authErrorKey(err, "verify")}`));
      return;
    }
    if (plan) await continueToPlan(auth, plan, locale, router);
    else router.push(readNext(auth.user.agencySlug));
  }

  async function resend() {
    if (!email) return;
    setServerError(null);
    setResent(false);
    try {
      await resendEmailCode({ email });
      setResent(true);
      setResendIn(RESEND_SECONDS);
    } catch (err) {
      setServerError(tAuth(`errors.${authErrorKey(err, "forgot")}`));
    }
  }

  if (!email) {
    return (
      <div className="flex flex-col items-start gap-6">
        <AuthHeading title={t("noEmailTitle")} text={t("noEmailText")} />
        <Link href="/login" className={LINK}>
          {t("login")}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <AuthHeading title={t("title")} text={t("lead", { email })} />
      <form className="flex flex-col gap-5" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <AuthField id="code" label={t("code")} error={errors.code?.message}>
          <Input
            id="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={7}
            placeholder="000000"
            autoFocus
            className={`${AUTH_INPUT} font-mono tracking-[0.4em]`}
            {...fieldA11y("code", { error: errors.code?.message })}
            {...form.register("code", {
              // Pasting "123 456" from the email still counts.
              setValueAs: (value: string) => value.replace(/\D/g, ""),
            })}
          />
        </AuthField>
        <AuthFormError message={serverError} />
        <AuthSubmit
          pending={form.formState.isSubmitting}
          label={t("submit")}
          pendingLabel={t("submitting")}
        />
      </form>
      <div className="flex flex-col items-center gap-2 text-center text-sm text-quiet">
        <p role="status">
          {resent ? t("resent") : t("noCode")}{" "}
          {resendIn > 0 ? (
            <span>{t("resendIn", { seconds: resendIn })}</span>
          ) : (
            <button type="button" onClick={resend} className={LINK}>
              {t("resend")}
            </button>
          )}
        </p>
        <Link href="/register" className={LINK}>
          {t("otherEmail")}
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailForm />
    </Suspense>
  );
}
