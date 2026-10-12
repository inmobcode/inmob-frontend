import { Hero } from "@/components/landing/hero";
import { LandingNav } from "@/components/landing/nav";
import {
  DemoForm,
  Faq,
  Flow,
  LandingFooter,
  Migration,
  OwnerSection,
  Plans,
  PortalSection,
  Problem,
  TeamSection,
} from "@/components/landing/sections";

export default function Home() {
  return (
    <>
      <LandingNav />
      <main className="flex-1 overflow-x-clip">
        <Hero />
        <Problem />
        <Flow />
        <TeamSection />
        <PortalSection />
        <OwnerSection />
        <Migration />
        <Plans />
        <Faq />
        <DemoForm />
      </main>
      <LandingFooter />
    </>
  );
}
