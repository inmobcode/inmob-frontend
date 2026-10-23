"use client";

import {
  Building2,
  CalendarCheck,
  CalendarDays,
  Compass,
  Eye,
  Globe,
  Inbox,
  Keyboard,
  KeyRound,
  Settings,
  Sparkles,
  Tag,
  Upload,
  UserRound,
  Users,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import type { DocSectionId } from "@/components/docs/docs-sections";
import { media } from "@/lib/motion";
import { cn } from "@/lib/utils";

const ICONS: Record<DocSectionId, LucideIcon> = {
  "primeros-pasos": Compass,
  consultas: Inbox,
  clientes: Users,
  propiedades: Building2,
  propietarios: KeyRound,
  importar: Upload,
  ofertas: Tag,
  reservas: CalendarDays,
  disponibilidad: CalendarCheck,
  servicios: Sparkles,
  portal: Globe,
  "lo-que-ven-tus-clientes": Eye,
  equipo: UsersRound,
  configuracion: Settings,
  perfil: UserRound,
  atajos: Keyboard,
};

function jumpTo(event: React.MouseEvent<HTMLAnchorElement>, id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  event.preventDefault();
  const smooth = !window.matchMedia(media.reduceMotion).matches;
  target.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
  window.history.replaceState(null, "", `#${id}`);
}

/**
 * The guide's frame: its index (chips on phones, a list that follows the
 * reading on wide screens) around the sections, which the page renders in its
 * language and passes in as children.
 */
export function DocsIndex({
  entries,
  children,
}: {
  entries: { id: DocSectionId; label: string }[];
  children: React.ReactNode;
}) {
  const t = useTranslations("docs.page");
  // A plain string: what the observer below reads back is a DOM id.
  const [active, setActive] = useState<string>(entries[0]?.id ?? "");

  // The index follows whichever section crosses the upper part of the screen.
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("[data-doc-section]");
    const observer = new IntersectionObserver(
      (observed) => {
        const visible = observed.find((entry) => entry.isIntersecting);
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-15% 0px -75% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col gap-10">
      <header className="flex max-w-2xl flex-col gap-3">
        <h1 className="font-display text-4xl leading-none tracking-tight sm:text-5xl">{t("title")}</h1>
        <p className="text-base text-pretty text-muted-foreground">{t("lead")}</p>
      </header>

      {/* On phones the index is a row of chips above the content. */}
      <nav aria-label={t("sections")} className="flex flex-wrap gap-2 lg:hidden">
        {entries.map((section) => {
          const Icon = ICONS[section.id];
          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              onClick={(event) => jumpTo(event, section.id)}
              className="inline-flex h-8 items-center gap-1.5 rounded-full bg-foreground/[0.06] px-3 text-sm transition-colors hover:bg-foreground/10"
            >
              <Icon className="size-3.5 text-muted-foreground" />
              {section.label}
            </a>
          );
        })}
      </nav>

      <div className="grid gap-12 lg:grid-cols-[13rem_minmax(0,1fr)]">
        <nav aria-label={t("index")} className="hidden lg:block">
          <ul className="sticky top-24 flex flex-col gap-0.5">
            {entries.map((section) => {
              const Icon = ICONS[section.id];
              return (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    onClick={(event) => jumpTo(event, section.id)}
                    aria-current={active === section.id ? "location" : undefined}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                      active === section.id
                        ? "bg-secondary font-medium text-foreground"
                        : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    {section.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex max-w-3xl min-w-0 flex-col gap-12">{children}</div>
      </div>
    </div>
  );
}
