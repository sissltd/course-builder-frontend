import React from "react";
import { ArrowUp2 } from "iconsax-react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: string;
}

export const StatCard = ({ icon, label, value, trend }: StatCardProps) => {
  return (
    <div className="border border-[#E8E8E8] bg-[#FDFDFD] flex flex-col h-[150px] items-start justify-between p-[16px] relative rounded-[12px] w-[276px] shadow-[inset_0px_-4px_8px_0px_rgba(255,255,255,0.2),inset_0px_4px_8px_0px_rgba(255,255,255,0.16)]">
      <div className="flex gap-[8px] items-start">
        {icon}
        <span className="text-[14px] font-normal text-[#202020] tracking-[-0.28px] leading-[20px] overflow-hidden text-ellipsis whitespace-nowrap">
          {label}
        </span>
      </div>
      <div className="flex flex-col gap-[12px] w-full">
        <h2 className="text-[24px] font-medium text-[#202020] tracking-[-0.48px] leading-[32px]">
          {value}
        </h2>
        {trend && (
          <div className="flex gap-[8px] items-center">
            <ArrowUp2 variant="Linear" size={18} color="#606060" />
            <span className="text-[14px] font-normal text-[#606060] tracking-[-0.28px] leading-[20px]">
              {trend}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
