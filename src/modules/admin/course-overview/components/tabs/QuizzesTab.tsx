"use client";

import React from "react";
import { PlayCircle, TaskSquare, TickCircle } from "iconsax-react";
import type { AdminCourseDetail } from "@/redux/slices/adminApi";

interface QuizzesTabProps {
  course?: AdminCourseDetail;
}

export const QuizzesTab = ({ course }: QuizzesTabProps) => {
  const quizLessons = React.useMemo(() => {
    if (!course?.modules) return [];
    return course.modules.flatMap((m) =>
      (m.lessons ?? []).filter((l) => l.type === "quiz" || l.type === "assessment")
    );
  }, [course]);

  if (quizLessons.length === 0 && !course?.final_assessment) {
    return (
      <div className="flex h-[280px] flex-col items-center justify-center gap-[12px] rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 p-6 text-center">
        <TaskSquare size={40} variant="Linear" color="var(--sd-grey-11)" />
        <span className="text-[15px] font-semibold text-sd-grey-12">
          No quizzes available
        </span>
        <span className="text-[13px] text-sd-reviewer-muted max-w-[420px]">
          No quizzes or assessment lessons have been configured for this course yet.
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[24px]">
      <div className="flex flex-col gap-[12px] border-b border-sd-grey-3 pb-[24px]">
        <div className="flex items-center gap-[12px]">
          <PlayCircle size={24} variant="Linear" color="var(--sd-grey-12)" />
          <h2 className="text-[22px] font-semibold leading-[28px] text-sd-grey-12">
            Course Quizzes &amp; Assessments
          </h2>
        </div>
        <div className="ml-[36px] flex items-center gap-[24px] text-[12px] font-normal leading-[16px] text-sd-reviewer-muted">
          <span className="flex items-center gap-[8px]">
            <TaskSquare size={16} variant="Linear" color="currentColor" />
            <span>{quizLessons.length} quiz lessons</span>
          </span>
          {course?.final_assessment ? (
            <span className="flex items-center gap-[8px]">
              <TickCircle size={16} variant="Linear" color="#16A34A" />
              <span>Final assessment configured</span>
            </span>
          ) : (
            <span className="text-[12px] text-sd-reviewer-muted">
              No final assessment
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-[16px]">
        {quizLessons.map((quiz, index) => (
          <div
            key={quiz.id || index}
            className="flex flex-col gap-[12px] p-[20px] rounded-[12px] border border-sd-grey-3 bg-sd-grey-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-semibold text-sd-grey-12">
                Quiz {index + 1}: {quiz.title}
              </span>
              <span className="rounded bg-sd-blue/10 px-[8px] py-[2px] text-[11px] font-medium text-sd-blue">
                {quiz.duration_seconds
                  ? `${Math.floor(quiz.duration_seconds / 60)} mins`
                  : "No duration"}
              </span>
            </div>

            <p className="text-[14px] text-sd-reviewer-muted leading-[22px]">
              {quiz.content || "No quiz instructions or questions detailed in this lesson."}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
