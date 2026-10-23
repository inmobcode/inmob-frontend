"use client";

import { useMutation } from "@tanstack/react-query";
import { Check, CheckCircle2, ChevronDown, Copy, ExternalLink, Eye, LifeBuoy, LoaderCircle, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/api/client";
import { requestContact } from "@/lib/api/contact";
import { useSessionUser } from "@/lib/auth/session";
import type { LooseTranslator } from "@/i18n/loose";
import { helpMessage, type SupportRequest } from "@/lib/import-guides";

function SupportRequestBlock({ support }: { support: SupportRequest }) {
  const t = useTranslations("importer.help");
  const [copied, setCopied] = useState(false);
  const { contact, subject, message } = support;

  async function copy(): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch {
      return false;
    }
  }

  // With an email the message opens ready to send; without one we copy it and
  // open the platform's contact page, where it only needs pasting.
  async function askPlatform() {
    const copiedOk = await copy();
    if (contact.email) {
      window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
      toast.message(t("mailOpened"));
      return;
    }
    window.open(contact.url, "_blank", "noopener,noreferrer");
    toast.message(
      copiedOk
        ? t("copiedFor", { platform: support.platform })
        : t("copyManually"),
    );
  }

  // From the message dialog: copy it and open the platform's contact page, ready to paste.
  async function goToSite() {
    const copiedOk = await copy();
    window.open(contact.url, "_blank", "noopener,noreferrer");
    if (copiedOk) toast.message(t("copiedFor", { platform: support.platform }));
  }

  const gmailUrl = contact.email
    ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(contact.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`
    : null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h4 className="font-medium">{t("askTitle", { platform: support.platform })}</h4>
        <p className="text-sm text-muted-foreground">{contact.email ? t("askEmail") : t("askPage")}</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={askPlatform}>
          <Mail />
          {contact.email ? t("sendEmail") : t("goToContact")}
        </Button>
        <Button asChild variant="outline">
          <a href={contact.url} target="_blank" rel="noopener noreferrer">
            {contact.label}
            <ExternalLink />
          </a>
        </Button>
        {gmailUrl && (
          <Button asChild variant="outline">
            <a href={gmailUrl} target="_blank" rel="noopener noreferrer">
              {t("gmail")}
              <ExternalLink />
            </a>
          </Button>
        )}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Eye />
              {t("viewMessage")}
            </Button>
          </DialogTrigger>
          <DialogContent className="gap-0 rounded-3xl p-0 sm:max-w-lg" showCloseButton>
            <div className="flex flex-col gap-1.5 px-7 pt-7 pb-5">
              <DialogTitle className="font-display text-3xl leading-none tracking-tight">
                {t("messageFor", { platform: support.platform })}
              </DialogTitle>
              <DialogDescription>
                {contact.email ? t("sentTo", { email: contact.email }) : t("pasteIt")}
              </DialogDescription>
            </div>
            <div className="px-7">
              <div
                tabIndex={0}
                aria-label={t("messageLabel")}
                className="max-h-80 overflow-y-auto rounded-xl bg-foreground/[0.07] p-4 text-sm leading-relaxed whitespace-pre-wrap outline-none focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-foreground/10"
              >
                {message}
              </div>
            </div>
            <div className="flex flex-wrap justify-end gap-3 px-7 py-6">
              <Button variant="outline" size="lg" onClick={copy}>
                {copied ? <Check /> : <Copy />}
                {copied ? t("copied") : t("copy")}
              </Button>
              <Button size="lg" onClick={goToSite}>
                {t("goToSite")}
                <ExternalLink />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {contact.email && <p className="text-xs text-muted-foreground">{t("goesTo", { email: contact.email })}</p>}
    </div>
  );
}

function TivvoHelp({ originName }: { originName: string }) {
  const t = useTranslations("importer.help");
  const tGuides = useTranslations("importer.guides") as unknown as LooseTranslator;
  const user = useSessionUser();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const send = useMutation({
    mutationFn: () => requestContact({ name: name.trim(), email: email.trim(), message }),
    onSuccess: () => setSent(true),
    onError: (err) =>
      toast.error(err instanceof ApiError ? err.message : t("sendFailed")),
  });

  // Everything is filled in when it opens: the person only has to press send.
  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      setName(user?.name ?? "");
      setEmail(user?.email ?? "");
      setMessage(helpMessage(tGuides, originName, user?.agencySlug));
      setSent(false);
      send.reset();
    }
  }

  const valid = name.trim().length >= 2 && /^\S+@\S+\.\S+$/.test(email.trim()) && message.trim().length >= 5;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h4 className="font-medium">{t("withUs")}</h4>
        <p className="text-sm text-muted-foreground">{t("withUsText", { origin: originName })}</p>
      </div>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-fit">
            <LifeBuoy />
            {t("ask")}
          </Button>
        </DialogTrigger>
        <DialogContent className="gap-0 rounded-3xl p-0 sm:max-w-lg" showCloseButton>
          {sent ? (
            <div className="flex flex-col items-start gap-3 px-7 py-8" role="status">
              <span className="flex size-10 items-center justify-center rounded-full bg-secondary text-primary">
                <CheckCircle2 className="size-5" />
              </span>
              <DialogTitle className="font-display text-2xl">{t("sentTitle")}</DialogTitle>
              <DialogDescription>{t("sentText")}</DialogDescription>
              <Button variant="outline" onClick={() => setOpen(false)}>
                {t("close")}
              </Button>
            </div>
          ) : (
            <form
              className="flex flex-col"
              onSubmit={(event) => {
                event.preventDefault();
                if (valid) send.mutate();
              }}
            >
              <div className="flex flex-col gap-1.5 px-7 pt-7 pb-5">
                <DialogTitle className="font-display text-3xl leading-none tracking-tight">{t("ask")}</DialogTitle>
                <DialogDescription>{t("dialogDescription")}</DialogDescription>
              </div>
              <div className="flex flex-col gap-4 px-7 pb-2">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="help-name">{t("name")}</Label>
                    <Input id="help-name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="help-email">Email</Label>
                    <Input
                      id="help-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="help-message">{t("message")}</Label>
                  <Textarea id="help-message" rows={8} value={message} onChange={(event) => setMessage(event.target.value)} />
                </div>
              </div>
              <div className="flex justify-end px-7 py-6">
                <Button type="submit" size="lg" disabled={!valid || send.isPending}>
                  {send.isPending && <LoaderCircle className="animate-spin" />}
                  {t("send")}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

/** One collapsible «¿Te trabás?» block: ask the platform for the file, or ask us. */
export function ImportHelp({ originName, support }: { originName: string; support?: SupportRequest | null }) {
  const t = useTranslations("importer.help");
  return (
    <details open={Boolean(support)} className="group border-t border-foreground/10 pt-4">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-lg text-sm font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/50 [&::-webkit-details-marker]:hidden">
        {t("summary")}
        <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <div className="flex flex-col gap-6 pt-4">
        {support && <SupportRequestBlock support={support} />}
        <TivvoHelp originName={originName} />
      </div>
    </details>
  );
}
