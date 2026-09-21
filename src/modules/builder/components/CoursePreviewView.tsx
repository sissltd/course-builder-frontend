"use client";

import React, { useState } from "react";
import { Timer1, Play, DocumentCode2 } from "iconsax-react";
import { useAppSelector } from "@/redux";
import { cn } from "@/lib/utils";
import { QuizPreviewSection } from "./QuizPreviewSection";

type PreviewTarget =
  | { type: "lesson"; lessonIndex: number }
  | { type: "moduleQuiz" }
  | { type: "finalAssessment" };

export const CoursePreviewView = () => {
  const courseInfo = useAppSelector((state) => state.courseBuilder.courseInformation);
  const modules = useAppSelector((state) => state.courseBuilder.modules);
  const finalAssessment = useAppSelector((state) => state.courseBuilder.finalAssessment);

  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [target, setTarget] = useState<PreviewTarget>({ type: "lesson", lessonIndex: 0 });

  const activeModule = modules[activeModuleIndex];
  const finalAssessmentQuestions = finalAssessment?.quizQuestions || [];

  const selectModule = (modIdx: number) => {
    setActiveModuleIndex(modIdx);
    const mod = modules[modIdx];
    if (mod?.lessons?.length) {
      setTarget({ type: "lesson", lessonIndex: 0 });
    } else if (mod?.quizQuestions?.length) {
      setTarget({ type: "moduleQuiz" });
    } else {
      setTarget({ type: "lesson", lessonIndex: 0 });
    }
  };

  const isFinalAssessment = target.type === "finalAssessment";
  const activeLesson =
    !isFinalAssessment && target.type === "lesson"
      ? activeModule?.lessons[target.lessonIndex]
      : null;

  const showLessonQuiz =
    !!activeLesson && (activeLesson.quizQuestions?.length || 0) > 0;

  return (
    <div className="bg-[#FDFDFD] w-full h-full flex flex-col overflow-hidden">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row shrink-0">
        <div className="flex-1 p-[24px] md:p-[40px] border-b md:border-b-0 md:border-r border-[#D9D9D9]">
          <div className="flex flex-col gap-[12px] max-w-[683px]">
            <h2 className="text-[24px] md:text-[32px] font-bold text-[#202020] leading-[32px] md:leading-[40px] font-sans">
              {courseInfo.courseTitle}
            </h2>
            <p className="text-[14px] md:text-[16px] text-[#606060] leading-[20px] md:leading-[24px]">
              {courseInfo.description}
            </p>
          </div>
        </div>
        <div className="w-full md:w-[615px] h-[220px] md:h-[333px] shrink-0 border-b border-[#D9D9D9] overflow-hidden">
          {courseInfo.thumbnail ? (
            <img
              src={courseInfo.thumbnail}
              alt="Course thumbnail"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#F0F0F0] flex items-center justify-center">
              <span className="text-[#606060]">No thumbnail</span>
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Module Sidebar */}
        <div className="w-full md:w-[295px] shrink-0 border-b md:border-b-0 md:border-r border-[#F0F0F0] px-[16px] py-[20px] md:px-[20px] md:py-[40px] overflow-x-auto md:overflow-x-visible md:overflow-y-auto">
          <div className="flex md:flex-col gap-[8px] min-w-max md:min-w-0">
            {modules.map((mod, modIdx) => {
              const isActive =
                modIdx === activeModuleIndex && !isFinalAssessment;
              const totalMinutes = mod.lessons.reduce((acc, l) => {
                const dur =
                  l.type === "text"
                    ? l.estimatedDuration || l.duration || "0 mins"
                    : l.duration || "0 mins";
                const mins = parseInt(dur.match(/(\d+)/)?.[0] || "0", 10);
                return acc + mins;
              }, 0);
              const hours = Math.floor(totalMinutes / 60);
              const mins = totalMinutes % 60;
              const durationStr =
                hours > 0 ? `${hours} hours ${mins} minutes` : `${mins} minutes`;

              return (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => selectModule(modIdx)}
                  className={cn(
                    "w-[220px] md:w-full flex-shrink-0 flex flex-col gap-[12px] p-[16px] rounded-[8px] text-left transition-colors",
                    isActive
                      ? "border-2 border-[#B3D3FF]"
                      : "border-[1.5px] border-[#F0F0F0]",
                  )}
                >
                  <span className="text-[12px] font-medium text-[#606060]">
                    Module {modIdx + 1}
                  </span>
                  <div className="flex flex-col gap-[8px]">
                    <span
                      className={cn(
                        "text-[14px] truncate",
                        isActive ? "text-[#202020]" : "text-[#606060]",
                      )}
                    >
                      {mod.title || mod.lessons[0]?.title}
                    </span>
                    <div className="flex items-center gap-[8px]">
                      <Timer1 size={16} variant="Linear" color="#606060" />
                      <span className="text-[12px] font-medium text-[#606060]">
                        {durationStr}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}

            {finalAssessmentQuestions.length > 0 && (
              <button
                type="button"
                onClick={() => setTarget({ type: "finalAssessment" })}
                className={cn(
                  "w-[220px] md:w-full flex-shrink-0 flex flex-col gap-[12px] p-[16px] rounded-[8px] text-left transition-colors",
                  isFinalAssessment
                    ? "border-2 border-[#B3D3FF]"
                    : "border-[1.5px] border-[#F0F0F0]",
                )}
              >
                <span className="text-[12px] font-medium text-[#606060]">
                  Assessment
                </span>
                <div className="flex flex-col gap-[8px]">
                  <span
                    className={cn(
                      "text-[14px] truncate",
                      isFinalAssessment ? "text-[#202020]" : "text-[#606060]",
                    )}
                  >
                    Final Assessment
                  </span>
                  <div className="flex items-center gap-[8px]">
                    <DocumentCode2 size={16} variant="Linear" color="#606060" />
                    <span className="text-[12px] font-medium text-[#606060]">
                      {finalAssessmentQuestions.length} question
                      {finalAssessmentQuestions.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {isFinalAssessment ? (
            finalAssessmentQuestions.length > 0 ? (
              <div className="bg-[#F0F0F0] p-[16px] md:p-[20px] w-full">
                <QuizPreviewSection
                  questions={finalAssessmentQuestions}
                  title="Final Assessment"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-[14px] text-[#606060]">
                No final assessment questions yet.
              </div>
            )
          ) : activeModule ? (
            <>
              {/* Lesson Tabs (lessons + module quiz) */}
              <div className="flex items-center gap-[11px] h-[69px] px-[16px] md:px-[20px] border-b border-[#D9D9D9] overflow-x-auto">
                {activeModule.lessons.map((lesson, lIdx) => {
                  const isActive =
                    target.type === "lesson" && lIdx === target.lessonIndex;
                  return (
                    <button
                      key={lesson.id}
                      type="button"
                      onClick={() => setTarget({ type: "lesson", lessonIndex: lIdx })}
                      className={cn(
                        "h-[40px] px-[10px] rounded-[8px] text-[14px] md:text-[16px] transition-colors whitespace-nowrap",
                        isActive
                          ? "bg-[#EAF3FF] text-[#0A60E1]"
                          : "text-[#606060] hover:bg-[#F0F0F0]",
                      )}
                    >
                      Lesson {lIdx + 1}
                    </button>
                  );
                })}
                {activeModule.quizQuestions?.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setTarget({ type: "moduleQuiz" })}
                    className={cn(
                      "h-[40px] px-[10px] rounded-[8px] text-[14px] md:text-[16px] transition-colors whitespace-nowrap",
                      target.type === "moduleQuiz"
                        ? "bg-[#EAF3FF] text-[#0A60E1]"
                        : "text-[#606060] hover:bg-[#F0F0F0]",
                    )}
                  >
                    Quiz
                  </button>
                )}
              </div>

              {target.type === "moduleQuiz" ? (
                <div className="bg-[#F0F0F0] p-[16px] md:p-[20px] w-full">
                  <QuizPreviewSection
                    questions={activeModule.quizQuestions || []}
                    title="Quiz"
                  />
                </div>
              ) : (
                <>
                  {/* Video Player */}
                  <div className="relative w-full h-[200px] sm:h-[346px] bg-black flex items-center justify-center">
                    <div className="backdrop-blur-[8px] bg-[rgba(240,240,240,0.26)] rounded-full p-[11px] flex items-center justify-center">
                      <Play size={34} variant="Bold" color="white" />
                    </div>
                  </div>

                  {/* Lesson Title */}
                  {activeLesson?.title && (
                    <div className="bg-white p-[16px] md:p-[20px] w-full">
                      <h3 className="text-[20px] md:text-[24px] font-medium text-[#202020] tracking-[-0.48px] leading-[28px] md:leading-[32px]">
                        {activeLesson.title}
                      </h3>
                    </div>
                  )}

                  {/* Lesson Content (RTE HTML) */}
                  {(activeLesson?.content || activeLesson?.videoScript) && (
                    <div className="bg-white p-[16px] md:p-[20px] w-full border-b border-[#D9D9D9]">
                      <div
                        className="text-[14px] md:text-[16px] text-[#636363] leading-[20px] md:leading-[24px] [&_h1]:text-[20px] md:[&_h1]:text-[24px] [&_h1]:font-medium [&_h1]:text-[#202020] [&_h1]:mb-[16px] md:[&_h1]:mb-[24px] [&_h2]:text-[18px] md:[&_h2]:text-[20px] [&_h2]:font-medium [&_h2]:text-[#202020] [&_h2]:mb-[12px] md:[&_h2]:mb-[16px] [&_p]:mb-[12px] md:[&_p]:mb-[16px] [&_ol]:list-decimal [&_ol]:pl-[24px] [&_ol_li]:mb-[8px] [&_ul]:list-disc [&_ul]:pl-[24px] [&_ul_li]:mb-[8px]"
                        dangerouslySetInnerHTML={{
                          __html: activeLesson?.content || activeLesson?.videoScript || "",
                        }}
                      />
                    </div>
                  )}

                  {/* Lesson Quiz Section */}
                  {showLessonQuiz && (
                    <div className="bg-[#F0F0F0] p-[16px] md:p-[20px] w-full">
                      <QuizPreviewSection
                        questions={activeLesson?.quizQuestions || []}
                        title="Quiz"
                      />
                    </div>
                  )}
                </>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
