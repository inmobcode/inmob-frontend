"use client";

import { useQuery } from "@tanstack/react-query";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { RotateCcw } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { TaskList } from "@/components/tasks/task-list";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/client";
import type { ClientStage } from "@/lib/api/clients";
import { getDashboardSummary, type DashboardSummary } from "@/lib/api/dashboard";
import { getAccessToken, useSessionUser } from "@/lib/auth/session";
import { CLIENT_STAGE_LABELS } from "@/lib/properties-labels";
import { cn } from "@/lib/utils";

const PANEL = "flex flex-col gap-4 rounded-2xl bg-card p-5 ring-1 ring-foreground/5 sm:p-6";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 6) return "Buenas noches";
  if (hour < 13) return "Buen día";
  if (hour < 20) return "Buenas tardes";
  return "Buenas noches";
}

function money(totals: Record<string, number>) {
  const entries = Object.entries(totals).filter(([, amount]) => amount > 0);
  if (entries.length === 0) return "—";
  return entries
    .map(([currency, amount]) =>
      new Intl.NumberFormat("es-AR", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount),
    )
    .join(" · ");
}

function plural(count: number, one: string, many: string) {
  return `${count} ${count === 1 ? one : many}`;
}

/** What to look at first, in one sentence. */
function headline(summary: DashboardSummary) {
  const { unreadInquiries, overdueTasks, upcomingCheckIns } = summary.counts;
  const parts: string[] = [];
  if (unreadInquiries > 0) parts.push(plural(unreadInquiries, "consulta sin leer", "consultas sin leer"));
  if (overdueTasks > 0) parts.push(plural(overdueTasks, "tarea vencida", "tareas vencidas"));
  if (upcomingCheckIns > 0) parts.push(plural(upcomingCheckIns, "check-in en los próximos días", "check-ins en los próximos días"));
  if (parts.length === 0) return "Todo al día: no hay nada urgente.";
  return `Tenés ${parts.join(", ")}.`;
}

function Figure({
  href,
  value,
  label,
  note,
  alert = false,
}: {
  href: string;
  value: React.ReactNode;
  label: string;
  note?: string;
  alert?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-1 px-5 py-5 outline-none transition-colors hover:bg-foreground/[0.03] focus-visible:bg-foreground/[0.05] sm:px-6"
    >
      <span className={cn("font-display text-4xl leading-none tracking-tight tabular-nums", alert && "text-destructive")}>
        {value}
      </span>
      <span className="text-sm text-foreground/80">{label}</span>
      {note && <span className="text-xs text-muted-foreground">{note}</span>}
    </Link>
  );
}

