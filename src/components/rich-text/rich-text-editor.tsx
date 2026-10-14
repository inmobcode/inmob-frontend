"use client";

import { lazy, Suspense } from "react";

import type { RichTextEditorProps } from "@/components/rich-text/rich-text-editor-body";
import { cn } from "@/lib/utils";

export type { RichTextVariant } from "@/components/rich-text/rich-text-editor-body";

// Tiptap and ProseMirror only download when an editor is actually shown
// (most of them sit in tabs that aren't open on arrival), not with the page.
const RichTextEditorBody = lazy(() => import("@/components/rich-text/rich-text-editor-body"));

/**
 * A text field with a small formatting toolbar. Its value is HTML ("" when
 * empty); plain text from before the editor existed loads as paragraphs.
 */
export function RichTextEditor(props: RichTextEditorProps) {
  return (
    <Suspense fallback={<RichTextEditorShell {...props} />}>
      <RichTextEditorBody {...props} />
    </Suspense>
  );
}

/** The editor's empty box while its code loads: same frame, toolbar strip and writing area height. */
function RichTextEditorShell({ variant = "full", className, contentClassName }: RichTextEditorProps) {
  return (
    <div
      aria-hidden
      className={cn("w-full rounded-xl border border-transparent bg-foreground/[0.07] dark:bg-foreground/10", className)}
    >
      <div
        className={cn(
          "rounded-t-xl border-b border-foreground/[0.06] bg-card",
          variant === "inline" ? "h-10" : "h-11",
        )}
      />
      <div className={cn("px-3.5 py-3", variant === "inline" ? "min-h-14" : "min-h-28", contentClassName)} />
    </div>
  );
}
