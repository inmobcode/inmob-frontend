import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  DM_Sans,
  DM_Serif_Display,
  Fraunces,
  Geist_Mono,
  Inter,
  Lora,
  Manrope,
  Nunito_Sans,
  Plus_Jakarta_Sans,
  Sora,
  Source_Sans_3,
  Syne,
} from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryProvider } from "@/lib/query-provider";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
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

// The rest of the agency portals' type options. Not preloaded: a page only
// downloads the ones its site actually uses. (next/font needs literal options.)
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600"],
  preload: false,
  display: "swap",
});
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  preload: false,
  display: "swap",
});
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  preload: false,
  display: "swap",
});
const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  preload: false,
  display: "swap",
});
const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  preload: false,
  display: "swap",
});
const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  preload: false,
  display: "swap",
});
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  preload: false,
  display: "swap",
});
const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  preload: false,
  display: "swap",
});
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  preload: false,
  display: "swap",
});
const portalFonts = [cormorant, manrope, fraunces, sourceSans, lora, nunitoSans, jakarta, syne, inter]
  .map((font) => font.variable)
  .join(" ");

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Every relative canonical and Open Graph image below resolves against this.
  metadataBase: new URL(SITE_URL),
  // Pages set their own short title ("Propiedades", "Ingresar", …) and get
  // this suffix for free; only the root page (no override) shows "Tivvo" bare.
  title: { default: SITE_NAME, template: `%s · ${SITE_NAME}` },
  description: "Sistema de gestión para inmobiliarias: propiedades, ofertas, reservas y el sitio de tu agencia.",
  applicationName: SITE_NAME,
  // Agency sites and listings override these with their own name and photos.
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "es_AR",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${dmSans.variable} ${dmSerifDisplay.variable} ${sora.variable} ${geistMono.variable} ${portalFonts} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-sidebar">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
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
