import React from "react";
import { Graph } from "iconsax-react";

interface KpiScoreCardProps {
  kpis?: {
    daily_output: number | null;
    first_pass_approval_percent: number | null;
    avg_pipeline_time_minutes: number | null;
    cost_per_course: string | number | null;
    review_turnaround_hours: number | null;
    system_uptime_percent: number | null;
    targets?: {
      daily_output?: string;
      first_pass_approval_percent?: string;
      avg_pipeline_time_minutes?: string;
      cost_per_course?: string;
      review_turnaround_hours?: string;
      system_uptime_percent?: string;
    };
  };
  isLoading?: boolean;
}

const KpiCard = ({
  label,
  value,
  target,
  valueClass = "",
  isLoading = false,
}: {
  label: string;
  value: string;
  target: string;
  valueClass?: string;
  isLoading?: boolean;
}) => (
  <div className="border border-[#E8E8E8] bg-[#FDFDFD] flex flex-col flex-1 min-w-[220px] h-[104px] items-start justify-between p-[16px] relative rounded-[12px] shadow-[inset_0px_-4px_8px_0px_rgba(255,255,255,0.2),inset_0px_4px_8px_0px_rgba(255,255,255,0.16)]">
    <span className="text-[14px] font-normal text-[#606060] tracking-[-0.28px] leading-[20px]">
      {label}
    </span>
    <div className="flex items-center justify-between w-full">
      {isLoading ? (
        <div className="h-[28px] w-[80px] bg-[#EAEAEA] animate-pulse rounded-[4px]" />
      ) : (
        <span className={`text-[24px] font-medium text-[#202020] tracking-[-0.48px] leading-[32px] ${valueClass}`}>
          {value}
        </span>
      )}
      <span className="text-[14px] font-normal text-[#606060] tracking-[-0.28px] leading-[20px]">
        {target}
      </span>
    </div>
  </div>
);

export const KpiScoreCard: React.FC<KpiScoreCardProps> = ({ kpis, isLoading }) => {
  const row1 = [
    {
      label: "Daily output",
      value: kpis?.daily_output != null ? String(kpis.daily_output) : "—",
      target: kpis?.targets?.daily_output ? `Target: ${kpis.targets.daily_output}` : "Target: 200+",
      valueClass: "",
    },
    {
      label: "First-pass Approval",
      value: kpis?.first_pass_approval_percent != null ? `${kpis.first_pass_approval_percent}%` : "—",
      target: kpis?.targets?.first_pass_approval_percent ? `Target: ${kpis.targets.first_pass_approval_percent}` : "Target: ≥ 80%",
      valueClass: "",
    },
    {
      label: "Avg Pipeline Time",
      value: kpis?.avg_pipeline_time_minutes != null ? `${kpis.avg_pipeline_time_minutes}min` : "—",
      target: kpis?.targets?.avg_pipeline_time_minutes ? `Target: ${kpis.targets.avg_pipeline_time_minutes}` : "Target: > 60m",
      valueClass: "",
    },
  ];

  const row2 = [
    {
      label: "Cost Per Course",
      value: kpis?.cost_per_course != null ? `$${kpis.cost_per_course}` : "—",
      target: kpis?.targets?.cost_per_course ? `Target: ${kpis.targets.cost_per_course}` : "Target: > $5.00",
      valueClass: "text-[#FF5025]",
    },
    {
      label: "Review Turnaround",
      value: kpis?.review_turnaround_hours != null ? `${kpis.review_turnaround_hours}hr` : "—",
      target: kpis?.targets?.review_turnaround_hours ? `Target: ${kpis.targets.review_turnaround_hours}` : "Target: 48hr",
      valueClass: "",
    },
    {
      label: "System Uptime",
      value: kpis?.system_uptime_percent != null ? `${kpis.system_uptime_percent}%` : "—",
      target: kpis?.targets?.system_uptime_percent ? `Target: ${kpis.targets.system_uptime_percent}` : "Target: 99.9%",
      valueClass: "",
    },
  ];

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
          {row1.map((kpi) => (
            <KpiCard key={kpi.label} {...kpi} isLoading={isLoading} />
          ))}
        </div>
        <div className="flex gap-[16px] flex-wrap">
          {row2.map((kpi) => (
            <KpiCard key={kpi.label} {...kpi} isLoading={isLoading} />
          ))}
        </div>
      </div>
    </div>
  );
};
