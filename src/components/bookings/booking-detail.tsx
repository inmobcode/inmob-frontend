"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Check,
  CircleCheck,
  Copy,
  ExternalLink,
  FileText,
  MoreHorizontal,
  Pencil,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { BackLink } from "@/components/shared/back-link";
import { AddPaymentDialog, PaymentDialog } from "@/components/bookings/add-payment-dialog";
import {
  BookingStatusPill,
  DateTile,
  PaidBar,
  clientLinkPath,
  datesOf,
  paymentsOf,
  useCopyClientLink,
  useMoney,
} from "@/components/bookings/booking-parts";
import { FormSection } from "@/components/properties/form-section";
import { HistoryButton } from "@/components/shared/history-button";
import { Stepper } from "@/components/properties/form-controls";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import {
  cancelBooking,
  completeBooking,
  confirmBooking,
  deletePayment,
  getBooking,
  markPaymentPaid,
  updateBooking,
  updatePayment,
  type Booking,
  type Payment,
} from "@/lib/api/bookings";
import { useFormat } from "@/i18n/format";
import { ApiError } from "@/lib/api/client";
import { getAccessToken } from "@/lib/auth/session";
import { parseApiDate } from "@/lib/dates";
import { useLabels } from "@/lib/labels";
import { cn } from "@/lib/utils";

function requireToken() {
  const token = getAccessToken();
  if (!token) throw new ApiError("No autenticado", 401);
  return token;
}

function Skeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-8">
      <div className="h-5 w-24 rounded-full bg-muted" />
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="flex flex-col gap-6">
          <div className="h-20 rounded-3xl bg-muted" />
          <div className="h-64 rounded-3xl bg-muted" />
        </div>
        <div className="h-72 rounded-3xl bg-muted" />
      </div>
    </div>
  );
}

function Stat({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("tabular-nums", strong && "font-semibold")}>{value}</span>
    </div>
  );
}

