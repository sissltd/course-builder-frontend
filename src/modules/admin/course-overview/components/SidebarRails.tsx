import React from "react";
import { ArrowDown2, ArrowRight2, PlayCircle, BookSaved, Task } from "iconsax-react";
import { cn } from "@/lib/utils";

export const ScriptModuleRail = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  const [activeLesson, setActiveLesson] = React.useState("Lesson 1");
  const lessonItems = [
    { label: "Lesson 1", icon: PlayCircle },
    { label: "Lesson 2", icon: BookSaved },
    { label: "Lesson 3", icon: BookSaved },
    { label: "Lesson 4", icon: Task },
  ];

  return (
    <div className="flex flex-col gap-[16px]">
      <section className="rounded-[8px] border border-sd-blue bg-sd-grey-1 p-[12px]">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-[28px] w-full items-center justify-between gap-[12px] text-left -mx-[4px] px-[4px] rounded-[6px] transition-colors hover:bg-sd-grey-2 cursor-pointer"
        >
          <span className="text-[14px] font-normal leading-[20px] text-sd-grey-12">
            Module 1
          </span>
          <ArrowDown2 size={20} variant="Linear" color="var(--sd-grey-12)" className={cn("transition-transform duration-200", isOpen ? "rotate-0" : "-rotate-90")} />
        </button>

        {isOpen && (
          <div className="mt-[8px] flex flex-col">
            {lessonItems.map((lesson) => {
              const Icon = lesson.icon;
              const isActive = activeLesson === lesson.label;

              return (
                <button
                  key={lesson.label}
                  type="button"
                  onClick={() => setActiveLesson(lesson.label)}
                  className={cn(
                    "flex h-[32px] items-center rounded-[6px] px-[12px] text-left transition-colors cursor-pointer",
                    isActive ? "bg-sd-grey-3" : "hover:bg-sd-grey-2",
                  )}
                >
                  <span className="flex w-full items-center gap-[8px]">
                    <Icon size={16} variant="Linear" color="var(--sd-grey-11)" />
                    <span className="min-w-0 flex-1 truncate text-[14px] font-normal leading-[20px] text-sd-grey-11">
                      {lesson.label}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {["Module 2", "Module 3", "Module 4"].map((module) => (
        <button
          key={module}
          type="button"
          className="flex h-[36px] items-center justify-between rounded-[8px] border border-sd-grey-4 bg-sd-grey-1 px-[12px] text-left transition-colors hover:bg-sd-grey-2"
        >
          <span className="text-[14px] font-normal leading-[20px] text-sd-grey-12">
            {module}
          </span>
          <ArrowRight2 size={20} variant="Linear" color="var(--sd-grey-11)" />
        </button>
      ))}
    </div>
  );
};

export const QuizModuleRail = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  const [activeLesson, setActiveLesson] = React.useState('Lesson 1 Quiz');
  const lessonItems = [
    { label: 'Lesson 1 Quiz', icon: Task },
    { label: 'Lesson 2 Quiz', icon: Task },
    { label: 'Lesson 3 Quiz', icon: Task },
    { label: 'Lesson 4 Quiz', icon: Task },
  ];

  return (
    <div className="flex flex-col gap-[16px]">
      <section className="rounded-[8px] border border-sd-blue bg-sd-grey-1 p-[12px]">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-[28px] w-full items-center justify-between gap-[12px] text-left -mx-[4px] px-[4px] rounded-[6px] transition-colors hover:bg-sd-grey-2 cursor-pointer"
        >
          <span className="text-[14px] font-normal leading-[20px] text-sd-grey-12">
            Module 1
          </span>
          <ArrowDown2 size={20} variant="Linear" color="var(--sd-grey-12)" className={cn("transition-transform duration-200", isOpen ? "rotate-0" : "-rotate-90")} />
        </button>

        {isOpen && (
          <div className="mt-[8px] flex flex-col">
            {lessonItems.map((lesson) => {
              const Icon = lesson.icon;
              const isActive = activeLesson === lesson.label;

              return (
                <button
                  key={lesson.label}
                  type="button"
                  onClick={() => setActiveLesson(lesson.label)}
                  className={cn(
                    'flex h-[32px] items-center rounded-[6px] px-[12px] text-left transition-colors cursor-pointer',
                    isActive ? 'bg-sd-grey-3' : 'hover:bg-sd-grey-2',
                  )}
                >
                  <span className="flex w-full items-center gap-[8px]">
                    <Icon size={16} variant="Linear" color="var(--sd-grey-11)" />
                    <span className="min-w-0 flex-1 truncate text-[14px] font-normal leading-[20px] text-sd-grey-11">
                      {lesson.label}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {['Module 2', 'Module 3', 'Module 4'].map((module) => (
        <button
          key={module}
          type="button"
          className="flex h-[36px] items-center justify-between rounded-[8px] border border-sd-grey-4 bg-sd-grey-1 px-[12px] text-left transition-colors hover:bg-sd-grey-2 cursor-pointer"
        >
          <span className="text-[14px] font-normal leading-[20px] text-sd-grey-12">
            {module}
          </span>
          <ArrowRight2 size={20} variant="Linear" color="var(--sd-grey-11)" />
        </button>
      ))}
    </div>
  );
};

export const MediaModuleRail = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  const [activeLesson, setActiveLesson] = React.useState('Lesson 1');
  const lessonItems = [
    { label: 'Lesson 1', icon: PlayCircle },
    { label: 'Lesson 2', icon: BookSaved },
    { label: 'Lesson 3', icon: BookSaved },
  ];

  return (
    <div className="flex flex-col gap-[16px]">
      <section className="rounded-[8px] border border-sd-blue bg-sd-grey-1 p-[12px]">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-[28px] w-full items-center justify-between gap-[12px] text-left -mx-[4px] px-[4px] rounded-[6px] transition-colors hover:bg-sd-grey-2 cursor-pointer"
        >
          <span className="text-[14px] font-normal leading-[20px] text-sd-grey-12">
            Module 1
          </span>
          <ArrowDown2 size={20} variant="Linear" color="var(--sd-grey-12)" className={cn("transition-transform duration-200", isOpen ? "rotate-0" : "-rotate-90")} />
        </button>

        {isOpen && (
          <div className="mt-[8px] flex flex-col">
            {lessonItems.map((lesson) => {
              const Icon = lesson.icon;
              const isActive = activeLesson === lesson.label;

              return (
                <button
                  key={lesson.label}
                  type="button"
                  onClick={() => setActiveLesson(lesson.label)}
                  className={cn(
                    'flex h-[32px] items-center rounded-[6px] px-[12px] text-left transition-colors cursor-pointer',
                    isActive ? 'bg-sd-grey-3' : 'hover:bg-sd-grey-2',
                  )}
                >
                  <span className="flex w-full items-center gap-[8px]">
                    <Icon size={16} variant="Linear" color="var(--sd-grey-11)" />
                    <span className="min-w-0 flex-1 truncate text-[14px] font-normal leading-[20px] text-sd-grey-11">
                      {lesson.label}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {['Module 2', 'Module 3', 'Module 4'].map((module) => (
        <button
          key={module}
          type="button"
          className="flex h-[36px] items-center justify-between rounded-[8px] border border-sd-grey-4 bg-sd-grey-1 px-[12px] text-left transition-colors hover:bg-sd-grey-2 cursor-pointer"
        >
          <span className="text-[14px] font-normal leading-[20px] text-sd-grey-12">
            {module}
          </span>
          <ArrowRight2 size={20} variant="Linear" color="var(--sd-grey-11)" />
        </button>
      ))}
    </div>
  );
};
