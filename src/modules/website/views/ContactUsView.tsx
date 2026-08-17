import { ContactHero } from "@/modules/website/sections/ContactHero";
import { ContactVisitSection } from "@/modules/website/sections/ContactVisitSection";
import { ContactInfoCards } from "@/modules/website/sections/ContactInfoCards";
import { FaqSection } from "@/modules/website/sections/FaqSection";
import { CtaSection } from "@/modules/website/sections/CtaSection";

export function ContactUsView() {
  return (
    <main>
      <ContactHero />
      <ContactVisitSection />
      <ContactInfoCards />
      <FaqSection />
      <CtaSection />
    </main>
  );
}
