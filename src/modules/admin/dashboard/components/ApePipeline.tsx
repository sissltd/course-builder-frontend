import React from "react";
import { useGetAdminPipelineQuery } from "@/redux/slices/adminApi";

export const ApePipeline = () => {
  const { data, isLoading } = useGetAdminPipelineQuery();

  const stages = data?.stages || [];

  return (
    <div className="bg-[#FDFDFD] border border-[#F0F0F0] rounded-[12px] p-[24px] flex-1 min-w-[320px]">
      <div className="flex items-center justify-between mb-[24px]">
        <h3 className="text-[16px] font-medium text-[#202020] tracking-[-0.32px] leading-[24px]">
          APE Pipeline
        </h3>
        <span className="text-[14px] font-normal text-[#606060] tracking-[-0.28px] leading-[20px]">
          {isLoading
            ? "Loading..."
            : data?.active_jobs != null
            ? `${data.active_jobs} Active Jobs`
            : "Live funnel"}
        </span>
      </div>
      <div className="flex flex-col gap-[20px]">
        {isLoading ? (
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col gap-[8px] animate-pulse">
              <div className="h-[14px] w-[140px] bg-[#EAEAEA] rounded" />
              <div className="h-[8px] bg-[#F0F0F0] rounded-full" />
            </div>
          ))
        ) : stages.length > 0 ? (
          stages.map((item) => {
            const total = item.total || 0;
            const completed = item.completed || 0;
            const percentage = total > 0 ? (completed / total) * 100 : 0;
            const isLow = percentage < 50 && total > 0;
            return (
              <div key={item.stage} className="flex flex-col gap-[8px]">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-normal text-[#202020] tracking-[-0.28px] leading-[20px]">
                    {item.label}
                  </span>
                  <span className="text-[14px] font-normal text-[#606060] tracking-[-0.28px] leading-[20px]">
                    {completed} / {total}
                  </span>
                </div>
                <div className="h-[8px] bg-[#F0F0F0] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.failed > 0
                        ? "bg-[#FF3D57]"
                        : isLow
                        ? "bg-[#FF8A00]"
                        : "bg-[#0063EF]"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-[13px] text-[#888] py-[16px] text-center">
            No pipeline stages available.
          </div>
        )}
      </div>
    </div>
  );
};
