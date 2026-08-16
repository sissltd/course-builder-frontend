import React from "react";
import { SearchNormal, ArrowLeft2, ArrowRight2, ArrowDown2, InfoCircle } from "iconsax-react";
import { cn } from "@/lib/utils";
import { plagiarismModules } from "../../data/mockData";

export const PlagiarismTab = () => {
  const [plagiarismModuleOpen, setPlagiarismModuleOpen] = React.useState<Record<number, boolean>>({ 1: true, 2: true });
  const [plagiarismLessonOpen, setPlagiarismLessonOpen] = React.useState<Record<string, boolean>>({ '1-2': true });

  return (
    <div className="flex flex-col gap-[24px]">
      <div className="flex gap-[16px]">
        {/* Overall Score */}
        <div className="flex-1 rounded-[12px] border border-sd-grey-3 bg-white p-[16px] flex items-center gap-[16px]">
          <div className="flex size-[48px] items-center justify-center rounded-full border border-sd-grey-3 bg-[#F4F6F8] text-sd-blue">
            <SearchNormal size={24} variant="Linear" color="currentColor" />
          </div>
          <div className="flex flex-col">
            <span className="text-[24px] font-semibold text-sd-grey-12">12</span>
            <span className="text-[14px] text-sd-reviewer-muted">Overall score</span>
          </div>
        </div>
        {/* Internal Score */}
        <div className="flex-1 rounded-[12px] border border-sd-grey-3 bg-white p-[16px] flex items-center gap-[16px]">
          <div className="flex size-[48px] items-center justify-center rounded-full border border-sd-grey-3 bg-[#F4F6F8] text-sd-blue">
            <ArrowLeft2 size={24} variant="Linear" color="currentColor" />
          </div>
          <div className="flex flex-col">
            <span className="text-[24px] font-semibold text-sd-grey-12">3%</span>
            <span className="text-[14px] text-sd-reviewer-muted">Internal score</span>
          </div>
        </div>
        {/* External Score */}
        <div className="flex-1 rounded-[12px] border border-sd-grey-3 bg-white p-[16px] flex items-center gap-[16px]">
          <div className="flex size-[48px] items-center justify-center rounded-full border border-sd-grey-3 bg-[#F4F6F8] text-sd-blue">
            <ArrowRight2 size={24} variant="Linear" color="currentColor" />
          </div>
          <div className="flex flex-col">
            <span className="text-[24px] font-semibold text-sd-grey-12">3%</span>
            <span className="text-[14px] text-sd-reviewer-muted">External score</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-[24px]">
        {plagiarismModules.map((module) => {
          const isOpen = plagiarismModuleOpen[module.id] ?? false;
          return (
            <div key={module.id} className="rounded-[12px] border border-sd-grey-3 bg-white">
              <button
                type="button"
                onClick={() => setPlagiarismModuleOpen(prev => ({ ...prev, [module.id]: !isOpen }))}
                className="flex w-full items-center justify-between p-[16px] text-left transition-colors hover:bg-sd-grey-1 cursor-pointer"
              >
                <div className="flex flex-col gap-[4px]">
                  <h3 className="text-[14px] font-medium text-sd-grey-12">{module.title}</h3>
                  <span className="text-[12px] text-[#A75438]">{module.note}</span>
                </div>
                <ArrowDown2 size={20} variant="Linear" color="var(--sd-grey-12)" className={cn("transition-transform duration-200", isOpen ? "rotate-180" : "rotate-0")} />
              </button>

              {isOpen && (
                <div className="flex flex-col gap-[12px] p-[16px] pt-0">
                  {module.lessons.map((lesson) => {
                    const isLessonOpen = plagiarismLessonOpen[lesson.id] ?? false;
                    return (
                      <div key={lesson.id} className="rounded-[8px] border border-sd-grey-3 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setPlagiarismLessonOpen(prev => ({ ...prev, [lesson.id]: !isLessonOpen }))}
                          className="flex w-full items-center justify-between bg-white p-[16px] text-left transition-colors hover:bg-sd-grey-1 cursor-pointer"
                        >
                          <span className="text-[14px] text-sd-grey-12">{lesson.title}</span>
                          <span className={cn(
                            "text-[14px] font-medium",
                            lesson.status === 'warning' ? 'text-[#FF6B00]' : 'text-[#16A34A]'
                          )}>
                            {lesson.score}
                          </span>
                        </button>
                        
                        {isLessonOpen && lesson.content && (
                          <div className="border-t border-sd-grey-3 bg-white p-[24px] text-[14px] text-sd-reviewer-muted leading-[24px]">
                            {lesson.content.map((p, idx) => (
                              <p key={idx} className="mb-[16px] last:mb-0">
                                {p}
                              </p>
                            ))}
                            
                            {lesson.warning && (
                              <div className="mt-[20px] flex items-center gap-[12px] rounded-[8px] border-l-2 border-l-[#FA8500] bg-[#FFF8EB] px-[12px] py-[11px] text-[12px] font-normal leading-[16px] text-sd-grey-12">
                                <InfoCircle size={16} variant="Bold" color="#B77815" className="shrink-0" />
                                <span>{lesson.warning}</span>
                              </div>
                            )}
                            
                            {lesson.source && (
                              <p className="mt-[16px] text-[12px] font-normal leading-[16px] text-[#FF6B00]">
                                Source: <span className="underline">{lesson.source}</span>
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
