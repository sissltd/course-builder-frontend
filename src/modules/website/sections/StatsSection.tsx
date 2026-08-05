import { STATS } from "@/modules/website/data/content";

export function StatsSection() {
  return (
    <section className="bg-white pb-[80px] pt-[80px] lg:pt-[120px]">
      <div className="flex w-full flex-col items-center gap-[80px]">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-[50px]">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex w-[173px] flex-col items-center gap-3">
              <p className="text-[36px] font-medium leading-[1.3] tracking-[-0.96px] text-sd-black md:text-[48px]">
                {stat.value}
              </p>
              <p className="text-[14px] leading-[1.4] tracking-[-0.32px] text-sd-grey-11 md:text-[16px]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="h-px w-full max-w-[955px] bg-sd-grey-5" />
      </div>
    </section>
  );
}
