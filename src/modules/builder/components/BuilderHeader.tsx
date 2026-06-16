"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  ArrowLeft, 
  Note, 
  Add, 
  Global, 
  Eye,
} from "iconsax-react";

interface BuilderHeaderProps {
  moduleName?: string;
  onBackToModules?: () => void;
}

export const BuilderHeader = ({ moduleName, onBackToModules }: BuilderHeaderProps) => {
  const router = useRouter();

  return (
    <div className="h-[70px] w-full bg-white border-b border-[#F0F0F0] px-[24px] py-[12px] flex items-center justify-between z-10 sticky top-0 shrink-0">
      
      {/* Left Section */}
      <div className="flex items-center gap-[12px]">
        {/* Back Button */}
        <button 
          onClick={onBackToModules || (() => router.back())}
          className="flex items-center gap-[6px] h-[40px] px-[10px] text-[#202020] hover:text-[#0A60E1] transition-colors"
        >
          <ArrowLeft size={18} variant="Linear" color="#202020" />
          <span className="text-[14px] font-medium leading-[20px] tracking-[-0.28px]">Back</span>
        </button>

        <div className="h-[20px] w-px bg-[#F0F0F0]" />

        {/* Note Icon Container */}
        <div className="size-[32px] bg-[#EAF3FF] rounded-[6px] flex items-center justify-center shrink-0 ml-[4px]">
          <Note size={18} variant="Bold" color="#0A60E1" />
        </div>

        {/* Title */}
        <span className="text-[16px] font-semibold text-[#202020] leading-[24px] whitespace-nowrap">
          {moduleName ? (
            <span className="flex items-center gap-[4px]">
              Create a new lesson <span className="text-[#B6B6B6]">/</span> {moduleName}
            </span>
          ) : (
            "Create a new lesson"
          )}
        </span>

        {/* Saved Status Badge */}
        <div className="h-[24px] px-[8px] bg-[#061E2D] rounded-[4px] flex items-center justify-center shrink-0 ml-[4px]">
          <span className="text-[11px] text-[#F2F2F2] font-normal leading-[14px]">
            Saved 2 mins ago
          </span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-[16px]">
        {/* Collaborators Avatar stack */}
        <div className="flex items-center">
          <div className="size-[32px] rounded-full overflow-hidden mr-[-6px] relative z-10 border-2 border-white">
            <Image src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" fill className="object-cover" />
          </div>
          <div className="size-[32px] rounded-full border border-dashed border-[#B6B6B6] bg-white flex items-center justify-center relative z-0 p-[7px]">
            <Add size={14} variant="Linear" color="#606060" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-[16px]">
          <button className="flex items-center gap-[6px] text-[#606060] hover:text-[#202020] transition-colors h-[36px]">
            <Add size={18} variant="Linear" color="#606060" />
            <span className="text-[14px] font-medium tracking-[-0.28px]">Invite collaborators</span>
          </button>
          
          <button className="flex items-center gap-[6px] text-[#606060] hover:text-[#202020] transition-colors h-[36px]">
            <Global size={18} variant="Linear" color="#606060" />
            <span className="text-[14px] font-medium tracking-[-0.28px]">Publish course</span>
          </button>

          <div className="h-[20px] w-px bg-[#F0F0F0]" />

          <button className="flex items-center gap-[6px] h-[36px] px-[12px] rounded-[8px] border border-[#0A60E1] text-[#0A60E1] hover:bg-[#0A60E1]/5 transition-colors font-medium">
            <Eye size={18} variant="Linear" color="#0A60E1" />
            <span className="text-[14px] tracking-[-0.28px]">Preview</span>
          </button>
          
          <button className="h-[36px] px-[16px] rounded-[8px] bg-[#0A60E1] text-white text-[14px] font-medium tracking-[-0.28px] hover:bg-[#0A50C5] transition-colors">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
