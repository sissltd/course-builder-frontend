import React from "react";

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

export const ApePipeline = () => {
  return (
    <div className="bg-[#FDFDFD] border border-[#F0F0F0] rounded-[12px] p-[24px] flex-1">
      <div className="flex items-center justify-between mb-[24px]">
        <h3 className="text-[16px] font-medium text-[#202020] tracking-[-0.32px] leading-[24px]">
          APE Pipeline
        </h3>
        <span className="text-[14px] font-normal text-[#606060] tracking-[-0.28px] leading-[20px]">
          Aug 12 - Aug 18
        </span>
      </div>
      <div className="flex flex-col gap-[20px]">
        {pipelineItems.map((item) => {
          const percentage = (item.value / item.max) * 100;
          const isLow = percentage < 86;
          return (
            <div key={item.label} className="flex flex-col gap-[8px]">
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-normal text-[#202020] tracking-[-0.28px] leading-[20px]">
                  {item.label}
                </span>
                <span className="text-[14px] font-normal text-[#606060] tracking-[-0.28px] leading-[20px]">
                  {item.value}
                </span>
              </div>
              <div className="h-[8px] bg-[#F0F0F0] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isLow ? "bg-[#FF5025]" : "bg-[#0063EF]"
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
