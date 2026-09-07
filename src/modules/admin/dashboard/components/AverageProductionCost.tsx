"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface AverageProductionCostProps {
  costTrend?: Array<{ date: string; amount: string }>;
  avgCost?: string | number | null;
  dailyCost?: string | number | null;
  changePercent?: number | null;
  isLoading?: boolean;
}

const fallbackMonths = [
  { month: "Mon", cost: 0 },
  { month: "Tue", cost: 0 },
  { month: "Wed", cost: 0 },
  { month: "Thu", cost: 0 },
  { month: "Fri", cost: 0 },
  { month: "Sat", cost: 0 },
  { month: "Sun", cost: 0 },
];

export const AverageProductionCost = ({
  costTrend,
  avgCost,
  dailyCost,
  changePercent,
  isLoading,
}: AverageProductionCostProps) => {
  const chartData = React.useMemo(() => {
    if (costTrend && costTrend.length > 0) {
      return costTrend.map((item) => {
        const d = new Date(item.date);
        const label = isNaN(d.getTime())
          ? item.date
          : d.toLocaleDateString("en-US", { weekday: "short" });
        return {
          month: label,
          cost: parseFloat(item.amount) || 0,
        };
      });
    }
    return fallbackMonths;
  }, [costTrend]);

  const displayCost = React.useMemo(() => {
    const val = avgCost ?? dailyCost;
    if (val == null) return "—";
    const num = Number(val);
    if (isNaN(num)) return String(val);
    return `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }, [avgCost, dailyCost]);

  return (
    <div className="bg-[#FDFDFD] border border-[#F0F0F0] rounded-[12px] flex-1 min-w-[300px] h-[333px] relative overflow-hidden">
      <div className="absolute top-[17px] left-[23px] right-[23px] flex items-start justify-between">
        <div className="flex flex-col gap-[6px]">
          <span className="text-[14px] font-normal text-[#606060] tracking-[-0.28px] leading-[20px]">
            Average Production Cost
          </span>
          <div className="flex items-baseline gap-[8px]">
            <span className="text-[24px] font-medium text-[#202020] tracking-[-0.48px] leading-[32px]">
              {isLoading ? "..." : displayCost}
            </span>
            {changePercent != null && (
              <span
                className={`text-[12px] font-medium px-[6px] py-[2px] rounded ${
                  changePercent <= 0
                    ? "bg-[#E0F0E4] text-[#377E36]"
                    : "bg-[#FFEEE5] text-[#D54800]"
                }`}
              >
                {changePercent >= 0 ? `+${changePercent}%` : `${changePercent}%`}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="absolute bottom-[24px] left-[24px] right-[24px] h-[200px]">
        {isLoading ? (
          <div className="w-full h-full bg-[#F5F5F5] animate-pulse rounded-[8px]" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid vertical={false} stroke="#E8E8E8" strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#606060" }}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  background: "#202020",
                  border: "none",
                  borderRadius: "8px",
                  color: "#FDFDFD",
                  fontSize: "14px",
                }}
                formatter={(value) => [`$${Number(value).toFixed(2)}`, "Cost"]}
              />
              <Line
                type="monotone"
                dataKey="cost"
                stroke="#0063EF"
                strokeWidth={2}
                dot={false}
                activeDot={{ fill: "#0063EF", r: 6, strokeWidth: 2, stroke: "#FDFDFD" }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
