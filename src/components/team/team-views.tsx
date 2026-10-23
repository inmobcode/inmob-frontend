"use client";

import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";

import { ClientAvatar } from "@/components/clients/client-parts";
import { ActivePill, RolePill, TeamMenu, type TeamActions } from "@/components/team/team-parts";
import { useFormat } from "@/i18n/format";
import type { TeamMember } from "@/lib/api/team";
import { cn } from "@/lib/utils";

const SURFACE =
  "team-card group rounded-2xl bg-card shadow-[0_1px_2px_oklch(0.3_0.05_160/0.04),0_12px_32px_-12px_oklch(0.3_0.05_160/0.14)] ring-1 ring-foreground/5 transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_1px_2px_oklch(0.3_0.05_160/0.06),0_24px_44px_-12px_oklch(0.3_0.05_160/0.26)]";

/** "oct 2026": when someone joined, in the page's language. */
function useSince() {
  const { tag } = useFormat();
  return (iso: string) => new Intl.DateTimeFormat(tag, { month: "short", year: "numeric" }).format(new Date(iso));
}

export function TeamCard({ member, actions }: { member: TeamMember; actions: TeamActions }) {
  const t = useTranslations("team");
  const since = useSince();
  return (
    <div className={cn(SURFACE, "flex flex-col gap-5 p-5", !member.isActive && "opacity-70")}>
      <div className="flex items-start gap-3.5">
        <ClientAvatar name={member.name} />
        <div className="flex min-w-0 flex-1 flex-col gap-1.5 pt-0.5">
          <h3 className="font-display text-xl leading-tight text-balance line-clamp-2" title={member.name}>
            {member.name}
          </h3>
          <RolePill role={member.role} className="self-start" />
        </div>
        <TeamMenu
          member={member}
          actions={actions}
          className="opacity-0 transition-opacity duration-200 group-focus-within:opacity-100 group-hover:opacity-100 data-[state=open]:opacity-100 [@media(hover:none)]:opacity-100"
        />
      </div>

      <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Mail className="size-3.5 shrink-0" />
        <span className="truncate">{member.email}</span>
      </p>

      <div className="mt-auto flex items-center gap-3 text-xs text-muted-foreground">
        <ActivePill active={member.isActive} />
        <span className="ml-auto">{t("memberSince", { date: since(member.createdAt) })}</span>
      </div>
    </div>
  );
}

export function TeamRow({ member, actions }: { member: TeamMember; actions: TeamActions }) {
  const t = useTranslations("team");
  const since = useSince();
  return (
    <div className={cn(SURFACE, "flex flex-col gap-4 p-4 sm:flex-row sm:items-center", !member.isActive && "opacity-70")}>
      <div className="flex min-w-0 items-center gap-3.5 sm:w-80 sm:shrink-0">
        <ClientAvatar name={member.name} />
        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="truncate font-display text-lg leading-tight" title={member.name}>
            {member.name}
          </h3>
          <span className="truncate text-sm text-muted-foreground">{member.email}</span>
        </div>
      </div>
      <div className="flex items-center gap-3 sm:flex-1">
        <RolePill role={member.role} />
        <ActivePill active={member.isActive} />
      </div>
      <div className="flex items-center justify-between gap-3 sm:w-56 sm:shrink-0 sm:justify-end">
        <span className="text-xs text-muted-foreground">{t("since", { date: since(member.createdAt) })}</span>
        <TeamMenu member={member} actions={actions} />
      </div>
    </div>
  );
}

const HEAD = "px-4 py-3 text-left text-xs font-medium text-muted-foreground";

export function TeamTable({ members, actions }: { members: TeamMember[]; actions: TeamActions }) {
  const t = useTranslations("team");
  const since = useSince();
  return (
    <div className="overflow-x-auto rounded-2xl bg-card shadow-[0_1px_2px_oklch(0.3_0.05_160/0.04),0_12px_32px_-12px_oklch(0.3_0.05_160/0.14)] ring-1 ring-foreground/5">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr>
            <th className={cn(HEAD, "pl-4")}>{t("member")}</th>
            <th className={HEAD}>{t("role")}</th>
            <th className={HEAD}>{t("status")}</th>
            <th className={HEAD}>{t("memberSinceColumn")}</th>
            <th className={cn(HEAD, "w-14")}>
              <span className="sr-only">{t("actionsColumn")}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr
              key={member.id}
              className={cn("team-card border-t border-foreground/5 transition-colors hover:bg-foreground/[0.03]", !member.isActive && "opacity-70")}
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <ClientAvatar name={member.name} className="size-10 text-base" />
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate font-medium">{member.name}</span>
                    <span className="truncate text-xs text-muted-foreground">{member.email}</span>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <RolePill role={member.role} />
              </td>
              <td className="px-4 py-3">
                <ActivePill active={member.isActive} />
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{since(member.createdAt)}</td>
              <td className="w-14 py-3 pr-4">
                <TeamMenu member={member} actions={actions} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TeamCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-5 rounded-2xl bg-card p-5 ring-1 ring-foreground/5">
      <div className="flex items-center gap-3.5">
        <div className="size-12 rounded-full bg-muted" />
        <div className="flex flex-1 flex-col gap-2">
          <div className="h-5 w-3/5 rounded-full bg-muted" />
          <div className="h-5 w-1/4 rounded-full bg-muted" />
        </div>
      </div>
      <div className="h-4 w-4/5 rounded-full bg-muted" />
      <div className="h-6 w-full rounded-full bg-muted" />
    </div>
  );
}
