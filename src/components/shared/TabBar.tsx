"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface TabBarItem {
  key: string;
  label: string;
}

interface TabBarProps {
  tabs: TabBarItem[];
  activeKey: string;
  onChange: (key: string) => void;
  className?: string;
}

export const TabBar = ({ tabs, activeKey, onChange, className }: TabBarProps) => {
  return (
    <div className={cn("flex border-b border-[#F0F0F0] overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:h-0", className)}>
      {tabs.map((tab) => {
        const isActive = activeKey === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={cn(
              "h-[40px] px-[12px] text-[14px] font-normal leading-[20px] transition-colors relative cursor-pointer shrink-0",
              isActive
                ? "text-[#0063EF]"
                : "text-[#606060]"
            )}
          >
            {tab.label}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0063EF]" />
            )}
          </button>
        );
      })}
    </div>
  );
};
