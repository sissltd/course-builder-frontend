import { Book1, Money, Profile2User, User } from "iconsax-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/shared/Button";
import { AuthRoute } from "@/lib/routes";

const STATS = [
  { icon: <User variant="Bold" color="#606060" size={16} />, value: "12,400+" },
  { icon: <Money variant="Bold" color="#606060" size={16} />, value: "₦18,000" },
  { icon: <Book1 variant="Bold" color="#606060" size={16} />, value: "9,000+" },
];

const PARTNERS = [
  { src: "/images/products/creators/SoluDesks-logo.png", alt: "SoluDesks", width: 140, height: 36, className: "h-[36px] w-[140px] shrink-0 object-bottom" },
  { src: "/images/products/creators/udemy-logo.png", alt: "Udemy", width: 97, height: 36, className: "h-[36px] w-[97px] shrink-0 object-cover" },
  { src: "/images/products/creators/coursera-logo.png", alt: "Coursera", width: 163, height: 36, className: "h-[36px] w-[163px] shrink-0 object-bottom" },
];

export function CreatorsHero() {
  return (
    <section className="relative overflow-hidden bg-[#FDFDFF]">
      <div className="flex w-full flex-col items-center gap-[60px] pb-[80px] pt-[92px] lg:flex-row lg:items-start lg:justify-between lg:gap-[60px]">
        <div className="flex w-full max-w-[65%] flex-col items-start gap-[67px] lg:pl-[120px]">
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
                SoluDeskss Course Creator Studio lets you build professional courses, ensures
                fair review, and automatically distributes to SoluDeskss, Udemy, and Coursera
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

          <div className="flex items-center gap-[21px]">
            {PARTNERS.map((partner) => (
              <Image
                key={partner.src}
                src={partner.src}
                alt={partner.alt}
                width={partner.width}
                height={partner.height}
                className={partner.className}
              />
            ))}
          </div>
        </div>

        <div className="relative w-full max-w-[465px] lg:absolute lg:left-[calc(50%+137px)] lg:top-[186px]">
          <div className="relative h-[517.464px] w-[464.956px]">
            <div className="absolute left-[273px] top-[-85px] h-[482px] w-[119px]">
              <Image
                src="/images/products/creators/hero-ellipse-28.svg"
                alt=""
                width={119}
                height={482}
                className="size-full"
              />
            </div>

            <div className="relative h-[517.464px] w-[464.956px] overflow-clip rounded-[12px] bg-[#fdfdfd]">
              <div className="absolute left-[24px] top-[17px] h-[7px] w-[25px]">
                <Image
                  src="/images/products/creators/hero-dots.svg"
                  alt=""
                  width={25}
                  height={7}
                  className="size-full"
                />
              </div>

              <div className="flex flex-col items-center gap-[32px] px-[24px] pt-[47px]">
                <div className="flex w-[364.42px] flex-col items-center gap-[13.343px] text-center">
                  <div className="w-full font-quicksand text-[26.685px] font-bold leading-[33.356px] text-[#202020]">
                    Enter a title for your course
                  </div>
                  <p className="w-full text-[13.343px] leading-[20.014px] tracking-[-0.2669px] text-[#636363]">
                    Enter the required information to create your course
                  </p>
                </div>

                <div className="flex w-full flex-col gap-[33.356px]">
                  <div className="flex w-full flex-col gap-[5.003px]">
                    <div className="flex w-full items-start gap-[1.668px] whitespace-nowrap text-[11.67px] leading-[16.678px]">
                      <span className="text-[#202020]">Course title</span>
                      <span className="font-medium text-[#ff5025]">*</span>
                    </div>
                    <div className="flex h-[36.692px] w-full items-center gap-[8.339px] rounded-[8px] border-[1.251px] border-[#d9d9d9] px-[13.343px] py-[10.007px]">
                      <span className="text-[11.67px] leading-[16.678px] text-[#202020]">
                        Computer appreciation
                      </span>
                    </div>
                  </div>

                  <div className="flex w-full flex-col gap-[5.003px]">
                    <div className="flex w-full items-start gap-[1.668px] whitespace-nowrap text-[11.67px] leading-[16.678px]">
                      <span className="text-[#202020]">Discription</span>
                      <span className="font-medium text-[#ff5025]">*</span>
                    </div>
                    <div className="flex w-full items-center gap-[8.339px] rounded-[8px] border-[1.251px] border-[#d9d9d9] px-[13.343px] py-[10.007px]">
                      <span className="text-[11.67px] leading-[16.678px] text-[#202020]">
                        Dive into the world of technology and innovation with this comprehensive
                        Computer Science course. You’ll explore the foundations of computing—from
                        algorithms and data structures to software development, artificial
                        intelligence, and cybersecurity. Designed for both beginners and aspiring
                        professionals, this course equips you with the analytical and
                        problem‑solving skills needed to build intelligent systems, design
                        efficient programs, and understand how technology shapes our modern world.
                      </span>
                    </div>
                    <p className="w-full text-[10.01px] leading-[13.343px] text-[#636363]">
                      450/500 words
                    </p>
                  </div>

                  <div className="flex w-full items-start gap-[13.343px]">
                    <Button
                      variant="app-outline"
                      size="app"
                      className="h-[37.014px] w-[201.807px] border-[0.834px] px-[20.014px] py-[10.007px] text-[11.67px] leading-[16.678px]"
                    >
                      Back
                    </Button>
                    <Button
                      variant="app-primary"
                      size="app"
                      className="h-[37.014px] w-[201.807px] px-[20.014px] py-[10.007px] text-[11.67px] leading-[16.678px]"
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute left-[226px] top-[218px] flex w-[290px] flex-col gap-[7px] overflow-clip rounded-[12px] border border-[#0063ef] bg-[#fdfdfd] px-[12px] pb-[8px] pt-[12px] shadow-[0px_9px_19px_0px_rgba(0,0,0,0.1)]">
              <p className="h-[31px] w-full text-[12px] leading-[16px] text-[#b6b6b6]">
                Describe what you want
              </p>
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-[13px]">
                  <Image
                    src="/images/products/creators/hero-copy-icon.svg"
                    alt=""
                    width={20}
                    height={20}
                  />
                  <Image
                    src="/images/products/creators/hero-stop-circle-icon.svg"
                    alt=""
                    width={20}
                    height={20}
                  />
                  <Image
                    src="/images/products/creators/hero-forward-5s-icon.svg"
                    alt=""
                    width={20}
                    height={20}
                  />
                </div>
                <div
                  className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[8px]"
                  style={{
                    backgroundImage:
                      "linear-gradient(74.27052526487216deg, rgb(0, 99, 239) 7.0533%, rgb(250, 133, 0) 98.158%)",
                  }}
                >
                  <div className="rotate-90">
                    <Image
                      src="/images/products/creators/hero-send-arrow-icon.svg"
                      alt=""
                      width={20}
                      height={20}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
