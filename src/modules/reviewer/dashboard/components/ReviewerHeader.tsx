"use client";

import React from "react";
import {
  I24Support,
  Menu,
  Notification,
  Setting2,
  Timer,
} from "iconsax-react";

interface ReviewerHeaderProps {
  title?: string;
  onToggleSidebar?: () => void;
}

export const ReviewerHeader = ({ title = "REVIEWER DASHBOARD", onToggleSidebar }: ReviewerHeaderProps) => {
  return (
    <header className="h-[59px] bg-sd-grey-1 border-b border-sd-grey-3 flex items-center px-[12px] md:px-[40px] sticky top-0 z-30 ml-0 md:ml-[237px] gap-[10px]">
      <button
        onClick={onToggleSidebar}
        className="md:hidden hover:bg-sd-grey-2 rounded-lg transition-colors cursor-pointer shrink-0 flex items-center justify-center size-[32px]"
        aria-label="Toggle sidebar"
      >
        <Menu variant="Linear" size={20} color="var(--sd-reviewer-muted)" />
      </button>

      <div className="border-r border-sd-muted-text pr-[8px] flex items-center justify-center">
        <span className="text-[14px] font-medium text-sd-grey-12 tracking-[-0.28px] leading-[20px] whitespace-nowrap">
          {title}
        </span>
      </div>

      <div className="flex items-center gap-[8px] w-[142px]">
        <Timer variant="Bulk" size={18} color="var(--sd-reviewer-orange)" />
        <span className="text-[14px] font-normal text-sd-reviewer-muted tracking-[-0.28px] leading-[20px] whitespace-nowrap">
          05:32:04 min
        </span>
      </div>

      <div className="flex flex-1 items-center justify-end gap-[12px] min-w-0">
        <button className="hidden sm:flex items-center gap-[8px] border border-sd-grey-3 rounded-[6px] px-[8px] py-[4px] h-[32px] hover:bg-sd-grey-2 transition-colors cursor-pointer">
          <I24Support variant="Linear" size={20} color="var(--sd-reviewer-muted)" />
          <span className="text-[12px] font-normal text-sd-reviewer-muted tracking-[-0.24px] leading-[16px] whitespace-nowrap">
            Ask and support
          </span>
        </button>

        <button className="border border-sd-grey-3 rounded-[6px] p-[4px] size-[32px] flex items-center justify-center hover:bg-sd-grey-2 transition-colors cursor-pointer">
          <Notification variant="Linear" size={20} color="var(--sd-reviewer-muted)" />
        </button>

        <button className="border border-sd-grey-3 rounded-[6px] p-[4px] size-[32px] flex items-center justify-center hover:bg-sd-grey-2 transition-colors cursor-pointer">
          <Setting2 variant="Linear" size={20} color="var(--sd-reviewer-muted)" />
        </button>
      </div>
    </header>
  );
};
