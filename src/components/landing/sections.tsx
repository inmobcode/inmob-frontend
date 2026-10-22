"use client";

import { Check, LoaderCircle, Plus } from "lucide-react";
import { useId, useLayoutEffect, useRef, useState } from "react";
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
import { FAQ, PLANS, type Plan } from "@/components/landing/plans-faq-data";
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

/* ── Hoy y con Tivvo ────────────────────────────────────── */

const PROBLEMS = [
  {
    today:
      "Las consultas llegan por todos lados y nadie sabe quién las atendió.",
    tivvo:
      "Cada consulta de tu sitio entra a una bandeja como cliente, con un responsable y su historial.",
  },
  {
    today:
      "Un cliente quedó sin respuesta y te enterás cuando ya compró en otra.",
    tivvo:
      "Tareas de seguimiento con fecha y responsable, y una campana que avisa lo que necesita tu atención.",
  },
  {
    today:
      "Las ofertas viajan por WhatsApp y no sabés si el cliente las abrió.",
    tivvo: "Mandás un link y ves cuándo la abrieron y cuándo vence.",
  },
  {
    today:
      "El calendario de alquileres está en una planilla y se pisan las reservas.",
    tivvo:
      "Disponibilidad de 90 días: las fechas reservadas se bloquean solas y vos bloqueás el resto arrastrando.",
  },
  {
    today: "Los cobros viven en una planilla que solo entiende una persona.",
    tivvo:
      "Anticipo, saldo y comisión de cada reserva, a la vista de quien corresponde.",
  },
  {
    today: "Los propietarios llaman cada semana para saber cómo viene lo suyo.",
    tivvo:
      "Un link privado con su estado de cuenta: lo cobrado, las liquidaciones y el saldo.",
  },
];

