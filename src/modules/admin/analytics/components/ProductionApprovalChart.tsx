"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Money } from "iconsax-react";

interface ProductionApprovalChartProps {
  productionVsApproval?: {
    produced: number;
    approved: number;
    rejected: number;
  };
  daily?: Array<{
    day?: string;
    date?: string;
    approved?: number;
    produced?: number;
    rejected?: number;
    [key: string]: any;
  }>;
  isLoading?: boolean;
}

const fallbackDays = [
  { day: "Mon", approved: 0, produced: 0, rejected: 0 },
  { day: "Tue", approved: 0, produced: 0, rejected: 0 },
  { day: "Wed", approved: 0, produced: 0, rejected: 0 },
  { day: "Thu", approved: 0, produced: 0, rejected: 0 },
  { day: "Fri", approved: 0, produced: 0, rejected: 0 },
  { day: "Sat", approved: 0, produced: 0, rejected: 0 },
  { day: "Sun", approved: 0, produced: 0, rejected: 0 },
];

export const ProductionApprovalChart = ({
  productionVsApproval,
  daily = [],
  isLoading,
}: ProductionApprovalChartProps) => {
  const chartData = React.useMemo(() => {
    if (daily && daily.length > 0) {
      return daily.map((d, index) => ({
        day: d.day || (d.date ? new Date(d.date).toLocaleDateString("en-US", { weekday: "short" }) : `Day ${index + 1}`),
        approved: d.approved ?? 0,
        produced: d.produced ?? 0,
        rejected: d.rejected ?? 0,
      }));
    }
    // If daily is empty, build a baseline using productionVsApproval so the chart renders nicely
    return fallbackDays;
  }, [daily]);

  const [activeTooltip, setActiveTooltip] = React.useState<{
    approved?: number;
    produced?: number;
    rejected?: number;
  } | null>(null);

  return (
    <div className="bg-[#FDFDFD] border border-[#F0F0F0] rounded-[12px] w-full overflow-hidden">
      <div className="pt-[17px] px-[23px] flex items-center gap-[8px]">
        <Money variant="Bold" size={20} color="#202020" />
        <span className="text-[14px] font-normal text-[#202020] tracking-[-0.28px] leading-[20px]">
          Production vs Approval Stat
        </span>
      </div>
      <div className="flex pt-[20px] px-[23px] pb-[24px] gap-[16px] flex-col lg:flex-row">
        <div className="flex-1 h-[269px]">
          {isLoading ? (
            <div className="w-full h-full bg-[#F5F5F5] animate-pulse rounded-[8px] flex items-center justify-center text-[#888] text-[13px]">
              Loading analytics chart...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                onMouseMove={(e: any) => {
                  if (e?.activePayload) {
                    const d = e.activePayload[0]?.payload;
                    if (d) {
                      setActiveTooltip({
                        approved: d.approved,
                        produced: d.produced,
                        rejected: d.rejected,
                      });
                    }
                  }
                }}
                onMouseLeave={() => setActiveTooltip(null)}
                margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
              >
                <CartesianGrid vertical={false} stroke="#E8E8E8" strokeDasharray="3 3" />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#606060" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#606060" }}
                  tickFormatter={(v) => `${v}`}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#FDFDFD",
                    border: "0.5px solid #F0F0F0",
                    borderRadius: "8px",
                    boxShadow: "0px 8px 16px rgba(0,0,0,0.1)",
                    fontSize: "12px",
                    padding: "8px 12px",
                  }}
                  formatter={(value, name) => [
                    `${Number(value).toLocaleString()}`,
                    String(name).charAt(0).toUpperCase() + String(name).slice(1),
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="approved"
                  stroke="#0063EF"
                  strokeWidth={2}
                  fill="#0063EF"
                  fillOpacity={0.08}
                  dot={false}
                  activeDot={{ r: 4, fill: "#0063EF" }}
                />
                <Area
                  type="monotone"
                  dataKey="produced"
                  stroke="#FF8A00"
                  strokeWidth={2}
                  fill="#FF8A00"
                  fillOpacity={0.08}
                  dot={false}
                  activeDot={{ r: 4, fill: "#FF8A00" }}
                />
                <Area
                  type="monotone"
                  dataKey="rejected"
                  stroke="#FF3D57"
                  strokeWidth={2}
                  fill="#FF3D57"
                  fillOpacity={0.08}
                  dot={false}
                  activeDot={{ r: 4, fill: "#FF3D57" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="flex flex-col gap-[13px] w-full lg:w-[280px] justify-center">
          <div className="border border-[#F2F2F2] bg-white rounded-[8px] p-[12px] flex flex-col gap-[9px]">
            <div className="flex gap-[9px] items-center">
              <div className="size-[6px] rounded-full bg-[#0063EF]" />
              <span className="text-[14px] font-normal text-[#606060] tracking-[-0.28px] leading-[20px]">Approved</span>
            </div>
            <div className="flex gap-[10px] items-center">
              <span className="text-[20px] font-medium text-[#242424] leading-[28px]">
                {isLoading
                  ? "..."
                  : activeTooltip?.approved != null
                  ? activeTooltip.approved.toLocaleString()
                  : productionVsApproval?.approved != null
                  ? productionVsApproval.approved.toLocaleString()
                  : "—"}
              </span>
            </div>
          </div>
          <div className="border border-[#F2F2F2] bg-white rounded-[8px] p-[12px] flex flex-col gap-[9px]">
            <div className="flex gap-[9px] items-center">
              <div className="size-[6px] rounded-full bg-[#FF8A00]" />
              <span className="text-[14px] font-normal text-[#606060] tracking-[-0.28px] leading-[20px]">Produced</span>
            </div>
            <div className="flex gap-[10px] items-center">
              <span className="text-[20px] font-medium text-[#242424] leading-[28px]">
                {isLoading
                  ? "..."
                  : activeTooltip?.produced != null
                  ? activeTooltip.produced.toLocaleString()
                  : productionVsApproval?.produced != null
                  ? productionVsApproval.produced.toLocaleString()
                  : "—"}
              </span>
            </div>
          </div>
          <div className="border border-[#F2F2F2] bg-white rounded-[8px] p-[12px] flex flex-col gap-[9px]">
            <div className="flex gap-[9px] items-center">
              <div className="size-[6px] rounded-full bg-[#FF3D57]" />
              <span className="text-[14px] font-normal text-[#606060] tracking-[-0.28px] leading-[20px]">Rejected</span>
            </div>
            <div className="flex gap-[10px] items-center">
              <span className="text-[20px] font-medium text-[#242424] leading-[28px]">
                {isLoading
                  ? "..."
                  : activeTooltip?.rejected != null
                  ? activeTooltip.rejected.toLocaleString()
                  : productionVsApproval?.rejected != null
                  ? productionVsApproval.rejected.toLocaleString()
                  : "—"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
