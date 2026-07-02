"use client";

import React from "react";
import { Button } from "@/components/shared/Button";
import { useAppDispatch, useAppSelector } from "@/redux";
import { setQuestions, QuizBuilderQuestion } from "@/redux/slices/quizBuilderSlice";
import { updateLessonInModule, setEditingQuiz } from "@/redux/slices/courseBuilderSlice";
import { QuizBuilderView } from "./QuizBuilderView";

export const QuizEditorPageView = () => {
  const dispatch = useAppDispatch();
  const editingQuiz = useAppSelector((s) => s.courseBuilder.editingQuiz);
  const questions = useAppSelector((s) => s.quizBuilder.questions);
  const modules = useAppSelector((s) => s.courseBuilder.modules);

  const currentModule = editingQuiz ? modules.find((m) => m.id === editingQuiz.moduleId) : null;
  const currentLesson = currentModule?.lessons.find((l) => l.id === editingQuiz?.lessonId) || null;

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
    dispatch(setEditingQuiz(null));
  };

  const handleCancel = () => {
    dispatch(setEditingQuiz(null));
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between px-[40px] pt-[24px] pb-[16px] border-b border-[#F0F0F0] shrink-0">
        <div className="flex flex-col gap-[4px]">
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
          onChange={(updated) => dispatch(setQuestions(updated))}
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-[12px] px-[40px] py-[16px] border-t border-[#F0F0F0] shrink-0">
        <Button
          variant="app-outline"
          className="h-[44px] px-[24px]"
          onClick={handleCancel}
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
