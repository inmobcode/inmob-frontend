import { CheckoutEventNames, initializePaddle, type Paddle } from "@paddle/paddle-js";

import type { PaddleCheckout, PaddleConfig } from "@/lib/api/billing";

let instance: Promise<Paddle | undefined> | null = null;
let onClosed: (() => void) | null = null;
let completed = false;

/** Loads Paddle.js once. If the page was opened from one of Paddle's links (`?_ptxn=`), it opens that checkout by itself. */
function paddle({ clientToken, environment }: PaddleConfig) {
  instance ??= initializePaddle({
    environment,
    token: clientToken,
    eventCallback: (event) => {
      if (event.name === CheckoutEventNames.CHECKOUT_COMPLETED) completed = true;
      // After paying, Paddle sends the person to successUrl: closing the overlay isn't "leaving unpaid".
      if (event.name === CheckoutEventNames.CHECKOUT_CLOSED && !completed) onClosed?.();
    },
  });
  return instance;
}

/** Makes Paddle.js ready on a page that Paddle's own links (a payment-method update) can land on. */
export function preparePaddle(config: PaddleConfig) {
  return paddle(config);
}

/**
 * Opens Paddle's checkout on top of the page for a transaction the API created:
 * what is bought and for whom was decided there. When it's paid, Paddle sends the
 * person to `successUrl`; `closed` runs if they leave without paying.
 */
export async function openCheckout(
  checkout: PaddleCheckout,
  { successUrl, locale, closed }: { successUrl: string; locale?: string; closed?: () => void },
) {
  onClosed = closed ?? null;
  completed = false;
  const instance = await paddle(checkout);
  if (!instance) throw new Error("Paddle.js did not load");
  instance.Checkout.open({
    transactionId: checkout.transactionId,
    settings: { displayMode: "overlay", theme: "light", locale, successUrl },
  });
}
