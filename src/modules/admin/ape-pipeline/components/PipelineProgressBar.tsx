import React from "react";

interface PipelineProgressBarProps {
  label: string;
  value?: number;
  max?: number;
  total?: number;
  active?: number;
  completed?: number;
  failed?: number;
}

export const PipelineProgressBar = ({
  label,
  value,
  max,
  total: propTotal,
  active = 0,
  completed = 0,
  failed = 0,
}: PipelineProgressBarProps) => {
  const total = propTotal ?? max ?? (value ?? 0);
  const compCount = completed || (value ?? 0);

  const compPct = total > 0 ? (compCount / total) * 100 : 0;
  const activePct = total > 0 ? (active / total) * 100 : 0;
  const failedPct = total > 0 ? (failed / total) * 100 : 0;
  const remainingPct = Math.max(0, 100 - compPct - activePct - failedPct);

  return (
    <div className="flex gap-[16px] md:gap-[32px] items-center w-full">
      <span className="text-[14px] font-normal text-[#202020] tracking-[-0.28px] leading-[20px] min-w-[120px] w-auto md:w-[240px] truncate">
        {label}
      </span>
      <div className="bg-[#F0F0F0] flex gap-[2px] items-center overflow-clip rounded-[322px] flex-1 h-[14px] relative">
        {compPct > 0 && (
          <div
            className="bg-[#0063EF] h-full rounded-[322px] transition-all"
            style={{ width: `${compPct}%` }}
            title={`Completed: ${compCount}`}
          />
        )}
        {activePct > 0 && (
          <div
            className="bg-[#FF8A00] h-full rounded-[322px] transition-all"
            style={{ width: `${activePct}%` }}
            title={`Active: ${active}`}
          />
        )}
        {failedPct > 0 && (
          <div
            className="bg-[#FF3D57] h-full rounded-[322px] transition-all"
            style={{ width: `${failedPct}%` }}
            title={`Failed: ${failed}`}
          />
        )}
        {remainingPct > 0 && total > 0 && (
          <div
            className="bg-[#EAEAEA] h-full rounded-[322px]"
            style={{ width: `${remainingPct}%` }}
          />
        )}
      </div>
      <div className="flex items-center gap-[6px] justify-end min-w-[60px]">
        <span className="text-[14px] font-medium text-[#202020] tracking-[-0.28px] leading-[20px]">
          {compCount}
        </span>
        <span className="text-[12px] text-[#888]">/ {total}</span>
      </div>
    </div>
  );
};
