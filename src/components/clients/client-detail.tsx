"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import {
  ArrowLeft,
  CalendarDays,
  Mail,
  MessageSquareText,
  Phone,
  PhoneCall,
  Plus,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { ClientAvatar, SOURCE_LABELS, STAGES } from "@/components/clients/client-parts";
import { FormSection } from "@/components/properties/form-section";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/api/client";
import {
  addInteraction,
  getClient,
  updateClient,
  type Client,
  type ClientStage,
  type InteractionType,
} from "@/lib/api/clients";
import { getAccessToken } from "@/lib/auth/session";
import { CLIENT_STAGE_LABELS } from "@/lib/properties-labels";
import { cn } from "@/lib/utils";

const INTERACTIONS: { value: InteractionType; label: string; icon: LucideIcon }[] = [
  { value: "NOTE", label: "Nota", icon: MessageSquareText },
  { value: "CALL", label: "Llamada", icon: PhoneCall },
  { value: "EMAIL", label: "Email", icon: Mail },
  { value: "MEETING", label: "Reunión", icon: Users },
];

function requireToken() {
  const token = getAccessToken();
  if (!token) throw new ApiError("No autenticado", 401);
  return token;
}

function Skeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-8">
      <div className="h-5 w-24 rounded-full bg-muted" />
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="flex flex-col gap-6">
          <div className="h-40 rounded-3xl bg-muted" />
          <div className="h-64 rounded-3xl bg-muted" />
        </div>
        <div className="h-72 rounded-3xl bg-muted" />
      </div>
    </div>
  );
}

