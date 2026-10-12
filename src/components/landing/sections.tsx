"use client";

import { Check, ChevronDown, LoaderCircle, MessageCircle, Table2, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { AppWindow } from "@/components/landing/app-window";
import {
  MockBooking,
  MockCalendar,
  MockClients,
  MockOffer,
  MockOwner,
  MockPortal,
  MockTeam,
  MockTimeline,
} from "@/components/landing/mocks";
import { Reveal } from "@/components/landing/reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestDemo } from "@/lib/api/demo";
import { ApiError } from "@/lib/api/client";
import { gsap } from "@/lib/gsap";
import { distance, duration, ease, media } from "@/lib/motion";
import { cn } from "@/lib/utils";

const WRAP = "mx-auto w-full max-w-[1800px] px-5 sm:px-8 lg:px-14";
const SECTION = "py-24 md:py-32";
const H2 = "font-display text-4xl leading-[1.05] tracking-tight text-balance md:text-5xl";
const LEAD = "max-w-2xl text-lg text-pretty text-muted-foreground";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-7 items-center rounded-full bg-primary/10 px-3 text-sm font-medium text-primary">
      {children}
    </span>
  );
}

/* ── El problema ─────────────────────────────────────────── */

const PROBLEMS = [
  { icon: MessageCircle, text: "Las consultas llegan por todos lados y nadie sabe quién las atendió." },
  { icon: Users, text: "Las ofertas viajan por WhatsApp y no sabés si el cliente las abrió." },
  { icon: Table2, text: "Los cobros viven en una planilla que solo entiende una persona." },
];

