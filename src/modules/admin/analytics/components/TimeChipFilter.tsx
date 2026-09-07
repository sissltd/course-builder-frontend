import React from "react";

export interface TimeChipOption {
  label: string;
  value: string;
}

const defaultOptions: TimeChipOption[] = [
  { label: "24 hrs", value: "24h" },
  { label: "7 days", value: "7d" },
  { label: "31 days", value: "30d" },
  { label: "6 months", value: "180d" },
];

interface TimeChipFilterProps {
  value?: string;
  onChange?: (value: string) => void;
  options?: TimeChipOption[];
}

export const TimeChipFilter: React.FC<TimeChipFilterProps> = ({
  value = "7d",
  onChange,
  options = defaultOptions,
}) => {
  return (
    <div className="flex gap-[6px] items-center flex-wrap">
      {options.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange?.(option.value)}
            className={`flex h-[28px] items-center justify-center px-[10px] py-[4px] rounded-[6px] transition-colors cursor-pointer text-[13px] font-medium tracking-[-0.2px] leading-[18px] ${
              isActive
                ? "bg-[#C9E1FF] text-[#0A60E1] font-semibold"
                : "bg-[#FDFDFD] text-[#606060] hover:bg-[#F2F2F2] border border-[#E8E8E8]"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
