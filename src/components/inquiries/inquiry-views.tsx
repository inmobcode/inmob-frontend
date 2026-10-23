"use client";

import { differenceInCalendarDays, isToday, isYesterday } from "date-fns";
import { Building2, ChevronLeft, Copy, Globe, Mail, MailOpen, MessageCircle, Phone, Tag, UserRound } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import type { ClientStage } from "@/lib/api/clients";
import type { Inquiry } from "@/lib/api/inquiries";

import { useFormat } from "@/i18n/format";
import { parseApiDate } from "@/lib/dates";
import { useLabels } from "@/lib/labels";
import { whatsappLink } from "@/lib/site-theme";
import { cn } from "@/lib/utils";
import { IMAGE_WIDTH, sizedImage } from "@/lib/image-url";


function initials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "?"
  );
}

/** What it was about, as a short line: the listing, the offer, or a general question. */
function about(inquiry: Inquiry, general: string) {
  return inquiry.property?.title ?? inquiry.offer?.title ?? general;
}

/** "12 min", "14:35", "Ayer", "lun", "3 oct": short enough for the list. */
function useShortTime() {
  const t = useTranslations("inquiries.time");
  const { date: formatDate } = useFormat();
  return (iso: string) => {
    const date = parseApiDate(iso);
    const minutes = Math.round((Date.now() - date.getTime()) / 60_000);
    if (minutes < 1) return t("now");
    if (minutes < 60) return t("minutes", { count: minutes });
    if (isToday(date)) return formatDate(date, "time");
    if (isYesterday(date)) return t("yesterday");
    if (differenceInCalendarDays(new Date(), date) < 7) return formatDate(date, "weekdayShort");
    return formatDate(date, "dayMonthShort");
  };
}

/** The list's groups, as keys of "inquiries.groups". */
export function groupOf(iso: string) {
  const date = parseApiDate(iso);
  if (isToday(date)) return "today" as const;
  if (isYesterday(date)) return "yesterday" as const;
  if (differenceInCalendarDays(new Date(), date) < 7) return "week" as const;
  return "older" as const;
}

const SECONDARY =
  "inline-flex h-10 items-center gap-2 rounded-full bg-foreground/[0.06] px-4 text-sm font-medium outline-none transition-colors hover:bg-foreground/10 focus-visible:ring-3 focus-visible:ring-ring/50";

