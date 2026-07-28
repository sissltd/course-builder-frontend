"use client";

import React from "react";
import { TickCircle, InfoCircle } from "iconsax-react";

type StatusVariant = "Complete" | "In-progress" | "Error" | "Draft" | "Paused";

interface ProductionStatusChipProps {
  status: StatusVariant;
}

const config: Record<StatusVariant, { bg: string; textColor: string; icon: React.ReactNode }> = {
  Complete: {
    bg: "bg-[#F1F8F2]",
    textColor: "text-[#3C7E44]",
    icon: <TickCircle variant="Bold" size={16} color="#3C7E44" />,
  },
  "In-progress": {
    bg: "bg-[#EAF3FF]",
    textColor: "text-[#0A60E1]",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6.5" stroke="#0A60E1" strokeWidth="1.5" strokeDasharray="3 2" />
      </svg>
    ),
  },
  Error: {
    bg: "bg-[#FFEBE5]",
    textColor: "text-[#FF5025]",
    icon: <InfoCircle variant="Linear" size={16} color="#FF5025" />,
  },
  Draft: {
    bg: "bg-[#E6E6E6]",
    textColor: "text-[#202020]",
    icon: <TickCircle variant="Bold" size={16} color="#202020" />,
  },
  Paused: {
    bg: "bg-[#F0F0F0]",
    textColor: "text-[#202020]",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="3" y="2" width="3.5" height="12" rx="1" fill="#202020" />
        <rect x="9.5" y="2" width="3.5" height="12" rx="1" fill="#202020" />
      </svg>
    ),
  },
};

export const ProductionStatusChip = ({ status }: ProductionStatusChipProps) => {
  const c = config[status];
  return (
    <div className={`inline-flex items-center gap-[4px] h-[24px] px-[8px] py-[4px] rounded-[6px] ${c.bg}`}>
      {c.icon}
      <span className={`text-[12px] font-normal leading-[16px] ${c.textColor}`}>{status === "In-progress" ? "In-progress (50%)" : status}</span>
    </div>
  );
};
