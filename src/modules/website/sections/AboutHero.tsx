import { People } from "iconsax-react";
import Image from "next/image";

export function AboutHero() {
  return (
    <section className="bg-[#FDFDFF]">
      <div className="flex w-full flex-col items-start pb-[80px] pt-[92px] lg:pb-[120px]">
        <div className="flex w-full max-w-[767px] flex-col items-start gap-[16px]">
          <div className="flex h-[32px] items-center gap-2 rounded-full bg-[#F5F9FF] px-[10px]">
            <People variant="Bold" color="#0A60E1" size={16} />
            <span className="text-[14px] leading-4 text-[#0A60E1]">Who we are</span>
          </div>

          <h1 className="text-[34px] font-medium leading-[1.08] tracking-[-1.12px] text-sd-black md:text-[44px] lg:text-[56px] lg:leading-none">
            We exist to help experts turn what they know into courses the world can take.
          </h1>
          <p className="max-w-[579px] text-[16px] leading-[1.4] tracking-[-0.32px] text-sd-grey-11">
            SoluDeskss Course Creator Studio lets you build professional courses, ensures fair
            review, and automatically distributes to SoluDeskss, Udemy, and Coursera while you
            get paid without you having to manage any of it yourself.
          </p>
        </div>

        <div className="mt-[80px] w-full overflow-hidden rounded-[24px]">
          <Image
            src="/assets/about/hero.png"
            alt="About SoluDesks"
            width={1200}
            height={479}
            className="h-auto w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
