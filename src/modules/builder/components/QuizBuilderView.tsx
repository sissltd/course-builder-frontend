"use client";

import React, { useState } from "react";
import { Button } from "@/components/shared/Button";
import { cn } from "@/lib/utils";
import { Trash, Add } from "iconsax-react";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { FormTextarea } from "@/components/form/FormTextarea";
import type { QuizBuilderOption, QuizBuilderQuestion } from "@/redux/slices/quizBuilderSlice";

interface QuizBuilderViewProps {
  questions: QuizBuilderQuestion[];
  onChange: (questions: QuizBuilderQuestion[]) => void;
}

const LETTERS = ["A", "B", "C", "D", "E", "F"];

const TYPE_OPTIONS = [
  { label: "Single choice", value: "single" },
  { label: "Multiple choice", value: "multiple" },
  { label: "Essay", value: "essay" },
];

const deepClone = (q: QuizBuilderQuestion): QuizBuilderQuestion => ({
  ...q,
  options: q.options.map(o => ({ ...o })),
});

const defaultQuestion = (id: string): QuizBuilderQuestion => ({
  id,
  question: "",
  type: "single",
  points: 0,
  options: [
    { id: `${id}-a`, label: "A", value: "" },
    { id: `${id}-b`, label: "B", value: "" },
  ],
  correctOptionId: undefined,
  explanation: "",
});

