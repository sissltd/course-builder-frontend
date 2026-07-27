import React from "react";

const chips = ["24 hrs", "7 days", "31 days", "6 months"];

export const TimeChipFilter = () => {
  return (
    <div className="flex gap-[4px] items-center flex-wrap">
      {chips.map((chip, i) => (
        <div
          key={chip}
          className={`flex h-[24px] items-center justify-center px-[8px] py-[4px] rounded-[6px] ${
            i === 1 ? "bg-[#C9E1FF] text-[#0A60E1]" : "bg-[#FDFDFD] text-[#606060]"
          }`}
        >
          <span className="text-[14px] font-normal tracking-[-0.28px] leading-[20px]">{chip}</span>
        </div>
      ))}
    </div>
  );
};
