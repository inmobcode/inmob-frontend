"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#flujo", label: "Cómo funciona" },
  { href: "#portal", label: "Tu portal" },
  { href: "#migracion", label: "Migración" },
  { href: "#planes", label: "Planes" },
];

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4 lg:px-14">
      <nav
        aria-label="Principal"
        className={cn(
          "mx-auto flex h-14 max-w-[1800px] items-center gap-6 rounded-full pr-2 pl-6 transition-[background-color,box-shadow,backdrop-filter] duration-500",
          scrolled
            ? "bg-card/70 shadow-[0_12px_40px_-16px_oklch(0.3_0.05_160/0.3)] ring-1 ring-foreground/5 backdrop-blur-xl backdrop-saturate-150"
            : "bg-transparent",
        )}
      >
        <Link href="/" className="font-display text-2xl leading-none tracking-tight">
          Inmobiliario
        </Link>
        <ul className="ml-auto hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors outline-none hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <Button asChild variant="ghost" className="hidden h-10 rounded-full px-4 sm:inline-flex">
            <Link href="/login">Ingresar</Link>
          </Button>
          <Button asChild variant="highlight" className="h-10 rounded-full px-5">
            <a href="#demo">Pedir una demo</a>
          </Button>
        </div>
      </nav>
    </header>
  );
}
