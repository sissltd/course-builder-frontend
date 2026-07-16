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

const data = [
  { day: "Mon", approved: 1200, produced: 1100, rejected: 20 },
  { day: "Tue", approved: 1350, produced: 1250, rejected: 15 },
  { day: "Wed", approved: 1100, produced: 1050, rejected: 25 },
  { day: "Thur", approved: 1400, produced: 1300, rejected: 18 },
  { day: "Fri", approved: 1250, produced: 1200, rejected: 22 },
  { day: "Sat", approved: 1450, produced: 1350, rejected: 10 },
  { day: "Sun", approved: 1300, produced: 1250, rejected: 12 },
];

export const ProductionApprovalChart = () => {
  const [activeTooltip, setActiveTooltip] = React.useState({
    approved: 2500,
    produced: 2500,
    rejected: 25,
  });

  return (
    <div className="bg-[#FDFDFD] border border-[#F0F0F0] rounded-[12px] w-full overflow-hidden">
      <div className="pt-[17px] px-[23px] flex items-center gap-[8px]">
        <Money variant="Bold" size={20} color="#202020" />
        <span className="text-[14px] font-normal text-[#202020] tracking-[-0.28px] leading-[20px]">
          Production vs Approval Stat
        </span>
      </div>
      <div className="flex pt-[20px] px-[23px] pb-[24px] gap-[16px]">
        <div className="flex-1 h-[269px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
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
                domain={[0, 1500]}
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
        </div>
        <div className="flex flex-col gap-[13px] w-[280px] justify-center">
          <div className="border border-[#F2F2F2] bg-white rounded-[8px] p-[12px] flex flex-col gap-[9px]">
            <div className="flex gap-[9px] items-center">
              <div className="size-[6px] rounded-full bg-[#0063EF]" />
              <span className="text-[14px] font-normal text-[#606060] tracking-[-0.28px] leading-[20px]">Approved</span>
            </div>
            <div className="flex gap-[10px] items-center">
              <span className="text-[20px] font-medium text-[#242424] leading-[28px]">{activeTooltip.approved.toLocaleString()}K</span>
              <div className="bg-[#E0F0E4] flex items-start px-[4px] py-[2px] rounded-[4px]">
                <span className="text-[12px] font-medium text-[#377E36] text-center leading-[16px]">+3.4%</span>
              </div>
            </div>
          </div>
          <div className="border border-[#F2F2F2] bg-white rounded-[8px] p-[12px] flex flex-col gap-[9px]">
            <div className="flex gap-[9px] items-center">
              <div className="size-[6px] rounded-full bg-[#FF8A00]" />
              <span className="text-[14px] font-normal text-[#606060] tracking-[-0.28px] leading-[20px]">Produced</span>
            </div>
            <div className="flex gap-[10px] items-center">
              <span className="text-[20px] font-medium text-[#242424] leading-[28px]">{activeTooltip.produced.toLocaleString()}K</span>
              <div className="bg-[#E0F0E4] flex items-start px-[4px] py-[2px] rounded-[4px]">
                <span className="text-[12px] font-medium text-[#377E36] text-center leading-[16px]">+3.4%</span>
              </div>
            </div>
          </div>
          <div className="border border-[#F2F2F2] bg-white rounded-[8px] p-[12px] flex flex-col gap-[9px]">
            <div className="flex gap-[9px] items-center">
              <div className="size-[6px] rounded-full bg-[#FF3D57]" />
              <span className="text-[14px] font-normal text-[#606060] tracking-[-0.28px] leading-[20px]">Rejected</span>
            </div>
            <div className="flex gap-[10px] items-center">
              <span className="text-[20px] font-medium text-[#242424] leading-[28px]">{activeTooltip.rejected}</span>
              <div className="bg-[#FFEEE5] flex items-start px-[4px] py-[2px] rounded-[4px]">
                <span className="text-[12px] font-medium text-[#D54800] text-center leading-[16px]">-0.4%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
