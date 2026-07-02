"use client";

import React from "react";
import { 
  Trash, 
  Add, 
  Lock, 
  ArrowLeft2, 
  ArrowRight2,
  VideoPlay,
  DocumentText,
  DocumentCode2,
  More
} from "iconsax-react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { FormInput } from "@/components/form/FormInput";
import { FormTextarea } from "@/components/form/FormTextarea";
import { Button } from "@/components/shared/Button";
import { moduleSchema, ModuleFormData } from "../utils/schemas";


export interface Lesson {
  id: string;
  title: string;
  duration?: string;
  assessments?: string;
  type: "video" | "quiz" | "text";
  objectives?: string[];
  requirements?: string;
  content?: string;
  videoScript?: string;
  embedLink?: string;
  quizQuestions?: any[];
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

  const methods = useForm<ModuleFormData>({
    resolver: zodResolver(moduleSchema),
    mode: "onBlur",
    values: {
      title: module.title,
      description: module.description,
      objectives: module.objectives.join(", "),
      lessons: module.lessons,
      quizQuestions: module.quizQuestions,
    },
  });

  const { handleSubmit, formState: { errors } } = methods;

  const handleAddLesson = (type: "video" | "quiz" | "text") => {
    const formValues = methods.getValues();
    const parsedObjectives = formValues.objectives
      ? formValues.objectives.split(",").map(obj => obj.trim()).filter(Boolean)
      : [];
    const newLesson: Lesson = {
      id: Date.now().toString(),
      title: "",
      duration: "0 mins",
      assessments: "0 Assessment",
      type: type,
      objectives: [],
      requirements: "",
      content: "",
      quizQuestions: []
    };
    onUpdateModule({
      ...module,
      title: formValues.title,
      description: formValues.description || "",
      objectives: parsedObjectives,
      lessons: [...module.lessons, newLesson]
    });
  };

  const handleRemoveLesson = (lessonId: string) => {
    const formValues = methods.getValues();
    const parsedObjectives = formValues.objectives
      ? formValues.objectives.split(",").map(obj => obj.trim()).filter(Boolean)
      : [];
    onUpdateModule({
      ...module,
      title: formValues.title,
      description: formValues.description || "",
      objectives: parsedObjectives,
      lessons: module.lessons.filter(l => l.id !== lessonId)
    });
  };

  const handleEditLesson = (lessonId: string) => {
    const formValues = methods.getValues();
    const parsedObjectives = formValues.objectives
      ? formValues.objectives.split(",").map(obj => obj.trim()).filter(Boolean)
      : [];
    onUpdateModule({
      ...module,
      title: formValues.title,
      description: formValues.description || "",
      objectives: parsedObjectives,
    });
    onEditLesson(lessonId);
  };

  const handleAddQuizQuestion = () => {
    const formValues = methods.getValues();
    const parsedObjectives = formValues.objectives
      ? formValues.objectives.split(",").map(obj => obj.trim()).filter(Boolean)
      : [];
    const newQuestion: QuizQuestion = {
      question: "",
      options: ["", "", "", ""]
    };
    onUpdateModule({
      ...module,
      title: formValues.title,
      description: formValues.description || "",
      objectives: parsedObjectives,
      quizQuestions: [...module.quizQuestions, newQuestion]
    });
  };

  const handleRemoveQuizQuestion = (idx: number) => {
    const formValues = methods.getValues();
    const parsedObjectives = formValues.objectives
      ? formValues.objectives.split(",").map(obj => obj.trim()).filter(Boolean)
      : [];
    onUpdateModule({
      ...module,
      title: formValues.title,
      description: formValues.description || "",
      objectives: parsedObjectives,
      quizQuestions: module.quizQuestions.filter((_, i) => i !== idx)
    });
  };

  const handleSetCorrectAnswer = (qIdx: number, optionText: string) => {
    const updated = [...module.quizQuestions];
    updated[qIdx] = { ...updated[qIdx], correctAnswer: optionText };
    const formValues = methods.getValues();
    const parsedObjectives = formValues.objectives
      ? formValues.objectives.split(",").map(obj => obj.trim()).filter(Boolean)
      : [];
    onUpdateModule({
      ...module,
      title: formValues.title,
      description: formValues.description || "",
      objectives: parsedObjectives,
      quizQuestions: updated
    });
  };

  const handleUpdateQuizField = (qIdx: number, field: keyof QuizQuestion, value: any) => {
    const updated = [...module.quizQuestions];
    updated[qIdx] = { ...updated[qIdx], [field]: value };
    const formValues = methods.getValues();
    const parsedObjectives = formValues.objectives
      ? formValues.objectives.split(",").map(obj => obj.trim()).filter(Boolean)
      : [];
    onUpdateModule({
      ...module,
      title: formValues.title,
      description: formValues.description || "",
      objectives: parsedObjectives,
      quizQuestions: updated
    });
  };

