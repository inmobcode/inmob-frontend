"use client";

import { useQuery } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import Link from "next/link";

import { ApiError } from "@/lib/api/client";
import { getAccessToken } from "@/lib/auth/session";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          aria-label={count > 0 ? `Papelera, ${count} elementos` : "Papelera"}
          className="relative inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-foreground/[0.07] outline-none transition-colors hover:bg-foreground/10 focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-foreground/10 dark:hover:bg-foreground/15"
        >
          <Trash2 className="size-4" />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-primary text-[0.65rem] font-semibold text-primary-foreground tabular-nums ring-2 ring-background">
              {count}
            </span>
          )}
        </Link>
      </TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={10}>
        Papelera
      </TooltipContent>
    </Tooltip>
  );
}
