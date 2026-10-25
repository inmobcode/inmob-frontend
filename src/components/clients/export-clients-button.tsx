"use client";

import { Download } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import { useTeamMembers } from "@/components/shared/assignee-select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Locale } from "@/i18n/config";
import type { Client } from "@/lib/api/clients";
import { csvSeparator, downloadCsv, toCsv } from "@/lib/csv";
import { useLabels } from "@/lib/labels";
import { richTextPlain } from "@/lib/rich-text";

/**
 * Downloads the clients on screen (search and filters applied) as CSV. The
 * owner column only appears for owners and admins, who can read the team.
 */
export function ExportClientsButton({ clients }: { clients: Client[] }) {
  const t = useTranslations("clients.export");
  const labels = useLabels();
  const locale = useLocale() as Locale;
  const { data: members } = useTeamMembers();

  function exportCsv() {
    const names = new Map((members ?? []).map((member) => [member.id, member.name]));
    const header = [
      t("columns.name"),
      t("columns.email"),
      t("columns.phone"),
      t("columns.stage"),
      t("columns.source"),
      t("columns.tags"),
      t("columns.budgetMin"),
      t("columns.budgetMax"),
      t("columns.guests"),
      t("columns.zones"),
      t("columns.desiredFrom"),
      t("columns.desiredTo"),
      ...(members ? [t("columns.owner")] : []),
      t("columns.notes"),
      t("columns.createdAt"),
    ];
    const rows = clients.map((client) => [
      client.name,
      client.email,
      client.phone,
      labels.clientStage(client.stage),
      labels.clientSource(client.source),
      client.tags.join(", "),
      client.budgetMin,
      client.budgetMax,
      client.guests,
      client.zones,
      client.desiredFrom,
      client.desiredTo,
      ...(members ? [client.assignedAgentId ? (names.get(client.assignedAgentId) ?? "") : ""] : []),
      client.notes ? richTextPlain(client.notes) : "",
      // Day only, sortable in any spreadsheet.
      client.createdAt.slice(0, 10),
    ]);
    const today = new Date().toISOString().slice(0, 10);
    downloadCsv(toCsv([header, ...rows], csvSeparator(locale)), `${t("filename")}-${today}.csv`);
    toast.success(t("done", { count: clients.length }));
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={exportCsv}
          disabled={clients.length === 0}
          aria-label={t("label")}
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-foreground/[0.07] outline-none transition-colors hover:bg-foreground/10 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-40 dark:bg-foreground/10 dark:hover:bg-foreground/15"
        >
          <Download className="size-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={10}>
        {t("label")}
      </TooltipContent>
    </Tooltip>
  );
}
