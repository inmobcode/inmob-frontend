import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display, Geist_Mono, Sora } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryProvider } from "@/lib/query-provider";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

// Only for the agency portals' "Clásica" type option (lib/site-theme.ts); the
// app itself uses Sora for headings.
const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-dm-serif-display",
  subsets: ["latin"],
  weight: "400",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tivvo",
  description: "Plataforma de gestión para agencias",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${dmSans.variable} ${dmSerifDisplay.variable} ${sora.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-sidebar">
        {/*
          next-themes renders an inline <script> that sets the theme before paint.
          It runs from the server HTML; if React ever has to create it again in
          the browser (e.g. after a hydration mismatch), React 19 warns about a
          script it won't execute. Marking it as data on the client avoids that
          without changing anything: the theme is already applied by then.
        */}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
          scriptProps={{ type: typeof window === "undefined" ? undefined : "text/plain" }}
        >
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
