"use client";

import { MutationCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import { getAccessToken } from "@/lib/auth/session";
import { refreshSiteCache } from "@/lib/site-cache";

function makeQueryClient() {
  const client: QueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Moving between dashboard pages shows what was fetched moments ago
        // instead of asking the API again on every mount and window focus.
        staleTime: 30_000,
      },
    },
    mutationCache: new MutationCache({
      // Any save may touch lists other pages show (a new property, a renamed
      // offer…). Mark everything stale — without refetching it now — so the
      // next page that mounts reloads, just as it did before staleTime. Each
      // mutation still refreshes what's on screen itself. The agency's public
      // site is cached on the server too: expire it, so the change shows there.
      // A mutation that can't change the public site (client stage, inquiry
      // read state…) opts out with `meta: { affectsSite: false }`.
      onSettled: (_data, _error, _variables, _context, mutation) => {
        client.invalidateQueries({ refetchType: "none" });
        if (mutation.meta?.affectsSite !== false && getAccessToken()) refreshSiteCache();
      },
    }),
  });
  return client;
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(makeQueryClient);
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
