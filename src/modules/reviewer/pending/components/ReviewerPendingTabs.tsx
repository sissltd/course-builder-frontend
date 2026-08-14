import React from "react";
import { cn } from "@/lib/utils";

const tabs = [
  { key: "creators", label: "Creators" },
  { key: "ai", label: "Created with AI" },
];

interface ReviewerPendingTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const ReviewerPendingTabs = ({ activeTab, onTabChange }: ReviewerPendingTabsProps) => {
  return (
    <div className="border-b border-sd-grey-3">
      <div className="flex items-center gap-[24px]">
        {tabs.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTabChange(tab.key)}
              className={cn(
                "relative pb-[12px] text-[16px] font-normal leading-[24px] transition-colors",
                active ? "text-sd-grey-12" : "text-sd-muted-text",
              )}
            >
              {tab.label}
              {active && <span className="absolute inset-x-0 bottom-0 h-px bg-sd-grey-12" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
