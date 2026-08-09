import { AboutHero } from "@/modules/website/sections/AboutHero";
import { AboutStory } from "@/modules/website/sections/AboutStory";
import { AboutValues } from "@/modules/website/sections/AboutValues";
import { CtaSection } from "@/modules/website/sections/CtaSection";
import { FaqSection } from "@/modules/website/sections/FaqSection";

export function AboutView() {
  return (
    <main>
      <AboutHero />
      <AboutValues />
      <AboutStory />
      <FaqSection />
      <CtaSection />
    </main>
  );
}
