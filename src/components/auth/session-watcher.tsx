"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { setSessionExpiredHandler, setSubscriptionRequiredHandler } from "@/lib/api/client";
import { clearSession } from "@/lib/auth/session";

/** Registers the app-wide reactions to a failed authenticated request: a 401 drops the stale session and sends the user back to login; a 402 sends them to pick a plan. Neither leaves them stuck on a broken page. */
export function SessionWatcher() {
  const router = useRouter();

  useEffect(() => {
    setSessionExpiredHandler(() => {
      clearSession();
      router.replace("/login");
    });
    // The agency has no active subscription (no card yet, or it ended): only the plan screen is open to it.
    setSubscriptionRequiredHandler(() => router.replace("/subscribe"));
    return () => {
      setSessionExpiredHandler(null);
      setSubscriptionRequiredHandler(null);
    };
  }, [router]);

  return null;
}
