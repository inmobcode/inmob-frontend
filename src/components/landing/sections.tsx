"use client";

import { Check, LoaderCircle, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import {
  BookingFragment,
  CalendarFragment,
  ClientsFragment,
  OfferFragment,
  OwnerStatementFragment,
  PaymentsFragment,
  SaleBookingFragment,
  TasksFragment,
  TimelineFragment,
} from "@/components/landing/fragments";
import { SECTION, WRAP } from "@/components/landing/layout";
import { faqIn, plansIn, type Plan } from "@/components/landing/plans-faq-data";
import type { LooseTranslator } from "@/i18n/loose";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestDemo } from "@/lib/api/demo";
import { ApiError } from "@/lib/api/client";
import { gsap, useGSAP } from "@/lib/gsap";
import "@/lib/gsap-scroll-trigger";
import { ease, media } from "@/lib/motion";
import { cn } from "@/lib/utils";

const CTA =
  "inline-flex h-12 items-center justify-center rounded-lg bg-lime px-6 text-base font-semibold text-forest-deep outline-none transition-[filter] hover:brightness-95 focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 disabled:opacity-60";

/**
 * Section headings read as one sentence in two weights: the claim in ink, the
 * explanation right after it in a quieter tone.
 */
/** Color each word of a heading's second half is painted to, and from. */
const PAINT = {
  ink: { to: "#2f7a55", from: "rgba(47, 122, 85, 0.07)" },
  paper: { to: "#b6f077", from: "rgba(182, 240, 119, 0.07)" },
} as const;

