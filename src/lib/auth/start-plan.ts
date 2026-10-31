import type { useRouter } from "next/navigation";

import type { AuthResponse } from "@/lib/api/auth";
import { startCheckout, type PlanChoice } from "@/lib/api/billing";
import { openCheckout } from "@/lib/paddle";

/**
 * What comes after the account exists and the email is verified: open the
 * payment for the plan picked at sign-up. If it can't open or is closed
 * unpaid, /subscribe is where to try again.
 */
export async function continueToPlan(
  auth: AuthResponse,
  plan: PlanChoice,
  locale: string,
  router: ReturnType<typeof useRouter>,
) {
  try {
    const { checkout } = await startCheckout(auth.accessToken, plan);
    if (!checkout) {
      router.push(`/${auth.user.agencySlug}/welcome`);
      return;
    }
    await openCheckout(checkout, {
      successUrl: `${window.location.origin}/subscribe?transaction=${checkout.transactionId}&welcome=1`,
      locale,
      closed: () => router.push("/subscribe"),
    });
  } catch {
    router.push("/subscribe");
  }
}
