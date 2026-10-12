import Image from "next/image";
import {
  CalendarDays,
  Check,
  Eye,
  Globe,
  Mail,
  Phone,
  Search,
} from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Pieces of the product drawn at landing scale. Each one shows a single moment of
 * the work (an inquiry arriving, an offer being opened, a payment coming in)
 * instead of a whole screen inside a fake browser window.
 */

export const FRAGMENT = "rounded-xl border border-line bg-white text-ink";

const TAG_TONES = {
  forest: "bg-forest text-paper",
  lime: "bg-lime/25 text-forest",
  mist: "bg-mist text-quiet",
  amber: "bg-amber-400/20 text-amber-800",
} as const;

export function Tag({
  tone,
  children,
}: {
  tone: keyof typeof TAG_TONES;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-5 shrink-0 items-center gap-1 rounded px-1.5 text-[11px] font-medium",
        TAG_TONES[tone],
      )}
    >
      {children}
    </span>
  );
}

/** Portraits from Unsplash (free license) for the sample clients, keyed by their initials. */
const PEOPLE: Record<string, string> = {
  VR: "photo-1780764894670-61ce6380df5a",
  ME: "photo-1625241152315-4a698f74ceb7",
  CD: "photo-1695013079138-d39ea65ab0b6",
  JB: "photo-1700338664427-aa9c6ac608d7",
};

/** Shows the person's portrait when there is one, their initials otherwise. Decorative: the name is always next to it. */
function Avatar({
  initials,
  className,
}: {
  initials: string;
  className?: string;
}) {
  const photo = PEOPLE[initials];
  return (
    <span
      aria-hidden
      className={cn(
        "relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-mist font-logo text-xs font-semibold text-forest",
        className,
      )}
    >
      {photo ? (
        <Image
          src={`https://images.unsplash.com/${photo}?w=320&h=320&fit=crop&crop=faces&q=80&fm=jpg`}
          alt=""
          fill
          sizes="48px"
          className="object-cover"
        />
      ) : (
        initials
      )}
    </span>
  );
}

/** Property photos from Unsplash (free license), one per listing used across the page. */
const PHOTOS = {
  laBarra: "photo-1597475681177-809cfdc76cd2",
  palermo: "photo-1649429710616-dad56ce9a076",
  olivos: "photo-1646083329688-4b004d8be9da",
  vicenteLopez: "photo-1558969763-1e911dcd91e6",
  belgrano: "photo-1771287490603-fbf9b6211cc3",
  coast: "photo-1730005523015-422bd53dda0b",
} as const;

type PhotoName = keyof typeof PHOTOS;

/** Decorative: the listing's name is always written next to it. */
export function PropertyPhoto({
  photo,
  className,
  sizes = "96px",
}: {
  photo: PhotoName;
  className?: string;
  sizes?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn("relative block overflow-hidden bg-mist", className)}
    >
      <Image
        src={`https://images.unsplash.com/${PHOTOS[photo]}?w=1600&q=80&fm=jpg&fit=crop`}
        alt=""
        fill
        sizes={sizes}
        className="object-cover"
      />
    </span>
  );
}

/* ── One deal, step by step (hero) ─────────────────────── */

export function InquiryFragment({ className }: { className?: string }) {
  return (
    <div className={cn(FRAGMENT, "flex flex-col gap-3 p-4", className)}>
      <div className="flex items-center gap-3">
        <Avatar initials="VR" className="bg-lime/30" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Valentina Ríos</p>
          <p className="truncate text-xs text-quiet">Consultó desde tu sitio</p>
        </div>
        <Tag tone="lime">Nueva</Tag>
      </div>
      <p className="rounded-lg bg-mist px-3 py-2 text-[13px] leading-snug text-ink/85">
        Hola, ¿la casa de La Barra está libre la última semana de octubre? Somos
        cuatro.
      </p>
    </div>
  );
}

export function OfferSeenFragment({ className }: { className?: string }) {
  return (
    <div className={cn(FRAGMENT, "flex items-center gap-3 p-3", className)}>
      <PropertyPhoto photo="laBarra" className="size-12 shrink-0 rounded-lg" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">
          Casa frente al mar en La Barra
        </p>
        <p className="text-xs text-quiet tabular-nums">
          24 – 31 oct · USD 4.200
        </p>
      </div>
      <Tag tone="mist">
        <Eye className="size-3" />
        Vista
      </Tag>
    </div>
  );
}

