"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Topic Intake", value: 190, color: "#0063EF" },
  { name: "Curriculum", value: 183, color: "#FF8A00" },
  { name: "Content Generation", value: 184, color: "#00C48C" },
  { name: "Assessment Builder", value: 184, color: "#FF3D57" },
  { name: "Media Production", value: 184, color: "#7C3AED" },
  { name: "Preview Video", value: 172, color: "#F59E0B" },
  { name: "Assembly and Packaging", value: 175, color: "#14B8A6" },
  { name: "Auto-QA", value: 170, color: "#8B5CF6" },
];

const total = data.reduce((sum, d) => sum + d.value, 0);

export const ApePipelineOverview = () => {
  return (
    <div className="bg-[#FDFDFD] border border-[#F0F0F0] rounded-[12px] p-[24px] flex-1 h-[fit-content]">
      <h3 className="text-[14px] font-normal text-[#606060] tracking-[-0.28px] leading-[20px] mb-[24px]">
        APE Pipeline Overview
      </h3>
      <div className="flex flex-col items-center gap-[24px]">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "#202020",
                border: "none",
                borderRadius: "8px",
                color: "#FDFDFD",
                fontSize: "14px",
                padding: "8px 12px",
              }}
              formatter={(value) => [
                `${Number(value)} (${Math.round((Number(value) / total) * 100)}%)`,
                "",
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-x-[24px] gap-y-[12px] justify-center">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-[8px]">
              <div className="size-[10px] rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-[12px] font-normal text-[#606060] leading-[16px] whitespace-nowrap">
                {item.name}
              </span>
              <span className="text-[12px] font-medium text-[#202020] leading-[16px]">
                {Math.round((item.value / total) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
