import Image from "next/image";

import { CREATOR_TOPICS } from "@/modules/website/data/content";

export function CreatorsTopicsSection() {
  return (
    <section className="relative overflow-hidden bg-white lg:h-[686px] lg:pt-[86px]">
      <Image
        src="/images/products/creators/topics-bg.svg"
        alt=""
        width={750}
        height={540}
        className="pointer-events-none absolute left-[-36px] top-[109px] hidden h-auto w-[750px] max-w-none lg:block"
      />

      <div className="flex w-full flex-col gap-10 pt-[48px] lg:gap-0 lg:pt-0">
        <h2 className="w-full max-w-[426px] text-[28px] font-medium leading-[1.2] tracking-[-0.8px] text-sd-black md:text-[40px]">
          Build courses across different professions
        </h2>

        <div className="mt-0 flex w-full flex-col items-center gap-10 lg:mt-[63px] lg:flex-row lg:items-center lg:gap-[77px]">
          <div className="relative w-full max-w-[600px] shrink-0 overflow-hidden border-b border-r border-[#F0F0F0]">
            <Image
              src="/images/products/creators/topics-illustration.png"
              alt="A course being built"
              width={600}
              height={356}
              className="h-auto w-full object-cover"
            />
          </div>

          <div className="relative hidden h-[348.63px] w-[511.55px] shrink-0 items-center justify-center lg:flex ml-20">
            <div className="-rotate-[15deg] skew-x-[15deg] scale-y-[0.97]">
              <div className="relative h-[348.63px] w-[511.55px]">
                {CREATOR_TOPICS.map((topic) => (
                  <div
                    key={topic.label}
                    className="absolute flex items-center justify-center rounded-[24px] border border-[#F0F0F0] px-3 py-2"
                    style={{ left: topic.left, top: topic.top, gap: topic.gap }}
                  >
                    <Image src={topic.dot} alt="" width={8} height={8} className="size-2" />
                    <span className="whitespace-nowrap text-[14px] leading-5 tracking-[-0.28px] text-sd-black">
                      {topic.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex w-full flex-wrap gap-2 lg:hidden">
            {CREATOR_TOPICS.map((topic) => (
              <span
                key={topic.label}
                className="flex items-center gap-2 rounded-full border border-[#F0F0F0] px-3 py-2 text-[13px] leading-5 text-sd-black"
              >
                <span className="size-2 rounded-full bg-[#0A60E1]" />
                {topic.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <Image
        src="/images/products/creators/topics-ellipse.svg"
        alt=""
        width={546}
        height={498}
        className="pointer-events-none absolute left-[865px] top-[387px] hidden h-auto w-[546px] max-w-none lg:block"
      />
    </section>
  );
}