export function BookingFragment({ className }: { className?: string }) {
  return (
    <div className={cn(FRAGMENT, "flex flex-col gap-3 p-4", className)}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold">Reserva confirmada</p>
        <Tag tone="forest">
          <Check className="size-3" />
          Confirmada
        </Tag>
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs">
        {[
          ["Check-in", "24 oct"],
          ["Check-out", "31 oct"],
          ["Noches", "7"],
        ].map(([label, value]) => (
          <div key={label} className="flex flex-col gap-0.5">
            <span className="text-quiet">{label}</span>
            <span className="font-medium tabular-nums">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PaymentFragment({ className }: { className?: string }) {
  return (
    <div className={cn(FRAGMENT, "flex flex-col gap-2.5 p-4", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-semibold">Anticipo cobrado</p>
        <p className="font-logo text-lg font-semibold tabular-nums">
          USD 1.260
        </p>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-mist">
        <div className="h-full w-[30%] rounded-full bg-forest" />
      </div>
      <p className="text-xs text-quiet tabular-nums">
        Faltan USD 2.940 · comisión USD 420
      </p>
    </div>
  );
}

/* ── Flow screens ───────────────────────────────────────── */

export function ClientsFragment() {
  const rows = [
    [
      "VR",
      "Valentina Ríos",
      "Entró desde tu sitio hace 3 min",
      "Nueva",
      "lime",
    ],
    [
      "ME",
      "Martín Echeverría",
      "Le mandaste la ficha con las expensas",
      "Contactado",
      "mist",
    ],
    ["CD", "Camila Duarte", "Visita el sábado a las 11", "Negociando", "amber"],
    ["JB", "Joaquín Benítez", "Firmó el boleto del local", "Cliente", "forest"],
  ] as const;
  return (
    <div className={cn(FRAGMENT, "divide-y divide-line")}>
      <div className="flex items-center gap-2 px-4 py-3 text-xs text-quiet">
        <Search className="size-3.5" />
        Buscar clientes
      </div>
      {rows.map(([initials, name, note, stage, tone]) => (
        <div key={name} className="flex items-center gap-3 px-4 py-3">
          <Avatar initials={initials} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">{name}</p>
            <p className="truncate text-xs text-quiet">{note}</p>
          </div>
          <Tag tone={tone}>{stage}</Tag>
        </div>
      ))}
    </div>
  );
}

export function TimelineFragment() {
  const events = [
    [
      "Llamada",
      "Hace 2 días",
      "Quedamos en coordinar una segunda visita para el sábado.",
    ],
    [
      "Visita",
      "Hace 6 días",
      "Recorrió la casa de Olivos. Le gustó el jardín, le preocupan las expensas.",
    ],
    [
      "Email",
      "Hace 11 días",
      "Le mandamos las tres propiedades de zona norte.",
    ],
  ];
  return (
    <div className={cn(FRAGMENT, "grid sm:grid-cols-[1fr_13rem]")}>
      <div className="flex flex-col gap-5 p-5">
        <div className="flex items-center gap-3">
          <Avatar initials="VR" className="size-11 bg-lime/30 text-sm" />
          <div>
            <p className="font-logo text-lg font-semibold leading-tight">
              Valentina Ríos
            </p>
            <p className="text-xs text-quiet">Cliente desde septiembre</p>
          </div>
        </div>
        <ol className="relative flex flex-col gap-4 border-l border-line pl-5">
          {events.map(([type, when, text]) => (
            <li key={type} className="relative">
              <span className="absolute top-1.5 -left-[1.5625rem] size-2 rounded-full bg-forest" />
              <p className="text-xs text-quiet">
                <span className="font-medium text-ink">{type}</span> · {when}
              </p>
              <p className="text-[13px] leading-snug text-ink/85">{text}</p>
            </li>
          ))}
        </ol>
      </div>
      <div className="flex flex-col gap-3 border-t border-line p-5 text-xs sm:border-t-0 sm:border-l">
        <p className="text-quiet">Etapa</p>
        <div className="flex flex-wrap gap-1">
          <Tag tone="mist">Nueva</Tag>
          <Tag tone="mist">Contactado</Tag>
          <Tag tone="forest">Negociando</Tag>
        </div>
        <p className="mt-2 text-quiet">Contacto</p>
        <p className="flex items-center gap-2">
          <Mail className="size-3.5 text-quiet" /> valentina@correo.com
        </p>
        <p className="flex items-center gap-2 tabular-nums">
          <Phone className="size-3.5 text-quiet" /> +54 9 11 5532-1180
        </p>
      </div>
    </div>
  );
}

const OFFER_PHOTOS: PhotoName[] = ["olivos", "vicenteLopez", "belgrano"];

export function OfferFragment() {
  const items = [
    ["Casa en Olivos", "USD 285.000", "−3 %"],
    ["Casa en Vicente López", "USD 310.000", "−5 %"],
    ["Departamento en Belgrano", "USD 198.000", ""],
  ];
  return (
    <div className={cn(FRAGMENT, "grid sm:grid-cols-[1fr_14rem]")}>
      <div className="flex flex-col gap-1 p-5">
        <p className="mb-2 font-logo text-lg font-semibold leading-tight">
          Tres opciones en zona norte
        </p>
        {items.map(([title, price, discount], index) => (
          <div
            key={title}
            className="flex items-center gap-3 border-t border-line py-2.5"
          >
            <PropertyPhoto
              photo={OFFER_PHOTOS[index]}
              className="size-11 shrink-0 rounded-md"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{title}</p>
              <p className="text-xs text-quiet tabular-nums">{price}</p>
            </div>
            {discount && <Tag tone="lime">{discount}</Tag>}
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3 border-t border-line bg-mist/50 p-5 text-xs sm:border-t-0 sm:border-l">
        <p className="text-quiet">Total de la oferta</p>
        <p className="font-logo text-2xl leading-none font-semibold tabular-nums">
          USD 765.100
        </p>
        <p className="mt-2 flex items-center gap-1.5">
          <Eye className="size-3.5 text-forest" /> La abrió hace 5 minutos
        </p>
        <p className="flex items-center gap-1.5">
          <CalendarDays className="size-3.5 text-quiet" /> Vence el 30 de
          octubre
        </p>
      </div>
    </div>
  );
}

export function SaleBookingFragment() {
  return (
    <div className={cn(FRAGMENT, "grid sm:grid-cols-[1fr_14rem]")}>
      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-center gap-3">
          <PropertyPhoto
            photo="olivos"
            className="size-14 shrink-0 rounded-lg"
          />
          <div className="min-w-0">
            <p className="font-logo text-lg font-semibold leading-tight">
              Casa en Olivos
            </p>
            <p className="text-xs text-quiet">
              Valentina Ríos · creada desde la oferta
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 border-t border-line pt-4 text-xs">
          {[
            ["Precio", "USD 276.450"],
            ["Comisión", "3 %"],
            ["Agente", "Rodrigo Sosa"],
          ].map(([label, value]) => (
            <div key={label} className="flex flex-col gap-0.5">
              <span className="text-quiet">{label}</span>
              <span className="font-medium tabular-nums">{value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col justify-center gap-2 border-t border-line p-5 sm:border-t-0 sm:border-l">
        <Tag tone="forest">
          <Check className="size-3" /> Reservada
        </Tag>
        <p className="text-xs text-quiet">
          Cliente, propiedad y precio vinieron cargados de la oferta.
        </p>
      </div>
    </div>
  );
}

export function PaymentsFragment({
  commission = true,
}: {
  commission?: boolean;
}) {
  const rows = [
    ["Anticipo", "9 oct", "USD 1.260", true],
    ["Saldo", "Al check-in", "USD 2.940", false],
  ] as const;
  return (
    <div className={cn(FRAGMENT, "grid sm:grid-cols-[1fr_14rem]")}>
      <div className="flex flex-col p-5">
        <p className="mb-3 font-logo text-lg font-semibold leading-tight">
          Pagos de la reserva
        </p>
        {rows.map(([label, when, amount, paid]) => (
          <div
            key={label}
            className="flex items-center gap-3 border-t border-line py-3"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{label}</p>
              <p className="text-xs text-quiet">{when}</p>
            </div>
            <span className="text-sm tabular-nums">{amount}</span>
            {paid ? (
              <Tag tone="forest">
                <Check className="size-3" /> Cobrado
              </Tag>
            ) : (
              <Tag tone="amber">Pendiente</Tag>
            )}
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2 border-t border-line bg-mist/50 p-5 text-xs sm:border-t-0 sm:border-l">
        {[
          ["Total", "USD 4.200"],
          ...(commission ? [["Comisión", "USD 420"]] : []),
          ["Cobrado", "USD 1.260"],
          ["Por cobrar", "USD 2.940"],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between gap-2">
            <span className="text-quiet">{label}</span>
            <span className="font-medium tabular-nums">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CalendarFragment() {
  // January 2027 starts on a Friday: four blank cells, then days 1 to 31.
  const days = Array.from({ length: 35 }, (_, index) => index - 3);
  const booked = new Set([1, 2, 3, 4, 5, 6, 7, 18, 19, 20, 21]);
  const high = new Set([8, 9, 10, 11, 12, 13, 14, 15, 16, 17]);
  return (
    <div className={cn(FRAGMENT, "grid sm:grid-cols-[1fr_14rem]")}>
      <div className="flex flex-col gap-3 p-5">
        <p className="font-logo text-lg font-semibold">Enero 2027</p>
        <div className="grid grid-cols-7 gap-1 text-center text-[11px]">
          {["L", "M", "M", "J", "V", "S", "D"].map((day, index) => (
            <span key={index} className="py-1 text-quiet">
              {day}
            </span>
          ))}
          {days.map((day) => {
            const blank = day < 1 || day > 31;
            return (
              <span
                key={day}
                className={cn(
                  "flex h-8 items-center justify-center rounded-md tabular-nums",
                  blank && "text-transparent",
                  !blank && "bg-mist/60",
                  booked.has(day) && "bg-forest text-paper",
                  high.has(day) && "bg-lime/25 text-forest",
                )}
              >
                {day}
              </span>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-3 border-t border-line p-5 text-xs sm:border-t-0 sm:border-l">
        <p className="text-quiet">Tarifas por noche</p>
        {[
          ["Temporada alta", "USD 600", "bg-lime"],
          ["Temporada media", "USD 420", "bg-mist ring-1 ring-line"],
          ["Reservado", "", "bg-forest"],
        ].map(([label, value, swatch]) => (
          <div key={label} className="flex items-center gap-2">
            <span className={cn("size-2.5 rounded-sm", swatch)} />
            <span className="flex-1">{label}</span>
            <span className="font-medium tabular-nums">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Portals ────────────────────────────────────────────── */

const SITE_PHOTOS: PhotoName[] = ["laBarra", "palermo"];

export function AgencySiteFragment() {
  const items = [
    ["Casa frente al mar", "La Barra, Maldonado", "USD 485.000"],
    ["Departamento con vista", "Palermo, Buenos Aires", "USD 1.250 / mes"],
  ];
  return (
    <div className={cn(FRAGMENT, "overflow-hidden")}>
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <p className="font-logo text-base font-semibold">Cabrera Propiedades</p>
        <p className="flex items-center gap-1.5 text-xs text-quiet">
          <Globe className="size-3.5" /> cabrerapropiedades.com
        </p>
      </div>
      <div className="relative flex flex-col gap-3 px-5 pt-16 pb-5">
        <PropertyPhoto
          photo="coast"
          sizes="(min-width: 1024px) 560px, 90vw"
          className="absolute! inset-0"
        />
        <span
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/45 to-black/0"
        />
        <p className="relative font-logo text-2xl leading-none font-semibold text-white">
          Encontrá tu lugar.
        </p>
        <div className="relative flex h-10 max-w-sm items-center gap-2 rounded-lg bg-white px-3 text-xs text-quiet">
          <Search className="size-3.5" /> Zona, tipo de propiedad o precio
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 p-5">
        {items.map(([title, place, price], index) => (
          <div key={title} className="flex flex-col gap-2">
            <PropertyPhoto
              photo={SITE_PHOTOS[index]}
              sizes="(min-width: 1024px) 280px, 45vw"
              className="aspect-[4/3] rounded-lg"
            />
            <div>
              <p className="text-sm font-semibold leading-tight">{title}</p>
              <p className="text-xs text-quiet">{place}</p>
              <p className="mt-1 text-sm tabular-nums">{price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function OwnerFragment() {
  return (
    <div className={cn(FRAGMENT, "flex flex-col")}>
      <div className="border-b border-line px-5 py-4">
        <p className="text-xs text-quiet">Hola, Roberto</p>
        <p className="font-logo text-lg font-semibold">Tus propiedades</p>
      </div>
      <div className="flex items-center gap-3 px-5 py-4">
        <PropertyPhoto
          photo="laBarra"
          className="size-14 shrink-0 rounded-lg"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">
            Casa frente al mar en La Barra
          </p>
          <p className="text-xs text-quiet">2 reservas este mes</p>
        </div>
      </div>
      {[
        ["24 – 31 oct", "USD 4.200", "Confirmada", "forest"],
        ["12 – 15 nov", "USD 1.800", "Pendiente", "amber"],
      ].map(([dates, amount, status, tone]) => (
        <div
          key={dates}
          className="flex items-center gap-3 border-t border-line px-5 py-3 text-sm"
        >
          <span className="flex-1 tabular-nums">Reserva {dates}</span>
          <span className="text-quiet tabular-nums">{amount}</span>
          <Tag tone={tone as "forest" | "amber"}>{status}</Tag>
        </div>
      ))}
    </div>
  );
}
