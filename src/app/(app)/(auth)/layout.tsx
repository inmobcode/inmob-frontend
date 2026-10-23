import Link from "next/link";

import { AuthAside } from "@/components/auth/auth-aside";
import { AuthShell } from "@/components/auth/auth-shell";
import { AppLanguageSwitcher } from "@/components/language-switcher";
import { LogoIcon } from "@/components/logo-icon";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthShell>
      {/* On pinned screens the column takes the viewport height and only it scrolls if it has to. */}
      <div className="flex min-h-0 flex-col px-6 py-8 group-data-pinned/auth:overflow-y-auto sm:px-12 lg:px-16 [@media(max-height:820px)]:py-6">
        <Link
          href="/"
          className="flex w-fit items-center gap-2 rounded-sm font-logo text-xl leading-none font-semibold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-forest"
        >
          <LogoIcon className="h-[0.95em] text-forest" />
          Tivvo
        </Link>
        <main className="flex flex-1 items-center justify-center py-12 [@media(max-height:820px)]:py-6">
          <div className="w-full max-w-sm">{children}</div>
        </main>
        <div className="flex items-center justify-between gap-4 text-sm text-quiet">
          <p className="[@media(max-height:720px)]:hidden">© {new Date().getFullYear()} Tivvo</p>
          <AppLanguageSwitcher align="end" className="-mr-2.5 ml-auto hover:bg-mist hover:text-ink" />
        </div>
      </div>
      <AuthAside />
    </AuthShell>
  );
}
