"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  User,
  ReceiptItem,
  Notification,
  ShieldTick,
  UserEdit,
} from "iconsax-react";

export type SettingsTab =
  | "account"
  | "payment"
  | "notifications"
  | "security"
  | "privacy";

const tabs: { id: SettingsTab; label: string; Icon: React.ElementType }[] = [
  { id: "account",       label: "Account settings",        Icon: User },
  { id: "payment",       label: "Payment",                 Icon: ReceiptItem },
  { id: "notifications", label: "Notifications",           Icon: Notification },
  { id: "security",      label: "Log in & Security",       Icon: ShieldTick },
  { id: "privacy",       label: "Privacy & Terms of service", Icon: UserEdit },
];

interface SettingsTabNavProps {
  active: SettingsTab;
  onChange: (tab: SettingsTab) => void;
}

export const SettingsTabNav = ({ active, onChange }: SettingsTabNavProps) => (
  <nav className="flex flex-col gap-[4px] w-full">
    {tabs.map(({ id, label, Icon }) => {
      const isActive = active === id;
      return (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={cn(
            "flex items-center gap-[10px] px-[14px] py-[10px] rounded-[10px] text-left w-full transition-colors",
            isActive
              ? "bg-[#EBF3FF] text-[#0063EF]"
              : "text-[#636363] hover:bg-[#F5F5F5]"
          )}
        >
          <Icon
            size={20}
            variant={isActive ? "Bold" : "Linear"}
            color={isActive ? "#0063EF" : "#636363"}
          />
          <span className="text-[14px] tracking-[-0.28px] leading-[20px] font-medium">
            {label}
          </span>
        </button>
      );
    })}
  </nav>
);
