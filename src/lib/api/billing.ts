import { apiFetch } from "./client";

/** What someone can pick when signing up. Enterprise isn't here: it goes through sales. */
export type PlanChoice = "trial" | "pro";

/** What Paddle.js needs in the browser (public values). */
export interface PaddleConfig {
  clientToken: string;
  environment: "sandbox" | "production";
}

/** A transaction the API created for the chosen plan, ready to open with Paddle.js. */
export interface PaddleCheckout extends PaddleConfig {
  transactionId: string;
}

export interface BillingStatus {
  /** "trial" is the free week: full access except the data-migration tool. */
  plan: "trial" | "pro";
  status: "INCOMPLETE" | "TRIALING" | "ACTIVE" | "PAST_DUE" | "CANCELED";
  /** ISO date, UTC. */
  trialEndsAt: string | null;
  billingEnabled: boolean;
  /** null when billing is off or Paddle isn't configured. */
  paddle: PaddleConfig | null;
  /** false once the agency has used its free trial (or its card already started another one). */
  trialAvailable: boolean;
  features: { import: boolean };
}

export function getBillingStatus(token: string) {
  return apiFetch<BillingStatus>("/api/billing/status", { token });
}

/** The checkout for the plan; `checkout` is null when billing is off (local development) and the plan already started. */
export function startCheckout(token: string, plan: PlanChoice) {
  return apiFetch<{ checkout: PaddleCheckout | null }>("/api/billing/checkout", {
    method: "POST",
    token,
    body: JSON.stringify({ plan }),
  });
}

/** Called on coming back from Paddle, so access doesn't wait for the webhook. */
export function confirmCheckout(token: string, transactionId: string) {
  return apiFetch<BillingStatus>("/api/billing/confirm", {
    method: "POST",
    token,
    body: JSON.stringify({ transactionId }),
  });
}

export function openBillingPortal(token: string) {
  return apiFetch<{ url: string }>("/api/billing/portal", { method: "POST", token });
}
