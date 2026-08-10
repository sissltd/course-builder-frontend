import React from "react";
import { cn } from "@/lib/utils";

interface AdminStatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: string;
  trendIcon?: React.ReactNode;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
}

export const AdminStatCard = ({
  icon,
  label,
  value,
  trend,
  trendIcon,
  className,
  labelClassName,
  valueClassName,
  headerClassName,
  bodyClassName,
}: AdminStatCardProps) => {
  return (
    <div className={cn("border border-sd-grey-4 bg-sd-grey-1 flex flex-col flex-1 h-[150px] items-start justify-between p-[16px] relative rounded-[12px] shadow-[inset_0px_-4px_8px_0px_rgba(255,255,255,0.2),inset_0px_4px_8px_0px_rgba(255,255,255,0.16)]", className)}>
      <div className={cn("flex gap-[8px] items-start", headerClassName)}>
        {icon}
        <span className={cn("text-[14px] font-normal text-sd-grey-12 tracking-[-0.28px] leading-[20px] overflow-hidden text-ellipsis whitespace-nowrap", labelClassName)}>
          {label}
        </span>
      </div>
      <div className={cn("flex flex-col gap-[12px] w-full", bodyClassName)}>
        <span className={cn("text-[24px] font-medium text-sd-grey-12 tracking-[-0.48px] leading-[32px]", valueClassName)}>
          {value}
        </span>
        {trend && (
          <div className="flex gap-[8px] items-center">
            {trendIcon}
            <span className="text-[14px] font-normal text-sd-grey-11 tracking-[-0.28px] leading-[20px]">
              {trend}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
