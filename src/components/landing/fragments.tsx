import Image from "next/image";
import {
  CalendarDays,
  Bell,
  Check,
  Eye,
  Mail,
  Phone,
  Search,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { useFormat } from "@/i18n/format";
import { cn } from "@/lib/utils";

/** The sample deal's words, money and dates in the page's language. */
function useSample() {
  const t = useTranslations("landing.fragments");
  const { number, date } = useFormat();
  return {
    t,
    usd: (value: number) => `USD ${number(value)}`,
    /** A day of the sample deal, in October 2026 unless another month is given. */
    day: (dayOfMonth: number, month = 9) => date(new Date(2026, month, dayOfMonth), "dayMonthShort"),
  };
}

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
  const { t } = useSample();
  return (
    <div className={cn(FRAGMENT, "flex flex-col gap-3 p-4", className)}>
      <div className="flex items-center gap-3">
        <Avatar initials="VR" className="bg-lime/30" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Valentina Ríos</p>
          <p className="truncate text-xs text-quiet">{t("inquiry.source")}</p>
        </div>
        <Tag tone="lime">{t("new")}</Tag>
      </div>
      <p className="rounded-lg bg-mist px-3 py-2 text-[13px] leading-snug text-ink/85">
        {t("inquiry.message")}
      </p>
    </div>
  );
}

export function OfferSeenFragment({ className }: { className?: string }) {
  const { t, usd, day } = useSample();
  return (
    <div className={cn(FRAGMENT, "flex items-center gap-3 p-3", className)}>
      <PropertyPhoto photo="laBarra" className="size-12 shrink-0 rounded-lg" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">
          {t("offerSeen.title")}
        </p>
        <p className="text-xs text-quiet tabular-nums">
          {day(24)} – {day(31)} · {usd(4200)}
        </p>
      </div>
      <Tag tone="mist">
        <Eye className="size-3" />
        {t("offerSeen.seen")}
      </Tag>
    </div>
  );
}

