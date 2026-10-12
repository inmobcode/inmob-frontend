"use client";

import { ArrowDown, Bell, Eye } from "lucide-react";
import { useRef } from "react";

import { AppWindow } from "@/components/landing/app-window";
import { MockProperties } from "@/components/landing/mocks";
import { Button } from "@/components/ui/button";
import { gsap, useGSAP } from "@/lib/gsap";
import { distance, duration, ease, media } from "@/lib/motion";

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(media.allowMotion, () => {
        gsap.from("[data-hero]", {
          opacity: 0,
          y: distance.lg,
          duration: duration.macro,
          ease: ease.out,
          stagger: 0.12,
        });
        gsap.from("[data-hero-window]", {
          opacity: 0,
          y: distance.lg * 2,
          duration: 1,
          ease: ease.out,
          delay: 0.4,
        });
        // The chips float around the window, each at its own pace.
        gsap.utils.toArray<HTMLElement>("[data-float]").forEach((chip, index) => {
          gsap.to(chip, {
            y: index % 2 ? 10 : -10,
            duration: 2.6 + index * 0.5,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
        });
        // The window drifts up a little slower than the page.
        gsap.to("[data-hero-window]", {
          yPercent: -4,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="producto" className="relative overflow-hidden px-4 pt-36 pb-20 sm:px-8 lg:px-14 md:pt-44">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[34rem] w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,oklch(0.9_0.12_125/0.35),transparent)] blur-2xl"
      />
      <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-7 text-center">
        <span
          data-hero
          className="inline-flex h-8 items-center rounded-full bg-primary/10 px-3.5 text-sm font-medium text-primary"
        >
          Para inmobiliarias que ya crecieron
        </span>
        <h1 data-hero className="font-display text-5xl leading-[1.02] tracking-tight text-balance sm:text-6xl md:text-7xl">
          Toda tu inmobiliaria, bajo control.
        </h1>
        <p data-hero className="max-w-2xl text-lg text-pretty text-muted-foreground md:text-xl">
          Propiedades, clientes, ofertas, reservas y cobros en un solo sistema. Con tu propio sitio web y un portal para
          cada propietario.
        </p>
        <div data-hero className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild variant="highlight" size="lg" className="h-12 rounded-full px-7 text-base">
            <a href="#demo">Pedir una demo</a>
          </Button>
          <Button asChild variant="ghost" size="lg" className="h-12 gap-2 rounded-full px-6 text-base">
            <a href="#flujo">
              Ver cómo funciona
              <ArrowDown />
            </a>
          </Button>
        </div>
      </div>

      <div className="relative mx-auto mt-16 max-w-[1500px]">
        <div data-hero-window>
          <AppWindow url="app.inmobiliario.com/properties">
            <MockProperties />
          </AppWindow>
        </div>

        <div
          data-float
          className="absolute top-10 -left-3 hidden items-center gap-3 rounded-2xl bg-card/90 p-3 pr-5 shadow-[0_24px_50px_-16px_oklch(0.3_0.05_160/0.4)] ring-1 ring-foreground/5 backdrop-blur-xl md:flex lg:-left-8"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-highlight text-highlight-foreground">
            <Bell className="size-4" />
          </span>
          <div className="text-left">
            <p className="text-sm font-medium">Nueva consulta</p>
            <p className="text-xs text-muted-foreground">Valentina Ríos · Casa en La Barra</p>
          </div>
        </div>
        <div
          data-float
          className="absolute -right-3 bottom-16 hidden items-center gap-3 rounded-2xl bg-card/90 p-3 pr-5 shadow-[0_24px_50px_-16px_oklch(0.3_0.05_160/0.4)] ring-1 ring-foreground/5 backdrop-blur-xl md:flex lg:-right-8"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Eye className="size-4" />
          </span>
          <div className="text-left">
            <p className="text-sm font-medium">Oferta vista</p>
            <p className="text-xs text-muted-foreground">Hace 5 minutos · vence el 30 de oct</p>
          </div>
        </div>
      </div>
    </section>
  );
}
