"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { LoaderCircle, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { addPayment, updatePayment, type Payment, type PaymentType } from "@/lib/api/bookings";
import { ApiError } from "@/lib/api/client";
import { getAccessToken } from "@/lib/auth/session";
import { parseApiDate } from "@/lib/dates";
import { useLabels } from "@/lib/labels";
import { PAYMENT_TYPES } from "@/lib/properties-labels";
import { cn } from "@/lib/utils";

type Draft = { amount: string; type: PaymentType; paid: boolean; paidOn: string; method: string; note: string };

const today = () => format(new Date(), "yyyy-MM-dd");

function draftOf(payment?: Payment): Draft {
  if (!payment) return { amount: "", type: "DEPOSIT", paid: false, paidOn: today(), method: "", note: "" };
  return {
    amount: String(payment.amount),
    type: payment.type,
    paid: payment.status === "PAID",
    paidOn: payment.paidAt ? format(parseApiDate(payment.paidAt), "yyyy-MM-dd") : today(),
    method: payment.method ?? "",
    note: payment.note ?? "",
  };
}

/**
 * Registers a payment, or with `payment` fixes one: amount, type, how it was
 * paid, whether it's collected and on which day, and a note for the team.
 * Without `open`/`onOpenChange` it brings its own "Registrar pago" button.
 */
export function PaymentDialog({
  bookingId,
  currency,
  payment,
  open: controlledOpen,
  onOpenChange,
}: {
  bookingId: string;
  currency: string;
  payment?: Payment;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const t = useTranslations("bookings.payment");
  const common = useTranslations("common");
  const labels = useLabels();
  const [ownOpen, setOwnOpen] = useState(false);
  const open = controlledOpen ?? ownOpen;
  const [draft, setDraft] = useState<Draft>(() => draftOf(payment));
  const [serverError, setServerError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  function set(patch: Partial<Draft>) {
    setDraft((current) => ({ ...current, ...patch }));
  }

  const mutation = useMutation({
    meta: { affectsSite: false },
    mutationFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      const payload = {
        amount: Number(draft.amount),
        type: draft.type,
        status: draft.paid ? ("PAID" as const) : ("PENDING" as const),
        // Midday, so the day doesn't shift with the time zone.
        paidAt: draft.paid ? `${draft.paidOn}T12:00:00` : null,
        method: draft.method.trim() || null,
        note: draft.note.trim() || null,
      };
      return payment
        ? updatePayment(token, bookingId, payment.id, payload)
        : addPayment(token, bookingId, { ...payload, currency });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booking", bookingId] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      handleOpenChange(false);
    },
    onError: (err) => setServerError(err instanceof ApiError ? err.message : common("unexpectedError")),
  });

  function handleOpenChange(next: boolean) {
    if (controlledOpen === undefined) setOwnOpen(next);
    onOpenChange?.(next);
    // Each opening starts from the payment as saved (or blank).
    if (next) setDraft(draftOf(payment));
    if (!next) setServerError(null);
  }

  const valid = Number(draft.amount) > 0 && (!draft.paid || !!draft.paidOn);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {controlledOpen === undefined && (
        <DialogTrigger asChild>
          <Button size="sm" variant="outline" className="h-9 gap-1.5 rounded-full px-4">
            <Plus />
            {t("add")}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="gap-0 rounded-3xl p-0 sm:max-w-md" showCloseButton>
        <form
          className="flex flex-col"
          onSubmit={(event) => {
            event.preventDefault();
            if (!valid) return;
            setServerError(null);
            mutation.mutate();
          }}
        >
          <div className="flex flex-col gap-1.5 px-7 pt-7 pb-5">
            <DialogTitle className="font-display text-3xl leading-none tracking-tight">
              {payment ? t("edit") : t("add")}
            </DialogTitle>
            <DialogDescription>{t("description")}</DialogDescription>
          </div>

          <div className="flex flex-col gap-5 px-7 pb-2">
            <div className="flex flex-col gap-2.5">
              <Label>{t("type")}</Label>
              <div role="group" aria-label={t("typeLabel")} className="flex flex-wrap gap-1.5">
                {PAYMENT_TYPES.map((value: PaymentType) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={draft.type === value}
                    onClick={() => set({ type: value })}
                    className={cn(
                      "inline-flex h-9 items-center rounded-full px-4 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                      draft.type === value
                        ? "bg-primary text-primary-foreground"
                        : "bg-foreground/[0.06] text-muted-foreground hover:bg-foreground/10 hover:text-foreground",
                    )}
                  >
                    {labels.paymentType(value)}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2.5">
              <Label htmlFor="amount">{t("amount")}</Label>
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                  {payment?.currency ?? currency}
                </span>
                <Input
                  id="amount"
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder="0"
                  className="h-11 pl-14 tabular-nums"
                  value={draft.amount}
                  onChange={(event) => set({ amount: event.target.value.replace(/[^\d.]/g, "") })}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2.5">
              <Label htmlFor="method">
                {t("method")} <span className="font-normal text-muted-foreground">{common("optional")}</span>
              </Label>
              <Input
                id="method"
                maxLength={50}
                placeholder={t("methodPlaceholder")}
                className="h-11"
                value={draft.method}
                onChange={(event) => set({ method: event.target.value })}
              />
            </div>
            <div className="flex flex-col gap-3 rounded-2xl bg-foreground/[0.04] p-4">
              <label htmlFor="paid" className="flex items-center justify-between gap-4 text-sm font-medium">
                {t("collected")}
                <Switch id="paid" checked={draft.paid} onCheckedChange={(paid) => set({ paid })} />
              </label>
              {draft.paid && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="paid-on" className="text-xs text-muted-foreground">
                    {t("collectedOn")}
                  </Label>
                  <DatePicker
                    id="paid-on"
                    surface="card"
                    value={draft.paidOn}
                    maxDate={new Date()}
                    onChange={(paidOn) => set({ paidOn })}
                  />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2.5">
              <Label htmlFor="note">
                {t("note")} <span className="font-normal text-muted-foreground">{t("internal")}</span>
              </Label>
              <Input
                id="note"
                maxLength={200}
                placeholder={t("notePlaceholder")}
                className="h-11"
                value={draft.note}
                onChange={(event) => set({ note: event.target.value })}
              />
            </div>
            {serverError && <p className="text-sm text-destructive">{serverError}</p>}
          </div>

          <div className="flex items-center justify-end gap-2 px-7 pt-5 pb-7">
            <Button type="button" variant="ghost" className="h-10 px-5" onClick={() => handleOpenChange(false)}>
              {common("cancel")}
            </Button>
            <Button type="submit" variant="highlight" className="h-10 gap-2 px-6" disabled={!valid || mutation.isPending}>
              {mutation.isPending ? (
                <>
                  <LoaderCircle className="animate-spin" />
                  {common("saving")}
                </>
              ) : (
                t("save")
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/** "Registrar pago", with its own button. */
export function AddPaymentDialog({ bookingId, currency }: { bookingId: string; currency: string }) {
  return <PaymentDialog bookingId={bookingId} currency={currency} />;
}
