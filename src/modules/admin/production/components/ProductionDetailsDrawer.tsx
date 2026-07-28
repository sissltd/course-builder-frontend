"use client";

import React from "react";
import { SideDrawer } from "@/components/shared/SideDrawer";
import { Copy, Box, TickCircle } from "iconsax-react";

interface ProductionCourse {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  courseId: string;
  dateCreated: string;
}

interface ProductionDetailsDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  course: ProductionCourse | null;
}

const statusSteps = [
  { label: "Topic Generation", status: "completed" as const },
  { label: "Curriculum Development", status: "completed" as const },
  { label: "Content Generation", status: "completed" as const },
  { label: "Assessment Builder", status: "in-progress" as const },
  { label: "Media Production", status: "waiting" as const },
  { label: "Preview Video", status: "waiting" as const },
  { label: "Assembly and Packaging", status: "waiting" as const },
  { label: "Auto- QA", status: "waiting" as const },
];

const lineColor: Record<string, string> = {
  completed: "bg-[#0063EF]",
  "in-progress": "bg-[#F2994A]",
  waiting: "bg-[#D9D9D9]",
};

const StepIcon = ({ status }: { status: "completed" | "in-progress" | "waiting" }) => {
  if (status === "completed") {
    return (
      <div className="size-[40px] rounded-full flex items-center justify-center shrink-0 bg-[#E7F0FE]">
        <TickCircle variant="Bold" size={22} color="#0063EF" />
      </div>
    );
  }
  if (status === "in-progress") {
    return (
      <div className="size-[40px] rounded-full flex items-center justify-center shrink-0 bg-[#FCF5E8]">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="#F2994A" strokeWidth="1.5" strokeDasharray="4 3" />
        </svg>
      </div>
    );
  }
  return (
    <div className="size-[40px] rounded-full flex items-center justify-center shrink-0 bg-[#F0F0F0]">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#B6B6B6" strokeWidth="1.5" />
      </svg>
    </div>
  );
};

const stepStatusText: Record<string, string> = {
  "Topic Generation": "Completed - 100%",
  "Curriculum Development": "Completed - 100%",
  "Content Generation": "Completed - 100%",
  "Assessment Builder": "In-progress - 60%",
  "Media Production": "Waiting - 0%",
  "Preview Video": "Waiting - 0%",
  "Assembly and Packaging": "Waiting - 0%",
  "Auto- QA": "Waiting - 0%",
};

export const ProductionDetailsDrawer = ({ isOpen, onOpenChange, course }: ProductionDetailsDrawerProps) => {
  if (!course) return null;

  return (
    <SideDrawer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Production details"
      footer={
        <div className="flex gap-[20px] w-full">
          <button className="flex-1 h-[48px] bg-[#D54800] text-white text-[16px] font-normal rounded-[8px] hover:bg-[#B83A00] transition-colors cursor-pointer">
            Stop
          </button>
          <button className="flex-1 h-[48px] bg-[#0A60E1] text-white text-[16px] font-normal rounded-[8px] hover:bg-[#0850C0] transition-colors cursor-pointer">
            Pause
          </button>
        </div>
      }
    >
      {/* Course Information */}
      <div className="flex flex-col gap-[16px] pb-[20px] border-b border-[#E8E8E8]">
        <span className="text-[14px] font-medium text-[#202020] tracking-[-0.28px] leading-[20px]">COURSE INFORMATION</span>
        <div className="flex items-center justify-between">
          <span className="text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px]">Course Title</span>
          <span className="text-[16px] text-[#202020] tracking-[-0.32px] leading-[24px]">{course.title}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px]">Category</span>
          <span className="text-[16px] text-[#202020] tracking-[-0.32px] leading-[24px]">{course.category}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px]">Difficulty Level</span>
          <span className="text-[16px] text-[#202020] tracking-[-0.32px] leading-[24px]">{course.difficulty}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px]">Course ID</span>
          <div className="flex items-center gap-[8px]">
            <span className="text-[16px] text-[#202020] tracking-[-0.32px] leading-[24px]">{course.courseId}</span>
            <button
              onClick={() => navigator.clipboard.writeText(course.courseId)}
              className="cursor-pointer hover:text-[#0063EF] transition-colors"
            >
              <Copy variant="Linear" size={20} color="#606060" />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px]">Date Created</span>
          <span className="text-[16px] text-[#202020] tracking-[-0.32px] leading-[24px]">{course.dateCreated}</span>
        </div>
      </div>

      {/* Production Status */}
      <div className="flex flex-col gap-[20px] pt-[20px]">
        <div className="flex items-center gap-[12px]">
          <Box variant="Linear" size={20} color="#202020" />
          <span className="text-[16px] font-medium text-[#202020] leading-[24px]">Production Status</span>
        </div>
        <div className="flex flex-col gap-[2px]">
          {statusSteps.map((step, i) => (
            <div key={step.label} className="flex gap-[20px] items-start">
              <div className="flex flex-col items-center">
                <StepIcon status={step.status} />
                {i < statusSteps.length - 1 && (
                  <div className={`w-[2px] flex-1 min-h-[42px] ${lineColor[step.status]}`} />
                )}
              </div>
              <div className="flex flex-col gap-[4px] justify-center min-h-[40px] pt-[8px]">
                <span className="text-[14px] text-[#202020] tracking-[-0.28px] leading-[20px]">{step.label}</span>
                <span className="text-[12px] text-[#606060] leading-[16px]">{stepStatusText[step.label]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SideDrawer>
  );
};
