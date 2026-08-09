import { CreatorsCollaboratorsSection } from "@/modules/website/sections/CreatorsCollaboratorsSection";
import { CreatorsFeaturesSection } from "@/modules/website/sections/CreatorsFeaturesSection";
import { CreatorsHero } from "@/modules/website/sections/CreatorsHero";
import { CreatorsShowcaseSection } from "@/modules/website/sections/CreatorsShowcaseSection";
import { CreatorsTopicsSection } from "@/modules/website/sections/CreatorsTopicsSection";
import { CreatorsWalletSection } from "@/modules/website/sections/CreatorsWalletSection";
import { CtaSection } from "@/modules/website/sections/CtaSection";
import { FaqSection } from "@/modules/website/sections/FaqSection";

export function CreatorsView() {
  return (
    <main>
      <CreatorsHero />
      <CreatorsFeaturesSection />
      <CreatorsTopicsSection />
      <CreatorsShowcaseSection />
      <CreatorsWalletSection />
      <CreatorsCollaboratorsSection />
      <FaqSection />
      <CtaSection />
    </main>
  );
}
