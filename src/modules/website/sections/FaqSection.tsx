"use client";

import { Add, ArrowRight, Minus } from "iconsax-react";
import { useState } from "react";

import { Button } from "@/components/shared/Button";
import { FAQS } from "@/modules/website/data/content";
import { cn } from "@/lib/utils";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(1);

  return (
    <section className="bg-white py-[80px] lg:py-[120px]">
      <div className="mx-auto flex w-full max-w-[713px] flex-col items-center gap-[60px]">
        <h2 className="text-[28px] font-medium leading-[1.2] tracking-[-0.8px] text-sd-black md:text-[40px]">
          Frequently asked questions
        </h2>

        <div className="flex w-full max-w-[583px] flex-col gap-2">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="w-full rounded-[24px] bg-sd-grey-3/80 px-[31px] py-4"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 text-left"
                >
                  <span className="text-[15px] font-medium leading-[1.4] tracking-[-0.32px] text-sd-black md:text-[16px]">
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <Minus variant="Linear" color="#202020" size={24} />
                  ) : (
                    <Add variant="Linear" color="#202020" size={24} />
                  )}
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-300",
                    isOpen ? "mt-5 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="text-[15px] leading-[1.4] tracking-[-0.32px] text-sd-grey-11 md:text-[16px]">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex w-full flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-center sm:gap-[28px]">
          <p className="text-center text-[18px] font-medium leading-[1.2] tracking-[-0.48px] text-sd-black md:text-[24px]">
            Can&apos;t Find Your Answers?
          </p>
          <a href="mailto:support@soludesk.com" className="w-full sm:w-auto">
            <Button
              variant="app-primary"
              size="app"
              className="h-[48px] w-full px-6 text-[14px] sm:w-[248px]"
            >
              Chat with a representative
              <ArrowRight variant="TwoTone" color="#FDFDFD" size={24} />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
