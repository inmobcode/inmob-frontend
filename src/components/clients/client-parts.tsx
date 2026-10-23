"use client";

import { Check, Copy, Mail, MoreHorizontal, Pencil, Phone, Repeat2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Client, ClientStage } from "@/lib/api/clients";
import { useLabels } from "@/lib/labels";
import { CLIENT_STAGES } from "@/lib/properties-labels";
import { cn } from "@/lib/utils";

export const STAGES = CLIENT_STAGES;

export interface ClientActions {
  changeStage: (id: string, stage: ClientStage) => void;
}

const STAGE_STYLES: Record<ClientStage, string> = {
  LEAD: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  CONTACTED: "bg-primary/10 text-primary",
  NEGOTIATING: "bg-highlight/40 text-highlight-foreground",
  CLIENT: "bg-primary text-primary-foreground",
  LOST: "bg-foreground/[0.07] text-muted-foreground",
};

export function ClientStagePill({ stage, className }: { stage: ClientStage; className?: string }) {
  const labels = useLabels();
  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center rounded-full px-2.5 text-xs font-medium",
        STAGE_STYLES[stage],
        className,
      )}
    >
      {labels.clientStage(stage)}
    </span>
  );
}

const TINTS = [
  "bg-primary/12 text-primary",
  "bg-highlight/45 text-highlight-foreground",
  "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  "bg-foreground/[0.08] text-foreground/70",
];

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

/** Initials on a soft tint that stays the same for the same person. */
export function ClientAvatar({ name, className }: { name: string; className?: string }) {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-12 shrink-0 items-center justify-center rounded-full font-display text-lg",
        TINTS[hash % TINTS.length],
        className,
      )}
    >
      {initialsOf(name)}
    </span>
  );
}

export function ClientMenu({
  client,
  actions,
  className,
}: {
  client: Client;
  actions: ClientActions;
  className?: string;
}) {
  const t = useTranslations("clients.menu");
  const common = useTranslations("common");
  const labels = useLabels();
  const router = useRouter();
  const { agencySlug } = useParams<{ agencySlug: string }>();

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(client.email);
      toast.success(common("emailCopied"));
    } catch {
      toast.error(common("emailCopyFailed"));
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={t("actionsOf", { name: client.name })}
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground/[0.06] text-foreground transition-colors outline-none hover:bg-foreground/10 focus-visible:ring-3 focus-visible:ring-ring/50 data-[state=open]:bg-foreground/10",
            className,
          )}
        >
          <MoreHorizontal className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-2xl p-1.5">
        <DropdownMenuItem className="rounded-xl py-2" onSelect={() => router.push(`/${agencySlug}/clients/${client.id}`)}>
          <Pencil />
          {t("view")}
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="rounded-xl py-2">
            <Repeat2 />
            {t("changeStage")}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-48 rounded-2xl p-1.5">
            {STAGES.map((stage) => (
              <DropdownMenuItem
                key={stage}
                className="rounded-xl py-2"
                onSelect={() => stage !== client.stage && actions.changeStage(client.id, stage)}
              >
                {labels.clientStage(stage)}
                {stage === client.stage && <Check className="ml-auto" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="rounded-xl py-2" asChild>
          <a href={`mailto:${client.email}`}>
            <Mail />
            {t("email")}
          </a>
        </DropdownMenuItem>
        {client.phone && (
          <DropdownMenuItem className="rounded-xl py-2" asChild>
            <a href={`tel:${client.phone.replace(/[^\d+]/g, "")}`}>
              <Phone />
              {t("call")}
            </a>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem className="rounded-xl py-2" onSelect={copyEmail}>
          <Copy />
          {t("copyEmail")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
