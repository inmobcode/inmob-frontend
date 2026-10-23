import { useTranslations } from "next-intl";

import { LandingFooter } from "@/components/landing/footer";
import { LanguageSwitcher } from "@/components/language-switcher";
import { LogoIcon } from "@/components/logo-icon";
import { Link } from "@/i18n/navigation";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("legal");
  return (
    <div className="landing flex flex-1 flex-col">
      <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur-md print:hidden">
        <nav
          aria-label={t("nav")}
          className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-6 px-5 sm:px-8"
        >
          <Link
            href="/"
            className="flex items-center gap-2 rounded-sm font-logo text-xl leading-none font-semibold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-forest"
          >
            <LogoIcon className="h-[0.95em] text-forest" />
            Tivvo
          </Link>
          <div className="flex items-center gap-1">
            <LanguageSwitcher compact className="text-quiet hover:bg-mist hover:text-ink" />
            <Link
              href="/"
              className="inline-flex h-10 items-center rounded-lg px-4 text-sm font-medium text-quiet outline-none transition-colors hover:bg-mist hover:text-ink focus-visible:ring-2 focus-visible:ring-forest"
            >
              {t("home")}
            </Link>
          </div>
        </nav>
      </header>
      {children}
      <LandingFooter />
    </div>
  );
}
