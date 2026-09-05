"use client";

import React, { useState, useMemo, useCallback } from "react";
import { 
  Trash, 
  Add, 
  Lock, 
  ArrowLeft2, 
  ArrowRight2,
  VideoPlay,
  DocumentText,
  DocumentCode2,
  More,
  Timer,
  Book,
  PlayCircle,
} from "iconsax-react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { FormInput } from "@/components/form/FormInput";
import { FormTextarea } from "@/components/form/FormTextarea";
import { Button } from "@/components/shared/Button";
import { moduleSchema, ModuleFormData } from "../utils/schemas";
import { QuizBuilderView } from "./QuizBuilderView";
import type { QuizBuilderQuestion } from "@/redux/slices/quizBuilderSlice";


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
  quizId?: string;
}

interface ModulesStepProps {
  module: Module;
  moduleIndex: number;
  onUpdateModule: (updated: Module) => void;
  onRemoveModule?: (moduleId: string) => void;
  onEditLesson: (lessonId: string) => void;
  onRemoveLesson?: (lessonId: string) => void;
  onNext?: () => void;
  onBack?: () => void;
}

export const ModulesStep = ({
  module,
  moduleIndex,
  onUpdateModule,
  onRemoveModule,
  onEditLesson,
  onRemoveLesson,
  onNext,
  onBack
}: ModulesStepProps) => {
  const [showLessonTypes, setShowLessonTypes] = useState(false);
  const [isAddingObjective, setIsAddingObjective] = useState(false);
  const [newObjective, setNewObjective] = useState("");

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

  const builderQuestions = useMemo(() =>
    module.quizQuestions.map((q, i) => {
      const opts = q.options.map((opt, oi) => ({
        id: `mod-q${i}-o${oi}`,
        label: String.fromCharCode(65 + oi),
        value: opt,
      }));
      const correctIdx = q.options.indexOf(q.correctAnswer || "");
      return {
        id: `mod-q${i}`,
        question: q.question,
        type: "single" as const,
        points: 0,
        options: opts,
        correctOptionId: correctIdx >= 0 ? opts[correctIdx]?.id : undefined,
        explanation: "",
      };
    }), [module.quizQuestions]);

  const fromBuilderQuestions = (qs: QuizBuilderQuestion[]): QuizQuestion[] =>
    qs.map((q) => {
      const correctOpt = q.options.find((o) => o.id === q.correctOptionId);
      return {
        question: q.question,
        options: q.options.map((o) => o.value),
        correctAnswer: correctOpt?.value || "",
      };
    });

  const handleModuleQuizChange = (updated: QuizBuilderQuestion[]) => {
    const formValues = methods.getValues();
    const parsedObjectives = formValues.objectives
      ? formValues.objectives.split(",").map(obj => obj.trim()).filter(Boolean)
      : [];
    onUpdateModule({
      ...module,
      title: formValues.title,
      description: formValues.description || "",
      objectives: parsedObjectives,
      quizQuestions: fromBuilderQuestions(updated),
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
                Module {moduleIndex + 1}: {module.title || "Untitled Module"}
              </span>
              <div className="flex items-center gap-[14px] text-[12px] text-[#606060] font-normal mt-[4px]">
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
              onClick={() => onRemoveModule?.(module.id)}
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

          {/* Module objectives — one at a time adder */}
          <div className="flex flex-col gap-[12px] mt-[4px]">
            <span className="text-[14px] font-semibold text-[#202020] tracking-[-0.28px]">
              Module objectives
            </span>
            <div className="flex flex-col gap-[12px]">
              {module.objectives.map((obj, objIdx) => {
                const isEditing = false;
                return (
                  <div key={objIdx} className="min-h-[56px] border border-[#D9D9D9] bg-white rounded-[8px] px-[20px] py-[10px] flex items-center justify-between transition-all">
                    <div className="flex items-center gap-[8px] flex-1 mr-[12px]">
                      <span className="text-[14px] text-[#202020] font-medium min-w-[20px]">
                        {objIdx + 1}.
                      </span>
                      <span className="text-[14px] text-[#202020] tracking-[-0.28px] break-words">
                        {obj}
                      </span>
                    </div>
                    <div className="flex items-center gap-[20px] shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = module.objectives.filter((_, i) => i !== objIdx);
                          const formValues = methods.getValues();
                          onUpdateModule({
                            ...module,
                            title: formValues.title,
                            description: formValues.description || "",
                            objectives: updated,
                          });
                        }}
                        className="p-0 bg-transparent border-none cursor-pointer"
                      >
                        <Trash size={20} variant="Linear" color="#606060" className="hover:text-[#FF6B00] transition-colors" />
                      </button>
                      <More size={20} variant="Linear" color="#606060" className="opacity-40 cursor-grab" />
                    </div>
                  </div>
                );
              })}

              {/* Inline Add Objective Input */}
              {isAddingObjective ? (
                <div className="flex items-center gap-[12px] h-[56px] border border-[#0A60E1] bg-white rounded-[8px] px-[20px]">
                  <input
                    type="text"
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                    placeholder="Enter learning objective"
                    className="flex-1 text-[14px] text-[#202020] border-none outline-none focus:ring-0 p-0 bg-transparent"
                    autoFocus
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === "Enter" && newObjective.trim()) {
                        const formValues = methods.getValues();
                        const updated = [...module.objectives, newObjective.trim()];
                        onUpdateModule({
                          ...module,
                          title: formValues.title,
                          description: formValues.description || "",
                          objectives: updated,
                        });
                        setNewObjective("");
                        setIsAddingObjective(false);
                      } else if (e.key === "Escape") {
                        setIsAddingObjective(false);
                        setNewObjective("");
                      }
                    }}
                  />
                  <div className="flex items-center gap-[12px] shrink-0">
                    <Button
                      type="button"
                      variant="app-outline"
                      isGhost
                      onClick={() => {
                        if (newObjective.trim()) {
                          const formValues = methods.getValues();
                          const updated = [...module.objectives, newObjective.trim()];
                          onUpdateModule({
                            ...module,
                            title: formValues.title,
                            description: formValues.description || "",
                            objectives: updated,
                          });
                          setNewObjective("");
                          setIsAddingObjective(false);
                        }
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      type="button"
                      variant="app-outline"
                      isGhost
                      onClick={() => {
                        setIsAddingObjective(false);
                        setNewObjective("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Add Objective Trigger */}
            {!isAddingObjective && (
              <Button
                type="button"
                variant="app-outline"
                isGhost
                onClick={() => setIsAddingObjective(true)}
                leftIcon={<Add size={20} variant="Linear" color="#0A60E1" />}
                className="self-start mt-[4px]"
              >
                Add objective
              </Button>
            )}
          </div>
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
                  "border border-[#D9D9D9] rounded-[8px] bg-white px-[20px] py-[16px] flex items-center justify-between hover:border-[#0A60E1]/40 transition-all",
                  errors.lessons?.[idx] && "border-[#FF5025]"
                )}
              >
                <div className="flex items-center gap-[12px]">
                  {lesson.type === "video" ? (
                    <VideoPlay size={24} variant="Linear" color="#0A60E1" className="shrink-0" />
                  ) : lesson.type === "quiz" ? (
                    <DocumentCode2 size={24} variant="Linear" color="#0A60E1" className="shrink-0" />
                  ) : (
                    <DocumentText size={24} variant="Linear" color="#0A60E1" className="shrink-0" />
                  )}
                  <div className="flex flex-col gap-[8px]">
                    <span className={cn(
                      "text-[16px] font-semibold text-[#202020] leading-[24px]",
                      errors.lessons?.[idx]?.title && "text-[#FF5025]"
                    )}>
                      {lesson.title || <span className="italic text-[#B6B6B6]">Untitled Lesson</span>}
                    </span>
                    <div className="flex items-center gap-[12px] text-[14px] text-[#606060] font-normal leading-[20px]">
                      <div className="flex items-center gap-[6px]">
                        <Timer size={16} variant="Linear" color="#606060" className="shrink-0" />
                        <span>{lesson.duration}</span>
                      </div>
                      <div className="flex items-center gap-[6px]">
                        <Book size={16} variant="Linear" color="#606060" className="shrink-0" />
                        <span>{lesson.assessments}</span>
                      </div>
                    </div>
                    {errors.lessons?.[idx]?.title && (
                      <span className="text-[11px] text-[#FF5025] font-normal">
                        {errors.lessons[idx].title.message}
                      </span>
                    )}
                  </div>
                </div>

                {/* Lesson Action Controls */}
                <div className="flex items-center gap-[16px]">
                  <span 
                    onClick={() => handleEditLesson(lesson.id)}
                    className="text-[14px] text-[#0A60E1] font-medium leading-[20px] underline cursor-pointer hover:text-[#0A60E1]/80 transition-colors"
                  >
                    Edit
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveLesson(lesson.id)}
                    className="p-0 bg-transparent border-none cursor-pointer"
                  >
                    <Trash size={20} variant="Linear" color="#606060" className="hover:text-[#FF6B00] transition-colors" />
                  </button>
                  <More size={20} variant="Linear" color="#606060" className="opacity-40 cursor-grab" />
                </div>
              </div>
            ))}
          </div>

          {/* Add Lesson Actions */}
          <div className="flex items-center gap-[16px] text-[14px] text-[#202020] font-normal mt-[4px]">
            <div 
              className="flex items-center gap-[8px] text-[#202020] cursor-pointer select-none"
              onClick={() => setShowLessonTypes(!showLessonTypes)}
            >
              <Add size={20} variant="Linear" color="#202020" />
              <span className="text-[14px] font-normal leading-[22px]">Add lesson</span>
            </div>
            {showLessonTypes && (
              <div className="flex items-center gap-[16px]">
                <div 
                  className="flex items-center gap-[8px] cursor-pointer select-none"
                  onClick={() => { handleAddLesson("video"); setShowLessonTypes(false); }}
                >
                  <PlayCircle size={20} variant="Linear" color="#0A60E1" />
                  <span className="text-[16px] font-medium text-[#0A60E1] leading-[24px]">Video</span>
                </div>
                <div 
                  className="flex items-center gap-[8px] cursor-pointer select-none"
                  onClick={() => { handleAddLesson("quiz"); setShowLessonTypes(false); }}
                >
                  <DocumentCode2 size={20} variant="Linear" color="#0A60E1" />
                  <span className="text-[16px] font-medium text-[#0A60E1] leading-[24px]">Quiz</span>
                </div>
                <div 
                  className="flex items-center gap-[8px] cursor-pointer select-none"
                  onClick={() => { handleAddLesson("text"); setShowLessonTypes(false); }}
                >
                  <DocumentText size={20} variant="Linear" color="#0A60E1" />
                  <span className="text-[16px] font-medium text-[#0A60E1] leading-[24px]">Text</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quiz Subsection */}
        <div className="flex flex-col gap-[24px] border-t border-[#F0F0F0] pt-[40px]">
          <div className="flex items-start justify-between w-full">
            <div className="flex flex-col gap-[2px]">
              <h3 className="text-[20px] font-semibold text-[#202020] leading-[28px]">Quiz</h3>
              <div className="flex items-center gap-[14px] text-[12px] text-[#606060] font-normal mt-[4px]">
                <span>Total Quiz ({module.quizQuestions.length})</span>
                <span className="size-[4px] bg-[#606060] rounded-full" />
                <span>Time {moduleTime}</span>
              </div>
            </div>
            <div className="flex items-center gap-[20px]">
              <button
                type="button"
                className="p-0 bg-transparent border-none cursor-pointer"
              >
                <Trash size={20} variant="Linear" color="#606060" className="hover:text-[#FF6B00] transition-colors" />
              </button>
              <More size={20} variant="Linear" color="#606060" className="opacity-40 cursor-grab" />
            </div>
          </div>

          {/* Dynamic Quiz Questions */}
          <div className="flex flex-col gap-[16px]">
            <QuizBuilderView
              questions={builderQuestions}
              onChange={handleModuleQuizChange}
              maxQuestions={10}
            />
          </div>
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
