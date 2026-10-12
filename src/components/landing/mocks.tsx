import { Building2, CalendarDays, Check, Clock, FileText, Mail, MapPin, Phone, Search } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Drawn stand-ins for the product's screens, used until real screenshots exist.
 * They use the same classes as the real UI so they read as the same product.
 */

const PILL = "inline-flex h-5 shrink-0 items-center rounded-full px-2 text-[11px] font-medium";
const TONES = {
  amber: "bg-amber-500/15 text-amber-700",
  green: "bg-primary/10 text-primary",
  lime: "bg-highlight/40 text-highlight-foreground",
  solid: "bg-primary text-primary-foreground",
  muted: "bg-foreground/[0.07] text-muted-foreground",
} as const;

function Pill({ tone, children }: { tone: keyof typeof TONES; children: React.ReactNode }) {
  return <span className={cn(PILL, TONES[tone])}>{children}</span>;
}

function Shell({ title, children, action }: { title: string; children: React.ReactNode; action?: string }) {
  return (
    <div className="flex min-h-[22rem] flex-col gap-4 p-4 sm:p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-full bg-foreground/[0.07] px-3.5 text-xs text-muted-foreground">
          <Search className="size-3.5 shrink-0" />
          <span className="truncate">Buscar en {title.toLowerCase()}</span>
        </div>
        {action && (
          <span className="hidden h-9 items-center gap-2 rounded-full bg-primary pr-4 pl-1.5 text-xs font-medium text-primary-foreground sm:flex">
            <span className="flex size-6 items-center justify-center rounded-full bg-highlight text-highlight-foreground">+</span>
            {action}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

const card = "rounded-2xl bg-card shadow-[0_1px_2px_oklch(0.3_0.05_160/0.04),0_10px_28px_-12px_oklch(0.3_0.05_160/0.16)] ring-1 ring-foreground/5";

const TONE_BG = ["bg-[oklch(0.86_0.04_130)]", "bg-[oklch(0.82_0.05_150)]", "bg-[oklch(0.88_0.05_95)]", "bg-[oklch(0.8_0.04_170)]"];

export function MockProperties() {
  const items = [
    ["Venta · Casa", "Casa frente al mar en La Barra", "USD 485.000", "Publicada", "green"],
    ["Alquiler · Departamento", "Departamento con vista en Palermo", "USD 1.250 / mes", "Publicada", "green"],
    ["Venta · Chalet", "Chalet de montaña en Bariloche", "USD 320.000", "Borrador", "amber"],
    ["Alquiler · Casa", "Casa quinta con pileta en Pilar", "USD 3.400 / sem", "Publicada", "green"],
  ] as const;
  return (
    <Shell title="Propiedades" action="Nueva propiedad">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {items.map(([kind, title, price, status, tone], index) => (
          <div key={title} className={cn(card, "overflow-hidden")}>
            <div className={cn("relative flex aspect-[4/3] items-center justify-center text-primary/30", TONE_BG[index])}>
              <Building2 className="size-8" strokeWidth={1.25} />
            </div>
            <div className="flex flex-col gap-1 p-3">
              <p className="text-[10px] text-primary">{kind}</p>
              <p className="font-display text-sm leading-tight">{title}</p>
              <p className="text-xs font-semibold tabular-nums">{price}</p>
              <div className="mt-1">
                <Pill tone={tone}>{status}</Pill>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Shell>
  );
}

export function MockClients() {
  const rows = [
    ["VR", "Valentina Ríos", "Negociando", "lime", "Quedamos en coordinar una segunda visita."],
    ["ME", "Martín Echeverría", "Contactado", "green", "Le mandé la ficha con las expensas."],
    ["CD", "Camila Duarte", "Lead", "amber", "Entró por el formulario del portal."],
    ["JB", "Joaquín Benítez", "Cliente", "solid", "Firmó el boleto del local."],
  ] as const;
  return (
    <Shell title="Clientes" action="Nuevo cliente">
      <div className="flex flex-col gap-2.5">
        {rows.map(([initials, name, stage, tone, note]) => (
          <div key={name} className={cn(card, "flex items-center gap-3 p-3")}>
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary font-display text-sm text-primary">
              {initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-sm leading-tight">{name}</p>
              <p className="truncate text-xs text-muted-foreground">{note}</p>
            </div>
            <Pill tone={tone}>{stage}</Pill>
          </div>
        ))}
      </div>
    </Shell>
  );
}

export function MockTimeline() {
  const events = [
    ["Llamada", "hace 2 días", "Quedamos en coordinar una segunda visita para el sábado."],
    ["Reunión", "hace 6 días", "Visitó la casa de Olivos. Le gustó el jardín."],
    ["Email", "hace 11 días", "Le enviamos la información de las tres propiedades."],
  ];
  return (
    <div className="grid gap-5 p-4 sm:grid-cols-[1fr_12rem] sm:p-6">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-full bg-highlight/45 font-display text-lg text-highlight-foreground">VR</span>
          <div>
            <p className="font-display text-xl leading-tight">Valentina Ríos</p>
            <p className="text-xs text-muted-foreground">Portal · cliente desde septiembre</p>
          </div>
        </div>
        <ol className="flex flex-col gap-4">
          {events.map(([type, when, text]) => (
            <li key={type} className="flex gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                <Clock className="size-3.5" />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] text-muted-foreground">
                  <span className="font-medium text-foreground">{type}</span> · {when}
                </p>
                <p className="text-xs text-foreground/85">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <div className={cn(card, "flex flex-col gap-3 p-4")}>
        <p className="font-display text-base">Etapa</p>
        <div className="flex flex-wrap gap-1.5">
          <Pill tone="muted">Lead</Pill>
          <Pill tone="muted">Contactado</Pill>
          <Pill tone="solid">Negociando</Pill>
        </div>
        <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground"><Mail className="size-3.5" /> valentina@correo.com</p>
        <p className="flex items-center gap-2 text-xs text-muted-foreground"><Phone className="size-3.5" /> +54 9 11 5532-1180</p>
      </div>
    </div>
  );
}

export function MockOffer() {
  return (
    <div className="grid gap-5 p-4 sm:grid-cols-[1fr_13rem] sm:p-6">
      <div className="flex flex-col gap-3">
        <p className="font-display text-xl leading-tight">Tres opciones en zona norte</p>
        {[
          ["Casa en Olivos", "USD 285.000", "−3%"],
          ["Casa en Vicente López", "USD 310.000", "−5%"],
          ["Departamento en Belgrano", "USD 198.000", ""],
        ].map(([title, price, discount], index) => (
          <div key={title} className={cn(card, "flex items-center gap-3 p-2.5")}>
            <span className={cn("flex size-12 shrink-0 items-center justify-center rounded-xl text-primary/30", TONE_BG[index])}>
              <Building2 className="size-5" strokeWidth={1.25} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-sm">{title}</p>
              <p className="text-xs tabular-nums text-muted-foreground">{price}</p>
            </div>
            {discount && <Pill tone="lime">{discount}</Pill>}
          </div>
        ))}
      </div>
      <div className={cn(card, "flex flex-col gap-3 p-4")}>
        <Pill tone="lime">Vista</Pill>
        <div>
          <p className="text-[11px] text-muted-foreground">Total de la oferta</p>
          <p className="font-display text-2xl leading-none tabular-nums">USD 765.100</p>
        </div>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><Clock className="size-3.5" /> Vista hace 5 minutos</p>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><CalendarDays className="size-3.5" /> Vence el 30 de octubre</p>
        <span className="mt-1 inline-flex h-8 items-center justify-center rounded-full bg-foreground/[0.07] text-xs">Copiar link</span>
      </div>
    </div>
  );
}

export function MockBooking() {
  return (
    <div className="grid gap-5 p-4 sm:grid-cols-[1fr_13rem] sm:p-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <span className="flex size-16 flex-col items-center justify-center rounded-2xl bg-secondary text-primary">
            <span className="text-[10px] leading-none">oct</span>
            <span className="font-display text-2xl leading-none">24</span>
          </span>
          <div className="flex flex-col gap-1.5">
            <p className="font-display text-xl leading-tight">Casa frente al mar en La Barra</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Pill tone="green">Confirmada</Pill> Valentina Ríos
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="h-1.5 overflow-hidden rounded-full bg-foreground/[0.08]">
            <div className="h-full w-[30%] rounded-full bg-primary" />
          </div>
          <p className="text-xs tabular-nums text-muted-foreground">Cobrado USD 1.260 de USD 4.200</p>
        </div>
        {[
          ["USD 1.260", "Anticipo · 9 oct", true],
          ["USD 2.940", "Saldo", false],
        ].map(([amount, label, paid]) => (
          <div key={String(amount)} className={cn(card, "flex items-center gap-3 p-3")}>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium tabular-nums">{amount}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
            {paid ? (
              <span className={cn(PILL, TONES.green, "gap-1")}><Check className="size-3" /> Cobrado</span>
            ) : (
              <span className="inline-flex h-7 items-center rounded-full bg-foreground/[0.07] px-3 text-xs">Marcar como cobrado</span>
            )}
          </div>
        ))}
      </div>
      <div className={cn(card, "flex flex-col gap-2.5 p-4 text-xs")}>
        <p className="font-display text-base">Resumen</p>
        {[["Precio total", "USD 4.200"], ["Comisión", "USD 420"], ["Cobrado", "USD 1.260"], ["Por cobrar", "USD 2.940"]].map(([k, v]) => (
          <div key={k} className="flex justify-between gap-2">
            <span className="text-muted-foreground">{k}</span>
            <span className="tabular-nums">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MockCalendar() {
  const days = Array.from({ length: 35 }, (_, index) => index - 2);
  const booked = new Set([8, 9, 10, 11, 12, 13, 14, 21, 22, 23, 24]);
  const high = new Set([15, 16, 17, 18, 19, 20]);
  return (
    <div className="grid gap-5 p-4 sm:grid-cols-[1fr_12rem] sm:p-6">
      <div className="flex flex-col gap-3">
        <p className="font-display text-xl capitalize">Enero 2027</p>
        <div className="grid grid-cols-7 gap-1 text-center text-[11px]">
          {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
            <span key={i} className="py-1 text-muted-foreground">{d}</span>
          ))}
          {days.map((day) => (
            <span
              key={day}
              className={cn(
                "flex h-8 items-center justify-center rounded-lg tabular-nums",
                day < 1 || day > 31 ? "text-transparent" : "bg-card ring-1 ring-foreground/5",
                booked.has(day) && "bg-primary text-primary-foreground ring-0",
                high.has(day) && "bg-highlight/50 text-highlight-foreground ring-0",
              )}
            >
              {day}
            </span>
          ))}
        </div>
      </div>
      <div className={cn(card, "flex flex-col gap-2.5 p-4 text-xs")}>
        <p className="font-display text-base">Tarifas</p>
        {[["Temporada alta", "USD 600 / noche"], ["Temporada media", "USD 420 / noche"], ["Temporada baja", "USD 300 / noche"]].map(([k, v]) => (
          <div key={k} className="flex flex-col">
            <span className="text-muted-foreground">{k}</span>
            <span className="tabular-nums">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MockTeam() {
  const rows = [
    ["PI", "Prueba Inmobiliaria", "Propietario", "solid"],
    ["AC", "Ana Cabrera", "Administrador", "lime"],
    ["RS", "Rodrigo Sosa", "Agente", "green"],
    ["MQ", "Marina Quiroga", "Agente", "green"],
    ["JA", "Julieta Arce", "Inactivo", "muted"],
  ] as const;
  return (
    <Shell title="Equipo" action="Invitar miembro">
      <div className="grid gap-3 sm:grid-cols-2">
        {rows.map(([initials, name, role, tone]) => (
          <div key={name} className={cn(card, "flex items-center gap-3 p-3.5", role === "Inactivo" && "opacity-70")}>
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary font-display text-sm text-primary">{initials}</span>
            <p className="min-w-0 flex-1 truncate font-display text-sm">{name}</p>
            <Pill tone={tone}>{role}</Pill>
          </div>
        ))}
      </div>
    </Shell>
  );
}

export function MockPortal() {
  const items = [
    ["Casa frente al mar", "La Barra, Maldonado", "USD 485.000"],
    ["Departamento con vista", "Palermo, Buenos Aires", "USD 1.250 / mes"],
    ["Chalet de montaña", "Bariloche, Río Negro", "USD 320.000"],
  ];
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 sm:px-8">
        <p className="font-display text-xl">Cabrera Propiedades</p>
        <div className="hidden gap-5 text-xs text-muted-foreground sm:flex"><span>Venta</span><span>Alquiler</span><span>Contacto</span></div>
      </div>
      <div className="mx-5 flex h-44 flex-col justify-end rounded-3xl bg-[oklch(0.8_0.05_150)] p-6 sm:mx-8 sm:h-56">
        <p className="font-display text-3xl leading-none text-primary sm:text-4xl">Encontrá tu lugar.</p>
        <div className="mt-4 flex h-11 max-w-md items-center gap-2 rounded-full bg-card/90 px-4 text-xs text-muted-foreground backdrop-blur">
          <Search className="size-4" /> Zona, tipo de propiedad o precio
        </div>
      </div>
      <div className="grid gap-4 p-5 sm:grid-cols-3 sm:p-8">
        {items.map(([title, place, price], index) => (
          <div key={title} className={cn(card, "overflow-hidden")}>
            <div className={cn("flex aspect-[4/3] items-center justify-center text-primary/30", TONE_BG[index])}>
              <Building2 className="size-8" strokeWidth={1.25} />
            </div>
            <div className="flex flex-col gap-1 p-3.5">
              <p className="font-display text-base leading-tight">{title}</p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="size-3" /> {place}</p>
              <p className="text-sm font-semibold tabular-nums">{price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MockOwner() {
  return (
    <div className="flex flex-col gap-5 p-5 sm:p-8">
      <div>
        <p className="text-xs text-muted-foreground">Hola, Roberto</p>
        <p className="font-display text-2xl leading-tight">Tus propiedades</p>
      </div>
      <div className={cn(card, "flex items-center gap-4 p-3")}>
        <span className={cn("flex size-16 shrink-0 items-center justify-center rounded-xl text-primary/30", TONE_BG[0])}>
          <Building2 className="size-6" strokeWidth={1.25} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-base">Casa frente al mar en La Barra</p>
          <p className="text-xs text-muted-foreground">2 reservas este mes</p>
        </div>
        <Pill tone="green">Publicada</Pill>
      </div>
      {[
        ["Reserva 24 – 31 oct", "USD 4.200", "Confirmada", "green"],
        ["Reserva 12 – 15 nov", "USD 1.800", "Pendiente", "amber"],
      ].map(([label, amount, status, tone]) => (
        <div key={label} className="flex items-center gap-3 text-sm">
          <FileText className="size-4 shrink-0 text-muted-foreground" />
          <span className="flex-1">{label}</span>
          <span className="tabular-nums text-muted-foreground">{amount}</span>
          <Pill tone={tone as keyof typeof TONES}>{status}</Pill>
        </div>
      ))}
    </div>
  );
}
