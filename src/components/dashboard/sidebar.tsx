"use client";

import {
  Building2,
  CalendarDays,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Tag,
  Users,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { clearSession, getSessionUser } from "@/lib/auth/session";
import { SIDEBAR_COOKIE } from "@/lib/sidebar";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const EXPANDED_WIDTH = 255;
const COLLAPSED_WIDTH = 72;

const NAV_ITEMS: NavItem[] = [
  { href: "/properties", label: "Propiedades", icon: Building2 },
  { href: "/offers", label: "Ofertas", icon: Tag },
  { href: "/clients", label: "Clientes", icon: Users },
  { href: "/bookings", label: "Reservas", icon: CalendarDays },
  { href: "/team", label: "Equipo", icon: UsersRound },
  { href: "/settings", label: "Configuración", icon: Settings },
];

const NAME_FALLBACK = "Tu nombre";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function Brand() {
  return (
    <Link
      href="/properties"
      className="font-display text-2xl leading-none tracking-tight text-foreground"
    >
      Inmobiliario
    </Link>
  );
}

/**
 * Tooltips only make sense while collapsed (the label itself is hidden then).
 * The `open` prop stays a real boolean for the component's whole lifetime —
 * toggling it between `false` and `undefined` on collapse/expand is what
 * triggers Radix's "changing from controlled to uncontrolled" warning and
 * the visible flicker that comes with it.
 */
function NavLink({
  item,
  active,
  collapsed,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const [hovering, setHovering] = useState(false);

  return (
    <Tooltip open={collapsed && hovering} onOpenChange={setHovering}>
      <TooltipTrigger asChild>
        <Link
          href={item.href}
          aria-current={active ? "page" : undefined}
          aria-label={item.label}
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors",
            active
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
          )}
        >
          <item.icon className="size-4 shrink-0" />
          <span className={cn("transition-opacity duration-200", collapsed && "opacity-0")}>
            {item.label}
          </span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={12}>
        {item.label}
      </TooltipContent>
    </Tooltip>
  );
}

function SidebarNav({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const activeHref = NAV_ITEMS.find((item) => pathname.startsWith(item.href))?.href;

  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.href}
          item={item}
          active={item.href === activeHref}
          collapsed={collapsed}
          onNavigate={onNavigate}
        />
      ))}
    </nav>
  );
}

function UserMenu({ collapsed }: { collapsed: boolean }) {
  const router = useRouter();
  // Deliberately not a lazy useState initializer: document.cookie is
  // unavailable during SSR but present on the client, so reading it
  // synchronously on first render would make the hydrated output diverge
  // from the server-rendered HTML. Deferring to an effect keeps both
  // passes rendering `null` first, then fills in after mount.
  const [user, setUser] = useState<ReturnType<typeof getSessionUser>>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(getSessionUser());
  }, []);

  if (!user) return null;

  function handleLogout() {
    clearSession();
    router.push("/login");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex w-full items-center gap-3 rounded-full p-1.5 text-left outline-none transition-colors hover:bg-foreground/5 focus-visible:ring-3 focus-visible:ring-ring/50",
            collapsed ? "justify-center" : "pr-3",
          )}
        >
          <Avatar>
            <AvatarFallback className="bg-secondary text-xs font-semibold text-secondary-foreground">
              {initials(user.name || NAME_FALLBACK)}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{user.name || NAME_FALLBACK}</span>
              <span className="block truncate text-xs text-muted-foreground">{user.role}</span>
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" className="w-56">
        <DropdownMenuItem onSelect={handleLogout}>
          <LogOut />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SidebarBody({
  collapsed = false,
  onToggle,
  onNavigate,
}: {
  collapsed?: boolean;
  onToggle?: () => void;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col gap-8 overflow-hidden p-4">
      <div
        className={cn(
          "flex items-center pt-2",
          collapsed ? "justify-center" : "justify-between pl-3",
        )}
      >
        {!collapsed && <Brand />}
        {onToggle && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggle}
                aria-label={collapsed ? "Expandir menú" : "Contraer menú"}
                aria-expanded={!collapsed}
                className="text-muted-foreground hover:text-foreground"
              >
                {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={12}>
              {collapsed ? "Expandir" : "Contraer"} (Ctrl/Cmd + B)
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      <div className="flex-1">
        <SidebarNav collapsed={collapsed} onNavigate={onNavigate} />
      </div>
      <div
        className={cn(
          collapsed ? "" : "rounded-3xl bg-card/60 p-1.5 ring-1 ring-foreground/5 backdrop-blur",
        )}
      >
        <UserMenu collapsed={collapsed} />
      </div>
    </div>
  );
}

export function DashboardSidebar({ initialCollapsed }: { initialCollapsed: boolean }) {
  const [collapsed, setCollapsed] = useState(initialCollapsed);

  const toggle = useCallback(() => {
    setCollapsed((value) => {
      const next = !value;
      document.cookie = `${SIDEBAR_COOKIE}=${next ? "1" : "0"}; path=/; max-age=31536000; samesite=lax`;
      return next;
    });
  }, []);

  // Ctrl/Cmd + B toggles, like most editors.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "b") {
        event.preventDefault();
        toggle();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggle]);

  return (
    <aside
      style={{ width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH }}
      className="sticky top-0 hidden h-svh shrink-0 bg-sidebar transition-[width] duration-150 ease-linear md:block"
    >
      <SidebarBody collapsed={collapsed} onToggle={toggle} />
    </aside>
  );
}

export function MobileTopbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between bg-background/85 px-4 backdrop-blur md:hidden">
      <Brand />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Abrir menú">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 bg-sidebar p-0" showCloseButton={false}>
          <SheetTitle className="sr-only">Menú</SheetTitle>
          <SheetDescription className="sr-only">Navegación principal</SheetDescription>
          <SidebarBody onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </header>
  );
}
