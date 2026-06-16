import React from "react";
import { AppButton } from "@/components/shared/AppButton";

export const BankAccountBanner = () => {
  return (
    <div className="w-full bg-[#FDFDFD] border border-[#F0F0F0] rounded-[16px] px-[24px] py-[20px] flex items-center justify-between gap-[16px] shadow-sm">
      <div className="flex items-center gap-[16px]">
        {/* Icon container */}
        <div className="size-[48px] rounded-full bg-[#0063EF] flex items-center justify-center shrink-0">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M2 8.5h20M6 16.5h2M10.5 16.5h4" stroke="#fff" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6.44 3.5h11.11c3.56 0 4.45.88 4.45 4.39v8.22c0 3.51-.89 4.39-4.44 4.39H6.44c-3.55 0-4.44-.88-4.44-4.39V7.89c0-3.51.89-4.39 4.44-4.39Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="flex flex-col gap-[4px]">
          <p className="text-[16px] font-semibold text-[#202020] tracking-[-0.32px] leading-[24px]">
            Setup your bank account
          </p>
          <p className="text-[14px] text-[#636363] leading-[20px]">
            Please kindly setup your bank account to enable you receive payment
          </p>
        </div>
      </div>
      <AppButton variant="app-primary" className="h-[40px] px-[24px] text-[14px] shrink-0">
        Setup
      </AppButton>
    </div>
  );
};
