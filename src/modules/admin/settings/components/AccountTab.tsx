"use client";

import React from "react";
import { Trash, ArrowDown2 } from "iconsax-react";

export const AccountTab = () => {
  return (
    <div className="flex flex-col gap-[40px] w-full">
      <div className="flex items-start justify-between w-full">
        <div className="flex flex-col gap-[14px]">
          <div className="flex gap-[10px] items-center">
            <div className="bg-[#202020] size-[56px] rounded-full flex items-center justify-center shrink-0">
              <span className="text-[20px] font-normal text-[#F2F2F2] leading-[28px]">OE</span>
            </div>
            <div className="flex gap-[10px] items-center">
              <div className="border border-[#F0F0F0] px-[8px] py-[4px] rounded-[8px] cursor-pointer hover:bg-sd-grey-1 transition-colors">
                <span className="text-[12px] font-medium text-[#202020] leading-[16px]">Upload</span>
              </div>
              <div className="bg-[#F0F0F0] p-[4px] rounded-[8px] cursor-pointer hover:bg-sd-grey-2 transition-colors">
                <Trash variant="Linear" size={18} color="#202020" />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-[6px]">
            <div className="flex gap-[6px] items-start">
              <span className="text-[16px] font-normal text-[#202020] tracking-[-0.32px] leading-[24px]">Osaite Emmanuel</span>
              <div className="bg-[#FCF5E8] px-[8px] py-[4px] rounded-[6px]">
                <span className="text-[12px] font-medium text-[#B77815] leading-[16px]">Unavailable</span>
              </div>
            </div>
            <span className="text-[14px] font-normal text-[#606060] tracking-[-0.28px] leading-[20px]">Member since 25 April, 2026</span>
          </div>
        </div>
        <div className="bg-[#E6E6E6] px-[12px] py-[8px] rounded-[6px] h-[40px] flex items-center opacity-0">
          <span className="text-[14px] font-normal text-[#202020] tracking-[-0.28px] leading-[20px]">Account Not verified</span>
        </div>
      </div>

      <div className="border border-[#F0F0F0] p-[16px] rounded-[12px] w-full">
        <div className="flex items-center justify-between w-full">
          <span className="text-[16px] font-normal text-[#202020] tracking-[-0.32px] leading-[24px]">Role</span>
          <div className="border border-[#D9D9D9] flex gap-[8px] h-[44px] items-center px-[24px] py-[12px] rounded-[8px] cursor-pointer hover:bg-sd-grey-1 transition-colors">
            <span className="text-[14px] font-normal text-[#606060] tracking-[-0.28px] leading-[20px]">Reviewer</span>
          </div>
        </div>
      </div>

      <div className="border border-[#F0F0F0] p-[16px] py-[20px] rounded-[12px] w-full">
        <div className="flex flex-col gap-[16px]">
          <div className="flex flex-col gap-[6px]">
            <span className="text-[14px] font-normal text-[#202020] tracking-[-0.28px] leading-[20px]">Enter email address</span>
            <div className="border-[1.5px] border-[#D9D9D9] h-[44px] px-[16px] py-[12px] rounded-[8px] flex items-center">
              <span className="text-[14px] font-normal text-[#202020] tracking-[-0.28px] leading-[20px]">emmanuelosaite@gmail.com</span>
            </div>
          </div>
          <div className="flex flex-col gap-[6px]">
            <span className="text-[14px] font-normal text-[#202020] tracking-[-0.28px] leading-[20px]">First name</span>
            <div className="border-[1.5px] border-[#D9D9D9] h-[44px] px-[16px] py-[12px] rounded-[8px] flex items-center">
              <span className="text-[14px] font-normal text-[#202020] tracking-[-0.28px] leading-[20px]">Emmanuel</span>
            </div>
          </div>
          <div className="flex flex-col gap-[6px]">
            <span className="text-[14px] font-normal text-[#202020] tracking-[-0.28px] leading-[20px]">Last name</span>
            <div className="border-[1.5px] border-[#D9D9D9] h-[44px] px-[16px] py-[12px] rounded-[8px] flex items-center">
              <span className="text-[14px] font-normal text-[#202020] tracking-[-0.28px] leading-[20px]">Osaite</span>
            </div>
          </div>
          <div className="flex flex-col gap-[6px]">
            <span className="text-[14px] font-normal text-[#202020] tracking-[-0.28px] leading-[20px]">Timezone</span>
            <div className="border-[1.5px] border-[#D9D9D9] h-[44px] px-[16px] py-[12px] rounded-[8px] flex items-center justify-between cursor-pointer hover:bg-sd-grey-1 transition-colors">
              <span className="text-[14px] font-normal text-[#202020] tracking-[-0.28px] leading-[20px]">WAT - UTC+1 (Lagos)</span>
              <ArrowDown2 variant="Linear" size={24} color="#202020" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
