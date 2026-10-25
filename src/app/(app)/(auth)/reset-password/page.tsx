"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
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
import { requestPasswordReset, verifyResetCode } from "@/lib/api/auth";
import { clearResetCode, saveResetCode } from "@/lib/auth/reset-flow";

/** The API won't send another code sooner than this (RESET_CODE_RESEND_SECONDS). */
const RESEND_SECONDS = 60;

const makeSchema = (t: (key: "codeFormat") => string) =>
  z.object({ code: z.string().regex(/^\d{6}$/, t("codeFormat")) });

type FormValues = z.infer<ReturnType<typeof makeSchema>>;

const LINK =
  "rounded-sm text-sm font-medium text-ink underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-forest";

/** First step of the recovery: `?email=` comes from /forgot-password or the email's button. */
function ResetCodeForm() {
  const t = useTranslations("auth.reset");
  const tAuth = useTranslations("auth");
  const schema = useMemo(() => makeSchema((key) => tAuth(`validation.${key}`)), [tAuth]);
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email");
  // Step 2 sends the user back here with ?invalid=1 when the API refused the code.
  const [serverError, setServerError] = useState<string | null>(
    params.get("invalid") ? tAuth("errors.codeInvalid") : null,
  );
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
    try {
      await verifyResetCode({ email, code: values.code });
      saveResetCode(email, values.code);
      router.push(`/reset-password/new?${new URLSearchParams({ email })}`);
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
      clearResetCode();
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

  return (
    <div className="flex flex-col gap-8">
      <AuthHeading title={t("codeTitle")} text={t("lead", { email })} />
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
        <AuthFormError message={serverError} />
        <AuthSubmit
          pending={form.formState.isSubmitting}
          label={t("next")}
          pendingLabel={t("verifying")}
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
      <ResetCodeForm />
    </Suspense>
  );
}