/** Guests and the team's notes; saved together when something changed. */
function BookingDetails({ booking }: { booking: Booking }) {
  const t = useTranslations("bookings.detail");
  const common = useTranslations("common");
  const queryClient = useQueryClient();
  const saved = { guests: booking.guests == null ? "" : String(booking.guests), notes: booking.notes ?? "" };
  const [draft, setDraft] = useState<typeof saved | null>(null);
  const value = draft ?? saved;
  const dirty = draft !== null && (draft.guests !== saved.guests || draft.notes !== saved.notes);
  const closed = booking.status === "CANCELLED" || booking.status === "COMPLETED";

  const mutation = useMutation({
    meta: { affectsSite: false },
    mutationFn: () => {
      const guests = Number(value.guests);
      return updateBooking(requireToken(), booking.id, {
        // A closed booking only takes notes (the API says so too).
        ...(closed ? {} : { guests: value.guests.trim() && guests >= 1 ? Math.round(guests) : null }),
        notes: value.notes.trim() || null,
      });
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<Booking>(["booking", booking.id], (prev) => (prev ? { ...prev, ...updated } : prev));
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      setDraft(null);
      toast.success(common("changesSaved"));
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : common("saveFailed")),
  });

  return (
    <div className="flex max-w-xl flex-col gap-5">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">{t("guests")}</span>
        {closed ? (
          <p className="text-sm text-muted-foreground">
            {booking.guests ? t("guestsCount", { count: booking.guests }) : "—"}
          </p>
        ) : (
          <div className="max-w-44">
            <Stepper
              label={t("guests")}
              min={1}
              value={value.guests}
              onChange={(guests) => setDraft({ ...value, guests })}
            />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="booking-notes" className="text-sm font-medium">
          {t("notes")}
        </label>
        <Textarea
          id="booking-notes"
          rows={3}
          maxLength={5000}
          placeholder={t("notesPlaceholder")}
          value={value.notes}
          onChange={(event) => setDraft({ ...value, notes: event.target.value })}
        />
      </div>
      {dirty && (
        <div className="flex items-center gap-2">
          <Button size="sm" className="rounded-full px-4" disabled={mutation.isPending} onClick={() => mutation.mutate()}>
            {common("save")}
          </Button>
          <Button size="sm" variant="ghost" className="rounded-full px-4" disabled={mutation.isPending} onClick={() => setDraft(null)}>
            {common("cancel")}
          </Button>
        </div>
      )}
    </div>
  );
}

/** One payment, with its menu: edit, mark paid or back to pending, delete. */
function PaymentRow({ booking, payment }: { booking: Booking; payment: Payment }) {
  const t = useTranslations("bookings.detail");
  const common = useTranslations("common");
  const labels = useLabels();
  const money = useMoney();
  const { date } = useFormat();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["booking", booking.id] });
    queryClient.invalidateQueries({ queryKey: ["bookings"] });
  }

  const statusMutation = useMutation({
    meta: { affectsSite: false },
    mutationFn: (paid: boolean) =>
      paid
        ? markPaymentPaid(requireToken(), booking.id, payment.id)
        : updatePayment(requireToken(), booking.id, payment.id, { status: "PENDING" }),
    onSuccess: (_, paid) => {
      toast.success(paid ? t("paymentMarked") : t("paymentPending"));
      invalidate();
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : t("paymentMarkFailed")),
  });

  const deleteMutation = useMutation({
    meta: { affectsSite: false },
    mutationFn: () => deletePayment(requireToken(), booking.id, payment.id),
    onSuccess: () => {
      toast.success(t("paymentDeleted"));
      invalidate();
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : t("paymentDeleteFailed")),
  });

  const paid = payment.status === "PAID";

  return (
    <li className="flex items-center gap-4 rounded-2xl bg-card p-4 ring-1 ring-foreground/5">
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="font-medium tabular-nums">{money(payment.currency, payment.amount)}</span>
        <span className="text-xs text-muted-foreground">
          {labels.paymentType(payment.type)}
          {paid && payment.paidAt && ` · ${date(parseApiDate(payment.paidAt), "dayMonthShort")}`}
          {payment.method && ` · ${payment.method}`}
        </span>
        {payment.note && <span className="truncate text-xs text-muted-foreground/80">{payment.note}</span>}
      </div>
      {paid ? (
        <span className="inline-flex h-6 items-center gap-1 rounded-full bg-primary/10 px-2.5 text-xs font-medium text-primary">
          <Check className="size-3" />
          {t("paid")}
        </span>
      ) : (
        <Button
          size="sm"
          variant="outline"
          className="rounded-full px-4"
          disabled={statusMutation.isPending}
          onClick={() => statusMutation.mutate(true)}
        >
          {t("markPaid")}
        </Button>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label={t("paymentActions")}
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground/[0.06] outline-none transition-colors hover:bg-foreground/10 focus-visible:ring-3 focus-visible:ring-ring/50 data-[state=open]:bg-foreground/10"
          >
            <MoreHorizontal className="size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52 rounded-2xl p-1.5">
          <DropdownMenuItem className="rounded-xl py-2" onSelect={() => setEditing(true)}>
            <Pencil />
            {t("editPayment")}
          </DropdownMenuItem>
          {paid && (
            <DropdownMenuItem className="rounded-xl py-2" onSelect={() => statusMutation.mutate(false)}>
              <RotateCcw />
              {t("markPending")}
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" className="rounded-xl py-2" onSelect={() => setDeleting(true)}>
            <Trash2 />
            {t("deletePayment")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <PaymentDialog
        bookingId={booking.id}
        currency={booking.currency}
        payment={payment}
        open={editing}
        onOpenChange={setEditing}
      />
      <AlertDialog open={deleting} onOpenChange={setDeleting}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-2xl">{t("deletePaymentTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deletePaymentBody", { amount: money(payment.currency, payment.amount) })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{common("back")}</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                deleteMutation.mutate();
                setDeleting(false);
              }}
            >
              {t("deletePayment")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </li>
  );
}

/** The client's read-only page for this booking, to copy and send or to preview. */
function ClientLink({ token, hasClient }: { token: string; hasClient: boolean }) {
  const t = useTranslations("bookings.detail");
  const copyClientLink = useCopyClientLink();
  const path = clientLinkPath({ token });

  return (
    <div className="flex flex-col gap-3 border-t border-foreground/5 pt-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-medium">{t("clientPage")}</h2>
        <p className="text-xs text-muted-foreground">{hasClient ? t("clientPageEmailed") : t("clientPageManual")}</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1 rounded-full" onClick={() => copyClientLink({ token })}>
          <Copy />
          {t("copyLink")}
        </Button>
        <Button variant="ghost" size="sm" className="rounded-full" asChild>
          <a href={path} target="_blank" rel="noreferrer">
            <ExternalLink />
            {t("view")}
          </a>
        </Button>
      </div>
      <Button variant="ghost" size="sm" className="self-start rounded-full" asChild>
        <a href={`${path}/receipt`} target="_blank" rel="noreferrer">
          <FileText />
          {t("receipt")}
        </a>
      </Button>
    </div>
  );
}

export function BookingDetail({ bookingId }: { bookingId: string }) {
  const t = useTranslations("bookings.detail");
  const common = useTranslations("common");
  const money = useMoney();
  const { date } = useFormat();
  const { agencySlug } = useParams<{ agencySlug: string }>();
  const queryClient = useQueryClient();
  const [confirmingCancel, setConfirmingCancel] = useState(false);

  const { data: booking, isLoading, error } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => getBooking(requireToken(), bookingId),
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["booking", bookingId] });
    queryClient.invalidateQueries({ queryKey: ["bookings"] });
  }

  function transition(done: string, fn: (token: string, id: string) => Promise<unknown>) {
    return {
      mutationFn: () => fn(requireToken(), bookingId),
      onSuccess: () => {
        toast.success(done);
        invalidate();
      },
      onError: (err: unknown) => toast.error(err instanceof ApiError ? err.message : common("actionFailed")),
    };
  }
  const confirmMutation = useMutation(transition(t("confirmed"), confirmBooking));
  const completeMutation = useMutation(transition(t("completed"), completeBooking));
  const cancelMutation = useMutation(transition(t("cancelled"), cancelBooking));

  if (error) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-2xl bg-card p-6 ring-1 ring-foreground/5">
        <div>
          <p className="font-display text-xl">{t("notFound")}</p>
          <p className="text-sm text-muted-foreground">
            {error instanceof ApiError ? error.message : common("checkConnection")}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/${agencySlug}/bookings`}>
            <ArrowLeft />
            {t("backToList")}
          </Link>
        </Button>
      </div>
    );
  }
  if (isLoading || !booking) return <Skeleton />;

  const dates = datesOf(booking);
  const { paid, base } = paymentsOf(booking);
  const payments = booking.payments ?? [];
  const busy = confirmMutation.isPending || completeMutation.isPending || cancelMutation.isPending;
  const open = booking.status === "PENDING" || booking.status === "CONFIRMED";

  return (
    <div className="flex flex-col gap-8">
      <BackLink href={`/${agencySlug}/bookings`}>{t("list")}</BackLink>

      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="flex min-w-0 flex-col gap-12">
          <header className="flex items-center gap-5">
            <DateTile booking={booking} className="size-20 rounded-3xl [&_.font-display]:text-4xl" />
            <div className="flex min-w-0 flex-col gap-2">
              <h1 className="font-display text-4xl leading-none tracking-tight text-balance">
                {booking.propertyTitle ?? t("booking")}
              </h1>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-muted-foreground">
                <BookingStatusPill status={booking.status} />
                {booking.clientId && booking.clientName ? (
                  <Link href={`/${agencySlug}/clients/${booking.clientId}`} className="outline-none hover:text-foreground hover:underline focus-visible:underline">
                    {booking.clientName}
                  </Link>
                ) : (
                  <span>{t("noClient")}</span>
                )}
              </div>
            </div>
          </header>

          <FormSection
            title={t("stay")}
            description={dates ? t("stayDescription") : t("saleDescription")}
            shown={null}
          >
            {dates ? (
              <div className="grid max-w-md grid-cols-2 gap-3">
                {[
                  { label: t("checkIn"), date: dates.start },
                  { label: t("checkOut"), date: dates.end },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col gap-1 rounded-2xl bg-card p-4 ring-1 ring-foreground/5">
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                    <span className="font-display text-xl first-letter:uppercase">
                      {date(item.date, "weekdayDayMonthShort")}
                    </span>
                    <span className="text-xs text-muted-foreground">{item.date.getFullYear()}</span>
                  </div>
                ))}
                <p className="col-span-2 text-sm text-muted-foreground">
                  {t("nights", { count: dates.nights })}
                </p>
              </div>
            ) : null}
          </FormSection>

          <FormSection title={t("details")} description={t("detailsDescription")} shown={false}>
            <BookingDetails booking={booking} />
          </FormSection>

          <FormSection
            title={t("payments")}
            description={t("paymentsDescription")}
            shown={null}
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <PaidBar booking={booking} className="min-w-0 flex-1" />
                <AddPaymentDialog bookingId={booking.id} currency={booking.currency} />
              </div>

              {payments.length > 0 ? (
                <ul className="flex flex-col gap-2">
                  {payments.map((payment) => (
                    <PaymentRow key={payment.id} booking={booking} payment={payment} />
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">{t("noPayments")}</p>
              )}
            </div>
          </FormSection>
        </div>

        <aside className="flex flex-col gap-6 rounded-3xl bg-card p-6 shadow-[0_1px_2px_oklch(0.3_0.05_160/0.04),0_12px_32px_-12px_oklch(0.3_0.05_160/0.14)] ring-1 ring-foreground/5 lg:sticky lg:top-24">
          <div className="flex flex-col gap-3">
            <h2 className="font-display text-xl leading-tight">{t("summary")}</h2>
            <div className="flex flex-col gap-2">
              <Stat label={t("totalPrice")} value={booking.totalPrice ? money(booking.currency, booking.totalPrice) : "—"} strong />
              <Stat label={t("commission")} value={booking.commissionAmount ? money(booking.currency, booking.commissionAmount) : "—"} />
              <Stat label={t("collected")} value={money(booking.currency, paid)} />
              <Stat label={t("toCollect")} value={money(booking.currency, Math.max(base - paid, 0))} />
            </div>
          </div>

          <ClientLink token={booking.token} hasClient={Boolean(booking.clientId)} />

          <HistoryButton entity="bookings" id={booking.id} className="-mx-2 self-start [&_span]:inline" />

          {open && (
            <div className="flex flex-col gap-2">
              {booking.status === "PENDING" && (
                <Button className="h-10 rounded-full" disabled={busy} onClick={() => confirmMutation.mutate()}>
                  <Check />
                  {t("confirm")}
                </Button>
              )}
              {booking.status === "CONFIRMED" && (
                <Button className="h-10 rounded-full" disabled={busy} onClick={() => completeMutation.mutate()}>
                  <CircleCheck />
                  {t("complete")}
                </Button>
              )}
              <Button
                variant="ghost"
                className="h-10 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                disabled={busy}
                onClick={() => setConfirmingCancel(true)}
              >
                <X />
                {t("cancel")}
              </Button>
            </div>
          )}
        </aside>
      </div>

      <AlertDialog open={confirmingCancel} onOpenChange={setConfirmingCancel}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-2xl">{t("cancelTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("cancelBody")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{common("back")}</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                cancelMutation.mutate();
                setConfirmingCancel(false);
              }}
            >
              {t("cancel")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
