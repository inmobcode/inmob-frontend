"use client";

import { useQuery } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { AuthFormError, AuthHeading } from "@/components/auth/form-parts";
import { PlanPicker } from "@/components/billing/plan-picker";
import { listMyAgencies, switchAgency } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { confirmCheckout, getBillingStatus, startCheckout, type PlanChoice } from "@/lib/api/billing";
import { clearSession, getAccessToken, setSession, useSessionUser } from "@/lib/auth/session";
import { openCheckout, preparePaddle } from "@/lib/paddle";

const LINK_BUTTON =
  "inline-flex h-12 items-center justify-center rounded-lg border border-[#cfd5cc] bg-white px-5 text-sm font-medium text-ink outline-none transition-colors hover:border-forest/40 hover:bg-mist/50 focus-visible:ring-2 focus-visible:ring-forest";

/**
 * Each agency has its own subscription. Someone who isn't its owner can't pay
 * for it: they hear that, and can go to another agency of theirs.
 */
function NotOwner() {
  const t = useTranslations("billing.subscribe.notOwner");
  const router = useRouter();
  const user = useSessionUser();
  const [error, setError] = useState<string | null>(null);
  const { data: agencies } = useQuery({
    queryKey: ["my-agencies"],
    queryFn: () => listMyAgencies(getAccessToken() ?? ""),
  });
  const others = (agencies ?? []).filter((agency) => agency.slug !== user?.agencySlug);

  async function enter(agencyId: string) {
    setError(null);
    try {
      const auth = await switchAgency(getAccessToken() ?? "", agencyId);
      setSession(auth);
      router.push(`/${auth.user.agencySlug}/properties`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : null);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <AuthHeading title={t("title")} text={t("text")} />
      <AuthFormError message={error} />
      <div className="flex flex-col gap-3">
        {others.map((agency) => (
          <button key={agency.id} type="button" onClick={() => enter(agency.id)} className={LINK_BUTTON}>
            {t("switch")}: {agency.name}
          </button>
        ))}
        <button
          type="button"
          onClick={() => {
            clearSession();
            router.replace("/login");
          }}
          className={LINK_BUTTON}
        >
          {t("logout")}
        </button>
      </div>
    </div>
  );
}

/**
 * Where an account without a subscription lands (the API answers 402 to
 * everything else): pick a plan and pay. It is also where Paddle sends people
 * back: `?transaction=` confirms the payment, and a link of Paddle's own
 * (`?_ptxn=`, e.g. to update a card) opens its checkout.
 */
export default function SubscribePage() {
  const t = useTranslations("billing.subscribe");
  const locale = useLocale();
  const router = useRouter();
  const params = useSearchParams();
  const user = useSessionUser();
  const transactionId = params.get("transaction");
  const [pending, setPending] = useState<PlanChoice | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(Boolean(transactionId));
  const confirmed = useRef(false);
  const isOwner = user?.role === "OWNER";

  // Whether this agency can still take the free trial (it can't after using it, or if its card was used).
  const { data: billing } = useQuery({
    queryKey: ["billing", "subscribe"],
    queryFn: () => getBillingStatus(getAccessToken() ?? ""),
    enabled: isOwner,
  });

  useEffect(() => {
    if (!transactionId || !user || confirmed.current) return;
    confirmed.current = true;
    const token = getAccessToken();
    if (!token) return;
    confirmCheckout(token, transactionId)
      .then((status) => {
        if (status.status === "CANCELED") {
          // The card went through, but it had already started another agency's trial.
          setConfirming(false);
          setError(t("cardUsed"));
          router.replace("/subscribe");
          return;
        }
        router.replace(`/${user.agencySlug}/properties`);
      })
      .catch((err) => {
        setConfirming(false);
        setError(err instanceof ApiError && err.status !== 409 ? err.message : t("confirmFailed"));
      });
  }, [transactionId, user, router, t]);

  // Paddle.js has to be on the page for its own links (?_ptxn=) to open a checkout.
  useEffect(() => {
    if (billing?.paddle && params.has("_ptxn")) void preparePaddle(billing.paddle);
  }, [billing, params]);

  async function choose(plan: PlanChoice) {
    const token = getAccessToken();
    if (!token) {
      router.replace("/login?next=/subscribe");
      return;
    }
    setError(null);
    setPending(plan);
    try {
      const { checkout } = await startCheckout(token, plan);
      if (!checkout) {
        router.push(`/${user?.agencySlug}/properties`);
        return;
      }
      await openCheckout(checkout, {
        successUrl: `${window.location.origin}/subscribe?transaction=${checkout.transactionId}`,
        locale,
        closed: () => setPending(null),
      });
    } catch (err) {
      setPending(null);
      setError(err instanceof ApiError ? err.message : t("failed"));
    }
  }

  if (user && !isOwner) return <NotOwner />;

  if (confirming) {
    return (
      <div className="flex items-center gap-3 text-quiet" role="status">
        <LoaderCircle className="size-5 animate-spin" />
        {t("confirming")}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <AuthHeading title={t("title")} text={params.get("canceled") ? t("canceled") : t("lead")} />
      <AuthFormError message={error} />
      <PlanPicker
        onSelect={choose}
        selected={pending}
        disabled={pending !== null}
        trialUnavailable={billing ? !billing.trialAvailable : false}
      />
    </div>
  );
}
