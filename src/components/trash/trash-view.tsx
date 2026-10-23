"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { differenceInCalendarDays } from "date-fns";
import { Building2, RotateCcw, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import { BackLink } from "@/components/shared/back-link";
import { useFormat } from "@/i18n/format";
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
import { ApiError } from "@/lib/api/client";
import { getAccessToken } from "@/lib/auth/session";
import { parseApiDate } from "@/lib/dates";
import { IMAGE_WIDTH, sizedImage } from "@/lib/image-url";

/** Days something stays in the trash; the backend deletes it for good after that (app/utils/trash.py). */
export const TRASH_DAYS = 30;

/** What a trash row shows about one item. */
export interface TrashItem {
  id: string;
  title: string;
  subtitle?: string | null;
  imageUrl?: string | null;
  deletedAt: string;
}

function requireToken() {
  const token = getAccessToken();
  if (!token) throw new ApiError("No autenticado", 401);
  return token;
}

/**
 * A section's trash: what was deleted in the last TRASH_DAYS days, to restore
 * or delete for good. `listKey` is the section's own list, refreshed on restore.
 */
export function TrashView<T>({
  title,
  restoredText,
  backHref,
  backLabel,
  queryKey,
  listKey,
  list,
  restore,
  deleteForever,
  toItem,
}: {
  title: string;
  /** The toast after restoring one: "Restauraste la oferta". */
  restoredText: string;
  backHref: string;
  backLabel: string;
  queryKey: readonly unknown[];
  listKey: readonly unknown[];
  list: (token: string) => Promise<T[]>;
  restore: (token: string, id: string) => Promise<unknown>;
  deleteForever: (token: string, id: string) => Promise<unknown>;
  toItem: (item: T) => TrashItem;
}) {
  const t = useTranslations("trash");
  const common = useTranslations("common");
  const { ago } = useFormat();
  const queryClient = useQueryClient();
  const [confirming, setConfirming] = useState<TrashItem | null>(null);

  const { data, isLoading, error } = useQuery({ queryKey, queryFn: () => list(requireToken()) });
  const items = (data ?? []).map(toItem);

  function refresh() {
    queryClient.invalidateQueries({ queryKey });
    queryClient.invalidateQueries({ queryKey: listKey });
  }

  const restoreMutation = useMutation({
    mutationFn: (id: string) => restore(requireToken(), id),
    onSuccess: () => toast.success(restoredText),
    onError: (err) => toast.error(err instanceof ApiError ? err.message : t("restoreFailed")),
    onSettled: refresh,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteForever(requireToken(), id),
    onSuccess: () => toast.success(t("deleted")),
    onError: (err) => toast.error(err instanceof ApiError ? err.message : t("deleteFailed")),
    onSettled: refresh,
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <BackLink href={backHref}>{backLabel}</BackLink>
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-3xl leading-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">
            {t("intro", { days: TRASH_DAYS })}
          </p>
        </div>
      </div>

      {error && (
        <p className="rounded-2xl bg-card p-6 text-sm ring-1 ring-foreground/5">
          {error instanceof ApiError ? error.message : t("loadFailed")}
        </p>
      )}

      {isLoading && (
        <div className="flex animate-pulse flex-col gap-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="h-20 rounded-2xl bg-muted" />
          ))}
        </div>
      )}

      {data && items.length === 0 && (
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-card px-6 py-16 text-center ring-1 ring-foreground/5">
          <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
            <Trash2 className="size-6" />
          </span>
          <div className="flex max-w-sm flex-col gap-1">
            <p className="font-display text-2xl">{t("emptyTitle")}</p>
            <p className="text-sm text-muted-foreground">{t("emptyBody")}</p>
          </div>
        </div>
      )}

      {items.length > 0 && (
        <ul className="flex flex-col divide-y divide-foreground/[0.06] rounded-3xl bg-card ring-1 ring-foreground/5">
          {items.map((item) => {
            const deletedAt = parseApiDate(item.deletedAt);
            const daysLeft = Math.max(TRASH_DAYS - differenceInCalendarDays(new Date(), deletedAt), 0);
            return (
              <li key={item.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
                <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-secondary text-primary/50">
                  {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={sizedImage(item.imageUrl, IMAGE_WIDTH.thumb)} alt="" className="size-full object-cover" />
                  ) : (
                    <Building2 className="size-5" strokeWidth={1.5} />
                  )}
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <p className="truncate font-medium">{item.title}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    {item.subtitle && <>{item.subtitle} · </>}
                    {t("deletedAgo", { ago: ago(deletedAt) })} ·{" "}
                    {daysLeft === 0 ? t("goesToday") : t("goesIn", { count: daysLeft })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="h-9 gap-1.5 rounded-full px-4"
                    disabled={restoreMutation.isPending}
                    onClick={() => restoreMutation.mutate(item.id)}
                  >
                    <RotateCcw />
                    {t("restore")}
                  </Button>
                  <Button
                    variant="ghost"
                    className="h-9 gap-1.5 rounded-full px-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    disabled={deleteMutation.isPending}
                    onClick={() => setConfirming(item)}
                  >
                    <Trash2 />
                    {t("deleteForever")}
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <AlertDialog open={confirming != null} onOpenChange={(open) => !open && setConfirming(null)}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-2xl">{t("confirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("confirmBody", { title: confirming?.title ?? "" })}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{common("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (confirming) deleteMutation.mutate(confirming.id);
                setConfirming(null);
              }}
            >
              {t("deleteForever")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
