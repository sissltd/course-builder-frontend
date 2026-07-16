"use client";

import React from "react";
import { Button } from "@/components/shared/Button";

const Toggle = ({ defaultChecked }: { defaultChecked?: boolean }) => (
  <label className="relative inline-flex h-[24px] w-[46px] shrink-0 cursor-pointer items-center">
    <input type="checkbox" defaultChecked={defaultChecked} className="peer sr-only" />
    <span className="absolute inset-0 rounded-full bg-[#D9D9D9] transition-colors peer-checked:bg-[#0063EF]" />
    <span className="absolute left-[2px] top-[2px] size-[20px] rounded-full bg-white shadow transition-transform peer-checked:translate-x-[22px]" />
  </label>
);

export const PlatformTab = () => {
  return (
    <div className="flex flex-col gap-[24px] w-full">
      <div>
        <h3 className="text-[24px] font-medium text-[#202020] tracking-[-0.48px] leading-[32px]">Platform settings</h3>
        <p className="text-[16px] font-normal text-[#606060] leading-[24px]">Configure operational rules that governs creator and course behavior</p>
      </div>

      <div className="border border-[#F0F0F0] p-[16px] rounded-[12px]">
        <span className="text-[14px] font-medium text-[#202020] tracking-[-0.28px] leading-[20px] block mb-[20px]">TIMING &amp; THRESHOLDS</span>
        <div className="flex flex-col gap-[20px]">
          {[
            { title: "Draft minimum hold time", desc: "Minimum time a creator must wait before publishing a draft after creation" },
            { title: "Review stage time limit", desc: "Maximum time a course can stay in review before auto-escalation" },
            { title: "Production slot limit per creator", desc: "Maximum number of concurrent production slots a single creator can have" },
          ].map((item) => (
            <div key={item.title} className="flex items-center justify-between">
              <div className="max-w-[436px]">
                <p className="text-[16px] font-normal text-[#202020] tracking-[-0.32px] leading-[24px]">{item.title}</p>
                <p className="text-[14px] font-normal text-[#606060] tracking-[-0.28px] leading-[20px]">{item.desc}</p>
              </div>
              <Toggle defaultChecked />
            </div>
          ))}
        </div>
      </div>

      <div className="border border-[#F0F0F0] p-[16px] rounded-[12px]">
        <span className="text-[14px] font-medium text-[#202020] tracking-[-0.28px] leading-[20px] block mb-[20px]">ACCESS CONTROL</span>
        <div className="flex flex-col gap-[20px]">
          {[
            { title: "Allow creator self-registration", desc: "Allow new creators to sign up without admin approval" },
            { title: "Require email verification", desc: "New accounts must verify their email before accessing the platform" },
            { title: "Auto-approve trusted domains", desc: "Automatically approve accounts from trusted email domains" },
          ].map((item) => (
            <div key={item.title} className="flex items-center justify-between">
              <div className="max-w-[436px]">
                <p className="text-[16px] font-normal text-[#202020] tracking-[-0.32px] leading-[24px]">{item.title}</p>
                <p className="text-[14px] font-normal text-[#606060] tracking-[-0.28px] leading-[20px]">{item.desc}</p>
              </div>
              <Toggle defaultChecked />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button className="h-[44px] px-[32px] text-[14px]">Save Changes</Button>
      </div>
    </div>
  );
};
