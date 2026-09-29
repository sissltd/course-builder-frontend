"use client";

import Image from "next/image";
import { PlayCircle, Clock, Trash, More, VideoPlay } from "iconsax-react";
import { ScriptSectionCard, ScriptField, ScriptObjectiveItem, AssessmentCard } from "../SharedUI";
import type { AdminCourseDetail } from "@/redux/slices/adminApi";

interface ScriptTabProps {
  course?: AdminCourseDetail;
  selectedModuleIndex?: number;
  selectedLessonIndex?: number;
}

const RichTextBody = ({ html, fallback }: { html?: string; fallback: string }) => {
  if (!html?.trim()) {
    return (
      <p className="mt-[12px] text-[14px] leading-[22px] text-sd-reviewer-muted">
        {fallback}
      </p>
    );
  }

  return (
    <div
      className="mt-[12px] text-[14px] leading-[22px] text-sd-reviewer-muted [&_a]:text-sd-blue [&_a]:underline [&_blockquote]:my-[12px] [&_blockquote]:border-l-4 [&_blockquote]:border-sd-blue [&_blockquote]:bg-sd-grey-2 [&_blockquote]:px-[16px] [&_blockquote]:py-[8px] [&_h1]:mb-[12px] [&_h1]:text-[22px] [&_h1]:font-semibold [&_h1]:leading-[28px] [&_h1]:text-sd-grey-12 [&_h2]:mb-[10px] [&_h2]:text-[18px] [&_h2]:font-semibold [&_h2]:leading-[24px] [&_h2]:text-sd-grey-12 [&_h3]:mb-[8px] [&_h3]:text-[16px] [&_h3]:font-semibold [&_h3]:leading-[22px] [&_h3]:text-sd-grey-12 [&_hr]:my-[16px] [&_img]:my-[12px] [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-[8px] [&_li]:mb-[4px] [&_ol]:my-[10px] [&_ol]:list-decimal [&_ol]:pl-[24px] [&_p]:mb-[10px] [&_pre]:my-[12px] [&_pre]:overflow-x-auto [&_pre]:rounded-[8px] [&_pre]:bg-sd-grey-2 [&_pre]:p-[12px] [&_ul]:my-[10px] [&_ul]:list-disc [&_ul]:pl-[24px] [&>*:last-child]:mb-0"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export const ScriptTab = ({
  course,
  selectedModuleIndex = 0,
  selectedLessonIndex = 0,
}: ScriptTabProps) => {
  const modules = course?.modules ?? [];

  if (modules.length === 0) {
    return (
      <div className="flex h-[280px] flex-col items-center justify-center gap-[12px] rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 p-6 text-center">
        <PlayCircle size={40} variant="Linear" color="var(--sd-grey-11)" />
        <span className="text-[15px] font-semibold text-sd-grey-12">
          No script content available
        </span>
        <span className="text-[13px] text-sd-reviewer-muted max-w-[420px]">
          No modules or lesson scripts have been submitted for this course yet.
        </span>
      </div>
    );
  }

  const currentModule = modules[selectedModuleIndex] || modules[0];
  const moduleLessons = currentModule?.lessons ?? [];
  const currentLesson = moduleLessons[selectedLessonIndex] || moduleLessons[0];

  const durationStr = currentLesson?.duration_minutes
    ? `${currentLesson.duration_minutes}mins`
    : course?.planned_duration_seconds
    ? `${Math.floor(course.planned_duration_seconds / 60)}mins`
    : "No duration specified";

  const hasVideo = Boolean(course?.preview_video_url);

  const objectives =
    currentLesson?.learning_objectives?.length
      ? currentLesson.learning_objectives
      : currentModule?.learning_objectives?.length
      ? currentModule.learning_objectives
      : course?.learning_objectives ?? [];

  return (
    <div className="flex flex-col gap-[40px]">
      <ScriptSectionCard className="p-[16px]">
        <div className="flex min-h-[404px] flex-col">
          <div className="flex items-start justify-between gap-[24px]">
            <div>
              <h1 className="text-[16px] font-semibold leading-[24px] text-sd-grey-12">
                {currentModule?.title || `Module ${selectedModuleIndex + 1}`}
              </h1>
              <div className="mt-[8px] flex items-center gap-[12px] text-[14px] font-normal leading-[20px] text-sd-reviewer-muted">
                <span>
                  {moduleLessons.length > 0
                    ? `Total lessons (${moduleLessons.length})`
                    : "No lessons"}
                </span>
                <span>Time ({durationStr})</span>
              </div>
            </div>
            <div className="flex h-[20px] items-center gap-[16px] text-sd-grey-11">
              <button type="button" className="transition-colors hover:text-sd-danger cursor-pointer" aria-label="Delete">
                <Trash size={20} variant="Linear" color="currentColor" />
              </button>
              <button type="button" className="transition-colors hover:text-sd-grey-12 cursor-pointer" aria-label="More options">
                <More size={20} variant="Linear" color="currentColor" />
              </button>
            </div>
          </div>

          <div className="mt-[24px] flex flex-col gap-[20px]">
            <ScriptField label="Title">
              {currentModule?.title || course?.title || "No title specified"}
            </ScriptField>

            <ScriptField
              label="Description"
              className="min-h-[84px]"
            >
              {currentModule?.description || course?.description || "No description provided for this module."}
            </ScriptField>

            <ScriptField label="Objective" className="min-h-[64px]">
              {currentModule?.learning_objectives?.join("\n") ||
                "No objective specified for this module."}
            </ScriptField>
          </div>
        </div>
      </ScriptSectionCard>

      {/* Lesson Section */}
      {currentLesson ? (
        <>
          <div className="flex items-center gap-[12px]">
            <PlayCircle size={24} variant="Linear" color="var(--sd-grey-11)" />
            <h2 className="text-[22px] font-semibold leading-[28px] text-sd-grey-12">
              {currentLesson.title || `Lesson ${selectedLessonIndex + 1}`}
            </h2>
          </div>

          <ScriptSectionCard className="p-[16px]">
            <h2 className="text-[18px] font-semibold leading-[24px] text-sd-grey-12">Media</h2>
            <div className="relative mt-[11px] h-[309px] overflow-hidden rounded-[10px] bg-sd-grey-3">
              {hasVideo ? (
                <video
                  src={course!.preview_video_url}
                  poster={course?.thumbnail_url || undefined}
                  controls
                  className="h-full w-full object-cover bg-black"
                />
              ) : course?.thumbnail_url ? (
                <Image
                  src={course.thumbnail_url}
                  alt={currentLesson.title || "Lesson media"}
                  fill
                  className="object-cover"
                  sizes="801px"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-[8px] bg-sd-grey-2 text-center p-4">
                  <VideoPlay size={36} variant="Linear" color="var(--sd-grey-11)" />
                  <span className="text-[14px] font-medium text-sd-grey-12">No media uploaded</span>
                  <span className="text-[12px] text-sd-reviewer-muted">No media asset has been attached to this lesson yet.</span>
                </div>
              )}
            </div>

            <div className="mt-[16px] flex flex-wrap items-center gap-[24px] text-[12px] font-medium leading-[16px] text-sd-grey-12">
              <span className="flex items-center gap-[6px]">
                <Clock size={16} variant="Linear" color="var(--sd-reviewer-muted)" />
                <span>Duration: <span className="font-normal text-sd-reviewer-muted ml-[2px]">{durationStr}</span></span>
              </span>
              <span className="flex items-center gap-[6px]">
                <PlayCircle size={16} variant="Linear" color="var(--sd-reviewer-muted)" />
                <span>Media: <span className="font-normal text-sd-reviewer-muted ml-[2px]">{hasVideo ? "Video uploaded" : "No video"}</span></span>
              </span>
            </div>
          </ScriptSectionCard>

          <ScriptSectionCard className="p-[16px]">
            <h2 className="text-[18px] font-semibold leading-[24px] text-sd-grey-12">Script</h2>
            <RichTextBody
              html={currentLesson.script}
              fallback="No script content written for this lesson yet."
            />
          </ScriptSectionCard>

          <ScriptSectionCard className="p-[16px]">
            <h2 className="text-[18px] font-semibold leading-[24px] text-sd-grey-12">
              Lesson Requirement
            </h2>
            <RichTextBody
              html={currentLesson.lesson_requirement}
              fallback="No lesson requirement specified."
            />
          </ScriptSectionCard>

          {currentLesson.assessment && (
            <ScriptSectionCard className="p-[16px]">
              <h2 className="text-[18px] font-semibold leading-[24px] text-sd-grey-12">
                Assessment
              </h2>
              <div className="mt-[16px]">
                <AssessmentCard assessment={currentLesson.assessment} />
              </div>
            </ScriptSectionCard>
          )}
        </>
      ) : (
        <div className="rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 p-6 text-center text-[14px] text-sd-reviewer-muted">
          No lessons found in this module.
        </div>
      )}

      {/* Learning Objectives */}
      <ScriptSectionCard className="p-[16px]">
        <h2 className="text-[18px] font-semibold leading-[24px] text-sd-grey-12">Objective</h2>
        <div className="mt-[16px] flex flex-col gap-[8px]">
          {objectives.length > 0 ? (
            objectives.map((item, idx) => (
              <ScriptObjectiveItem key={idx} number={`0${idx + 1}`} text={item} />
            ))
          ) : (
            <p className="text-[14px] text-sd-reviewer-muted italic p-2">
              No learning objectives specified for this lesson, module or course.
            </p>
          )}
        </div>
      </ScriptSectionCard>
    </div>
  );
};
