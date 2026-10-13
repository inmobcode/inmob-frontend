"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import {
  CheckCheck,
  Inbox,
  Mail,
  MessageCircle,
  Phone,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/client";
import {
  type Inquiry,
  listInquiries,
  markAllInquiriesRead,
  markInquiry,
} from "@/lib/api/inquiries";
import { getAccessToken } from "@/lib/auth/session";
import { whatsappLink } from "@/lib/site-theme";
import { cn } from "@/lib/utils";

function requireToken() {
  const token = getAccessToken();
  if (!token) throw new ApiError("No autenticado", 401);
  return token;
}

type Filter = "new" | "all";

/** What the person asked about, in a few words. */
function subject(inquiry: Inquiry) {
  if (inquiry.property) return `Consultó por ${inquiry.property.title}`;
  if (inquiry.offer) return `Respondió a la oferta ${inquiry.offer.title}`;
  return "Consulta general desde tu portal";
}

const ACTION =
  "inline-flex h-9 items-center gap-1.5 rounded-full bg-foreground/[0.06] px-3.5 text-sm font-medium outline-none transition-colors hover:bg-foreground/10 focus-visible:ring-3 focus-visible:ring-ring/50";

function InquiryItem({
  inquiry,
  expanded,
  onToggle,
  onMark,
}: {
  inquiry: Inquiry;
  expanded: boolean;
  onToggle: () => void;
  onMark: (read: boolean) => void;
}) {
  const unread = !inquiry.readAt;
  const when = formatDistanceToNow(new Date(inquiry.createdAt), {
    addSuffix: true,
    locale: es,
  });
  const about =
    inquiry.property?.title ?? inquiry.offer?.title ?? "tu consulta";
  const replySubject = encodeURIComponent(`Re: ${about}`);

  return (
    <li
      className={cn(
        "rounded-2xl bg-card ring-1 transition-shadow",
        unread ? "ring-primary/25" : "ring-foreground/5",
      )}
    >
      <button
        type="button"
        aria-expanded={expanded}
        onClick={onToggle}
        className="flex w-full items-start gap-4 rounded-2xl p-5 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <span
          aria-hidden
          className={cn(
            "mt-2 size-2 shrink-0 rounded-full",
            unread ? "bg-primary" : "bg-transparent",
          )}
        />
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <span
              className={cn(
                "text-base",
                unread ? "font-semibold" : "font-medium",
              )}
            >
              {inquiry.name}
              {unread && <span className="sr-only"> (nueva)</span>}
            </span>
            <span className="text-sm text-muted-foreground">{when}</span>
          </span>
          <span className="text-sm text-muted-foreground">
            {subject(inquiry)}
          </span>
          {!expanded && inquiry.message && (
            <span className="mt-1 line-clamp-1 text-sm text-foreground/80">
              {inquiry.message}
            </span>
          )}
        </span>
      </button>

      {expanded && (
        <div className="flex flex-col gap-5 border-t border-border px-5 pt-5 pb-5 sm:pl-11">
          {inquiry.message ? (
            <p className="max-w-prose leading-relaxed text-pretty whitespace-pre-line">
              {inquiry.message}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">No dejó mensaje.</p>
          )}

          <dl className="grid gap-x-8 gap-y-2 text-sm sm:grid-cols-[auto_1fr]">
            <dt className="text-muted-foreground">Email</dt>
            <dd>
              <a
                href={`mailto:${inquiry.email}`}
                className="underline-offset-4 hover:underline"
              >
                {inquiry.email}
              </a>
            </dd>
            {inquiry.phone && (
              <>
                <dt className="text-muted-foreground">Teléfono</dt>
                <dd className="tabular-nums">{inquiry.phone}</dd>
              </>
            )}
          </dl>

          <div className="flex flex-wrap gap-2">
            <a
              href={`mailto:${inquiry.email}?subject=${replySubject}`}
              className={ACTION}
            >
              <Mail className="size-4" />
              Responder por email
            </a>
            {inquiry.phone && (
              <>
                <a
                  href={whatsappLink(inquiry.phone)}
                  target="_blank"
                  rel="noreferrer"
                  className={ACTION}
                >
                  <MessageCircle className="size-4" />
                  WhatsApp
                </a>
                <a
                  href={`tel:${inquiry.phone.replace(/[^\d+]/g, "")}`}
                  className={ACTION}
                >
                  <Phone className="size-4" />
                  Llamar
                </a>
              </>
            )}
            {inquiry.client && (
              <Link href={`/clients/${inquiry.client.id}`} className={ACTION}>
                Ver cliente
              </Link>
            )}
            {inquiry.property && (
              <Link
                href={`/properties/${inquiry.property.id}`}
                className={ACTION}
              >
                Ver propiedad
              </Link>
            )}
            {inquiry.offer && (
              <Link href={`/offers/${inquiry.offer.id}`} className={ACTION}>
                Ver oferta
              </Link>
            )}
            <button
              type="button"
              onClick={() => onMark(unread)}
              className="inline-flex h-9 items-center rounded-full px-3.5 text-sm text-muted-foreground outline-none hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {unread ? "Marcar como leída" : "Marcar como nueva"}
            </button>
          </div>
        </div>
      )}
    </li>
  );
}

