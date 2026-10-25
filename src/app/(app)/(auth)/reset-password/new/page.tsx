"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  AuthField,
  AuthFormError,
  AuthHeading,
  AuthSubmit,
  authErrorKey,
  fieldA11y,
} from "@/components/auth/form-parts";
import { PasswordInput } from "@/components/auth/password-input";
import { resetPassword } from "@/lib/api/auth";
import { clearResetCode, readResetCode } from "@/lib/auth/reset-flow";

const makeSchema = (
  t: (key: "passwordLength" | "confirmRequired" | "mismatch") => string,
) =>
  z
    .object({
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

/** Second step of the recovery: the code was typed in /reset-password. */
function NewPasswordForm() {
  const t = useTranslations("auth.reset");
  const tAuth = useTranslations("auth");
  const schema = useMemo(() => makeSchema((key) => tAuth(`validation.${key}`)), [tAuth]);
  const passwordHint = tAuth("passwordHint");
  const router = useRouter();
  const email = useSearchParams().get("email");
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirm: "" },
  });
  const errors = form.formState.errors;
  const backToCode = email
    ? `/reset-password?${new URLSearchParams({ email })}`
    : "/forgot-password";

  // Without a code from step 1 (reload in another tab, blocked storage) there is nothing to send.
  useEffect(() => {
    if (email && !readResetCode(email) && !done) router.replace(backToCode);
  }, [email, done, router, backToCode]);

  async function onSubmit(values: FormValues) {
    if (!email) return;
    const code = readResetCode(email);
    if (!code) {
      router.replace(backToCode);
      return;
    }
    setServerError(null);
    try {
      await resetPassword({ email, code, password: values.password });
      clearResetCode();
      setDone(true);
    } catch (err) {
      if (authErrorKey(err, "reset") === "codeInvalid") {
        // Wrong or expired code: the API only checks it now, so step 1 is where it gets fixed.
        clearResetCode();
        router.replace(`${backToCode}&invalid=1`);
        return;
      }
      setServerError(tAuth(`errors.${authErrorKey(err, "reset")}`));
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
        <Link
          href="/login"
          className="-ml-4 rounded-lg px-4 py-2.5 text-base font-medium text-ink outline-none transition-colors hover:bg-ink/5 focus-visible:ring-2 focus-visible:ring-forest"
        >
          {t("login")}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <AuthHeading title={t("title")} />
      <form
        className="flex flex-col gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
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
      <Link href={backToCode} className={`${LINK} self-center`}>
        {t("back")}
      </Link>
    </div>
  );
}

export default function NewPasswordPage() {
  return (
    <Suspense>
      <NewPasswordForm />
    </Suspense>
  );
}
