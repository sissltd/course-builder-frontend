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

const data = [
  { day: "Mon", value: 180 },
  { day: "Tue", value: 200 },
  { day: "Wed", value: 160 },
  { day: "Thu", value: 210 },
  { day: "Fri", value: 190 },
  { day: "Sat", value: 230 },
  { day: "Sun", value: 170 },
];

export const ProductionTrendChart = () => {
  return (
    <div className="bg-[#FDFDFD] border border-[#F0F0F0] rounded-[12px] flex-1 h-[333px] relative overflow-hidden">
      <div className="absolute top-[17px] left-[23px] flex flex-col gap-[8px]">
        <span className="text-[14px] font-normal text-[#606060] tracking-[-0.28px] leading-[20px]">
          Production Trend
        </span>
        <span className="text-[24px] font-medium text-[#202020] tracking-[-0.48px] leading-[32px]">
          250
        </span>
      </div>
      <div className="absolute bottom-[24px] left-[24px] right-[24px] h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap={4}>
            <CartesianGrid vertical={false} stroke="#E8E8E8" strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#606060" }}
            />
            <YAxis hide />
            <Bar
              dataKey="value"
              radius={[4, 4, 0, 0]}
              barSize={40}
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
      </div>
    </div>
  );
};
