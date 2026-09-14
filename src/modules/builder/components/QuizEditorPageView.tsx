"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { ArrowLeft2 } from "iconsax-react";
import { toast } from "sonner";
import { Button } from "@/components/shared/Button";
import { useAppDispatch, useAppSelector } from "@/redux";
import {
  setQuestions,
  resetQuestions,
  toQuizBuilderQuestions,
  type QuizBuilderQuestion,
} from "@/redux/slices/quizBuilderSlice";
import { updateLessonInModule, setEditingQuiz, setEditingLesson } from "@/redux/slices/courseBuilderSlice";
import { syncSaveLessonAssessment } from "@/redux/slices/builderSync";
import { quizBuilderFormSchema } from "@/modules/builder/utils/schemas";
import { QuizBuilderView } from "./QuizBuilderView";

const sanitizeQuestions = (list: QuizBuilderQuestion[]): QuizBuilderQuestion[] =>
  list
    .filter(
      (q) =>
        q.question.trim() !== "" ||
        (q.type === "essay" && (q.correctAnswer || "").trim() !== ""),
    )
    .map((q) => {
      if (q.type === "essay") return { ...q, options: [] };
      return { ...q, options: q.options.filter((o) => o.value.trim() !== "") };
    });

export const QuizEditorPageView = () => {
  const dispatch = useAppDispatch();
  const editingQuiz = useAppSelector((s) => s.courseBuilder.editingQuiz);
  const questions = useAppSelector((s) => s.quizBuilder.questions);
  const modules = useAppSelector((s) => s.courseBuilder.modules);
  const hydratedForRef = useRef<string | null>(null);

  const currentModule = editingQuiz ? modules.find((m) => m.id === editingQuiz.moduleId) : null;
  const currentLesson = currentModule?.lessons.find((l) => l.id === editingQuiz?.lessonId) || null;

  useEffect(() => {
    if (!editingQuiz || !currentLesson) return;
    const key = `${editingQuiz.moduleId}:${editingQuiz.lessonId}`;
    if (hydratedForRef.current === key) return;
    hydratedForRef.current = key;
    dispatch(resetQuestions());
    dispatch(setQuestions(toQuizBuilderQuestions(currentLesson.quizQuestions || [])));
  }, [editingQuiz, currentLesson, dispatch]);

  const handleQuestionsChange = useCallback((updated: QuizBuilderQuestion[]) => {
    dispatch(setQuestions(updated));
  }, [dispatch]);

  const handleSave = async () => {
    if (!editingQuiz || !currentLesson) return;

    const sanitized = sanitizeQuestions(questions);

    if (sanitized.length > 0) {
      const parsed = quizBuilderFormSchema.safeParse({ questions: sanitized });
      if (!parsed.success) {
        const issue = parsed.error.issues[0];
        const questionIndex =
          issue.path[0] === "questions" && typeof issue.path[1] === "number"
            ? issue.path[1]
            : null;
        toast.error(
          questionIndex !== null
            ? `Question ${questionIndex + 1}: ${issue.message}`
            : issue.message,
        );
        return;
      }
    }

    const moduleId = editingQuiz.moduleId;
    const lessonId = editingQuiz.lessonId;
    const updatedLesson = { ...currentLesson, quizQuestions: sanitized };

    dispatch(updateLessonInModule({ moduleId, lessonId, updatedLesson }));

    try {
      await dispatch(
        syncSaveLessonAssessment({
          moduleId,
          lessonId,
          lessonTitle: currentLesson.title,
        }),
      ).unwrap();
      toast.success("Quiz saved.");
      dispatch(setEditingQuiz(null));
      dispatch(setEditingLesson({ moduleId, lessonId }));
    } catch (error) {
      const errors = (error as { errors?: { message?: string }[] })?.errors;
      toast.error(errors?.[0]?.message || "Failed to save quiz. Please try again.");
    }
  };

  const handleBack = () => {
    if (editingQuiz) {
      dispatch(setEditingQuiz(null));
      dispatch(setEditingLesson({ moduleId: editingQuiz.moduleId, lessonId: editingQuiz.lessonId }));
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between px-[16px] md:px-[40px] pt-[24px] pb-[16px] border-b border-[#F0F0F0] shrink-0">
        <div className="flex flex-col gap-[4px]">
          <div className="flex items-center gap-[12px]">
            <Button
              variant="app-outline"
              isGhost
              onClick={handleBack}
              className="h-[32px] px-[8px]"
              leftIcon={<ArrowLeft2 size={18} variant="Linear" color="#202020" />}
            >
              <span className="text-[14px] font-medium text-[#202020]">Back</span>
            </Button>
          </div>
          <h2 className="text-[24px] font-semibold text-[#202020] leading-[32px]">
            Customize your quizzes
          </h2>
          <p className="text-[14px] text-[#606060] leading-[20px]">
            Customize your quiz questions for this lesson
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-[16px] md:px-[40px] py-[24px]">
        <QuizBuilderView
          questions={questions}
          onChange={handleQuestionsChange}
          maxQuestions={10}
        />
      </div>

      {/* Footer */}
      <div className="flex flex-col-reverse gap-[12px] sm:flex-row sm:items-center sm:justify-end px-[16px] md:px-[40px] py-[16px] border-t border-[#F0F0F0] shrink-0">
        <Button
          variant="app-outline"
          className="h-[44px] px-[24px]"
          onClick={handleBack}
        >
          Cancel
        </Button>
        <Button
          variant="app-primary"
          className="h-[44px] px-[24px]"
          onClick={handleSave}
        >
          Save Draft
        </Button>
      </div>
    </div>
  );
};
