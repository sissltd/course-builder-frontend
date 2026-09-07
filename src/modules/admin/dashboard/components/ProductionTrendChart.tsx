"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface ProductionTrendChartProps {
  productionTrend?: Array<{ date: string; count: number }>;
  todayCount?: number;
  changePercent?: number | null;
  isLoading?: boolean;
}

const fallbackDays = [
  { day: "Mon", value: 0 },
  { day: "Tue", value: 0 },
  { day: "Wed", value: 0 },
  { day: "Thu", value: 0 },
  { day: "Fri", value: 0 },
  { day: "Sat", value: 0 },
  { day: "Sun", value: 0 },
];

export const ProductionTrendChart = ({
  productionTrend,
  todayCount,
  changePercent,
  isLoading,
}: ProductionTrendChartProps) => {
  const chartData = React.useMemo(() => {
    if (productionTrend && productionTrend.length > 0) {
      return productionTrend.map((item) => {
        const d = new Date(item.date);
        const dayLabel = isNaN(d.getTime())
          ? item.date
          : d.toLocaleDateString("en-US", { weekday: "short" });
        return {
          day: dayLabel,
          value: item.count,
        };
      });
    }
    return fallbackDays;
  }, [productionTrend]);

  const totalCount = React.useMemo(() => {
    if (todayCount != null) return todayCount;
    if (productionTrend && productionTrend.length > 0) {
      return productionTrend.reduce((acc, curr) => acc + curr.count, 0);
    }
    return 0;
  }, [todayCount, productionTrend]);

  return (
    <div className="bg-[#FDFDFD] border border-[#F0F0F0] rounded-[12px] flex-1 min-w-[300px] h-[333px] relative overflow-hidden">
      <div className="absolute top-[17px] left-[23px] right-[23px] flex items-start justify-between">
        <div className="flex flex-col gap-[6px]">
          <span className="text-[14px] font-normal text-[#606060] tracking-[-0.28px] leading-[20px]">
            Production Trend
          </span>
          <div className="flex items-baseline gap-[8px]">
            <span className="text-[24px] font-medium text-[#202020] tracking-[-0.48px] leading-[32px]">
              {isLoading ? "..." : totalCount.toLocaleString()}
            </span>
            {changePercent != null && (
              <span
                className={`text-[12px] font-medium px-[6px] py-[2px] rounded ${
                  changePercent >= 0
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
            <BarChart data={chartData} barCategoryGap={4}>
              <CartesianGrid vertical={false} stroke="#E8E8E8" strokeDasharray="3 3" />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#606060" }}
              />
              <YAxis hide allowDecimals={false} />
              <Bar
                dataKey="value"
                radius={[4, 4, 0, 0]}
                barSize={32}
                shape={(props: any) => {
                  const { x, y, width, height, index } = props;
                  const fill = index % 2 === 0 ? "#0063EF" : "#FF8A00";
                  return (
                    <rect x={x} y={y} width={width} height={height} fill={fill} rx={4} />
                  );
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
