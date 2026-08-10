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
  tabClassName?: string;
  activeTabClassName?: string;
  inactiveTabClassName?: string;
  indicatorClassName?: string;
}

export const TabBar = ({
  tabs,
  activeKey,
  onChange,
  className,
  tabClassName,
  activeTabClassName,
  inactiveTabClassName,
  indicatorClassName,
}: TabBarProps) => {
  return (
    <div className={cn("flex border-b border-sd-grey-3 overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:h-0", className)}>
      {tabs.map((tab) => {
        const isActive = activeKey === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={cn(
              "h-[40px] px-[12px] text-[14px] font-normal leading-[20px] transition-colors relative cursor-pointer shrink-0",
              tabClassName,
              isActive
                ? cn("text-sd-blue", activeTabClassName)
                : cn("text-sd-grey-11", inactiveTabClassName)
            )}
          >
            {tab.label}
            {isActive && (
              <div className={cn("absolute bottom-0 left-0 right-0 h-0.5 bg-sd-blue", indicatorClassName)} />
            )}
          </button>
        );
      })}
    </div>
  );
};
