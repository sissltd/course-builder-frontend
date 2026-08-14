import React from "react";
import Image from "next/image";

interface ReviewerMetricCardProps {
  iconSrc: string;
  value: string;
  label: string;
}

export const ReviewerMetricCard = ({
  iconSrc,
  value,
  label,
}: ReviewerMetricCardProps) => {
  return (
    <div className="relative flex min-h-[86px] w-full items-center gap-[12px] rounded-[10px] border border-sd-grey-4 bg-sd-grey-1 px-[16px] py-[12px] overflow-hidden">
      <div className="relative flex size-[50px] shrink-0 items-center justify-center rounded-[8px] border border-sd-grey-4 bg-sd-grey-1 p-[10.909px] overflow-hidden">
        <Image src={iconSrc} alt="" width={28} height={28} className="size-[28px]" />
      </div>
      <div className="flex min-w-0 flex-col gap-[8px]">
        <span className="text-[24px] font-medium text-sd-grey-12 tracking-[-0.48px] leading-[32px] truncate">
          {value}
        </span>
        <span className="text-[16px] font-normal text-sd-reviewer-muted tracking-[-0.32px] leading-[24px] truncate">
          {label}
        </span>
      </div>
      <div className="absolute inset-[-1px] pointer-events-none rounded-[inherit] shadow-[inset_0px_-4px_8px_0px_rgba(255,255,255,0.2),inset_0px_4px_8px_0px_rgba(255,255,255,0.16)]" />
    </div>
  );
};
