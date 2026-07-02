"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface QuizSummaryDisplayProps {
  questions: any[];
}

function getOptionValue(opt: any): string {
  if (typeof opt === "string") return opt;
  return opt?.value ?? "";
}

function getOptionId(opt: any, fallback: string): string {
  if (typeof opt === "string") return fallback;
  return opt?.id ?? fallback;
}

function getOptionLabel(opt: any, fallback: string): string {
  if (typeof opt === "string") return fallback;
  return opt?.label ?? fallback;
}

function isCorrectOption(q: any, opt: any, optIdx: number): boolean {
  if (q.type === "single") {
    return q.correctOptionId === getOptionId(opt, `${optIdx}`);
  }
  if (q.type === "multiple") {
    return (q.correctOptionIds || []).includes(getOptionId(opt, `${optIdx}`));
  }
  return false;
}

export const QuizSummaryDisplay = ({ questions }: QuizSummaryDisplayProps) => {
  if (!questions || questions.length === 0) {
    return (
      <p className="text-[14px] text-[#606060] italic">
        No quiz questions yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-[16px] w-full">
      {questions.map((q: any, qIdx: number) => {
        const options = q.options || [];
        return (
          <div
            key={q.id || qIdx}
            className="bg-[#FDFDFD] border border-[#D9D9D9] px-[16px] py-[20px] rounded-[12px] w-full"
          >
            {/* Question header */}
            <div className="flex items-start gap-[12px] mb-[16px]">
              <span className="text-[16px] font-medium text-[#202020] whitespace-nowrap leading-[24px]">
                Question {qIdx + 1}
              </span>
              <div className="flex-1">
                <span className="text-[16px] font-normal text-[#606060] leading-[24px]">
                  {q.question}
                </span>
              </div>
              {typeof q.points === "number" && (
                <span className="text-[12px] text-[#8C8C8C] whitespace-nowrap mt-[4px]">
                  {q.points} pt{q.points !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {/* Essay type */}
            {q.type === "essay" ? (
              <div className="border border-[#E8E8E8] rounded-[8px] p-[16px] bg-[#FAFAFA]">
                <p className="text-[13px] text-[#606060] mb-[8px] font-medium">
                  Expected answer:
                </p>
                <div className="text-[14px] text-[#202020] whitespace-pre-wrap">
                  {q.correctAnswer || "No answer provided"}
                </div>
              </div>
            ) : (
              /* Single / Multiple choice options */
              <div className="flex flex-col gap-[8px]">
                {options.map((opt: any, optIdx: number) => {
                  const label = getOptionLabel(opt, String.fromCharCode(65 + optIdx));
                  const isCorrect = isCorrectOption(q, opt, optIdx);
                  return (
                    <div
                      key={getOptionId(opt, `${qIdx}-${optIdx}`)}
                      className={cn(
                        "flex items-center gap-[12px] px-[12px] py-[10px] rounded-[8px] border transition-all",
                        isCorrect
                          ? "border-green-500 bg-green-50"
                          : "border-[#E8E8E8] bg-white"
                      )}
                    >
                      <span className="text-[14px] font-semibold text-[#202020] w-[20px] shrink-0">
                        {label}
                      </span>
                      <span className="text-[14px] text-[#606060]">
                        {getOptionValue(opt)}
                      </span>
                      {isCorrect && (
                        <span className="ml-auto text-[12px] text-green-600 font-medium">
                          Correct
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Explanation */}
            {q.explanation && (
              <p className="text-[13px] text-[#606060] mt-[12px] italic">
                {q.explanation}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};
