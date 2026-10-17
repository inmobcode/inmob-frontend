"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * next-themes renders an inline <script> that sets the theme before paint. It
 * runs from the server HTML; if React has to create it again in the browser
 * (e.g. when a not-found or a hydration mismatch re-renders the tree), React 19
 * warns about a script it won't execute. Marking it as data in the browser
 * avoids that without changing anything: the theme is already applied by then.
 *
 * This has to live in a client component: in the root layout (a server
 * component) `typeof window` is always "undefined", so the check never ran.
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      {...props}
      scriptProps={{
        type: typeof window === "undefined" ? undefined : "text/plain",
      }}
    >
      {children}
    </NextThemesProvider>
  );
}