export function Problem() {
  return (
    <section aria-labelledby="problema" className="border-b border-line">
      <div className={cn(WRAP, SECTION, "flex flex-col gap-12 md:gap-14")}>
        <Heading
          id="problema"
          claim="Cuando el negocio crece, se desordena."
          rest="Tivvo lo ordena."
          className="max-w-3xl"
        />
        {/* Two columns read across: the problem in grey, its answer marked in forest green. */}
        <div>
          <div
            aria-hidden
            className="hidden text-sm font-semibold sm:grid sm:grid-cols-2"
          >
            <span className="pb-3 text-quiet">Problema</span>
            <span className="border-b-2 border-forest pb-3 pl-8 text-forest">
              Solución
            </span>
          </div>
          <ul>
            {PROBLEMS.map((item) => (
              <li key={item.today} className="grid sm:grid-cols-2">
                <div className="flex flex-col gap-2 border-t border-line pt-6 pb-4 sm:py-7 sm:pr-8">
                  <span className="text-sm font-semibold text-quiet sm:hidden">
                    Problema
                  </span>
                  <p className="text-lg leading-snug text-pretty text-quiet">
                    {item.today}
                  </p>
                </div>
                <div className="flex flex-col gap-2 border-t border-forest/20 pt-2 pb-6 sm:py-7 sm:pl-8">
                  <span className="text-sm font-semibold text-forest sm:hidden">
                    Solución
                  </span>
                  <p className="flex gap-3 text-lg leading-snug text-pretty">
                    <span
                      aria-hidden
                      className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-forest text-lime"
                    >
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                    {item.tivvo}
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

const FLOWS: Record<
  Mode,
  { title: string; text: string; shot: React.ReactNode }[]
> = {
  sale: [
    {
      title: "Consulta",
      text: "Llega desde tu sitio y queda como cliente, sin cargar nada a mano.",
      shot: <ClientsFragment />,
    },
    {
      title: "Seguimiento",
      text: "Etapa, notas e historial de llamadas, emails y visitas. Todo el equipo ve lo mismo.",
      shot: <TimelineFragment />,
    },
    {
      title: "Oferta con link",
      text: "Armás una oferta con varias propiedades y descuentos y la compartís. Ves cuándo la abrieron y cuándo vence.",
      shot: <OfferFragment />,
    },
    {
      title: "Tareas y alertas",
      text: "Programás el llamado de seguimiento con fecha y responsable. La campana te avisa cuando abren la oferta.",
      shot: <TasksFragment />,
    },
    {
      title: "Reserva",
      text: "Creás la reserva con el cliente, la propiedad y el precio de la oferta ya cargados.",
      shot: <SaleBookingFragment />,
    },
    {
      title: "Cobro y comisión",
      text: "Anticipo, saldo y comisión, con lo cobrado y lo que falta.",
      shot: <PaymentsFragment variant="sale" />,
    },
  ],
  rent: [
    {
      title: "Consulta",
      text: "El interesado pregunta por las fechas desde tu sitio y queda registrado como cliente.",
      shot: <ClientsFragment />,
    },
    {
      title: "Disponibilidad y tarifas",
      text: "Calendario por propiedad y tarifas por temporada. Sabés qué está libre antes de responder.",
      shot: <CalendarFragment />,
    },
    {
      title: "Oferta con link",
      text: "Mandás una propuesta con el precio y el descuento de cada propiedad, y ves si la abrieron.",
      shot: <OfferFragment />,
    },
    {
      title: "Tareas y alertas",
      text: "Dejás una tarea para retomar el contacto y la campana avisa cuando abren la propuesta, para llamar en el momento justo.",
      shot: <TasksFragment />,
    },
    {
      title: "Reserva con fechas",
      text: "Check-in, check-out, noches y total calculados. Las fechas quedan bloqueadas.",
      shot: <BookingFragment className="mx-auto max-w-md" />,
    },
    {
      title: "Pagos",
      text: "Anticipo y saldo con su estado. El propietario lo ve desde su portal.",
      shot: <PaymentsFragment variant="rent" />,
    },
  ],
};

const MODES: [Mode, string][] = [
  ["sale", "Venta"],
  ["rent", "Alquiler temporario"],
];

export function Flow() {
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
            claim="Un mismo recorrido para vender y alquilar."
            rest="Elegí la operación."
            className="max-w-3xl"
          />
          <div
            ref={tabsRef}
            role="tablist"
            aria-label="Tipo de operación"
            className="relative flex shrink-0 gap-6 border-b border-line"
          >
            {MODES.map(([value, label]) => (
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
                {label}
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
                  key={item.title}
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
                        {item.title}
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
                          {item.text}
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

const ROLES = [
  {
    name: "Propietario",
    text: "Ve y controla todo, incluida la configuración de la agencia, y reasigna clientes y propiedades.",
  },
  {
    name: "Administrador",
    text: "Gestiona el equipo, las propiedades, las ofertas y las reservas de toda la agencia, y reasigna responsables.",
  },
  {
    name: "Agente",
    text: "Ve sus propiedades, ofertas y reservas, sus clientes y las consultas que todavía nadie tomó. Lo demás no aparece.",
  },
];

export function TeamSection() {
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
          claim="Cada persona ve lo que le corresponde."
          rest="Cada agente con su acceso, y vos con el control."
          className="lg:col-span-5"
        />
        <dl className="lg:col-span-6 lg:col-start-7">
          {ROLES.map((role) => (
            <div
              key={role.name}
              className="grid gap-1 border-t border-line py-6 last:border-b sm:grid-cols-[11rem_1fr] sm:gap-8"
            >
              <dt className="font-logo text-xl font-semibold">{role.name}</dt>
              <dd className="text-lg leading-snug text-pretty text-quiet">
                {role.text}
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
  return (
    <section
      id="portales"
      aria-labelledby="portales-titulo"
      className="scroll-mt-16 border-b border-line"
    >
      <div className={cn(WRAP, "pt-20 md:pt-28")}>
        <Heading
          id="portales-titulo"
          claim="Lo que ven los de afuera."
          rest="Un link privado para cada propietario y para cada cliente, sin contraseñas."
          className="max-w-4xl"
        />
      </div>
      <div className={cn(WRAP, "mt-12 md:mt-16")}>
        {/* The 1px gap over the line color draws the divider between the two portals. */}
        <div className="grid gap-px bg-line lg:grid-cols-2">
          {[
            {
              title: "Portal del propietario",
              text: "Cada propietario ve sus propiedades, reservas y pagos, y su estado de cuenta: lo cobrado, las liquidaciones y el saldo. La comisión queda oculta salvo que decidas mostrarla. Menos llamadas preguntando cómo viene lo suyo.",
              shot: <OwnerStatementFragment />,
            },
            {
              title: "Reserva para el cliente",
              text: "Al crear, confirmar o cancelar una reserva, el cliente recibe por email un link con sus fechas, el total y el estado de los pagos. Sin comisión a la vista y sin que tengas que reenviar nada.",
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

const MIGRATION = [
  {
    title: "Nos pasás tus datos",
    text: "Planillas, exportaciones o lo que uses hoy, aunque no esté prolijo.",
  },
  {
    title: "Los cargamos y revisamos juntos",
    text: "Cargamos tus propiedades, propietarios y clientes, y los validamos con vos antes de seguir.",
  },
  {
    title: "Empezás a usarlo",
    text: "Tu equipo entra con su propio acceso y el rol que le corresponde, y tu sitio queda listo para publicar.",
  },
];

export function Migration() {
  return (
    <section
      id="migracion"
      aria-labelledby="migracion-titulo"
      className="scroll-mt-16 border-b border-line bg-mist"
    >
      <div className={cn(WRAP, SECTION, "flex flex-col gap-12 md:gap-14")}>
        <Heading
          id="migracion-titulo"
          claim="No arrancás de cero."
          rest="Traemos tus datos por vos."
          className="max-w-4xl"
        />
        <ol className="grid gap-x-8 md:grid-cols-3 lg:gap-x-10">
          {MIGRATION.map((item, index) => (
            <li
              key={item.title}
              className="flex flex-col gap-3 border-t border-ink/15 py-6"
            >
              <span
                aria-hidden
                className="font-logo text-5xl leading-none font-semibold text-forest tabular-nums"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="mt-3 font-logo text-xl leading-tight font-semibold">
                <span className="sr-only">Paso {index + 1}: </span>
                {item.title}
              </p>
              <p className="text-lg leading-snug text-pretty text-quiet">
                {item.text}
              </p>
            </li>
          ))}
        </ol>
        <div className="flex flex-col gap-4 border-t border-ink/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-lg leading-snug text-pretty">
            ¿Tenés los datos en otro sistema? Lo vemos en la demo y te damos una
            fecha concreta.
          </p>
          <a href="#demo" className={CTA}>
            Pedir una demo
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
  return (
    <section
      id="planes"
      aria-label="Planes y preguntas frecuentes"
      className="scroll-mt-16 border-b border-line"
    >
      <div className={cn(WRAP, SECTION, "flex flex-col gap-16")}>
        <Heading
          claim="Un plan para cada etapa de tu agencia."
          rest="Empezá gratis y subí de plan cuando lo necesites."
          className="max-w-3xl"
        />

        <ul className="grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </ul>

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-8">
          <h3
            id="preguntas"
            className="scroll-mt-24 font-logo text-xl font-semibold lg:col-span-5"
          >
            Preguntas frecuentes
          </h3>
          <ul className="lg:col-span-6 lg:col-start-7">
            {FAQ.map((item) => (
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

const demoSchema = z.object({
  name: z.string().min(2, "Ingresá tu nombre"),
  agency: z.string().min(2, "Ingresá el nombre de tu agencia"),
  email: z.string().email("Revisá el email: falta la @ o el dominio"),
  teamSize: z.string().min(1, "Elegí el tamaño de tu equipo"),
});

type DemoValues = z.infer<typeof demoSchema>;

const TEAM_SIZES = ["Particular", "2 a 5", "6 a 30", "Más de 30"];

export function DemoForm() {
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
          : "No se pudo enviar el pedido. Probá de nuevo en unos minutos.",
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
            claim="Veamos tu agencia en Tivvo."
            rest="Con tus propiedades y tu equipo."
          />
        </div>

        <div className="rounded-xl bg-paper p-6 text-ink sm:p-8 lg:col-span-6 lg:col-start-7">
          {sent ? (
            <div className="flex flex-col items-start gap-3 py-6" role="status">
              <span className="flex size-10 items-center justify-center rounded-lg bg-lime text-forest-deep">
                <Check className="size-5" />
              </span>
              <p className="font-logo text-2xl font-semibold">Pedido enviado</p>
              <p className="text-quiet">
                Te escribimos en los próximos días para coordinar la demo.
              </p>
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
                    ["name", "Tu nombre", "text", "name"],
                    ["agency", "Agencia", "text", "organization"],
                  ] as const
                ).map(([field, label, type, autoComplete]) => (
                  <div key={field} className="flex flex-col gap-2">
                    <Label htmlFor={`demo-${field}`}>{label}</Label>
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
                <Label htmlFor="demo-email">Email de trabajo</Label>
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
                  ¿Cuántas personas son en el equipo?
                </legend>
                <div
                  role="radiogroup"
                  aria-label="Tamaño del equipo"
                  className="grid grid-cols-2 gap-2 sm:grid-cols-4"
                >
                  {TEAM_SIZES.map((size) => (
                    <button
                      key={size}
                      type="button"
                      role="radio"
                      aria-checked={teamSize === size}
                      onClick={() =>
                        form.setValue("teamSize", size, {
                          shouldValidate: true,
                        })
                      }
                      className={cn(
                        "h-11 rounded-lg border text-sm font-medium tabular-nums outline-none transition-colors focus-visible:ring-2 focus-visible:ring-forest",
                        teamSize === size
                          ? "border-forest bg-forest text-paper"
                          : "border-[#cfd5cc] bg-white text-ink hover:border-forest/50",
                      )}
                    >
                      {size}
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
                    Enviando…
                  </>
                ) : (
                  "Pedir una demo"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
