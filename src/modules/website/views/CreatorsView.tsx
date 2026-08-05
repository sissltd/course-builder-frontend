import Image from "next/image";

import { CreatorsHero } from "@/modules/website/sections/CreatorsHero";
import { CtaSection } from "@/modules/website/sections/CtaSection";
import { FaqSection } from "@/modules/website/sections/FaqSection";

const SECTIONS = [
  { src: "/assets/creators/features.png", alt: "Creators features" },
  { src: "/assets/creators/topics.png", alt: "Creator topic categories" },
  { src: "/assets/creators/create-course.png", alt: "Create a course form" },
  { src: "/assets/creators/wallet.png", alt: "Creator wallet dashboard" },
  { src: "/assets/creators/collaborators.png", alt: "Creator collaborators" },
];

export function CreatorsView() {
  return (
    <main>
      <CreatorsHero />
      {SECTIONS.map((section) => (
        <section key={section.src} className="bg-white">
          <div className="w-full">
            <Image
              src={section.src}
              alt={section.alt}
              width={1440}
              height={800}
              className="h-auto w-full object-contain"
            />
          </div>
        </section>
      ))}
      <FaqSection />
      <CtaSection />
    </main>
  );
}
