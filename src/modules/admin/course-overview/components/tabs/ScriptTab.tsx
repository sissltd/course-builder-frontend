"use client";

import React from "react";
import Image from "next/image";
import { Play, PlayCircle, Clock, Sound, Trash, More, InfoCircle, VideoPlay } from "iconsax-react";
import { ScriptSectionCard, ScriptField, ScriptObjectiveItem } from "../SharedUI";
import type { AdminCourseDetail } from "@/redux/slices/adminApi";

interface ScriptTabProps {
  course?: AdminCourseDetail;
}

export const ScriptTab = ({ course }: ScriptTabProps) => {
  const modules = course?.modules ?? [];
  const [selectedModuleIndex, setSelectedModuleIndex] = React.useState(0);
  const [selectedLessonIndex, setSelectedLessonIndex] = React.useState(0);

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

  const durationStr = currentLesson?.duration_seconds
    ? `${Math.floor(currentLesson.duration_seconds / 60)}mins`
    : course?.planned_duration_seconds
    ? `${Math.floor(course.planned_duration_seconds / 60)}mins`
    : "No duration specified";

  const hasVideo = Boolean(course?.preview_video_url);

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
              {course?.learning_objectives?.[0] || "No objective specified for this module."}
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
            <p className="mt-[12px] text-[14px] leading-[22px] text-sd-reviewer-muted">
              {currentLesson.content || "No script content written for this lesson yet."}
            </p>
          </ScriptSectionCard>
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
          {course?.learning_objectives && course.learning_objectives.length > 0 ? (
            course.learning_objectives.map((item, idx) => (
              <ScriptObjectiveItem key={idx} number={`0${idx + 1}`} text={item} />
            ))
          ) : (
            <p className="text-[14px] text-sd-reviewer-muted italic p-2">
              No learning objectives specified for this course.
            </p>
          )}
        </div>
      </ScriptSectionCard>
    </div>
  );
};
