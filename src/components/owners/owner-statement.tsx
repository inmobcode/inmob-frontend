import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

import type { OwnerStatement, OwnerStatementTotal } from "@/lib/api/owner-accounts";
import { cn } from "@/lib/utils";

/** The look of the statement in each place it appears: the owner's public portal or the agency's dashboard. */
const TONES = {
  site: { quiet: "text-site-quiet", line: "border-site-line", strong: "text-site-ink", heading: "s-heading" },
  app: { quiet: "text-muted-foreground", line: "border-foreground/10", strong: "text-foreground", heading: "font-display" },
} as const;

export type StatementTone = keyof typeof TONES;

export const money = (currency: string, value: number) =>
  `${currency} ${value.toLocaleString("es-AR", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

const day = (iso: string | null) => (iso ? format(parseISO(iso), "d MMM", { locale: es }) : "—");

function Figure({ label, value, hint, tone, emphasis }: { label: string; value: string; hint?: string; tone: StatementTone; emphasis?: boolean }) {
  const t = TONES[tone];
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <dt className={cn("text-sm", t.quiet)}>{label}</dt>
      <dd className={cn(t.heading, "tabular-nums", emphasis ? "text-3xl" : "text-xl", t.strong)}>{value}</dd>
      {hint && <dd className={cn("text-xs", t.quiet)}>{hint}</dd>}
    </div>
  );
}

function TotalBlock({ total, tone }: { total: OwnerStatementTotal; tone: StatementTone }) {
  const t = TONES[tone];
  const hasCommission = total.commission !== undefined;
  return (
    <div className={cn("flex flex-col gap-4 border-t pt-5", t.line)}>
      <dl
        className={cn("grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3", tone === "site" && "lg:grid-cols-(--cols)")}
        style={{ "--cols": hasCommission ? "repeat(5, minmax(0, 1fr))" : "repeat(4, minmax(0, 1fr))" } as React.CSSProperties}
      >
        <Figure tone={tone} label="Cobrado" value={money(total.currency, total.collected)} hint={`de ${money(total.currency, total.booked)} reservados`} />
        {hasCommission && <Figure tone={tone} label="Comisión" value={`− ${money(total.currency, total.commission!)}`} hint="de la agencia" />}
        <Figure tone={tone} label="Te corresponde" value={money(total.currency, total.due)} hint="lo cobrado menos la comisión" />
        <Figure tone={tone} label="Ya liquidado" value={money(total.currency, total.paidOut)} />
        <Figure
          tone={tone}
          emphasis
          label={total.balance < 0 ? "Se liquidó de más" : "Saldo por liquidar"}
          value={money(total.currency, Math.abs(total.balance))}
        />
      </dl>
    </div>
  );
}

/**
 * An owner's account: per currency what was collected, the commission when it is
 * shown, what is due to them, what was already handed over and what is left —
 * then the booking by booking breakdown and the list of liquidaciones.
 * `renderPayoutAction` lets the dashboard add a delete button to each one.
 */
export function OwnerStatementView({
  statement,
  tone,
  renderPayoutAction,
}: {
  statement: OwnerStatement;
  tone: StatementTone;
  renderPayoutAction?: (payoutId: string) => React.ReactNode;
}) {
  const t = TONES[tone];
  const showCommission = statement.totals.some((total) => total.commission !== undefined);

  if (statement.totals.length === 0 && statement.payouts.length === 0) {
    return <p className={cn("text-sm", t.quiet)}>Todavía no hay reservas con cobros ni liquidaciones.</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      {statement.totals.map((total) => (
        <TotalBlock key={total.currency} total={total} tone={tone} />
      ))}

      {statement.bookings.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className={cn(t.heading, "text-lg", t.strong)}>Por reserva</h3>
          <ul className="flex flex-col">
            {statement.bookings.map((booking, index) => (
              <li
                key={index}
                className={cn("grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-0.5 border-b py-3 text-sm last:border-b-0", t.line)}
              >
                <span className={cn("min-w-0 truncate font-medium", t.strong)}>{booking.propertyTitle ?? "Propiedad"}</span>
                <span className={cn("text-right tabular-nums", t.strong)}>{money(booking.currency, booking.due)}</span>
                <span className={cn("text-xs", t.quiet)}>
                  {day(booking.startDate)} → {day(booking.endDate)}
                  {booking.status === "PENDING" && " · sin confirmar"}
                </span>
                <span className={cn("text-right text-xs tabular-nums", t.quiet)}>
                  cobrado {money(booking.currency, booking.collected)} de {money(booking.currency, booking.total)}
                  {showCommission && booking.commission !== undefined && booking.commission > 0 && ` · comisión ${money(booking.currency, booking.commission)}`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <h3 className={cn(t.heading, "text-lg", t.strong)}>Liquidaciones</h3>
        {statement.payouts.length === 0 ? (
          <p className={cn("text-sm", t.quiet)}>Todavía no se registró ninguna.</p>
        ) : (
          <ul className="flex flex-col">
            {statement.payouts.map((payout) => (
              <li key={payout.id} className={cn("flex items-center gap-4 border-b py-3 text-sm last:border-b-0", t.line)}>
                <span className={cn("w-16 shrink-0 tabular-nums", t.quiet)}>{format(parseISO(payout.paidAt), "d MMM yy", { locale: es })}</span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className={cn("font-medium tabular-nums", t.strong)}>{money(payout.currency, payout.amount)}</span>
                  {(payout.method || payout.note) && (
                    <span className={cn("truncate text-xs", t.quiet)}>{[payout.method, payout.note].filter(Boolean).join(" · ")}</span>
                  )}
                </span>
                {renderPayoutAction?.(payout.id)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
