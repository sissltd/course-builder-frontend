"use client";

import React from "react";
import { UserAdd } from "iconsax-react";

const timeChips = ["24 hrs", "7 days", "31 days", "6 months"];

interface WelcomeHeaderProps {
  onInviteClick?: () => void;
}

export const WelcomeHeader = ({ onInviteClick }: WelcomeHeaderProps) => {
  return (
    <div className="flex items-start justify-between w-full">
      <div className="flex flex-col gap-[4px]">
        <div className="flex gap-[8px] items-center">
          <h1 className="text-[24px] font-medium text-[#202020] tracking-[-0.48px] leading-[32px]">
            Welcome back!
          </h1>
          <div className="border border-[#D9D9D9] flex h-[24px] items-center justify-center px-[8px] py-[4px] rounded-[6px]">
            <span className="text-[14px] font-normal text-[#202020] tracking-[-0.28px] leading-[20px]">
              Admin
            </span>
          </div>
        </div>
        <p className="text-[16px] font-normal text-[#606060] leading-[24px]">
          Emmanuel
        </p>
      </div>

      <div className="flex gap-[12px] items-center">
        <div className="flex gap-[4px] items-center">
          {timeChips.map((chip, i) => (
            <div
              key={chip}
              className={`flex h-[24px] items-center justify-center px-[8px] py-[4px] rounded-[6px] ${
                i === 1
                  ? "bg-[#C9E1FF] text-[#0A60E1]"
                  : "bg-[#FDFDFD] text-[#606060]"
              }`}
            >
              <span className="text-[14px] font-normal tracking-[-0.28px] leading-[20px]">
                {chip}
              </span>
            </div>
          ))}
        </div>

        <button onClick={onInviteClick} className="bg-[#0063EF] flex gap-[8px] h-[40px] items-center px-[24px] py-[12px] rounded-[8px] hover:bg-[#0052CC] transition-colors">
          <UserAdd variant="Linear" size={20} color="#FDFDFD" />
          <span className="text-[16px] font-normal text-[#FDFDFD] tracking-[-0.32px] leading-[24px]">
            Invite
          </span>
        </button>
      </div>
    </div>
  );
};
