"use client";

import React from "react";
import { Add } from "iconsax-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/shared/Button";
import { Lesson } from "./ModulesStep";

interface LessonSidebarProps {
  lessons: Lesson[];
  activeLessonId: string;
  onSelectLesson: (id: string) => void;
  onAddLesson: (type: "video" | "quiz" | "text") => void;
  onBack: () => void;
}

export const LessonSidebar = ({ 
  lessons, 
  activeLessonId, 
  onSelectLesson, 
  onAddLesson,
  onBack 
}: LessonSidebarProps) => {
  return (
    <div className="w-[234px] h-full bg-[#FDFDFD] border-r border-[#F0F0F0] px-[16px] py-[32px] flex flex-col justify-between shrink-0">
      
      {/* Lessons List */}
      <div className="flex flex-col gap-[12px] overflow-y-auto max-h-[calc(100vh-200px)]">
        {lessons.map((lesson, idx) => {
          const isActive = lesson.id === activeLessonId;
          return (
            <button
              type="button"
              key={lesson.id}
              onClick={() => onSelectLesson(lesson.id)}
              className={cn(
                "w-full px-[12px] py-[10px] rounded-[10px] border text-left flex flex-col gap-[2px] transition-all",
                isActive 
                  ? "border-[#0A60E1] bg-[#F4F9FF]" 
                  : "border-[#F0F0F0] hover:border-[#D9D9D9] bg-white"
              )}
            >
              <span className={cn(
                "text-[12px] font-normal leading-[16px]",
                isActive ? "text-[#0A60E1]" : "text-[#8C8C8C]"
              )}>
                Lesson {idx + 1}
              </span>
              <span className="text-[14px] font-semibold text-[#202020] truncate leading-[20px]">
                {lesson.title || "Untitled Lesson"}
              </span>
              <span className="text-[11px] text-[#606060] font-normal leading-[14px]">
                {lesson.duration}
              </span>
            </button>
          );
        })}
      </div>

      {/* Add Lesson Action */}
      <div className="flex flex-col gap-[10px] border-t border-[#F0F0F0] pt-[16px] mt-auto">
        <Button
          variant="app-outline"
          isGhost
          onClick={() => onAddLesson("video")}
          className="h-[32px] text-[14px] text-[#606060] justify-start"
          leftIcon={<Add size={18} variant="Linear" color="#606060" />}
        >
          Add lesson
        </Button>
      </div>

    </div>
  );
};
