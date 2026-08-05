import { BENEFITS } from "@/modules/website/data/content";

export function BenefitsSection() {
  return (
    <section className="bg-white py-[80px] lg:py-[120px]">
      <div className="flex w-full flex-col items-center gap-[60px]">
        <h2 className="max-w-[584px] text-center text-[28px] font-medium leading-[1.2] tracking-[-0.8px] text-sd-black md:text-[40px]">
          Designed to Give You The Best of Benefits As a Creators
        </h2>

        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((benefit) => (
            <div
              key={benefit.title}
              className="flex h-[161px] flex-col justify-between rounded-[16px] bg-sd-grey-3/80 p-4"
            >
              <benefit.icon variant="Bold" color={benefit.color} size={24} />
              <div>
                <p className="text-[16px] font-medium text-sd-black">{benefit.title}</p>
                <p className="mt-3 text-[14px] leading-[1.5] text-sd-grey-11">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
