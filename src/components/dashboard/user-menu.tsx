"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowUpRight,
  BookOpen,
  Building2,
  Check,
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
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  OPEN_PALETTE_EVENT,
  OPEN_SHORTCUTS_EVENT,
} from "@/components/dashboard/shortcuts";
import { LanguageSubmenu } from "@/components/language-switcher";
import { RolePill } from "@/components/team/team-parts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAgency } from "@/lib/api/agency";
import { listMyAgencies, switchAgency } from "@/lib/api/auth";
import { clearSession, getAccessToken, setSession, useSessionUser } from "@/lib/auth/session";
import { localePath } from "@/i18n/config";
import { siteLocaleOf } from "@/lib/agency-site";
import { getPublicOrigin } from "@/lib/public-origin";
import { cn } from "@/lib/utils";


export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

// Names in "dashboard.userMenu.theme.<value>".
const THEMES: { value: "light" | "dark" | "system"; icon: LucideIcon }[] = [
  { value: "light", icon: Sun },
  { value: "dark", icon: Moon },
  { value: "system", icon: Monitor },
];

function ThemeSwitch() {
  const t = useTranslations("dashboard.userMenu");
  const { theme, setTheme } = useTheme();
  return (
    <div
      role="radiogroup"
      aria-label={t("appearance")}
      className="flex gap-0.5 rounded-full bg-foreground/[0.06] p-1"
    >
      {THEMES.map((item) => {
        const active = (theme ?? "system") === item.value;
        return (
          <button
            key={item.value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={t(`theme.${item.value}`)}
            title={t(`theme.${item.value}`)}
            onClick={() => setTheme(item.value)}
            className={cn(
              "flex size-7 items-center justify-center rounded-full transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              active
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <item.icon className="size-3.5" />
          </button>
        );
      })}
    </div>
  );
}

/** Only rendered once there's more than one agency to switch to. */
function AgencySwitcherItems({ currentAgencyId }: { currentAgencyId: string }) {
  const t = useTranslations("dashboard.userMenu");
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: agencies } = useQuery({
    queryKey: ["my-agencies"],
    queryFn: () => {
      const token = getAccessToken();
      if (!token) throw new Error("No autenticado");
      return listMyAgencies(token);
    },
    staleTime: 60_000,
  });

  const mutation = useMutation({
    mutationFn: (agencyId: string) => {
      const token = getAccessToken();
      if (!token) throw new Error("No autenticado");
      return switchAgency(token, agencyId);
    },
    onSuccess: (auth) => {
      setSession(auth);
      // Every cached list/detail below belonged to the previous agency.
      queryClient.clear();
      router.push(`/${auth.user.agencySlug}/properties`);
    },
    onError: () => toast.error(t("switchFailed")),
  });

  if (!agencies || agencies.length < 2) return null;

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className="rounded-xl py-2">
        <Building2 />
        {t("switchAgency")}
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent className="w-56 rounded-2xl p-1.5">
          {agencies.map((item) => (
            <DropdownMenuItem
              key={item.id}
              className="gap-2 rounded-xl py-2"
              disabled={item.id === currentAgencyId || mutation.isPending}
              onSelect={() => mutation.mutate(item.id)}
            >
              {item.id === currentAgencyId ? <Check /> : <span className="size-4" />}
              <span className="min-w-0 flex-1 truncate">{item.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}

export function UserMenu({ collapsed }: { collapsed: boolean }) {
  const t = useTranslations("dashboard.userMenu");
  const locale = useLocale();
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useSessionUser();

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
      await navigator.clipboard.writeText(
        `${getPublicOrigin()}${localePath(siteLocaleOf(agency), `/page/${agency.slug}`)}`,
      );
      toast.success(t("portalLinkCopied"));
    } catch {
      toast.error(t("linkCopyFailed"));
    }
  }

  const name = user.name || t("nameFallback");

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
              <span className="block truncate text-xs text-muted-foreground">
                {agency?.name ?? user.email}
              </span>
            </span>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="top"
          align="start"
          className="w-72 rounded-2xl p-1.5"
        >
          <div className="flex items-center gap-3 px-2.5 pt-2 pb-3">
            <Avatar size="lg" className="size-12">
              {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt="" />}
              <AvatarFallback className="bg-secondary font-display text-lg text-secondary-foreground">
                {initials(name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="truncate font-display text-lg leading-tight">
                {name}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {user.email}
              </span>
              <RolePill
                role={user.role}
                className="mt-0.5 h-5 self-start px-2 text-[11px]"
              />
            </div>
          </div>

          {agency && (
            <div className="mx-1 mb-1.5 flex items-center gap-2.5 rounded-xl bg-foreground/[0.05] px-3 py-2">
              <span className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-card text-muted-foreground">
                {agency.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={agency.logoUrl}
                    alt=""
                    className="size-full object-contain"
                  />
                ) : (
                  <Building2 className="size-3.5" />
                )}
              </span>
              <span className="truncate text-sm font-medium">
                {agency.name}
              </span>
            </div>
          )}

          <DropdownMenuItem className="rounded-xl py-2" asChild>
            <Link href={`/${user.agencySlug}/profile`}>
              <UserRound />
              {t("profile")}
            </Link>
          </DropdownMenuItem>
          {user.role !== "AGENT" && (
            <DropdownMenuItem className="rounded-xl py-2" asChild>
              <Link href={`/${user.agencySlug}/settings`}>
                <Settings />
                {t("settings")}
              </Link>
            </DropdownMenuItem>
          )}

          <AgencySwitcherItems currentAgencyId={user.agencyId} />

          {agency && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="rounded-xl py-2" asChild>
                <a
                  href={localePath(siteLocaleOf(agency), `/page/${agency.slug}`)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <ExternalLink />
                  {t("viewPortal")}
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="rounded-xl py-2"
                onSelect={copyPortalLink}
              >
                <Copy />
                {t("copyPortalLink")}
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator />
          <div className="flex items-center justify-between gap-3 px-2.5 py-1.5 text-sm">
            <span>{t("appearance")}</span>
            <ThemeSwitch />
          </div>
          <LanguageSubmenu label={t("language")} />

          <DropdownMenuSeparator />
          <DropdownMenuItem className="group rounded-xl py-2" asChild>
            <Link href="/docs" target="_blank" rel="noreferrer">
              <BookOpen />
              {t("docs")}
              {/* Shows on hover/focus: it opens in a new tab. */}
              <ArrowUpRight className="ml-auto text-muted-foreground opacity-0 transition-[opacity,translate] duration-200 group-data-[highlighted]:translate-x-0.5 group-data-[highlighted]:-translate-y-0.5 group-data-[highlighted]:opacity-100" />
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="rounded-xl py-2"
            onSelect={() => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT))}
          >
            <Search />
            {t("search")}
            <kbd className="ml-auto text-xs text-muted-foreground">⌘ K</kbd>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="rounded-xl py-2"
            onSelect={() =>
              window.dispatchEvent(new Event(OPEN_SHORTCUTS_EVENT))
            }
          >
            <Keyboard />
            {t("shortcuts")}
            <kbd className="ml-auto text-xs text-muted-foreground">?</kbd>
          </DropdownMenuItem>
          <DropdownMenuItem className="rounded-xl py-2" asChild>
            <a href={locale === "es" ? "/help" : `/${locale}/help`} target="_blank" rel="noreferrer">
              <LifeBuoy />
              {t("help")}
            </a>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            className="rounded-xl py-2"
            onSelect={handleLogout}
          >
            <LogOut />
            {t("logout")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
