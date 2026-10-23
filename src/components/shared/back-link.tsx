import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * Quiet text action at the top of a tool (back links and their neighbours).
 * The negative margin keeps the text aligned with the content while the hover
 * background gets room around it.
 */
export const backLinkClass =
  "-ml-2.5 inline-flex h-8 w-fit items-center gap-1.5 rounded-full px-2.5 text-sm text-muted-foreground transition-colors outline-none hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50";

export function BackLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link href={href} className={cn(backLinkClass, className)}>
      <ArrowLeft className="size-4" />
      {children}
    </Link>
  );
}