export function InquiryRow({
  inquiry,
  selected,
  onSelect,
}: {
  inquiry: Inquiry;
  selected: boolean;
  onSelect: () => void;
}) {
  const t = useTranslations("inquiries");
  const shortTime = useShortTime();
  const unread = !inquiry.readAt;
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        aria-current={selected ? "true" : undefined}
        className={cn(
          "flex w-full gap-3 px-4 py-3.5 text-left outline-none transition-colors focus-visible:bg-foreground/[0.05]",
          selected ? "bg-primary/[0.07]" : "hover:bg-foreground/[0.03]",
        )}
      >
        <span className="relative mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
          {initials(inquiry.name)}
          {unread && (
            <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-primary ring-2 ring-card">
              <span className="sr-only">{t("new")}</span>
            </span>
          )}
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="flex items-baseline justify-between gap-3">
            <span
              className={cn(
                "truncate text-sm",
                unread ? "font-semibold" : "font-medium",
              )}
            >
              {inquiry.name}
            </span>
            <span
              className={cn(
                "shrink-0 text-xs tabular-nums",
                unread
                  ? "font-medium text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {shortTime(inquiry.createdAt)}
            </span>
          </span>
          <span
            className={cn(
              "truncate text-sm",
              unread ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {about(inquiry, t("general"))}
          </span>
          {inquiry.message && (
            <span className="truncate text-xs text-muted-foreground">
              {inquiry.message}
            </span>
          )}
        </span>
      </button>
    </li>
  );
}

export function InquiryDetail({
  inquiry,
  onBack,
  onMark,
}: {
  inquiry: Inquiry;
  onBack: () => void;
  onMark: (read: boolean) => void;
}) {
  const t = useTranslations("inquiries");
  const common = useTranslations("common");
  const labels = useLabels();
  const { date, ago } = useFormat();
  const { agencySlug } = useParams<{ agencySlug: string }>();
  const created = parseApiDate(inquiry.createdAt);
  const stage = inquiry.client?.stage as ClientStage | undefined;
  const subject = about(inquiry, t("general"));
  const replySubject = encodeURIComponent(`Re: ${subject}`);
  const firstName = inquiry.name.split(" ")[0];
  const replyBody = encodeURIComponent(`${t("replyGreeting", { name: firstName })}\n\n`);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(inquiry.email);
      toast.success(common("emailCopied"));
    } catch {
      toast.error(common("emailCopyFailed"));
    }
  }

  return (
    <article className="flex min-h-full flex-col">
      <header className="flex items-start gap-4 border-b border-border p-5 sm:p-6">
        <button
          type="button"
          onClick={onBack}
          aria-label={t("backToList")}
          className="-ml-2 flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground outline-none hover:bg-foreground/[0.06] focus-visible:ring-3 focus-visible:ring-ring/50 lg:hidden"
        >
          <ChevronLeft className="size-5" />
        </button>
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
          {initials(inquiry.name)}
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-2xl leading-tight">
              {inquiry.name}
            </h2>
            {stage && (
              <span className="rounded-full bg-foreground/[0.06] px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                {labels.clientStage(stage)}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            <time dateTime={inquiry.createdAt}>{date(created, "dayMonthTime")}</time> · {ago(created)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onMark(!inquiry.readAt)}
          title={inquiry.readAt ? t("markNew") : t("markRead")}
          aria-label={inquiry.readAt ? t("markNew") : t("markRead")}
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground outline-none hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {inquiry.readAt ? (
            <Mail className="size-4" />
          ) : (
            <MailOpen className="size-4" />
          )}
        </button>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-5 sm:p-6">
        {inquiry.property ? (
          <Link
            href={`/${agencySlug}/properties/${inquiry.property.id}`}
            className="group flex items-center gap-4 rounded-2xl p-2 pr-4 ring-1 ring-foreground/10 outline-none transition-colors hover:bg-foreground/[0.03] focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <span className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-secondary text-primary/40">
              {inquiry.property.coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={sizedImage(inquiry.property.coverUrl, IMAGE_WIDTH.thumb)}
                  alt=""
                  className="size-full object-cover"
                />
              ) : (
                <Building2 className="size-6" strokeWidth={1.5} />
              )}
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="text-xs text-muted-foreground">{t("askedAbout")}</span>
              <span className="truncate font-medium group-hover:underline">
                {inquiry.property.title}
              </span>
            </span>
          </Link>
        ) : inquiry.offer ? (
          <Link
            href={`/${agencySlug}/offers/${inquiry.offer.id}`}
            className="group flex items-center gap-4 rounded-2xl p-2 pr-4 ring-1 ring-foreground/10 outline-none transition-colors hover:bg-foreground/[0.03] focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <span className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary/60">
              <Tag className="size-6" strokeWidth={1.5} />
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="text-xs text-muted-foreground">{t("repliedOffer")}</span>
              <span className="truncate font-medium group-hover:underline">
                {inquiry.offer.title}
              </span>
            </span>
          </Link>
        ) : (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Globe className="size-4" />
            {t("generalFromPortal")}
          </p>
        )}

        {inquiry.message ? (
          <blockquote className="max-w-prose rounded-2xl bg-foreground/[0.04] px-5 py-4 text-base leading-relaxed text-pretty whitespace-pre-line">
            {inquiry.message}
          </blockquote>
        ) : (
          <p className="text-sm text-muted-foreground">{t("noMessage")}</p>
        )}

        <dl className="grid max-w-prose gap-x-6 gap-y-3 text-sm sm:grid-cols-[6rem_1fr]">
          <dt className="text-muted-foreground">{t("email")}</dt>
          <dd className="flex min-w-0 items-center gap-2">
            <a
              href={`mailto:${inquiry.email}`}
              className="truncate underline-offset-4 hover:underline"
            >
              {inquiry.email}
            </a>
            <button
              type="button"
              onClick={copyEmail}
              aria-label={t("copyEmail")}
              className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <Copy className="size-3.5" />
            </button>
          </dd>
          {inquiry.phone && (
            <>
              <dt className="text-muted-foreground">{t("phone")}</dt>
              <dd className="tabular-nums">{inquiry.phone}</dd>
            </>
          )}
        </dl>

        <div className="mt-auto flex flex-wrap gap-2 border-t border-border pt-5">
          <Button asChild className="h-10 gap-2 rounded-full px-5">
            <a
              href={`mailto:${inquiry.email}?subject=${replySubject}&body=${replyBody}`}
            >
              <Mail />
              {t("replyEmail")}
            </a>
          </Button>
          {inquiry.phone && (
            <>
              <a
                href={whatsappLink(
                  inquiry.phone,
                  t("whatsappMessage", { name: firstName, subject }),
                )}
                target="_blank"
                rel="noreferrer"
                className={SECONDARY}
              >
                <MessageCircle className="size-4" />
                WhatsApp
              </a>
              <a
                href={`tel:${inquiry.phone.replace(/[^\d+]/g, "")}`}
                className={SECONDARY}
              >
                <Phone className="size-4" />
                {t("call")}
              </a>
            </>
          )}
          {inquiry.client && (
            <Link
              href={`/${agencySlug}/clients/${inquiry.client.id}`}
              className={cn(SECONDARY, "sm:ml-auto")}
            >
              <UserRound className="size-4" />
              {t("seeClient")}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

/**
 * Every question that arrived from the portal, a listing or an offer, laid out
 * like a mail inbox: the list on the left grouped by day, the open one on the
 * right. On phones the two take turns. Opening one marks it read.
 */
