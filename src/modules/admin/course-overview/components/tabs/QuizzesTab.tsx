"use client";

import React from "react";
import { PlayCircle, TaskSquare, TickCircle } from "iconsax-react";
import { AssessmentCard } from "../SharedUI";
import type { AdminCourseDetail, CourseAssessment } from "@/redux/slices/adminApi";

interface QuizzesTabProps {
  course?: AdminCourseDetail;
}

export const QuizzesTab = ({ course }: QuizzesTabProps) => {
  const modules = course?.modules ?? [];

  const quizLessons = React.useMemo(
    () =>
      modules.flatMap((module) =>
        (module.lessons ?? []).filter((lesson) => lesson.lesson_type === "QUIZ")
      ),
    [modules]
  );

  const moduleAssessments = React.useMemo(
    () =>
      modules
        .filter((module) => Boolean(module.assessment))
        .map((module) => ({ module, assessment: module.assessment as CourseAssessment })),
    [modules]
  );

  const lessonAssessments = React.useMemo(
    () =>
      modules.flatMap((module) =>
        (module.lessons ?? [])
          .filter((lesson) => Boolean(lesson.assessment))
          .map((lesson) => ({ module, lesson, assessment: lesson.assessment as CourseAssessment }))
      ),
    [modules]
  );

  const finalAssessment = course?.final_assessment ?? null;

  const totalQuestions =
    (finalAssessment?.questions?.length ?? 0) +
    moduleAssessments.reduce((sum, item) => sum + (item.assessment.questions?.length ?? 0), 0) +
    lessonAssessments.reduce((sum, item) => sum + (item.assessment.questions?.length ?? 0), 0);

  const hasAnything =
    quizLessons.length > 0 ||
    moduleAssessments.length > 0 ||
    lessonAssessments.length > 0 ||
    Boolean(finalAssessment);

  if (!hasAnything) {
    return (
      <div className="flex h-[280px] flex-col items-center justify-center gap-[12px] rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 p-6 text-center">
        <TaskSquare size={40} variant="Linear" color="var(--sd-grey-11)" />
        <span className="text-[15px] font-semibold text-sd-grey-12">
          No quizzes available
        </span>
        <span className="text-[13px] text-sd-reviewer-muted max-w-[420px]">
          No quizzes or assessment lessons have been configured for this course yet.
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[24px]">
      <div className="flex flex-col gap-[12px] border-b border-sd-grey-3 pb-[24px]">
        <div className="flex items-center gap-[12px]">
          <PlayCircle size={24} variant="Linear" color="var(--sd-grey-12)" />
          <h2 className="text-[22px] font-semibold leading-[28px] text-sd-grey-12">
            Course Quizzes &amp; Assessments
          </h2>
        </div>
        <div className="ml-[36px] flex flex-wrap items-center gap-[24px] text-[12px] font-normal leading-[16px] text-sd-reviewer-muted">
          <span className="flex items-center gap-[8px]">
            <TaskSquare size={16} variant="Linear" color="currentColor" />
            <span>{quizLessons.length} quiz lessons</span>
          </span>
          <span className="flex items-center gap-[8px]">
            <TaskSquare size={16} variant="Linear" color="currentColor" />
            <span>{totalQuestions} questions</span>
          </span>
          {finalAssessment ? (
            <span className="flex items-center gap-[8px]">
              <TickCircle size={16} variant="Linear" color="#16A34A" />
              <span>Final assessment configured</span>
            </span>
          ) : (
            <span className="text-[12px] text-sd-reviewer-muted">
              No final assessment
            </span>
          )}
        </div>
      </div>

      {finalAssessment && (
        <section className="flex flex-col gap-[12px]">
          <h3 className="text-[16px] font-semibold leading-[24px] text-sd-grey-12">
            Final Assessment
          </h3>
          <AssessmentCard assessment={finalAssessment} />
        </section>
      )}

      {moduleAssessments.length > 0 && (
        <section className="flex flex-col gap-[12px]">
          <h3 className="text-[16px] font-semibold leading-[24px] text-sd-grey-12">
            Module Assessments ({moduleAssessments.length})
          </h3>
          {moduleAssessments.map(({ module, assessment }) => (
            <div key={assessment.id || module.id} className="flex flex-col gap-[8px]">
              <span className="text-[13px] font-medium leading-[18px] text-sd-reviewer-muted">
                {module.title || "Untitled module"}
              </span>
              <AssessmentCard assessment={assessment} />
            </div>
          ))}
        </section>
      )}

      {lessonAssessments.length > 0 && (
        <section className="flex flex-col gap-[12px]">
          <h3 className="text-[16px] font-semibold leading-[24px] text-sd-grey-12">
            Lesson Assessments ({lessonAssessments.length})
          </h3>
          {lessonAssessments.map(({ module, lesson, assessment }) => (
            <div key={assessment.id || lesson.id} className="flex flex-col gap-[8px]">
              <span className="text-[13px] font-medium leading-[18px] text-sd-reviewer-muted">
                {module.title || "Untitled module"} · {lesson.title || "Untitled lesson"}
              </span>
              <AssessmentCard assessment={assessment} />
            </div>
          ))}
        </section>
      )}

      <section className="flex flex-col gap-[12px]">
        <h3 className="text-[16px] font-semibold leading-[24px] text-sd-grey-12">
          Quiz Lessons ({quizLessons.length})
        </h3>
        {quizLessons.length > 0 ? (
          <div className="flex flex-col gap-[16px]">
            {quizLessons.map((quiz, index) => (
              <div
                key={quiz.id || index}
                className="flex flex-col gap-[12px] p-[20px] rounded-[12px] border border-sd-grey-3 bg-sd-grey-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[15px] font-semibold text-sd-grey-12">
                    Quiz {index + 1}: {quiz.title}
                  </span>
                  <span className="rounded bg-sd-blue/10 px-[8px] py-[2px] text-[11px] font-medium text-sd-blue">
                    {quiz.duration_minutes ? `${quiz.duration_minutes} mins` : "No duration"}
                  </span>
                </div>

                <p className="text-[14px] text-sd-reviewer-muted leading-[22px] whitespace-pre-line">
                  {quiz.script || "No quiz instructions or questions detailed in this lesson."}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[14px] leading-[22px] text-sd-reviewer-muted italic">
            No quiz-type lessons in this course.
          </p>
        )}
      </section>
    </div>
  );
};
