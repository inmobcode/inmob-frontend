"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, FileText, Pencil, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/api/client";
import {
  createReplyTemplate,
  deleteReplyTemplate,
  listReplyTemplates,
  updateReplyTemplate,
  type ReplyTemplate,
} from "@/lib/api/inquiries";
import { getAccessToken } from "@/lib/auth/session";
import { REPLY_PLACEHOLDERS, placeholderToken } from "@/lib/reply-templates";

export const TEMPLATES_KEY = ["inquiries", "templates"];

function requireToken() {
  const token = getAccessToken();
  if (!token) throw new ApiError("No autenticado", 401);
  return token;
}

/** The agency's reply templates, shared by the whole team. */
export function useReplyTemplates() {
  return useQuery({
    queryKey: TEMPLATES_KEY,
    queryFn: () => listReplyTemplates(requireToken()),
    staleTime: 60_000,
  });
}

type Draft = { id: string | null; name: string; subject: string; body: string };

const EMPTY: Draft = { id: null, name: "", subject: "", body: "" };

/** Lists the templates and edits one at a time: name, optional subject and the text with its placeholders. */
export function ReplyTemplatesDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("inquiries.templates");
  const common = useTranslations("common");
  const queryClient = useQueryClient();
  const { data: templates, isLoading } = useReplyTemplates();
  const [draft, setDraft] = useState<Draft | null>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const saveMutation = useMutation({
    meta: { affectsSite: false },
    mutationFn: (value: Draft) => {
      const payload = {
        name: value.name.trim(),
        subject: value.subject.trim() || null,
        body: value.body.trim(),
      };
      return value.id
        ? updateReplyTemplate(requireToken(), value.id, payload)
        : createReplyTemplate(requireToken(), payload);
    },
    onSuccess: () => {
      toast.success(t("saved"));
      setDraft(null);
    },
    onError: (err) =>
      toast.error(err instanceof ApiError ? err.message : common("saveFailed")),
    onSettled: () => queryClient.invalidateQueries({ queryKey: TEMPLATES_KEY }),
  });

  const deleteMutation = useMutation({
    meta: { affectsSite: false },
    mutationFn: (id: string) => deleteReplyTemplate(requireToken(), id),
    onSuccess: () => toast.success(t("deleted")),
    onError: (err) =>
      toast.error(err instanceof ApiError ? err.message : t("deleteFailed")),
    onSettled: () => queryClient.invalidateQueries({ queryKey: TEMPLATES_KEY }),
  });

  /** Puts the token where the cursor is in the text, or at its end. */
  function insert(token: string) {
    if (!draft) return;
    const element = bodyRef.current;
    const start = element?.selectionStart ?? draft.body.length;
    const end = element?.selectionEnd ?? draft.body.length;
    setDraft({
      ...draft,
      body: draft.body.slice(0, start) + token + draft.body.slice(end),
    });
    requestAnimationFrame(() => {
      element?.focus();
      element?.setSelectionRange(start + token.length, start + token.length);
    });
  }

  function edit(template: ReplyTemplate) {
    setDraft({
      id: template.id,
      name: template.name,
      subject: template.subject ?? "",
      body: template.body,
    });
  }

  const canSave =
    !!draft &&
    draft.name.trim() !== "" &&
    draft.body.trim() !== "" &&
    !saveMutation.isPending;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) setDraft(null);
      }}
    >
      <DialogContent
        className="max-h-[92svh] gap-0 overflow-y-auto rounded-3xl p-0 sm:max-w-xl"
        showCloseButton
      >
        <div className="flex flex-col gap-1.5 px-7 pt-7 pb-5">
          <DialogTitle className="font-display text-3xl leading-none tracking-tight">
            {draft ? (draft.id ? t("editTitle") : t("newTitle")) : t("title")}
          </DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </div>

        {draft ? (
          <form
            className="flex flex-col gap-5 px-7 pb-7"
            onSubmit={(event) => {
              event.preventDefault();
              if (canSave) saveMutation.mutate(draft);
            }}
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="template-name">{t("name")}</Label>
              <Input
                id="template-name"
                maxLength={120}
                placeholder={t("namePlaceholder")}
                value={draft.name}
                onChange={(event) =>
                  setDraft({ ...draft, name: event.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="template-subject">
                {t("subject")}{" "}
                <span className="font-normal text-muted-foreground">
                  {t("optional")}
                </span>
              </Label>
              <Input
                id="template-subject"
                maxLength={200}
                placeholder={t("subjectPlaceholder")}
                value={draft.subject}
                onChange={(event) =>
                  setDraft({ ...draft, subject: event.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="template-body">{t("body")}</Label>
              <Textarea
                id="template-body"
                ref={bodyRef}
                rows={6}
                maxLength={10000}
                placeholder={t("bodyPlaceholder")}
                value={draft.body}
                onChange={(event) =>
                  setDraft({ ...draft, body: event.target.value })
                }
              />
              <div className="flex flex-col gap-1.5">
                <p className="text-xs text-muted-foreground">
                  {t("placeholdersHint")}
                </p>
                <div
                  className="flex flex-wrap gap-1.5"
                  role="group"
                  aria-label={t("placeholdersLabel")}
                >
                  {REPLY_PLACEHOLDERS.map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => insert(placeholderToken(key))}
                      className="inline-flex h-7 items-center gap-1 rounded-full bg-foreground/[0.06] px-2.5 text-xs font-medium text-muted-foreground transition-colors outline-none hover:bg-foreground/10 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      <Plus className="size-3" />
                      {t(`placeholders.${key}`)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 pt-1">
              <Button
                type="button"
                variant="ghost"
                className="rounded-full"
                onClick={() => setDraft(null)}
              >
                <ArrowLeft />
                {t("back")}
              </Button>
              <Button
                type="submit"
                className="rounded-full px-5"
                disabled={!canSave}
              >
                {t("save")}
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-4 px-7 pb-7">
            {isLoading ? (
              <div className="flex animate-pulse flex-col gap-2" aria-hidden>
                <div className="h-14 rounded-2xl bg-muted" />
                <div className="h-14 rounded-2xl bg-muted" />
              </div>
            ) : templates && templates.length > 0 ? (
              <ul className="flex flex-col divide-y divide-foreground/[0.06] rounded-2xl ring-1 ring-foreground/10">
                {templates.map((template) => (
                  <li
                    key={template.id}
                    className="flex items-center gap-3 px-4 py-3"
                  >
                    <FileText className="size-4 shrink-0 text-muted-foreground" />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-sm font-medium">
                        {template.name}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {template.body}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => edit(template)}
                      aria-label={t("edit", { name: template.name })}
                      className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground outline-none hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={deleteMutation.isPending}
                      onClick={() => deleteMutation.mutate(template.id)}
                      aria-label={t("delete", { name: template.name })}
                      className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground outline-none hover:bg-destructive/10 hover:text-destructive focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-2xl bg-foreground/[0.04] px-5 py-6 text-center text-sm text-muted-foreground">
                {t("empty")}
              </p>
            )}
            <Button
              className="self-start rounded-full px-5"
              onClick={() => setDraft(EMPTY)}
            >
              <Plus />
              {t("new")}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
