"use client";

import React from "react";
import { SideDrawer } from "@/components/shared/SideDrawer";
import { ArrowRight2, CloseCircle } from "iconsax-react";
import type { MieRecommendation } from "./MieRecommendationTable";

interface RecommendationDetailsDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  recommendation: MieRecommendation | null;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

export const RecommendationDetailsDrawer = ({
  isOpen,
  onOpenChange,
  recommendation,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}: RecommendationDetailsDrawerProps) => {
  if (!recommendation) return null;

  return (
    <SideDrawer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      side="right"
      className="w-full sm:!w-[617px] sm:!max-w-[617px]"
    >
      <div className="border-b border-[#D9D9D9] p-[20px]">
        <div className="flex items-center justify-between w-full">
          <span className="text-[20px] font-semibold text-[#202020] leading-[28px]">
            Topic details
          </span>
          <div className="flex gap-[12px] items-center">
            <div className="flex items-center gap-0">
              <button
                onClick={onPrevious}
                disabled={!hasPrevious}
                className="border border-[#F0F0F0] p-[6px] rounded-l-[8px] flex items-center justify-center disabled:opacity-30 hover:bg-sd-grey-1 transition-colors cursor-pointer"
              >
                <ArrowRight2 variant="Linear" size={20} color="#202020" className="rotate-180" />
              </button>
              <button
                onClick={onNext}
                disabled={!hasNext}
                className="border border-l-0 border-[#F0F0F0] p-[6px] rounded-r-[8px] flex items-center justify-center disabled:opacity-30 hover:bg-sd-grey-1 transition-colors cursor-pointer"
              >
                <ArrowRight2 variant="Linear" size={20} color="#202020" />
              </button>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="border border-[#F0F0F0] p-[6px] rounded-[8px] flex items-center justify-center hover:bg-sd-grey-1 transition-colors cursor-pointer"
            >
              <CloseCircle variant="Linear" size={20} color="#606060" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-[17px] flex flex-col gap-[16px]">
        <div>
          <span className="text-[14px] font-medium text-[#202020] tracking-[-0.28px] leading-[20px]">
            Topic Description
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[14px] font-normal text-[#606060] tracking-[-0.28px] leading-[20px]">
            Title
          </span>
          <span className="text-[16px] font-normal text-[#202020] tracking-[-0.32px] leading-[24px]">
            {recommendation.topic}
          </span>
        </div>

        <div className="flex items-start justify-between">
          <span className="text-[14px] font-normal text-[#606060] tracking-[-0.28px] leading-[20px]">
            Category
          </span>
          <span className="text-[16px] font-normal text-[#202020] tracking-[-0.32px] leading-[24px]">
            {recommendation.category}
          </span>
        </div>

        <div className="flex items-start justify-between">
          <span className="text-[14px] font-normal text-[#606060] tracking-[-0.28px] leading-[20px]">
            Level
          </span>
          <span className="text-[16px] font-normal text-[#202020] tracking-[-0.32px] leading-[24px]">
            {recommendation.difficultyLevel}
          </span>
        </div>

        <div className="flex items-start justify-between">
          <span className="text-[14px] font-normal text-[#606060] tracking-[-0.28px] leading-[20px]">
            Demand Score
          </span>
          <span className="text-[16px] font-normal text-[#202020] tracking-[-0.32px] leading-[24px]">
            {recommendation.demandScore}
          </span>
        </div>

        <div className="flex items-start justify-between">
          <span className="text-[14px] font-normal text-[#606060] tracking-[-0.28px] leading-[20px]">
            Searches per month
          </span>
          <span className="text-[16px] font-normal text-[#202020] tracking-[-0.32px] leading-[24px]">
            {recommendation.searchesPerMonth}
          </span>
        </div>
      </div>

      <div className="border-t border-[#D9D9D9] p-[17px] flex flex-col gap-[16px]">
        <span className="text-[14px] font-medium text-[#202020] tracking-[-0.28px] leading-[20px]">
          Description
        </span>
        <p className="text-[14px] font-normal text-[#606060] tracking-[-0.28px] leading-[20px]">
          Discover the principles, methods, and practices that guide the design, development, and maintenance of software systems. Learn how engineering approaches bring structure, efficiency, and reliability to building modern applications.
        </p>
      </div>
    </SideDrawer>
  );
};
