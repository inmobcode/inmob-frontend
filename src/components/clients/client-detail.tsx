"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { BackLink } from "@/components/shared/back-link";
import { ClientAvatar, STAGES } from "@/components/clients/client-parts";
import { AssigneeSelect, useMemberName } from "@/components/shared/assignee-select";
import { TaskList } from "@/components/tasks/task-list";
import { FormSection } from "@/components/properties/form-section";
import { RichTextEditor } from "@/components/rich-text/rich-text-editor";
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
import { getAccessToken, useSessionUser } from "@/lib/auth/session";
import { useFormat } from "@/i18n/format";
import { parseApiDate } from "@/lib/dates";
import { useLabels } from "@/lib/labels";
import { cn } from "@/lib/utils";

// Their names live in "clients.detail.interaction.<TYPE>".
const INTERACTIONS: { value: InteractionType; icon: LucideIcon }[] = [
  { value: "NOTE", icon: MessageSquareText },
  { value: "CALL", icon: PhoneCall },
  { value: "EMAIL", icon: Mail },
  { value: "MEETING", icon: Users },
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
  const t = useTranslations("clients.detail");
  const common = useTranslations("common");
  const labels = useLabels();
  const { date, ago } = useFormat();
  const { agencySlug } = useParams<{ agencySlug: string }>();
  const queryClient = useQueryClient();
  const [notes, setNotes] = useState<string | null>(null);
  const [type, setType] = useState<InteractionType>("NOTE");
  const [content, setContent] = useState("");
  const user = useSessionUser();

  const { data: client, isLoading, error } = useQuery({
    queryKey: ["client", clientId],
    queryFn: () => getClient(requireToken(), clientId),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: { stage?: ClientStage; notes?: string; assignedAgentId?: string | null }) => updateClient(requireToken(), clientId, payload),
    onSuccess: (updated, payload) => {
      queryClient.setQueryData<Client>(["client", clientId], (prev) => (prev ? { ...prev, ...updated } : prev));
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      if (payload.notes !== undefined) setNotes(null);
      toast.success(common("changesSaved"));
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : common("saveFailed")),
  });

  const interactionMutation = useMutation({
    mutationFn: () => addInteraction(requireToken(), clientId, { type, content: content.trim() }),
    onSuccess: () => {
      setContent("");
      queryClient.invalidateQueries({ queryKey: ["client", clientId] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : t("logFailed")),
  });

  const ownerName = useMemberName(client?.assignedAgentId);

  if (error) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-2xl bg-card p-6 ring-1 ring-foreground/5">
        <div>
          <p className="font-display text-xl">{t("notFound")}</p>
          <p className="text-sm text-muted-foreground">
            {error instanceof ApiError ? error.message : common("checkConnection")}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/${agencySlug}/clients`}>
            <ArrowLeft />
            {t("backToList")}
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
      <BackLink href={`/${agencySlug}/clients`}>{t("list")}</BackLink>

      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="flex min-w-0 flex-col gap-12">
          <header className="flex items-center gap-5">
            <ClientAvatar name={client.name} className="size-20 text-3xl" />
            <div className="flex min-w-0 flex-col gap-1">
              <h1 className="font-display text-4xl leading-none tracking-tight text-balance">{client.name}</h1>
              <p className="text-sm text-muted-foreground">
                {labels.clientSource(client.source)} ·{" "}
                {t("clientSince", { date: date(parseApiDate(client.createdAt), "long") })}
              </p>
            </div>
          </header>

          <FormSection
            title={t("notes")}
            description={t("notesDescription")}
            shown={false}
          >
            <div className="flex flex-col items-start gap-3">
              <RichTextEditor
                ariaLabel={t("notesLabel")}
                placeholder={t("notesPlaceholder")}
                value={notesValue}
                onChange={setNotes}
              />
              {notesDirty && (
                <Button
                  size="sm"
                  className="rounded-full px-4"
                  disabled={updateMutation.isPending}
                  onClick={() => updateMutation.mutate({ notes: notesValue })}
                >
                  {t("saveNotes")}
                </Button>
              )}
            </div>
          </FormSection>

          <FormSection
            title={t("tasks")}
            description={t("tasksDescription")}
            shown={false}
          >
            <TaskList clientId={clientId} emptyText={t("noTasks")} />
          </FormSection>

          <FormSection
            title={t("history")}
            description={t("historyDescription")}
            shown={false}
          >
            <div className="flex flex-col gap-3 rounded-3xl bg-card p-4 shadow-[0_1px_2px_oklch(0.3_0.05_160/0.04),0_12px_32px_-12px_oklch(0.3_0.05_160/0.14)] ring-1 ring-foreground/5">
              <div role="group" aria-label={t("interactionType")} className="flex flex-wrap gap-1.5">
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
                      {t(`interaction.${item.value}`)}
                    </button>
                  );
                })}
              </div>
              <Textarea
                rows={2}
                aria-label={t("interactionDetail")}
                placeholder={t("interactionPlaceholder")}
                value={content}
                onChange={(event) => setContent(event.target.value)}
              />
              <Button
                className="self-end rounded-full px-5"
                disabled={!content.trim() || interactionMutation.isPending}
                onClick={() => interactionMutation.mutate()}
              >
                <Plus />
                {t("log")}
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
                          <span className="font-medium text-foreground">{t(`interaction.${meta.value}`)}</span>
                          {item.createdBy && <span>· {item.createdBy}</span>}
                          <span title={date(parseApiDate(item.createdAt), "dateTime")}>
                            · {ago(parseApiDate(item.createdAt))}
                          </span>
                        </p>
                        <p className="text-sm text-pretty text-foreground/85">{item.content}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <p className="text-sm text-muted-foreground">{t("noInteractions")}</p>
            )}
          </FormSection>
        </div>

        <aside className="flex flex-col gap-6 rounded-3xl bg-card p-6 shadow-[0_1px_2px_oklch(0.3_0.05_160/0.04),0_12px_32px_-12px_oklch(0.3_0.05_160/0.14)] ring-1 ring-foreground/5 lg:sticky lg:top-24">
          <div className="flex flex-col gap-3">
            <h2 className="font-display text-xl leading-tight">{t("stage")}</h2>
            <div role="group" aria-label={t("stageLabel")} className="flex flex-wrap gap-1.5">
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
                    {labels.clientStage(stage)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="font-display text-xl leading-tight">{t("owner")}</h2>
            {user?.role === "AGENT" ? (
              client.assignedAgentId === user.id ? (
                <p className="text-sm text-muted-foreground">{t("yours")}</p>
              ) : (
                <Button
                  variant="outline"
                  className="self-start"
                  disabled={updateMutation.isPending}
                  onClick={() => updateMutation.mutate({ assignedAgentId: user.id })}
                >
                  {t("takeIt")}
                </Button>
              )
            ) : (
              <AssigneeSelect
                value={client.assignedAgentId}
                disabled={updateMutation.isPending}
                onChange={(assignedAgentId) => updateMutation.mutate({ assignedAgentId })}
              />
            )}
            {user?.role !== "AGENT" && ownerName === null && client.assignedAgentId && (
              <p className="text-xs text-muted-foreground">{t("ownerGone")}</p>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="font-display text-xl leading-tight">{t("contact")}</h2>
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
                    {t("noPhone")}
                  </span>
                )}
              </li>
              <li className="flex items-center gap-2.5 text-muted-foreground">
                <CalendarDays className="size-4 shrink-0" />
                {t("updated", { ago: ago(parseApiDate(client.updatedAt)) })}
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