export const QuizBuilderView = ({ questions, onChange }: QuizBuilderViewProps) => {
  const [activeTab, setActiveTab] = useState<"builder" | "preview">("builder");
  const [items, setItems] = useState<QuizBuilderQuestion[]>(
    questions.length > 0
      ? questions.map(deepClone)
      : [defaultQuestion("1")]
  );

  const emitChange = (updated: QuizBuilderQuestion[]) => {
    setItems(updated);
    onChange(updated);
  };

  const handleAddQuestion = () => {
    const newId = Date.now().toString();
    emitChange([...items, defaultQuestion(newId)]);
  };

  const handleRemoveQuestion = (idx: number) => {
    emitChange(items.filter((_, i) => i !== idx));
  };

  const handleUpdateQuestion = (idx: number, field: string, value: any) => {
    const updated = items.map(deepClone);
    const q = updated[idx] as any;
    if (field === "type" && value !== q.type) {
      q.type = value;
      if (value === "essay") {
        q.options = [];
        q.correctOptionId = undefined;
        q.correctOptionIds = undefined;
        q.correctAnswer = "";
      } else if (value === "single") {
        q.options = q.options.length >= 2 ? q.options : [{ id: `${q.id}-a`, label: "A", value: "" }, { id: `${q.id}-b`, label: "B", value: "" }];
        q.correctOptionId = undefined;
        q.correctOptionIds = undefined;
      } else if (value === "multiple") {
        q.options = q.options.length >= 2 ? q.options : [{ id: `${q.id}-a`, label: "A", value: "" }, { id: `${q.id}-b`, label: "B", value: "" }];
        q.correctOptionIds = [];
        q.correctOptionId = undefined;
      }
    } else {
      q[field] = value;
    }
    emitChange(updated);
  };

  const handleAddOption = (qIdx: number) => {
    const updated = items.map(deepClone);
    const q = updated[qIdx];
    const newLabel = LETTERS[q.options.length] || String.fromCharCode(65 + q.options.length);
    q.options.push({ id: `${q.id}-${newLabel.toLowerCase()}`, label: newLabel, value: "" });
    emitChange(updated);
  };

  const handleRemoveOption = (qIdx: number, optIdx: number) => {
    const updated = items.map(deepClone);
    const q = updated[qIdx];
    const removedId = q.options[optIdx]?.id;
    q.options = q.options.filter((_, i) => i !== optIdx).map((opt, i) => ({ ...opt, label: LETTERS[i], id: `${q.id}-${LETTERS[i].toLowerCase()}` }));
    if (q.correctOptionId === removedId) {
      q.correctOptionId = undefined;
    }
    if (q.correctOptionIds) {
      q.correctOptionIds = q.correctOptionIds.filter(id => id !== removedId);
    }
    emitChange(updated);
  };

  const handleUpdateOption = (qIdx: number, optIdx: number, value: string) => {
    const updated = items.map(deepClone);
    updated[qIdx].options[optIdx].value = value;
    emitChange(updated);
  };

  const toggleCorrectOption = (qIdx: number, optId: string) => {
    const updated = items.map(deepClone);
    const q = updated[qIdx];
    if (q.type === "single") {
      q.correctOptionId = q.correctOptionId === optId ? undefined : optId;
    } else if (q.type === "multiple") {
      const ids = q.correctOptionIds || [];
      q.correctOptionIds = ids.includes(optId)
        ? ids.filter(id => id !== optId)
        : [...ids, optId];
    }
    emitChange(updated);
  };

  return (
    <div className="flex flex-col">
      {/* Tabs */}
      <div className="mb-[24px]">
        <div className="flex gap-[4px] bg-[#F0F0F0] rounded-[8px] p-[4px] w-fit">
          <button
            type="button"
            onClick={() => setActiveTab("builder")}
            className={cn(
              "px-[20px] py-[8px] rounded-[6px] text-[14px] font-medium transition-all",
              activeTab === "builder" ? "bg-white text-[#202020] shadow-sm" : "text-[#606060] hover:text-[#202020]"
            )}
          >
            Quiz Builder
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={cn(
              "px-[20px] py-[8px] rounded-[6px] text-[14px] font-medium transition-all",
              activeTab === "preview" ? "bg-white text-[#202020] shadow-sm" : "text-[#606060] hover:text-[#202020]"
            )}
          >
            Preview
          </button>
        </div>
      </div>

      {activeTab === "builder" ? (
        <div className="flex flex-col gap-[24px]">
          {items.map((q, qIdx) => (
            <div key={q.id} className="border border-[#E8E8E8] rounded-[16px] p-[20px] bg-white">
              {/* Question header row */}
              <div className="flex items-center justify-between mb-[20px]">
                <div className="flex items-center gap-[12px] flex-wrap">
                  <div className="flex flex-col gap-[2px] opacity-35 cursor-grab">
                    <div className="flex gap-[2px]"><span className="size-[3px] bg-black rounded-full"/><span className="size-[3px] bg-black rounded-full"/></div>
                    <div className="flex gap-[2px]"><span className="size-[3px] bg-black rounded-full"/><span className="size-[3px] bg-black rounded-full"/></div>
                    <div className="flex gap-[2px]"><span className="size-[3px] bg-black rounded-full"/><span className="size-[3px] bg-black rounded-full"/></div>
                  </div>
                  <span className="text-[16px] font-semibold text-[#202020]">Question {qIdx + 1}:</span>
                  <div className="flex items-center gap-[8px]">
                    <span className="text-[14px] text-[#606060]">Point:</span>
                    <div className="flex items-center border border-[#D9D9D9] rounded-[6px] h-[32px]">
                      <button
                        type="button"
                        onClick={() => handleUpdateQuestion(qIdx, "points", Math.max(0, q.points - 1))}
                        className="px-[8px] h-full text-[#606060] hover:text-[#202020] border-r border-[#D9D9D9]"
                      >−</button>
                      <span className="px-[12px] text-[14px] text-[#202020] min-w-[24px] text-center">{q.points}</span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQuestion(qIdx, "points", q.points + 1)}
                        className="px-[8px] h-full text-[#606060] hover:text-[#202020] border-l border-[#D9D9D9]"
                      >+</button>
                    </div>
                  </div>
                  <FormSelect
                    name={`q-type-${qIdx}`}
                    value={q.type}
                    onValueChange={(val) => handleUpdateQuestion(qIdx, "type", val)}
                    options={TYPE_OPTIONS}
                    placeholder="Question choice"
                    triggerClassName="h-[32px] text-[13px]"
                    containerClassName="w-[160px]"
                  />
                  <button type="button" onClick={() => handleRemoveQuestion(qIdx)} className="size-[32px] flex items-center justify-center hover:opacity-70">
                    <Trash size={18} variant="Linear" color="#FF6B00" />
                  </button>
                </div>
              </div>

              {/* Question input */}
              <div className="flex items-start gap-[16px] mb-[16px]">
                <span className="text-[14px] text-[#202020] font-medium w-[100px] shrink-0 mt-[10px]">Question</span>
                <div className="flex-1">
                  <FormInput
                    name={`q-text-${qIdx}`}
                    value={q.question}
                    onChange={(e) => handleUpdateQuestion(qIdx, "question", e.target.value)}
                    placeholder="Enter question"
                    containerClassName="flex-1"
                    className="text-[14px]"
                  />
                </div>
              </div>

              {/* Single choice: Correct option dropdown */}
              {q.type === "single" && (
                <div className="flex items-center gap-[16px] mb-[20px]">
                  <span className="text-[14px] text-[#202020] font-medium w-[100px] shrink-0">Correct option</span>
                  <div className="flex-1">
                    <FormSelect
                      name={`q-correct-${qIdx}`}
                      value={q.correctOptionId || ""}
                      onValueChange={(val) => handleUpdateQuestion(qIdx, "correctOptionId", val || undefined)}
                      options={q.options.map(o => ({ label: `${o.label}. ${o.value || `Option ${o.label}`}`, value: o.id }))}
                      placeholder="Select the correct option to this question"
                      triggerClassName="h-[44px] text-[14px]"
                    />
                  </div>
                </div>
              )}

              {/* Multiple choice: Inline checkboxes */}
              {q.type === "multiple" && (
                <div className="mb-[20px]">
                  <span className="text-[14px] text-[#202020] font-medium block mb-[8px]">Correct options</span>
                  <div className="flex flex-wrap gap-[8px]">
                    {q.options.map((opt) => {
                      const checked = q.correctOptionIds?.includes(opt.id) || false;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => toggleCorrectOption(qIdx, opt.id)}
                          className={cn(
                            "flex items-center gap-[8px] px-[12px] py-[6px] rounded-[6px] border text-[13px] transition-all",
                            checked
                              ? "border-[#0A60E1] bg-[#F0F7FF] text-[#0A60E1]"
                              : "border-[#D9D9D9] text-[#606060] hover:border-[#0A60E1]"
                          )}
                        >
                          <div className={cn(
                            "size-[16px] rounded border flex items-center justify-center transition-all",
                            checked ? "bg-[#0A60E1] border-[#0A60E1]" : "border-[#D9D9D9]"
                          )}>
                            {checked && (
                              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                <path d="M2.5 5L4.5 7L7.5 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </div>
                          <span>{opt.label}. {opt.value || `Option ${opt.label}`}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Options (for single/multiple choice) */}
              {(q.type === "single" || q.type === "multiple") && (
                <div className="border border-[#E8E8E8] rounded-[12px] p-[16px] bg-[#FAFAFA]">
                  {q.options.map((opt, optIdx) => (
                    <div key={opt.id} className="flex items-center gap-[12px] mb-[12px] last:mb-0">
                      <div className="flex flex-col gap-[2px] opacity-35 cursor-grab shrink-0">
                        <div className="flex gap-[2px]"><span className="size-[2px] bg-black rounded-full"/><span className="size-[2px] bg-black rounded-full"/></div>
                        <div className="flex gap-[2px]"><span className="size-[2px] bg-black rounded-full"/><span className="size-[2px] bg-black rounded-full"/></div>
                      </div>
                      <div className="bg-[#0A60E1] text-white text-[12px] font-semibold w-[28px] h-[28px] rounded-[6px] flex items-center justify-center shrink-0">
                        {opt.label}
                      </div>
                      <FormInput
                        name={`q-opt-${qIdx}-${optIdx}`}
                        value={opt.value}
                        onChange={(e) => handleUpdateOption(qIdx, optIdx, e.target.value)}
                        placeholder={`Option ${opt.label}`}
                        containerClassName="flex-1"
                        className="text-[13px]"
                      />
                      {q.options.length > 2 && (
                        <button type="button" onClick={() => handleRemoveOption(qIdx, optIdx)} className="text-[#606060] hover:text-[#FF5025] shrink-0">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        </button>
                      )}
                    </div>
                  ))}
                  {q.options.length < 6 && (
                    <button
                      type="button"
                      onClick={() => handleAddOption(qIdx)}
                      className="mt-[8px] flex items-center gap-[8px] text-[13px] text-[#0A60E1] hover:underline"
                    >
                      <Add size={16} variant="Linear" color="#0A60E1" />
                      New option
                    </button>
                  )}
                </div>
              )}

              {/* Essay: Answer textarea */}
              {q.type === "essay" && (
                <div className="mb-[16px]">
                  <FormTextarea
                    name={`q-answer-${qIdx}`}
                    value={q.correctAnswer || ""}
                    onChange={(e) => handleUpdateQuestion(qIdx, "correctAnswer", e.target.value)}
                    placeholder="Enter the expected answer for this essay question"
                    containerClassName="w-full"
                    rows={4}
                  />
                </div>
              )}

              {/* Explanation */}
              <div className="flex items-start gap-[16px] mt-[16px]">
                <span className="text-[14px] text-[#202020] font-medium w-[100px] shrink-0 mt-[10px]">Explanation:</span>
                <div className="flex-1">
                  <FormInput
                    name={`q-explain-${qIdx}`}
                    value={q.explanation || ""}
                    onChange={(e) => handleUpdateQuestion(qIdx, "explanation", e.target.value)}
                    placeholder="add explanation"
                    containerClassName="flex-1"
                    className="text-[14px]"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Add question button */}
          <button
            type="button"
            onClick={handleAddQuestion}
            className="border-2 border-dashed border-[#D9D9D9] rounded-[16px] h-[60px] flex items-center justify-center gap-[8px] text-[#0A60E1] text-[14px] font-medium hover:border-[#0A60E1] hover:bg-[#F5F9FF] transition-all"
          >
            <Add size={20} variant="Linear" color="#0A60E1" />
            Add question
          </button>
        </div>
      ) : (
        /* Preview tab */
        <div className="flex flex-col gap-[24px]">
          {items.filter(q => q.question.trim()).length === 0 ? (
            <p className="text-[16px] text-[#606060] text-center py-[40px]">No questions yet. Add questions in the Quiz Builder tab.</p>
          ) : (
            items.filter(q => q.question.trim()).map((q, qIdx) => (
              <div key={q.id} className="border border-[#E8E8E8] rounded-[16px] p-[24px] bg-white">
                <p className="text-[16px] font-semibold text-[#202020] mb-[16px]">
                  {qIdx + 1}. {q.question}
                  <span className="ml-[8px] text-[12px] font-normal text-[#606060]">({q.points} pt{q.points !== 1 ? "s" : ""})</span>
                </p>
                {q.type === "essay" ? (
                  <div className="border border-[#E8E8E8] rounded-[8px] p-[16px] bg-[#FAFAFA]">
                    <p className="text-[14px] text-[#606060] italic">Essay question — type your answer below</p>
                    <textarea
                      placeholder="Type your answer here..."
                      className="w-full mt-[12px] border border-[#D9D9D9] rounded-[8px] p-[12px] text-[14px] text-[#202020] bg-white resize-none outline-none focus:border-[#0A60E1]"
                      rows={3}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col gap-[8px]">
                    {q.options.filter(o => o.value.trim()).map((opt) => (
                      <label key={opt.id} className="flex items-center gap-[12px] p-[12px] border border-[#E8E8E8] rounded-[8px] cursor-pointer hover:border-[#0A60E1] transition-colors">
                        <input
                          type={q.type === "single" ? "radio" : "checkbox"}
                          name={`preview-${q.id}`}
                          className="size-[18px] accent-[#0A60E1]"
                        />
                        <span className="text-[14px] text-[#202020]">{opt.label}. {opt.value}</span>
                      </label>
                    ))}
                  </div>
                )}
                {q.explanation && (
                  <p className="text-[13px] text-[#606060] mt-[12px] italic">{q.explanation}</p>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
