import { LandingFooter } from "@/components/landing/footer";
import type { Metadata } from "next";

import { Hero } from "@/components/landing/hero";
import { LandingNav } from "@/components/landing/nav";
import {
  DemoForm,
  Flow,
  Migration,
  PlansAndFaq,
  Portals,
  Problem,
  TeamSection,
} from "@/components/landing/sections";

export const metadata: Metadata = {
  title: "Tivvo para inmobiliarias",
  description: "Sistema de gestión para agencias de venta y alquiler temporario.",
};

export default function ForAgenciesPage() {
  return (
    <div className="landing flex flex-1 flex-col">
      <LandingNav />
      <main className="flex-1 overflow-x-clip">
        <Hero />
        <Problem />
        <Flow />
        <TeamSection />
        <Portals />
        <Migration />
        <PlansAndFaq />
        <DemoForm />
      </main>
      <LandingFooter />
    </div>
  );
}
