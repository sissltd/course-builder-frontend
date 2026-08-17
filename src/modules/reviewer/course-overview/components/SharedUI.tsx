import React from "react";
import { Clock, BookSaved, More, Task, VideoPlay, TickCircle, InfoCircle } from "iconsax-react";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { LessonTone, Lesson } from "../data/mockData";

export const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-[4px]">
    <span className="text-[12px] font-normal leading-[16px] text-sd-reviewer-muted">
      {label}
    </span>
    <span className="text-[14px] font-normal leading-[20px] text-sd-grey-12">
      {value}
    </span>
  </div>
);

export const StatCard = ({
  icon: Icon,
  value,
  label,
  iconBg,
  iconColor,
}: {
  icon: React.ElementType;
  value: string;
  label: string;
  iconBg: string;
  iconColor: string;
}) => (
  <div className="flex min-h-[58px] items-center gap-[12px] rounded-[10px] border border-sd-grey-3 bg-sd-grey-1 px-[14px] py-[12px] shadow-[0_1px_0_rgba(0,0,0,0.02)]">
    <div className={cn("flex size-[36px] items-center justify-center rounded-[8px] border border-sd-grey-3", iconBg)}>
      <Icon size={20} color={iconColor} />
    </div>
    <div className="flex min-w-0 flex-col">
      <span className="text-[18px] font-semibold leading-[24px] text-sd-grey-12">
        {value}
      </span>
      <span className="text-[12px] leading-[16px] text-sd-reviewer-muted">
        {label}
      </span>
    </div>
  </div>
);

export const NoteTag = ({ tone, children }: { tone: LessonTone; children: React.ReactNode }) => {
  const toneClassName =
    tone === "warning"
      ? "border-sd-warning-bg border-l-4 bg-sd-warning-bg text-sd-reviewer-muted"
      : tone === "soft"
        ? "border-sd-grey-4 bg-sd-grey-1 text-sd-reviewer-muted"
        : "border-sd-blue-light bg-sd-blue-light text-sd-blue";

  return (
    <div
      className={cn(
        "w-fit rounded-[6px] border px-[8px] py-[4px] text-[12px] leading-[16px]",
        toneClassName,
      )}
    >
      {children}
    </div>
  );
};

export const ModuleLesson = ({ lesson }: { lesson: Lesson }) => {
  const Icon =
    lesson.type === "video"
      ? VideoPlay
      : lesson.type === "assessment"
        ? Task
        : BookOpen;

  return (
    <div className="flex flex-col gap-[8px] rounded-[8px] border border-sd-grey-3 bg-sd-grey-1 p-[16px] transition-colors hover:border-sd-grey-4 hover:bg-sd-grey-2 cursor-pointer">
      <div className="flex items-center justify-between gap-[16px]">
        <div className="flex items-center gap-[12px] flex-1 min-w-0">
          <Icon size={20} variant="Linear" color="var(--sd-grey-9)" className="shrink-0" />
          <div className="flex flex-col gap-[4px] min-w-0">
            <span className="text-[14px] font-semibold leading-[20px] text-sd-grey-12 truncate">
              {lesson.title}
            </span>
            <div className="flex items-center gap-[12px] text-[12px] leading-[16px] text-sd-reviewer-muted">
              <span className="flex items-center gap-[4px]">
                <Clock size={14} variant="Linear" color="currentColor" />
                <span>{lesson.meta.split("  •  ")[0]}</span>
              </span>
              <span className="flex items-center gap-[4px]">
                <BookSaved size={14} variant="Linear" color="currentColor" />
                <span>{lesson.meta.split("  •  ")[1]}</span>
              </span>
            </div>
          </div>
        </div>
        {lesson.tone === "success" && (
          <span className="rounded-[4px] bg-sd-blue-light px-[8px] py-[3px] text-[12px] font-semibold leading-[16px] text-sd-blue shrink-0">
            Pass
          </span>
        )}
      </div>
      {lesson.tone !== "success" && (
        <div className="ml-[32px] w-fit rounded-[6px] bg-[#FFEADC] p-[8px] text-[12px] leading-[16px] text-[#592D18]">
          <span>{lesson.note}</span>
        </div>
      )}
    </div>
  );
};

export const ReviewListItem = ({ label, value, tone }: { label: string; value: string; tone: LessonTone }) => (
  <div className="rounded-[8px] border border-sd-grey-3 bg-sd-grey-1 p-[12px]">
    <div className="flex items-start justify-between gap-[12px]">
      <div className="flex flex-col gap-[4px]">
        <span className="text-[12px] font-medium leading-[16px] text-sd-grey-12">
          {label}
        </span>
        <span className="text-[12px] leading-[16px] text-sd-reviewer-muted">
          {value}
        </span>
      </div>
      <button type="button" className="transition-colors hover:text-sd-grey-12" aria-label="More options">
        <More size={18} variant="Linear" color="currentColor" />
      </button>
    </div>
    <div className="mt-[12px]">
      <NoteTag tone={tone}>{tone === "warning" ? "Needs review" : "Resolved"}</NoteTag>
    </div>
  </div>
);

export const ScriptField = ({
  label,
  children,
  className,
  invalid,
  helper,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  invalid?: boolean;
  helper?: string;
}) => (
  <label className="block">
    <span className="mb-[8px] block text-[14px] font-normal leading-[20px] text-sd-grey-12">
      {label}
    </span>
    <textarea
      className={cn(
        "w-full rounded-[8px] border bg-sd-grey-1 px-[14px] py-[10px] text-[14px] font-normal leading-[20px] text-sd-grey-12 outline-none focus:border-sd-blue resize-none block",
        invalid ? "border-sd-danger" : "border-sd-grey-6",
        className,
      )}
      defaultValue={typeof children === 'string' ? children : Array.isArray(children) ? children.join('') : undefined}
    />
    {helper && (
      <span className="mt-[8px] block text-[12px] font-normal leading-[16px] text-[#FF8B76]">
        {helper}
      </span>
    )}
  </label>
);

export const ScriptSectionCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <section className={cn("rounded-[16px] border border-sd-grey-4 bg-sd-grey-1 p-[16px]", className)}>
    {children}
  </section>
);

export const ScriptObjectiveItem = ({ number, text }: { number: string; text: string }) => (
  <div className="rounded-[8px] border border-sd-grey-5 bg-sd-grey-1 px-[20px] py-[16px]">
    <div className="flex gap-[8px] text-[16px] font-normal leading-[24px] text-sd-reviewer-muted">
      <span className="w-[37px] shrink-0 text-sd-grey-12">{number}</span>
      <span className="max-w-[520px]">{text}</span>
    </div>
  </div>
);
