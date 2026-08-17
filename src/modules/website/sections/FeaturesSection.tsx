import { InfoCircle, SearchNormal } from "iconsax-react";
import Image from "next/image";

import { cn } from "@/lib/utils";

function FeatureText({ heading, description }: { heading: string; description: string }) {
  return (
    <div className="flex max-w-[547px] flex-col items-start gap-5 px-4">
      <h3 className="text-[24px] font-medium leading-[1.2] tracking-[-0.64px] text-sd-black md:text-[32px]">
        {heading}
      </h3>
      <p className="text-[15px] leading-[1.4] tracking-[-0.32px] text-sd-grey-11 md:text-[16px]">
        {description}
      </p>
    </div>
  );
}

function CourseOutlineVisual() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute left-[32px] top-[89px] h-[128px] w-[440px]">
        <Image
          src="/assets/website/ellipse-blue.svg"
          alt=""
          fill
          sizes="440px"
          className="object-cover"
        />
      </div>
      <div className="absolute left-[75px] top-[51px] h-[609px] w-[720px]">
        <Image
          src="/assets/website/course-outline.png"
          alt="Course outline builder view"
          fill
          sizes="720px"
          className="object-cover object-top-left"
        />
      </div>
    </div>
  );
}

function AiBuildingVisual() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-white">
      <Image
        src="/assets/website/ellipse-feature.svg"
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 600px"
        className="object-cover opacity-40"
      />
      <Image
        src="/assets/dashboard/landing-loader.png"
        alt="AI course builder"
        width={456}
        height={400}
        className="relative z-10 w-full max-w-[456px] object-contain"
      />
    </div>
  );
}

const PRICING_ROWS = [
  "Frontend Development",
  "Rust Development",
  "Mobile App Development",
  "Software Architecture Design",
  "Data Science",
];

function PricingModalVisual() {
  return (
    <div className="relative flex h-full w-full items-center overflow-hidden bg-white">
      <div className="absolute left-1/2 top-[47px] w-[90%] max-w-[571px] -translate-x-1/2 rounded-[10px] border border-[#F0F0F0] bg-[#FDFDFD] p-4 shadow-sm">
        <div className="flex h-[44px] items-center justify-between rounded-[8px] border border-[#F0F0F0] px-3">
          <span className="flex items-center gap-2 text-[14px] text-sd-grey-11">
            <SearchNormal variant="Linear" color="#606060" size={18} />
            Search
          </span>
        </div>
        <p className="mt-[15px] flex items-center gap-2 text-[14px] text-sd-grey-11">
          <InfoCircle variant="Linear" color="#606060" size={18} />
          NB: Prices differ depending on the course topic
        </p>
        <ul className="mt-4 flex flex-col">
          {PRICING_ROWS.map((row) => (
            <li key={row} className="flex h-[40px] items-center justify-between px-3">
              <span className="text-[14px] text-sd-grey-11">{row}</span>
              <span className="flex h-6 items-center rounded-[6px] bg-[#EAF3FF] px-1 text-[12px] leading-4 text-[#0A60E1]">
                $25
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const ROWS = [
  {
    text: {
      heading: "A course builder that thinks the way you teach.",
      description:
        "Structure your course into modules and lessons, reorder everything by drag and drop, and watch your outline take shape in a navigation tree that always shows what's done, what's in progress, and what still needs work",
    },
    visual: <CourseOutlineVisual />,
    visualFirst: false,
  },
  {
    text: {
      heading: "Build Course with Our AI Intelligence.",
      description:
        "Describe what you want to teach and our AI drafts your course structure, lessons, and learning objectives in seconds — so you start from a finished outline instead of a blank page.",
    },
    visual: <AiBuildingVisual />,
    visualFirst: true,
  },
  {
    text: {
      heading: "Know your price before you write a single word.",
      description:
        "Once your course is approved, payment is credited to your creator wallet automatically, and you can withdraw by bank transfer or mobile money whenever you're ready",
    },
    visual: <PricingModalVisual />,
    visualFirst: false,
  },
];

export function FeaturesSection() {
  return (
    <section className="bg-white py-[80px] lg:py-[120px]">
      <div className="flex w-full flex-col items-center gap-[60px]">
        <div className="flex max-w-[584px] flex-col items-center gap-5 text-center">
          <h2 className="text-[28px] font-medium leading-[1.2] tracking-[-0.8px] text-sd-black md:text-[40px]">
            The Course Builder
          </h2>
          <p className="text-[16px] leading-[1.4] tracking-[-0.32px] text-sd-grey-11">
            SoluDeskss Course Creator Studio lets you build professional courses, ensures fair
            review, and automatically distributes to SoluDeskss, Udemy, and Coursera while you get
            paid without you having to manage any of it yourself.
          </p>
        </div>

        <div className="w-full">
          {ROWS.map((row, index) => {
            const isLast = index === ROWS.length - 1;
            return (
              <div
                key={row.text.heading}
                className={cn(
                  "grid min-h-[356px] grid-cols-1 md:grid-cols-2",
                  !isLast && "shadow-[inset_0_-1px_0_0_rgba(32,32,32,0.05)]"
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center",
                    !row.visualFirst && "md:order-1 md:shadow-[inset_-1px_0_0_0_rgba(32,32,32,0.05)]",
                    row.visualFirst && "md:order-2"
                  )}
                >
                  <FeatureText {...row.text} />
                </div>
                <div
                  className={cn(
                    "relative flex w-full items-center justify-center overflow-hidden",
                    row.visualFirst && "md:order-1 md:shadow-[inset_-1px_0_0_0_rgba(32,32,32,0.05)]",
                    !row.visualFirst && "md:order-2"
                  )}
                >
                  {row.visual}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
