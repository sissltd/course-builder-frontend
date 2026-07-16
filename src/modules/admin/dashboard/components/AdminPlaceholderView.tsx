import React from "react";

interface AdminPlaceholderViewProps {
  title: string;
  description?: string;
}

export const AdminPlaceholderView = ({ title, description }: AdminPlaceholderViewProps) => {
  return (
    <div className="flex flex-col gap-[16px]">
      <h1 className="text-[24px] font-medium text-[#202020] tracking-[-0.48px] leading-[32px]">
        {title}
      </h1>
      {description && (
        <p className="text-[16px] font-normal text-[#606060] leading-[24px]">
          {description}
        </p>
      )}
      <div className="border border-dashed border-[#D9D9D9] rounded-[12px] p-[48px] flex items-center justify-center mt-[24px]">
        <span className="text-[16px] font-normal text-[#B6B6B6]">Coming soon</span>
      </div>
    </div>
  );
};
