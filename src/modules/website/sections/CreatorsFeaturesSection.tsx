import Image from "next/image";

import { CREATOR_FEATURES } from "@/modules/website/data/content";

export function CreatorsFeaturesSection() {
  return (
    <section className="bg-white pt-[64px] lg:pt-[34px] lg:pb-[55px]">
      <div className="flex w-full flex-col items-center gap-[40px] lg:gap-[60px]">
        <div className="flex w-full max-w-[584px] flex-col items-center gap-5 text-center">
          <h2 className="text-[28px] font-medium leading-[1.2] tracking-[-0.8px] text-sd-black md:text-[40px]">
            The Course Builder
          </h2>
          <p className="max-w-[584px] text-[15px] leading-[1.4] tracking-[-0.32px] text-sd-grey-11 md:text-[16px]">
            SoluDeskss Course Creator Studio lets you build professional courses, ensures fair
            review, and automatically distributes to SoluDeskss, Udemy, and Coursera while you
            get paid without managing any of it yourself.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {CREATOR_FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="flex h-[320px] flex-col justify-between overflow-clip rounded-[16px] p-4 md:h-[380px] lg:h-[439px]"
              style={{ backgroundImage: feature.background }}
            >
              <Image
                src={feature.icon}
                alt=""
                width={56}
                height={56}
                className="h-14 w-14"
              />
              <div className="flex flex-col items-start gap-3">
                <h3 className="text-[24px] font-medium leading-none tracking-[-0.64px] text-sd-black md:text-[32px]">
                  {feature.title}
                </h3>
                <p className="text-[14px] leading-[1.5] tracking-[-0.28px] text-sd-grey-11">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}

          <div className="relative h-[320px] overflow-clip rounded-[16px] md:h-[380px] lg:h-[439px]">
            <Image
              src="/images/products/creators/features-card-3.png"
              alt="Global Reach"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
