import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/shared/Button";
import { AuthRoute } from "@/lib/routes";

export function HeroSection() {
  return (
    <section className="bg-[#FDFDFF]">
      <div className="flex w-full flex-col items-center pt-[40px]">
        <div className="flex h-[32px] items-center gap-2 rounded-full bg-[#F5F9FF] px-[10px]">
          <Image src="/assets/dashboard/profile-2user-bold.svg" alt="" width={16} height={16} className="size-4" />
          <span className="text-[14px] leading-4 text-[#0A60E1]">
            Become a creator on SoluDesks
          </span>
        </div>

        <h1 className="mt-4 max-w-[767px] text-center text-[34px] font-medium leading-[1.08] tracking-[-1.12px] text-sd-black md:text-[44px] lg:text-[56px] lg:leading-none">
          Turn What You Know Into A Course the World Can Take.
        </h1>

        <p className="mt-5 max-w-[579px] text-center text-[16px] leading-[1.4] tracking-[-0.32px] text-sd-grey-11">
          SoluDeskss Course Creator Studio lets you build professional courses, ensures fair
          review, and automatically distributes to SoluDeskss, Udemy, and Coursera while you get
          paid without you having to manage any of it yourself.
        </p>

        <div className="mt-10 flex items-center gap-3">
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
      </div>

      <div className="mt-[40px] flex w-full justify-center pb-[80px] lg:pb-[120px]">
        <Image
          src="/assets/dashboard/dashboard.png"
          alt="SoluDesks dashboard preview"
          width={1200}
          height={800}
          priority
          className="w-full object-contain"
        />
      </div>
    </section>
  );
}
