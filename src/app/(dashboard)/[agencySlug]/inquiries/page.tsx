"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  differenceInCalendarDays,
  format,
  formatDistanceToNow,
  isToday,
  isYesterday,
} from "date-fns";
import { es } from "date-fns/locale";
import {
  Building2,
  CheckCheck,
  ChevronLeft,
  Copy,
  Globe,
  Inbox,
  Mail,
  MailOpen,
  MessageCircle,
  Phone,
  RotateCcw,
  Search,
  Tag,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { HelpHint, HelpLink } from "@/components/docs/help-link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api/client";
import type { ClientStage } from "@/lib/api/clients";
import {
  type Inquiry,
  listInquiries,
  markAllInquiriesRead,
  markInquiry,
} from "@/lib/api/inquiries";
import { getAccessToken } from "@/lib/auth/session";
import { CLIENT_STAGE_LABELS } from "@/lib/properties-labels";
import { whatsappLink } from "@/lib/site-theme";
import { cn } from "@/lib/utils";
import { IMAGE_WIDTH, sizedImage } from "@/lib/image-url";

function requireToken() {
  const token = getAccessToken();
  if (!token) throw new ApiError("No autenticado", 401);
  return token;
}

type Filter = "all" | "new";

function initials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "?"
  );
}

/** What it was about, as a short line: the listing, the offer, or a general question. */
function about(inquiry: Inquiry) {
  return inquiry.property?.title ?? inquiry.offer?.title ?? "Consulta general";
}

/** "12 min", "14:35", "Ayer", "lun", "3 oct": short enough for the list. */
function shortTime(iso: string) {
  const date = new Date(iso);
  const minutes = Math.round((Date.now() - date.getTime()) / 60_000);
  if (minutes < 1) return "Ahora";
  if (minutes < 60) return `${minutes} min`;
  if (isToday(date)) return format(date, "HH:mm");
  if (isYesterday(date)) return "Ayer";
  if (differenceInCalendarDays(new Date(), date) < 7)
    return format(date, "EEE", { locale: es });
  return format(date, "d MMM", { locale: es });
}

function groupOf(iso: string) {
  const date = new Date(iso);
  if (isToday(date)) return "Hoy";
  if (isYesterday(date)) return "Ayer";
  if (differenceInCalendarDays(new Date(), date) < 7) return "Esta semana";
  return "Anteriores";
}

const SECONDARY =
  "inline-flex h-10 items-center gap-2 rounded-full bg-foreground/[0.06] px-4 text-sm font-medium outline-none transition-colors hover:bg-foreground/10 focus-visible:ring-3 focus-visible:ring-ring/50";

