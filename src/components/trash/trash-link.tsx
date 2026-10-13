"use client";

import { useQuery } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import Link from "next/link";

import { ApiError } from "@/lib/api/client";
import { getAccessToken } from "@/lib/auth/session";

/** The way into a section's trash, from its list's toolbar, with how many items wait there. */
export function TrashLink({
  href,
  queryKey,
  list,
}: {
  href: string;
  queryKey: readonly unknown[];
  list: (token: string) => Promise<unknown[]>;
}) {
  const { data } = useQuery({
    queryKey,
    queryFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return list(token);
    },
  });
  const count = data?.length ?? 0;

  return (
    <Link
      href={href}
      aria-label={count > 0 ? `Papelera, ${count} elementos` : "Papelera"}
      className="inline-flex h-10 items-center gap-2 rounded-full bg-foreground/[0.07] px-4 text-sm outline-none transition-colors hover:bg-foreground/10 focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-foreground/10 dark:hover:bg-foreground/15"
    >
      <Trash2 className="size-4" />
      Papelera
      {count > 0 && (
        <span className="min-w-6 rounded-full bg-foreground/[0.07] px-2 py-0.5 text-center text-xs text-muted-foreground tabular-nums">
          {count}
        </span>
      )}
    </Link>
  );
}
