"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  UserRound,
  Eye,
  List,
  Bell,
  Shield,
  MapPin,
} from "lucide-react";

export type ReviewerSettingsTab =
  | "account"
  | "availability"
  | "queue-behaviour"
  | "notifications"
  | "login-security"
  | "data-privacy";

const tabs: { id: ReviewerSettingsTab; label: string; Icon: React.ElementType }[] = [
  { id: "account", label: "Account", Icon: UserRound },
  { id: "availability", label: "Availability", Icon: Eye },
  { id: "queue-behaviour", label: "Queue Behaviour", Icon: List },
  { id: "notifications", label: "Notifications", Icon: Bell },
  { id: "login-security", label: "Log in & Security", Icon: Shield },
  { id: "data-privacy", label: "Data and Privacy", Icon: MapPin },
];

interface ReviewerSettingsTabNavProps {
  active: ReviewerSettingsTab;
  onChange: (tab: ReviewerSettingsTab) => void;
}

export const ReviewerSettingsTabNav = ({ active, onChange }: ReviewerSettingsTabNavProps) => (
  <nav className="no-scrollbar flex w-full gap-[6px] overflow-x-auto px-[4px] md:flex-col md:overflow-visible md:px-0">
    {tabs.map(({ id, label, Icon }) => {
      const isActive = active === id;
      return (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={cn(
            "flex h-[44px] w-auto shrink-0 items-center gap-[8px] rounded-[10px] px-[12px] text-left transition-colors cursor-pointer md:w-full md:gap-[12px] md:px-[14px]",
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
