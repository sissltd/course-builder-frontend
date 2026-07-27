import React from "react";

interface PipelineProgressBarProps {
  label: string;
  value: number;
  max: number;
}

export const PipelineProgressBar = ({ label, value, max }: PipelineProgressBarProps) => {
  const completedPct = (value / max) * 100;
  const remainingPct = 100 - completedPct;

  return (
    <div className="flex gap-[32px] items-center w-full">
      <span className="text-[14px] font-normal text-[#202020] tracking-[-0.28px] leading-[20px] min-w-[100px] w-auto md:w-[264px]">
        {label}
      </span>
      <div className="bg-[#F0F0F0] flex gap-[4px] items-start overflow-clip rounded-[322px] flex-1 h-[14px]">
        <div
          className="bg-[#B3D3FF] h-full rounded-[322px]"
          style={{ width: `${completedPct}%` }}
        />
        {remainingPct > 0 && (
          <div
            className="bg-[#FFBA95] h-full rounded-[322px]"
            style={{ width: `${remainingPct}%` }}
          />
        )}
      </div>
      <span className="text-[14px] font-normal text-[#202020] tracking-[-0.28px] leading-[20px] w-[40px] text-right">
        {value}
      </span>
    </div>
  );
};
