"use client";

import { useQuery } from "@tanstack/react-query";

import { getBillingStatus } from "@/lib/api/billing";
import { getAccessToken } from "@/lib/auth/session";

/** The agency's plan and what it includes. `data` is undefined until it loads. */
export function useBilling() {
  return useQuery({
    queryKey: ["billing"],
    queryFn: () => {
      const token = getAccessToken();
      if (!token) throw new Error("No session");
      return getBillingStatus(token);
    },
    staleTime: 5 * 60_000,
  });
}