export function BookingFragment({ className }: { className?: string }) {
  const { t, day } = useSample();
  return (
    <div className={cn(FRAGMENT, "flex flex-col gap-3 p-4", className)}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold">{t("booking.title")}</p>
        <Tag tone="forest">
          <Check className="size-3" />
          {t("booking.confirmed")}
        </Tag>
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs">
        {[
          [t("booking.checkIn"), day(24)],
          [t("booking.checkOut"), day(31)],
          [t("booking.nights"), "7"],
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
  const { t, usd } = useSample();
  return (
    <div className={cn(FRAGMENT, "flex flex-col gap-2.5 p-4", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-semibold">{t("payment.title")}</p>
        <p className="font-logo text-lg font-semibold tabular-nums">
          {usd(1260)}
        </p>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-mist">
        <div className="h-full w-[30%] rounded-full bg-forest" />
      </div>
      <p className="text-xs text-quiet tabular-nums">
        {t("payment.left", { left: usd(2940), commission: usd(420) })}
      </p>
    </div>
  );
}

/* ── Flow screens ───────────────────────────────────────── */

export function ClientsFragment() {
  const { t } = useSample();
  const tStage = useTranslations("labels.clientStage");
  const rows = [
    ["VR", "Valentina Ríos", "vr", "LEAD", "lime"],
    ["ME", "Martín Echeverría", "me", "CONTACTED", "mist"],
    ["CD", "Camila Duarte", "cd", "NEGOTIATING", "amber"],
    ["JB", "Joaquín Benítez", "jb", "CLIENT", "forest"],
  ] as const;
  return (
    <div className={cn(FRAGMENT, "divide-y divide-line")}>
      <div className="flex items-center gap-2 px-4 py-3 text-xs text-quiet">
        <Search className="size-3.5" />
        {t("clients.search")}
      </div>
      {rows.map(([initials, name, note, stage, tone]) => (
        <div key={name} className="flex items-center gap-3 px-4 py-3">
          <Avatar initials={initials} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">{name}</p>
            <p className="truncate text-xs text-quiet">{t(`clients.notes.${note}`)}</p>
          </div>
          <Tag tone={tone}>{tStage(stage)}</Tag>
        </div>
      ))}
    </div>
  );
}

export function TimelineFragment() {
  const { t } = useSample();
  const tStage = useTranslations("labels.clientStage");
  const events = [
    ["call", 2],
    ["visit", 6],
    ["email", 11],
  ] as const;
  return (
    <div className={cn(FRAGMENT, "grid sm:grid-cols-[1fr_13rem]")}>
      <div className="flex flex-col gap-5 p-5">
        <div className="flex items-center gap-3">
          <Avatar initials="VR" className="size-11 bg-lime/30 text-sm" />
          <div>
            <p className="font-logo text-lg font-semibold leading-tight">
              Valentina Ríos
            </p>
            <p className="text-xs text-quiet">{t("timeline.since")}</p>
          </div>
        </div>
        <ol className="relative flex flex-col gap-4 border-l border-line pl-5">
          {events.map(([type, days]) => (
            <li key={type} className="relative">
              <span className="absolute top-1.5 -left-[1.5625rem] size-2 rounded-full bg-forest" />
              <p className="text-xs text-quiet">
                <span className="font-medium text-ink">{t(`timeline.${type}.type`)}</span> ·{" "}
                {t("timeline.daysAgo", { count: days })}
              </p>
              <p className="text-[13px] leading-snug text-ink/85">{t(`timeline.${type}.text`)}</p>
            </li>
          ))}
        </ol>
      </div>
      <div className="flex flex-col gap-3 border-t border-line p-5 text-xs sm:border-t-0 sm:border-l">
        <p className="text-quiet">{t("timeline.stage")}</p>
        <div className="flex flex-wrap gap-1">
          <Tag tone="mist">{tStage("LEAD")}</Tag>
          <Tag tone="mist">{tStage("CONTACTED")}</Tag>
          <Tag tone="forest">{tStage("NEGOTIATING")}</Tag>
        </div>
        <p className="mt-2 text-quiet">{t("timeline.contact")}</p>
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
  const { t, usd, day } = useSample();
  const items = [
    ["olivos", 285000, "−3 %"],
    ["vicenteLopez", 310000, "−5 %"],
    ["belgrano", 198000, ""],
  ] as const;
  return (
    <div className={cn(FRAGMENT, "grid sm:grid-cols-[1fr_14rem]")}>
      <div className="flex flex-col gap-1 p-5">
        <p className="mb-2 font-logo text-lg font-semibold leading-tight">
          {t("offer.title")}
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
              <p className="truncate text-sm font-medium">{t(`offer.items.${title}`)}</p>
              <p className="text-xs text-quiet tabular-nums">{usd(price)}</p>
            </div>
            {discount && <Tag tone="lime">{discount}</Tag>}
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3 border-t border-line bg-mist/50 p-5 text-xs sm:border-t-0 sm:border-l">
        <p className="text-quiet">{t("offer.total")}</p>
        <p className="font-logo text-2xl leading-none font-semibold tabular-nums">
          {usd(765100)}
        </p>
        <p className="mt-2 flex items-center gap-1.5">
          <Eye className="size-3.5 text-forest" /> {t("offer.opened")}
        </p>
        <p className="flex items-center gap-1.5">
          <CalendarDays className="size-3.5 text-quiet" /> {t("offer.expires", { date: day(30) })}
        </p>
      </div>
    </div>
  );
}

export function SaleBookingFragment() {
  const { t, usd } = useSample();
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
              {t("offer.items.olivos")}
            </p>
            <p className="text-xs text-quiet">
              Valentina Ríos · {t("saleBooking.fromOffer")}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 border-t border-line pt-4 text-xs">
          {[
            [t("saleBooking.price"), usd(276450)],
            [t("saleBooking.commission"), "3 %"],
            [t("saleBooking.agent"), "Rodrigo Sosa"],
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
          <Check className="size-3" /> {t("saleBooking.reserved")}
        </Tag>
        <p className="text-xs text-quiet">{t("saleBooking.hint")}</p>
      </div>
    </div>
  );
}

export function PaymentsFragment({ variant = "rent" }: { variant?: "sale" | "rent" }) {
  const { t, usd, day } = useSample();
  // The sale is the same listing as the sale booking fragment: USD 276.450 with 3 % commission.
  const { title, rows, summary } = {
    sale: {
      title: t("payments.saleTitle"),
      rows: [
        [t("payments.deposit"), t("payments.onBooking"), usd(27645), true],
        [t("payments.balance"), t("payments.onDeed"), usd(248805), false],
      ],
      summary: [
        [t("payments.price"), usd(276450)],
        [t("payments.commission"), usd(8294)],
        [t("payments.collected"), usd(27645)],
        [t("payments.due"), usd(248805)],
      ],
    },
    rent: {
      title: t("payments.rentTitle"),
      rows: [
        [t("payments.deposit"), day(9), usd(1260), true],
        [t("payments.balance"), t("payments.onCheckIn"), usd(2940), false],
      ],
      summary: [
        [t("payments.nights"), "7"],
        [t("payments.total"), usd(4200)],
        [t("payments.collected"), usd(1260)],
        [t("payments.due"), usd(2940)],
      ],
    },
  }[variant] as {
    title: string;
    rows: [string, string, string, boolean][];
    summary: [string, string][];
  };
  return (
    <div className={cn(FRAGMENT, "grid sm:grid-cols-[1fr_14rem]")}>
      <div className="flex flex-col p-5">
        <p className="mb-3 font-logo text-lg font-semibold leading-tight">
          {title}
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
                <Check className="size-3" /> {t("payments.paid")}
              </Tag>
            ) : (
              <Tag tone="amber">{t("payments.pending")}</Tag>
            )}
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2 border-t border-line bg-mist/50 p-5 text-xs sm:border-t-0 sm:border-l">
        {summary.map(([label, value]) => (
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
  const { t, usd } = useSample();
  const { tag, date } = useFormat();
  // Monday 4 January 2027 and the six days after it, to name the weekdays.
  const week = Array.from({ length: 7 }, (_, index) => new Date(2027, 0, 4 + index));
  // January 2027 starts on a Friday: four blank cells, then days 1 to 31.
  const days = Array.from({ length: 35 }, (_, index) => index - 3);
  const booked = new Set([1, 2, 3, 4, 5, 6, 7, 18, 19, 20, 21]);
  const high = new Set([8, 9, 10, 11, 12, 13, 14, 15, 16, 17]);
  return (
    <div className={cn(FRAGMENT, "grid sm:grid-cols-[1fr_14rem]")}>
      <div className="flex flex-col gap-3 p-5">
        <p className="font-logo text-lg font-semibold first-letter:uppercase">
          {date(new Date(2027, 0, 1), "monthYear")}
        </p>
        <div className="grid grid-cols-7 gap-1 text-center text-[11px]">
          {week.map((day, index) => (
            <span key={index} className="py-1 text-quiet">
              {new Intl.DateTimeFormat(tag, { weekday: "narrow" }).format(day)}
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
        <p className="text-quiet">{t("calendar.rates")}</p>
        {[
          [t("calendar.high"), usd(600), "bg-lime"],
          [t("calendar.mid"), usd(420), "bg-mist ring-1 ring-line"],
          [t("calendar.booked"), "", "bg-forest"],
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

export function OwnerStatementFragment() {
  const { t, usd, day } = useSample();
  return (
    <div className={cn(FRAGMENT, "flex flex-col")}>
      <div className="border-b border-line px-5 py-4">
        <p className="text-xs text-quiet">{t("owner.title")}</p>
        <p className="font-logo text-lg font-semibold">{t("owner.property")}</p>
      </div>
      <div className="grid grid-cols-3 gap-3 px-5 py-4 text-xs">
        {[
          [t("owner.collected"), usd(8400)],
          [t("owner.paidOut"), usd(5600)],
          [t("owner.balance"), usd(2800)],
        ].map(([label, value]) => (
          <div key={label} className="flex flex-col gap-0.5">
            <span className="text-quiet">{label}</span>
            <span className="text-sm font-semibold tabular-nums">{value}</span>
          </div>
        ))}
      </div>
      {[
        [t("owner.payout"), day(2), usd(3000)],
        [t("owner.payout"), day(18, 8), usd(2600)],
      ].map(([label, when, amount]) => (
        <div
          key={when}
          className="flex items-center gap-3 border-t border-line px-5 py-3 text-sm"
        >
          <span className="flex-1">
            {label} <span className="text-quiet">· {when}</span>
          </span>
          <span className="tabular-nums">{amount}</span>
          <Tag tone="forest">
            <Check className="size-3" /> {t("owner.paid")}
          </Tag>
        </div>
      ))}
    </div>
  );
}

export function TasksFragment() {
  const { t } = useSample();
  const tasks = [
    [t("tasks.call"), t("tasks.today"), true],
    [t("tasks.photos"), t("tasks.tomorrow"), false],
  ] as const;
  return (
    <div className={cn(FRAGMENT, "flex flex-col")}>
      <div className="flex items-center gap-3 border-b border-line bg-mist/50 px-5 py-3">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-forest text-paper">
          <Bell className="size-3.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">
            {t("tasks.opened")}
          </p>
          <p className="text-xs text-quiet">{t("tasks.ago")}</p>
        </div>
        <Tag tone="lime">{t("new")}</Tag>
      </div>
      <p className="px-5 pt-4 pb-1 font-logo text-base font-semibold">
        {t("tasks.title")}
      </p>
      {tasks.map(([title, when, urgent]) => (
        <div
          key={title}
          className="flex items-center gap-3 border-t border-line px-5 py-3 first:border-t-0"
        >
          <span
            aria-hidden
            className="size-4 shrink-0 rounded border border-quiet/50"
          />
          <span className="min-w-0 flex-1 truncate text-sm">{title}</span>
          <Tag tone={urgent ? "amber" : "mist"}>{when}</Tag>
        </div>
      ))}
    </div>
  );
}
