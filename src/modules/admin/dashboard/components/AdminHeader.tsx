"use client";

import React from "react";
import Image from "next/image";
import {
  SearchNormal1,
  Notification,
  I24Support,
  Setting2,
} from "iconsax-react";

interface AdminHeaderProps {
  title?: string;
}

export const AdminHeader = ({ title }: AdminHeaderProps) => {
  return (
    <header className="h-[59px] bg-[#FDFDFD] border-b border-[#F0F0F0] flex items-center px-[24px] sticky top-0 z-30 ml-[237px] gap-[24px]">
      <span className="text-[14px] font-medium text-[#202020] tracking-[-0.28px] leading-[20px] min-w-[100px]">
        {title}
      </span>

      <div className="flex-1 flex justify-center">
        <div className="flex items-center gap-[8px] bg-[#FCFDFF] border border-[#F0F0F0] rounded-full px-[12px] py-[8px] h-[36px] w-[264px]">
          <SearchNormal1 variant="Linear" size={18} color="#606060" />
          <input
            type="text"
            placeholder="Search admin"
            className="w-full bg-transparent outline-none text-[14px] text-[#202020] placeholder:text-[#B6B6B6]"
          />
        </div>
      </div>

      <div className="flex items-center gap-[12px]">
        <button className="flex items-center gap-[8px] border border-[#F0F0F0] rounded-[6px] px-[8px] py-[4px] h-[32px] hover:bg-sd-grey-2 transition-colors cursor-pointer">
          <I24Support variant="Linear" size={20} color="#606060" />
          <span className="text-[12px] font-normal text-[#606060] tracking-[-0.28px] leading-[16px]">
            Help and support
          </span>
        </button>

        <button className="border border-[#F0F0F0] rounded-[6px] p-[4px] size-[32px] flex items-center justify-center hover:bg-sd-grey-2 transition-colors cursor-pointer relative">
          <Notification variant="Linear" size={20} color="#606060" />
          <span className="absolute top-[6px] right-[6px] size-2 bg-red-500 rounded-full border border-white" />
        </button>

        <button className="border border-[#F0F0F0] rounded-[6px] p-[4px] size-[32px] flex items-center justify-center hover:bg-sd-grey-2 transition-colors cursor-pointer">
          <Setting2 variant="Linear" size={20} color="#606060" />
        </button>

        <div className="border border-[#F0F0F0] rounded-full p-[4px] size-[32px] flex items-center justify-center cursor-pointer">
          <div className="size-[20px] rounded-full bg-[#7B7272] overflow-hidden relative">
            <Image
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Emmanuel"
              alt="Avatar"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
