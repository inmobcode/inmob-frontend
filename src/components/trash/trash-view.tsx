"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { differenceInCalendarDays, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowLeft, Building2, RotateCcw, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

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

// The backend stores naive UTC; without a zone the browser would read it as local time.
const parseUtc = (iso: string) => new Date(/[zZ]|[+-]\d\d:\d\d$/.test(iso) ? iso : `${iso}Z`);

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
  noun,
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
  /** Singular, with its article: "la oferta", "la propiedad". */
  noun: string;
  backHref: string;
  backLabel: string;
  queryKey: readonly unknown[];
  listKey: readonly unknown[];
  list: (token: string) => Promise<T[]>;
  restore: (token: string, id: string) => Promise<unknown>;
  deleteForever: (token: string, id: string) => Promise<unknown>;
  toItem: (item: T) => TrashItem;
}) {
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
    onSuccess: () => toast.success(`Restauraste ${noun}`),
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "No se pudo restaurar"),
    onSettled: refresh,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteForever(requireToken(), id),
    onSuccess: () => toast.success("Borrado definitivamente"),
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "No se pudo borrar"),
    onSettled: refresh,
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <Link
          href={backHref}
          className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <ArrowLeft className="size-4" />
          {backLabel}
        </Link>
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-3xl leading-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">
            Lo que borrás queda acá {TRASH_DAYS} días, por si te arrepentís. Después se borra definitivamente.
          </p>
        </div>
      </div>

      {error && (
        <p className="rounded-2xl bg-card p-6 text-sm ring-1 ring-foreground/5">
          {error instanceof ApiError ? error.message : "No pudimos cargar la papelera."}
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
            <p className="font-display text-2xl">La papelera está vacía</p>
            <p className="text-sm text-muted-foreground">Cuando borres algo, va a aparecer acá.</p>
          </div>
        </div>
      )}

      {items.length > 0 && (
        <ul className="flex flex-col divide-y divide-foreground/[0.06] rounded-3xl bg-card ring-1 ring-foreground/5">
          {items.map((item) => {
            const deletedAt = parseUtc(item.deletedAt);
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
                    Borrada {formatDistanceToNow(deletedAt, { addSuffix: true, locale: es })} ·{" "}
                    {daysLeft === 0
                      ? "se borra hoy"
                      : `se borra definitivamente en ${daysLeft} ${daysLeft === 1 ? "día" : "días"}`}
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
                    Restaurar
                  </Button>
                  <Button
                    variant="ghost"
                    className="h-9 gap-1.5 rounded-full px-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    disabled={deleteMutation.isPending}
                    onClick={() => setConfirming(item)}
                  >
                    <Trash2 />
                    Borrar definitivamente
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
            <AlertDialogTitle className="font-display text-2xl">¿Borrar definitivamente?</AlertDialogTitle>
            <AlertDialogDescription>
              «{confirming?.title}» se borra para siempre y no se puede recuperar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (confirming) deleteMutation.mutate(confirming.id);
                setConfirming(null);
              }}
            >
              Borrar definitivamente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
