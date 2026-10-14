import { LandingFooter } from "@/components/landing/footer";
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

export default function Home() {
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
