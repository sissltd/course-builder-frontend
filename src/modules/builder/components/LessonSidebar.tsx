"use client";

import React, { useState, useRef, useEffect } from "react";
import { Add, VideoPlay, DocumentText } from "iconsax-react";
import { cn } from "@/lib/utils";
import { Lesson } from "./ModulesStep";

interface LessonSidebarProps {
  lessons: Lesson[];
  activeLessonId: string;
  onSelectLesson: (id: string) => void;
  onAddLesson: (type: "video" | "text") => void;
  onBack: () => void;
}

export const LessonSidebar = ({
  lessons,
  activeLessonId,
  onSelectLesson,
  onAddLesson,
  onBack
}: LessonSidebarProps) => {
  const [showLessonTypes, setShowLessonTypes] = useState(false);
  const listEndRef = useRef<HTMLDivElement>(null);
  const prevLessonCount = useRef(lessons.length);

  useEffect(() => {
    if (lessons.length > prevLessonCount.current) {
      setTimeout(() => {
        listEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 100);
    }
    prevLessonCount.current = lessons.length;
  }, [lessons.length]);

  return (
    <div className="w-[234px] h-full bg-[#FDFDFD] border-r border-[#F0F0F0] px-[16px] py-[32px] flex flex-col shrink-0">
      
      {/* Lessons List (scrollable) */}
      <div className="flex flex-col gap-[12px] overflow-y-auto flex-1">
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
                {lesson.type === "text" ? (lesson.estimatedDuration || lesson.duration) : lesson.duration}
              </span>
            </button>
          );
        })}

        {/* Add Lesson — inside scrollable list, below last lesson */}
        <div className="flex flex-col gap-[8px] pt-[4px]">
          <button
            type="button"
            onClick={() => setShowLessonTypes(!showLessonTypes)}
            className="flex items-center gap-[8px] text-[14px] text-[#606060] hover:text-[#202020] transition-colors cursor-pointer py-[4px]"
          >
            <Add size={18} variant="Linear" color="currentColor" />
            <span>Add lesson</span>
          </button>
          {showLessonTypes && (
            <div className="flex items-center gap-[12px] pl-[26px]">
              <div
                className="flex items-center gap-[6px] cursor-pointer select-none"
                onClick={() => { onAddLesson("video"); setShowLessonTypes(false); }}
              >
                <VideoPlay size={16} variant="Linear" color="#0A60E1" />
                <span className="text-[13px] font-medium text-[#0A60E1]">Video</span>
              </div>
              <div
                className="flex items-center gap-[6px] cursor-pointer select-none"
                onClick={() => { onAddLesson("text"); setShowLessonTypes(false); }}
              >
                <DocumentText size={16} variant="Linear" color="#0A60E1" />
                <span className="text-[13px] font-medium text-[#0A60E1]">Text</span>
              </div>
            </div>
          )}
        </div>

        <div ref={listEndRef} />
      </div>
    </div>
  );
};