  const handleUpdateQuizOption = (qIdx: number, optIdx: number, value: string) => {
    const updated = [...module.quizQuestions];
    const updatedOptions = [...updated[qIdx].options];
    updatedOptions[optIdx] = value;
    updated[qIdx] = { ...updated[qIdx], options: updatedOptions };
    const formValues = methods.getValues();
    const parsedObjectives = formValues.objectives
      ? formValues.objectives.split(",").map(obj => obj.trim()).filter(Boolean)
      : [];
    onUpdateModule({
      ...module,
      title: formValues.title,
      description: formValues.description || "",
      objectives: parsedObjectives,
      quizQuestions: updated
    });
  };

  const onSubmit = (data: ModuleFormData) => {
    const parsedObjectives = data.objectives
      ? data.objectives.split(",").map(obj => obj.trim()).filter(Boolean)
      : [];
    onUpdateModule({
      ...module,
      title: data.title,
      description: data.description || "",
      objectives: parsedObjectives,
      lessons: data.lessons || [],
      quizQuestions: data.quizQuestions || [],
    });
    onNext?.();
  };

  // Helper to format lessons summary
  const totalLessons = module.lessons.length;
  const totalQuiz = module.lessons.reduce((acc, l) => acc + (l.quizQuestions?.length || 0), 0) + (module.quizQuestions?.length || 0);
  const moduleTime = "3hr 25mins";

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="w-[739px] max-w-full bg-[#FDFDFD] px-[24px] py-[40px] flex flex-col gap-[40px] mx-auto pb-[100px]">
        
        {/* Title Header with Lock Module */}
        <div className="flex items-start justify-between w-full border-b border-[#F0F0F0] pb-[20px]">
          <div className="flex flex-col gap-[8px]">
            <h2 className="text-[24px] font-semibold text-[#202020] tracking-[-0.48px] leading-[32px]">Modules</h2>
            <p className="text-[16px] text-[#606060] leading-[24px]">Assign a version to this course</p>
          </div>
          <div className="flex flex-col items-end gap-[4px]">
            <Button 
              variant="app-outline"
              leftIcon={<Lock size={16} variant="Linear" color="#0A60E1" />}
            >
              Lock module
            </Button>
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
            <Button 
              variant="app-outline"
              isGhost
              leftIcon={<Trash size={16} variant="Linear" color="#FF6B00" />}
            >
              Delete module
            </Button>
          </div>

          {/* Inputs */}
          <FormInput 
            name="title"
            label="Title"
            placeholder="Enter a title for this module"
          />

          <FormTextarea 
            name="description"
            label="Description"
            placeholder="Enter a description for this lesson"
            rows={3}
          />

          <FormInput 
            name="objectives"
            label="Module objectives"
            placeholder="Enter the objectives of this module"
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
                className={cn(
                  "border border-[#E8E8E8] rounded-[8px] bg-white px-[20px] flex items-center justify-between hover:border-[#D9D9D9] transition-all",
                  errors.lessons?.[idx] ? "h-[84px] border-[#FF5025]" : "h-[64px]"
                )}
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
                    <span className={cn(
                      "text-[15px] font-semibold text-[#202020] leading-[22px]",
                      errors.lessons?.[idx]?.title && "text-[#FF5025]"
                    )}>
                      {lesson.title || <span className="italic text-[#B6B6B6]">Untitled Lesson</span>}
                    </span>
                    <div className="flex items-center gap-[8px] text-[12px] text-[#606060] font-normal leading-[16px]">
                      <span>{lesson.duration}</span>
                      <span className="size-[3px] bg-[#606060] rounded-full" />
                      <span>{lesson.assessments}</span>
                    </div>
                    {errors.lessons?.[idx]?.title && (
                      <span className="text-[11px] text-[#FF5025] font-normal mt-[2px]">
                        {errors.lessons[idx].title.message}
                      </span>
                    )}
                  </div>
                </div>

