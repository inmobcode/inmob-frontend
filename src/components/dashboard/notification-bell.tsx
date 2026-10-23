"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  CalendarCheck,
  CheckCheck,
  CreditCard,
  Eye,
  Inbox,
  ListChecks,
  X,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  deleteNotification,
  listNotifications,
  markAllNotificationsRead,
  markNotification,
  type AppNotification,
  type NotificationFeed,
  type NotificationType,
} from "@/lib/api/notifications";
import { useFormat } from "@/i18n/format";
import { getAccessToken, useSessionUser } from "@/lib/auth/session";
import { parseApiDate } from "@/lib/dates";
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

/** Title and body in the viewer's language, from the values the backend stored. */
function useNotificationText() {
  const t = useTranslations("dashboard.notifications.types");
  const { date } = useFormat();
  return (item: AppNotification): { title: string; body: string | null } => {
    const p = item.params;
    if (!p) return { title: item.title, body: item.body };
    switch (item.type) {
      case "INQUIRY":
        return { title: t("inquiry", { name: p.name ?? "" }), body: p.message || t("inquiryNoMessage") };
      case "OFFER_VIEWED":
        return {
          title: p.who ? t("offerViewed", { who: p.who }) : t("offerViewedAnon"),
          body: p.offer ?? null,
        };
      case "PAYMENT":
        return { title: t("payment", { amount: p.amount ?? "" }), body: p.property ?? null };
      case "TASK":
        return {
          title: t("task"),
          body: p.due
            ? t("taskDue", { title: p.title ?? "", date: date(new Date(`${p.due}T12:00:00`), "dayMonthShort") })
            : (p.title ?? null),
        };
      default:
        return { title: item.title, body: item.body };
    }
  };
}

/**
 * The bell: what happened that the viewer should know about (a new inquiry, an
 * opened offer, a payment, a task handed to them). Refreshed every minute.
 */
export function NotificationBell({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const t = useTranslations("dashboard.notifications");
  const { ago } = useFormat();
  const textOf = useNotificationText();
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

  const remove = useMutation({
    meta: { affectsSite: false },
    mutationFn: (id: string) => deleteNotification(getAccessToken() ?? "", id),
    // Optimistic: it leaves the list at once; the snapshot comes back if the API says no.
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: FEED_KEY });
      const previous = queryClient.getQueryData<NotificationFeed>(FEED_KEY);
      queryClient.setQueryData<NotificationFeed>(FEED_KEY, (current) => {
        if (!current) return current;
        const gone = current.items.find((item) => item.id === id);
        return {
          unread: current.unread - (gone && !gone.readAt ? 1 : 0),
          items: current.items.filter((item) => item.id !== id),
        };
      });
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) queryClient.setQueryData(FEED_KEY, context.previous);
      toast.error(t("deleteFailed"));
    },
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

  const label = unread > 0 ? t("labelUnread", { count: unread }) : t("label");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={label}
          title={t("label")}
          className="relative flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors outline-none hover:bg-foreground/5 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 data-[state=open]:bg-foreground/5 data-[state=open]:text-foreground"
        >
          <Bell className="size-[1.125rem]" />
          {unread > 0 && (
            <span
              aria-hidden
              className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] leading-none font-semibold text-primary-foreground tabular-nums ring-2 ring-sidebar"
            >
              {unread > 9 ? "9+" : unread}
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
          <p className="font-display text-lg leading-none">{t("label")}</p>
          <button
            type="button"
            onClick={() => markAll.mutate()}
            disabled={unread === 0 || markAll.isPending}
            className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-40"
          >
            <CheckCheck className="size-3.5" />
            {t("markAll")}
          </button>
        </div>
        <div className="max-h-[26rem] overflow-y-auto border-t border-foreground/8">
          {items.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-muted-foreground">{t("empty")}</p>
          ) : (
            <ul>
              {items.map((item) => {
                const Icon = ICONS[item.type] ?? Bell;
                const isNew = !item.readAt;
                const text = textOf(item);
                return (
                  <li
                    key={item.id}
                    className="group relative border-b border-foreground/8 last:border-b-0"
                  >
                    <button
                      type="button"
                      onClick={() => openItem(item)}
                      className="flex w-full items-start gap-3 py-3 pr-12 pl-4 text-left outline-none transition-colors hover:bg-foreground/[0.04] focus-visible:bg-foreground/[0.06]"
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
                          {text.title}
                        </span>
                        {text.body && (
                          <span className="line-clamp-2 text-xs text-muted-foreground">
                            {text.body}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {ago(parseApiDate(item.createdAt))}
                        </span>
                      </span>
                      {isNew && (
                        <span
                          aria-label={t("unread")}
                          className="mt-2 size-2 shrink-0 rounded-full bg-primary"
                        />
                      )}
                    </button>
                    {/* A sibling, not inside the row's button: a button can't hold another. */}
                    <button
                      type="button"
                      onClick={() => remove.mutate(item.id)}
                      aria-label={t("delete", { title: text.title })}
                      title={t("deleteShort")}
                      className="absolute top-2.5 right-2.5 flex size-7 items-center justify-center rounded-full text-muted-foreground opacity-0 transition-opacity outline-none group-focus-within:opacity-100 group-hover:opacity-100 hover:bg-foreground/[0.06] hover:text-destructive focus-visible:ring-3 focus-visible:ring-ring/50 [@media(hover:none)]:opacity-100"
                    >
                      <X className="size-3.5" />
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
