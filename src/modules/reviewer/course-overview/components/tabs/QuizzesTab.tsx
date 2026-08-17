import React from "react";
import { PlayCircle, TaskSquare, TickCircle, InfoCircle } from "iconsax-react";
import { cn } from "@/lib/utils";
import { quizQuestions } from "../../data/mockData";

export const QuizzesTab = () => {
  const [selectedQuizAnswers, setSelectedQuizAnswers] = React.useState<Record<number, number>>(() => {
    const initial: Record<number, number> = {};
    quizQuestions.forEach((q, i) => {
      const correctIdx = q.options.findIndex(o => o.isCorrect);
      if (correctIdx !== -1) initial[i] = correctIdx;
    });
    return initial;
  });

  const toggleQuizAnswer = (qIndex: number, optIndex: number) => {
    setSelectedQuizAnswers(prev => ({
      ...prev,
      [qIndex]: optIndex
    }));
  };

  return (
    <div className="flex flex-col gap-[24px]">
      <div className="flex flex-col gap-[12px] border-b border-sd-grey-3 pb-[24px]">
        <div className="flex items-center gap-[12px]">
          <PlayCircle size={24} variant="Linear" color="var(--sd-grey-12)" />
          <h2 className="text-[22px] font-semibold leading-[28px] text-sd-grey-12">
            Lesson 1 Quiz
          </h2>
        </div>
        <div className="ml-[36px] flex items-center gap-[24px] text-[12px] font-normal leading-[16px] text-sd-reviewer-muted">
          <span className="flex items-center gap-[8px]">
            <TaskSquare size={16} variant="Linear" color="currentColor" />
            <span>4 questions</span>
          </span>
          <span className="flex items-center gap-[8px]">
            <TickCircle size={16} variant="Linear" color="currentColor" />
            <span>40marks</span>
          </span>
        </div>
      </div>

      <div className="flex flex-col">
        {quizQuestions.map((quiz, index) => (
          <div
            key={index}
            className="flex flex-col gap-[16px] py-[24px] border-b border-sd-grey-3 last:border-0"
          >
            <div className="flex flex-col gap-[8px]">
              <span className="text-[14px] font-semibold leading-[20px] text-sd-grey-12">
                Question {index + 1}/4
              </span>
              <p className="text-[14px] font-normal leading-[20px] text-sd-grey-12">
                {quiz.prompt}
              </p>
            </div>

            <div className="flex flex-col gap-[12px]">
              {quiz.options.map((option, optIdx) => {
                const letter = String.fromCharCode(65 + optIdx); // A, B, C, D
                const isSelected = selectedQuizAnswers[index] === optIdx;

                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => toggleQuizAnswer(index, optIdx)}
                    className="flex flex-col gap-[8px] text-left p-[8px] -mx-[8px] rounded-[8px] transition-colors hover:bg-sd-grey-2 cursor-pointer"
                  >
                    <div className="flex items-center gap-[12px] w-full">
                      <span className="text-[14px] font-medium leading-[20px] text-sd-reviewer-muted shrink-0 w-[12px]">
                        {letter}
                      </span>

                      <div className={cn(
                        "relative flex size-[18px] items-center justify-center rounded-full shrink-0",
                        isSelected ? "border-[2px] border-sd-blue bg-white" : "border-[1.5px] border-sd-grey-4 bg-transparent"
                      )}>
                        {isSelected && <div className="absolute size-[10px] rounded-full bg-sd-blue" />}
                      </div>

                      <span className="flex-1 text-[14px] font-normal leading-[20px] text-sd-grey-12">
                        {option.text}
                      </span>

                      <span className={cn(
                        "rounded-[4px] px-[8px] py-[3px] text-[12px] font-medium leading-[16px] shrink-0",
                        option.isCorrect
                          ? "bg-[#EAFBF3] text-[#16A34A]"
                          : "bg-[#FFEADC] text-[#E03131]"
                      )}>
                        {option.isCorrect ? 'Correct' : 'In-correct'}
                      </span>
                    </div>

                    <div className="ml-[42px] flex items-center gap-[4px] text-[12px] font-normal leading-[16px]">
                      <span className="font-semibold text-sd-grey-12 shrink-0">Explanation:</span>
                      <span className="text-sd-reviewer-muted">{option.explanation}</span>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="mt-[8px] flex items-center gap-[10px] rounded-[8px] border-l-[4px] border-[#B77815] bg-[#FCF5E8] p-[12px] text-[13px] font-normal leading-[20px] text-sd-grey-12">
              <InfoCircle size={16} variant="Bulk" className="shrink-0" color="#B77815" />
              <span>{quiz.note}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
