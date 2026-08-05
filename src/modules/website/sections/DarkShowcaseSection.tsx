import Image from "next/image";

export function DarkShowcaseSection() {
  return (
    <section className="bg-white">
      <div className="flex w-full flex-col items-center gap-[60px] py-[80px] lg:py-[120px]">
        <div className="flex w-full items-center justify-center p-[10px]">
          <h2 className="max-w-[584px] text-center text-[28px] font-medium leading-[1.2] tracking-[-0.8px] text-sd-black md:text-[40px]">
            Designed to Give You The Best of Benefits As a Creators
          </h2>
        </div>

        <div className="relative min-h-[424px] w-full overflow-hidden rounded-[24px] bg-[#0D0D0D]">
          <div className="absolute left-[577px] top-[-85px] hidden size-[695px] rounded-full bg-[#0A60E1] blur-[75px] lg:block" />
          <div className="absolute left-[423px] top-[298px] hidden h-[609px] w-[684px] rounded-full bg-[#FF6B00] blur-[154px] lg:block" />
          <div className="absolute right-0 top-0 hidden h-[547px] w-[627px] overflow-hidden lg:block">
            <img
              src="/assets/website/iphone.png"
              alt="Course builder on iPhone"
              style={{
                position: "absolute",
                height: "223.66%",
                width: "247.52%",
                left: "-55.94%",
                top: "-19.48%",
                maxWidth: "none",
              }}
            />
          </div>
          <div className="absolute left-[calc(50%-529px)] top-[378px] hidden h-[10px] w-[34px] lg:block">
            <Image
              src="/assets/website/phone-dots.svg"
              alt=""
              fill
              sizes="34px"
              className="object-cover"
            />
          </div>

          <div className="relative flex flex-col items-start gap-5 px-6 py-16 text-left lg:absolute lg:left-[30px] lg:top-1/2 lg:w-[547px] lg:-translate-y-1/2 lg:px-0 lg:py-0">
            <h3 className="max-w-[401px] text-[24px] font-medium leading-[1.2] tracking-[-0.64px] text-[#FDFDFF] md:text-[32px]">
              Designed to give you creative freedom
            </h3>
            <p className="w-full text-[15px] leading-[1.4] tracking-[-0.32px] text-[#FDFDFF] md:text-[16px]">
              Structure your course into modules and lessons, reorder everything by drag and
              drop, and watch your outline take shape in a navigation tree that always shows
              what&apos;s done, what&apos;s in progress, and what still needs work
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
