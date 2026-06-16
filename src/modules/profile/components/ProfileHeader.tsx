import React from "react";
import { TopCreatorIcon } from "@/modules/dashboard/components/icons/TopCreatorIcon";

interface ProfileHeaderProps {
  name: string;
  memberSince: string;
  isVerified?: boolean;
}

export const ProfileHeader = ({ name, memberSince, isVerified = true }: ProfileHeaderProps) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-start justify-between gap-[24px] pb-[24px] border-b border-[#F0F0F0]">
      {/* Avatar + name */}
      <div className="flex items-center gap-[16px]">
        <div className="size-[64px] rounded-full bg-[#202020] flex items-center justify-center shrink-0">
          <span className="text-[20px] font-semibold text-white tracking-[-0.4px]">{initials}</span>
        </div>
        <div className="flex flex-col gap-[4px]">
          <p className="text-[16px] font-semibold text-[#202020] tracking-[-0.32px] leading-[24px]">{name}</p>
          <p className="text-[14px] text-[#636363] leading-[20px]">Member since {memberSince}</p>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-col gap-[8px] items-end">
        <p className="text-[14px] font-semibold text-[#202020] tracking-[-0.28px]">Badges</p>
        <div className="flex items-center gap-[12px]">
          <div className="flex items-center gap-[6px] bg-[#F5F5F5] border border-[#E8E8E8] rounded-full px-[12px] py-[6px]">
            <TopCreatorIcon size={16} />
            <span className="text-[13px] text-[#606060] font-medium tracking-[-0.26px]">Top creator</span>
          </div>
          {isVerified && (
            <div className="flex items-center justify-center px-[16px] py-[6px] bg-[#EBF7EE] border border-[#27AE60]/30 rounded-[8px]">
              <span className="text-[13px] font-medium text-[#27AE60] tracking-[-0.26px]">Verified</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
