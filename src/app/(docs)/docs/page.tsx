"use client";

import { useEffect, useState } from "react";

import { DOC_SECTIONS } from "@/components/docs/docs-content";
import { media } from "@/lib/motion";
import { cn } from "@/lib/utils";

function jumpTo(event: React.MouseEvent<HTMLAnchorElement>, id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  event.preventDefault();
  const smooth = !window.matchMedia(media.reduceMotion).matches;
  target.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
  window.history.replaceState(null, "", `#${id}`);
}

export default function DocsPage() {
  // A plain string: what the observer below reads back is a DOM id.
  const [active, setActive] = useState<string>(DOC_SECTIONS[0].id);

  // The index follows whichever section crosses the upper part of the screen.
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("[data-doc-section]");
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
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
        <h1 className="font-display text-4xl leading-none tracking-tight sm:text-5xl">Cómo funciona Tivvo</h1>
        <p className="text-base text-pretty text-muted-foreground">
          Una guía de cada herramienta del panel: qué hace, cómo se usa y qué ven tus clientes. Usá el índice para ir
          directo a lo que necesitás.
        </p>
      </header>

      {/* On phones the index is a row of chips above the content. */}
      <nav aria-label="Secciones de la documentación" className="flex flex-wrap gap-2 lg:hidden">
        {DOC_SECTIONS.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            onClick={(event) => jumpTo(event, section.id)}
            className="inline-flex h-8 items-center gap-1.5 rounded-full bg-foreground/[0.06] px-3 text-sm transition-colors hover:bg-foreground/10"
          >
            <section.icon className="size-3.5 text-muted-foreground" />
            {section.label}
          </a>
        ))}
      </nav>

      <div className="grid gap-12 lg:grid-cols-[13rem_minmax(0,1fr)]">
        <nav aria-label="Índice" className="hidden lg:block">
          <ul className="sticky top-24 flex flex-col gap-0.5">
            {DOC_SECTIONS.map((section) => (
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
                  <section.icon className="size-4 shrink-0" />
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex max-w-3xl min-w-0 flex-col gap-12">
          {DOC_SECTIONS.map(({ id, Content }) => (
            <Content key={id} />
          ))}
        </div>
      </div>
    </div>
  );
}
