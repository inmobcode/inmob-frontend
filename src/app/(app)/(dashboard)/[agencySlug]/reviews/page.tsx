"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, MessageSquareQuote, Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { HelpLink } from "@/components/docs/help-link";
import { Segmented } from "@/components/properties/segmented";
import { ReviewDialog } from "@/components/reviews/review-dialog";
import { Stars } from "@/components/shared/stars";
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
import { useFormat } from "@/i18n/format";
import { ApiError } from "@/lib/api/client";
import { deleteReview, listReviews, updateReview, type Review, type ReviewStatus } from "@/lib/api/reviews";
import { getAccessToken, useSessionUser } from "@/lib/auth/session";
import { parseApiDate } from "@/lib/dates";
import { cn } from "@/lib/utils";

function requireToken() {
  const token = getAccessToken();
  if (!token) throw new ApiError("No autenticado", 401);
  return token;
}

type Filter = ReviewStatus | "ALL";
const FILTERS: Filter[] = ["PENDING", "PUBLISHED", "HIDDEN", "ALL"];

const STATUS_STYLES: Record<ReviewStatus, string> = {
  PENDING: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  PUBLISHED: "bg-primary/10 text-primary",
  HIDDEN: "bg-foreground/[0.07] text-muted-foreground",
};

export default function ReviewsPage() {
  const t = useTranslations("reviews");
  const common = useTranslations("common");
  const { date, ago } = useFormat();
  const user = useSessionUser();
  const isManager = !!user && user.role !== "AGENT";
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<Filter>("PENDING");
  const [editing, setEditing] = useState<Review | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<Review | null>(null);

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["reviews"],
    queryFn: () => listReviews(requireToken()),
    enabled: isManager,
  });
  const all = useMemo(() => data ?? [], [data]);
  const counts = useMemo(() => {
    const result: Record<string, number> = { ALL: all.length };
    for (const review of all) result[review.status] = (result[review.status] ?? 0) + 1;
    return result;
  }, [all]);
  const shown = filter === "ALL" ? all : all.filter((review) => review.status === filter);

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ReviewStatus }) => updateReview(requireToken(), id, { status }),
    onSuccess: (_, { status }) => toast.success(status === "PUBLISHED" ? t("published") : t("hidden")),
    onError: (err) => toast.error(err instanceof ApiError ? err.message : common("actionFailed")),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["reviews"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteReview(requireToken(), id),
    onSuccess: () => toast.success(t("deleted")),
    onError: (err) => toast.error(err instanceof ApiError ? err.message : common("actionFailed")),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["reviews"] }),
  });

  if (user && !isManager) {
    return (
      <div className="flex max-w-xl flex-col items-start gap-3 rounded-3xl bg-card p-6 ring-1 ring-foreground/5">
        <h1 className="font-display text-2xl">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("managersOnly")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="sr-only">{t("title")}</h1>

      <div className="flex flex-wrap items-center gap-3">
        <Segmented
          contained
          label={t("show")}
          value={filter}
          onChange={setFilter}
          counts={counts}
          options={FILTERS.map((value) => ({ value, label: t(`filters.${value}`) }))}
        />
        <div className="ml-auto flex items-center gap-3">
          <HelpLink section="resenas" label={t("help")} />
          <Button className="h-10 gap-2 rounded-full px-5" onClick={() => setCreating(true)}>
            <Plus />
            {t("add")}
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex flex-col items-start gap-4 rounded-2xl bg-card p-6 ring-1 ring-foreground/5">
          <p className="font-display text-xl">{t("loadFailed")}</p>
          <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
            <RotateCcw />
            {common("retry")}
          </Button>
        </div>
      )}

      {(isLoading || !user) && (
        <div className="flex animate-pulse flex-col gap-3" aria-hidden>
          {[0, 1, 2].map((index) => (
            <div key={index} className="h-32 rounded-3xl bg-muted" />
          ))}
        </div>
      )}

      {data && shown.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-3xl bg-card px-6 py-14 text-center ring-1 ring-foreground/5">
          <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
            <MessageSquareQuote className="size-6" />
          </span>
          <p className="font-display text-2xl">{t(`empty.${filter}`)}</p>
          <p className="max-w-md text-sm text-muted-foreground">{t("emptyBody")}</p>
        </div>
      )}

      {shown.length > 0 && (
        <ul className="flex flex-col gap-4">
          {shown.map((review) => (
            <li
              key={review.id}
              className="flex flex-col gap-3 rounded-3xl bg-card p-5 shadow-[0_1px_2px_oklch(0.3_0.05_160/0.04),0_12px_32px_-12px_oklch(0.3_0.05_160/0.14)] ring-1 ring-foreground/5 sm:p-6"
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <Stars rating={review.rating} label={t("outOf", { rating: review.rating })} className="text-base text-amber-500" />
                <span className="font-medium">{review.authorName}</span>
                <span className={cn("inline-flex h-6 items-center rounded-full px-2.5 text-xs font-medium", STATUS_STYLES[review.status])}>
                  {t(`status.${review.status}`)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {t(`source.${review.source}`)} · {ago(parseApiDate(review.createdAt))}
                </span>
              </div>
              {review.text ? (
                <p className="max-w-prose text-pretty">{review.text}</p>
              ) : (
                <p className="text-sm text-muted-foreground">{t("noText")}</p>
              )}
              <p className="text-sm text-muted-foreground">
                {review.propertyTitle ?? t("noProperty")}
                {review.stayedOn && (
                  <span className="first-letter:uppercase">
                    {" · "}
                    {t("stayed", { date: date(new Date(`${review.stayedOn}T12:00:00`), "monthYear") })}
                  </span>
                )}
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {review.status !== "PUBLISHED" ? (
                  <Button
                    size="sm"
                    className="gap-1.5 rounded-full px-4"
                    disabled={statusMutation.isPending}
                    onClick={() => statusMutation.mutate({ id: review.id, status: "PUBLISHED" })}
                  >
                    <Eye />
                    {t("publish")}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 rounded-full px-4"
                    disabled={statusMutation.isPending}
                    onClick={() => statusMutation.mutate({ id: review.id, status: "HIDDEN" })}
                  >
                    <EyeOff />
                    {t("hide")}
                  </Button>
                )}
                {review.status === "PENDING" && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="gap-1.5 rounded-full px-4"
                    disabled={statusMutation.isPending}
                    onClick={() => statusMutation.mutate({ id: review.id, status: "HIDDEN" })}
                  >
                    <EyeOff />
                    {t("dontPublish")}
                  </Button>
                )}
                {/* A guest's words are theirs: only the agency's own reviews can be edited. */}
                {review.source === "MANUAL" && (
                  <Button size="sm" variant="ghost" className="gap-1.5 rounded-full px-4" onClick={() => setEditing(review)}>
                    <Pencil />
                    {t("edit")}
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="ml-auto gap-1.5 rounded-full px-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => setDeleting(review)}
                >
                  <Trash2 />
                  {t("delete")}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ReviewDialog open={creating} onOpenChange={setCreating} />
      {editing && (
        <ReviewDialog key={editing.id} open onOpenChange={(open) => !open && setEditing(null)} review={editing} />
      )}
      <AlertDialog open={deleting != null} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-2xl">{t("deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("deleteBody", { name: deleting?.authorName ?? "" })}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{common("back")}</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (deleting) deleteMutation.mutate(deleting.id);
                setDeleting(null);
              }}
            >
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
