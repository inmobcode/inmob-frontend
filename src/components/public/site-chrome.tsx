import { AtSign, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";

import { LogoIcon } from "@/components/logo-icon";
import type { PublicAgency } from "@/lib/api/agency";
import {
  type ResolvedSite,
  instagramLink,
  siteThemeStyle,
  whatsappLink,
} from "@/lib/site-theme";
import { cn } from "@/lib/utils";

export const SITE_WRAP = "mx-auto w-full max-w-6xl px-5 sm:px-8";

/** The themed root of an agency's site: neutral base plus the agency's accent and fonts. */
export function SiteRoot({
  site,
  className,
  children,
}: {
  site: ResolvedSite;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn("site flex min-h-svh flex-1 flex-col", className)}
      style={siteThemeStyle(site)}
    >
      {children}
    </div>
  );
}

/** The agency's mark: its logo when it has one, its name set in the heading font otherwise. */
export function AgencyMark({
  agency,
  light = false,
}: {
  agency: PublicAgency;
  light?: boolean;
}) {
  if (agency.logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={agency.logoUrl}
        alt={agency.name}
        className={cn(
          "h-9 w-auto max-w-44 object-contain",
          light && "brightness-0 invert",
        )}
      />
    );
  }
  return <span className="s-heading text-xl leading-none">{agency.name}</span>;
}

/** Main contact action: WhatsApp when the agency set it, email otherwise. */
export function contactAction(
  agency: PublicAgency,
  site: ResolvedSite,
  message?: string,
) {
  if (site.whatsapp)
    return {
      href: whatsappLink(site.whatsapp, message),
      label: "Escribinos por WhatsApp",
      external: true,
    };
  if (agency.contactEmail)
    return {
      href: `mailto:${agency.contactEmail}`,
      label: "Escribinos",
      external: true,
    };
  return null;
}

export function SiteHeader({
  agency,
  site,
  slug,
  overlay = false,
}: {
  agency: PublicAgency;
  site: ResolvedSite;
  slug: string;
  /** Sits on top of a cover photo, with light text. */
  overlay?: boolean;
}) {
  const home = `/page/${slug}`;
  const links = [
    { href: `${home}#propiedades`, label: "Propiedades" },
    ...(site.showAbout && site.about
      ? [{ href: `${home}#nosotros`, label: "Nosotros" }]
      : []),
    { href: `${home}#contacto`, label: "Contacto" },
  ];
  const action = contactAction(agency, site);

  return (
    <header
      className={cn(
        "z-20",
        overlay
          ? "absolute inset-x-0 top-0 text-white"
          : "relative border-b border-site-line bg-site-bg",
      )}
    >
      <div className={cn(SITE_WRAP, "flex h-18 items-center gap-8")}>
        <Link
          href={home}
          className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-site-accent"
        >
          <AgencyMark agency={agency} light={overlay} />
        </Link>
        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-6 text-sm">
            {links.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={cn(
                    "rounded-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-site-accent",
                    overlay
                      ? "text-white/80 hover:text-white"
                      : "text-site-quiet hover:text-site-ink",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {action && (
          <a
            href={action.href}
            target="_blank"
            rel="noreferrer"
            className={cn(
              "ml-auto inline-flex h-10 items-center rounded-lg px-4 text-sm font-medium outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2",
              overlay
                ? "bg-white text-site-ink focus-visible:ring-white focus-visible:ring-offset-transparent"
                : "bg-site-accent text-site-accent-ink focus-visible:ring-site-accent",
            )}
          >
            Contactar
          </a>
        )}
      </div>
    </header>
  );
}

export function SiteFooter({
  agency,
  site,
}: {
  agency: PublicAgency;
  site: ResolvedSite;
}) {
  const items = [
    site.whatsapp && {
      icon: MessageCircle,
      label: site.whatsapp,
      href: whatsappLink(site.whatsapp),
    },
    site.phone && {
      icon: Phone,
      label: site.phone,
      href: `tel:${site.phone.replace(/[^\d+]/g, "")}`,
    },
    agency.contactEmail && {
      icon: Mail,
      label: agency.contactEmail,
      href: `mailto:${agency.contactEmail}`,
    },
    site.instagram && {
      icon: AtSign,
      label: site.instagram.replace(
        /^https?:\/\/(www\.)?instagram\.com\//,
        "@",
      ),
      href: instagramLink(site.instagram),
    },
    site.address && {
      icon: MapPin,
      label: site.address,
      href: `https://www.google.com/maps/search/${encodeURIComponent(site.address)}`,
    },
  ].filter(Boolean) as { icon: typeof Phone; label: string; href: string }[];

  return (
    <footer className="mt-auto border-t border-site-line">
      <div
        className={cn(SITE_WRAP, "grid gap-10 py-12 md:grid-cols-[1fr_auto]")}
      >
        <div className="flex flex-col gap-3">
          <AgencyMark agency={agency} />
          <p className="text-sm text-site-quiet">
            © {new Date().getFullYear()} {agency.name}
          </p>
        </div>
        {items.length > 0 && (
          <ul className="flex flex-col gap-2.5 text-sm">
            {items.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-sm text-site-quiet outline-none transition-colors hover:text-site-ink focus-visible:ring-2 focus-visible:ring-site-accent"
                >
                  <item.icon className="size-4 shrink-0" aria-hidden />
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className={cn(SITE_WRAP, "border-t border-site-line py-5")}>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-sm text-xs text-site-quiet outline-none hover:text-site-ink focus-visible:ring-2 focus-visible:ring-site-accent"
        >
          <LogoIcon className="h-3" />
          Portal hecho con Tivvo
        </Link>
      </div>
    </footer>
  );
}
