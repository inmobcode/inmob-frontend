"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RotateCcw, Search, SearchX, Users } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { FilterMenu } from "@/components/filter-menu";
import { ViewSwitch, type ViewMode } from "@/components/properties/view-switch";
import { HelpHint, HelpLink } from "@/components/docs/help-link";
import { InviteMemberDialog } from "@/components/team/invite-member-dialog";
import { ROLES, type TeamActions } from "@/components/team/team-parts";
import { TeamCard, TeamCardSkeleton, TeamRow, TeamTable } from "@/components/team/team-views";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api/client";
import { listTeam, removeTeamMember, updateTeamMember, type TeamMember, type TeamRole } from "@/lib/api/team";
import { getAccessToken, useRequireNonAgent } from "@/lib/auth/session";
import { gsap, useGSAP } from "@/lib/gsap";
import { distance, duration, ease, media, rowStagger } from "@/lib/motion";

const ROLE_ORDER: Record<TeamRole, number> = { OWNER: 0, ADMIN: 1, AGENT: 2 };

function requireToken() {
  const token = getAccessToken();
  if (!token) throw new ApiError("No autenticado", 401);
  return token;
}

export default function TeamPage() {
  useRequireNonAgent();
  const t = useTranslations("team.page");
  const tRoles = useTranslations("team.roles");
  const tPlural = useTranslations("team.rolePlurals");
  const tc = useTranslations("common");
  const locale = useLocale();
  const roleOptions = ROLES.map((value) => ({ value, label: tPlural(value) }));
  const queryClient = useQueryClient();
  const gridRef = useRef<HTMLDivElement>(null);
  const [role, setRole] = useState<TeamRole[]>([]);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<ViewMode>("grid");
  const [deactivating, setDeactivating] = useState<TeamMember | null>(null);
  const [removing, setRemoving] = useState<TeamMember | null>(null);

  // Remembered per browser; read after mount so the server and client first render match.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("team-view");
      if (saved === "list" || saved === "table") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setView(saved);
      }
    } catch {}
  }, []);

  function changeView(next: ViewMode) {
    setView(next);
    try {
      window.localStorage.setItem("team-view", next);
    } catch {}
  }

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["team"],
    queryFn: () => listTeam(requireToken()),
  });

  // Owner first, then admins, then agents; whoever has lost access goes last in each group.
  const sorted = useMemo(
    () =>
      [...(data ?? [])].sort(
        (a, b) =>
          Number(b.isActive) - Number(a.isActive) ||
          ROLE_ORDER[a.role] - ROLE_ORDER[b.role] ||
          a.name.localeCompare(b.name, locale),
      ),
    [data, locale],
  );

  const counts = useMemo(() => {
    const result: Record<string, number> = { ALL: sorted.length };
    for (const member of sorted) result[member.role] = (result[member.role] ?? 0) + 1;
    return result;
  }, [sorted]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return sorted.filter((member) => {
      if (role.length > 0 && !role.includes(member.role)) return false;
      if (!term) return true;
      return `${member.name} ${member.email}`.toLowerCase().includes(term);
    });
  }, [sorted, role, search]);

  const updateMutation = useMutation({
    mutationFn: ({ id, ...payload }: { id: string; role?: TeamRole; isActive?: boolean; done: string }) =>
      updateTeamMember(requireToken(), id, { role: payload.role, isActive: payload.isActive }),
    onSuccess: (_, variables) => toast.success(variables.done),
    onError: (err) => toast.error(err instanceof ApiError ? err.message : t("updateFailed")),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["team"] }),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => removeTeamMember(requireToken(), id),
    onSuccess: () => toast.success(t("removed")),
    onError: (err) => toast.error(err instanceof ApiError ? err.message : t("removeFailed")),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["team"] }),
  });

  const actions: TeamActions = {
    changeRole: (id, next) =>
      updateMutation.mutate({ id, role: next, done: t("roleChanged", { role: tRoles(next) }) }),
    setActive: (id, isActive) => {
      const member = data?.find((m) => m.id === id);
      if (isActive) updateMutation.mutate({ id, isActive, done: t("reactivated") });
      else if (member) setDeactivating(member);
    },
    requestRemove: (id) => {
      const member = data?.find((m) => m.id === id);
      if (member) setRemoving(member);
    },
  };

  const total = sorted.length;
  const visibleKey = filtered.map((member) => member.id).join(",");
  const hasFilters = role.length > 0 || search.trim() !== "";

  // Cards settle in one after another whenever the visible set changes.
  useGSAP(
    () => {
      if (!gridRef.current || filtered.length === 0) return;
      const mm = gsap.matchMedia();
      mm.add(media.allowMotion, () => {
        gsap.from(".team-card", {
          opacity: 0,
          y: distance.md,
          duration: duration.macro,
          ease: ease.out,
          stagger: rowStagger,
        });
      });
      return () => mm.revert();
    },
    { scope: gridRef, dependencies: [visibleKey, view] },
  );

  return (
    <div className="flex flex-col gap-8">
      <h1 className="sr-only">{t("title")}</h1>

      {!(data && total === 0) && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-3">
          {total > 0 && (
            <div className="relative w-full sm:max-w-xl sm:min-w-72 sm:flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t("searchPlaceholder")}
                aria-label={t("search")}
                data-list-search
                className="h-10 rounded-full border-transparent bg-foreground/[0.07] pl-10 transition-[background-color,box-shadow,border-color] duration-500 ease-out focus-visible:border-primary/20 focus-visible:bg-card focus-visible:shadow-[0_8px_24px_-12px_oklch(0.3_0.05_160/0.3)] focus-visible:ring-0 dark:bg-foreground/10 dark:focus-visible:bg-card"
              />
            </div>
          )}
          <div className="flex flex-wrap items-center gap-3 sm:ml-auto">
            {total > 0 && (
              <>
                <FilterMenu
                  name={t("role")}
                  plural={t("roles")}
                  options={roleOptions}
                  value={role}
                  onChange={setRole}
                  counts={counts}
                />
                <ViewSwitch value={view} onChange={changeView} />
              </>
            )}
            <HelpLink section="equipo" label={t("help")} />
            <InviteMemberDialog />
          </div>
        </div>
      )}

      {error && (
        <div className="flex flex-col items-start gap-4 rounded-2xl bg-card p-6 ring-1 ring-foreground/5">
          <div>
            <p className="font-display text-xl">{t("loadFailed")}</p>
            <p className="text-sm text-muted-foreground">
              {error instanceof ApiError ? error.message : tc("checkConnection")}
            </p>
          </div>
          <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
            <RotateCcw />
            {tc("retry")}
          </Button>
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-6">
          {Array.from({ length: 6 }, (_, index) => (
            <TeamCardSkeleton key={index} />
          ))}
        </div>
      )}

      {data && total === 0 && (
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-card px-6 py-16 text-center ring-1 ring-foreground/5">
          <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
            <Users className="size-6" />
          </span>
          <div className="flex max-w-sm flex-col gap-1">
            <p className="font-display text-2xl">{t("empty.title")}</p>
            <p className="text-sm text-muted-foreground">{t("empty.body")}</p>
          </div>
          <InviteMemberDialog />
          <HelpHint section="equipo">{t("empty.help")}</HelpHint>
        </div>
      )}

      {data && total > 0 && filtered.length === 0 && (
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-card px-6 py-16 text-center ring-1 ring-foreground/5">
          <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
            <SearchX className="size-6" />
          </span>
          <div className="flex max-w-sm flex-col gap-1">
            <p className="font-display text-2xl">{t("noMatch.title")}</p>
            <p className="text-sm text-muted-foreground">{t("noMatch.body")}</p>
          </div>
          {hasFilters && (
            <Button
              variant="outline"
              onClick={() => {
                setRole([]);
                setSearch("");
              }}
            >
              {tc("clearFilters")}
            </Button>
          )}
        </div>
      )}

      {filtered.length > 0 && view === "grid" && (
        <div ref={gridRef} className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-6">
          {filtered.map((member) => (
            <TeamCard key={member.id} member={member} actions={actions} />
          ))}
        </div>
      )}

      {filtered.length > 0 && view === "list" && (
        <div ref={gridRef} className="flex flex-col gap-4">
          {filtered.map((member) => (
            <TeamRow key={member.id} member={member} actions={actions} />
          ))}
        </div>
      )}

      {filtered.length > 0 && view === "table" && (
        <div ref={gridRef}>
          <TeamTable members={filtered} actions={actions} />
        </div>
      )}

      <AlertDialog open={deactivating != null} onOpenChange={(open) => !open && setDeactivating(null)}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-2xl">{t("deactivate.title")}</AlertDialogTitle>
            <AlertDialogDescription>{t("deactivate.body", { name: deactivating?.name ?? "" })}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tc("back")}</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (deactivating) updateMutation.mutate({ id: deactivating.id, isActive: false, done: t("deactivated") });
                setDeactivating(null);
              }}
            >
              {t("deactivate.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={removing != null} onOpenChange={(open) => !open && setRemoving(null)}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-2xl">{t("remove.title")}</AlertDialogTitle>
            <AlertDialogDescription>{t("remove.body", { name: removing?.name ?? "" })}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tc("back")}</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (removing) removeMutation.mutate(removing.id);
                setRemoving(null);
              }}
            >
              {t("remove.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
