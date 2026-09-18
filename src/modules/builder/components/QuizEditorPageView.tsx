"use client";

import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { ArrowLeft2 } from "iconsax-react";
import { toast } from "sonner";
import { Button } from "@/components/shared/Button";
import { useAppDispatch, useAppSelector } from "@/redux";
import {
  setQuestions,
  resetQuestions,
  createDefaultQuizQuestion,
  toQuizBuilderQuestions,
  type QuizBuilderQuestion,
} from "@/redux/slices/quizBuilderSlice";
import {
  updateLessonInModule,
  setEditingQuiz,
  setEditingLesson,
  updateFinalAssessment,
} from "@/redux/slices/courseBuilderSlice";
import {
  syncSaveLessonAssessment,
  syncSaveCourseAssessment,
} from "@/redux/slices/builderSync";
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
  const finalAssessment = useAppSelector((s) => s.courseBuilder.finalAssessment);
  const courseInformation = useAppSelector((s) => s.courseBuilder.courseInformation);
  const hydratedForRef = useRef<string | null>(null);

  const isCourseLevel = editingQuiz?.level === "course";

  const currentModule =
    editingQuiz?.level === "lesson"
      ? modules.find((m) => m.id === editingQuiz.moduleId) ?? null
      : null;
  const currentLesson =
    editingQuiz?.level === "lesson"
      ? currentModule?.lessons.find((l) => l.id === editingQuiz.lessonId) || null
      : null;

  const contextTitle = isCourseLevel
    ? `${courseInformation.courseTitle || "Course"} Final Assessment`
    : currentLesson?.title || "";

  const contextQuestions = useMemo(
    () =>
      isCourseLevel
        ? finalAssessment?.quizQuestions || []
        : currentLesson?.quizQuestions || [],
    [isCourseLevel, finalAssessment, currentLesson],
  );

  useEffect(() => {
    if (!editingQuiz) return;
    if (!isCourseLevel && !currentLesson) return;
    const key =
      editingQuiz.level === "course"
        ? "course"
        : `${editingQuiz.moduleId}:${editingQuiz.lessonId}`;
    if (hydratedForRef.current === key) return;
    hydratedForRef.current = key;
    dispatch(resetQuestions());
    dispatch(setQuestions(toQuizBuilderQuestions(contextQuestions)));
  }, [editingQuiz, isCourseLevel, currentLesson, currentModule, contextQuestions, dispatch]);

  const handleQuestionsChange = useCallback(
    (updated: QuizBuilderQuestion[]) => {
      dispatch(setQuestions(updated));
    },
    [dispatch],
  );

  const persistQuestions = useCallback(
    async (list: QuizBuilderQuestion[]): Promise<boolean> => {
      if (!editingQuiz) return false;
      if (!isCourseLevel && !currentLesson) return false;

      const sanitized = sanitizeQuestions(list);

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
          return false;
        }
      }

      try {
        if (isCourseLevel) {
          dispatch(
            updateFinalAssessment({
              title: contextTitle,
              quizQuestions: sanitized,
            }),
          );
          await dispatch(syncSaveCourseAssessment()).unwrap();
        } else if (editingQuiz.level === "lesson" && currentLesson) {
          const moduleId = editingQuiz.moduleId;
          const lessonId = editingQuiz.lessonId;
          dispatch(
            updateLessonInModule({
              moduleId,
              lessonId,
              updatedLesson: { ...currentLesson, quizQuestions: sanitized },
            }),
          );
          await dispatch(
            syncSaveLessonAssessment({
              moduleId,
              lessonId,
              lessonTitle: currentLesson.title,
            }),
          ).unwrap();
        }
        return true;
      } catch (error) {
        const errors = (error as { errors?: { message?: string }[] })?.errors;
        toast.error(errors?.[0]?.message || "Failed to save quiz. Please try again.");
        return false;
      }
    },
    [editingQuiz, isCourseLevel, currentLesson, contextTitle, dispatch],
  );

  const addingQuestionRef = useRef(false);
  const maxQuestions = isCourseLevel ? 50 : 10;

  const handleAddQuestion = useCallback(
    async (current: QuizBuilderQuestion[]) => {
      if (addingQuestionRef.current) return;
      if (current.length >= maxQuestions) return;
      addingQuestionRef.current = true;
      try {
        const saved = await persistQuestions(current);
        if (!saved) return;
        dispatch(setQuestions([...current, createDefaultQuizQuestion()]));
      } finally {
        addingQuestionRef.current = false;
      }
    },
    [maxQuestions, persistQuestions, dispatch],
  );

  const handleSave = async () => {
    if (!editingQuiz) return;
    if (!isCourseLevel && !currentLesson) return;

    const saved = await persistQuestions(questions);
    if (!saved) return;

    toast.success(isCourseLevel ? "Final assessment saved." : "Quiz saved.");
    const previous = editingQuiz;
    dispatch(setEditingQuiz(null));
    if (previous.level === "lesson") {
      dispatch(
        setEditingLesson({
          moduleId: previous.moduleId,
          lessonId: previous.lessonId,
        }),
      );
    }
  };

  const handleBack = () => {
    if (!editingQuiz) return;
    const previous = editingQuiz;
    dispatch(setEditingQuiz(null));
    if (previous.level === "lesson") {
      dispatch(
        setEditingLesson({
          moduleId: previous.moduleId,
          lessonId: previous.lessonId,
        }),
      );
    }
  };

  const heading = isCourseLevel
    ? "Customize your final assessment"
    : "Customize your quizzes";
  const subheading = isCourseLevel
    ? "Customize the quiz questions taken after every module is complete"
    : "Customize your quiz questions for this lesson";

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
            {heading}
          </h2>
          <p className="text-[14px] text-[#606060] leading-[20px]">
            {subheading}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-[16px] md:px-[40px] py-[24px]">
        <QuizBuilderView
          questions={questions}
          onChange={handleQuestionsChange}
          onAddQuestion={handleAddQuestion}
          maxQuestions={maxQuestions}
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
