"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  Building2,
  CalendarCheck,
  CalendarDays,
  CornerDownLeft,
  FileText,
  Globe,
  Inbox,
  LogOut,
  Monitor,
  Moon,
  PanelLeftClose,
  Plus,
  Search,
  Settings,
  Sun,
  Tag,
  UserRound,
  Users,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { listClients } from "@/lib/api/clients";
import { listOffers } from "@/lib/api/offers";
import { listProperties } from "@/lib/api/properties";
import { clearSession, getAccessToken, useSessionUser } from "@/lib/auth/session";
import { useActionBarStore } from "@/lib/store/action-bar-store";
import { cn } from "@/lib/utils";

// The docs and login live outside the agency-scoped dashboard tree.
const BARE_PATHS = new Set(["/docs", "/login"]);
// Equipo, Configuración and Portal are OWNER/ADMIN territory — see sidebar.tsx.
const RESTRICTED_PATHS = new Set(["/team", "/settings", "/portal"]);

export const OPEN_SHORTCUTS_EVENT = "open-shortcuts";
export const OPEN_PALETTE_EVENT = "open-palette";
export const TOGGLE_SIDEBAR_EVENT = "toggle-sidebar";

const CARD_SELECTOR =
  ".property-card, .offer-card, .client-card, .booking-card, .team-card";

// Labels are keys of "dashboard.shortcuts.go".
const GO_TO: Record<string, { path: string; label: string }> = {
  p: { path: "/properties", label: "properties" },
  o: { path: "/offers", label: "offers" },
  c: { path: "/clients", label: "clients" },
  i: { path: "/inquiries", label: "inquiries" },
  r: { path: "/bookings", label: "bookings" },
  d: { path: "/availability", label: "availability" },
  e: { path: "/team", label: "team" },
  w: { path: "/portal", label: "portal" },
  s: { path: "/settings", label: "settings" },
  m: { path: "/profile", label: "profile" },
};

// Titles and labels are keys of "dashboard.shortcuts.help".
const SHORTCUT_GROUPS: {
  title: "general" | "goTo" | "lists";
  items: { keys: string[]; label: string; go?: boolean }[];
}[] = [
  {
    title: "general",
    items: [
      { keys: ["Ctrl/Cmd", "K"], label: "palette" },
      { keys: ["Ctrl/Cmd", "B"], label: "sidebar" },
      { keys: ["Ctrl/Cmd", "S"], label: "save" },
      { keys: ["?"], label: "help" },
    ],
  },
  {
    title: "goTo",
    items: Object.entries(GO_TO).map(([key, target]) => ({
      keys: ["G", key.toUpperCase()],
      label: target.label,
      go: true,
    })),
  },
  {
    title: "lists",
    items: [
      { keys: ["N"], label: "new" },
      { keys: ["/"], label: "search" },
      { keys: ["F"], label: "filter" },
      { keys: ["1", "2", "3"], label: "views" },
      { keys: ["J", "K"], label: "move" },
      { keys: ["Enter"], label: "open" },
      { keys: ["Esc"], label: "clear" },
    ],
  },
];

function isTyping(target: EventTarget | null) {
  return Boolean(
    (target as HTMLElement | null)?.closest?.(
      "input, textarea, select, [contenteditable='true']",
    ),
  );
}

function overlayOpen() {
  return Boolean(
    document.querySelector(
      "[role='dialog'], [role='alertdialog'], [role='menu'], [role='listbox']",
    ),
  );
}

function clickWhenReady(selector: string, timeout = 2500) {
  const started = Date.now();
  const tick = () => {
    const element = document.querySelector<HTMLElement>(selector);
    if (element) element.click();
    else if (Date.now() - started < timeout) window.setTimeout(tick, 60);
  };
  tick();
}

