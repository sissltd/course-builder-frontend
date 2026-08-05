import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/shared/Button";
import { AuthRoute } from "@/lib/routes";

export function SplitSection() {
  return (
    <section className="bg-white">
      <div className="flex w-full flex-col items-center gap-[60px] py-[80px] lg:py-[120px]">
        <div className="flex w-full items-center justify-center p-[10px]">
          <h2 className="max-w-[566px] text-center text-[28px] font-medium leading-[1.2] tracking-[-0.8px] text-sd-black md:text-[40px]">
            Designed to Give You The Best of Benefits As a Creators
          </h2>
        </div>

        <div className="grid w-full grid-cols-1 md:grid-cols-2">
        <div
          className="flex min-h-[300px] items-center justify-center overflow-hidden rounded-tl-[24px] rounded-tr-[24px] py-12 md:min-h-[424px] md:rounded-bl-[24px] md:rounded-tr-none md:py-0"
          style={{
            backgroundImage:
              "linear-gradient(177.624deg, #C3DEEF 2.7%, #F5F3F4 71.9%)",
          }}
        >
          <div className="flex max-w-[524px] flex-col items-start gap-[35px] px-6">
            <div className="flex flex-col items-start gap-4">
              <h3 className="max-w-[473px] text-[24px] font-medium leading-[1.2] tracking-[-0.64px] text-sd-black md:text-[32px]">
                A course builder that thinks the way you teach.
              </h3>
              <p className="max-w-[463px] text-[15px] leading-[1.4] tracking-[-0.32px] text-sd-grey-11 md:text-[16px]">
                Structure your course into modules and lessons, reorder everything by drag and
                drop, and watch your outline take shape in a navigation tree that always shows
                what&apos;s done, what&apos;s in progress, and what still needs work
              </p>
            </div>
            <Link href={AuthRoute.REGISTER}>
              <Button variant="app-primary" size="app" className="h-[44px] px-6 text-[14px]">
                Create account
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative h-[300px] w-full overflow-hidden md:h-[424px]">
          <Image
            src="/assets/website/split-showcase.png"
            alt="Course builder split screen showcase"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="rounded-bl-[24px] rounded-br-[24px] object-cover md:rounded-bl-none md:rounded-tr-[24px]"
          />
        </div>
        </div>
      </div>
    </section>
  );
}
