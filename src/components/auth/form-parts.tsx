import { LoaderCircle } from "lucide-react";

import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils";

/** Shared pieces of the sign-in, sign-up and password screens. */

export const AUTH_INPUT =
  "h-12 rounded-lg border border-[#cfd5cc] bg-white px-4 text-base shadow-none md:text-sm";

export function AuthHeading({ title, text }: { title: string; text?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-logo text-[2rem] leading-[1.05] font-semibold tracking-[-0.03em] text-balance">
        {title}
      </h1>
      {text && <p className="text-pretty text-quiet">{text}</p>}
    </div>
  );
}

/** A label for the choice between the social buttons and the email form, with a hairline on each side. */
export function AuthDivider({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-sm text-quiet">
      <span aria-hidden className="h-px flex-1 bg-line" />
      {children}
      <span aria-hidden className="h-px flex-1 bg-line" />
    </div>
  );
}

/**
 * One form field: label, control, and either a hint or the error that replaces it.
 * `describedBy` is the id the control should point `aria-describedby` at.
 */
export function AuthField({
  id,
  label,
  hint,
  error,
  aside,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  const note = error ?? hint;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        {aside}
      </div>
      {children}
      {note && (
        <p
          id={`${id}-note`}
          className={cn("text-sm", error ? "text-destructive" : "text-quiet")}
        >
          {note}
        </p>
      )}
    </div>
  );
}

/** Props that tie a control to its field's hint or error. */
export function fieldA11y(
  id: string,
  { hint, error }: { hint?: string; error?: string },
) {
  return {
    "aria-invalid": Boolean(error),
    "aria-describedby": hint || error ? `${id}-note` : undefined,
  };
}

export function AuthSubmit({
  pending,
  label,
  pendingLabel,
}: {
  pending: boolean;
  label: string;
  pendingLabel: string;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-forest text-base font-semibold text-paper outline-none transition-colors hover:bg-forest-deep focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 disabled:opacity-70"
    >
      {pending ? (
        <>
          <LoaderCircle className="size-4 animate-spin" />
          {pendingLabel}
        </>
      ) : (
        label
      )}
    </button>
  );
}

export function AuthFormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-pretty text-destructive"
    >
      {message}
    </p>
  );
}

type AuthAction = "login" | "register" | "forgot" | "reset";

/**
 * Turns a failed auth request into something the person can act on. The API
 * answers in English ("Invalid credentials"), so the copy is chosen by status.
 */
export function authErrorMessage(err: unknown, action: AuthAction): string {
  if (!(err instanceof ApiError)) {
    return "No pudimos conectar con Tivvo. Revisá tu conexión y probá de nuevo.";
  }
  if (action === "login" && err.status === 401) {
    return "El email o la contraseña no coinciden. Revisalos o recuperá tu contraseña.";
  }
  if (action === "register" && err.status === 409) {
    return "Ya hay una cuenta con ese email. Ingresá con ella o usá otro email.";
  }
  if (action === "reset" && (err.status === 400 || err.status === 410)) {
    return "El link para crear la contraseña venció o ya se usó. Pedí uno nuevo.";
  }
  if (
    (action === "forgot" || action === "reset") &&
    (err.status === 404 || err.status === 405)
  ) {
    return "La recuperación de contraseña todavía no está disponible.";
  }
  if (err.status === 400)
    return "Revisá los datos del formulario y probá de nuevo.";
  if (err.status >= 500)
    return "Tivvo tuvo un problema al procesar tu pedido. Probá de nuevo en unos minutos.";
  return "No se pudo completar. Probá de nuevo en unos minutos.";
}
