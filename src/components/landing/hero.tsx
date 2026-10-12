"use client";

import { useRef } from "react";

import {
  BookingFragment,
  InquiryFragment,
  OfferSeenFragment,
  PaymentFragment,
} from "@/components/landing/fragments";
import { gsap, useGSAP } from "@/lib/gsap";
import { ease, media } from "@/lib/motion";

/** One morning of one deal: the scene the hero plays once on load. */
const SCENE = [
  { time: "10:42", label: "Llega la consulta", fragment: <InquiryFragment /> },
  { time: "11:05", label: "Abre la oferta", fragment: <OfferSeenFragment /> },
  {
    time: "11:30",
    label: "Confirma la reserva",
    fragment: <BookingFragment />,
  },
  { time: "11:34", label: "Paga el anticipo", fragment: <PaymentFragment /> },
];

const MODULES = [
  "Propiedades",
  "Clientes",
  "Ofertas",
  "Reservas",
  "Cobros",
  "Sitio web",
  "Portal del propietario",
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  // The page's only unprompted motion: the deal plays out step by step while a
  // lime line runs down the rail. Without motion the whole scene is just there.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(media.allowMotion, () => {
        const steps = gsap.utils.toArray<HTMLElement>("[data-step]");
        const tl = gsap.timeline({ delay: 0.3 });
        tl.from(
          "[data-rail]",
          {
            scaleY: 0,
            transformOrigin: "top",
            duration: steps.length * 0.7,
            ease: "none",
          },
          0,
        );
        steps.forEach((step, index) => {
          tl.from(
            step,
            { opacity: 0, y: 14, duration: 0.5, ease: ease.out },
            index * 0.7,
          );
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      id="producto"
      data-nav-dark
      className="bg-forest text-paper"
    >
      <div className="mx-auto grid max-w-[1440px] gap-14 px-5 pt-32 pb-16 sm:px-8 md:pt-40 lg:grid-cols-12 lg:gap-8 lg:pb-24">
        <div className="flex flex-col gap-8 lg:col-span-7 lg:pr-10">
          <h1 className="font-logo text-[clamp(2.75rem,6.4vw,6rem)] leading-[0.98] font-semibold tracking-[-0.035em] text-balance">
            De la primera consulta{" "}
            <span className="text-paper/45">al último cobro.</span>
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-pretty text-paper/75">
            Propiedades, clientes, ofertas, reservas y cobros de tu agencia
            en un solo sistema. Con tu propio sitio web y un portal para cada
            propietario.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#demo"
              className="inline-flex h-12 items-center rounded-lg bg-lime px-6 text-base font-semibold text-forest-deep outline-none transition-[filter] hover:brightness-95 focus-visible:ring-2 focus-visible:ring-paper focus-visible:ring-offset-2 focus-visible:ring-offset-forest"
            >
              Pedir una demo
            </a>
            <a
              href="#flujo"
              className="inline-flex h-12 items-center rounded-sm px-1 text-base font-medium text-paper/85 underline-offset-4 outline-none transition-colors hover:text-paper hover:underline focus-visible:ring-2 focus-visible:ring-lime sm:ml-3"
            >
              Ver cómo funciona
            </a>
          </div>
        </div>

        <ol
          aria-label="Una reserva en Tivvo, paso a paso"
          className="relative flex flex-col gap-5 lg:col-span-5"
        >
          <span
            aria-hidden
            className="absolute top-2 bottom-2 left-[3.25rem] w-px bg-paper/15"
          />
          <span
            aria-hidden
            data-rail
            className="absolute top-2 bottom-2 left-[3.25rem] w-px bg-lime"
          />
          {SCENE.map((step) => (
            <li
              key={step.time}
              data-step
              className="relative grid grid-cols-[3.25rem_1fr] gap-x-5"
            >
              <span className="pt-0.5 text-xs text-paper/55 tabular-nums">
                {step.time}
              </span>
              <span
                aria-hidden
                className="absolute top-1.5 left-[3.25rem] size-2 -translate-x-1/2 rounded-full bg-lime"
              />
              <div className="flex min-w-0 flex-col gap-2">
                <p className="text-sm text-paper/80">{step.label}</p>
                {step.fragment}
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="border-t border-paper/10">
        {/* The 1px gaps over a lighter background draw the dividers between modules. */}
        <ul
          aria-label="Qué incluye"
          className="mx-auto grid max-w-[1440px] grid-cols-2 gap-px bg-paper/10 sm:grid-cols-4 lg:grid-cols-7"
        >
          {MODULES.map((module) => (
            <li
              key={module}
              className="bg-forest px-5 py-5 text-sm text-paper/70 sm:px-8 last:col-span-2 lg:last:col-span-1"
            >
              {module}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
