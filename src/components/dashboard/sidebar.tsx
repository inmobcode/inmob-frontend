"use client";

import { LogoIcon } from "@/components/logo-icon";
import {
  Building2,
  CalendarDays,
  Globe,
  Inbox,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Tag,
  Users,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { TOGGLE_SIDEBAR_EVENT } from "@/components/dashboard/shortcuts";
import { getUnreadInquiries } from "@/lib/api/inquiries";
import { getAccessToken } from "@/lib/auth/session";
import { UserMenu } from "@/components/dashboard/user-menu";
import { Button } from "@/components/ui/button";
import { useSessionUser } from "@/lib/auth/session";
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
import { gsap, useGSAP } from "@/lib/gsap";
import {
  SIDEBAR_ANIMATING_ATTR,
  SIDEBAR_COOKIE,
  SIDEBAR_SETTLED_EVENT,
} from "@/lib/sidebar";
import { distance, duration, ease, media, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const EXPANDED_WIDTH = 255;
const COLLAPSED_WIDTH = 72;

/**
 * The agency the dashboard is showing. The URL (`/[agencySlug]/…`) always has
 * it; the session cookie is only a fallback, because sessions started before
 * the slug was stored there don't carry it.
 */
function useAgencySlug() {
  const params = useParams<{ agencySlug?: string }>();
  const user = useSessionUser();
  return params.agencySlug ?? user?.agencySlug ?? null;
}

/**
 * Team, Settings and the portal editor are OWNER/ADMIN territory. The role
 * comes from the session cookie, read after mount: until then only the
 * shared items show, so an agent never sees admin links flash by.
 */
function navItemsFor(agencySlug: string, role: string | undefined): NavItem[] {
  const items: NavItem[] = [
    {
      href: `/${agencySlug}/properties`,
      label: "Propiedades",
      icon: Building2,
    },
    { href: `/${agencySlug}/offers`, label: "Ofertas", icon: Tag },
    { href: `/${agencySlug}/clients`, label: "Clientes", icon: Users },
    { href: `/${agencySlug}/inquiries`, label: "Consultas", icon: Inbox },
    { href: `/${agencySlug}/bookings`, label: "Reservas", icon: CalendarDays },
  ];
  if (role && role !== "AGENT") {
    items.push(
      { href: `/${agencySlug}/team`, label: "Equipo", icon: UsersRound },
      { href: "/portal", label: "Portal", icon: Globe },
      {
        href: `/${agencySlug}/settings`,
        label: "Configuración",
        icon: Settings,
      },
    );
  }
  return items;
}

function Brand() {
  const agencySlug = useAgencySlug();
  return (
    <Link
      href={agencySlug ? `/${agencySlug}/properties` : "/"}
      className="flex items-center gap-2 font-logo text-2xl font-semibold leading-none tracking-tight text-foreground"
    >
      <LogoIcon className="text-primary" />
      Tivvo
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
  badge = 0,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  onNavigate?: () => void;
  /** A count of new things behind this link (unread inquiries). */
  badge?: number;
}) {
  const [hovering, setHovering] = useState(false);

  return (
    <Tooltip open={collapsed && hovering} onOpenChange={setHovering}>
      <TooltipTrigger asChild>
        <Link
          href={item.href}
          data-nav-link
          aria-current={active ? "page" : undefined}
          aria-label={
            badge > 0 ? `${item.label}, ${badge} sin leer` : item.label
          }
          onClick={onNavigate}
          className={cn(
            "relative z-10 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors",
            active
              ? "text-sidebar-primary-foreground"
              : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
          )}
        >
          <span className="relative flex shrink-0">
            <item.icon className="size-4" />
            {badge > 0 && collapsed && (
              <span
                aria-hidden
                className={cn(
                  "absolute -top-1 -right-1 size-2 rounded-full ring-2",
                  active
                    ? "bg-sidebar-primary-foreground ring-sidebar-primary"
                    : "bg-primary ring-sidebar",
                )}
              />
            )}
          </span>
          <span
            className={cn(
              "transition-opacity duration-200",
              collapsed && "opacity-0",
            )}
          >
            {item.label}
          </span>
          {badge > 0 && !collapsed && (
            <span
              aria-hidden
              className={cn(
                "ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold tabular-nums",
                // On the active (dark) row the badge flips so it stays visible.
                active
                  ? "bg-sidebar-primary-foreground text-sidebar-primary"
                  : "bg-primary text-primary-foreground",
              )}
            >
              {badge > 99 ? "99+" : badge}
            </span>
          )}
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
  const user = useSessionUser();
  const navRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const placed = useRef(false);

  const agencySlug = useAgencySlug();
  const navItems = agencySlug ? navItemsFor(agencySlug, user?.role) : [];
  const entered = useRef(false);

  // New inquiries show as a count on "Consultas"; refreshed every minute.
  const { data: unread } = useQuery({
    queryKey: ["inquiries-unread"],
    queryFn: () => {
      const token = getAccessToken();
      return token ? getUnreadInquiries(token) : { count: 0 };
    },
    refetchInterval: 60_000,
  });

  const activeHref = navItems.find((item) =>
    pathname.startsWith(item.href),
  )?.href;

  // Entrance: links settle in one after another, once, as soon as there are links.
  useGSAP(
    () => {
      if (entered.current || !navRef.current?.querySelector("[data-nav-link]"))
        return;
      entered.current = true;
      const mm = gsap.matchMedia();
      mm.add(media.allowMotion, () => {
        gsap.from("[data-nav-link]", {
          opacity: 0,
          x: -distance.sm,
          duration: duration.base,
          ease: ease.out,
          stagger: stagger.base,
        });
      });
      return () => mm.revert();
    },
    // No deps means @gsap/react reruns this on every render — it replayed
    // the fade/slide-in on every collapse toggle. It waits for the first links instead.
    { scope: navRef, dependencies: [navItems.length > 0] },
  );

  // The active pill glides to the current link instead of jumping.
  useGSAP(
    () => {
      const indicator = indicatorRef.current;
      const nav = navRef.current;
      if (!indicator || !nav) return;
      const target = activeHref
        ? nav.querySelector<HTMLElement>(
            `[data-nav-link][href="${activeHref}"]`,
          )
        : null;
      if (!target) {
        gsap.set(indicator, { opacity: 0 });
        return;
      }
      const state = {
        y: target.offsetTop,
        height: target.offsetHeight,
        opacity: 1,
      };
      const animate =
        placed.current && !window.matchMedia(media.reduceMotion).matches;
      if (animate) {
        gsap.to(indicator, {
          ...state,
          duration: duration.base,
          ease: ease.inOut,
        });
      } else {
        gsap.set(indicator, state);
      }
      placed.current = true;
    },
    { scope: navRef, dependencies: [activeHref] },
  );

  return (
    <nav ref={navRef} className="relative flex flex-col gap-3">
      <span
        ref={indicatorRef}
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 rounded-lg bg-sidebar-primary opacity-0"
      />
      {navItems.map((item) => (
        <NavLink
          key={item.href}
          item={item}
          active={item.href === activeHref}
          collapsed={collapsed}
          onNavigate={onNavigate}
          badge={item.href.endsWith("/inquiries") ? (unread?.count ?? 0) : 0}
        />
      ))}
    </nav>
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
  // The toggle moves while the sidebar resizes; its tooltip would chase it and
  // swap its text mid-flight, so it stays closed until the pointer leaves.
  const [tipOpen, setTipOpen] = useState(false);

  return (
    <div className="flex h-full flex-col gap-8 overflow-hidden p-4">
      <div className="relative flex min-h-10 items-center justify-end pt-2">
        <span
          aria-hidden={collapsed}
          className={cn(
            "absolute top-2 left-3 flex h-8 items-center whitespace-nowrap transition-opacity duration-200",
            collapsed && "pointer-events-none opacity-0",
          )}
        >
          <Brand />
        </span>
        {onToggle && (
          <Tooltip open={tipOpen} onOpenChange={setTipOpen}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setTipOpen(false);
                  onToggle();
                }}
                aria-label={collapsed ? "Expandir menú" : "Contraer menú"}
                aria-expanded={!collapsed}
                className={cn(
                  "shrink-0 text-muted-foreground transition-transform duration-300 hover:text-foreground",
                  collapsed && "-translate-x-1",
                )}
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
          "rounded-3xl p-1.5 ring-1 backdrop-blur transition-[background-color,box-shadow,padding] duration-300",
          collapsed
            ? "bg-transparent p-0 ring-transparent"
            : "bg-card/60 ring-foreground/5",
        )}
      >
        <UserMenu collapsed={collapsed} />
      </div>
    </div>
  );
}

export function DashboardSidebar({
  initialCollapsed,
}: {
  initialCollapsed: boolean;
}) {
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const asideRef = useRef<HTMLElement>(null);
  const mounted = useRef(false);

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

  useEffect(() => {
    window.addEventListener(TOGGLE_SIDEBAR_EVENT, toggle);
    return () => window.removeEventListener(TOGGLE_SIDEBAR_EVENT, toggle);
  }, [toggle]);

  // The first render already has the right width (it comes from a cookie),
  // so only later changes animate.
  useGSAP(
    () => {
      const width = collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;
      if (!mounted.current || window.matchMedia(media.reduceMotion).matches) {
        gsap.set(asideRef.current, { width });
      } else {
        const root = document.documentElement;
        root.setAttribute(SIDEBAR_ANIMATING_ATTR, "");
        gsap.to(asideRef.current, {
          width,
          duration: duration.base,
          ease: ease.inOut,
          overwrite: true,
          onComplete: () => {
            root.removeAttribute(SIDEBAR_ANIMATING_ATTR);
            window.dispatchEvent(new Event(SIDEBAR_SETTLED_EVENT));
          },
        });
      }
      mounted.current = true;
    },
    { dependencies: [collapsed] },
  );

  return (
    <aside
      ref={asideRef}
      style={{ width: initialCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH }}
      className="sticky top-0 hidden h-svh shrink-0 bg-sidebar will-change-[width] md:block"
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
        <SheetContent
          side="left"
          className="w-72 bg-sidebar p-0"
          showCloseButton={false}
        >
          <SheetTitle className="sr-only">Menú</SheetTitle>
          <SheetDescription className="sr-only">
            Navegación principal
          </SheetDescription>
          <SidebarBody onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </header>
  );
}
