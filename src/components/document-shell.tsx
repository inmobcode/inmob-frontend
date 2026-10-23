import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { fontVariables } from "@/app/fonts";
import { QueryProvider } from "@/lib/query-provider";

/**
 * The <html> both root layouts share (the localized public site and the app),
 * with the fonts and the providers every page needs.
 */
export function DocumentShell({ lang, children }: { lang: string; children: React.ReactNode }) {
  return (
    <html lang={lang} suppressHydrationWarning className={`${fontVariables} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-sidebar">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <QueryProvider>
            <TooltipProvider>
              {children}
              <Toaster />
            </TooltipProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
