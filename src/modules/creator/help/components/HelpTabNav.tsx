"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export type HelpTab = "new-to-soludesk" | "knowledge-base" | "support";

const tabs: {
  id: HelpTab;
  label: string;
  activeIcon: string;
  inactiveIcon: string;
}[] = [
  {
    id: "new-to-soludesk",
    label: "New to Soludesk",
    activeIcon: "/assets/help/user-bold.svg",
    inactiveIcon: "/assets/help/user-bold.svg",
  },
  {
    id: "knowledge-base",
    label: "Knowledge Base",
    activeIcon: "/assets/help/book-linear.svg",
    inactiveIcon: "/assets/help/book-linear.svg",
  },
  {
    id: "support",
    label: "Support",
    activeIcon: "/assets/help/support-linear.svg",
    inactiveIcon: "/assets/help/support-linear.svg",
  },
];

interface HelpTabNavProps {
  active: HelpTab;
  onChange: (tab: HelpTab) => void;
}

export const HelpTabNav = ({ active, onChange }: HelpTabNavProps) => (
  <nav className="flex flex-col gap-[8px] w-full">
    {tabs.map(({ id, label, activeIcon, inactiveIcon }) => {
      const isActive = active === id;
      return (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={cn(
            "flex items-center gap-[10px] px-[12px] py-[10px] rounded-[8px] text-left w-full transition-all h-[44px]",
            isActive
              ? "bg-[#EBF3FF] text-[#0A60E1]"
              : "text-[#606060] hover:bg-sd-grey-1"
          )}
        >
          <Image
            src={isActive ? activeIcon : inactiveIcon}
            alt={label}
            width={24}
            height={24}
            className="shrink-0"
          />
          <span className="text-[16px] tracking-[-0.32px] leading-[24px] font-normal whitespace-nowrap">
            {label}
          </span>
        </button>
      );
    })}
  </nav>
);