export function Problem() {
  return (
    <Reveal as="section" className={cn(WRAP, SECTION)}>
      <div className="flex flex-col gap-12">
        <h2 data-reveal className={cn(H2, "max-w-3xl")}>
          Cuando el negocio crece, se desordena.
        </h2>
        <ul className="grid gap-5 md:grid-cols-3">
          {PROBLEMS.map((problem) => (
            <li
              key={problem.text}
              data-reveal
              className="flex flex-col gap-5 rounded-3xl bg-card p-7 shadow-[0_1px_2px_oklch(0.3_0.05_160/0.04),0_16px_40px_-16px_oklch(0.3_0.05_160/0.14)] ring-1 ring-foreground/5"
            >
              <span className="flex size-11 items-center justify-center rounded-full bg-secondary text-primary">
                <problem.icon className="size-5" />
              </span>
              <p className="text-lg text-pretty">{problem.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

/* ── El flujo de punta a punta ───────────────────────────── */

type Mode = "sale" | "rent";

const FLOWS: Record<Mode, { title: string; text: string; shot: React.ReactNode; url: string }[]> = {
  sale: [
    {
      title: "Consulta",
      text: "Llega desde tu portal y queda como cliente automáticamente, sin cargar nada a mano.",
      shot: <MockClients />,
      url: "app.inmobiliario.com/clients",
    },
    {
      title: "Seguimiento",
      text: "Etapa, notas e historial de llamadas, emails y reuniones. Todo el equipo ve lo mismo.",
      shot: <MockTimeline />,
      url: "app.inmobiliario.com/clients/valentina-rios",
    },
    {
      title: "Oferta con link",
      text: "Armás una oferta con varias propiedades y descuentos, y la compartís. Ves cuándo la abrieron y cuándo vence.",
      shot: <MockOffer />,
      url: "app.inmobiliario.com/offers",
    },
    {
      title: "Reserva",
      text: "De la oferta aceptada pasás a la reserva, con cliente, propiedad y precio ya cargados.",
      shot: <MockBooking />,
      url: "app.inmobiliario.com/bookings",
    },
    {
      title: "Cobro y comisión",
      text: "Anticipo, saldo y comisión, con lo cobrado y lo que falta, siempre a la vista.",
      shot: <MockBooking />,
      url: "app.inmobiliario.com/bookings/pagos",
    },
  ],
  rent: [
    {
      title: "Consulta",
      text: "El interesado pregunta por las fechas desde tu portal y queda registrado como cliente.",
      shot: <MockClients />,
      url: "app.inmobiliario.com/clients",
    },
    {
      title: "Disponibilidad y tarifas",
      text: "Calendario por propiedad y tarifas por temporada. Sabés qué está libre antes de responder.",
      shot: <MockCalendar />,
      url: "app.inmobiliario.com/properties/disponibilidad",
    },
    {
      title: "Oferta con link",
      text: "Mandás una propuesta con las fechas y el precio, y ves si la abrieron.",
      shot: <MockOffer />,
      url: "app.inmobiliario.com/offers",
    },
    {
      title: "Reserva con fechas",
      text: "Check-in y check-out, noches y total calculados. Las fechas quedan bloqueadas.",
      shot: <MockBooking />,
      url: "app.inmobiliario.com/bookings",
    },
    {
      title: "Pagos",
      text: "Anticipo y saldo con su estado. El propietario puede verlo desde su propio portal.",
      shot: <MockBooking />,
      url: "app.inmobiliario.com/bookings/pagos",
    },
  ],
};

export function Flow() {
  const [mode, setMode] = useState<Mode>("sale");
  const [step, setStep] = useState(0);
  const shotRef = useRef<HTMLDivElement>(null);
  const steps = FLOWS[mode];
  const current = steps[step];

  // The screen swaps with a soft fade each time the step or the mode changes.
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(media.allowMotion, () => {
      gsap.fromTo(
        shotRef.current,
        { opacity: 0, y: distance.sm },
        { opacity: 1, y: 0, duration: duration.base, ease: ease.out },
      );
    });
    return () => mm.revert();
  }, [mode, step]);

  return (
    <section id="flujo" className="scroll-mt-24 px-4 py-3 sm:px-8 lg:px-14">
      <Reveal className="mx-auto flex w-full max-w-[1800px] flex-col gap-12 rounded-[2.5rem] bg-secondary/40 px-6 py-16 sm:px-12 md:py-24 lg:px-16">
        <header className="flex flex-col items-start gap-5">
          <span data-reveal>
            <Eyebrow>De punta a punta</Eyebrow>
          </span>
          <h2 data-reveal className={H2}>
            Del primer mensaje al último cobro.
          </h2>
          <div
            data-reveal
            role="tablist"
            aria-label="Tipo de operación"
            className="flex gap-1 rounded-full bg-foreground/[0.06] p-1"
          >
            {(
              [
                ["sale", "Venta"],
                ["rent", "Alquiler temporario"],
              ] as const
            ).map(([value, label]) => (
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
                  "h-10 rounded-full px-5 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  mode === value ? "bg-card shadow-sm" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </header>

        <div data-reveal className="grid items-start gap-8 lg:grid-cols-[24rem_1fr] lg:gap-14">
          <ol className="flex flex-col gap-1.5">
            {steps.map((item, index) => {
              const active = index === step;
              return (
                <li key={item.title}>
                  <button
                    type="button"
                    aria-current={active ? "step" : undefined}
                    onClick={() => setStep(index)}
                    className={cn(
                      "flex w-full gap-4 rounded-2xl p-4 text-left transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                      active ? "bg-card shadow-[0_12px_32px_-16px_oklch(0.3_0.05_160/0.25)] ring-1 ring-foreground/5" : "hover:bg-foreground/[0.04]",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-medium tabular-nums transition-colors",
                        active ? "bg-primary text-primary-foreground" : "bg-foreground/[0.07] text-muted-foreground",
                      )}
                    >
                      {index + 1}
                    </span>
                    <span className="flex flex-col gap-1">
                      <span className="font-display text-xl leading-tight">{item.title}</span>
                      {active && <span className="text-sm text-pretty text-muted-foreground">{item.text}</span>}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div ref={shotRef} className="min-w-0">
            <AppWindow url={current.url}>{current.shot}</AppWindow>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ── Equipo ──────────────────────────────────────────────── */

const ROLES = [
  { name: "Propietario", text: "Ve y controla todo, incluida la configuración de la agencia." },
  { name: "Administrador", text: "Gestiona el equipo, las propiedades, las ofertas y las reservas." },
  { name: "Agente", text: "Trabaja con sus propiedades, clientes y reservas." },
];

export function TeamSection() {
  return (
    <Reveal as="section" className={cn(WRAP, SECTION)}>
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <div className="flex flex-col gap-6">
          <span data-reveal>
            <Eyebrow>Equipo y permisos</Eyebrow>
          </span>
          <h2 data-reveal className={H2}>
            Cada persona ve y hace lo que le corresponde.
          </h2>
          <p data-reveal className={LEAD}>
            Invitás a tu equipo, cambiás un rol o cortás un acceso en un clic. Sin compartir contraseñas ni planillas.
          </p>
          <ul className="flex flex-col gap-4">
            {ROLES.map((role) => (
              <li key={role.name} data-reveal className="flex gap-3">
                <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="size-3" />
                </span>
                <p>
                  <span className="font-medium">{role.name}.</span>{" "}
                  <span className="text-muted-foreground">{role.text}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div data-reveal>
          <AppWindow url="app.inmobiliario.com/team">
            <MockTeam />
          </AppWindow>
        </div>
      </div>
    </Reveal>
  );
}

/* ── Portal propio ───────────────────────────────────────── */

export function PortalSection() {
  return (
    <section id="portal" className="scroll-mt-24 px-4 py-3 sm:px-8 lg:px-14">
      <Reveal className="mx-auto flex w-full max-w-[1800px] flex-col gap-14 rounded-[2.5rem] bg-primary text-primary-foreground px-6 py-16 sm:px-12 md:py-24 lg:px-16">
        <header className="flex max-w-3xl flex-col gap-6">
          <span
            data-reveal
            className="inline-flex h-7 w-fit items-center rounded-full bg-primary-foreground/15 px-3 text-sm font-medium"
          >
            Tu sitio web
          </span>
          <h2 data-reveal className={H2}>
            Tu portal, con tu marca y tu dirección.
          </h2>
          <p data-reveal className="max-w-2xl text-lg text-pretty text-primary-foreground/75">
            Cada propiedad que publicás aparece en tu sitio, con buscador, fichas y formulario de consulta. Las consultas
            caen directo en tus clientes, sin pagar por publicar en un portal ajeno.
          </p>
        </header>
        <div data-reveal>
          <AppWindow url="cabrerapropiedades.com" className="ring-primary-foreground/20">
            <MockPortal />
          </AppWindow>
        </div>
      </Reveal>
    </section>
  );
}

/* ── Portal del propietario ──────────────────────────────── */

export function OwnerSection() {
  return (
    <Reveal as="section" className={cn(WRAP, SECTION)}>
      <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        <div data-reveal className="order-2 lg:order-1">
          <AppWindow url="app.inmobiliario.com/owner/roberto">
            <MockOwner />
          </AppWindow>
        </div>
        <div className="order-1 flex flex-col gap-6 lg:order-2">
          <span data-reveal>
            <Eyebrow>Portal del propietario</Eyebrow>
          </span>
          <h2 data-reveal className={H2}>
            Tus propietarios, siempre al tanto.
          </h2>
          <p data-reveal className={LEAD}>
            Cada propietario recibe un link privado para ver sus propiedades, reservas y pagos. Se acabaron las llamadas de
            “¿cómo viene lo mío?”.
          </p>
        </div>
      </div>
    </Reveal>
  );
}

/* ── Migración ───────────────────────────────────────────── */

const MIGRATION = [
  { title: "Nos pasás tus datos", text: "Planillas, exportaciones o lo que tengas hoy. No hace falta que esté prolijo." },
  { title: "Los cargamos y revisamos juntos", text: "Propiedades y clientes entran al sistema y los validamos con vos." },
  { title: "Empezás a usarlo", text: "Tu equipo entra con su propio acceso y seguís trabajando como siempre." },
];

export function Migration() {
  return (
    <section id="migracion" className="scroll-mt-24 px-4 py-3 sm:px-8 lg:px-14">
      <Reveal className="mx-auto flex w-full max-w-[1800px] flex-col gap-12 rounded-[2.5rem] bg-secondary/40 px-6 py-16 sm:px-12 md:py-24 lg:px-16">
        <header className="flex max-w-3xl flex-col gap-5">
          <span data-reveal>
            <Eyebrow>Migración</Eyebrow>
          </span>
          <h2 data-reveal className={H2}>
            No arrancás de cero.
          </h2>
          <p data-reveal className={LEAD}>
            Traemos tus propiedades y clientes al sistema. Vos seguís trabajando mientras tanto.
          </p>
        </header>
        <ol className="grid gap-5 md:grid-cols-3">
          {MIGRATION.map((item, index) => (
            <li
              key={item.title}
              data-reveal
              className="flex flex-col gap-4 rounded-3xl bg-card p-7 shadow-[0_1px_2px_oklch(0.3_0.05_160/0.04),0_16px_40px_-16px_oklch(0.3_0.05_160/0.14)] ring-1 ring-foreground/5"
            >
              <span className="font-display text-5xl leading-none text-primary/25 tabular-nums">{index + 1}</span>
              <p className="font-display text-2xl leading-tight">{item.title}</p>
              <p className="text-muted-foreground">{item.text}</p>
            </li>
          ))}
        </ol>
      </Reveal>
    </section>
  );
}

/* ── Planes ──────────────────────────────────────────────── */

export function Plans() {
  return (
    <Reveal as="section" className={cn(WRAP, SECTION, "scroll-mt-24")}>
      <div id="planes" className="flex flex-col items-center gap-6 text-center">
        <h2 data-reveal className={cn(H2, "max-w-2xl")}>
          Planes según el tamaño de tu equipo.
        </h2>
        <p data-reveal className={cn(LEAD, "text-center")}>
          Cada inmobiliaria es distinta. Contanos cómo trabajás y armamos el plan.
        </p>
        <Button data-reveal asChild variant="highlight" size="lg" className="h-12 rounded-full px-7 text-base">
          <a href="#demo">Pedir una demo</a>
        </Button>
      </div>
    </Reveal>
  );
}

/* ── Preguntas frecuentes ────────────────────────────────── */

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
    q: "¿Puedo usar mi propio dominio en el portal?",
    a: "Tu portal vive en su propia dirección con el nombre de tu agencia. Si querés usar tu dominio propio, lo hablamos en la demo.",
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

export function Faq() {
  return (
    <Reveal as="section" className={cn(WRAP, SECTION, "max-w-4xl")}>
      <h2 data-reveal className={cn(H2, "mb-10")}>
        Preguntas frecuentes
      </h2>
      <ul className="flex flex-col gap-2">
        {FAQ.map((item) => (
          <li key={item.q} data-reveal>
            <details className="group rounded-2xl bg-card ring-1 ring-foreground/5 transition-shadow open:shadow-[0_16px_40px_-20px_oklch(0.3_0.05_160/0.25)]">
              <summary className="flex cursor-pointer list-none items-center gap-4 rounded-2xl px-6 py-5 text-lg font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/50 [&::-webkit-details-marker]:hidden">
                <span className="flex-1">{item.q}</span>
                <ChevronDown className="size-5 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <p className="px-6 pb-6 text-pretty text-muted-foreground">{item.a}</p>
            </details>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

/* ── Cierre con formulario de demo ───────────────────────── */

const demoSchema = z.object({
  name: z.string().min(2, "Ingresá tu nombre"),
  agency: z.string().min(2, "Ingresá el nombre de tu agencia"),
  email: z.string().email("Email inválido"),
  teamSize: z.string().min(1, "Elegí el tamaño de tu equipo"),
});

type DemoValues = z.infer<typeof demoSchema>;

const TEAM_SIZES = ["2 a 5 personas", "6 a 15 personas", "16 a 30 personas", "Más de 30"];

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
      toast.error(err instanceof ApiError ? err.message : "No pudimos enviar tu pedido. Probá de nuevo en un rato.");
    }
  }

  return (
    <section id="demo" className="scroll-mt-24 px-4 pb-24 sm:px-8 lg:px-14 md:pb-32">
      <Reveal className="mx-auto max-w-[1800px] overflow-hidden rounded-[2.5rem] bg-primary text-primary-foreground">
        <div className="grid gap-12 p-8 sm:p-12 lg:grid-cols-[1fr_28rem] lg:items-center lg:gap-16 lg:p-16">
          <div className="flex flex-col gap-6">
            <h2 data-reveal className={H2}>
              Veamos cómo se vería tu inmobiliaria acá.
            </h2>
            <p data-reveal className="max-w-lg text-lg text-pretty text-primary-foreground/75">
              Dejanos tus datos y coordinamos una demo con tu caso: tus propiedades, tu equipo y tu forma de trabajar.
            </p>
          </div>

          <div data-reveal className="rounded-3xl bg-card p-6 text-card-foreground sm:p-8">
            {sent ? (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <span className="flex size-14 items-center justify-center rounded-full bg-highlight text-highlight-foreground">
                  <Check className="size-6" />
                </span>
                <p className="font-display text-2xl">¡Recibimos tu pedido!</p>
                <p className="text-muted-foreground">Te escribimos pronto para coordinar la demo.</p>
              </div>
            ) : (
              <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
                {(
                  [
                    ["name", "Tu nombre", "text", "name"],
                    ["agency", "Nombre de la agencia", "text", "organization"],
                    ["email", "Email", "email", "email"],
                  ] as const
                ).map(([field, label, type, autoComplete]) => (
                  <div key={field} className="flex flex-col gap-2">
                    <Label htmlFor={`demo-${field}`}>{label}</Label>
                    <Input
                      id={`demo-${field}`}
                      type={type}
                      autoComplete={autoComplete}
                      aria-invalid={Boolean(errors[field])}
                      className="h-11 px-4"
                      {...form.register(field)}
                    />
                    {errors[field] && <p className="text-sm text-destructive">{errors[field]?.message}</p>}
                  </div>
                ))}
                <div className="flex flex-col gap-2">
                  <Label>¿Cuántas personas son en el equipo?</Label>
                  <div role="radiogroup" aria-label="Tamaño del equipo" className="flex flex-wrap gap-1.5">
                    {TEAM_SIZES.map((size) => (
                      <button
                        key={size}
                        type="button"
                        role="radio"
                        aria-checked={teamSize === size}
                        onClick={() => form.setValue("teamSize", size, { shouldValidate: true })}
                        className={cn(
                          "h-9 rounded-full px-4 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                          teamSize === size
                            ? "bg-primary text-primary-foreground"
                            : "bg-foreground/[0.06] text-muted-foreground hover:bg-foreground/10 hover:text-foreground",
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  {errors.teamSize && <p className="text-sm text-destructive">{errors.teamSize.message}</p>}
                </div>
                <Button
                  type="submit"
                  variant="highlight"
                  size="lg"
                  className="mt-2 h-12 gap-2 rounded-full text-base"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <LoaderCircle className="animate-spin" />
                      Enviando…
                    </>
                  ) : (
                    "Pedir una demo"
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ── Pie ─────────────────────────────────────────────────── */

export function LandingFooter() {
  return (
    <footer className={cn(WRAP, "flex flex-col items-center justify-between gap-4 pb-10 text-sm text-muted-foreground sm:flex-row")}>
      <p>
        <span className="font-display text-lg text-foreground">Inmobiliario</span> · © {new Date().getFullYear()}
      </p>
      <nav aria-label="Pie" className="flex gap-5">
        <Link href="/login" className="outline-none hover:text-foreground focus-visible:underline">
          Ingresar
        </Link>
        <a href="#demo" className="outline-none hover:text-foreground focus-visible:underline">
          Pedir una demo
        </a>
      </nav>
    </footer>
  );
}
