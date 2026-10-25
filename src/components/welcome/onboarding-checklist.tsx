"use client";

import { useQuery } from "@tanstack/react-query";
import { Check, Minus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";

import { getAgency } from "@/lib/api/agency";
import { listClients } from "@/lib/api/clients";
import { ApiError } from "@/lib/api/client";
import { listProperties } from "@/lib/api/properties";
import { listTeam } from "@/lib/api/team";
import { getAccessToken, useSessionUser } from "@/lib/auth/session";
import { cn } from "@/lib/utils";

type StepKey = "account" | "property" | "site" | "team" | "client";

const storageKey = (slug: string) => `tivvu:checklist:${slug}`;

const doneKey = (slug: string) => `tivvu:checklist:done:${slug}`;

const skippedKey = (slug: string) => `tivvu:checklist:skipped:${slug}`;

/** Steps that can be skipped: the ones a solo agency may never need. */
const SKIPPABLE: StepKey[] = ["team"];

const HIDE_EVENT = "onboarding-checklist-changed";

function subscribe(onChange: () => void) {
  window.addEventListener(HIDE_EVENT, onChange);
  return () => window.removeEventListener(HIDE_EVENT, onChange);
}

/** Dismissed state from localStorage; the server snapshot is "hidden" so nothing flashes before hydration. */
function useChecklistHidden(slug: string) {
  return useSyncExternalStore(
    subscribe,
    () => {
      try {
        return localStorage.getItem(storageKey(slug)) === "hidden";
      } catch {
        return false;
      }
    },
    () => true,
  );
}

/** A list of steps kept in localStorage as a comma list ("" when none or storage is blocked). */
function useStoredSteps(key: string): StepKey[] {
  const raw = useSyncExternalStore(
    subscribe,
    () => {
      try {
        return localStorage.getItem(key) ?? "";
      } catch {
        return "";
      }
    },
    () => "",
  );
  return raw ? (raw.split(",") as StepKey[]) : [];
}

function authed<T>(call: (token: string) => Promise<T>) {
  const token = getAccessToken();
  if (!token) throw new ApiError("No autenticado", 401);
  return call(token);
}

/**
 * The "getting started" guide at the top of Propiedades. Each step completes
 * from real data (nothing to tick by hand), the first one starts done so the
 * bar never opens at zero, and it hides itself once everything is finished or
 * when the owner dismisses it. A step stays done once reached: deleting the
 * property or client later doesn't take the progress back. OWNER/ADMIN only: they're the ones who can
 * reach every step (team and site editor are theirs).
 */
export function OnboardingChecklist() {
  const t = useTranslations("welcome.checklist");
  const { agencySlug } = useParams<{ agencySlug: string }>();
  const user = useSessionUser();
  const allowed = user?.role === "OWNER" || user?.role === "ADMIN";
  const hidden = useChecklistHidden(agencySlug);

  const enabled = allowed && !hidden;
  const properties = useQuery({ queryKey: ["properties"], queryFn: () => authed(listProperties), enabled });
  const agency = useQuery({ queryKey: ["agency"], queryFn: () => authed(getAgency), enabled, staleTime: 5 * 60_000 });
  const team = useQuery({ queryKey: ["team"], queryFn: () => authed(listTeam), enabled });
  const clients = useQuery({ queryKey: ["clients"], queryFn: () => authed(listClients), enabled });

  const ready = enabled && !!properties.data && !!agency.data && !!team.data && !!clients.data;
  const achieved = useStoredSteps(doneKey(agencySlug));
  const skipped = useStoredSteps(skippedKey(agencySlug));
  const live: Record<StepKey, boolean> = {
    account: true,
    property: properties.data?.some((property) => property.status === "PUBLISHED") ?? false,
    site: Object.keys(agency.data?.site ?? {}).length > 0,
    team: (team.data?.length ?? 0) > 1,
    client: (clients.data?.length ?? 0) > 0,
  };
  const liveSignature = (Object.keys(live) as StepKey[]).filter((key) => live[key]).join(",");
  const achievedSignature = achieved.join(",");

  // Remember what the data shows as done, so it stays done if that data is removed later.
  useEffect(() => {
    if (!ready) return;
    const reached = liveSignature.split(",").filter(Boolean);
    const known = achievedSignature.split(",").filter(Boolean);
    if (reached.every((key) => known.includes(key))) return;
    try {
      localStorage.setItem(doneKey(agencySlug), [...new Set([...known, ...reached])].join(","));
    } catch {
      // Storage blocked: progress just follows the live data.
    }
    window.dispatchEvent(new Event(HIDE_EVENT));
  }, [ready, liveSignature, achievedSignature, agencySlug]);

  // Wait for all four so the bar doesn't jump from 1/5 to 4/5 after the first paint.
  if (!ready || !properties.data) return null;

  const done = Object.fromEntries(
    (Object.keys(live) as StepKey[]).map((key) => [key, live[key] || achieved.includes(key) || skipped.includes(key)]),
  ) as Record<StepKey, boolean>;
  const steps: { key: StepKey; href?: string }[] = [
    { key: "account" },
    { key: "property", href: properties.data.length === 0 ? `/${agencySlug}/properties?new=1` : undefined },
    { key: "site", href: `/${agencySlug}/portal` },
    { key: "team", href: `/${agencySlug}/team` },
    { key: "client", href: `/${agencySlug}/clients` },
  ];
  const doneCount = steps.filter((step) => done[step.key]).length;
  if (doneCount === steps.length) return null;
  // The first step still pending is the one to push; a published-less property step has no link while the list below already shows the drafts.
  const current = steps.find((step) => !done[step.key])?.key;

  function dismiss() {
    try {
      localStorage.setItem(storageKey(agencySlug), "hidden");
    } catch {
      // Storage blocked: it just comes back next visit.
    }
    window.dispatchEvent(new Event(HIDE_EVENT));
  }

  function skip(key: StepKey) {
    try {
      localStorage.setItem(skippedKey(agencySlug), [...new Set([...skipped, key])].join(","));
    } catch {
      // Storage blocked: the step just stays pending.
    }
    window.dispatchEvent(new Event(HIDE_EVENT));
  }

  return (
    <section
      aria-labelledby="onboarding-title"
      className="flex flex-col gap-5 rounded-3xl bg-card p-6 ring-1 ring-foreground/5"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 id="onboarding-title" className="font-display text-2xl leading-none">
            {t("title")}
          </h2>
          <p className="text-sm text-muted-foreground">{t("progress", { done: doneCount, total: steps.length })}</p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label={t("hide")}
          title={t("hide")}
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="size-4" aria-hidden />
        </button>
      </div>

      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={steps.length}
        aria-valuenow={doneCount}
        aria-label={t("title")}
        className="h-1.5 overflow-hidden rounded-full bg-muted"
      >
        <div
          className="h-full rounded-full bg-primary motion-safe:transition-[width] motion-safe:duration-500"
          style={{ width: `${(doneCount / steps.length) * 100}%` }}
        />
      </div>

      <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {steps.map(({ key, href }) => {
          const complete = done[key];
          // Skipped, not truly done: shown muted with a dash instead of a check.
          const wasSkipped = complete && skipped.includes(key) && !live[key] && !achieved.includes(key);
          const canSkip = SKIPPABLE.includes(key) && !complete;
          const body = (
            <>
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full text-xs",
                  wasSkipped
                    ? "bg-muted text-muted-foreground"
                    : complete
                      ? "bg-primary text-primary-foreground"
                      : "ring-1 ring-foreground/20",
                )}
              >
                {wasSkipped ? <Minus className="size-3.5" aria-hidden /> : complete && <Check className="size-3.5" aria-hidden />}
              </span>
              <span className="flex flex-col gap-0.5">
                <span className={cn("text-sm font-medium", complete && "text-muted-foreground line-through")}>
                  {t(`items.${key}.title`)}
                </span>
                {!complete && <span className="text-xs text-muted-foreground">{t(`items.${key}.text`)}</span>}
                {wasSkipped && <span className="text-xs text-muted-foreground">{t("skipped")}</span>}
              </span>
            </>
          );
          const base = cn("flex items-start gap-3 rounded-2xl p-3", canSkip && "pb-9");
          return (
            <li key={key} className="relative">
              {href && !complete ? (
                <Link
                  href={href}
                  className={cn(
                    base,
                    "outline-none motion-safe:transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring",
                    key === current && "bg-muted/60",
                  )}
                >
                  {body}
                </Link>
              ) : (
                <div className={cn(base, key === current && "bg-muted/60")}>{body}</div>
              )}
              {canSkip && (
                <button
                  type="button"
                  onClick={() => skip(key)}
                  aria-label={`${t("skip")}: ${t(`items.${key}.title`)}`}
                  className="absolute right-3 bottom-2.5 rounded-sm text-xs text-muted-foreground underline underline-offset-4 outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {t("skip")}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