                {/* Lesson Action Controls */}
                <div className="flex items-center gap-[20px]">
                  <Button 
                    variant="app-outline"
                    isGhost
                    onClick={() => handleEditLesson(lesson.id)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="app-outline"
                    isGhost
                    onClick={() => handleRemoveLesson(lesson.id)}
                  >
                    <Trash size={18} variant="Linear" color="#FF6B00" />
                  </Button>
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
            <Button 
              variant="app-outline"
              isGhost
              onClick={() => handleAddLesson("video")}
              leftIcon={<VideoPlay size={18} variant="Linear" color="#0A60E1" />}
            >
              Video
            </Button>
            <Button 
              variant="app-outline"
              isGhost
              onClick={() => handleAddLesson("quiz")}
              leftIcon={<DocumentCode2 size={18} variant="Linear" color="#0A60E1" />}
            >
              Quiz
            </Button>
            <Button 
              variant="app-outline"
              isGhost
              onClick={() => handleAddLesson("text")}
              leftIcon={<DocumentText size={18} variant="Linear" color="#0A60E1" />}
            >
              Text
            </Button>
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
              <Button 
                variant="app-outline"
                isGhost
              >
                <Trash size={18} variant="Linear" color="#FF6B00" />
              </Button>
              <div className="flex flex-col gap-[2px] opacity-35 cursor-grab">
                <div className="flex gap-[2px]"><span className="size-[3px] bg-black rounded-full"/><span className="size-[3px] bg-black rounded-full"/></div>
                <div className="flex gap-[2px]"><span className="size-[3px] bg-black rounded-full"/><span className="size-[3px] bg-black rounded-full"/></div>
                <div className="flex gap-[2px]"><span className="size-[3px] bg-black rounded-full"/><span className="size-[3px] bg-black rounded-full"/></div>
              </div>
            </div>
          </div>

          {/* Dynamic Quiz Questions */}
          <div className="flex flex-col gap-[16px]">
            {module.quizQuestions.map((q, qIdx) => (
              <div 
                key={qIdx}
                className={cn(
                  "border border-[#E8E8E8] rounded-[12px] p-[20px] bg-white flex flex-col gap-[16px] relative",
                  errors.quizQuestions?.[qIdx] && "border-[#FF5025]"
                )}
              >
                {/* Question Header with Drag, Number, Input, and Menu */}
                <div className="flex items-start gap-[12px]">
                  {/* Drag indicator */}
                  <div className="flex flex-col gap-[2px] opacity-35 cursor-grab shrink-0 mt-[6px]">
                    <div className="flex gap-[2px]"><span className="size-[3px] bg-black rounded-full"/><span className="size-[3px] bg-black rounded-full"/></div>
                    <div className="flex gap-[2px]"><span className="size-[3px] bg-black rounded-full"/><span className="size-[3px] bg-black rounded-full"/></div>
                    <div className="flex gap-[2px]"><span className="size-[3px] bg-black rounded-full"/><span className="size-[3px] bg-black rounded-full"/></div>
                  </div>

                  {/* Question Content */}
                  <div className="flex-1 border border-[#D9D9D9] rounded-[8px] p-[16px] bg-white">
                    <div className="flex items-start gap-[12px] mb-[16px]">
                      <span className="text-[16px] font-semibold text-[#202020] whitespace-nowrap leading-[24px]">
                        Question {qIdx + 1}
                      </span>
                      <input
                        type="text"
                        value={q.question}
                        onChange={(e) => handleUpdateQuizField(qIdx, "question", e.target.value)}
                        placeholder="What are the different types of computer?"
                        className={cn(
                          "flex-1 text-[16px] text-[#606060] font-normal leading-[24px] border-none outline-none focus:ring-0 p-0 bg-transparent",
                          errors.quizQuestions?.[qIdx]?.question && "text-[#FF5025]"
                        )}
                      />
                    </div>

                    {/* Option rows */}
                    <div className="flex flex-col gap-[12px]">
                      {q.options.map((opt, optIdx) => {
                        const label = String.fromCharCode(65 + optIdx);
                        const isCorrect = q.correctAnswer === opt || 
                          (q.correctAnswer === label);
                        return (
                          <div key={optIdx} className="flex items-center gap-[12px]">
                            <span className="text-[14px] text-[#606060] font-normal w-[14px] shrink-0">
                              {label}
                            </span>
                            <div
                              onClick={() => {
                                const selectedValue = opt || label;
                                handleSetCorrectAnswer(qIdx, selectedValue);
                              }}
                              className={cn(
                                "size-[18px] rounded-full border flex items-center justify-center cursor-pointer shrink-0 transition-all",
                                isCorrect
                                  ? "border-[#0A60E1] bg-[#0A60E1]"
                                  : "border-[#D9D9D9] hover:border-[#0A60E1]"
                              )}
                            >
                              {isCorrect && (
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                  <path d="M2.5 5L4.5 7L7.5 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </div>
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => handleUpdateQuizOption(qIdx, optIdx, e.target.value)}
                              placeholder={`Option ${label}`}
                              className="flex-1 text-[14px] text-[#606060] font-normal leading-[20px] border-none outline-none focus:ring-0 p-0 bg-transparent"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Menu button */}
                  <Button 
                    variant="app-outline"
                    isGhost
                    onClick={() => handleRemoveQuizQuestion(qIdx)}
                    className="mt-[6px] shrink-0"
                  >
                    <More size={20} variant="Linear" color="#606060" className="rotate-90" />
                  </Button>
                </div>

                {errors.quizQuestions?.[qIdx]?.question && (
                  <p className="text-[12px] text-[#FF5025] font-normal pl-[32px]">
                    {errors.quizQuestions[qIdx].question.message}
                  </p>
                )}

                {errors.quizQuestions?.[qIdx]?.options && (
                  <p className="text-[12px] text-[#FF5025] font-normal pl-[32px]">
                    At least 2 options are required and options cannot be empty.
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Quiz builder is now available through the lesson editor page */}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between w-full pt-[24px] border-t border-[#F0F0F0]">
          <Button 
            variant="app-outline"
            onClick={onBack}
            leftIcon={<ArrowLeft2 size={24} variant="Linear" color="#0A60E1" />}
          >
            Go back
          </Button>
          <Button 
            variant="app-primary"
            type="submit"
            rightIcon={<ArrowRight2 size={24} variant="Linear" color="#FFFFFF" />}
          >
            Save & continue
          </Button>
        </div>

      </form>
    </FormProvider>
  );
};
