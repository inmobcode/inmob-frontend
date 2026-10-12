"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  Copy,
  ExternalLink,
  Keyboard,
  LifeBuoy,
  LogOut,
  Monitor,
  Moon,
  Search,
  Settings,
  Sun,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { OPEN_PALETTE_EVENT, OPEN_SHORTCUTS_EVENT } from "@/components/dashboard/shortcuts";
import { RolePill } from "@/components/team/team-parts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAgency } from "@/lib/api/agency";
import { clearSession, getAccessToken, getSessionUser, SESSION_USER_EVENT } from "@/lib/auth/session";
import { cn } from "@/lib/utils";

const NAME_FALLBACK = "Tu nombre";
const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

const THEMES: { value: string; label: string; icon: LucideIcon }[] = [
  { value: "light", label: "Claro", icon: Sun },
  { value: "dark", label: "Oscuro", icon: Moon },
  { value: "system", label: "Automático", icon: Monitor },
];

function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  return (
    <div role="radiogroup" aria-label="Apariencia" className="flex gap-0.5 rounded-full bg-foreground/[0.06] p-1">
      {THEMES.map((item) => {
        const active = (theme ?? "system") === item.value;
        return (
          <button
            key={item.value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={item.label}
            title={item.label}
            onClick={() => setTheme(item.value)}
            className={cn(
              "flex size-7 items-center justify-center rounded-full transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              active ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <item.icon className="size-3.5" />
          </button>
        );
      })}
    </div>
  );
}

export function UserMenu({ collapsed }: { collapsed: boolean }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  // Deliberately not a lazy useState initializer: document.cookie is
  // unavailable during SSR but present on the client, so reading it
  // synchronously on first render would make the hydrated output diverge
  // from the server-rendered HTML. Deferring to an effect keeps both
  // passes rendering `null` first, then fills in after mount.
  const [user, setUser] = useState<ReturnType<typeof getSessionUser>>(null);
  useEffect(() => {
    function read() {
      setUser(getSessionUser());
    }
    read();
    window.addEventListener(SESSION_USER_EVENT, read);
    return () => window.removeEventListener(SESSION_USER_EVENT, read);
  }, []);

  const { data: agency } = useQuery({
    queryKey: ["agency"],
    queryFn: () => {
      const token = getAccessToken();
      if (!token) throw new Error("No autenticado");
      return getAgency(token);
    },
    enabled: Boolean(user),
    staleTime: 5 * 60_000,
  });

  if (!user) return null;

  function handleLogout() {
    clearSession();
    // The cache is shared by the whole tab: drop it so the next person to sign in never sees this agency's data.
    queryClient.clear();
    router.push("/login");
  }

  async function copyPortalLink() {
    if (!agency) return;
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/page/${agency.slug}`);
      toast.success("Link del portal copiado");
    } catch {
      toast.error("No se pudo copiar el link");
    }
  }

  const name = user.name || NAME_FALLBACK;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={cn(
              "flex w-full items-center gap-3 rounded-full text-left outline-none transition-[background-color,padding] duration-300 hover:bg-foreground/5 focus-visible:ring-3 focus-visible:ring-ring/50",
              collapsed ? "p-1" : "p-1.5 pr-3",
            )}
          >
            <Avatar className="shrink-0">
              {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt="" />}
              <AvatarFallback className="bg-secondary text-xs font-semibold text-secondary-foreground">
                {initials(name)}
              </AvatarFallback>
            </Avatar>
            <span
              aria-hidden={collapsed}
              className={cn(
                "min-w-0 flex-1 transition-opacity duration-200",
                collapsed && "opacity-0",
              )}
            >
              <span className="block truncate text-sm font-medium">{name}</span>
              <span className="block truncate text-xs text-muted-foreground">{agency?.name ?? user.email}</span>
            </span>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent side="top" align="start" className="w-72 rounded-2xl p-1.5">
          <div className="flex items-center gap-3 px-2.5 pt-2 pb-3">
            <Avatar size="lg" className="size-12">
              {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt="" />}
              <AvatarFallback className="bg-secondary font-display text-lg text-secondary-foreground">
                {initials(name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="truncate font-display text-lg leading-tight">{name}</span>
              <span className="truncate text-xs text-muted-foreground">{user.email}</span>
              <RolePill role={user.role} className="mt-0.5 h-5 self-start px-2 text-[11px]" />
            </div>
          </div>

          {agency && (
            <div className="mx-1 mb-1.5 flex items-center gap-2.5 rounded-xl bg-foreground/[0.05] px-3 py-2">
              <span className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-card text-muted-foreground">
                {agency.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={agency.logoUrl} alt="" className="size-full object-contain" />
                ) : (
                  <Building2 className="size-3.5" />
                )}
              </span>
              <span className="truncate text-sm font-medium">{agency.name}</span>
            </div>
          )}

          <DropdownMenuItem className="rounded-xl py-2" asChild>
            <Link href="/profile">
              <UserRound />
              Mi perfil
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="rounded-xl py-2" asChild>
            <Link href="/settings">
              <Settings />
              Configuración
            </Link>
          </DropdownMenuItem>

          {agency && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="rounded-xl py-2" asChild>
                <a href={`/page/${agency.slug}`} target="_blank" rel="noreferrer">
                  <ExternalLink />
                  Ver mi portal
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl py-2" onSelect={copyPortalLink}>
                <Copy />
                Copiar link del portal
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator />
          <div className="flex items-center justify-between gap-3 px-2.5 py-1.5 text-sm">
            <span>Apariencia</span>
            <ThemeSwitch />
          </div>

          <DropdownMenuSeparator />
          <DropdownMenuItem className="rounded-xl py-2" onSelect={() => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT))}>
            <Search />
            Buscar y comandos
            <kbd className="ml-auto text-xs text-muted-foreground">⌘ K</kbd>
          </DropdownMenuItem>
          <DropdownMenuItem className="rounded-xl py-2" onSelect={() => window.dispatchEvent(new Event(OPEN_SHORTCUTS_EVENT))}>
            <Keyboard />
            Atajos de teclado
            <kbd className="ml-auto text-xs text-muted-foreground">?</kbd>
          </DropdownMenuItem>
          {SUPPORT_EMAIL && (
            <DropdownMenuItem className="rounded-xl py-2" asChild>
              <a href={`mailto:${SUPPORT_EMAIL}`}>
                <LifeBuoy />
                Ayuda y soporte
              </a>
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" className="rounded-xl py-2" onSelect={handleLogout}>
            <LogOut />
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

    </>
  );
}
