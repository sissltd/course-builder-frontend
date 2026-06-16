"use client";

import React, { useRef } from "react";
import { Trash } from "iconsax-react";

export const AccountSettingsTab = () => {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-[28px]">
      {/* Avatar row */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-[16px]">
          {/* Avatar */}
          <div className="size-[64px] rounded-full bg-[#202020] flex items-center justify-center shrink-0">
            <span className="text-[22px] font-semibold text-white tracking-[-0.44px]">OE</span>
          </div>
          {/* Upload / delete */}
          <div className="flex items-center gap-[10px]">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="text-[14px] text-[#606060] hover:text-[#202020] tracking-[-0.28px] transition-colors"
            >
              Upload
            </button>
            <button className="text-[#B6B6B6] hover:text-[#FF5025] transition-colors">
              <Trash size={18} variant="Linear" color="currentColor" />
            </button>
          </div>
        </div>

        {/* Verify account */}
        <button className="h-[36px] px-[16px] border border-[#D9D9D9] rounded-[8px] text-[14px] text-[#202020] hover:bg-[#F5F5F5] transition-colors whitespace-nowrap">
          Verify account
        </button>
      </div>

      {/* Name + since */}
      <div className="flex flex-col gap-[4px]">
        <p className="text-[16px] font-semibold text-[#202020] tracking-[-0.32px]">Osaite Emmanuel</p>
        <p className="text-[14px] text-[#636363]">Member since 25 April, 2026</p>
      </div>

      <div className="h-px bg-[#F0F0F0]" />

      {/* Log out row */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-[4px]">
          <p className="text-[16px] font-semibold text-[#202020] tracking-[-0.32px]">Log out</p>
          <p className="text-[14px] text-[#636363]">Temporary log out of your account.</p>
        </div>
        <button className="h-[40px] px-[20px] border border-[#F05A25] rounded-[8px] text-[14px] text-[#F05A25] hover:bg-[#FFF0ED] transition-colors font-medium whitespace-nowrap">
          Log out
        </button>
      </div>

      <div className="h-px bg-[#F0F0F0]" />

      {/* Dangerous area */}
      <div className="flex flex-col gap-[16px]">
        <p className="text-[14px] font-semibold text-[#F05A25] tracking-[-0.28px]">Dangerous area</p>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-[4px]">
            <p className="text-[16px] font-semibold text-[#202020] tracking-[-0.32px]">Delete account</p>
            <p className="text-[14px] text-[#636363]">This process is not reversable and cannot be undone</p>
          </div>
          <button className="h-[40px] px-[20px] border border-[#F05A25] rounded-[8px] text-[14px] text-[#F05A25] hover:bg-[#FFF0ED] transition-colors font-medium whitespace-nowrap">
            Delete account
          </button>
        </div>
      </div>
    </div>
  );
};
