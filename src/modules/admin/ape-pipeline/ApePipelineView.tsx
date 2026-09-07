"use client";

import React from "react";
import { Timer1, Data, TickCircle, CloseCircle, Refresh2 } from "iconsax-react";
import { AdminStatCard } from "@/modules/admin/dashboard/components/AdminStatCard";
import { PipelineProgressBar } from "./components/PipelineProgressBar";
import { useGetAdminPipelineQuery } from "@/redux/slices/adminApi";

export const ApePipelineView = () => {
  const { data, isLoading, isError, refetch } = useGetAdminPipelineQuery();

  const stages = data?.stages || [];
  const providers = data?.providers || [];

  return (
    <div className="flex flex-col gap-[24px]">
      <div className="flex items-center justify-between flex-wrap gap-[12px]">
        <div>
          <h2 className="text-[18px] font-semibold text-[#202020] tracking-[-0.36px]">
            APE Production Pipeline
          </h2>
          <p className="text-[13px] text-[#606060]">
            Monitor automated course generation jobs, stage progress, and external AI providers.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-[6px] px-[12px] py-[6px] text-[13px] text-[#0A60E1] bg-[#EBF3FF] hover:bg-[#D9E9FF] rounded-[6px] cursor-pointer transition-colors"
        >
          <Refresh2 size={16} />
          <span>Refresh Pipeline</span>
        </button>
      </div>

      <div className="flex gap-[16px] flex-wrap">
        <AdminStatCard
          icon={<Timer1 variant="Bold" size={20} color="#202020" />}
          label="Active Jobs"
          value={isLoading ? "..." : (data?.active_jobs != null ? data.active_jobs.toString() : "0")}
          trend="In processing"
        />
        <AdminStatCard
          icon={<Data variant="Bold" size={20} color="#202020" />}
          label="Queue Depth"
          value={isLoading ? "..." : (data?.queue_depth != null ? data.queue_depth.toString() : "0")}
          trend="Pending queue"
        />
        <AdminStatCard
          icon={<TickCircle variant="Bold" size={20} color="#202020" />}
          label="Completed Today"
          value={isLoading ? "..." : (data?.completed_today != null ? data.completed_today.toString() : "0")}
          trend="Finished runs"
        />
        <AdminStatCard
          icon={<CloseCircle variant="Bold" size={20} color="#202020" />}
          label="Failed / Retrying"
          value={isLoading ? "..." : (data?.failed_or_retrying != null ? data.failed_or_retrying.toString() : "0")}
          trend={
            data?.avg_pipeline_seconds != null
              ? `${Math.round(data.avg_pipeline_seconds / 60)} min avg pipeline`
              : "No duration recorded"
          }
        />
      </div>

      <div className="bg-[#FDFDFD] border border-[#F0F0F0] rounded-[12px] p-[20px] md:p-[24px]">
        <div className="flex items-center justify-between flex-wrap gap-[12px] mb-[28px]">
          <div className="flex gap-[8px] items-center">
            <Timer1 variant="Bold" size={20} color="#202020" />
            <span className="text-[15px] font-medium text-[#202020] tracking-[-0.28px]">
              Production Stages Funnel
            </span>
          </div>
          <div className="flex items-center gap-[14px] text-[12px] text-[#606060]">
            <div className="flex items-center gap-[4px]">
              <div className="size-[8px] rounded-full bg-[#0063EF]" />
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-[4px]">
              <div className="size-[8px] rounded-full bg-[#FF8A00]" />
              <span>Active</span>
            </div>
            <div className="flex items-center gap-[4px]">
              <div className="size-[8px] rounded-full bg-[#FF3D57]" />
              <span>Failed</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-[16px]">
          {isLoading ? (
            <div className="py-[32px] text-center text-[#888] text-[13px] animate-pulse">
              Loading pipeline stages...
            </div>
          ) : stages.length > 0 ? (
            stages.map((item) => (
              <PipelineProgressBar
                key={item.stage}
                label={item.label}
                total={item.total}
                active={item.active}
                completed={item.completed}
                failed={item.failed}
              />
            ))
          ) : (
            <div className="py-[24px] text-center text-[#888] text-[13px]">
              No active pipeline stages recorded.
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-[16px]">
        <div>
          <h3 className="text-[16px] font-medium text-[#202020] tracking-[-0.32px]">
            External AI Providers
          </h3>
          <p className="text-[13px] text-[#606060]">
            Last-known load and queue depth per video, voice, and fallback provider.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]">
          {isLoading ? (
            [1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="border border-[#E8E8E8] bg-[#FDFDFD] h-[120px] rounded-[12px] animate-pulse p-[16px]"
              />
            ))
          ) : providers.length > 0 ? (
            providers.map((provider) => (
              <div
                key={provider.id}
                className="border border-[#E8E8E8] bg-[#FDFDFD] flex flex-col justify-between p-[16px] rounded-[12px] shadow-[inset_0px_-4px_8px_0px_rgba(255,255,255,0.2),inset_0px_4px_8px_0px_rgba(255,255,255,0.16)] min-h-[120px]"
              >
                <div className="flex items-start justify-between gap-[8px]">
                  <span className="text-[16px] font-medium text-[#202020] tracking-[-0.32px] leading-[22px]">
                    {provider.name}
                  </span>
                  <span className="text-[11px] uppercase tracking-wider font-semibold px-[6px] py-[2px] rounded bg-[#F0F0F0] text-[#606060]">
                    {provider.kind}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-[12px]">
                  <div className="flex gap-[12px] items-center">
                    <span className="text-[14px] font-normal leading-[20px]">
                      <span className="text-[#202020] font-medium">Load:</span>{" "}
                      <span className="text-[#606060]">
                        {provider.load_percent != null ? `${provider.load_percent}%` : "—"}
                      </span>
                    </span>
                    <span className="text-[14px] font-normal leading-[20px]">
                      <span className="text-[#202020] font-medium">Queue:</span>{" "}
                      <span className="text-[#606060]">
                        {provider.queue_depth != null ? provider.queue_depth : "—"}
                      </span>
                    </span>
                  </div>
                  <span className="text-[11px] text-[#888] text-right">
                    {provider.readings_updated_at
                      ? `Updated ${new Date(provider.readings_updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                      : "No readings"}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-[24px] text-center text-[#888] text-[13px] bg-[#FDFDFD] rounded-[12px] border border-[#F0F0F0]">
              No external providers configured.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
