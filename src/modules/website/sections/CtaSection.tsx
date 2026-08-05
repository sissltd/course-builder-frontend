import { ArrowRight } from "iconsax-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/shared/Button";
import { AuthRoute } from "@/lib/routes";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-white py-[80px] lg:py-[120px]">
      <div className="absolute left-1/2 top-[214px] h-[602px] w-[1568px] -translate-x-1/2">
        <div
          className="h-full w-full rounded-[24px] blur-[23.6px]"
          style={{
            backgroundImage:
              "linear-gradient(179.8deg, #FFFFFF 6.3%, #0A60E1 55.6%, #6699FF 64.4%, rgba(255,80,37,0.77) 74.4%, #FFFFFF 96.2%)",
          }}
        />
      </div>

      <div className="relative flex w-full flex-col items-center">
        <h2 className="max-w-[555px] text-center text-[28px] font-medium leading-[1.2] tracking-[-0.8px] text-sd-black md:text-[40px]">
          Your expertise is worth more than a job title.
        </h2>
        <p className="mt-5 text-center text-[15px] leading-[1.4] tracking-[-0.32px] text-sd-grey-11 md:text-[16px]">
          Start your application today, and see what it becomes as a course
        </p>
        <Link href={AuthRoute.REGISTER} className="mt-8">
          <Button variant="app-primary" size="app" className="h-[44px] px-6 text-[14px]">
            Get started
            <ArrowRight variant="TwoTone" color="#FDFDFD" size={24} />
          </Button>
        </Link>
      </div>

      <div className="relative mx-auto mt-[80px] w-full max-w-[1200px]">
        <div className="relative">
          <Image
            src="/assets/dashboard/creator-courses.png"
            alt="Creator courses dashboard"
            width={1200}
            height={800}
            className="w-full object-contain"
          />
          <Image
            src="/assets/dashboard/course-detail.png"
            alt="Course details drawer"
            width={420}
            height={700}
            className="absolute -right-3 -top-1 hidden h-full w-auto object-contain md:block"
          />
        </div>
      </div>

      <div className="pointer-events-none absolute -right-[150px] bottom-[-150px] h-[462px] w-[462px] rounded-full bg-[#0A60E1]/10 blur-2xl" />
    </section>
  );
}
