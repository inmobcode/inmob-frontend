import { cn } from "@/lib/utils";

/** Isotipo de Tivvo. Usa `currentColor`: el color se define con clases de texto. */
export function LogoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 282 230"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={12}
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("h-[0.8em] w-auto shrink-0", className)}
    >
      <path d="M6 73.5L141 6L276 73.5V99.5L174 48.5V223.5H108V48.5L6 99.5V73.5Z" />
      <path d="M6 223.5V129.5L78 93.5V223.5H6Z" />
      <path d="M204 223.5V93.5L276 129.5V223.5H204Z" />
    </svg>
  );
}
