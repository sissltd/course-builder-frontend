import React from "react";

interface ReviewerPlaceholderViewProps {
  title: string;
  description?: string;
}

export const ReviewerPlaceholderView = ({
  title,
  description,
}: ReviewerPlaceholderViewProps) => {
  return (
    <div className="flex flex-col gap-[16px]">
      <h1 className="text-[24px] font-medium text-sd-grey-12 tracking-[-0.48px] leading-[32px]">
        {title}
      </h1>
      {description && (
        <p className="text-[16px] font-normal text-sd-reviewer-muted leading-[24px]">
          {description}
        </p>
      )}
      <div className="border border-dashed border-sd-grey-6 rounded-[12px] p-[48px] flex items-center justify-center mt-[24px] bg-sd-grey-1">
        <span className="text-[16px] font-normal text-sd-muted-text">
          Coming soon
        </span>
      </div>
    </div>
  );
};
