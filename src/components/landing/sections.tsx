"use client";

import { Check, LoaderCircle, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import {
  AgencySiteFragment,
  BookingFragment,
  CalendarFragment,
  ClientsFragment,
  OfferFragment,
  OwnerFragment,
  PaymentsFragment,
  SaleBookingFragment,
  TimelineFragment,
} from "@/components/landing/fragments";
import { LogoIcon } from "@/components/logo-icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestDemo } from "@/lib/api/demo";
import { ApiError } from "@/lib/api/client";
import { gsap } from "@/lib/gsap";
import { duration, ease, media } from "@/lib/motion";
import { cn } from "@/lib/utils";

const WRAP = "mx-auto w-full max-w-[1440px] px-5 sm:px-8";
const SECTION = "py-20 md:py-28";
const CTA =
  "inline-flex h-12 items-center justify-center rounded-lg bg-lime px-6 text-base font-semibold text-forest-deep outline-none transition-[filter] hover:brightness-95 focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 disabled:opacity-60";

/**
 * Section headings read as one sentence in two weights: the claim in ink, the
 * explanation right after it in a quieter tone.
 */
function Heading({
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
  return (
    <h2
      id={id}
      className={cn(
        "font-logo text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.04] font-semibold tracking-[-0.03em] text-balance",
        className,
      )}
    >
      {claim}
      {rest && (
        <span className={tone === "ink" ? "text-quiet" : "text-paper/50"}>
          {" "}
          {rest}
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
      "Cada consulta de tu sitio entra como cliente, con un responsable y su historial.",
  },
  {
    today:
      "Las ofertas viajan por WhatsApp y no sabés si el cliente las abrió.",
    tivvo: "Mandás un link y ves cuándo la abrieron y cuándo vence.",
  },
  {
    today: "Los cobros viven en una planilla que solo entiende una persona.",
    tivvo:
      "Anticipo, saldo y comisión de cada reserva, a la vista de quien corresponde.",
  },
];

export function Problem() {
  return (
    <section aria-labelledby="problema" className="border-b border-line">
      <div
        className={cn(WRAP, SECTION, "grid gap-12 lg:grid-cols-12 lg:gap-8")}
      >
        <Heading
          id="problema"
          claim="Cuando el negocio crece, se desordena."
          rest="Tivvo lo ordena."
          className="lg:col-span-5"
        />
        <div className="lg:col-span-7">
          <div className="hidden grid-cols-2 gap-8 pb-3 text-sm text-quiet sm:grid">
            <span>Hoy</span>
            <span>Con Tivvo</span>
          </div>
          <ul>
            {PROBLEMS.map((item) => (
              <li
                key={item.today}
                className="grid gap-3 border-t border-line py-6 sm:grid-cols-2 sm:gap-8"
              >
                <p className="text-lg leading-snug text-pretty text-quiet">
                  {item.today}
                </p>
                <p className="flex gap-3 text-lg leading-snug text-pretty">
                  <Check
                    className="mt-1 size-4 shrink-0 text-forest"
                    aria-hidden
                  />
                  {item.tivvo}
                </p>
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
      title: "Reserva",
      text: "De la oferta aceptada pasás a la reserva, con cliente, propiedad y precio ya cargados.",
      shot: <SaleBookingFragment />,
    },
    {
      title: "Cobro y comisión",
      text: "Anticipo, saldo y comisión, con lo cobrado y lo que falta.",
      shot: <PaymentsFragment />,
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
      text: "Mandás una propuesta con las fechas y el precio, y ves si la abrieron.",
      shot: <OfferFragment />,
    },
    {
      title: "Reserva con fechas",
      text: "Check-in, check-out, noches y total calculados. Las fechas quedan bloqueadas.",
      shot: <BookingFragment className="mx-auto max-w-md" />,
    },
    {
      title: "Pagos",
      text: "Anticipo y saldo con su estado. El propietario lo ve desde su portal.",
      shot: <PaymentsFragment commission={false} />,
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
  const shotRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  const steps = FLOWS[mode];
  const current = steps[step];

  // The screen swaps with a short fade when someone picks a step or a mode.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const mm = gsap.matchMedia();
    mm.add(media.allowMotion, () => {
      gsap.fromTo(
        shotRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: duration.base, ease: ease.out },
      );
    });
    return () => mm.revert();
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
            role="tablist"
            aria-label="Tipo de operación"
            className="flex shrink-0 gap-6 border-b border-line"
          >
            {MODES.map(([value, label]) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={mode === value}
                onClick={() => {
                  setMode(value);
                  setStep(0);
                }}
                className={cn(
                  "-mb-px h-11 border-b-2 text-base font-medium outline-none transition-colors focus-visible:text-ink focus-visible:underline",
                  mode === value
                    ? "border-forest text-ink"
                    : "border-transparent text-quiet hover:text-ink",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          <ol className="lg:col-span-4">
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
                    onClick={() => setStep(index)}
                    className="group flex w-full gap-4 py-4 text-left outline-none focus-visible:bg-mist"
                  >
                    <span
                      className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded-md text-sm font-medium tabular-nums transition-colors",
                        active
                          ? "bg-forest text-paper"
                          : "bg-mist text-quiet group-hover:text-ink",
                      )}
                    >
                      {index + 1}
                    </span>
                    <span className="flex flex-col gap-1.5 pt-0.5">
                      <span
                        className={cn(
                          "text-lg leading-tight font-semibold",
                          !active && "text-quiet group-hover:text-ink",
                        )}
                      >
                        {item.title}
                      </span>
                      {active && (
                        <span className="text-pretty text-quiet">
                          {item.text}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="flex min-w-0 items-center rounded-2xl bg-mist p-4 sm:p-8 lg:col-span-8 lg:p-12">
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
    text: "Ve y controla todo, incluida la configuración de la agencia.",
  },
  {
    name: "Administrador",
    text: "Gestiona el equipo, las propiedades, las ofertas y las reservas.",
  },
  { name: "Agente", text: "Trabaja con sus propiedades, clientes y reservas." },
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
          rest="Sin compartir contraseñas."
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
          rest="Un sitio para tus clientes y un portal para cada propietario."
          className="max-w-4xl"
        />
      </div>
      <div className={cn(WRAP, "mt-12 md:mt-16")}>
        {/* The 1px gap over the line color draws the divider between the two portals. */}
        <div className="grid gap-px bg-line lg:grid-cols-2">
          {[
            {
              title: "Tu sitio web",
              text: "Cada propiedad que publicás aparece en tu sitio, con buscador, fichas y formulario de consulta. Las consultas caen directo en tus clientes, sin pagar por aparecer en un portal ajeno.",
              shot: <AgencySiteFragment />,
            },
            {
              title: "Portal del propietario",
              text: "Cada propietario recibe un link privado para ver sus propiedades, reservas y pagos. Menos llamadas preguntando cómo viene lo suyo.",
              shot: <OwnerFragment />,
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
    text: "Planillas, exportaciones o lo que tengas hoy. No hace falta que esté prolijo.",
  },
  {
    title: "Los cargamos y revisamos juntos",
    text: "Propiedades y clientes entran al sistema y los validamos con vos.",
  },
  {
    title: "Empezás a usarlo",
    text: "Tu equipo entra con su propio acceso y sigue trabajando como siempre.",
  },
];

export function Migration() {
  return (
    <section
      id="migracion"
      aria-labelledby="migracion-titulo"
      className="scroll-mt-16 border-b border-line bg-mist"
    >
      <div className={cn(WRAP, SECTION, "flex flex-col gap-14")}>
        <Heading
          id="migracion-titulo"
          claim="No arrancás de cero."
          rest="Traemos tus datos por vos."
          className="max-w-4xl"
        />
        <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
          {MIGRATION.map((item, index) => (
            <li
              key={item.title}
              className="flex flex-col gap-3 border-t-2 border-forest pt-5"
            >
              <span className="font-logo text-sm font-semibold text-forest tabular-nums">
                Paso {index + 1}
              </span>
              <p className="font-logo text-xl leading-tight font-semibold">
                {item.title}
              </p>
              <p className="text-pretty text-quiet">{item.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ── Planes y preguntas ─────────────────────────────────── */

const FAQ = [
  {
    q: "¿Sirve para ventas y alquileres a la vez?",
    a: "Sí. Las dos operaciones conviven en el mismo sistema: las ventas con ofertas y comisión, y los alquileres temporarios con disponibilidad, tarifas por temporada, reservas con fechas y pagos.",
  },
  {
    q: "¿Cuánto tarda la migración?",
    a: "Depende de cuántos datos tengas y en qué formato estén. En la demo lo vemos con tu caso y te damos una fecha concreta.",
  },
  {
    q: "¿Puedo usar mi propio dominio en el sitio?",
    a: "Tu sitio vive en su propia dirección con el nombre de tu agencia. Si querés usar tu dominio propio, lo hablamos en la demo.",
  },
  {
    q: "¿Mis datos se mezclan con los de otras inmobiliarias?",
    a: "No. Cada agencia trabaja en su propio espacio y solo su equipo puede ver sus propiedades, clientes y reservas.",
  },
  {
    q: "¿Cuántos usuarios puedo tener?",
    a: "No hay un número fijo. Armamos el plan según el tamaño de tu equipo.",
  },
];

export function PlansAndFaq() {
  return (
    <section
      id="planes"
      aria-label="Planes y preguntas frecuentes"
      className="scroll-mt-16 border-b border-line"
    >
      <div
        className={cn(WRAP, SECTION, "grid gap-16 lg:grid-cols-12 lg:gap-8")}
      >
        <div className="flex flex-col items-start gap-6 lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
          <Heading
            claim="Planes según el tamaño de tu equipo."
            rest="Contanos cómo trabajás."
          />
          <a href="#demo" className={CTA}>
            Pedir una demo
          </a>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <h3
            id="preguntas"
            className="scroll-mt-24 pb-4 font-logo text-xl font-semibold"
          >
            Preguntas frecuentes
          </h3>
          <ul>
            {FAQ.map((item) => (
              <li key={item.q} className="border-t border-line last:border-b">
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-start gap-4 py-5 text-lg font-medium outline-none focus-visible:bg-mist [&::-webkit-details-marker]:hidden">
                    <span className="flex-1">{item.q}</span>
                    <Plus
                      aria-hidden
                      className="mt-1 size-5 shrink-0 text-quiet transition-transform duration-200 group-open:rotate-45"
                    />
                  </summary>
                  <p className="max-w-prose pr-9 pb-6 text-pretty text-quiet">
                    {item.a}
                  </p>
                </details>
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

const TEAM_SIZES = ["2 a 5", "6 a 15", "16 a 30", "Más de 30"];

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
            claim="Veamos tu inmobiliaria en Tivvo."
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

/* ── Pie ────────────────────────────────────────────────── */

const FOOTER_LINKS: {
  title: string;
  links: { label: string; href: string }[];
}[] = [
  {
    title: "Producto",
    links: [
      { label: "Cómo funciona", href: "#flujo" },
      { label: "Equipo y permisos", href: "#equipo" },
      { label: "Migración", href: "#migracion" },
    ],
  },
  {
    title: "Portales",
    links: [
      { label: "Sitio de tu agencia", href: "#portales" },
      { label: "Portal del propietario", href: "#portales" },
    ],
  },
  {
    title: "Empezar",
    links: [
      { label: "Pedir una demo", href: "#demo" },
      { label: "Planes", href: "#planes" },
      { label: "Preguntas frecuentes", href: "#preguntas" },
    ],
  },
  {
    title: "Cuenta",
    links: [
      { label: "Ingresar", href: "/login" },
      { label: "Crear cuenta", href: "/register" },
    ],
  },
];

const FOOTER_LINK =
  "rounded-sm text-paper/75 outline-none transition-colors hover:text-paper focus-visible:ring-2 focus-visible:ring-lime";

export function LandingFooter() {
  return (
    <footer data-nav-dark className="overflow-hidden bg-forest-deep text-paper">
      <div
        className={cn(
          WRAP,
          "grid gap-12 pt-16 pb-14 md:pt-20 lg:grid-cols-12 lg:gap-8",
        )}
      >
        <div className="flex flex-col items-start gap-4 lg:col-span-4">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-sm font-logo text-xl leading-none font-semibold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-lime"
          >
            <LogoIcon className="h-[0.95em] text-lime" />
            Tivvo
          </Link>
          <p className="max-w-xs text-pretty text-paper/60">
            Sistema de gestión para inmobiliarias de venta y alquiler
            temporario.
          </p>
        </div>

        <nav
          aria-label="Pie"
          className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 lg:col-span-8"
        >
          {FOOTER_LINKS.map((group) => (
            <div key={group.title} className="flex flex-col gap-4">
              <h3 className="text-sm text-paper/45">{group.title}</h3>
              <ul className="flex flex-col gap-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("/") ? (
                      <Link href={link.href} className={FOOTER_LINK}>
                        {link.label}
                      </Link>
                    ) : (
                      <a href={link.href} className={FOOTER_LINK}>
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className={WRAP}>
        <div className="flex items-center justify-between gap-6 border-t border-paper/10 py-6 text-sm text-paper/45">
          <p>© {new Date().getFullYear()} Tivvo</p>
          <a href="#producto" className={cn(FOOTER_LINK, "text-paper/60")}>
            Volver arriba
          </a>
        </div>
      </div>

      {/* The wordmark sits on the bottom edge like a house on the ground line: its foot is cropped by the page end.
          Its font size is the content width divided by the wordmark's width in em, so it always spans edge to edge. */}
      <div aria-hidden className={cn(WRAP, "pointer-events-none select-none")}>
        <p className="-mb-[0.14em] flex items-end gap-[0.06em] font-logo text-[calc((100vw-2.5rem)/3.44)] sm:text-[min(calc((100vw-4rem)/3.44),25rem)] leading-[0.8] font-semibold tracking-[-0.05em] text-forest">
          <LogoIcon className="mb-[0.02em] h-[0.72em] text-forest" />
          Tivvo
        </p>
      </div>
    </footer>
  );
}
