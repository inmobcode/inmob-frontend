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

// latin-ext covers Croatian (č, ć, đ, š, ž) and the rest of Europe's accents.
// None of these families draws Greek: Greek text falls back to the system font.

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin", "latin-ext"],
});

// Only for the agency portals' "Clásica" type option (lib/site-theme.ts); the
// app itself uses Sora for headings.
const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-dm-serif-display",
  subsets: ["latin", "latin-ext"],
  weight: "400",
});

// The rest of the agency portals' type options. Not preloaded: a page only
// downloads the ones its site actually uses. (next/font needs literal options.)
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600"],
  preload: false,
  display: "swap",
});
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "latin-ext"],
  preload: false,
  display: "swap",
});
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  preload: false,
  display: "swap",
});
const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin", "latin-ext"],
  preload: false,
  display: "swap",
});
const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin", "latin-ext"],
  preload: false,
  display: "swap",
});
const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin", "latin-ext"],
  preload: false,
  display: "swap",
});
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin", "latin-ext"],
  preload: false,
  display: "swap",
});
const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin", "latin-ext"],
  preload: false,
  display: "swap",
});
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  preload: false,
  display: "swap",
});
const portalFonts = [cormorant, manrope, fraunces, sourceSans, lora, nunitoSans, jakarta, syne, inter]
  .map((font) => font.variable)
  .join(" ");

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

/** Every font variable, for the <html> of each root layout. */
export const fontVariables = `${dmSans.variable} ${dmSerifDisplay.variable} ${sora.variable} ${geistMono.variable} ${portalFonts}`;
