"use client";

import React from "react";
import { SideDrawer } from "@/components/shared/SideDrawer";
import { MyCourse } from "@/modules/dashboard/columns/my-courses";
import { cn } from "@/lib/utils";
import { ArrowRight } from "iconsax-react";
import { Button } from "@/components/shared/Button";

interface CourseDetailsDrawerProps {
  course: MyCourse | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onResolveIssues?: (course: MyCourse) => void;
}

const StatusChip = ({ status }: { status: string }) => {
  const styles: Record<string, { bg: string; text: string }> = {
    "Approved": { bg: "bg-[#EBF7EE]", text: "text-[#27AE60]" },
    "In Review": { bg: "bg-[#EBF3FF]", text: "text-[#0063EF]" },
    "Rejected": { bg: "bg-[#FFF0ED]", text: "text-[#FF5025]" },
    "Draft": { bg: "bg-[#F5F5F5]", text: "text-[#606060]" },
    "Needs revision": { bg: "bg-[#FFF5ED]", text: "text-[#F2994A]" },
  };

  const currentStyle = styles[status] || styles["Draft"];

  return (
    <span className={cn("px-[12px] py-[6px] rounded-[6px] text-[14px] font-medium tracking-[-0.28px] whitespace-nowrap", currentStyle.bg, currentStyle.text)}>
      {status}
    </span>
  );
};

const DetailRow = ({ label, value, chip }: { label: string; value?: string; chip?: React.ReactNode }) => (
  <div className="flex flex-col gap-[8px]">
    <span className="text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px] font-normal">{label}</span>
    {chip ? (
      <div className="w-fit">{chip}</div>
    ) : (
      <span className="text-[16px] text-[#202020] tracking-[-0.32px] leading-[24px] font-normal">{value}</span>
    )}
  </div>
);

const ModuleItem = ({ title, lessons }: { title: string; lessons: number }) => (
  <div className="p-[16px] border border-[#D9D9D9] rounded-[8px] flex items-center justify-between">
    <div className="flex flex-col gap-[8px]">
      <p className="text-[16px] text-[#202020] font-normal leading-[24px] tracking-[-0.32px]">{title}</p>
      <div className="flex items-center gap-[10px]">
        <span className="text-[16px] text-[#606060] tracking-[-0.32px] leading-[24px]">Total lessons</span>
        <div className="size-[24px] border border-[#D9D9D9] rounded-[4px] flex items-center justify-center text-[12px] font-medium text-[#202020]">
          {lessons}
        </div>
      </div>
    </div>
  </div>
);

const ReviewerNote = ({ lesson, issue, note }: { lesson: string; issue: string; note: string }) => (
  <div className="bg-[#FDFDFD] border border-[#8C8C8C] rounded-[10px] p-[16px] flex flex-col gap-[12px]">
    <div className="flex flex-col gap-[12px]">
      <div className="flex items-center gap-[4px] text-[#592D18] text-[12px] font-medium">
        <span>{lesson}</span>
        <span>-</span>
        <span>{issue}</span>
      </div>
      <p className="text-[14px] text-[#202020] tracking-[-0.28px]">300/500 words below minimum</p>
    </div>
    <div className="flex flex-col gap-[4px]">
      <span className="text-[14px] text-[#202020] tracking-[-0.28px]">Reviewer’ note</span>
      <div className="border border-[#D9D9D9] rounded-[8px] p-[12px]">
        <p className="text-[14px] text-[#606060] tracking-[-0.28px]">{note}</p>
      </div>
    </div>
  </div>
);

export const CourseDetailsDrawer = ({
  course,
  isOpen,
  onOpenChange,
  onResolveIssues,
}: CourseDetailsDrawerProps) => {
  if (!course) return null;

  const showReviewerNote = course.status === "Rejected" || course.status === "Needs revision";

  return (
    <SideDrawer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Course details"
      footer={showReviewerNote ? (
        <Button 
          variant="app-primary" 
          className="w-full h-[44px]"
          onClick={() => onResolveIssues?.(course)}
          rightIcon={<ArrowRight size={20} variant="Linear" color="#FFF" />}
        >
          {course.status === "Rejected" ? "Review changes" : "Resolve issues"}
        </Button>
      ) : null}
    >
      <div className="flex flex-col gap-[32px]">
        {/* Status + Note */}
        <div className="flex flex-col gap-[16px]">
          <DetailRow label="Status" chip={<StatusChip status={course.status} />} />
          {showReviewerNote && (
            <ReviewerNote 
              lesson="R1 Lesson 2" 
              issue="Script Length" 
              note="Extend the lesson script to resolve this issue" 
            />
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-[32px]">
          <DetailRow label="Topic" value={course.title} />
          <DetailRow label="Course category" value={course.category} />
          <DetailRow label="Difficulty level" value="Intermediate" />
          <DetailRow 
            label="Type" 
            chip={
              <span className={cn(
                "px-[12px] py-[8px] rounded-[6px] text-[14px] font-normal tracking-[-0.28px]",
                course.isAi ? "bg-[#F3F2FE] text-[#594FF2]" : "bg-[#EBF3FF] text-[#0063EF]"
              )}>
                {course.isAi ? "Created with AI" : "Creator uploaded"}
              </span>
            } 
          />
        </div>

        <div className="h-px bg-[#F0F0F0]" />

        {/* Modules */}
        <div className="flex flex-col gap-[16px]">
          <span className="text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px]">Course Modules</span>
          <div className="flex flex-col gap-[16px]">
            <ModuleItem title="Module 1: The Origin and Advancement of Machines" lessons={3} />
            <ModuleItem title="Module 2: The Origin and Advancement of Machines" lessons={3} />
            <ModuleItem title="Module 3: The Introduction of Artificial intelligence" lessons={2} />
          </div>
        </div>

        {/* Date */}
        <div className="flex flex-col gap-[8px]">
          <span className="text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px]">Date edited</span>
          <span className="text-[16px] text-[#202020] tracking-[-0.32px] leading-[24px]">{course.lastEdited}</span>
        </div>
      </div>
    </SideDrawer>
  );
};
