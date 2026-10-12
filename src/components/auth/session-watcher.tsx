"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { setSessionExpiredHandler } from "@/lib/api/client";
import { clearSession } from "@/lib/auth/session";

/** Registers the app-wide reaction to an authenticated request getting a 401: drop the stale session and send the user back to login instead of leaving them stuck on a broken page. */
export function SessionWatcher() {
  const router = useRouter();

  useEffect(() => {
    setSessionExpiredHandler(() => {
      clearSession();
      router.replace("/login");
    });
    return () => setSessionExpiredHandler(null);
  }, [router]);

  return null;
}
