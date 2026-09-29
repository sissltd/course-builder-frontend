import React from "react";
import { More } from "iconsax-react";
import { cn } from "@/lib/utils";
import type { CourseAssessment, CourseQuizQuestion } from "@/redux/slices/adminApi";

export type NoteTone = "warning" | "soft" | "success";

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

export const NoteTag = ({ tone, children }: { tone: NoteTone; children: React.ReactNode }) => {
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

export const ReviewListItem = ({ label, value, tone }: { label: string; value: string; tone: NoteTone }) => (
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

const getOptionLabel = (index: number) => String.fromCharCode(65 + index);

const getOptionText = (
  option: NonNullable<CourseQuizQuestion["options"]>[number],
) => {
  if (typeof option === "string") return option;
  return option.text || option.value || "No option text provided";
};

const getOptionExplanation = (
  option: NonNullable<CourseQuizQuestion["options"]>[number],
) => (typeof option === "string" ? undefined : option.explanation);

const isOptionMarkedCorrect = (
  question: CourseQuizQuestion,
  option: NonNullable<CourseQuizQuestion["options"]>[number],
  optionIndex: number,
) =>
  question.correct_index === optionIndex ||
  question.correct_indices?.includes(optionIndex) ||
  (typeof option !== "string" && option.is_correct === true);

export const AssessmentCard = ({ assessment }: { assessment: CourseAssessment }) => {
  const summary = assessment.summary ?? {};
  const questionCount = assessment.questions?.length ?? summary.total_questions ?? 0;

  return (
    <div className="rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 p-[20px]">
      <div className="flex items-start justify-between gap-[16px]">
        <div className="flex flex-col gap-[4px]">
          <span className="text-[15px] font-semibold leading-[20px] text-sd-grey-12">
            {assessment.title}
          </span>
          <span className="text-[12px] leading-[16px] text-sd-reviewer-muted">
            {assessment.level} assessment · {questionCount} question
            {questionCount === 1 ? "" : "s"}
            {typeof summary.total_points === "number" ? ` · ${summary.total_points} points` : ""}
          </span>
        </div>
        <span className="shrink-0 rounded-[4px] bg-sd-blue/10 px-[8px] py-[2px] text-[11px] font-medium text-sd-blue">
          {summary.single_choice_count ?? 0} single · {summary.multiple_choice_count ?? 0} multiple ·{" "}
          {summary.essay_count ?? 0} essay
        </span>
      </div>

      {questionCount === 0 ? (
        <p className="mt-[12px] text-[14px] leading-[22px] text-sd-reviewer-muted italic">
          No questions configured for this assessment.
        </p>
      ) : (
        <div className="mt-[16px]">
          {assessment.questions.map((question, idx) => {
            const options = question.options ?? [];
            const hasCorrectAnswer =
              typeof question.correct_index === "number" ||
              Boolean(question.correct_indices?.length) ||
              options.some(
                (option) => typeof option !== "string" && option.is_correct === true,
              );
            const hasOptionExplanations = options.some((option) =>
              Boolean(getOptionExplanation(option)),
            );

            return (
              <section
                key={idx}
                className="border-t border-sd-grey-4 py-[20px] first:border-t-0 first:pt-0 last:pb-0"
              >
                <div className="flex items-start justify-between gap-[16px]">
                  <div className="flex min-w-0 flex-col gap-[12px]">
                    <span className="text-[13px] font-normal leading-[20px] text-sd-grey-12">
                      Question {idx + 1}/{questionCount}
                    </span>
                    <span className="text-[14px] font-normal leading-[20px] text-sd-grey-12">
                      {question.question}
                    </span>
                  </div>
                  {typeof question.points === "number" && (
                    <span className="shrink-0 text-[12px] leading-[16px] text-sd-reviewer-muted">
                      {question.points} pt{question.points === 1 ? "" : "s"}
                    </span>
                  )}
                </div>

                {options.length > 0 && (
                  <ul className="mt-[20px] flex flex-col gap-[20px]">
                    {options.map((option, optionIdx) => {
                      const correct = isOptionMarkedCorrect(question, option, optionIdx);
                      const optionExplanation = getOptionExplanation(option);

                      return (
                        <li
                          key={optionIdx}
                          className="grid grid-cols-[20px_18px_minmax(0,1fr)_auto] items-start gap-x-[10px]"
                        >
                          <span className="text-[14px] leading-[20px] text-sd-reviewer-muted">
                            {typeof option !== "string" && option.label
                              ? option.label
                              : getOptionLabel(optionIdx)}
                          </span>
                          <span
                            aria-hidden="true"
                            className={cn(
                              "mt-[1px] flex size-[18px] items-center justify-center rounded-full border bg-sd-grey-1",
                              correct ? "border-2 border-sd-blue" : "border-sd-grey-5",
                            )}
                          >
                            {correct && <span className="size-[8px] rounded-full bg-sd-blue" />}
                          </span>
                          <span className="text-[14px] leading-[20px] text-sd-grey-12">
                            {getOptionText(option)}
                          </span>
                          {hasCorrectAnswer && (
                            <span
                              className={cn(
                                "ml-[12px] shrink-0 rounded-[5px] px-[9px] py-[3px] text-[11px] font-medium leading-[16px]",
                                correct
                                  ? "bg-[#DCFCE7] text-[#16A34A]"
                                  : "bg-[#FFE8E2] text-[#FF5025]",
                              )}
                            >
                              {correct ? "Correct" : "In-correct"}
                            </span>
                          )}
                          {optionExplanation && (
                            <p className="col-start-3 col-end-5 mt-[6px] text-[12px] leading-[18px] text-sd-reviewer-muted">
                              <span className="font-medium text-sd-grey-12">Explanation:</span>{" "}
                              {optionExplanation}
                            </p>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}

                {question.expected_answer && options.length === 0 && (
                  <div className="mt-[16px] rounded-[8px] border border-sd-grey-4 bg-sd-grey-2 p-[12px]">
                    <span className="text-[12px] font-medium leading-[18px] text-sd-grey-12">
                      Expected answer
                    </span>
                    <p className="mt-[4px] whitespace-pre-wrap text-[13px] leading-[20px] text-sd-reviewer-muted">
                      {question.expected_answer}
                    </p>
                  </div>
                )}

                {question.explanation && !hasOptionExplanations && (
                  <p
                    className={cn(
                      "mt-[12px] text-[12px] leading-[18px] text-sd-reviewer-muted",
                      options.length > 0 && "ml-[58px]",
                    )}
                  >
                    <span className="font-medium text-sd-grey-12">Explanation:</span>{" "}
                    {question.explanation}
                  </p>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
};
