import React from "react";
import { SettingsView } from "@/modules/creator/settings/SettingsView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-[24px]">
      <h1 className="text-[24px] font-semibold text-[#202020] tracking-[-0.48px] leading-[32px]">Settings</h1>
      <SettingsView />
    </div>
  );
}
