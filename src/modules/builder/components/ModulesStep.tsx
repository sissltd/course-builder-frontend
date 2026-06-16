"use client";

import React, { useState } from "react";
import { 
  Trash, 
  Add, 
  Lock, 
  ArrowLeft2, 
  ArrowRight2,
  VideoPlay,
  DocumentText,
  DocumentCode2,
  Edit2
} from "iconsax-react";
import { cn } from "@/lib/utils";
import { AppInput } from "@/components/form/AppInput";
import { AppTextarea } from "@/components/form/AppTextarea";

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  assessments: string;
  type: "video" | "quiz" | "text";
  objectives: string[];
  requirements: string;
  videoScript?: string;
  quizQuestions: { question: string; options: string[]; correctAnswer?: string }[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer?: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  lessons: Lesson[];
  quizQuestions: QuizQuestion[];
}

interface ModulesStepProps {
  module: Module;
  onUpdateModule: (updated: Module) => void;
  onEditLesson: (lessonId: string) => void;
  onNext?: () => void;
  onBack?: () => void;
}

export const ModulesStep = ({ 
  module, 
  onUpdateModule, 
  onEditLesson,
  onNext, 
  onBack 
}: ModulesStepProps) => {

  const handleUpdateField = (field: "title" | "description" | "objectives", value: any) => {
    onUpdateModule({
      ...module,
      [field]: value
    });
  };

  const handleAddLesson = (type: "video" | "quiz" | "text") => {
    const newLesson: Lesson = {
      id: Date.now().toString(),
      title: "",
      duration: "0 mins",
      assessments: "0 Assessment",
      type: type,
      objectives: [],
      requirements: "",
      quizQuestions: []
    };
    onUpdateModule({
      ...module,
      lessons: [...module.lessons, newLesson]
    });
  };

  const handleRemoveLesson = (lessonId: string) => {
    onUpdateModule({
      ...module,
      lessons: module.lessons.filter(l => l.id !== lessonId)
    });
  };

  const handleAddQuizQuestion = () => {
    const newQuestion: QuizQuestion = {
      question: "",
      options: ["", "", "", ""]
    };
    onUpdateModule({
      ...module,
      quizQuestions: [...module.quizQuestions, newQuestion]
    });
  };

  const handleRemoveQuizQuestion = (idx: number) => {
    onUpdateModule({
      ...module,
      quizQuestions: module.quizQuestions.filter((_, i) => i !== idx)
    });
  };

  // Helper to format lessons summary
  const totalLessons = module.lessons.length;
  const totalQuiz = module.lessons.reduce((acc, l) => acc + l.quizQuestions.length, 0) + module.quizQuestions.length;
  const moduleTime = "3hr 25mins";

  return (
    <div className="w-[739px] max-w-full bg-[#FDFDFD] px-[24px] py-[40px] flex flex-col gap-[40px] mx-auto pb-[100px]">
      
      {/* Title Header with Lock Module */}
      <div className="flex items-start justify-between w-full border-b border-[#F0F0F0] pb-[20px]">
        <div className="flex flex-col gap-[8px]">
          <h2 className="text-[24px] font-semibold text-[#202020] tracking-[-0.48px] leading-[32px]">Modules</h2>
          <p className="text-[16px] text-[#606060] leading-[24px]">Assign a version to this course</p>
        </div>
        <div className="flex flex-col items-end gap-[4px]">
          <button className="h-[36px] px-[12px] border border-[#0A60E1] text-[#0A60E1] rounded-[8px] flex items-center gap-[6px] hover:bg-[#0A60E1]/5 transition-colors font-medium">
            <Lock size={16} variant="Linear" color="#0A60E1" />
            <span className="text-[14px]">Lock module</span>
          </button>
          <span className="text-[12px] text-[#606060] font-normal">Prevent collaborators from editing this module</span>
        </div>
      </div>

      {/* Module Overview Details Card */}
      <div className="flex flex-col gap-[20px] bg-white border border-[#E8E8E8] rounded-[16px] p-[24px]">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col gap-[2px]">
            <span className="text-[18px] font-semibold text-[#202020]">
              Module {module.id}: {module.title || "Untitled Module"}
            </span>
            <div className="flex items-center gap-[12px] text-[12px] text-[#606060] font-normal mt-[4px]">
              <span>Total lessons ({totalLessons})</span>
              <span className="size-[4px] bg-[#606060] rounded-full" />
              <span>Total Quiz ({totalQuiz})</span>
              <span className="size-[4px] bg-[#606060] rounded-full" />
              <span>Time {moduleTime}</span>
            </div>
          </div>
          <button className="text-[#FF6B00] hover:underline flex items-center gap-[4px] text-[14px] font-medium">
            <Trash size={16} variant="Linear" color="#FF6B00" />
            <span>Delete module</span>
          </button>
        </div>

        {/* Inputs */}
        <AppInput 
          label="Title"
          placeholder="Enter a title for this module"
          value={module.title}
          onChange={(e) => handleUpdateField("title", e.target.value)}
        />

        <AppTextarea 
          label="Description"
          placeholder="Enter a description for this lesson"
          value={module.description}
          onChange={(e) => handleUpdateField("description", e.target.value)}
          rows={3}
        />

        <AppInput 
          label="Module objectives"
          placeholder="Enter the objectives of this module"
          value={module.objectives.join(", ")}
          onChange={(e) => handleUpdateField("objectives", e.target.value.split(",").map(o => o.trim()))}
        />
      </div>

      {/* Lessons List Section */}
      <div className="flex flex-col gap-[24px]">
        <h3 className="text-[20px] font-semibold text-[#202020] leading-[28px]">
          Lessons ({totalLessons})
        </h3>

        <div className="flex flex-col gap-[12px]">
          {module.lessons.map((lesson, idx) => (
            <div 
              key={lesson.id}
              className="h-[64px] border border-[#E8E8E8] rounded-[8px] bg-white px-[20px] flex items-center justify-between hover:border-[#D9D9D9] transition-all"
            >
              <div className="flex items-center gap-[12px]">
                {lesson.type === "video" ? (
                  <VideoPlay size={22} variant="Linear" color="#0A60E1" className="shrink-0" />
                ) : lesson.type === "quiz" ? (
                  <DocumentCode2 size={22} variant="Linear" color="#0A60E1" className="shrink-0" />
                ) : (
                  <DocumentText size={22} variant="Linear" color="#0A60E1" className="shrink-0" />
                )}
                <div className="flex flex-col">
                  <span className="text-[15px] font-semibold text-[#202020] leading-[22px]">
                    {lesson.title}
                  </span>
                  <div className="flex items-center gap-[8px] text-[12px] text-[#606060] font-normal leading-[16px]">
                    <span>{lesson.duration}</span>
                    <span className="size-[3px] bg-[#606060] rounded-full" />
                    <span>{lesson.assessments}</span>
                  </div>
                </div>
              </div>

              {/* Lesson Action Controls */}
              <div className="flex items-center gap-[20px]">
                <button 
                  onClick={() => onEditLesson(lesson.id)}
                  className="text-[14px] text-[#0A60E1] font-semibold hover:underline"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleRemoveLesson(lesson.id)}
                  className="text-[#FF6B00] hover:text-[#E05B00] transition-colors"
                >
                  <Trash size={18} variant="Linear" color="#FF6B00" />
                </button>
                {/* Drag handle */}
                <div className="flex flex-col gap-[2px] opacity-35 cursor-grab">
                  <div className="flex gap-[2px]"><span className="size-[3px] bg-black rounded-full"/><span className="size-[3px] bg-black rounded-full"/></div>
                  <div className="flex gap-[2px]"><span className="size-[3px] bg-black rounded-full"/><span className="size-[3px] bg-black rounded-full"/></div>
                  <div className="flex gap-[2px]"><span className="size-[3px] bg-black rounded-full"/><span className="size-[3px] bg-black rounded-full"/></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Lesson Actions */}
        <div className="flex items-center gap-[16px] text-[14px] text-[#202020] font-normal mt-[4px]">
          <div className="flex items-center gap-[6px] text-[#202020]">
            <Add size={20} variant="Linear" color="#202020" />
            <span>Add lesson</span>
          </div>
          <button 
            onClick={() => handleAddLesson("video")}
            className="flex items-center gap-[6px] text-[#0A60E1] hover:underline"
          >
            <VideoPlay size={18} variant="Linear" color="#0A60E1" />
            <span>Video</span>
          </button>
          <button 
            onClick={() => handleAddLesson("quiz")}
            className="flex items-center gap-[6px] text-[#0A60E1] hover:underline"
          >
            <DocumentCode2 size={18} variant="Linear" color="#0A60E1" />
            <span>Quiz</span>
          </button>
          <button 
            onClick={() => handleAddLesson("text")}
            className="flex items-center gap-[6px] text-[#0A60E1] hover:underline"
          >
            <DocumentText size={18} variant="Linear" color="#0A60E1" />
            <span>Text</span>
          </button>
        </div>
      </div>

      {/* Quiz Subsection */}
      <div className="flex flex-col gap-[24px] border-t border-[#F0F0F0] pt-[40px]">
        <div className="flex items-start justify-between w-full">
          <div className="flex flex-col gap-[2px]">
            <h3 className="text-[20px] font-semibold text-[#202020] leading-[28px]">Quiz</h3>
            <div className="flex items-center gap-[12px] text-[12px] text-[#606060] font-normal mt-[4px]">
              <span>Total Quiz ({module.quizQuestions.length})</span>
              <span className="size-[4px] bg-[#606060] rounded-full" />
              <span>Time {moduleTime}</span>
            </div>
          </div>
          <div className="flex items-center gap-[20px]">
            <button className="text-[#FF6B00] hover:text-[#E05B00] transition-colors">
              <Trash size={18} variant="Linear" color="#FF6B00" />
            </button>
            <div className="flex flex-col gap-[2px] opacity-35 cursor-grab">
              <div className="flex gap-[2px]"><span className="size-[3px] bg-black rounded-full"/><span className="size-[3px] bg-black rounded-full"/></div>
              <div className="flex gap-[2px]"><span className="size-[3px] bg-black rounded-full"/><span className="size-[3px] bg-black rounded-full"/></div>
              <div className="flex gap-[2px]"><span className="size-[3px] bg-black rounded-full"/><span className="size-[3px] bg-black rounded-full"/></div>
            </div>
          </div>
        </div>

        {/* Dynamic Quiz Questions rendering to match figma exactly */}
        <div className="flex flex-col gap-[16px]">
          {module.quizQuestions.map((q, qIdx) => (
            <div 
              key={qIdx}
              className="border border-[#E8E8E8] rounded-[12px] p-[20px] bg-white flex flex-col gap-[16px] relative"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-[12px]">
                  {/* Drag indicator */}
                  <div className="flex flex-col gap-[2px] opacity-35 cursor-grab shrink-0">
                    <div className="flex gap-[2px]"><span className="size-[3px] bg-black rounded-full"/><span className="size-[3px] bg-black rounded-full"/></div>
                    <div className="flex gap-[2px]"><span className="size-[3px] bg-black rounded-full"/><span className="size-[3px] bg-black rounded-full"/></div>
                    <div className="flex gap-[2px]"><span className="size-[3px] bg-black rounded-full"/><span className="size-[3px] bg-black rounded-full"/></div>
                  </div>
                  <span className="text-[15px] font-semibold text-[#202020]">
                    Question {qIdx + 1}
                  </span>
                  <span className="text-[14px] text-[#202020] font-normal leading-[22px]">
                    {q.question}
                  </span>
                </div>
                {/* Dots menu / Delete */}
                <button 
                  onClick={() => handleRemoveQuizQuestion(qIdx)}
                  className="text-[#606060] hover:text-[#FF6B00] transition-colors"
                >
                  <Trash size={16} variant="Linear" color="#606060" />
                </button>
              </div>

              {/* Radio choices */}
              <div className="grid grid-cols-1 gap-[12px] pl-[32px]">
                {q.options.map((opt, optIdx) => {
                  const label = String.fromCharCode(65 + optIdx); // A, B, C, D
                  return (
                    <div key={optIdx} className="flex items-center gap-[10px]">
                      <div className="size-[18px] rounded-full border border-[#D9D9D9] flex items-center justify-center cursor-pointer hover:border-[#0A60E1]">
                        {/* Empty radio circle */}
                      </div>
                      <span className="text-[14px] text-[#606060] font-normal">
                        {label}. {opt}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Add / Customize Quiz Action Button */}
        <button 
          onClick={handleAddQuizQuestion}
          className="h-[44px] border border-dashed border-[#B6B6B6] rounded-[8px] flex items-center justify-center gap-[8px] text-[#0A60E1] hover:bg-[#0A60E1]/5 transition-colors w-full font-medium"
        >
          <Edit2 size={16} variant="Linear" color="#0A60E1" />
          <span>Customize your quiz</span>
        </button>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between w-full pt-[24px] border-t border-[#F0F0F0]">
        <button 
          onClick={onBack}
          className="h-[44px] px-[24px] border border-[#0A60E1] text-[#0A60E1] rounded-[8px] flex items-center gap-[8px] hover:bg-[#0A60E1]/5 transition-colors"
        >
          <ArrowLeft2 size={24} variant="Linear" color="#0A60E1" />
          <span className="text-[14px] font-medium tracking-[-0.28px]">Go back</span>
        </button>
        <button 
          onClick={onNext}
          className="h-[44px] px-[24px] bg-[#0A60E1] text-white rounded-[8px] flex items-center gap-[8px] hover:bg-[#0A50C5] transition-colors"
        >
          <span className="text-[14px] font-medium tracking-[-0.28px]">Save & continue</span>
          <ArrowRight2 size={24} variant="Linear" color="#FFFFFF" />
        </button>
      </div>

    </div>
  );
};
