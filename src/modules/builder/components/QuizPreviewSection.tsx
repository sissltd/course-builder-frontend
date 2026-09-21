"use client";

import React from "react";
import type { QuizQuestionData } from "@/redux/slices/courseBuilderSlice";

interface QuizPreviewSectionProps {
  questions: QuizQuestionData[];
  title?: string;
}

const letterForIndex = (index: number): string => {
  let n = index;
  let label = "";
  do {
    label = String.fromCharCode(65 + (n % 26)) + label;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return label;
};

export const QuizPreviewSection = ({ questions, title = "Quiz" }: QuizPreviewSectionProps) => {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="w-full">
      <h4 className="text-[18px] md:text-[20px] font-semibold text-[#202020] leading-[24px] md:leading-[28px] mb-[16px] md:mb-[24px]">
        {title}
      </h4>
      <div className="flex flex-col gap-[20px] items-start w-full">
        {questions.map((q, qIdx) => (
          <div
            key={q.id || qIdx}
            className="bg-[#FDFDFD] border border-[#D9D9D9] rounded-[8px] p-[16px] flex flex-col gap-[16px] w-full"
          >
            <div className="flex items-start gap-[12px] text-[16px] leading-[24px] tracking-[-0.32px] w-full">
              <span className="text-[#202020] whitespace-nowrap shrink-0">
                Question {qIdx + 1}
              </span>
              <span className="text-[#606060] break-words">{q.question}</span>
            </div>

            {q.type === "essay" ? (
              <div className="flex flex-col gap-[12px] w-full">
                <div className="border border-[#E8E8E8] rounded-[8px] p-[16px] bg-[#FAFAFA] w-full">
                  <p className="text-[13px] text-[#606060] font-medium mb-[8px]">
                    Expected answer:
                  </p>
                  <p className="text-[14px] leading-[20px] text-[#202020] whitespace-pre-wrap">
                    {q.correctAnswer || "No answer provided"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-[16px] items-start w-full">
                {(q.options || []).map((opt, optIdx) => (
                  <div key={opt.id || optIdx} className="flex items-center w-full">
                    <div className="flex items-center gap-[12px]">
                      <span className="text-[14px] leading-[20px] tracking-[-0.28px] text-[#606060] text-center">
                        {opt.label || letterForIndex(optIdx)}
                      </span>
                      <span className="bg-white border-[1.08px] border-[#D9D9D9] rounded-full size-[18px] shrink-0" />
                      <span className="text-[14px] leading-[20px] tracking-[-0.28px] text-[#606060]">
                        {opt.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {q.explanation && (
              <p className="text-[13px] leading-[20px] text-[#606060] italic">
                {q.explanation}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