/**
 * Every question that arrived from the portal, a property page or an offer,
 * newest first. Opening one marks it read; the sidebar shows how many are new.
 */
export default function InquiriesPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState<string | null>(null);

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["inquiries"],
    queryFn: () => listInquiries(requireToken()),
    refetchInterval: 60_000,
  });

  const all = data ?? [];
  const unreadCount = all.filter((inquiry) => !inquiry.readAt).length;
  const shown =
    filter === "new"
      ? all.filter((inquiry) => !inquiry.readAt || inquiry.id === open)
      : all;

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ["inquiries"] });
    queryClient.invalidateQueries({ queryKey: ["inquiries-unread"] });
  }

  const markMutation = useMutation({
    mutationFn: ({ id, read }: { id: string; read: boolean }) =>
      markInquiry(requireToken(), id, read),
    onMutate: ({ id, read }) => {
      // Reflect it right away; the server answer replaces it.
      queryClient.setQueryData<Inquiry[]>(["inquiries"], (current) =>
        current?.map((inquiry) =>
          inquiry.id === id
            ? { ...inquiry, readAt: read ? new Date().toISOString() : null }
            : inquiry,
        ),
      );
    },
    onSettled: refresh,
    onError: () => toast.error("No se pudo actualizar la consulta"),
  });

  const readAllMutation = useMutation({
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

  function toggle(inquiry: Inquiry) {
    const next = open === inquiry.id ? null : inquiry.id;
    setOpen(next);
    if (next && !inquiry.readAt)
      markMutation.mutate({ id: inquiry.id, read: true });
  }

  return (
    <div className="flex max-w-4xl flex-col gap-6">
      <h1 className="sr-only">Consultas</h1>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="radiogroup"
          aria-label="Mostrar"
          className="flex gap-1 rounded-full bg-foreground/[0.06] p-1"
        >
          {(
            [
              ["all", "Todas"],
              ["new", unreadCount > 0 ? `Nuevas · ${unreadCount}` : "Nuevas"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={filter === value}
              onClick={() => setFilter(value)}
              className={cn(
                "h-9 rounded-full px-4 text-sm font-medium tabular-nums outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
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
          <Button
            variant="ghost"
            className="gap-1.5 rounded-full"
            onClick={() => readAllMutation.mutate()}
            disabled={readAllMutation.isPending}
          >
            <CheckCheck />
            Marcar todas como leídas
          </Button>
        )}
      </div>

      {error ? (
        <div className="flex flex-col items-start gap-4 rounded-2xl bg-card p-6 ring-1 ring-foreground/5">
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
      ) : isLoading ? (
        <ul className="flex animate-pulse flex-col gap-3" aria-hidden>
          {[0, 1, 2].map((index) => (
            <li key={index} className="h-24 rounded-2xl bg-muted" />
          ))}
        </ul>
      ) : shown.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-card px-6 py-14 text-center ring-1 ring-foreground/5">
          <span className="flex size-12 items-center justify-center rounded-full bg-foreground/[0.06] text-muted-foreground">
            <Inbox className="size-5" />
          </span>
          {filter === "new" && all.length > 0 ? (
            <>
              <p className="font-display text-2xl">No tenés consultas nuevas</p>
              <p className="max-w-sm text-sm text-pretty text-muted-foreground">
                Las que lleguen aparecen acá y en el menú.
              </p>
              <Button
                variant="outline"
                className="mt-2 rounded-full"
                onClick={() => setFilter("all")}
              >
                Ver todas
              </Button>
            </>
          ) : (
            <>
              <p className="font-display text-2xl">
                Todavía no llegó ninguna consulta
              </p>
              <p className="max-w-sm text-sm text-pretty text-muted-foreground">
                Cuando alguien consulte desde tu portal o desde una oferta, la
                vas a ver acá y te llega un aviso por email.
              </p>
              <Button variant="outline" className="mt-2 rounded-full" asChild>
                <Link href="/portal">Ir a tu portal</Link>
              </Button>
            </>
          )}
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {shown.map((inquiry) => (
            <InquiryItem
              key={inquiry.id}
              inquiry={inquiry}
              expanded={open === inquiry.id}
              onToggle={() => toggle(inquiry)}
              onMark={(read) => markMutation.mutate({ id: inquiry.id, read })}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
