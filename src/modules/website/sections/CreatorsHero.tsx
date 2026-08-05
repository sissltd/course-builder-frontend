import { Book1, Money, Profile2User, User } from "iconsax-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/shared/Button";
import { AuthRoute } from "@/lib/routes";

const STATS = [
  { icon: <User variant="Bold" color="#606060" size={16} />, value: "12,400+" },
  { icon: <Money variant="Bold" color="#606060" size={16} />, value: "$18,000" },
  { icon: <Book1 variant="Bold" color="#606060" size={16} />, value: "9,000+" },
];

const PARTNERS = [
  { src: "/assets/creators/soludesk-logo.png", alt: "SoluDesk", width: 120, height: 180 },
  { src: "/assets/creators/udemy-logo.png", alt: "Udemy", width: 120, height: 120 },
  { src: "/assets/creators/coursera-logo.png", alt: "Coursera", width: 120, height: 120 },
];

export function CreatorsHero() {
  return (
    <section className="relative overflow-hidden bg-[#FDFDFF]">
      <div className="flex w-full flex-col items-center gap-[60px] pb-[80px] pt-[92px] lg:flex-row lg:items-center lg:justify-between lg:gap-[60px]">
        <div className="flex w-full max-w-[65%] flex-col items-start gap-[67px]">
          <div className="flex w-full flex-col items-start gap-[32px]">
            <div className="flex h-[32px] items-center gap-2 rounded-full bg-[#F5F9FF] px-[10px]">
              <Profile2User variant="Bold" color="#0A60E1" size={16} />
              <span className="text-[14px] leading-4 text-[#0A60E1]">Creators</span>
            </div>

            <div className="flex w-full flex-col items-start gap-4">
              <h1 className="text-[34px] font-medium leading-[1.08] tracking-[-1.12px] text-sd-black md:text-[44px] lg:text-[56px] lg:leading-none">
                Build your ideas in the ideal marketplace
              </h1>
              <p className="max-w-[579px] text-[16px] leading-[1.4] tracking-[-0.32px] text-sd-grey-11">
                SoluDesks Course Creator Studio lets you build professional courses, ensures
                fair review, and automatically distributes to SoluDesks, Udemy, and Coursera
                while you get paid without you having to manage any of it yourself.
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col items-start gap-6">
            <div className="flex items-center gap-3">
              <Link href={AuthRoute.REGISTER}>
                <Button variant="app-primary" size="app" className="h-[44px] px-6 text-[14px]">
                  Create account
                </Button>
              </Link>
              <Link href={AuthRoute.LOGIN}>
                <Button variant="app-outline" size="app" className="h-[44px] px-6 text-[14px]">
                  Log in
                </Button>
              </Link>
            </div>

            <div className="flex w-full items-center gap-5">
              {STATS.map((stat) => (
                <span
                  key={stat.value}
                  className="flex items-center gap-1 text-[16px] leading-[1.4] tracking-[-0.32px] text-sd-grey-11"
                >
                  {stat.icon}
                  {stat.value}
                </span>
              ))}
            </div>
          </div>

          <div className="flex w-full items-center justify-between gap-[21px]">
            {PARTNERS.map((partner) => (
              <Image
                key={partner.src}
                src={partner.src}
                alt={partner.alt}
                width={partner.width}
                height={partner.height}
                className="object-contain"
              />
            ))}
          </div>
        </div>

        <div className="relative w-full max-w-[465px] lg:shrink-0">
          <Image
            src="/assets/creators/creators-hero.png"
            alt="Create a course form"
            width={465}
            height={517}
            className="h-auto w-full object-contain"
          />
        </div>
      </div>
    </section>
  );
}
