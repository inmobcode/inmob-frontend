"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import {
  Bell,
  CalendarCheck,
  CheckCheck,
  CreditCard,
  Eye,
  Inbox,
  ListChecks,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  listNotifications,
  markAllNotificationsRead,
  markNotification,
  type AppNotification,
  type NotificationType,
} from "@/lib/api/notifications";
import { getAccessToken, useSessionUser } from "@/lib/auth/session";
import { cn } from "@/lib/utils";

const ICONS: Record<NotificationType, LucideIcon> = {
  INQUIRY: Inbox,
  OFFER_VIEWED: Eye,
  OFFER_REPLY: Inbox,
  PAYMENT: CreditCard,
  TASK: ListChecks,
  BOOKING: CalendarCheck,
};

const FEED_KEY = ["notifications"];

/**
 * The bell: what happened that the viewer should know about (a new inquiry, an
 * opened offer, a payment, a task handed to them). Refreshed every minute.
 */
export function NotificationBell({
  collapsed = false,
  onNavigate,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useSessionUser();
  const [open, setOpen] = useState(false);

  const { data } = useQuery({
    queryKey: FEED_KEY,
    queryFn: () => {
      const token = getAccessToken();
      return token ? listNotifications(token) : { unread: 0, items: [] };
    },
    refetchInterval: 60_000,
  });

  const markOne = useMutation({
    meta: { affectsSite: false },
    mutationFn: (id: string) =>
      markNotification(getAccessToken() ?? "", id, true),
    onSettled: () => queryClient.invalidateQueries({ queryKey: FEED_KEY }),
  });
  const markAll = useMutation({
    meta: { affectsSite: false },
    mutationFn: () => markAllNotificationsRead(getAccessToken() ?? ""),
    onSettled: () => queryClient.invalidateQueries({ queryKey: FEED_KEY }),
  });

  const unread = data?.unread ?? 0;
  const items = data?.items ?? [];

  function openItem(item: AppNotification) {
    if (!item.readAt) markOne.mutate(item.id);
    setOpen(false);
    onNavigate?.();
    if (item.link && user) router.push(`/${user.agencySlug}${item.link}`);
  }

  const label =
    unread > 0 ? `Notificaciones, ${unread} sin leer` : "Notificaciones";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={label}
          title={collapsed ? "Notificaciones" : undefined}
          className="relative z-10 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors outline-none hover:bg-foreground/5 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <span className="relative flex shrink-0">
            <Bell className="size-4" />
            {unread > 0 && collapsed && (
              <span
                aria-hidden
                className="absolute -top-1 -right-1 size-2 rounded-full bg-primary ring-2 ring-sidebar"
              />
            )}
          </span>
          <span
            className={cn(
              "transition-opacity duration-200",
              collapsed && "opacity-0",
            )}
          >
            Notificaciones
          </span>
          {unread > 0 && !collapsed && (
            <span
              aria-hidden
              className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground tabular-nums"
            >
              {unread > 99 ? "99+" : unread}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        side="right"
        align="end"
        sideOffset={12}
        className="w-[22rem] max-w-[92vw] gap-0 p-0"
      >
        <div className="flex items-center justify-between px-4 py-3">
          <p className="font-display text-lg leading-none">Notificaciones</p>
          <button
            type="button"
            onClick={() => markAll.mutate()}
            disabled={unread === 0 || markAll.isPending}
            className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-40"
          >
            <CheckCheck className="size-3.5" />
            Marcar todas
          </button>
        </div>
        <div className="max-h-[26rem] overflow-y-auto border-t border-foreground/8">
          {items.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-muted-foreground">
              Todavía no hay novedades. Acá van a aparecer las consultas,
              ofertas abiertas y pagos.
            </p>
          ) : (
            <ul>
              {items.map((item) => {
                const Icon = ICONS[item.type] ?? Bell;
                const isNew = !item.readAt;
                return (
                  <li
                    key={item.id}
                    className="border-b border-foreground/8 last:border-b-0"
                  >
                    <button
                      type="button"
                      onClick={() => openItem(item)}
                      className="flex w-full items-start gap-3 px-4 py-3 text-left outline-none transition-colors hover:bg-foreground/[0.04] focus-visible:bg-foreground/[0.06]"
                    >
                      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                        <Icon className="size-4" />
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span
                          className={cn(
                            "text-sm text-pretty",
                            isNew ? "font-semibold" : "text-foreground/80",
                          )}
                        >
                          {item.title}
                        </span>
                        {item.body && (
                          <span className="line-clamp-2 text-xs text-muted-foreground">
                            {item.body}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(item.createdAt), {
                            addSuffix: true,
                            locale: es,
                          })}
                        </span>
                      </span>
                      {isNew && (
                        <span
                          aria-label="Sin leer"
                          className="mt-2 size-2 shrink-0 rounded-full bg-primary"
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