function Funnel({ funnel, href }: { funnel: DashboardSummary["funnel"]; href: string }) {
  const stages = Object.keys(CLIENT_STAGE_LABELS) as ClientStage[];
  const max = Math.max(1, ...stages.map((stage) => funnel[stage] ?? 0));
  return (
    <ul className="flex flex-col gap-3">
      {stages.map((stage) => {
        const count = funnel[stage] ?? 0;
        return (
          <li key={stage}>
            <Link href={href} className="group flex flex-col gap-1.5 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
              <span className="flex items-baseline justify-between text-sm">
                <span>{CLIENT_STAGE_LABELS[stage]}</span>
                <span className="font-medium tabular-nums">{count}</span>
              </span>
              <span className="h-2 overflow-hidden rounded-full bg-foreground/[0.06]">
                <span
                  className={cn(
                    "block h-full rounded-full transition-[width] duration-500",
                    stage === "LOST" ? "bg-foreground/25" : "bg-primary",
                  )}
                  style={{ width: `${(count / max) * 100}%`, minWidth: count > 0 ? "0.5rem" : 0 }}
                />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function Skeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-8">
      <div className="flex flex-col gap-3">
        <div className="h-9 w-72 rounded-full bg-muted" />
        <div className="h-4 w-96 max-w-full rounded-full bg-muted" />
      </div>
      <div className="h-28 rounded-2xl bg-muted" />
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="h-80 rounded-2xl bg-muted lg:col-span-7" />
        <div className="h-80 rounded-2xl bg-muted lg:col-span-5" />
      </div>
    </div>
  );
}

export function HomeView() {
  const { agencySlug } = useParams<{ agencySlug: string }>();
  const user = useSessionUser();
  const base = `/${agencySlug}`;

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return getDashboardSummary(token);
    },
    refetchInterval: 60_000,
  });

  if (error) {
    return (
      <div className="flex max-w-xl flex-col items-start gap-4 rounded-2xl bg-card p-6 ring-1 ring-foreground/5">
        <div>
          <p className="font-display text-xl">No pudimos cargar el inicio</p>
          <p className="text-sm text-muted-foreground">
            {error instanceof ApiError ? error.message : "Revisá tu conexión e intentá de nuevo."}
          </p>
        </div>
        <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
          <RotateCcw />
          Reintentar
        </Button>
      </div>
    );
  }
  if (isLoading || !data) return <Skeleton />;

  const { counts } = data;
  const firstName = user?.name.split(" ")[0];
  const awaiting = counts.offersSent + counts.offersViewed;

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1.5">
        <h1 className="font-display text-4xl leading-tight tracking-tight text-balance">
          {greeting()}
          {firstName ? `, ${firstName}` : ""}
        </h1>
        <p className="text-muted-foreground">{headline(data)}</p>
      </header>

      <section
        aria-label="Resumen"
        className="grid grid-cols-2 divide-x divide-y divide-foreground/8 overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/5 lg:grid-cols-5 lg:divide-y-0"
      >
        <Figure
          href={`${base}/inquiries`}
          value={counts.unreadInquiries}
          label={counts.unreadInquiries === 1 ? "Consulta sin leer" : "Consultas sin leer"}
        />
        <Figure
          href={`${base}/offers`}
          value={awaiting}
          label={awaiting === 1 ? "Oferta esperando respuesta" : "Ofertas esperando respuesta"}
          note={counts.offersViewed > 0 ? `${counts.offersViewed} ya la abrieron` : undefined}
        />
        <Figure
          href={`${base}/bookings`}
          value={counts.upcomingCheckIns}
          label="Check-ins en 14 días"
          note={counts.pendingBookings > 0 ? `${counts.pendingBookings} reservas sin confirmar` : undefined}
        />
        <Figure
          href={`${base}/bookings`}
          value={<span className="text-3xl">{money(data.pendingPaymentTotals)}</span>}
          label="Por cobrar"
          note={counts.pendingPayments > 0 ? plural(counts.pendingPayments, "pago pendiente", "pagos pendientes") : undefined}
        />
        <Figure
          href="#tareas"
          value={counts.overdueTasks}
          label={counts.overdueTasks === 1 ? "Tarea vencida" : "Tareas vencidas"}
          note={counts.openTasks > 0 ? `${counts.openTasks} abiertas` : undefined}
          alert={counts.overdueTasks > 0}
        />
      </section>

      <div className="grid items-start gap-6 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-7">
          <section id="tareas" className={cn(PANEL, "scroll-mt-24")}>
            <div>
              <h2 className="font-display text-xl leading-tight">Tus tareas</h2>
              <p className="text-sm text-muted-foreground">Lo que tenés pendiente, lo más urgente primero.</p>
            </div>
            <TaskList filters={{ assignedTo: "me" }} limit={8} emptyText="No tenés tareas pendientes." />
          </section>

          <section className={PANEL}>
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="font-display text-xl leading-tight">Próximas reservas</h2>
              <Link href={`${base}/bookings`} className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
                Ver todas
              </Link>
            </div>
            {data.upcomingBookings.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay entradas en los próximos 14 días.</p>
            ) : (
              <ul className="flex flex-col">
                {data.upcomingBookings.map((booking) => (
                  <li key={booking.id} className="border-b border-foreground/8 last:border-b-0">
                    <Link
                      href={`${base}/bookings/${booking.id}`}
                      className="flex items-center gap-4 rounded-lg py-3 outline-none hover:bg-foreground/[0.03] focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      <span className="flex w-12 shrink-0 flex-col items-center leading-none">
                        <span className="font-display text-2xl tabular-nums">
                          {booking.startDate ? format(parseISO(booking.startDate), "d") : "—"}
                        </span>
                        <span className="text-xs text-muted-foreground uppercase">
                          {booking.startDate ? format(parseISO(booking.startDate), "MMM", { locale: es }) : ""}
                        </span>
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-sm font-medium">{booking.propertyTitle ?? "Propiedad"}</span>
                        <span className="truncate text-xs text-muted-foreground">
                          {booking.clientName ?? "Sin cliente"}
                          {booking.status === "PENDING" && " · sin confirmar"}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-5">
          <section className={PANEL}>
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="font-display text-xl leading-tight">Clientes por etapa</h2>
              <Link href={`${base}/clients`} className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
                Abrir tablero
              </Link>
            </div>
            <Funnel funnel={data.funnel} href={`${base}/clients`} />
          </section>

          <section className={PANEL}>
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="font-display text-xl leading-tight">Consultas recientes</h2>
              <Link href={`${base}/inquiries`} className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
                Ver bandeja
              </Link>
            </div>
            {data.recentInquiries.length === 0 ? (
              <p className="text-sm text-muted-foreground">Todavía no llegaron consultas.</p>
            ) : (
              <ul className="flex flex-col">
                {data.recentInquiries.map((inquiry) => (
                  <li key={inquiry.id} className="border-b border-foreground/8 last:border-b-0">
                    <Link
                      href={`${base}/inquiries`}
                      className="flex items-start gap-3 rounded-lg py-3 outline-none hover:bg-foreground/[0.03] focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      <span
                        aria-label={inquiry.read ? undefined : "Sin leer"}
                        className={cn("mt-1.5 size-2 shrink-0 rounded-full", inquiry.read ? "bg-transparent" : "bg-primary")}
                      />
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className={cn("truncate text-sm", !inquiry.read && "font-semibold")}>{inquiry.name}</span>
                        {inquiry.message && <span className="line-clamp-1 text-xs text-muted-foreground">{inquiry.message}</span>}
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(inquiry.createdAt), { locale: es })}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