function InquiryRow({
  inquiry,
  selected,
  onSelect,
}: {
  inquiry: Inquiry;
  selected: boolean;
  onSelect: () => void;
}) {
  const unread = !inquiry.readAt;
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        aria-current={selected ? "true" : undefined}
        className={cn(
          "flex w-full gap-3 px-4 py-3.5 text-left outline-none transition-colors focus-visible:bg-foreground/[0.05]",
          selected ? "bg-primary/[0.07]" : "hover:bg-foreground/[0.03]",
        )}
      >
        <span className="relative mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
          {initials(inquiry.name)}
          {unread && (
            <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-primary ring-2 ring-card">
              <span className="sr-only">Nueva</span>
            </span>
          )}
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="flex items-baseline justify-between gap-3">
            <span
              className={cn(
                "truncate text-sm",
                unread ? "font-semibold" : "font-medium",
              )}
            >
              {inquiry.name}
            </span>
            <span
              className={cn(
                "shrink-0 text-xs tabular-nums",
                unread
                  ? "font-medium text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {shortTime(inquiry.createdAt)}
            </span>
          </span>
          <span
            className={cn(
              "truncate text-sm",
              unread ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {about(inquiry)}
          </span>
          {inquiry.message && (
            <span className="truncate text-xs text-muted-foreground">
              {inquiry.message}
            </span>
          )}
        </span>
      </button>
    </li>
  );
}

function InquiryDetail({
  inquiry,
  onBack,
  onMark,
}: {
  inquiry: Inquiry;
  onBack: () => void;
  onMark: (read: boolean) => void;
}) {
  const { agencySlug } = useParams<{ agencySlug: string }>();
  const created = new Date(inquiry.createdAt);
  const stage = inquiry.client?.stage as ClientStage | undefined;
  const replySubject = encodeURIComponent(`Re: ${about(inquiry)}`);
  const firstName = inquiry.name.split(" ")[0];
  const replyBody = encodeURIComponent(`Hola ${firstName},\n\n`);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(inquiry.email);
      toast.success("Email copiado");
    } catch {
      toast.error("No se pudo copiar el email");
    }
  }

  return (
    <article className="flex min-h-full flex-col">
      <header className="flex items-start gap-4 border-b border-border p-5 sm:p-6">
        <button
          type="button"
          onClick={onBack}
          aria-label="Volver a la lista"
          className="-ml-2 flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground outline-none hover:bg-foreground/[0.06] focus-visible:ring-3 focus-visible:ring-ring/50 lg:hidden"
        >
          <ChevronLeft className="size-5" />
        </button>
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
          {initials(inquiry.name)}
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-2xl leading-tight">
              {inquiry.name}
            </h2>
            {stage && CLIENT_STAGE_LABELS[stage] && (
              <span className="rounded-full bg-foreground/[0.06] px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                {CLIENT_STAGE_LABELS[stage]}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            <time dateTime={inquiry.createdAt}>
              {format(created, "d 'de' MMMM, HH:mm", { locale: es })}
            </time>{" "}
            · {formatDistanceToNow(created, { addSuffix: true, locale: es })}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onMark(!inquiry.readAt)}
          title={inquiry.readAt ? "Marcar como nueva" : "Marcar como leída"}
          aria-label={
            inquiry.readAt ? "Marcar como nueva" : "Marcar como leída"
          }
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground outline-none hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {inquiry.readAt ? (
            <Mail className="size-4" />
          ) : (
            <MailOpen className="size-4" />
          )}
        </button>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-5 sm:p-6">
        {inquiry.property ? (
          <Link
            href={`/${agencySlug}/properties/${inquiry.property.id}`}
            className="group flex items-center gap-4 rounded-2xl p-2 pr-4 ring-1 ring-foreground/10 outline-none transition-colors hover:bg-foreground/[0.03] focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <span className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-secondary text-primary/40">
              {inquiry.property.coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={sizedImage(inquiry.property.coverUrl, IMAGE_WIDTH.thumb)}
                  alt=""
                  className="size-full object-cover"
                />
              ) : (
                <Building2 className="size-6" strokeWidth={1.5} />
              )}
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="text-xs text-muted-foreground">
                Consultó por
              </span>
              <span className="truncate font-medium group-hover:underline">
                {inquiry.property.title}
              </span>
            </span>
          </Link>
        ) : inquiry.offer ? (
          <Link
            href={`/${agencySlug}/offers/${inquiry.offer.id}`}
            className="group flex items-center gap-4 rounded-2xl p-2 pr-4 ring-1 ring-foreground/10 outline-none transition-colors hover:bg-foreground/[0.03] focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <span className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary/60">
              <Tag className="size-6" strokeWidth={1.5} />
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="text-xs text-muted-foreground">
                Respondió a la oferta
              </span>
              <span className="truncate font-medium group-hover:underline">
                {inquiry.offer.title}
              </span>
            </span>
          </Link>
        ) : (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Globe className="size-4" />
            Consulta general desde tu portal
          </p>
        )}

        {inquiry.message ? (
          <blockquote className="max-w-prose rounded-2xl bg-foreground/[0.04] px-5 py-4 text-base leading-relaxed text-pretty whitespace-pre-line">
            {inquiry.message}
          </blockquote>
        ) : (
          <p className="text-sm text-muted-foreground">No dejó mensaje.</p>
        )}

        <dl className="grid max-w-prose gap-x-6 gap-y-3 text-sm sm:grid-cols-[6rem_1fr]">
          <dt className="text-muted-foreground">Email</dt>
          <dd className="flex min-w-0 items-center gap-2">
            <a
              href={`mailto:${inquiry.email}`}
              className="truncate underline-offset-4 hover:underline"
            >
              {inquiry.email}
            </a>
            <button
              type="button"
              onClick={copyEmail}
              aria-label="Copiar email"
              className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <Copy className="size-3.5" />
            </button>
          </dd>
          {inquiry.phone && (
            <>
              <dt className="text-muted-foreground">Teléfono</dt>
              <dd className="tabular-nums">{inquiry.phone}</dd>
            </>
          )}
        </dl>

        <div className="mt-auto flex flex-wrap gap-2 border-t border-border pt-5">
          <Button asChild className="h-10 gap-2 rounded-full px-5">
            <a
              href={`mailto:${inquiry.email}?subject=${replySubject}&body=${replyBody}`}
            >
              <Mail />
              Responder por email
            </a>
          </Button>
          {inquiry.phone && (
            <>
              <a
                href={whatsappLink(
                  inquiry.phone,
                  `Hola ${firstName}, te escribo por tu consulta sobre ${about(inquiry)}.`,
                )}
                target="_blank"
                rel="noreferrer"
                className={SECONDARY}
              >
                <MessageCircle className="size-4" />
                WhatsApp
              </a>
              <a
                href={`tel:${inquiry.phone.replace(/[^\d+]/g, "")}`}
                className={SECONDARY}
              >
                <Phone className="size-4" />
                Llamar
              </a>
            </>
          )}
          {inquiry.client && (
            <Link
              href={`/${agencySlug}/clients/${inquiry.client.id}`}
              className={cn(SECONDARY, "sm:ml-auto")}
            >
              <UserRound className="size-4" />
              Ver cliente
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

/**
 * Every question that arrived from the portal, a listing or an offer, laid out
 * like a mail inbox: the list on the left grouped by day, the open one on the
 * right. On phones the two take turns. Opening one marks it read.
 */
export default function InquiriesPage() {
  const { agencySlug } = useParams<{ agencySlug: string }>();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["inquiries"],
    queryFn: () => listInquiries(requireToken()),
    refetchInterval: 60_000,
  });

  const all = useMemo(() => data ?? [], [data]);
  const unreadCount = all.filter((inquiry) => !inquiry.readAt).length;
  const selected = all.find((inquiry) => inquiry.id === selectedId) ?? null;

  const shown = useMemo(() => {
    const query = search.trim().toLowerCase();
    return all.filter((inquiry) => {
      // The open one stays in "Nuevas" after it's marked read, so it doesn't vanish under the cursor.
      if (filter === "new" && inquiry.readAt && inquiry.id !== selectedId)
        return false;
      if (!query) return true;
      return [
        inquiry.name,
        inquiry.email,
        inquiry.message,
        inquiry.property?.title,
        inquiry.offer?.title,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [all, filter, search, selectedId]);

  const groups = useMemo(() => {
    const result: { label: string; items: Inquiry[] }[] = [];
    for (const inquiry of shown) {
      const label = groupOf(inquiry.createdAt);
      const group = result.find((item) => item.label === label);
      if (group) group.items.push(inquiry);
      else result.push({ label, items: [inquiry] });
    }
    return result;
  }, [shown]);

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ["inquiries"] });
    queryClient.invalidateQueries({ queryKey: ["inquiries-unread"] });
  }

  const markMutation = useMutation({
    meta: { affectsSite: false },
    mutationFn: ({ id, read }: { id: string; read: boolean }) =>
      markInquiry(requireToken(), id, read),
    onMutate: ({ id, read }) => {
      const previous = queryClient.getQueryData<Inquiry[]>(["inquiries"]);
      queryClient.setQueryData<Inquiry[]>(["inquiries"], (current) =>
        current?.map((inquiry) =>
          inquiry.id === id
            ? { ...inquiry, readAt: read ? new Date().toISOString() : null }
            : inquiry,
        ),
      );
      return { previous };
    },
    onSettled: refresh,
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(["inquiries"], context.previous);
      toast.error("No se pudo actualizar la consulta");
    },
  });

  const readAllMutation = useMutation({
    meta: { affectsSite: false },
    mutationFn: () => markAllInquiriesRead(requireToken()),
    onSuccess: ({ updated }) => {
      refresh();
      toast.success(
        updated === 1
          ? "1 consulta marcada como leída"
          : `${updated} consultas marcadas como leídas`,
      );
    },
    onError: () => toast.error("No se pudieron marcar las consultas"),
  });

  function select(inquiry: Inquiry) {
    setSelectedId(inquiry.id);
    if (!inquiry.readAt) markMutation.mutate({ id: inquiry.id, read: true });
  }

  const panel = "overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/5";

  if (error) {
    return (
      <div className="flex max-w-xl flex-col items-start gap-4 rounded-2xl bg-card p-6 ring-1 ring-foreground/5">
        <h1 className="sr-only">Consultas</h1>
        <div>
          <p className="font-display text-xl">
            No pudimos cargar las consultas
          </p>
          <p className="text-sm text-muted-foreground">
            Revisá tu conexión e intentá de nuevo.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RotateCcw />
          Reintentar
        </Button>
      </div>
    );
  }

  if (!isLoading && all.length === 0) {
    return (
      <div
        className={cn(
          panel,
          "flex max-w-3xl flex-col items-center gap-3 px-6 py-16 text-center",
        )}
      >
        <h1 className="sr-only">Consultas</h1>
        <span className="flex size-12 items-center justify-center rounded-full bg-foreground/[0.06] text-muted-foreground">
          <Inbox className="size-5" />
        </span>
        <p className="font-display text-2xl">
          Todavía no llegó ninguna consulta
        </p>
        <p className="max-w-sm text-sm text-pretty text-muted-foreground">
          Cuando alguien consulte desde tu portal o desde una oferta, la vas a
          ver acá y te llega un aviso por email.
        </p>
        <Button variant="outline" className="mt-2 rounded-full" asChild>
          <Link href={`/${agencySlug}/portal`}>Ir a tu portal</Link>
        </Button>
        <HelpHint section="consultas">De dónde salen las consultas</HelpHint>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="sr-only">Consultas</h1>

      <div className="grid gap-4 lg:h-[calc(100svh-6rem)] lg:grid-cols-[minmax(19rem,25rem)_minmax(0,1fr)]">
        <section
          aria-label="Lista de consultas"
          className={cn(
            panel,
            "flex min-h-0 flex-col",
            selected && "max-lg:hidden",
          )}
        >
          <div className="flex flex-col gap-3 border-b border-border p-3">
            <div className="flex items-center gap-2">
              <div
                role="radiogroup"
                aria-label="Mostrar"
                className="flex flex-1 gap-1 rounded-full bg-foreground/[0.06] p-1"
              >
                {(
                  [
                    ["all", "Todas"],
                    [
                      "new",
                      unreadCount > 0 ? `Nuevas · ${unreadCount}` : "Nuevas",
                    ],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={filter === value}
                    onClick={() => setFilter(value)}
                    className={cn(
                      "h-8 flex-1 rounded-full px-3 text-sm font-medium tabular-nums outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
                      filter === value
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => readAllMutation.mutate()}
                  disabled={readAllMutation.isPending}
                  title="Marcar todas como leídas"
                  aria-label="Marcar todas como leídas"
                  className="flex size-10 shrink-0 items-center justify-center rounded-full text-muted-foreground outline-none hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
                >
                  <CheckCheck className="size-4" />
                </button>
              )}
              {/* Ghost, like the button beside it: this panel has no filled toolbar. */}
              <HelpLink
                section="consultas"
                label="Ayuda con consultas"
                className="bg-transparent hover:bg-foreground/[0.06] dark:bg-transparent dark:hover:bg-foreground/[0.06]"
              />
            </div>
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por nombre, email o propiedad"
                aria-label="Buscar consultas"
                className="h-10 rounded-full border-transparent bg-foreground/[0.06] pl-10 shadow-none"
              />
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {isLoading ? (
              <ul className="flex animate-pulse flex-col gap-1 p-3" aria-hidden>
                {[0, 1, 2, 3].map((index) => (
                  <li key={index} className="h-16 rounded-xl bg-muted" />
                ))}
              </ul>
            ) : groups.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
                <p className="font-medium">
                  {search
                    ? "Ninguna consulta coincide con la búsqueda"
                    : "No tenés consultas nuevas"}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setFilter("all");
                  }}
                  className="text-sm text-muted-foreground underline-offset-4 outline-none hover:text-foreground hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  Ver todas
                </button>
              </div>
            ) : (
              groups.map((group) => (
                <div key={group.label}>
                  <h2 className="sticky top-0 z-10 bg-card/95 px-4 pt-3 pb-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
                    {group.label}
                  </h2>
                  <ul className="divide-y divide-border/60">
                    {group.items.map((inquiry) => (
                      <InquiryRow
                        key={inquiry.id}
                        inquiry={inquiry}
                        selected={inquiry.id === selectedId}
                        onSelect={() => select(inquiry)}
                      />
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        </section>

        <section
          aria-label="Consulta"
          className={cn(
            panel,
            "min-h-0 overflow-y-auto",
            !selected && "max-lg:hidden",
          )}
        >
          {selected ? (
            <InquiryDetail
              key={selected.id}
              inquiry={selected}
              onBack={() => setSelectedId(null)}
              onMark={(read) => markMutation.mutate({ id: selected.id, read })}
            />
          ) : (
            <div className="flex h-full min-h-80 flex-col items-center justify-center gap-3 p-8 text-center text-muted-foreground">
              <Inbox className="size-8" strokeWidth={1.5} />
              <p className="text-sm">
                Elegí una consulta para leerla y responder.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