function normalize(text: string) {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

interface Command {
  id: string;
  label: string;
  hint?: string;
  icon: LucideIcon;
  group: string;
  run: () => void;
}

function requireToken() {
  const token = getAccessToken();
  if (!token) throw new Error("No autenticado");
  return token;
}

function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("dashboard.shortcuts");
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useSessionUser();
  const { setTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const properties = useQuery({
    queryKey: ["properties"],
    queryFn: () => listProperties(requireToken()),
    enabled: open,
    staleTime: 60_000,
  });
  const offers = useQuery({
    queryKey: ["offers"],
    queryFn: () => listOffers(requireToken()),
    enabled: open,
    staleTime: 60_000,
  });
  const clients = useQuery({
    queryKey: ["clients"],
    queryFn: () => listClients(requireToken()),
    enabled: open,
    staleTime: 60_000,
  });

  const close = useCallback(() => onOpenChange(false), [onOpenChange]);

  const commands = useMemo<Command[]>(() => {
    const resolve = (path: string) =>
      BARE_PATHS.has(path) || !user ? path : `/${user.agencySlug}${path}`;
    const go = (path: string) => () => {
      close();
      router.push(resolve(path));
    };
    const create = (path: string) => () => {
      close();
      router.push(resolve(path));
      clickWhenReady("[data-new-item]");
    };
    const list: Command[] = [
      {
        id: "go-properties",
        group: t("groups.go"),
        label: t("go.properties"),
        hint: "G P",
        icon: Building2,
        run: go("/properties"),
      },
      {
        id: "go-offers",
        group: t("groups.go"),
        label: t("go.offers"),
        hint: "G O",
        icon: Tag,
        run: go("/offers"),
      },
      {
        id: "go-clients",
        group: t("groups.go"),
        label: t("go.clients"),
        hint: "G C",
        icon: Users,
        run: go("/clients"),
      },
      {
        id: "go-inquiries",
        group: t("groups.go"),
        label: t("go.inquiries"),
        hint: "G I",
        icon: Inbox,
        run: go("/inquiries"),
      },
      {
        id: "go-bookings",
        group: t("groups.go"),
        label: t("go.bookings"),
        hint: "G R",
        icon: CalendarDays,
        run: go("/bookings"),
      },
      {
        id: "go-availability",
        group: t("groups.go"),
        label: t("go.availability"),
        hint: "G D",
        icon: CalendarCheck,
        run: go("/availability"),
      },
      {
        id: "go-team",
        group: t("groups.go"),
        label: t("go.team"),
        hint: "G E",
        icon: UsersRound,
        run: go("/team"),
      },
      {
        id: "go-portal",
        group: t("groups.go"),
        label: t("go.portal"),
        hint: "G W",
        icon: Globe,
        run: go("/portal"),
      },
      {
        id: "go-settings",
        group: t("groups.go"),
        label: t("go.settings"),
        hint: "G S",
        icon: Settings,
        run: go("/settings"),
      },
      {
        id: "go-profile",
        group: t("groups.go"),
        label: t("go.profile"),
        hint: "G M",
        icon: UserRound,
        run: go("/profile"),
      },
      {
        id: "go-docs",
        group: t("groups.go"),
        label: t("commands.docs"),
        icon: BookOpen,
        // Opens beside the dashboard, so reading it never loses your place.
        run: () => {
          close();
          window.open("/docs", "_blank", "noopener");
        },
      },
      {
        id: "new-property",
        group: t("groups.create"),
        label: t("commands.newProperty"),
        icon: Plus,
        run: create("/properties"),
      },
      {
        id: "new-offer",
        group: t("groups.create"),
        label: t("commands.newOffer"),
        icon: Plus,
        run: create("/offers"),
      },
      {
        id: "new-client",
        group: t("groups.create"),
        label: t("commands.newClient"),
        icon: Plus,
        run: create("/clients"),
      },
      {
        id: "new-booking",
        group: t("groups.create"),
        label: t("commands.newBooking"),
        icon: Plus,
        run: create("/bookings"),
      },
      {
        id: "new-member",
        group: t("groups.create"),
        label: t("commands.newMember"),
        icon: Plus,
        run: create("/team"),
      },
      {
        id: "theme-light",
        group: t("groups.actions"),
        label: t("commands.light"),
        icon: Sun,
        run: () => {
          setTheme("light");
          close();
        },
      },
      {
        id: "theme-dark",
        group: t("groups.actions"),
        label: t("commands.dark"),
        icon: Moon,
        run: () => {
          setTheme("dark");
          close();
        },
      },
      {
        id: "theme-system",
        group: t("groups.actions"),
        label: t("commands.system"),
        icon: Monitor,
        run: () => {
          setTheme("system");
          close();
        },
      },
      {
        id: "sidebar",
        group: t("groups.actions"),
        label: t("commands.sidebar"),
        hint: "⌘ B",
        icon: PanelLeftClose,
        run: () => {
          close();
          window.dispatchEvent(new Event(TOGGLE_SIDEBAR_EVENT));
        },
      },
      {
        id: "logout",
        group: t("groups.actions"),
        label: t("commands.logout"),
        icon: LogOut,
        run: () => {
          clearSession();
          queryClient.clear();
          close();
          router.push("/login");
        },
      },
    ];

    const RESTRICTED_COMMANDS = new Set([
      "go-team",
      "go-portal",
      "go-settings",
      "new-member",
    ]);
    const allowed =
      user?.role === "AGENT"
        ? list.filter((command) => !RESTRICTED_COMMANDS.has(command.id))
        : list;

    const term = normalize(query.trim());
    if (!term) return allowed;
    const matches = allowed.filter((command) =>
      normalize(command.label).includes(term),
    );

    interface RecordItem {
      id: string;
      group: string;
      label: string;
      hint?: string;
      icon: LucideIcon;
      text: string;
      path: string;
    }
    const found: RecordItem[] = [
      ...(properties.data ?? []).map((item) => ({
        id: `property-${item.id}`,
        group: t("groups.properties"),
        label: item.title,
        icon: Building2,
        text: item.title,
        path: `/properties/${item.id}`,
      })),
      ...(offers.data ?? []).map((item) => ({
        id: `offer-${item.id}`,
        group: t("groups.offers"),
        label: item.title,
        hint: item.clientName ?? undefined,
        icon: FileText,
        text: `${item.title} ${item.clientName ?? ""}`,
        path: `/offers/${item.id}`,
      })),
      ...(clients.data ?? []).map((item) => ({
        id: `client-${item.id}`,
        group: t("groups.clients"),
        label: item.name,
        hint: item.email,
        icon: Users,
        text: `${item.name} ${item.email}`,
        path: `/clients/${item.id}`,
      })),
    ];
    const records: Command[] = found
      .filter((record) => normalize(record.text).includes(term))
      .slice(0, 12)
      .map((record) => ({
        id: record.id,
        group: record.group,
        label: record.label,
        hint: record.hint,
        icon: record.icon,
        run: go(record.path),
      }));

    return [...records, ...matches];
  }, [
    query,
    properties.data,
    offers.data,
    clients.data,
    router,
    close,
    setTheme,
    queryClient,
    user,
    t,
  ]);

  // Whatever is highlighted should stay on screen while arrowing through the list.
  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((value) => Math.min(value + 1, commands.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((value) => Math.max(value - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      commands[active]?.run();
    }
  }

  let lastGroup = "";

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) {
          setQuery("");
          setActive(0);
        }
      }}
    >
      <DialogContent
        className="top-[22%] translate-y-0 gap-0 overflow-hidden rounded-3xl p-0 sm:max-w-xl"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">{t("paletteTitle")}</DialogTitle>
        <DialogDescription className="sr-only">{t("paletteDescription")}</DialogDescription>
        <div className="flex items-center gap-3 px-5 py-4">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder={t("palettePlaceholder")}
            aria-label={t("paletteSearch")}
            className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden h-6 items-center rounded-md bg-foreground/[0.07] px-1.5 text-xs text-muted-foreground sm:inline-flex">
            Esc
          </kbd>
        </div>

        <div ref={listRef} className="max-h-[22rem] overflow-y-auto px-2 pb-2">
          {commands.length === 0 && (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">{t("nothingFor", { query })}</p>
          )}
          {commands.map((command, index) => {
            const heading = command.group !== lastGroup;
            lastGroup = command.group;
            return (
              <div key={command.id}>
                {heading && (
                  <p className="px-3 pt-3 pb-1 text-xs font-medium text-muted-foreground">
                    {command.group}
                  </p>
                )}
                <button
                  type="button"
                  data-index={index}
                  onMouseMove={() => setActive(index)}
                  onClick={command.run}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm outline-none transition-colors",
                    index === active
                      ? "bg-secondary"
                      : "hover:bg-foreground/[0.04]",
                  )}
                >
                  <command.icon className="size-4 shrink-0 text-muted-foreground" />
                  <span className="min-w-0 flex-1 truncate">
                    {command.label}
                  </span>
                  {command.hint && (
                    <span className="shrink-0 truncate text-xs text-muted-foreground">
                      {command.hint}
                    </span>
                  )}
                  {index === active && (
                    <CornerDownLeft className="size-3.5 shrink-0 text-muted-foreground" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ShortcutsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("dashboard.shortcuts");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="gap-0 rounded-3xl p-0 sm:max-w-lg"
        showCloseButton
      >
        <div className="flex flex-col gap-1.5 px-7 pt-7 pb-5">
          <DialogTitle className="font-display text-3xl leading-none tracking-tight">{t("helpTitle")}</DialogTitle>
          <DialogDescription>{t("helpDescription")}</DialogDescription>
        </div>
        <div className="flex max-h-[60vh] flex-col gap-6 overflow-y-auto px-7 pb-7">
          {SHORTCUT_GROUPS.map((group) => (
            <section key={group.title} className="flex flex-col gap-2.5">
              <h3 className="font-display text-lg leading-tight">{t(`help.${group.title}`)}</h3>
              <ul className="flex flex-col gap-2.5">
                {group.items.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-center justify-between gap-4 text-sm"
                  >
                    <span>{item.go ? t(`go.${item.label}` as never) : t(`help.${item.label}` as never)}</span>
                    <span className="flex shrink-0 items-center gap-1">
                      {item.keys.map((key, index) => (
                        <span key={key} className="flex items-center gap-1">
                          {index > 0 && group.title === "goTo" && (
                            <span className="text-xs text-muted-foreground">{t("then")}</span>
                          )}
                          <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded-md bg-foreground/[0.07] px-1.5 text-xs font-medium">
                            {key}
                          </kbd>
                        </span>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Global keyboard shortcuts of the dashboard, the command palette and the help dialog. */
export function Shortcuts() {
  const t = useTranslations("dashboard.shortcuts");
  const router = useRouter();
  const user = useSessionUser();
  const [helpOpen, setHelpOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [pendingGo, setPendingGo] = useState(false);
  const goTimer = useRef<number | null>(null);

  useEffect(() => {
    const openHelp = () => setHelpOpen(true);
    const openPalette = () => setPaletteOpen(true);
    window.addEventListener(OPEN_SHORTCUTS_EVENT, openHelp);
    window.addEventListener(OPEN_PALETTE_EVENT, openPalette);
    return () => {
      window.removeEventListener(OPEN_SHORTCUTS_EVENT, openHelp);
      window.removeEventListener(OPEN_PALETTE_EVENT, openPalette);
    };
  }, []);

  useEffect(() => {
    function endGo() {
      if (goTimer.current) window.clearTimeout(goTimer.current);
      goTimer.current = null;
      setPendingGo(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      // Chrome's autofill fires keydown events with no `key`: nothing to match.
      if (!event.key) return;
      const mod = event.metaKey || event.ctrlKey;
      const key = event.key.toLowerCase();

      if (mod && key === "k") {
        event.preventDefault();
        setPaletteOpen((value) => !value);
        return;
      }

      if (mod && key === "s") {
        const { onSave, canSubmit, isSubmitting, isDirty } =
          useActionBarStore.getState();
        if (!onSave) return;
        event.preventDefault();
        if (!isDirty) toast(t("nothingToSave"));
        else if (canSubmit && !isSubmitting) onSave();
        return;
      }

      if (mod || event.altKey) return;
      if (isTyping(event.target) || overlayOpen()) return;

      if (event.key === "?") {
        event.preventDefault();
        setHelpOpen(true);
        return;
      }

      if (goTimer.current) {
        const target = GO_TO[key];
        endGo();
        if (target && !(RESTRICTED_PATHS.has(target.path) && user?.role === "AGENT")) {
          event.preventDefault();
          const path =
            BARE_PATHS.has(target.path) || !user
              ? target.path
              : `/${user.agencySlug}${target.path}`;
          router.push(path);
        }
        return;
      }

      switch (key) {
        case "g":
          setPendingGo(true);
          goTimer.current = window.setTimeout(endGo, 1500);
          break;
        case "n": {
          const button = document.querySelector<HTMLElement>("[data-new-item]");
          if (button) {
            event.preventDefault();
            button.click();
          }
          break;
        }
        case "/": {
          const input = document.querySelector<HTMLInputElement>("input[data-list-search]");
          if (input) {
            event.preventDefault();
            input.focus();
            input.select();
          }
          break;
        }
        case "f": {
          const filter =
            document.querySelector<HTMLElement>("[data-filter-menu]");
          if (filter) {
            event.preventDefault();
            filter.click();
          }
          break;
        }
        case "1":
        case "2":
        case "3": {
          const view = { "1": "grid", "2": "list", "3": "table" }[key];
          document.querySelector<HTMLElement>(`button[data-view="${view}"]`)?.click();
          break;
        }
        case "j":
        case "k": {
          const items = Array.from(
            document.querySelectorAll<HTMLElement>(CARD_SELECTOR),
          );
          if (items.length === 0) break;
          event.preventDefault();
          const current = items.findIndex(
            (item) =>
              item === document.activeElement ||
              item.contains(document.activeElement),
          );
          const next =
            key === "j"
              ? Math.min(current + 1, items.length - 1)
              : Math.max(current <= 0 ? 0 : current - 1, 0);
          const item = items[next];
          const focusable = item.matches("a")
            ? item
            : (item.querySelector<HTMLElement>("a[href]") ?? item);
          if (focusable === item && !item.hasAttribute("tabindex"))
            item.setAttribute("tabindex", "-1");
          focusable.focus({ preventScroll: true });
          item.scrollIntoView({ block: "center", behavior: "smooth" });
          break;
        }
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      if (goTimer.current) window.clearTimeout(goTimer.current);
    };
  }, [router, user, t]);

  return (
    <>
      {pendingGo && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full bg-foreground/85 px-4 py-2 text-sm text-background shadow-lg backdrop-blur"
        >
          <kbd className="rounded-md bg-background/20 px-1.5 text-xs">G</kbd>
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
            {Object.entries(GO_TO)
              .filter(
                ([, target]) =>
                  !(RESTRICTED_PATHS.has(target.path) && user?.role === "AGENT"),
              )
              .map(([key, target]) => (
                <span key={key}>
                  <kbd className="mr-1 rounded-md bg-background/20 px-1.5">
                    {key.toUpperCase()}
                  </kbd>
                  {t(`go.${target.label}` as never)}
                </span>
              ))}
          </span>
        </div>
      )}
      <ShortcutsDialog open={helpOpen} onOpenChange={setHelpOpen} />
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </>
  );
}
