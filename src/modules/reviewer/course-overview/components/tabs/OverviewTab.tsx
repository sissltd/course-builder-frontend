import React from "react";
import Image from "next/image";
import { Play, Clock, PlayCircle, Sound, InfoCircle, BookSaved, Task, ArrowDown2, ArrowRight2 } from "iconsax-react";
import { cn } from "@/lib/utils";
import { statCards, modules } from "../../data/mockData";
import { StatCard, ModuleLesson } from "../SharedUI";

export const OverviewTab = () => {
  const [openModules, setOpenModules] = React.useState<Record<number, boolean>>({
    0: true,
    1: true,
  });

  const toggleModule = (index: number) => {
    setOpenModules((current) => ({ ...current, [index]: !current[index] }));
  };

  return (
    <div className="flex flex-col gap-[20px]">
      <h1 className="text-[20px] font-bold leading-[28px] text-sd-grey-12">
        Introduction to Prompt Engineering
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-[12px]">
        {statCards.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 p-[16px]">
        <div className="mb-[12px] text-[14px] font-semibold leading-[20px] text-sd-grey-12">
          Preview Video
        </div>

        <div className="relative overflow-hidden rounded-[10px] border border-sd-grey-3 bg-sd-grey-2">
          <Image
            src="/assets/dashboard/course-img.jpg"
            alt="Course preview"
            width={1200}
            height={680}
            className="h-[290px] w-full object-cover"
            priority
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <button
              type="button"
              className="flex size-[58px] items-center justify-center rounded-full border border-white/25 bg-white/25 text-white backdrop-blur-[8px] transition-all hover:scale-105 hover:bg-white/40"
              aria-label="Play preview video"
            >
              <Play size={24} variant="Bold" color="currentColor" />
            </button>
          </div>
        </div>

        <div className="mt-[16px] flex flex-wrap items-center gap-[16px] text-[12px] leading-[16px] text-sd-reviewer-muted">
          <span className="flex items-center gap-[6px]">
            <Clock size={16} variant="Linear" color="currentColor" />
            <span>Duration 1:32mins</span>
          </span>
          <span className="flex items-center gap-[6px]">
            <PlayCircle size={16} variant="Linear" color="currentColor" />
            <span>Resolution 1080p</span>
          </span>
          <span className="flex items-center gap-[6px]">
            <Sound size={16} variant="Linear" color="currentColor" />
            <span>Audio Quality -16 LUFS</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-[12px] rounded-[12px] bg-sd-blue-light px-[16px] py-[14px] text-[14px] leading-[20px] text-sd-grey-12 border-l-2 border-l-sd-blue">
        <InfoCircle size={20} variant="Bulk" color="var(--sd-blue)" className="shrink-0" />
        <span>Preview video required to be played before approve is enabled.</span>
      </div>

      <div className="rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 p-[18px]">
        <h2 className="text-[16px] font-semibold leading-[24px] text-sd-grey-12">
          Course Description
        </h2>
        <p className="mt-[10px] text-[14px] leading-[22px] text-sd-reviewer-muted">
          Dive into the world of technology and innovation with this comprehensive computer
          science course. You&apos;ll explore the foundations of computing, from algorithms and
          data structures to software development, artificial intelligence, and cybersecurity.
          Designed for both beginners and aspiring professionals, this course equips you with
          analytical and problem-solving skills needed to build intelligent systems and design
          efficient programs.
        </p>
      </div>

      <div className="flex flex-col gap-[12px]">
        <h2 className="text-[16px] font-semibold leading-[24px] text-sd-grey-12">
          Modules &amp; Lessons
        </h2>

        <div className="flex flex-col gap-[16px]">
          {modules.map((module, index) => {
            const isOpen = Boolean(openModules[index]);

            return (
              <div key={module.title} className="rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleModule(index)}
                  className={cn(
                    "flex w-full items-center justify-between gap-[16px] p-[16px] text-left transition-colors hover:bg-[#E5E5E5]",
                    isOpen ? "bg-[#F0F0F0CC] border-b border-sd-grey-3" : "bg-[#F0F0F0CC]"
                  )}
                >
                  <div className="flex min-w-0 flex-col gap-[6px]">
                    <span className="text-[15px] font-semibold leading-[22px] text-sd-grey-12 truncate">
                      {module.title}
                    </span>
                    <div className="flex flex-wrap items-center gap-[16px] text-[12px] leading-[18px] text-sd-reviewer-muted">
                      <span className="flex items-center gap-[4px]">
                        <BookSaved size={14} variant="Linear" color="currentColor" />
                        <span>12 Lessons</span>
                      </span>
                      <span className="flex items-center gap-[4px]">
                        <Task size={14} variant="Linear" color="currentColor" />
                        <span>12 Assessment</span>
                      </span>
                      <span className="flex items-center gap-[4px]">
                        <Clock size={14} variant="Linear" color="currentColor" />
                        <span>1hr 40m</span>
                      </span>
                    </div>
                  </div>
                  {isOpen ? (
                    <ArrowDown2 size={20} variant="Linear" color="var(--sd-grey-11)" className="shrink-0" />
                  ) : (
                    <ArrowRight2 size={20} variant="Linear" color="var(--sd-grey-11)" className="shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-[16px] bg-[#F0F0F0CC] flex flex-col gap-[12px]">
                    {module.lessons.length > 0 ? (
                      module.lessons.map((lesson) => (
                        <ModuleLesson key={lesson.title} lesson={lesson} />
                      ))
                    ) : (
                      <span className="text-[14px] text-sd-reviewer-muted italic">No lessons in this module</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 p-[18px]">
        <h2 className="text-[16px] font-semibold leading-[24px] text-sd-grey-12">
          Plagiarism Report{" "}
          <span className="text-[12px] font-normal leading-[16px] text-sd-reviewer-muted ml-[4px]">
            (3% Similarity)
          </span>
        </h2>

        <div className="mt-[16px] flex flex-wrap items-center gap-[16px]">
          <div className="flex size-[58px] items-center justify-center rounded-full bg-[conic-gradient(var(--sd-blue)_0_13%,var(--sd-grey-3)_13%_100%)]">
            <div className="flex size-[42px] items-center justify-center rounded-full bg-sd-grey-1 text-[12px] font-medium leading-[16px] text-sd-grey-12">
              13%
            </div>
          </div>

          <div className="flex flex-col gap-[8px]">
            <span className="text-[14px] leading-[20px] text-sd-grey-12">
              Threshold: &lt; 15% external similarity
            </span>
            <span className="w-fit rounded-[4px] bg-sd-blue-light px-[8px] py-[3px] text-[12px] leading-[16px] text-sd-blue">
              No significant matches found
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
