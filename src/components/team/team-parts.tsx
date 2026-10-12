"use client";

import { Check, Copy, Mail, MoreHorizontal, Power, Repeat2 } from "lucide-react";
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
import type { TeamMember, TeamRole } from "@/lib/api/team";
import { cn } from "@/lib/utils";

export const ROLES: TeamRole[] = ["OWNER", "ADMIN", "AGENT"];

export const ROLE_LABELS: Record<TeamRole, string> = {
  OWNER: "Propietario",
  ADMIN: "Administrador",
  AGENT: "Agente",
};

export const ROLE_HINTS: Record<TeamRole, string> = {
  OWNER: "Dueño de la cuenta",
  ADMIN: "Gestiona equipo, propiedades y ofertas",
  AGENT: "Trabaja con propiedades, clientes y reservas",
};

export interface TeamActions {
  changeRole: (id: string, role: Exclude<TeamRole, "OWNER">) => void;
  setActive: (id: string, isActive: boolean) => void;
}

const ROLE_STYLES: Record<TeamRole, string> = {
  OWNER: "bg-primary text-primary-foreground",
  ADMIN: "bg-highlight/40 text-highlight-foreground",
  AGENT: "bg-primary/10 text-primary",
};

export function RolePill({ role, className }: { role: TeamRole; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center rounded-full px-2.5 text-xs font-medium",
        ROLE_STYLES[role],
        className,
      )}
    >
      {ROLE_LABELS[role]}
    </span>
  );
}

export function ActivePill({ active, className }: { active: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center rounded-full px-2.5 text-xs font-medium",
        active ? "bg-primary/10 text-primary" : "bg-foreground/[0.07] text-muted-foreground",
        className,
      )}
    >
      {active ? "Activo" : "Inactivo"}
    </span>
  );
}

export function TeamMenu({
  member,
  actions,
  className,
}: {
  member: TeamMember;
  actions: TeamActions;
  className?: string;
}) {
  const locked = member.role === "OWNER";

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(member.email);
      toast.success("Email copiado");
    } catch {
      toast.error("No se pudo copiar el email");
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Acciones de ${member.name}`}
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground/[0.06] text-foreground transition-colors outline-none hover:bg-foreground/10 focus-visible:ring-3 focus-visible:ring-ring/50 data-[state=open]:bg-foreground/10",
            className,
          )}
        >
          <MoreHorizontal className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-2xl p-1.5">
        <DropdownMenuItem className="rounded-xl py-2" asChild>
          <a href={`mailto:${member.email}`}>
            <Mail />
            Enviar email
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem className="rounded-xl py-2" onSelect={copyEmail}>
          <Copy />
          Copiar email
        </DropdownMenuItem>
        {!locked && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="rounded-xl py-2">
                <Repeat2 />
                Cambiar rol
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-52 rounded-2xl p-1.5">
                {(["ADMIN", "AGENT"] as const).map((role) => (
                  <DropdownMenuItem
                    key={role}
                    className="rounded-xl py-2"
                    onSelect={() => role !== member.role && actions.changeRole(member.id, role)}
                  >
                    {ROLE_LABELS[role]}
                    {role === member.role && <Check className="ml-auto" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuItem
              variant={member.isActive ? "destructive" : "default"}
              className="rounded-xl py-2"
              onSelect={() => actions.setActive(member.id, !member.isActive)}
            >
              <Power />
              {member.isActive ? "Desactivar acceso" : "Reactivar acceso"}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
