"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
import { PasswordInput } from "@/components/auth/password-input";
import { Input } from "@/components/ui/input";
import { requestPasswordReset, resetPassword } from "@/lib/api/auth";

/** The API won't send another code sooner than this (RESET_CODE_RESEND_SECONDS). */
const RESEND_SECONDS = 60;

const makeSchema = (
  t: (key: "codeFormat" | "passwordLength" | "confirmRequired" | "mismatch") => string,
) =>
  z
    .object({
      code: z.string().regex(/^\d{6}$/, t("codeFormat")),
      password: z.string().min(8, t("passwordLength")),
      confirm: z.string().min(1, t("confirmRequired")),
    })
    .refine((values) => values.password === values.confirm, {
      path: ["confirm"],
      message: t("mismatch"),
    });

type FormValues = z.infer<ReturnType<typeof makeSchema>>;

const LINK =
  "rounded-sm text-sm font-medium text-ink underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-forest";

/** Second step of the recovery: `?email=` comes from /forgot-password or the email's button. */
function ResetPasswordForm() {
  const t = useTranslations("auth.reset");
  const tAuth = useTranslations("auth");
  const schema = useMemo(() => makeSchema((key) => tAuth(`validation.${key}`)), [tAuth]);
  const passwordHint = tAuth("passwordHint");
  const email = useSearchParams().get("email");
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  // A code was just sent to get here, so resending starts on hold.
  const [resendIn, setResendIn] = useState(RESEND_SECONDS);
  const [resent, setResent] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { code: "", password: "", confirm: "" },
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
    try {
      await resetPassword({ email, code: values.code, password: values.password });
      setDone(true);
    } catch (err) {
      setServerError(tAuth(`errors.${authErrorKey(err, "reset")}`));
    }
  }

  async function resend() {
    if (!email) return;
    setServerError(null);
    setResent(false);
    try {
      await requestPasswordReset({ email });
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
        <Link href="/forgot-password" className={LINK}>
          {t("requestCode")}
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="flex flex-col items-start gap-6" role="status">
        <span className="flex size-11 items-center justify-center rounded-lg bg-lime/25 text-forest">
          <Check className="size-5" />
        </span>
        <AuthHeading title={t("doneTitle")} text={t("doneText")} />
        <Link href="/login" className={LINK}>
          {t("login")}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <AuthHeading title={t("title")} text={t("lead", { email })} />
      <form
        className="flex flex-col gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        <AuthField id="code" label={t("code")} error={errors.code?.message}>
          <Input
            id="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="000000"
            className={`${AUTH_INPUT} font-mono tracking-[0.4em]`}
            {...fieldA11y("code", { error: errors.code?.message })}
            {...form.register("code", {
              // Pasting "123 456" from the email still counts.
              setValueAs: (value: string) => value.replace(/\D/g, ""),
            })}
          />
        </AuthField>
        <AuthField
          id="password"
          label={t("password")}
          hint={passwordHint}
          error={errors.password?.message}
        >
          <PasswordInput
            id="password"
            autoComplete="new-password"
            {...fieldA11y("password", {
              hint: passwordHint,
              error: errors.password?.message,
            })}
            {...form.register("password")}
          />
        </AuthField>
        <AuthField
          id="confirm"
          label={t("confirm")}
          error={errors.confirm?.message}
        >
          <PasswordInput
            id="confirm"
            autoComplete="new-password"
            {...fieldA11y("confirm", { error: errors.confirm?.message })}
            {...form.register("confirm")}
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
        <Link href="/forgot-password" className={LINK}>
          {t("otherEmail")}
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