export function Heading({
  claim,
  rest,
  className,
  tone = "ink",
  id,
}: {
  claim: string;
  rest?: string;
  className?: string;
  tone?: "ink" | "paper";
  id?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  // The green half is painted in word by word as the heading scrolls into
  // view, tied to the scroll position (scrubbed, so it also un-paints on the
  // way back). Without motion the words just sit in their final color.
  useGSAP(
    () => {
      if (!rest) return;
      const mm = gsap.matchMedia();
      mm.add(media.allowMotion, () => {
        const words = gsap.utils.toArray<HTMLElement>("[data-word]");
        gsap.fromTo(
          words,
          { color: PAINT[tone].from },
          {
            color: PAINT[tone].to,
            ease: "none",
            stagger: 0.35,
            duration: 1,
            scrollTrigger: {
              trigger: ref.current,
              start: "top 88%",
              end: "top 38%",
              scrub: 0.9,
            },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [rest, tone] },
  );

  return (
    <h2
      ref={ref}
      id={id}
      className={cn(
        "font-logo text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.04] font-semibold tracking-[-0.03em] text-balance",
        className,
      )}
    >
      {claim}
      {rest && (
        <span style={{ color: PAINT[tone].to }}>
          {rest.split(" ").map((word, index) => (
            <span key={index}>
              {" "}
              <span data-word>{word}</span>
            </span>
          ))}
        </span>
      )}
    </h2>
  );
}

/* ── Hoy y con Tivvu ────────────────────────────────────── */

const PROBLEMS = ["inquiries", "followUp", "offers", "calendar", "payments", "owners"] as const;

export function Problem() {
  const t = useTranslations("landing.problem");
  return (
    <section aria-labelledby="problema" className="border-b border-line">
      <div className={cn(WRAP, SECTION, "flex flex-col gap-12 md:gap-14")}>
        <Heading
          id="problema"
          claim={t("claim")}
          rest={t("rest")}
          className="max-w-3xl"
        />
        {/* Two columns read across: the problem in grey, its answer marked in forest green. */}
        <div>
          <div
            aria-hidden
            className="hidden text-sm font-semibold sm:grid sm:grid-cols-2"
          >
            <span className="pb-3 text-quiet">{t("problem")}</span>
            <span className="border-b-2 border-forest pb-3 pl-8 text-forest">
              {t("solution")}
            </span>
          </div>
          <ul>
            {PROBLEMS.map((item) => (
              <li key={item} className="grid sm:grid-cols-2">
                <div className="flex flex-col gap-2 border-t border-line pt-6 pb-4 sm:py-7 sm:pr-8">
                  <span className="text-sm font-semibold text-quiet sm:hidden">
                    {t("problem")}
                  </span>
                  <p className="text-lg leading-snug text-pretty text-quiet">
                    {t(`items.${item}.today`)}
                  </p>
                </div>
                <div className="flex flex-col gap-2 border-t border-forest/20 pt-2 pb-6 sm:py-7 sm:pl-8">
                  <span className="text-sm font-semibold text-forest sm:hidden">
                    {t("solution")}
                  </span>
                  <p className="flex gap-3 text-lg leading-snug text-pretty">
                    <span
                      aria-hidden
                      className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-forest text-lime"
                    >
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                    {t(`items.${item}.tivvu`)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ── Cómo funciona ──────────────────────────────────────── */

type Mode = "sale" | "rent";

const FLOWS: Record<Mode, { key: string; shot: React.ReactNode }[]> = {
  sale: [
    { key: "inquiry", shot: <ClientsFragment /> },
    { key: "followUp", shot: <TimelineFragment /> },
    { key: "offer", shot: <OfferFragment /> },
    { key: "tasks", shot: <TasksFragment /> },
    { key: "booking", shot: <SaleBookingFragment /> },
    { key: "payments", shot: <PaymentsFragment variant="sale" /> },
  ],
  rent: [
    { key: "inquiry", shot: <ClientsFragment /> },
    { key: "availability", shot: <CalendarFragment /> },
    { key: "offer", shot: <OfferFragment /> },
    { key: "tasks", shot: <TasksFragment /> },
    { key: "booking", shot: <BookingFragment className="mx-auto max-w-md" /> },
    { key: "payments", shot: <PaymentsFragment variant="rent" /> },
  ],
};

const MODES: Mode[] = ["sale", "rent"];

export function Flow() {
  const t = useTranslations("landing.flow");
  const [mode, setMode] = useState<Mode>("sale");
  const [step, setStep] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const shotRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  // Where the person asked to go, and the panel height before the swap.
  const target = useRef({ mode, step });
  const pending = useRef<{ height: number; modeChanged: boolean } | null>(null);
  const steps = FLOWS[mode];
  const current = steps[step];

  // The underline slides under the active operation.
  useLayoutEffect(() => {
    function place() {
      const tab = tabsRef.current?.querySelector<HTMLElement>(
        '[aria-selected="true"]',
      );
      if (tab) setIndicator({ left: tab.offsetLeft, width: tab.offsetWidth });
    }
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [mode]);

  /**
   * Changing step or operation is a short sequence: the screen fades out, the
   * content swaps, then the panel eases to its new height while the new screen
   * fades in. Changing operation also swaps the step list, so it fades too.
   */
  function go(nextMode: Mode, nextStep: number) {
    target.current = { mode: nextMode, step: nextStep };
    if (nextMode === mode && nextStep === step) return;
    const modeChanged = nextMode !== mode;

    // Without motion, or in a background tab where animations don't advance, swap right away.
    if (
      window.matchMedia(media.reduceMotion).matches ||
      document.visibilityState === "hidden"
    ) {
      setMode(nextMode);
      setStep(nextStep);
      return;
    }

    const leaving = modeChanged
      ? [shotRef.current, listRef.current]
      : [shotRef.current];
    gsap.killTweensOf([shotRef.current, listRef.current, panelRef.current]);
    gsap.to(leaving, {
      opacity: 0,
      y: -6,
      duration: 0.16,
      ease: ease.in,
      onComplete: () => {
        pending.current = {
          height: panelRef.current?.offsetHeight ?? 0,
          modeChanged,
        };
        setMode(target.current.mode);
        setStep(target.current.step);
      },
    });
  }

  useLayoutEffect(() => {
    const swap = pending.current;
    if (!swap) return;
    pending.current = null;
    const panel = panelRef.current;
    if (!panel) return;

    const height = panel.offsetHeight;
    gsap.fromTo(
      panel,
      { height: swap.height },
      { height, duration: 0.45, ease: ease.inOut, clearProps: "height" },
    );
    gsap.fromTo(
      shotRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.45, delay: 0.08, ease: ease.out },
    );
    if (swap.modeChanged) {
      gsap.fromTo(
        listRef.current,
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.4, ease: ease.out },
      );
    }
  }, [mode, step]);

  return (
    <section
      id="flujo"
      aria-labelledby="flujo-titulo"
      className="scroll-mt-16 border-b border-line"
    >
      <div className={cn(WRAP, SECTION, "flex flex-col gap-12")}>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Heading
            id="flujo-titulo"
            claim={t("claim")}
            rest={t("rest")}
            className="max-w-3xl"
          />
          <div
            ref={tabsRef}
            role="tablist"
            aria-label={t("operation")}
            className="relative flex shrink-0 gap-6 border-b border-line"
          >
            {MODES.map((value) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={mode === value}
                onClick={() => go(value, 0)}
                className={cn(
                  "h-11 text-base font-medium outline-none transition-colors duration-300 focus-visible:text-ink focus-visible:underline",
                  mode === value ? "text-ink" : "text-quiet hover:text-ink",
                )}
              >
                {t(`modes.${value}`)}
              </button>
            ))}
            <span
              aria-hidden
              className="absolute -bottom-px h-0.5 bg-forest transition-[left,width] duration-400 ease-out motion-reduce:transition-none"
              style={{ left: indicator.left, width: indicator.width }}
            />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          <ol ref={listRef} className="lg:col-span-4">
            {steps.map((item, index) => {
              const active = index === step;
              return (
                <li
                  key={item.key}
                  className="border-t border-line last:border-b"
                >
                  <button
                    type="button"
                    aria-current={active ? "step" : undefined}
                    onClick={() => go(mode, index)}
                    className="group flex w-full gap-4 py-4 text-left outline-none focus-visible:bg-mist"
                  >
                    <span
                      className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded-md text-sm font-medium tabular-nums transition-colors duration-300",
                        active
                          ? "bg-forest text-paper"
                          : "bg-mist text-quiet group-hover:text-ink",
                      )}
                    >
                      {index + 1}
                    </span>
                    <span className="flex flex-col pt-0.5">
                      <span
                        className={cn(
                          "text-lg leading-tight font-semibold transition-colors duration-300",
                          !active && "text-quiet group-hover:text-ink",
                        )}
                      >
                        {t(`${mode}.${item.key}.title` as never)}
                      </span>
                      {/* Every step keeps its text; the open one unfolds it, the rest fold it away. */}
                      <span
                        aria-hidden={!active}
                        className={cn(
                          "grid transition-[grid-template-rows,opacity,margin] duration-400 ease-out motion-reduce:transition-none",
                          active
                            ? "mt-1.5 grid-rows-[1fr] opacity-100"
                            : "mt-0 grid-rows-[0fr] opacity-0",
                        )}
                      >
                        <span className="overflow-hidden text-pretty text-quiet">
                          {t(`${mode}.${item.key}.text` as never)}
                        </span>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div
            ref={panelRef}
            className="flex min-w-0 items-center overflow-hidden rounded-2xl bg-mist p-4 sm:p-8 lg:col-span-8 lg:p-12"
          >
            <div ref={shotRef} className="w-full">
              {current.shot}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Equipo ─────────────────────────────────────────────── */

const ROLES = ["owner", "admin", "agent"] as const;

export function TeamSection() {
  const t = useTranslations("landing.team");
  return (
    <section
      id="equipo"
      aria-labelledby="equipo-titulo"
      className="scroll-mt-16 border-b border-line"
    >
      <div
        className={cn(WRAP, SECTION, "grid gap-12 lg:grid-cols-12 lg:gap-8")}
      >
        <Heading
          id="equipo-titulo"
          claim={t("claim")}
          rest={t("rest")}
          className="lg:col-span-5"
        />
        <dl className="lg:col-span-6 lg:col-start-7">
          {ROLES.map((role) => (
            <div
              key={role}
              className="grid gap-1 border-t border-line py-6 last:border-b sm:grid-cols-[11rem_1fr] sm:gap-8"
            >
              <dt className="font-logo text-xl font-semibold">{t(`roles.${role}.name`)}</dt>
              <dd className="text-lg leading-snug text-pretty text-quiet">
                {t(`roles.${role}.text`)}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ── Sitio y portal del propietario ─────────────────────── */

export function Portals() {
  const t = useTranslations("landing.portals");
  return (
    <section
      id="portales"
      aria-labelledby="portales-titulo"
      className="scroll-mt-16 border-b border-line"
    >
      <div className={cn(WRAP, "pt-20 md:pt-28")}>
        <Heading
          id="portales-titulo"
          claim={t("claim")}
          rest={t("rest")}
          className="max-w-4xl"
        />
      </div>
      <div className={cn(WRAP, "mt-12 md:mt-16")}>
        {/* The 1px gap over the line color draws the divider between the two portals. */}
        <div className="grid gap-px bg-line lg:grid-cols-2">
          {[
            {
              title: t("owner.title"),
              text: t("owner.text"),
              shot: <OwnerStatementFragment />,
            },
            {
              title: t("booking.title"),
              text: t("booking.text"),
              shot: <BookingFragment className="mx-auto max-w-md" />,
            },
          ].map((item) => (
            <article
              key={item.title}
              className="flex flex-col gap-8 bg-paper py-12 lg:py-16 lg:first:pr-12 lg:last:pl-12"
            >
              <div className="flex max-w-xl flex-col gap-3">
                <h3 className="font-logo text-2xl font-semibold tracking-tight">
                  {item.title}
                </h3>
                <p className="text-lg leading-snug text-pretty text-quiet">
                  {item.text}
                </p>
              </div>
              <div className="flex flex-1 items-center rounded-2xl bg-mist p-4 sm:p-8 [&>*]:w-full">
                {item.shot}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Migración ──────────────────────────────────────────── */

const MIGRATION = ["send", "load", "start"] as const;

export function Migration() {
  const t = useTranslations("landing.migration");
  return (
    <section
      id="migracion"
      aria-labelledby="migracion-titulo"
      className="scroll-mt-16 border-b border-line bg-mist"
    >
      <div className={cn(WRAP, SECTION, "flex flex-col gap-12 md:gap-14")}>
        <Heading
          id="migracion-titulo"
          claim={t("claim")}
          rest={t("rest")}
          className="max-w-4xl"
        />
        <ol className="grid gap-x-8 md:grid-cols-3 lg:gap-x-10">
          {MIGRATION.map((item, index) => (
            <li
              key={item}
              className="flex flex-col gap-3 border-t border-ink/15 py-6"
            >
              <span
                aria-hidden
                className="font-logo text-5xl leading-none font-semibold text-forest tabular-nums"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="mt-3 font-logo text-xl leading-tight font-semibold">
                <span className="sr-only">{t("step", { number: index + 1 })} </span>
                {t(`steps.${item}.title`)}
              </p>
              <p className="text-lg leading-snug text-pretty text-quiet">
                {t(`steps.${item}.text`)}
              </p>
            </li>
          ))}
        </ol>
        <div className="flex flex-col gap-4 border-t border-ink/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-lg leading-snug text-pretty">
            {t("otherSystem")}
          </p>
          <a href="#demo" className={CTA}>
            {t("cta")}
          </a>
        </div>
      </div>
    </section>
  );
}

/* ── Planes y preguntas ─────────────────────────────────── */

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <li
      className={cn(
        "flex flex-col gap-6 rounded-xl border p-8",
        plan.highlight
          ? "border-forest bg-forest text-paper"
          : "border-line bg-paper text-ink",
      )}
    >
      <div className="flex flex-col gap-2">
        <p className="font-logo text-xl font-semibold">{plan.name}</p>
        <p
          className={cn(
            "text-sm text-pretty",
            plan.highlight ? "text-paper/70" : "text-quiet",
          )}
        >
          {plan.tagline}
        </p>
      </div>
      <p className="flex items-baseline gap-1.5">
        <span className="font-logo text-4xl font-semibold tracking-tight">
          {plan.price}
        </span>
        {plan.period && (
          <span className={plan.highlight ? "text-paper/60" : "text-quiet"}>
            {plan.period}
          </span>
        )}
      </p>
      <ul className="flex flex-col gap-3">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-3 text-sm leading-snug"
          >
            <Check
              aria-hidden
              className={cn(
                "mt-0.5 size-4 shrink-0",
                plan.highlight ? "text-lime" : "text-forest",
              )}
            />
            {feature}
          </li>
        ))}
      </ul>
      <a
        href={plan.href}
        className={cn(
          "mt-auto inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-semibold outline-none transition-[filter] hover:brightness-95 focus-visible:ring-2 focus-visible:ring-offset-2",
          plan.highlight
            ? "bg-lime text-forest-deep focus-visible:ring-paper focus-visible:ring-offset-forest"
            : "bg-forest text-paper focus-visible:ring-forest",
        )}
      >
        {plan.cta}
      </a>
    </li>
  );
}

/** One question. The answer unfolds smoothly instead of popping open like a native `<details>`. */
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <>
      <h4>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((current) => !current)}
          className="flex w-full cursor-pointer items-start gap-4 py-5 text-left text-lg font-medium outline-none focus-visible:bg-mist"
        >
          <span className="flex-1">{question}</span>
          <Plus
            aria-hidden
            className={cn(
              "mt-1 size-5 shrink-0 text-quiet transition-transform duration-400 ease-out motion-reduce:transition-none",
              open && "rotate-45 text-ink",
            )}
          />
        </button>
      </h4>
      <div
        id={id}
        role="region"
        aria-hidden={!open}
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-400 ease-out motion-reduce:transition-none",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <p
            className={cn(
              "max-w-prose pr-9 pb-6 text-pretty text-quiet transition-transform duration-400 ease-out motion-reduce:transition-none",
              open ? "translate-y-0" : "-translate-y-1",
            )}
          >
            {answer}
          </p>
        </div>
      </div>
    </>
  );
}

export function PlansAndFaq() {
  const t = useTranslations("landing");
  const plans = useMemo(() => plansIn(t as unknown as LooseTranslator), [t]);
  const faq = useMemo(() => faqIn(t as unknown as LooseTranslator), [t]);
  return (
    <section
      id="planes"
      aria-label={t("plansSection.label")}
      className="scroll-mt-16 border-b border-line"
    >
      <div className={cn(WRAP, SECTION, "flex flex-col gap-16")}>
        <Heading
          claim={t("plansSection.claim")}
          rest={t("plansSection.rest")}
          className="max-w-3xl"
        />

        <ul className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </ul>

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-8">
          <h3
            id="preguntas"
            className="scroll-mt-24 font-logo text-xl font-semibold lg:col-span-5"
          >
            {t("plansSection.faq")}
          </h3>
          <ul className="lg:col-span-6 lg:col-start-7">
            {faq.map((item) => (
              <li key={item.q} className="border-t border-line last:border-b">
                <FaqItem question={item.q} answer={item.a} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ── Pedido de demo ─────────────────────────────────────── */

const makeDemoSchema = (t: (key: "name" | "agency" | "email" | "teamSize") => string) =>
  z.object({
    name: z.string().min(2, t("name")),
    agency: z.string().min(2, t("agency")),
    email: z.string().email(t("email")),
    teamSize: z.string().min(1, t("teamSize")),
  });

type DemoValues = z.infer<ReturnType<typeof makeDemoSchema>>;

// What reaches Tivvu's inbox stays in Spanish; each language shows its own label.
const TEAM_SIZES = [
  { value: "Particular", key: "solo" },
  { value: "2 a 5", key: "small" },
  { value: "6 a 30", key: "medium" },
  { value: "Más de 30", key: "large" },
] as const;

export function DemoForm() {
  const t = useTranslations("landing.demo");
  const demoSchema = useMemo(() => makeDemoSchema((key) => t(`errors.${key}`)), [t]);
  const [sent, setSent] = useState(false);
  const form = useForm<DemoValues>({
    resolver: zodResolver(demoSchema),
    defaultValues: { name: "", agency: "", email: "", teamSize: "" },
  });
  const errors = form.formState.errors;
  const teamSize = useWatch({ control: form.control, name: "teamSize" });

  async function onSubmit(values: DemoValues) {
    try {
      await requestDemo(values);
      setSent(true);
    } catch (err) {
      toast.error(
        err instanceof ApiError
          ? err.message
          : t("failed"),
      );
    }
  }

  return (
    <section
      id="demo"
      data-nav-dark
      aria-labelledby="demo-titulo"
      className="scroll-mt-16 bg-forest text-paper"
    >
      <div
        className={cn(WRAP, SECTION, "grid gap-12 lg:grid-cols-12 lg:gap-8")}
      >
        <div className="flex flex-col gap-6 lg:col-span-5">
          <Heading
            id="demo-titulo"
            tone="paper"
            claim={t("claim")}
            rest={t("rest")}
          />
        </div>

        <div className="rounded-xl bg-paper p-6 text-ink sm:p-8 lg:col-span-6 lg:col-start-7">
          {sent ? (
            <div className="flex flex-col items-start gap-3 py-6" role="status">
              <span className="flex size-10 items-center justify-center rounded-lg bg-lime text-forest-deep">
                <Check className="size-5" />
              </span>
              <p className="font-logo text-2xl font-semibold">{t("sentTitle")}</p>
              <p className="text-quiet">{t("sentText")}</p>
            </div>
          ) : (
            <form
              className="flex flex-col gap-5"
              onSubmit={form.handleSubmit(onSubmit)}
              noValidate
            >
              <div className="grid gap-5 sm:grid-cols-2">
                {(
                  [
                    ["name", "text", "name"],
                    ["agency", "text", "organization"],
                  ] as const
                ).map(([field, type, autoComplete]) => (
                  <div key={field} className="flex flex-col gap-2">
                    <Label htmlFor={`demo-${field}`}>{t(`fields.${field}`)}</Label>
                    <Input
                      id={`demo-${field}`}
                      type={type}
                      autoComplete={autoComplete}
                      aria-invalid={Boolean(errors[field])}
                      className="h-11 rounded-lg border border-[#cfd5cc] bg-white px-3.5"
                      {...form.register(field)}
                    />
                    {errors[field] && (
                      <p className="text-sm text-destructive">
                        {errors[field]?.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="demo-email">{t("fields.email")}</Label>
                <Input
                  id="demo-email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  className="h-11 rounded-lg border border-[#cfd5cc] bg-white px-3.5"
                  {...form.register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <fieldset className="flex flex-col gap-2">
                <legend className="mb-2 text-sm font-medium">
                  {t("teamQuestion")}
                </legend>
                <div
                  role="radiogroup"
                  aria-label={t("teamLabel")}
                  className="grid grid-cols-2 gap-2 sm:grid-cols-4"
                >
                  {TEAM_SIZES.map((size) => (
                    <button
                      key={size.key}
                      type="button"
                      role="radio"
                      aria-checked={teamSize === size.value}
                      onClick={() =>
                        form.setValue("teamSize", size.value, {
                          shouldValidate: true,
                        })
                      }
                      className={cn(
                        "h-11 rounded-lg border text-sm font-medium tabular-nums outline-none transition-colors focus-visible:ring-2 focus-visible:ring-forest",
                        teamSize === size.value
                          ? "border-forest bg-forest text-paper"
                          : "border-[#cfd5cc] bg-white text-ink hover:border-forest/50",
                      )}
                    >
                      {t(`teamSizes.${size.key}`)}
                    </button>
                  ))}
                </div>
                {errors.teamSize && (
                  <p className="text-sm text-destructive">
                    {errors.teamSize.message}
                  </p>
                )}
              </fieldset>
              <button
                type="submit"
                className={cn(CTA, "mt-2 gap-2")}
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <LoaderCircle className="size-4 animate-spin" />
                    {t("sending")}
                  </>
                ) : (
                  t("submit")
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
