"use client";

import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Clock, Mail, MessageSquareText, Phone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ClientAvatar,
  ClientMenu,
  ClientStagePill,
  SOURCE_LABELS,
  type ClientActions,
} from "@/components/clients/client-parts";
import { ControlsZone } from "@/components/properties/property-controls";
import type { Client } from "@/lib/api/clients";
import { cn } from "@/lib/utils";

const SURFACE =
  "client-card group rounded-2xl bg-card shadow-[0_1px_2px_oklch(0.3_0.05_160/0.04),0_12px_32px_-12px_oklch(0.3_0.05_160/0.14)] ring-1 ring-foreground/5 outline-none transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_1px_2px_oklch(0.3_0.05_160/0.06),0_24px_44px_-12px_oklch(0.3_0.05_160/0.26)] focus-visible:ring-3 focus-visible:ring-ring/50";

const ago = (iso: string) => formatDistanceToNow(new Date(iso), { addSuffix: true, locale: es });

/** The latest thing that happened with the client: the last logged interaction, else the last edit. */
function lastTouch(client: Client) {
  const last = client.interactions?.[0];
  return last ? last.createdAt : client.updatedAt;
}

function Contact({ client, className }: { client: Client; className?: string }) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1 text-sm text-muted-foreground", className)}>
      <span className="flex items-center gap-1.5">
        <Mail className="size-3.5 shrink-0" />
        <span className="truncate">{client.email}</span>
      </span>
      <span className="flex items-center gap-1.5">
        <Phone className="size-3.5 shrink-0" />
        <span className="truncate">{client.phone ?? "Sin teléfono"}</span>
      </span>
    </div>
  );
}

export function ClientCard({ client, actions }: { client: Client; actions: ClientActions }) {
  const last = client.interactions?.[0];
  const lost = client.stage === "LOST";

  return (
    <Link href={`/clients/${client.id}`} className={cn(SURFACE, "flex flex-col gap-5 p-5", lost && "opacity-75")}>
      <div className="flex items-start gap-3.5">
        <ClientAvatar name={client.name} />
        <div className="flex min-w-0 flex-1 flex-col gap-1.5 pt-0.5">
          <h3 className="font-display text-xl leading-tight text-balance line-clamp-2" title={client.name}>
            {client.name}
          </h3>
          <ClientStagePill stage={client.stage} className="self-start" />
        </div>
        <ControlsZone className="opacity-0 transition-opacity duration-200 group-focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100">
          <ClientMenu client={client} actions={actions} />
        </ControlsZone>
      </div>

      <Contact client={client} />

      <p className="flex min-h-10 items-start gap-2 text-sm text-foreground/75">
        <MessageSquareText className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
        <span className="line-clamp-2">{last?.content ?? client.notes ?? "Todavía sin interacciones."}</span>
      </p>

      <div className="mt-auto flex items-center gap-3 text-xs text-muted-foreground">
        <span className="inline-flex h-6 items-center rounded-full bg-foreground/[0.06] px-2.5 font-medium">
          {SOURCE_LABELS[client.source]}
        </span>
        <span className="ml-auto inline-flex items-center gap-1" title={`Último movimiento ${ago(lastTouch(client))}`}>
          <Clock className="size-3" />
          {ago(lastTouch(client))}
        </span>
      </div>
    </Link>
  );
}

export function ClientRow({ client, actions }: { client: Client; actions: ClientActions }) {
  const last = client.interactions?.[0];

  return (
    <Link
      href={`/clients/${client.id}`}
      className={cn(SURFACE, "flex flex-col gap-4 p-4 sm:flex-row sm:items-center", client.stage === "LOST" && "opacity-75")}
    >
      <div className="flex min-w-0 items-center gap-3.5 sm:w-72 sm:shrink-0">
        <ClientAvatar name={client.name} />
        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="truncate font-display text-lg leading-tight" title={client.name}>
            {client.name}
          </h3>
          <span className="text-xs text-muted-foreground">{SOURCE_LABELS[client.source]}</span>
        </div>
      </div>

      <Contact client={client} className="sm:w-64 sm:shrink-0" />

      <p className="line-clamp-2 min-w-0 flex-1 text-sm text-foreground/75">
        {last?.content ?? client.notes ?? <span className="text-muted-foreground">Todavía sin interacciones.</span>}
      </p>

      <div className="flex items-center justify-between gap-3 sm:w-52 sm:shrink-0 sm:flex-col sm:items-end sm:gap-2">
        <ControlsZone className="flex items-center gap-2">
          <ClientStagePill stage={client.stage} />
          <ClientMenu client={client} actions={actions} />
        </ControlsZone>
        <span className="text-xs text-muted-foreground">{ago(lastTouch(client))}</span>
      </div>
    </Link>
  );
}

const HEAD = "px-4 py-3 text-left text-xs font-medium text-muted-foreground";

export function ClientsTable({ clients, actions }: { clients: Client[]; actions: ClientActions }) {
  const router = useRouter();

  return (
    <div className="overflow-x-auto rounded-2xl bg-card shadow-[0_1px_2px_oklch(0.3_0.05_160/0.04),0_12px_32px_-12px_oklch(0.3_0.05_160/0.14)] ring-1 ring-foreground/5">
      <table className="w-full min-w-[820px] border-collapse text-sm">
        <thead>
          <tr>
            <th className={cn(HEAD, "pl-4")}>Cliente</th>
            <th className={HEAD}>Etapa</th>
            <th className={HEAD}>Teléfono</th>
            <th className={HEAD}>Origen</th>
            <th className={HEAD}>Último movimiento</th>
            <th className={cn(HEAD, "w-14")}>
              <span className="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr
              key={client.id}
              onClick={() => router.push(`/clients/${client.id}`)}
              className="client-card cursor-pointer border-t border-foreground/5 transition-colors hover:bg-foreground/[0.03]"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <ClientAvatar name={client.name} className="size-10 text-base" />
                  <div className="flex min-w-0 flex-col">
                    <Link
                      href={`/clients/${client.id}`}
                      onClick={(event) => event.stopPropagation()}
                      className="truncate font-medium outline-none hover:underline focus-visible:underline"
                    >
                      {client.name}
                    </Link>
                    <span className="truncate text-xs text-muted-foreground">{client.email}</span>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <ClientStagePill stage={client.stage} />
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-muted-foreground tabular-nums">{client.phone ?? "—"}</td>
              <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{SOURCE_LABELS[client.source]}</td>
              <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{ago(lastTouch(client))}</td>
              <td className="w-14 py-3 pr-4" onClick={(event) => event.stopPropagation()}>
                <ClientMenu client={client} actions={actions} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ClientCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-5 rounded-2xl bg-card p-5 ring-1 ring-foreground/5">
      <div className="flex items-center gap-3.5">
        <div className="size-12 rounded-full bg-muted" />
        <div className="flex flex-1 flex-col gap-2">
          <div className="h-5 w-3/5 rounded-full bg-muted" />
          <div className="h-5 w-1/4 rounded-full bg-muted" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-4 w-4/5 rounded-full bg-muted" />
        <div className="h-4 w-1/2 rounded-full bg-muted" />
      </div>
      <div className="h-10 w-full rounded-xl bg-muted" />
    </div>
  );
}
