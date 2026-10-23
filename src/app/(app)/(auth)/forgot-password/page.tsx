"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MailCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useMemo, useState } from "react";
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
import { requestPasswordReset } from "@/lib/api/auth";

const makeSchema = (emailInvalid: string) => z.object({ email: z.string().email(emailInvalid) });

type FormValues = z.infer<ReturnType<typeof makeSchema>>;

const BACK_LINK =
  "rounded-sm text-sm font-medium text-ink underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-forest";

export default function ForgotPasswordPage() {
  const t = useTranslations("auth.forgot");
  const tAuth = useTranslations("auth");
  const schema = useMemo(() => makeSchema(tAuth("validation.emailInvalid")), [tAuth]);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });
  const errors = form.formState.errors;

  async function onSubmit(values: FormValues) {
    setServerError(null);
    try {
      await requestPasswordReset(values);
      setSentTo(values.email);
    } catch (err) {
      setServerError(tAuth(`errors.${authErrorKey(err, "forgot")}`));
    }
  }

  if (sentTo) {
    return (
      <div className="flex flex-col items-start gap-6" role="status">
        <span className="flex size-11 items-center justify-center rounded-lg bg-lime/25 text-forest">
          <MailCheck className="size-5" />
        </span>
        <AuthHeading
          title={t("sentTitle")}
          text={t("sentText", { email: sentTo })}
        />
        <Link href="/login" className={BACK_LINK}>
          {t("back")}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <AuthHeading
        title={t("title")}
        text={t("lead")}
      />
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
        <AuthFormError message={serverError} />
        <AuthSubmit
          pending={form.formState.isSubmitting}
          label={t("submit")}
          pendingLabel={t("submitting")}
        />
      </form>
      <p className="text-center text-sm text-quiet">
        {t("remembered")}{" "}
        <Link href="/login" className={BACK_LINK}>
          {t("back")}
        </Link>
      </p>
    </div>
  );
}
