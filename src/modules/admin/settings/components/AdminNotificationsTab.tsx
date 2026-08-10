"use client";

import React from "react";
import { Button } from "@/components/shared/Button";

const Toggle = ({ defaultChecked }: { defaultChecked?: boolean }) => (
  <label className="relative inline-flex h-[24px] w-[46px] shrink-0 cursor-pointer items-center">
    <input type="checkbox" defaultChecked={defaultChecked} className="peer sr-only" />
    <span className="absolute inset-0 rounded-full bg-sd-grey-6 transition-colors peer-checked:bg-sd-blue" />
    <span className="absolute left-[2px] top-[2px] size-[20px] rounded-full bg-white shadow transition-transform peer-checked:translate-x-[22px]" />
  </label>
);

export const AdminNotificationsTab = () => {
  return (
    <div className="flex flex-col gap-[24px] w-full">
      <div>
        <h3 className="text-[22px] font-medium text-sd-grey-12 tracking-[-0.48px] leading-[32px]">Notification settings</h3>
        <p className="text-[14px] font-normal text-sd-grey-11 leading-[24px]">Configure how your events demonstrate</p>
      </div>

      <div className="flex flex-col gap-[32px]">
        <div className="rounded-[12px] border border-sd-grey-3 p-[16px]">
          <span className="text-[14px] font-medium text-sd-grey-12 tracking-[-0.28px] leading-[20px] block mb-[20px]">NOTIFICATION CHANNELS</span>
          <div className="flex flex-col gap-[20px]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[16px] font-normal text-sd-grey-12 tracking-[-0.32px] leading-[24px]">Email Notifications</p>
                <p className="text-[14px] font-normal text-sd-grey-11 tracking-[-0.28px] leading-[20px]">Receive notifications via email</p>
              </div>
              <Toggle defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[16px] font-normal text-sd-grey-12 tracking-[-0.32px] leading-[24px]">In-app Notifications</p>
                <p className="text-[14px] font-normal text-sd-grey-11 tracking-[-0.28px] leading-[20px]">Receive notifications in-app</p>
              </div>
              <Toggle defaultChecked />
            </div>
          </div>
        </div>

        <div className="rounded-[12px] border border-sd-grey-3 p-[16px]">
          <span className="text-[14px] font-medium text-sd-grey-12 tracking-[-0.28px] leading-[20px] block mb-[20px]">SYSTEM</span>
          <div className="flex flex-col gap-[20px]">
            {[
              { title: "APE daily production summary", desc: "Daily report of courses produced, pass rate, failures and cost" },
              { title: "Provider failover alert", desc: "Notify admin immediately when a primary AI provider goes down" },
              { title: "Review SLA Breach Alert", desc: "Notify admin when a course has been in review beyond 36-hour warning threshold" },
              { title: "Multi-account Fraud Cluster Detection", desc: "Notify admin when a cluster of accounts are flagged for potential fraud" },
              { title: "MIE Daily Proposal Batch", desc: "Notify admin at 00:00 WAT when the Market Intelligence Engine batch is ready for approval" },
            ].map((item) => (
              <div key={item.title} className="flex items-center justify-between">
                <div className="max-w-[436px]">
                  <p className="text-[16px] font-normal text-sd-grey-12 tracking-[-0.32px] leading-[24px]">{item.title}</p>
                  <p className="text-[14px] font-normal text-sd-grey-11 tracking-[-0.28px] leading-[20px]">{item.desc}</p>
                </div>
                <Toggle defaultChecked />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[12px] border border-sd-grey-3 p-[16px]">
          <span className="text-[14px] font-medium text-sd-grey-12 tracking-[-0.28px] leading-[20px] block mb-[20px]">PREFERENCE</span>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[16px] font-normal text-sd-grey-12 tracking-[-0.32px] leading-[24px]">Course Update</p>
              <p className="text-[14px] font-normal text-sd-grey-11 tracking-[-0.28px] leading-[20px]">Notify admin when there&apos;s a change in status about a course</p>
            </div>
            <Toggle />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button className="h-[44px] px-[32px] text-[14px]">Save Changes</Button>
      </div>
    </div>
  );
};
