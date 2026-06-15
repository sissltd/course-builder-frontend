import React from "react";
import { cn } from "@/lib/utils";

interface OptionSelectProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
}

export const OptionSelect = ({ label, selected, onSelect }: OptionSelectProps) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex items-center gap-[12px] w-full text-left transition-colors group",
        "py-3 px-2 rounded-md hover:bg-gray-50"
      )}
    >
      <div 
        className={cn(
          "size-[24px] rounded-full border-[2px] flex items-center justify-center transition-colors shrink-0",
          selected ? "border-[#0063EF] bg-[#0063EF]" : "border-[#D9D9D9] group-hover:border-[#0063EF]"
        )}
      >
        {selected && (
          <div className="size-[8px] bg-white rounded-full" />
        )}
      </div>
      <span className={cn(
        "font-sans font-normal text-body-lg tracking-[-0.32px]",
        selected ? "text-sd-grey-12 font-medium" : "text-sd-grey-11"
      )}>
        {label}
      </span>
    </button>
  );
};
