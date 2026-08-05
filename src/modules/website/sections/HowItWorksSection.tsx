import Image from "next/image";

import { STEPS } from "@/modules/website/data/content";

export function HowItWorksSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute right-[-350px] top-[22px] hidden h-[562px] w-[1090px] lg:block">
        <Image
          src="/assets/website/vector-steps-1.svg"
          alt=""
          fill
          sizes="1090px"
          className="object-contain"
        />
      </div>
      <div className="absolute left-[-240px] top-[250px] hidden h-[323px] w-[651px] lg:block">
        <Image
          src="/assets/website/vector-steps-2.svg"
          alt=""
          fill
          sizes="651px"
          className="object-contain"
        />
      </div>

      <div className="relative flex w-full flex-col items-center gap-[60px] py-[80px] lg:py-[120px]">
        <div className="flex max-w-[579px] flex-col items-center gap-4 text-center">
          <h2 className="text-[28px] font-medium leading-[1.2] tracking-[-0.8px] text-sd-black md:text-[40px]">
            Setting Up Your Account in Seconds
          </h2>
          <p className="text-[15px] leading-[1.4] tracking-[-0.32px] text-sd-grey-11 md:text-[16px]">
            Setting up your account and getting things done is easier than you think
          </p>
        </div>

        <div className="flex w-full flex-col gap-4 rounded-[24px] bg-sd-grey-3/80 p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.slice(0, 4).map((step) => (
              <div
                key={step.number}
                className="flex min-h-[177px] flex-col gap-6 rounded-[16px] bg-white p-4"
              >
                <step.icon variant="Bold" color="#0A60E1" size={24} />
                <div>
                  <p className="text-[16px] font-medium leading-[1.4] text-sd-black">
                    {step.number} {step.title}
                  </p>
                  <p className="mt-3 text-[14px] leading-[1.5] text-sd-grey-11">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.slice(4, 6).map((step) => (
              <div
                key={step.number}
                className="flex min-h-[171px] flex-col gap-6 rounded-[16px] bg-white p-4"
              >
                <step.icon variant="Bold" color="#0A60E1" size={24} />
                <div>
                  <p className="text-[16px] font-medium leading-[1.4] text-sd-black">
                    {step.number} {step.title}
                  </p>
                  <p className="mt-3 text-[14px] leading-[1.5] text-sd-grey-11">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
            <div className="flex min-h-[171px] flex-col gap-6 rounded-[16px] bg-white p-4 lg:col-span-2">
              {(() => {
                const StepIcon = STEPS[6].icon;
                return <StepIcon variant="Bold" color="#0A60E1" size={24} />;
              })()}
              <div>
                <p className="text-[16px] font-medium leading-[1.4] text-sd-black">
                  {STEPS[6].number} {STEPS[6].title}
                </p>
                <p className="mt-3 text-[14px] leading-[1.5] text-sd-grey-11">
                  {STEPS[6].description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
