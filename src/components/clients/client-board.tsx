"use client";

import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Mail, Phone } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

import { ClientAvatar, STAGES, type ClientActions } from "@/components/clients/client-parts";
import type { Client, ClientStage } from "@/lib/api/clients";
import { CLIENT_STAGE_LABELS } from "@/lib/properties-labels";
import { cn } from "@/lib/utils";

const STAGE_DOTS: Record<ClientStage, string> = {
  LEAD: "bg-amber-500",
  CONTACTED: "bg-primary/60",
  NEGOTIATING: "bg-highlight",
  CLIENT: "bg-primary",
  LOST: "bg-foreground/25",
};

function CardBody({ client }: { client: Client }) {
  return (
    <>
      <div className="flex items-center gap-2.5">
        <ClientAvatar name={client.name} className="size-9 text-sm" />
        <p className="min-w-0 flex-1 truncate text-sm font-medium" title={client.name}>
          {client.name}
        </p>
      </div>
      <p className="flex items-center gap-1.5 truncate text-xs text-muted-foreground">
        <Mail className="size-3 shrink-0" />
        <span className="truncate">{client.email}</span>
      </p>
      {client.phone && (
        <p className="flex items-center gap-1.5 truncate text-xs text-muted-foreground">
          <Phone className="size-3 shrink-0" />
          <span className="truncate tabular-nums">{client.phone}</span>
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        {formatDistanceToNow(new Date(client.updatedAt), { addSuffix: true, locale: es })}
      </p>
    </>
  );
}

const CARD =
  "flex flex-col gap-1.5 rounded-xl bg-card p-3 shadow-[0_1px_2px_oklch(0.3_0.05_160/0.05)] ring-1 ring-foreground/8 outline-none";

function BoardCard({ client }: { client: Client }) {
  const { agencySlug } = useParams<{ agencySlug: string }>();
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: client.id });
  return (
    <div ref={setNodeRef} {...attributes} {...listeners} className={cn("touch-manipulation", isDragging && "opacity-30")}>
      <Link
        href={`/${agencySlug}/clients/${client.id}`}
        draggable={false}
        className={cn(CARD, "transition-shadow hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/50")}
      >
        <CardBody client={client} />
      </Link>
    </div>
  );
}

function Column({ stage, clients }: { stage: ClientStage; clients: Client[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });
  return (
    <section
      ref={setNodeRef}
      aria-label={`${CLIENT_STAGE_LABELS[stage]}: ${clients.length}`}
      className={cn(
        "flex w-72 shrink-0 flex-col gap-3 rounded-2xl p-3 transition-colors",
        isOver ? "bg-primary/10" : "bg-foreground/[0.04]",
      )}
    >
      <h2 className="flex items-center gap-2 px-1 text-sm font-medium">
        <span aria-hidden className={cn("size-2 rounded-full", STAGE_DOTS[stage])} />
        {CLIENT_STAGE_LABELS[stage]}
        <span className="ml-auto text-xs text-muted-foreground tabular-nums">{clients.length}</span>
      </h2>
      <div className="flex min-h-16 flex-col gap-2">
        {clients.map((client) => (
          <BoardCard key={client.id} client={client} />
        ))}
        {clients.length === 0 && (
          <p className="px-1 py-3 text-xs text-muted-foreground">Arrastrá un cliente hasta acá.</p>
        )}
      </div>
    </section>
  );
}

/**
 * Clients as a board: one column per stage, drag a card to move the client on.
 * Keyboard works too (focus a card, Space, arrows, Space).
 */
export function ClientBoard({ clients, actions }: { clients: Client[]; actions: ClientActions }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    // A small distance, so a plain click still opens the client.
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );

  const byStage = useMemo(() => {
    const groups = Object.fromEntries(STAGES.map((stage) => [stage, [] as Client[]])) as Record<ClientStage, Client[]>;
    for (const client of clients) groups[client.stage]?.push(client);
    return groups;
  }, [clients]);

  const active = activeId ? clients.find((client) => client.id === activeId) : null;

  function onDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const target = event.over?.id as ClientStage | undefined;
    const client = clients.find((entry) => entry.id === event.active.id);
    if (client && target && target !== client.stage && STAGES.includes(target)) {
      actions.changeStage(client.id, target);
    }
  }

  return (
    <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragCancel={() => setActiveId(null)}>
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6">
        {STAGES.map((stage) => (
          <Column key={stage} stage={stage} clients={byStage[stage]} />
        ))}
      </div>
      <DragOverlay>{active ? <div className={cn(CARD, "w-64 rotate-1 shadow-xl")}>{<CardBody client={active} />}</div> : null}</DragOverlay>
    </DndContext>
  );
}
