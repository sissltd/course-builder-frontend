"use client";

import React, { useState } from "react";
import { Bank, Mobile } from "iconsax-react";
import { Button } from "@/components/shared/Button";
import { AddPayoutAccount } from "./AddPayoutAccount";

export const PaymentTab = () => {
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);

  return (
    <div className="flex flex-col gap-[32px]">
      <div className="flex flex-col gap-[8px]">
        <h2 className="text-[24px] font-semibold text-[#202020] tracking-[-0.48px] leading-[32px]">Payout accounts</h2>
        <p className="text-[16px] text-[#636363] leading-[24px]">Configure and select how you want to receive payments</p>
      </div>

      <div className="flex flex-col gap-[24px]">
        {/* Local account */}
        <div className="flex flex-col gap-[8px]">
          <p className="text-[14px] font-medium text-[#606060]">Local account</p>
          <div className="p-[20px] border border-[#0063EF] rounded-[12px] flex items-center justify-between bg-white">
            <div className="flex items-center gap-[12px]">
              <div className="size-[48px] rounded-full bg-[#0063EF] flex items-center justify-center text-white shrink-0">
                <Bank size={24} variant="Bold" color="#FFFFFF" />
              </div>
              <div className="flex flex-col">
                <span className="text-[16px] font-semibold text-[#202020] leading-[24px]">Osaite Emmanuel</span>
                <span className="text-[14px] text-[#606060] leading-[20px]">Access Bank - 1234567890</span>
              </div>
            </div>
            <button className="bg-[#FFF0ED] text-[#FF5025] hover:bg-[#FFE5E0] px-[12px] py-[6px] rounded-[6px] text-[14px] font-medium transition-colors">
              Remove
            </button>
          </div>
        </div>

        {/* Mobile Money */}
        <div className="flex flex-col gap-[8px]">
          <p className="text-[14px] font-medium text-[#606060]">Mobile Money</p>
          <div className="p-[20px] border border-[#F0F0F0] rounded-[12px] flex items-center justify-between bg-white">
            <div className="flex items-center gap-[12px]">
              <div className="size-[48px] rounded-full bg-[#FFCC00] flex items-center justify-center text-black font-sans font-bold text-[14px] shrink-0">
                mtn
              </div>
              <div className="flex flex-col">
                <span className="text-[16px] font-semibold text-[#202020] leading-[24px]">Osaite Emmanuel</span>
                <span className="text-[14px] text-[#606060] leading-[20px]">1234567890</span>
              </div>
            </div>
            <button className="bg-[#FFF0ED] text-[#FF5025] hover:bg-[#FFE5E0] px-[12px] py-[6px] rounded-[6px] text-[14px] font-medium transition-colors">
              Remove
            </button>
          </div>
        </div>
      </div>

      <div>
        <Button 
          variant="app-outline" 
          className="text-[#0063EF] border-[#0063EF] font-medium h-[40px] px-[16px] hover:bg-[#F4F9FF]"
          onClick={() => setIsAddAccountOpen(true)}
        >
          + Add account
        </Button>
      </div>

      <AddPayoutAccount 
        isOpen={isAddAccountOpen} 
        onOpenChange={setIsAddAccountOpen} 
        onSuccess={() => console.log("Account added")}
      />
    </div>
  );
};
