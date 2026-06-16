"use client";

import React from "react";
import { ArrowRight2, Add } from "iconsax-react";
import { cn } from "@/lib/utils";

export type BuilderStep = 
  | "information"
  | "outline"
  | "version"
  | "modules"
  | "thumbnail"
  | "quality";

interface BuilderSidebarProps {
  activeStep: BuilderStep;
  onChangeStep: (step: BuilderStep) => void;
  modules?: { id: string; title: string }[];
  activeModuleIndex?: number;
  onChangeActiveModuleIndex?: (index: number) => void;
  onAddModule?: () => void;
}

const STEPS: { id: BuilderStep; label: string; collapsable?: boolean }[] = [
  { id: "information", label: "Course Information" },
  { id: "outline",     label: "Course Outline" },
  { id: "version",     label: "Version" },
  { id: "modules",     label: "Course Modules", collapsable: true },
  { id: "thumbnail",   label: "Thumbnail" },
  { id: "quality",     label: "Quality Check" },
];

const stepsOrder: BuilderStep[] = ["information", "outline", "version", "modules", "thumbnail", "quality"];

export const BuilderSidebar = ({ 
  activeStep, 
  onChangeStep,
  modules,
  activeModuleIndex,
  onChangeActiveModuleIndex,
  onAddModule
}: BuilderSidebarProps) => {
  const activeIndex = stepsOrder.indexOf(activeStep);

  return (
    <div className="w-[234px] h-full bg-[#FDFDFD] border-r border-[#F0F0F0] px-[20px] py-[40px] flex flex-col gap-[8px] shrink-0">
      {STEPS.map((step) => {
        const isActive = activeStep === step.id;
        const isCompleted = stepsOrder.indexOf(step.id) < activeIndex;
        
        return (
          <div key={step.id} className="flex flex-col w-full">
            <button
              onClick={() => onChangeStep(step.id)}
              className={cn(
                "w-full h-[44px] flex items-center justify-between px-[10px] rounded-[12px] transition-colors text-left",
                isActive ? "border-l-2 border-[#0A60E1] rounded-l-none" : "hover:bg-sd-grey-1"
              )}
            >
              <span className={cn(
                "text-[16px] leading-[24px] tracking-[-0.32px]",
                isActive ? "text-[#0A60E1] font-semibold" : "text-[#606060] font-normal"
              )}>
                {step.label}
              </span>
              {isCompleted ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0">
                  <circle cx="12" cy="12" r="10" stroke="#0A60E1" strokeWidth="2" fill="none" />
                  <path d="M8 12.5L11 15.5L16 9" stroke="#0A60E1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : step.collapsable ? (
                <ArrowRight2 
                  size={20} 
                  variant="Linear" 
                  color={isActive ? "#0A60E1" : "#606060"} 
                  className={cn("transition-transform duration-200", isActive && "rotate-90")}
                />
              ) : null}
            </button>

            {/* Sub-items for Course Modules step */}
            {step.id === "modules" && isActive && modules && (
              <div className="flex flex-col gap-[8px] pl-[20px] mt-[8px]">
                {modules.map((m, idx) => {
                  const isSelected = activeModuleIndex === idx;
                  return (
                    <button
                      key={m.id}
                      onClick={() => onChangeActiveModuleIndex?.(idx)}
                      className="flex items-center gap-[12px] h-[32px] text-left hover:text-[#0A60E1] transition-colors group w-full"
                    >
                      <div className={cn(
                        "size-[16px] rounded-full border flex items-center justify-center transition-all shrink-0",
                        isSelected ? "border-[#0A60E1] border-[5px]" : "border-[#B6B6B6] group-hover:border-[#0A60E1]"
                      )} />
                      <span className={cn(
                        "text-[14px] leading-[20px] tracking-[-0.28px] truncate",
                        isSelected ? "text-[#0A60E1] font-semibold" : "text-[#606060]"
                      )}>
                        Module {idx + 1}
                      </span>
                    </button>
                  );
                })}
                <button
                  onClick={onAddModule}
                  className="flex items-center gap-[6px] h-[32px] text-[14px] text-[#606060] hover:text-[#0A60E1] transition-colors pl-[2px] w-full text-left"
                >
                  <Add size={16} variant="Linear" color="#606060" />
                  <span>Add</span>
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
