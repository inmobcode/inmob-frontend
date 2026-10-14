import Link from "next/link";

import { LandingFooter } from "@/components/landing/footer";
import { LogoIcon } from "@/components/logo-icon";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="landing flex flex-1 flex-col">
      <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur-md">
        <nav
          aria-label="Principal"
          className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-6 px-5 sm:px-8"
        >
          <Link
            href="/"
            className="flex items-center gap-2 rounded-sm font-logo text-xl leading-none font-semibold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-forest"
          >
            <LogoIcon className="h-[0.95em] text-forest" />
            Tivvo
          </Link>
          <Link
            href="/"
            className="inline-flex h-10 items-center rounded-lg px-4 text-sm font-medium text-quiet outline-none transition-colors hover:bg-mist hover:text-ink focus-visible:ring-2 focus-visible:ring-forest"
          >
            Volver al inicio
          </Link>
        </nav>
      </header>
      {children}
      <LandingFooter />
    </div>
  );
}
