"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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
import { enterpriseContactHref, PlanPicker } from "@/components/billing/plan-picker";
import { Input } from "@/components/ui/input";
import { localePath, type Locale } from "@/i18n/config";
import { registerAgency } from "@/lib/api/auth";
import { startCheckout, type PlanChoice } from "@/lib/api/billing";
import { openCheckout } from "@/lib/paddle";
import { setSession } from "@/lib/auth/session";

const LEGAL_LINK =
  "rounded-sm text-ink underline underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-forest";

const makeSchema = (t: (key: "agencyNameRequired" | "nameRequired" | "emailInvalid" | "passwordLength") => string) =>
  z.object({
    agencyName: z.string().min(2, t("agencyNameRequired")),
    name: z.string().min(2, t("nameRequired")),
    email: z.string().email(t("emailInvalid")),
    password: z.string().min(8, t("passwordLength")),
  });

type FormValues = z.infer<ReturnType<typeof makeSchema>>;

const TEXT_FIELDS: {
  id: Exclude<keyof FormValues, "password">;
  autoComplete: string;
  type?: string;
}[] = [
  { id: "agencyName", autoComplete: "organization" },
  { id: "name", autoComplete: "name" },
  { id: "email", autoComplete: "email", type: "email" },
];

export default function RegisterPage() {
  const t = useTranslations("auth.register");
  const tBilling = useTranslations("billing");
  const tAuth = useTranslations("auth");
  const locale = useLocale();
  const schema = useMemo(() => makeSchema((key) => tAuth(`validation.${key}`)), [tAuth]);
  const passwordHint = tAuth("passwordHint");
  const router = useRouter();
  // Everyone picks a plan before the form: the landing's buttons arrive with ?plan= already chosen.
  const requested = useSearchParams().get("plan");
  const [plan, setPlan] = useState<PlanChoice | null>(requested === "trial" || requested === "pro" ? requested : null);
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { agencyName: "", name: "", email: "", password: "" },
  });
  const errors = form.formState.errors;

  // Enterprise is a conversation, not a sign-up.
  useEffect(() => {
    if (requested === "enterprise") router.replace(enterpriseContactHref(locale as Locale));
  }, [requested, router, locale]);

  async function onSubmit(values: FormValues) {
    if (!plan) return;
    setServerError(null);
    let auth;
    try {
      auth = await registerAgency({ ...values, plan });
      setSession(auth);
    } catch (err) {
      setServerError(tAuth(`errors.${authErrorKey(err, "register")}`));
      return;
    }
    // The account exists now. If the payment can't open or is closed unpaid, /subscribe is where to try again.
    try {
      const { checkout } = await startCheckout(auth.accessToken, plan);
      if (!checkout) {
        router.push(`/${auth.user.agencySlug}/properties`);
        return;
      }
      await openCheckout(checkout, {
        successUrl: `${window.location.origin}/subscribe?transaction=${checkout.transactionId}`,
        locale,
        closed: () => router.push("/subscribe"),
      });
    } catch {
      router.push("/subscribe");
    }
  }

  if (!plan) {
    return (
      <div className="flex flex-col gap-8">
        <AuthHeading title={tBilling("register.pickTitle")} text={tBilling("register.pickLead")} />
        <PlanPicker onSelect={setPlan} />
        <p className="text-center text-sm text-quiet">
          {t("haveAccount")}{" "}
          <Link
            href="/login"
            className="rounded-sm font-medium text-ink underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-forest"
          >
            {t("login")}
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <AuthHeading
        title={t("title")}
        text={t("lead")}
      />

      <div className="flex items-center justify-between gap-3 rounded-lg bg-mist/70 px-4 py-3 text-sm">
        <span>
          {tBilling("register.chosen")} <strong className="font-semibold">{tBilling(`plans.${plan}.name`)}</strong>
        </span>
        <button
          type="button"
          onClick={() => setPlan(null)}
          className="rounded-sm font-medium text-ink underline underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-forest"
        >
          {tBilling("register.change")}
        </button>
      </div>

      <SocialButtons signUp />

      <AuthDivider>{tAuth("orEmail")}</AuthDivider>

      <form
        className="flex flex-col gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        {TEXT_FIELDS.map((field) => (
          <AuthField
            key={field.id}
            id={field.id}
            label={t(`fields.${field.id}`)}
            error={errors[field.id]?.message}
          >
            <Input
              id={field.id}
              type={field.type ?? "text"}
              autoComplete={field.autoComplete}
              className={AUTH_INPUT}
              {...fieldA11y(field.id, { error: errors[field.id]?.message })}
              {...form.register(field.id)}
            />
          </AuthField>
        ))}
        <AuthField
          id="password"
          label={tAuth("password")}
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
        <AuthFormError message={serverError} />
        <AuthSubmit
          pending={form.formState.isSubmitting}
          label={tBilling("register.submit")}
          pendingLabel={t("submitting")}
        />
        <p className="text-center text-xs text-pretty text-quiet">
          {t.rich("legal", {
            terms: (chunks) => (
              <Link href={localePath(locale, "/terms")} className={LEGAL_LINK}>
                {chunks}
              </Link>
            ),
            privacy: (chunks) => (
              <Link href={localePath(locale, "/privacy")} className={LEGAL_LINK}>
                {chunks}
              </Link>
            ),
          })}
        </p>
      </form>

      <p className="text-center text-sm text-quiet">
        {t("haveAccount")}{" "}
        <Link
          href="/login"
          className="rounded-sm font-medium text-ink underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-forest"
        >
          {t("login")}
        </Link>
      </p>
    </div>
  );
}
