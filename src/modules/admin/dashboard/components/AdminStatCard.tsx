import React from "react";

interface AdminStatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: string;
  trendIcon?: React.ReactNode;
}

export const AdminStatCard = ({ icon, label, value, trend, trendIcon }: AdminStatCardProps) => {
  return (
    <div className="border border-[#E8E8E8] bg-[#FDFDFD] flex flex-col flex-1 h-[150px] items-start justify-between p-[16px] relative rounded-[12px] shadow-[inset_0px_-4px_8px_0px_rgba(255,255,255,0.2),inset_0px_4px_8px_0px_rgba(255,255,255,0.16)]">
      <div className="flex gap-[8px] items-start">
        {icon}
        <span className="text-[14px] font-normal text-[#202020] tracking-[-0.28px] leading-[20px] overflow-hidden text-ellipsis whitespace-nowrap">
          {label}
        </span>
      </div>
      <div className="flex flex-col gap-[12px] w-full">
        <span className="text-[24px] font-medium text-[#202020] tracking-[-0.48px] leading-[32px]">
          {value}
        </span>
        {trend && (
          <div className="flex gap-[8px] items-center">
            {trendIcon}
            <span className="text-[14px] font-normal text-[#606060] tracking-[-0.28px] leading-[20px]">
              {trend}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
