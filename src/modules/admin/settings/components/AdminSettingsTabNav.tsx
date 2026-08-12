"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  Award,
  Bell,
  CreditCard,
  Eye,
  Shield,
  SlidersVertical,
  UserRound,
} from "lucide-react";

export type AdminSettingsTab =
  | "account"
  | "notifications"
  | "permissions"
  | "platform"
  | "payments"
  | "achievement-awards"
  | "security";

const tabs: { id: AdminSettingsTab; label: string; Icon: React.ElementType }[] = [
  { id: "account", label: "Account", Icon: UserRound },
  { id: "notifications", label: "Notifications", Icon: Bell },
  { id: "permissions", label: "Permissions", Icon: SlidersVertical },
  { id: "platform", label: "Platform", Icon: Eye },
  { id: "payments", label: "Payments", Icon: CreditCard },
  { id: "achievement-awards", label: "Achievement badge", Icon: Award },
  { id: "security", label: "Security", Icon: Shield },
];

interface AdminSettingsTabNavProps {
  active: AdminSettingsTab;
  onChange: (tab: AdminSettingsTab) => void;
}

export const AdminSettingsTabNav = ({ active, onChange }: AdminSettingsTabNavProps) => (
  <nav className="flex w-full flex-col gap-[6px]">
    {tabs.map(({ id, label, Icon }) => {
      const isActive = active === id;
      return (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={cn(
            "flex h-[44px] w-full items-center gap-[12px] rounded-[10px] px-[14px] text-left transition-colors cursor-pointer",
            isActive ? "bg-sd-grey-3" : "hover:bg-sd-grey-2"
          )}
        >
          <Icon size={22} strokeWidth={1.8} className="text-sd-grey-11" />
          <span
            className={cn(
              "text-[16px] font-normal tracking-[-0.32px] leading-[24px]",
              isActive ? "text-sd-grey-12" : "text-sd-grey-11"
            )}
          >
            {label}
          </span>
        </button>
      );
    })}
  </nav>
);
