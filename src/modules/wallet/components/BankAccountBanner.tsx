"use client";

import React, { useState } from "react";
import { AppButton } from "@/components/shared/AppButton";
import { Bank } from "iconsax-react";
import { SetupAccountModal } from "./SetupAccountModal";

export const BankAccountBanner = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="w-full bg-[#FDFDFD] border border-[#F0F0F0] rounded-[16px] px-[24px] py-[20px] flex items-center justify-between gap-[16px] ">
        <div className="flex items-center gap-[16px]">
          {/* Icon container */}
          <div className="size-[48px] rounded-full bg-[#0063EF] flex items-center justify-center shrink-0">
            <Bank size={24} variant="Linear" color="#FFF" />
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
        <AppButton 
          variant="app-primary" 
          className="h-[40px] px-[24px] text-[14px] shrink-0"
          onClick={() => setIsOpen(true)}
        >
          Setup
        </AppButton>
      </div>

      <SetupAccountModal isOpen={isOpen} onOpenChange={setIsOpen} />
    </>
  );
};
