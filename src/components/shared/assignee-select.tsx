"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ApiError } from "@/lib/api/client";
import { listTeam } from "@/lib/api/team";
import { getAccessToken, useSessionUser } from "@/lib/auth/session";
import { cn } from "@/lib/utils";

const NOBODY = "__nobody__";

/** Everyone on the team, for pickers; only owners and admins can read the list. */
export function useTeamMembers() {
  const user = useSessionUser();
  const isManager = !!user && user.role !== "AGENT";
  return useQuery({
    queryKey: ["team"],
    queryFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return listTeam(token);
    },
    enabled: isManager,
    staleTime: 60_000,
  });
}

/**
 * Who a record is assigned to. Renders nothing for agents: they can't hand
 * work to a colleague (the API says so too), they only take what is theirs.
 */
export function AssigneeSelect({
  value,
  onChange,
  disabled,
  label,
  className,
  ariaLabel,
}: {
  value: string | null | undefined;
  onChange: (userId: string | null) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
  ariaLabel?: string;
}) {
  const t = useTranslations("dashboard.assignee");
  const user = useSessionUser();
  const { data: members } = useTeamMembers();
  if (!user || user.role === "AGENT") return null;

  return (
    <Select value={value ?? NOBODY} onValueChange={(next) => onChange(next === NOBODY ? null : next)} disabled={disabled}>
      <SelectTrigger aria-label={ariaLabel ?? t("label")} className={cn("h-10 w-full", className)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={NOBODY}>{label ?? t("nobody")}</SelectItem>
        {members
          ?.filter((member) => member.isActive)
          .map((member) => (
            <SelectItem key={member.id} value={member.id}>
              {member.name}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}

/** A teammate's name from the list, for read-only labels. */
export function useMemberName(userId: string | null | undefined) {
  const t = useTranslations("dashboard.assignee");
  const user = useSessionUser();
  const { data: members } = useTeamMembers();
  if (!userId) return null;
  if (user?.id === userId) return t("you");
  return members?.find((member) => member.id === userId)?.name ?? null;
}
