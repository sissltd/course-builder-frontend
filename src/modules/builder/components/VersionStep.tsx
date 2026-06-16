"use client";

import React, { useState } from "react";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import { AppSelect } from "@/components/form/AppSelect";

interface VersionStepProps {
  onNext?: () => void;
  onBack?: () => void;
}

export const VersionStep = ({ onNext, onBack }: VersionStepProps) => {
  const [version, setVersion] = useState("v1.0");

  return (
    <div className="w-[739px] max-w-full bg-[#FDFDFD] px-[24px] py-[40px] flex flex-col gap-[40px] mx-auto pb-[100px]">
      
      {/* Title / Description */}
      <div className="flex flex-col gap-[12px]">
        <h2 className="text-[24px] font-semibold text-[#202020] tracking-[-0.48px] leading-[32px]">Versioning</h2>
        <p className="text-[16px] text-[#606060] leading-[24px]">
          Assign a version to this course
        </p>
      </div>

      {/* Dropdown Container */}
      <div className="flex flex-col gap-[8px]">
        <span className="text-[14px] font-medium text-[#202020]">Course version</span>
        <AppSelect 
          placeholder="Select version"
          options={[
            { label: "v1.0", value: "v1.0" },
            { label: "v1.1", value: "v1.1" },
            { label: "v2.0", value: "v2.0" },
          ]}
          value={version}
          onValueChange={setVersion}
          triggerClassName="h-[44px] bg-white border-[#D9D9D9] text-[#202020]"
        />
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between w-full pt-[24px]">
        <button 
          onClick={onBack}
          className="h-[44px] px-[24px] border border-[#0A60E1] text-[#0A60E1] rounded-[8px] flex items-center gap-[8px] hover:bg-[#0A60E1]/5 transition-colors"
        >
          <ArrowLeft2 size={24} variant="Linear" color="#0A60E1" />
          <span className="text-[14px] font-medium tracking-[-0.28px]">Go back</span>
        </button>
        <button 
          onClick={onNext}
          className="h-[44px] px-[24px] bg-[#0A60E1] text-white rounded-[8px] flex items-center gap-[8px] hover:bg-[#0A50C5] transition-colors"
        >
          <span className="text-[14px] font-medium tracking-[-0.28px]">Save & continue</span>
          <ArrowRight2 size={24} variant="Linear" color="#FFFFFF" />
        </button>
      </div>

    </div>
  );
};
