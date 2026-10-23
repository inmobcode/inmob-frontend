"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
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

const makeSchema = (t: (key: "passwordLength" | "confirmRequired" | "mismatch") => string) =>
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

/** Opened from the link in the recovery email, which carries `?token=`. */
function ResetPasswordForm() {
  const t = useTranslations("auth.reset");
  const tAuth = useTranslations("auth");
  const schema = useMemo(() => makeSchema((key) => tAuth(`validation.${key}`)), [tAuth]);
  const passwordHint = tAuth("passwordHint");
  const token = useSearchParams().get("token");
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirm: "" },
  });
  const errors = form.formState.errors;

  async function onSubmit(values: FormValues) {
    if (!token) return;
    setServerError(null);
    try {
      await resetPassword({ token, password: values.password });
      setDone(true);
    } catch (err) {
      setServerError(tAuth(`errors.${authErrorKey(err, "reset")}`));
    }
  }

  if (!token) {
    return (
      <div className="flex flex-col items-start gap-6">
        <AuthHeading
          title={t("brokenTitle")}
          text={t("brokenText")}
        />
        <Link href="/forgot-password" className={LINK}>
          {t("newLink")}
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
        <AuthHeading
          title={t("doneTitle")}
          text={t("doneText")}
        />
        <Link href="/login" className={LINK}>
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
