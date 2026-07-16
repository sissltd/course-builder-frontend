"use client";

import React from "react";
import { Timer1, Data, Money } from "iconsax-react";
import { AdminStatCard } from "@/modules/admin/dashboard/components/AdminStatCard";
import { PipelineProgressBar } from "./components/PipelineProgressBar";

const pipelineItems = [
  { label: "Topic Intake", value: 190, max: 200 },
  { label: "Curriculum", value: 183, max: 200 },
  { label: "Content Generation", value: 184, max: 200 },
  { label: "Assessment Builder", value: 184, max: 200 },
  { label: "Media Production", value: 184, max: 200 },
  { label: "Preview Video", value: 172, max: 200 },
  { label: "Assembly and Packaging", value: 175, max: 200 },
  { label: "Auto-QA", value: 170, max: 200 },
];

export const ApePipelineView = () => {
  return (
    <div className="flex flex-col gap-[24px]">
      <div className="flex gap-[16px]">
        <AdminStatCard
          icon={<Timer1 variant="Bold" size={20} color="#202020" />}
          label="Active Jobs"
          value="203"
          trend="25 Concurrent instances"
        />
        <AdminStatCard
          icon={<Data variant="Bold" size={20} color="#202020" />}
          label="Queue Depth"
          value="100"
          trend="3.2hr Est. to clear"
        />
        <AdminStatCard
          icon={<Money variant="Bold" size={20} color="#202020" />}
          label="Completed Today"
          value="150"
          trend="On Track for 210+"
        />
        <AdminStatCard
          icon={<Money variant="Bold" size={20} color="#202020" />}
          label="Failed / Retry"
          value="12"
          trend="20 Auto-retrying"
        />
      </div>

      <div className="bg-[#FDFDFD] border border-[#F0F0F0] rounded-[12px] p-[19px]">
        <div className="flex gap-[8px] items-start mb-[48px]">
          <Timer1 variant="Bold" size={20} color="#202020" />
          <span className="text-[14px] font-normal text-[#202020] tracking-[-0.28px] leading-[20px]">
            Overall Uptime
          </span>
        </div>
        <div className="flex flex-col gap-[16px]">
          {pipelineItems.map((item) => (
            <PipelineProgressBar key={item.label} {...item} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-[16px]">
        <div className="flex gap-[16px]">
          <div className="border border-[#E8E8E8] bg-[#FDFDFD] flex flex-col flex-1 h-[120px] items-start justify-between p-[16px] relative rounded-[12px] shadow-[inset_0px_-4px_8px_0px_rgba(255,255,255,0.2),inset_0px_4px_8px_0px_rgba(255,255,255,0.16)]">
            <span className="text-[20px] font-medium text-[#202020] tracking-[-0.4px] leading-[28px]">WellSaid Labs (Voice)</span>
            <div className="flex gap-[12px] items-start">
              <span className="text-[16px] font-normal leading-[24px]">
                <span className="text-[#202020]">Load:</span>{' '}<span className="text-[#606060]">89%</span>
              </span>
              <span className="text-[16px] font-normal leading-[24px]">
                <span className="text-[#202020]">Queue:</span>{' '}<span className="text-[#606060]">12</span>
              </span>
            </div>
          </div>
          <div className="border border-[#E8E8E8] bg-[#FDFDFD] flex flex-col flex-1 h-[120px] items-start justify-between p-[16px] relative rounded-[12px] shadow-[inset_0px_-4px_8px_0px_rgba(255,255,255,0.2),inset_0px_4px_8px_0px_rgba(255,255,255,0.16)]">
            <span className="text-[20px] font-medium text-[#202020] tracking-[-0.4px] leading-[28px]">Murf AI (Voice)</span>
            <div className="flex gap-[12px] items-start">
              <span className="text-[16px] font-normal leading-[24px]">
                <span className="text-[#202020]">Load:</span>{' '}<span className="text-[#606060]">89%</span>
              </span>
              <span className="text-[16px] font-normal leading-[24px]">
                <span className="text-[#202020]">Queue:</span>{' '}<span className="text-[#606060]">12</span>
              </span>
            </div>
          </div>
          <div className="border border-[#E8E8E8] bg-[#FDFDFD] flex flex-col flex-1 h-[120px] items-start justify-between p-[16px] relative rounded-[12px] shadow-[inset_0px_-4px_8px_0px_rgba(255,255,255,0.2),inset_0px_4px_8px_0px_rgba(255,255,255,0.16)]">
            <span className="text-[20px] font-medium text-[#202020] tracking-[-0.4px] leading-[28px]">Google TTS (Fallback)</span>
            <div className="flex gap-[12px] items-start">
              <span className="text-[16px] font-normal leading-[24px]">
                <span className="text-[#202020]">Load:</span>{' '}<span className="text-[#606060]">89%</span>
              </span>
              <span className="text-[16px] font-normal leading-[24px]">
                <span className="text-[#202020]">Queue:</span>{' '}<span className="text-[#606060]">12</span>
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-[16px]">
          <div className="border border-[#E8E8E8] bg-[#FDFDFD] flex flex-col flex-1 h-[120px] items-start justify-between p-[16px] relative rounded-[12px] shadow-[inset_0px_-4px_8px_0px_rgba(255,255,255,0.2),inset_0px_4px_8px_0px_rgba(255,255,255,0.16)]">
            <span className="text-[20px] font-medium text-[#202020] tracking-[-0.4px] leading-[28px]">Colossyan (Video)</span>
            <div className="flex gap-[12px] items-start">
              <span className="text-[16px] font-normal leading-[24px]">
                <span className="text-[#202020]">Load:</span>{' '}<span className="text-[#606060]">89%</span>
              </span>
              <span className="text-[16px] font-normal leading-[24px]">
                <span className="text-[#202020]">Queue:</span>{' '}<span className="text-[#606060]">12</span>
              </span>
            </div>
          </div>
          <div className="border border-[#E8E8E8] bg-[#FDFDFD] flex flex-col flex-1 h-[120px] items-start justify-between p-[16px] relative rounded-[12px] shadow-[inset_0px_-4px_8px_0px_rgba(255,255,255,0.2),inset_0px_4px_8px_0px_rgba(255,255,255,0.16)]">
            <span className="text-[20px] font-medium text-[#202020] tracking-[-0.4px] leading-[28px]">Synthesia (Video)</span>
            <div className="flex gap-[12px] items-start">
              <span className="text-[16px] font-normal leading-[24px]">
                <span className="text-[#202020]">Load:</span>{' '}<span className="text-[#606060]">89%</span>
              </span>
              <span className="text-[16px] font-normal leading-[24px]">
                <span className="text-[#202020]">Queue:</span>{' '}<span className="text-[#606060]">12</span>
              </span>
            </div>
          </div>
          <div className="border border-[#E8E8E8] bg-[#FDFDFD] flex flex-col flex-1 h-[120px] items-start justify-between p-[16px] relative rounded-[12px] shadow-[inset_0px_-4px_8px_0px_rgba(255,255,255,0.2),inset_0px_4px_8px_0px_rgba(255,255,255,0.16)]">
            <span className="text-[20px] font-medium text-[#202020] tracking-[-0.4px] leading-[28px]">HeyGen (Video)</span>
            <div className="flex gap-[12px] items-start">
              <span className="text-[16px] font-normal leading-[24px]">
                <span className="text-[#202020]">Load:</span>{' '}<span className="text-[#606060]">89%</span>
              </span>
              <span className="text-[16px] font-normal leading-[24px]">
                <span className="text-[#202020]">Queue:</span>{' '}<span className="text-[#606060]">12</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
