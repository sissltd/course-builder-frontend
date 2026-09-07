"use client";

import React from "react";
import { ArrowDown2, ArrowRight2, PlayCircle, BookSaved, Task } from "iconsax-react";
import { cn } from "@/lib/utils";
import type { AdminCourseDetail } from "@/redux/slices/adminApi";

interface RailProps {
  course?: AdminCourseDetail;
}

export const ScriptModuleRail = ({ course }: RailProps) => {
  const [openModuleIndex, setOpenModuleIndex] = React.useState<number>(0);
  const [activeLesson, setActiveLesson] = React.useState<string>("");

  const modules = course?.modules ?? [];

  if (modules.length === 0) {
    return (
      <div className="flex flex-col gap-[12px] text-[13px] text-sd-reviewer-muted p-2 italic">
        No modules available yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[12px]">
      {modules.map((module, idx) => {
        const isOpen = openModuleIndex === idx;
        const lessons = module.lessons ?? [];

        return (
          <section
            key={module.id || idx}
            className={cn(
              "rounded-[8px] border bg-sd-grey-1 p-[12px] transition-colors",
              isOpen ? "border-sd-blue" : "border-sd-grey-4 hover:border-sd-grey-5"
            )}
          >
            <button
              type="button"
              onClick={() => setOpenModuleIndex(isOpen ? -1 : idx)}
              className="flex h-[28px] w-full items-center justify-between gap-[12px] text-left -mx-[4px] px-[4px] rounded-[6px] transition-colors hover:bg-sd-grey-2 cursor-pointer"
            >
              <span className="text-[14px] font-semibold leading-[20px] text-sd-grey-12 truncate">
                {module.title || `Module ${idx + 1}`}
              </span>
              <ArrowDown2
                size={18}
                variant="Linear"
                color="var(--sd-grey-12)"
                className={cn("transition-transform duration-200 shrink-0", isOpen ? "rotate-0" : "-rotate-90")}
              />
            </button>

            {isOpen && (
              <div className="mt-[8px] flex flex-col gap-[2px]">
                {lessons.length > 0 ? (
                  lessons.map((lesson, lIdx) => {
                    const Icon =
                      lesson.type === "video"
                        ? PlayCircle
                        : lesson.type === "quiz"
                        ? Task
                        : BookSaved;
                    const isSelected = activeLesson === (lesson.id || String(lIdx));

                    return (
                      <button
                        key={lesson.id || lIdx}
                        type="button"
                        onClick={() => setActiveLesson(lesson.id || String(lIdx))}
                        className={cn(
                          "flex h-[32px] items-center rounded-[6px] px-[8px] text-left transition-colors cursor-pointer",
                          isSelected ? "bg-sd-grey-3 font-medium text-sd-blue" : "hover:bg-sd-grey-2 text-sd-grey-11"
                        )}
                      >
                        <span className="flex w-full items-center gap-[8px] min-w-0">
                          <Icon size={15} variant="Linear" color="currentColor" className="shrink-0" />
                          <span className="min-w-0 flex-1 truncate text-[13px] leading-[18px]">
                            {lesson.title}
                          </span>
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <span className="text-[12px] text-sd-reviewer-muted p-1 italic">
                    No lessons in this module
                  </span>
                )}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
};

export const QuizModuleRail = ({ course }: RailProps) => {
  const [openModuleIndex, setOpenModuleIndex] = React.useState<number>(0);
  const [activeLesson, setActiveLesson] = React.useState<string>("");

  const modules = course?.modules ?? [];

  if (modules.length === 0) {
    return (
      <div className="flex flex-col gap-[12px] text-[13px] text-sd-reviewer-muted p-2 italic">
        No quizzes available yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[12px]">
      {modules.map((module, idx) => {
        const isOpen = openModuleIndex === idx;
        const quizzes = (module.lessons ?? []).filter((l) => l.type === "quiz" || l.type === "assessment");

        return (
          <section
            key={module.id || idx}
            className={cn(
              "rounded-[8px] border bg-sd-grey-1 p-[12px] transition-colors",
              isOpen ? "border-sd-blue" : "border-sd-grey-4 hover:border-sd-grey-5"
            )}
          >
            <button
              type="button"
              onClick={() => setOpenModuleIndex(isOpen ? -1 : idx)}
              className="flex h-[28px] w-full items-center justify-between gap-[12px] text-left -mx-[4px] px-[4px] rounded-[6px] transition-colors hover:bg-sd-grey-2 cursor-pointer"
            >
              <span className="text-[14px] font-semibold leading-[20px] text-sd-grey-12 truncate">
                {module.title || `Module ${idx + 1}`}
              </span>
              <ArrowDown2
                size={18}
                variant="Linear"
                color="var(--sd-grey-12)"
                className={cn("transition-transform duration-200 shrink-0", isOpen ? "rotate-0" : "-rotate-90")}
              />
            </button>

            {isOpen && (
              <div className="mt-[8px] flex flex-col gap-[2px]">
                {quizzes.length > 0 ? (
                  quizzes.map((quiz, qIdx) => {
                    const isSelected = activeLesson === (quiz.id || String(qIdx));

                    return (
                      <button
                        key={quiz.id || qIdx}
                        type="button"
                        onClick={() => setActiveLesson(quiz.id || String(qIdx))}
                        className={cn(
                          "flex h-[32px] items-center rounded-[6px] px-[8px] text-left transition-colors cursor-pointer",
                          isSelected ? "bg-sd-grey-3 font-medium text-sd-blue" : "hover:bg-sd-grey-2 text-sd-grey-11"
                        )}
                      >
                        <span className="flex w-full items-center gap-[8px] min-w-0">
                          <Task size={15} variant="Linear" color="currentColor" className="shrink-0" />
                          <span className="min-w-0 flex-1 truncate text-[13px] leading-[18px]">
                            {quiz.title}
                          </span>
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <span className="text-[12px] text-sd-reviewer-muted p-1 italic">
                    No quizzes in this module
                  </span>
                )}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
};

export const MediaModuleRail = ({ course }: RailProps) => {
  const [openModuleIndex, setOpenModuleIndex] = React.useState<number>(0);
  const [activeLesson, setActiveLesson] = React.useState<string>("");

  const modules = course?.modules ?? [];

  if (modules.length === 0) {
    return (
      <div className="flex flex-col gap-[12px] text-[13px] text-sd-reviewer-muted p-2 italic">
        No media lessons available yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[12px]">
      {modules.map((module, idx) => {
        const isOpen = openModuleIndex === idx;
        const videoLessons = (module.lessons ?? []).filter((l) => l.type === "video");

        return (
          <section
            key={module.id || idx}
            className={cn(
              "rounded-[8px] border bg-sd-grey-1 p-[12px] transition-colors",
              isOpen ? "border-sd-blue" : "border-sd-grey-4 hover:border-sd-grey-5"
            )}
          >
            <button
              type="button"
              onClick={() => setOpenModuleIndex(isOpen ? -1 : idx)}
              className="flex h-[28px] w-full items-center justify-between gap-[12px] text-left -mx-[4px] px-[4px] rounded-[6px] transition-colors hover:bg-sd-grey-2 cursor-pointer"
            >
              <span className="text-[14px] font-semibold leading-[20px] text-sd-grey-12 truncate">
                {module.title || `Module ${idx + 1}`}
              </span>
              <ArrowDown2
                size={18}
                variant="Linear"
                color="var(--sd-grey-12)"
                className={cn("transition-transform duration-200 shrink-0", isOpen ? "rotate-0" : "-rotate-90")}
              />
            </button>

            {isOpen && (
              <div className="mt-[8px] flex flex-col gap-[2px]">
                {videoLessons.length > 0 ? (
                  videoLessons.map((lesson, vIdx) => {
                    const isSelected = activeLesson === (lesson.id || String(vIdx));

                    return (
                      <button
                        key={lesson.id || vIdx}
                        type="button"
                        onClick={() => setActiveLesson(lesson.id || String(vIdx))}
                        className={cn(
                          "flex h-[32px] items-center rounded-[6px] px-[8px] text-left transition-colors cursor-pointer",
                          isSelected ? "bg-sd-grey-3 font-medium text-sd-blue" : "hover:bg-sd-grey-2 text-sd-grey-11"
                        )}
                      >
                        <span className="flex w-full items-center gap-[8px] min-w-0">
                          <PlayCircle size={15} variant="Linear" color="currentColor" className="shrink-0" />
                          <span className="min-w-0 flex-1 truncate text-[13px] leading-[18px]">
                            {lesson.title}
                          </span>
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <span className="text-[12px] text-sd-reviewer-muted p-1 italic">
                    No video media in this module
                  </span>
                )}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
};
