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

const data = [
  { month: "Jan", cost: 1200 },
  { month: "Feb", cost: 1350 },
  { month: "Mar", cost: 1280 },
  { month: "Apr", cost: 1420 },
  { month: "May", cost: 1380 },
  { month: "Jun", cost: 1500 },
  { month: "Jul", cost: 1500.56 },
  { month: "Aug", cost: 1480 },
  { month: "Sep", cost: 1520 },
  { month: "Oct", cost: 1450 },
  { month: "Nov", cost: 1490 },
  { month: "Dec", cost: 1510 },
];

export const AverageProductionCost = () => {
  return (
    <div className="bg-[#FDFDFD] border border-[#F0F0F0] rounded-[12px] flex-1 h-[333px] relative overflow-hidden">
      <div className="absolute top-[17px] left-[23px] flex flex-col gap-[8px]">
        <span className="text-[14px] font-normal text-[#606060] tracking-[-0.28px] leading-[20px]">
          Average production cost
        </span>
        <span className="text-[24px] font-medium text-[#202020] tracking-[-0.48px] leading-[32px]">
          $1,500.94
        </span>
      </div>
      <div className="absolute bottom-[24px] left-[24px] right-[24px] h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
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
      </div>
    </div>
  );
};
