import { BenefitsSection } from "@/modules/website/sections/BenefitsSection";
import { CtaSection } from "@/modules/website/sections/CtaSection";
import { DarkShowcaseSection } from "@/modules/website/sections/DarkShowcaseSection";
import { FaqSection } from "@/modules/website/sections/FaqSection";
import { FeaturesSection } from "@/modules/website/sections/FeaturesSection";
import { HeroSection } from "@/modules/website/sections/HeroSection";
import { HowItWorksSection } from "@/modules/website/sections/HowItWorksSection";
import { SplitSection } from "@/modules/website/sections/SplitSection";
import { StatsSection } from "@/modules/website/sections/StatsSection";
import { TestimonialsSection } from "@/modules/website/sections/TestimonialsSection";

export function HomeView() {
  return (
    <main>
      <HeroSection />
      <StatsSection />
      <BenefitsSection />
      <FeaturesSection />
      <DarkShowcaseSection />
      <SplitSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
    </main>
  );
}
