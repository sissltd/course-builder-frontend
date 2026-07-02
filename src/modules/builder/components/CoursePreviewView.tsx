"use client";

import React, { useState } from "react";
import { Timer1, Play } from "iconsax-react";
import { useAppSelector } from "@/redux";
import { cn } from "@/lib/utils";

export const CoursePreviewView = () => {
  const courseInfo = useAppSelector((state) => state.courseBuilder.courseInformation);
  const modules = useAppSelector((state) => state.courseBuilder.modules);

  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);

  const activeModule = modules[activeModuleIndex];
  const activeLesson = activeModule?.lessons[activeLessonIndex];

  return (
    <div className="bg-[#FDFDFD] w-full h-full flex flex-col overflow-hidden">
      {/* Hero Section */}
      <div className="flex shrink-0">
        <div className="flex-1 p-[40px] border-b border-[#D9D9D9]">
          <div className="flex flex-col gap-[12px] max-w-[683px]">
            <h2 className="text-[32px] font-bold text-[#202020] leading-[40px] font-sans">
              {courseInfo.courseTitle}
            </h2>
            <p className="text-[16px] text-[#606060] leading-[24px]">
              {courseInfo.description}
            </p>
          </div>
        </div>
        <div className="w-[615px] h-[333px] shrink-0 border-b border-[#D9D9D9] overflow-hidden">
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
      <div className="flex flex-1 overflow-hidden">
        {/* Module Sidebar */}
        <div className="w-[295px] shrink-0 border-r border-[#F0F0F0] p-[20px] py-[40px] overflow-y-auto">
          <div className="flex flex-col gap-[8px]">
            {modules.map((mod, modIdx) => {
              const isActive = modIdx === activeModuleIndex;
              const totalMinutes = mod.lessons.reduce((acc, l) => {
                const dur = l.duration || "0 mins";
                const mins = parseInt(dur.match(/(\d+)/)?.[0] || "0", 10);
                return acc + mins;
              }, 0);
              const hours = Math.floor(totalMinutes / 60);
              const mins = totalMinutes % 60;
              const durationStr = hours > 0 ? `${hours} hours ${mins} minutes` : `${mins} minutes`;

              return (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => { setActiveModuleIndex(modIdx); setActiveLessonIndex(0); }}
                  className={cn(
                    "w-full flex flex-col gap-[12px] p-[16px] rounded-[8px] text-left transition-colors",
                    isActive ? "border-2 border-[#B3D3FF]" : "border-[1.5px] border-[#F0F0F0]"
                  )}
                >
                  <span className="text-[12px] font-medium text-[#606060]">
                    Module {modIdx + 1}
                  </span>
                  <div className="flex flex-col gap-[8px]">
                    <span className={cn(
                      "text-[14px] truncate",
                      isActive ? "text-[#202020]" : "text-[#606060]"
                    )}>
                      {mod.lessons[0]?.title || mod.title}
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
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {activeModule && (
            <>
              {/* Lesson Tabs */}
              <div className="flex items-center gap-[11px] h-[69px] px-[20px] border-b border-[#D9D9D9] overflow-x-auto">
                {activeModule.lessons.map((lesson, lIdx) => (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => setActiveLessonIndex(lIdx)}
                    className={cn(
                      "h-[40px] px-[10px] rounded-[8px] text-[16px] transition-colors",
                      lIdx === activeLessonIndex
                        ? "bg-[#EAF3FF] text-[#0A60E1]"
                        : "text-[#606060] hover:bg-[#F0F0F0]"
                    )}
                  >
                    Lesson {lIdx + 1}
                  </button>
                ))}
              </div>

              {/* Video Player */}
              <div className="relative w-full h-[346px] bg-black flex items-center justify-center">
                <div className="backdrop-blur-[8px] bg-[rgba(240,240,240,0.26)] rounded-full p-[11px] flex items-center justify-center">
                  <Play size={34} variant="Bold" color="white" />
                </div>
              </div>

              {/* Lesson Title */}
              {activeLesson?.title && (
                <div className="bg-white p-[20px] w-full">
                  <h3 className="text-[24px] font-medium text-[#202020] tracking-[-0.48px] leading-[32px]">
                    {activeLesson.title}
                  </h3>
                </div>
              )}

              {/* Lesson Content (RTE HTML) */}
              {(activeLesson?.content || activeLesson?.videoScript) && (
                <div className="bg-white p-[20px] w-full border-b border-[#D9D9D9]">
                  <div
                    className="text-[16px] text-[#636363] leading-[24px] [&_h1]:text-[24px] [&_h1]:font-medium [&_h1]:text-[#202020] [&_h1]:mb-[24px] [&_h2]:text-[20px] [&_h2]:font-medium [&_h2]:text-[#202020] [&_h2]:mb-[16px] [&_p]:mb-[16px] [&_ol]:list-decimal [&_ol]:pl-[24px] [&_ol_li]:mb-[8px] [&_ul]:list-disc [&_ul]:pl-[24px] [&_ul_li]:mb-[8px]"
                    dangerouslySetInnerHTML={{
                      __html: activeLesson?.content || activeLesson?.videoScript || "",
                    }}
                  />
                </div>
              )}

              {/* Quiz Section */}
              {(activeModule.quizQuestions.length > 0 ||
                activeModule.lessons.some((l) => l.quizQuestions && l.quizQuestions.length > 0)) && (
                <div className="bg-[#F0F0F0] p-[20px] w-full">
                  <h4 className="text-[20px] font-semibold text-[#202020] leading-[28px] mb-[24px]">
                    Quiz
                  </h4>
                  <div className="flex flex-col gap-[20px]">
                    {activeModule.quizQuestions.slice(0, 3).map((q, qIdx) => (
                      <div
                        key={qIdx}
                        className="bg-[#FDFDFD] border border-[#D9D9D9] rounded-[8px] p-[16px] flex flex-col gap-[16px]"
                      >
                        <div className="flex items-start gap-[12px]">
                          <span className="text-[16px] text-[#202020] shrink-0">
                            Question {qIdx + 1}
                          </span>
                          <span className="text-[16px] text-[#606060]">
                            {q.question}
                          </span>
                        </div>
                        <div className="flex flex-col gap-[16px]">
                          {q.options.map((opt, oIdx) => (
                            <div key={oIdx} className="flex items-center gap-[12px]">
                              <span className="text-[14px] text-[#606060] w-[16px] shrink-0">
                                {String.fromCharCode(65 + oIdx)}
                              </span>
                              <div className="size-[18px] rounded-full border border-[#D9D9D9] bg-white shrink-0" />
                              <span className="text-[14px] text-[#606060]">{opt}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
