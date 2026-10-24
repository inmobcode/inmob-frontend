"use client";

import { Printer } from "lucide-react";

/** Opens the browser's print dialog, where the client can also save the page as a PDF. */
export function PrintButton({ label, className }: { label: string; className?: string }) {
  return (
    <button type="button" onClick={() => window.print()} className={className}>
      <Printer className="size-4" aria-hidden />
      {label}
    </button>
  );
}
