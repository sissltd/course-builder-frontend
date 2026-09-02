import React from "react";
import { Graph } from "iconsax-react";

const kpiRow1 = [
  { label: "Daily output", value: "200", target: "Target: 200+", valueClass: "" },
  { label: "First-pass Approval", value: "43.6%", target: "Target: \u2267 80%", valueClass: "" },
  { label: "Avg Pipeline Time", value: "59min", target: "Target: > 60m", valueClass: "" },
];

const kpiRow2 = [
  { label: "Cost Per Course", value: "₦5.45", target: "Target: > ₦5.00", valueClass: "text-[#FF5025]" },
  { label: "Review Turnaround", value: "34hr", target: "Target: 48hr", valueClass: "" },
  { label: "System Uptime", value: "99.91%", target: "Target: 99.9%", valueClass: "" },
];

const KpiCard = ({
  label,
  value,
  target,
  valueClass,
}: {
  label: string;
  value: string;
  target: string;
  valueClass: string;
}) => (
  <div className="border border-[#E8E8E8] bg-[#FDFDFD] flex flex-col flex-1 h-[104px] items-start justify-between p-[16px] relative rounded-[12px] shadow-[inset_0px_-4px_8px_0px_rgba(255,255,255,0.2),inset_0px_4px_8px_0px_rgba(255,255,255,0.16)]">
    <span className="text-[14px] font-normal text-[#606060] tracking-[-0.28px] leading-[20px]">
      {label}
    </span>
    <div className="flex items-center justify-between w-full">
      <span className={`text-[24px] font-medium text-[#202020] tracking-[-0.48px] leading-[32px] ${valueClass}`}>
        {value}
      </span>
      <span className="text-[14px] font-normal text-[#606060] tracking-[-0.28px] leading-[20px]">
        {target}
      </span>
    </div>
  </div>
);

export const KpiScoreCard = () => {
  return (
    <div className="bg-[#FDFDFD] border border-[#F0F0F0] rounded-[12px] p-[16px] w-full">
      <div className="flex gap-[8px] items-start mb-[32px]">
        <Graph variant="Bold" size={20} color="#202020" />
        <span className="text-[14px] font-normal text-[#202020] tracking-[-0.28px] leading-[20px]">
          KPI Score card
        </span>
      </div>
      <div className="flex flex-col gap-[16px]">
        <div className="flex gap-[16px] flex-wrap">
          {kpiRow1.map((kpi) => (
            <KpiCard key={kpi.label} {...kpi} />
          ))}
        </div>
        <div className="flex gap-[16px] flex-wrap">
          {kpiRow2.map((kpi) => (
            <KpiCard key={kpi.label} {...kpi} />
          ))}
        </div>
      </div>
    </div>
  );
};
