"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  User,
  Notification,
  Setting2,
  Eye,
  Money,
  Security,
} from "iconsax-react";

export type AdminSettingsTab =
  | "account"
  | "notifications"
  | "permissions"
  | "platform"
  | "payments"
  | "security";

const tabs: { id: AdminSettingsTab; label: string; Icon: React.ElementType }[] = [
  { id: "account",       label: "Account",       Icon: User },
  { id: "notifications", label: "Notifications",  Icon: Notification },
  { id: "permissions",   label: "Permissions",    Icon: Setting2 },
  { id: "platform",      label: "Platform",       Icon: Eye },
  { id: "payments",      label: "Payments",       Icon: Money },
  { id: "security",      label: "Security",       Icon: Security },
];

interface AdminSettingsTabNavProps {
  active: AdminSettingsTab;
  onChange: (tab: AdminSettingsTab) => void;
}

export const AdminSettingsTabNav = ({ active, onChange }: AdminSettingsTabNavProps) => (
  <nav className="flex flex-col gap-[8px] w-full">
    {tabs.map(({ id, label, Icon }) => {
      const isActive = active === id;
      return (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={cn(
            "flex items-center gap-[10px] h-[44px] px-[12px] py-[12px] rounded-[8px] w-full text-left transition-all",
            isActive
              ? "bg-[#EBF3FF]"
              : "hover:bg-sd-grey-1"
          )}
        >
          <Icon
            size={24}
            variant={isActive ? "Bold" : "Linear"}
            color={isActive ? "#0063EF" : "#606060"}
          />
          <span
            className={cn(
              "text-[16px] tracking-[-0.32px] leading-[24px]",
              isActive ? "text-[#0063EF]" : "text-[#606060]"
            )}
          >
            {label}
          </span>
        </button>
      );
    })}
  </nav>
);