export function ClientDetail({ clientId }: { clientId: string }) {
  const { agencySlug } = useParams<{ agencySlug: string }>();
  const queryClient = useQueryClient();
  const [notes, setNotes] = useState<string | null>(null);
  const [type, setType] = useState<InteractionType>("NOTE");
  const [content, setContent] = useState("");

  const { data: client, isLoading, error } = useQuery({
    queryKey: ["client", clientId],
    queryFn: () => getClient(requireToken(), clientId),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: { stage?: ClientStage; notes?: string }) => updateClient(requireToken(), clientId, payload),
    onSuccess: (updated, payload) => {
      queryClient.setQueryData<Client>(["client", clientId], (prev) => (prev ? { ...prev, ...updated } : prev));
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      if (payload.notes !== undefined) setNotes(null);
      toast.success("Cambios guardados");
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "No se pudieron guardar los cambios"),
  });

  const interactionMutation = useMutation({
    mutationFn: () => addInteraction(requireToken(), clientId, { type, content: content.trim() }),
    onSuccess: () => {
      setContent("");
      queryClient.invalidateQueries({ queryKey: ["client", clientId] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "No se pudo registrar"),
  });

  if (error) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-2xl bg-card p-6 ring-1 ring-foreground/5">
        <div>
          <p className="font-display text-xl">No encontramos al cliente</p>
          <p className="text-sm text-muted-foreground">
            {error instanceof ApiError ? error.message : "Revisá tu conexión e intentá de nuevo."}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/${agencySlug}/clients`}>
            <ArrowLeft />
            Volver a clientes
          </Link>
        </Button>
      </div>
    );
  }
  if (isLoading || !client) return <Skeleton />;

  const notesValue = notes ?? client.notes ?? "";
  const notesDirty = notes !== null && notes !== (client.notes ?? "");
  const interactions = client.interactions ?? [];

  return (
    <div className="flex flex-col gap-8">
      <Link
        href={`/${agencySlug}/clients`}
        className="inline-flex w-fit items-center gap-1.5 rounded-full text-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <ArrowLeft className="size-4" />
        Clientes
      </Link>

      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="flex min-w-0 flex-col gap-12">
          <header className="flex items-center gap-5">
            <ClientAvatar name={client.name} className="size-20 text-3xl" />
            <div className="flex min-w-0 flex-col gap-1">
              <h1 className="font-display text-4xl leading-none tracking-tight text-balance">{client.name}</h1>
              <p className="text-sm text-muted-foreground">
                {SOURCE_LABELS[client.source]} · cliente desde{" "}
                {format(new Date(client.createdAt), "d 'de' MMMM yyyy", { locale: es })}
              </p>
            </div>
          </header>

          <FormSection
            title="Notas"
            description="Lo que conviene recordar: qué busca, presupuesto, preferencias."
            shown={false}
          >
            <div className="flex flex-col items-start gap-3">
              <Textarea
                rows={4}
                aria-label="Notas del cliente"
                placeholder="Todavía no hay notas."
                value={notesValue}
                onChange={(event) => setNotes(event.target.value)}
              />
              {notesDirty && (
                <Button
                  size="sm"
                  className="rounded-full px-4"
                  disabled={updateMutation.isPending}
                  onClick={() => updateMutation.mutate({ notes: notesValue })}
                >
                  Guardar notas
                </Button>
              )}
            </div>
          </FormSection>

          <FormSection
            title="Historial"
            description="Llamadas, emails y reuniones, de la más reciente a la más antigua."
            shown={false}
          >
            <div className="flex flex-col gap-3 rounded-3xl bg-card p-4 shadow-[0_1px_2px_oklch(0.3_0.05_160/0.04),0_12px_32px_-12px_oklch(0.3_0.05_160/0.14)] ring-1 ring-foreground/5">
              <div role="group" aria-label="Tipo de interacción" className="flex flex-wrap gap-1.5">
                {INTERACTIONS.map((item) => {
                  const active = item.value === type;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setType(item.value)}
                      className={cn(
                        "inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                        active
                          ? "bg-primary text-primary-foreground"
                          : "bg-foreground/[0.06] text-muted-foreground hover:bg-foreground/10 hover:text-foreground",
                      )}
                    >
                      <item.icon className="size-3.5" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
              <Textarea
                rows={2}
                aria-label="Detalle de la interacción"
                placeholder="¿Qué pasó? Ej: Quedamos en visitar la casa el sábado."
                value={content}
                onChange={(event) => setContent(event.target.value)}
              />
              <Button
                className="self-end rounded-full px-5"
                disabled={!content.trim() || interactionMutation.isPending}
                onClick={() => interactionMutation.mutate()}
              >
                <Plus />
                Registrar
              </Button>
            </div>

            {interactions.length > 0 ? (
              <ol className="relative flex flex-col gap-6 pl-1">
                {interactions.map((item, index) => {
                  const meta = INTERACTIONS.find((entry) => entry.value === item.type) ?? INTERACTIONS[0];
                  return (
                    <li key={item.id} className="relative flex gap-4">
                      {index < interactions.length - 1 && (
                        <span aria-hidden className="absolute top-10 bottom-[-1.5rem] left-[1.125rem] w-px bg-foreground/10" />
                      )}
                      <span className="z-10 flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                        <meta.icon className="size-4" />
                      </span>
                      <div className="flex min-w-0 flex-1 flex-col gap-1 pt-1">
                        <p className="flex flex-wrap items-baseline gap-x-2 text-xs text-muted-foreground">
                          <span className="font-medium text-foreground">{meta.label}</span>
                          {item.createdBy && <span>· {item.createdBy}</span>}
                          <span title={format(new Date(item.createdAt), "d MMM yyyy, HH:mm", { locale: es })}>
                            · {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: es })}
                          </span>
                        </p>
                        <p className="text-sm text-pretty text-foreground/85">{item.content}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <p className="text-sm text-muted-foreground">Todavía no hay interacciones registradas.</p>
            )}
          </FormSection>
        </div>

        <aside className="flex flex-col gap-6 rounded-3xl bg-card p-6 shadow-[0_1px_2px_oklch(0.3_0.05_160/0.04),0_12px_32px_-12px_oklch(0.3_0.05_160/0.14)] ring-1 ring-foreground/5 lg:sticky lg:top-24">
          <div className="flex flex-col gap-3">
            <h2 className="font-display text-xl leading-tight">Etapa</h2>
            <div role="group" aria-label="Etapa del cliente" className="flex flex-wrap gap-1.5">
              {STAGES.map((stage) => {
                const active = stage === client.stage;
                return (
                  <button
                    key={stage}
                    type="button"
                    aria-pressed={active}
                    disabled={updateMutation.isPending}
                    onClick={() => !active && updateMutation.mutate({ stage })}
                    className={cn(
                      "inline-flex h-8 items-center rounded-full px-3 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "bg-foreground/[0.06] text-muted-foreground hover:bg-foreground/10 hover:text-foreground",
                    )}
                  >
                    {CLIENT_STAGE_LABELS[stage]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="font-display text-xl leading-tight">Contacto</h2>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <a
                  href={`mailto:${client.email}`}
                  className="flex items-center gap-2.5 rounded-lg outline-none hover:underline focus-visible:underline"
                >
                  <Mail className="size-4 shrink-0 text-muted-foreground" />
                  <span className="truncate">{client.email}</span>
                </a>
              </li>
              <li>
                {client.phone ? (
                  <a
                    href={`tel:${client.phone.replace(/[^\d+]/g, "")}`}
                    className="flex items-center gap-2.5 rounded-lg outline-none hover:underline focus-visible:underline"
                  >
                    <Phone className="size-4 shrink-0 text-muted-foreground" />
                    <span className="tabular-nums">{client.phone}</span>
                  </a>
                ) : (
                  <span className="flex items-center gap-2.5 text-muted-foreground">
                    <Phone className="size-4 shrink-0" />
                    Sin teléfono
                  </span>
                )}
              </li>
              <li className="flex items-center gap-2.5 text-muted-foreground">
                <CalendarDays className="size-4 shrink-0" />
                Actualizado {formatDistanceToNow(new Date(client.updatedAt), { addSuffix: true, locale: es })}
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
