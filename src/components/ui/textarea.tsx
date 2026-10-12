"use client"

import * as React from "react"
import { cn } from "cn"

function fit(element: HTMLTextAreaElement | null) {
  if (!element) return
  element.style.height = "auto"
  element.style.height = `${element.scrollHeight}px`
}

/** Grows with its content, line by line, instead of showing a scrollbar. */
function Textarea({
  className,
  ref,
  onInput,
  ...props
}: React.ComponentProps<"textarea">) {
  const innerRef = React.useRef<HTMLTextAreaElement | null>(null)

  const setRef = React.useCallback(
    (node: HTMLTextAreaElement | null) => {
      innerRef.current = node
      if (typeof ref === "function") ref(node)
      else if (ref) ref.current = node
      fit(node)
    },
    [ref]
  )

  // Controlled values (and form resets) change the text without an input event.
  React.useLayoutEffect(() => {
    fit(innerRef.current)
  }, [props.value])

  return (
    <textarea
      ref={setRef}
      data-slot="textarea"
      onInput={(event) => {
        fit(event.currentTarget)
        onInput?.(event)
      }}
      className={cn(
        "flex min-h-24 w-full resize-none overflow-hidden rounded-xl border border-transparent bg-foreground/[0.07] px-3.5 py-2.5 text-base transition-[background-color,box-shadow,border-color] duration-300 ease-out outline-none placeholder:text-muted-foreground focus-visible:border-primary/20 focus-visible:bg-card focus-visible:shadow-[0_8px_24px_-12px_oklch(0.3_0.05_160/0.3)] focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive/60 aria-invalid:ring-3 aria-invalid:ring-destructive/15 md:text-sm dark:bg-foreground/10 dark:focus-visible:bg-card dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/30",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
