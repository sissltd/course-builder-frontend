"use client";

import React, { useCallback, useMemo, useRef } from "react";
import { ArrowLeft2 } from "iconsax-react";
import { Button } from "@/components/shared/Button";
import { useAppDispatch, useAppSelector } from "@/redux";
import { setQuestions } from "@/redux/slices/quizBuilderSlice";
import { updateLessonInModule, setEditingQuiz, setEditingLesson } from "@/redux/slices/courseBuilderSlice";
import { syncSaveQuizQuestions } from "@/redux/slices/builderSync";
import { QuizBuilderView } from "./QuizBuilderView";

export const QuizEditorPageView = () => {
  const dispatch = useAppDispatch();
  const editingQuiz = useAppSelector((s) => s.courseBuilder.editingQuiz);
  const rawQuestions = useAppSelector((s) => s.quizBuilder.questions);
  const modules = useAppSelector((s) => s.courseBuilder.modules);

  const questionsRef = useRef(rawQuestions);
  const questions = useMemo(() => {
    if (rawQuestions === questionsRef.current) return questionsRef.current;
    if (rawQuestions.length === questionsRef.current.length &&
        rawQuestions.every((q, i) => q.question === questionsRef.current[i]?.question &&
          q.type === questionsRef.current[i]?.type &&
          q.options.length === questionsRef.current[i]?.options.length)) {
      return questionsRef.current;
    }
    questionsRef.current = rawQuestions;
    return rawQuestions;
  }, [rawQuestions]);

  const currentModule = editingQuiz ? modules.find((m) => m.id === editingQuiz.moduleId) : null;
  const currentLesson = currentModule?.lessons.find((l) => l.id === editingQuiz?.lessonId) || null;

  const handleQuestionsChange = useCallback((updated: any[]) => {
    dispatch(setQuestions(updated));
  }, [dispatch]);

  const handleSave = () => {
    if (!editingQuiz || !currentLesson) return;
    const updatedLesson = { ...currentLesson, quizQuestions: questions };
    dispatch(
      updateLessonInModule({
        moduleId: editingQuiz.moduleId,
        lessonId: editingQuiz.lessonId,
        updatedLesson,
      })
    );
    dispatch(syncSaveQuizQuestions({
      moduleId: editingQuiz.moduleId,
      lessonId: editingQuiz.lessonId,
      lessonTitle: currentLesson.title || "Lesson",
    }));
    // Return to lesson view
    dispatch(setEditingQuiz(null));
    dispatch(setEditingLesson({ moduleId: editingQuiz.moduleId, lessonId: editingQuiz.lessonId }));
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
      <div className="flex items-start justify-between px-[40px] pt-[24px] pb-[16px] border-b border-[#F0F0F0] shrink-0">
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
      <div className="flex-1 overflow-y-auto px-[40px] py-[24px]">
        <QuizBuilderView
          questions={questions}
          onChange={handleQuestionsChange}
          maxQuestions={3}
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-[12px] px-[40px] py-[16px] border-t border-[#F0F0F0] shrink-0">
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
