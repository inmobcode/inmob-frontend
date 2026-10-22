"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface IndexItem {
  id: string;
  title: string;
}

/**
 * The document's index. On wide screens it stays in view and marks the section
 * being read; on small ones it folds into a "Contenido" disclosure.
 */
export function LegalIndex({ items }: { items: IndexItem[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const targets = items
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => element !== null);
    if (targets.length === 0) return;

    // The section crossing the upper part of the viewport is the one being read.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-15% 0px -75% 0px" },
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [items]);

  const list = (
    <ol className="flex flex-col text-sm">
      {items.map((item, index) => {
        const current = item.id === active;
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={current ? "location" : undefined}
              className={cn(
                "flex gap-3 border-l py-1.5 pl-4 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-forest",
                current ? "border-forest font-medium text-ink" : "border-line text-quiet hover:text-ink",
              )}
            >
              <span className="w-5 shrink-0 tabular-nums text-quiet/60">{index + 1}</span>
              {item.title}
            </a>
          </li>
        );
      })}
    </ol>
  );

  return (
    <nav aria-label="Índice" className="print:hidden">
      <details className="group border-b border-line pb-4 lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between py-2 font-medium outline-none focus-visible:ring-2 focus-visible:ring-forest [&::-webkit-details-marker]:hidden">
          Contenido
          <span aria-hidden="true" className="text-quiet transition-transform group-open:rotate-180">
            ↓
          </span>
        </summary>
        <div className="pt-3">{list}</div>
      </details>
      <div className="hidden lg:block">
        <h2 className="mb-3 text-sm text-quiet">Contenido</h2>
        {list}
      </div>
    </nav>
  );
}
