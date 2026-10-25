"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle, Send, Settings2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import {
  ReplyTemplatesDialog,
  useReplyTemplates,
} from "@/components/inquiries/reply-templates-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getAgency } from "@/lib/api/agency";
import { ApiError } from "@/lib/api/client";
import { replyToInquiry, type Inquiry } from "@/lib/api/inquiries";
import { getAccessToken, useSessionUser } from "@/lib/auth/session";
import { fillPlaceholders } from "@/lib/reply-templates";

function requireToken() {
  const token = getAccessToken();
  if (!token) throw new ApiError("No autenticado", 401);
  return token;
}

/**
 * Writes the answer right in the inbox: pick a template (its placeholders are
 * filled with this inquiry's details), adjust it and send. It goes out as an
 * email from the agency's name and lands in the client's history.
 */
export function ReplyComposer({
  inquiry,
  subject: about,
  onCancel,
  onSent,
}: {
  inquiry: Inquiry;
  /** What it was about: the listing, the offer or a general question. */
  subject: string;
  onCancel: () => void;
  onSent: () => void;
}) {
  const t = useTranslations("inquiries.reply");
  const user = useSessionUser();
  const queryClient = useQueryClient();
  const firstName = inquiry.name.split(" ")[0];
  const [subject, setSubject] = useState(`Re: ${about}`);
  const [body, setBody] = useState(`${t("greeting", { name: firstName })}\n\n`);
  const [templateId, setTemplateId] = useState<string>("");
  const [managing, setManaging] = useState(false);
  const { data: templates } = useReplyTemplates();
  const { data: agency } = useQuery({
    queryKey: ["agency"],
    queryFn: () => getAgency(requireToken()),
    staleTime: 5 * 60_000,
  });

  const values = {
    firstName,
    name: inquiry.name,
    property: inquiry.property?.title ?? inquiry.offer?.title ?? null,
    agency: agency?.name ?? null,
    me: user?.name ?? null,
  };

  function apply(id: string) {
    setTemplateId(id);
    const template = templates?.find((item) => item.id === id);
    if (!template) return;
    setBody(fillPlaceholders(template.body, values));
    if (template.subject)
      setSubject(fillPlaceholders(template.subject, values));
  }

  const sendMutation = useMutation({
    meta: { affectsSite: false },
    mutationFn: () =>
      replyToInquiry(requireToken(), inquiry.id, {
        subject: subject.trim(),
        body: body.trim(),
      }),
    onSuccess: () => {
      toast.success(t("sent", { email: inquiry.email }));
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
      queryClient.invalidateQueries({ queryKey: ["inquiries-unread"] });
      if (inquiry.client)
        queryClient.invalidateQueries({
          queryKey: ["client", inquiry.client.id],
        });
      onSent();
    },
    onError: (err) =>
      toast.error(err instanceof ApiError ? err.message : t("failed")),
  });

  const canSend =
    subject.trim() !== "" && body.trim() !== "" && !sendMutation.isPending;

  return (
    <>
      <form
        className="flex flex-col gap-4 rounded-2xl bg-foreground/[0.04] p-4 sm:p-5"
        onSubmit={(event) => {
          event.preventDefault();
          if (canSend) sendMutation.mutate();
        }}
      >
        <div className="flex flex-wrap items-center gap-2">
          <p className="mr-auto text-sm text-muted-foreground">
            {t("to", { email: inquiry.email })}
          </p>
          {templates && templates.length > 0 && (
            <Select value={templateId} onValueChange={apply}>
              <SelectTrigger
                aria-label={t("template")}
                className="h-9 w-auto min-w-44 bg-card"
              >
                <SelectValue placeholder={t("template")} />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="rounded-full"
            onClick={() => setManaging(true)}
          >
            <Settings2 />
            {templates && templates.length > 0
              ? t("manageTemplates")
              : t("createTemplate")}
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="reply-subject">{t("subject")}</Label>
          <Input
            id="reply-subject"
            maxLength={200}
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            className="bg-card"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="reply-body">{t("body")}</Label>
          <Textarea
            id="reply-body"
            rows={6}
            maxLength={10000}
            value={body}
            onChange={(event) => setBody(event.target.value)}
            className="bg-card"
            autoFocus
          />
          <p className="text-xs text-muted-foreground">{t("hint")}</p>
        </div>
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            className="rounded-full"
            onClick={onCancel}
            disabled={sendMutation.isPending}
          >
            {t("cancel")}
          </Button>
          <Button
            type="submit"
            className="rounded-full px-5"
            disabled={!canSend}
          >
            {sendMutation.isPending ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <Send />
            )}
            {t("send")}
          </Button>
        </div>
      </form>
      {/* Outside the form: React events bubble through portals, and its submit would send the reply. */}
      <ReplyTemplatesDialog open={managing} onOpenChange={setManaging} />
    </>
  );
}
