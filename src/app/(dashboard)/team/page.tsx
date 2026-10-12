"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RotateCcw, Search, SearchX, Users } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { FilterMenu } from "@/components/filter-menu";
import { ViewSwitch, type ViewMode } from "@/components/properties/view-switch";
import { InviteMemberDialog } from "@/components/team/invite-member-dialog";
import { ROLES, ROLE_LABELS, type TeamActions } from "@/components/team/team-parts";
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
import { listTeam, updateTeamMember, type TeamMember, type TeamRole } from "@/lib/api/team";
import { getAccessToken } from "@/lib/auth/session";
import { gsap, useGSAP } from "@/lib/gsap";
import { distance, duration, ease, media, stagger } from "@/lib/motion";

const ROLE_PLURALS: Record<TeamRole, string> = {
  OWNER: "Propietarios",
  ADMIN: "Administradores",
  AGENT: "Agentes",
};

const ROLE_OPTIONS = ROLES.map((value) => ({ value, label: ROLE_PLURALS[value] }));
const ROLE_ORDER: Record<TeamRole, number> = { OWNER: 0, ADMIN: 1, AGENT: 2 };

function requireToken() {
  const token = getAccessToken();
  if (!token) throw new ApiError("No autenticado", 401);
  return token;
}

export default function TeamPage() {
  const queryClient = useQueryClient();
  const gridRef = useRef<HTMLDivElement>(null);
  const [role, setRole] = useState<TeamRole[]>([]);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<ViewMode>("grid");
  const [deactivating, setDeactivating] = useState<TeamMember | null>(null);

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
          a.name.localeCompare(b.name, "es"),
      ),
    [data],
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
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "No se pudo guardar el cambio"),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["team"] }),
  });

  const actions: TeamActions = {
    changeRole: (id, next) =>
      updateMutation.mutate({ id, role: next, done: `Ahora es ${ROLE_LABELS[next].toLowerCase()}` }),
    setActive: (id, isActive) => {
      const member = data?.find((m) => m.id === id);
      if (isActive) updateMutation.mutate({ id, isActive, done: "Acceso reactivado" });
      else if (member) setDeactivating(member);
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
          stagger: stagger.tight,
        });
      });
      return () => mm.revert();
    },
    { scope: gridRef, dependencies: [visibleKey, view] },
  );

  return (
    <div className="flex flex-col gap-8">
      <h1 className="sr-only">Equipo</h1>

      {!(data && total === 0) && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-3">
          {total > 0 && (
            <div className="relative w-full sm:max-w-xl sm:min-w-72 sm:flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por nombre o email"
                aria-label="Buscar en el equipo"
                className="h-10 rounded-full border-transparent bg-foreground/[0.07] pl-10 transition-[background-color,box-shadow,border-color] duration-500 ease-out focus-visible:border-primary/20 focus-visible:bg-card focus-visible:shadow-[0_8px_24px_-12px_oklch(0.3_0.05_160/0.3)] focus-visible:ring-0 dark:bg-foreground/10 dark:focus-visible:bg-card"
              />
            </div>
          )}
          <div className="flex flex-wrap items-center gap-3 sm:ml-auto">
            {total > 0 && (
              <>
                <FilterMenu
                  name="Rol"
                  plural="roles"
                  options={ROLE_OPTIONS}
                  value={role}
                  onChange={setRole}
                  counts={counts}
                />
                <ViewSwitch value={view} onChange={changeView} />
              </>
            )}
            <InviteMemberDialog />
          </div>
        </div>
      )}

      {error && (
        <div className="flex flex-col items-start gap-4 rounded-2xl bg-card p-6 ring-1 ring-foreground/5">
          <div>
            <p className="font-display text-xl">No pudimos cargar el equipo</p>
            <p className="text-sm text-muted-foreground">
              {error instanceof ApiError ? error.message : "Revisá tu conexión e intentá de nuevo."}
            </p>
          </div>
          <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
            <RotateCcw />
            Reintentar
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
            <p className="font-display text-2xl">Armá tu equipo</p>
            <p className="text-sm text-muted-foreground">Sumá administradores y agentes para trabajar juntos.</p>
          </div>
          <InviteMemberDialog />
        </div>
      )}

      {data && total > 0 && filtered.length === 0 && (
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-card px-6 py-16 text-center ring-1 ring-foreground/5">
          <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
            <SearchX className="size-6" />
          </span>
          <div className="flex max-w-sm flex-col gap-1">
            <p className="font-display text-2xl">Nadie coincide con eso</p>
            <p className="text-sm text-muted-foreground">Probá con otro nombre o quitá el filtro de rol.</p>
          </div>
          {hasFilters && (
            <Button
              variant="outline"
              onClick={() => {
                setRole([]);
                setSearch("");
              }}
            >
              Quitar filtros
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
            <AlertDialogTitle className="font-display text-2xl">¿Desactivar el acceso?</AlertDialogTitle>
            <AlertDialogDescription>
              {deactivating?.name} no va a poder entrar a la cuenta. Sus propiedades y clientes se mantienen y podés
              reactivarlo cuando quieras.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Volver</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (deactivating) updateMutation.mutate({ id: deactivating.id, isActive: false, done: "Acceso desactivado" });
                setDeactivating(null);
              }}
            >
              Desactivar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
