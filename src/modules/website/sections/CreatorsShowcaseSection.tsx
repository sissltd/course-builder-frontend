import Image from "next/image";

export function CreatorsShowcaseSection() {
  return (
    <section className="bg-white pt-[48px] lg:pt-[49px]">
      <div className="flex w-full flex-col items-center gap-6">
        <h2 className="w-full max-w-[496px] text-center text-[28px] font-medium leading-[1.2] tracking-[-0.8px] text-sd-black md:text-[40px]">
          Explore the Prowess of Building with AI
        </h2>
        <p className="w-full max-w-[472px] text-center text-[15px] leading-[1.4] tracking-[-0.32px] text-sd-grey-11 md:text-[16px]">
          Structure your course into modules and lessons, reorder everything by drag and drop,
          and watch your outline take shape in a navigation tree that always shows what&apos;s
          done, what&apos;s in progress, and what still needs work
        </p>
      </div>

      <div className="mt-[63px] w-full">
        <Image
          src="/images/products/creators/create-course-mockup.png"
          alt="Create a course with AI"
          width={1391}
          height={682}
          className="h-auto w-full object-contain"
        />
      </div>
    </section>
  );
}
