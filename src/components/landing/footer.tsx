import Link from "next/link";

import { LogoIcon } from "@/components/logo-icon";
import { cn } from "@/lib/utils";

const WRAP = "mx-auto w-full max-w-[1440px] px-5 sm:px-8";

// Section links point at "/#…" so they also work from the legal pages, which
// share this footer.
const FOOTER_LINKS: {
  title: string;
  links: { label: string; href: string }[];
}[] = [
  {
    title: "Producto",
    links: [
      { label: "Cómo funciona", href: "/#flujo" },
      { label: "Equipo y permisos", href: "/#equipo" },
      { label: "Migración", href: "/#migracion" },
    ],
  },
  {
    title: "Portales",
    links: [
      { label: "Sitio de tu agencia", href: "/#portales" },
      { label: "Portal del propietario", href: "/#portales" },
    ],
  },
  {
    title: "Empezar",
    links: [
      { label: "Pedir una demo", href: "/#demo" },
      { label: "Planes", href: "/#planes" },
      { label: "Preguntas frecuentes", href: "/#preguntas" },
    ],
  },
  {
    title: "Cuenta",
    links: [
      { label: "Ingresar", href: "/login" },
      { label: "Crear cuenta", href: "/register" },
    ],
  },
];

const LEGAL_LINKS = [
  { label: "Términos y condiciones", href: "/terminos" },
  { label: "Privacidad", href: "/privacidad" },
];

const FOOTER_LINK =
  "rounded-sm text-paper/75 outline-none transition-colors hover:text-paper focus-visible:ring-2 focus-visible:ring-lime";

export function LandingFooter() {
  return (
    <footer data-nav-dark className="overflow-hidden bg-forest-deep text-paper">
      <div
        className={cn(
          WRAP,
          "grid gap-12 pt-16 pb-14 md:pt-20 lg:grid-cols-12 lg:gap-8",
        )}
      >
        <div className="flex flex-col items-start gap-4 lg:col-span-4">
          <Link
            href="/for-agencies"
            className="flex items-center gap-2 rounded-sm font-logo text-xl leading-none font-semibold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-lime"
          >
            <LogoIcon className="h-[0.95em] text-lime" />
            Tivvo
          </Link>
          <p className="max-w-xs text-pretty text-paper/60">
            Sistema de gestión para agencias de venta y alquiler temporario.
          </p>
        </div>

        <nav
          aria-label="Pie"
          className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 lg:col-span-8"
        >
          {FOOTER_LINKS.map((group) => (
            <div key={group.title} className="flex flex-col gap-4">
              <h3 className="text-sm text-paper/45">{group.title}</h3>
              <ul className="flex flex-col gap-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className={FOOTER_LINK}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className={WRAP}>
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-paper/10 py-6 text-sm text-paper/45">
          <p>© {new Date().getFullYear()} Tivvo</p>
          <ul aria-label="Legal" className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={cn(FOOTER_LINK, "text-paper/60")}>
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              {/* "#top" scrolls to the start of the document without needing an element with that id. */}
              <a href="#top" className={cn(FOOTER_LINK, "text-paper/60")}>
                Volver arriba
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* The wordmark sits on the bottom edge like a house on the ground line: its foot is cropped by the page end.
          Its font size is the content width divided by the wordmark's width in em, so it always spans edge to edge. */}
      <div aria-hidden className={cn(WRAP, "pointer-events-none select-none")}>
        <p className="-mb-[0.14em] flex items-end gap-[0.06em] font-logo text-[calc((100vw-2.5rem)/3.44)] sm:text-[min(calc((100vw-4rem)/3.44),25rem)] leading-[0.8] font-semibold tracking-[-0.05em] text-forest">
          <LogoIcon className="mb-[0.02em] h-[0.72em] text-forest" />
          Tivvo
        </p>
      </div>
    </footer>
  );
}
