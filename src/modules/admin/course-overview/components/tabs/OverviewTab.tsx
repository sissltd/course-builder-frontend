"use client";

import React from "react";
import Image from "next/image";
import {
  Play,
  Clock,
  PlayCircle,
  Sound,
  InfoCircle,
  BookSaved,
  Task,
  ArrowDown2,
  ArrowRight2,
  VideoPlay,
} from "iconsax-react";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatCard } from "../SharedUI";
import type { AdminCourseDetail, AdminCourseModule } from "@/redux/slices/adminApi";

interface OverviewTabProps {
  course?: AdminCourseDetail;
  onAddComment?: (title: string, comment: string, highlightedText?: string) => void;
}

export const OverviewTab = ({ course, onAddComment }: OverviewTabProps) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [openModules, setOpenModules] = React.useState<Record<number, boolean>>({
    0: true,
    1: true,
  });

  const [commentBtn, setCommentBtn] = React.useState<{ show: boolean; x: number; y: number } | null>(null);
  const [commentModal, setCommentModal] = React.useState<{ show: boolean; x: number; y: number } | null>(null);
  const [selectedText, setSelectedText] = React.useState("");

  const [commentTitle, setCommentTitle] = React.useState("");
  const [commentBody, setCommentBody] = React.useState("");

  React.useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".comment-modal-popover") && !target.closest(".comment-trigger-btn")) {
        setCommentBtn(null);
        setCommentModal(null);
      }
    };
    document.addEventListener("mousedown", handleDocumentClick);
    return () => document.removeEventListener("mousedown", handleDocumentClick);
  }, []);

  const toggleModule = (index: number) => {
    setOpenModules((current) => ({ ...current, [index]: !current[index] }));
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLParagraphElement>) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const text = selection.toString().trim();
    if (text.length > 0 && containerRef.current) {
      try {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();

        setCommentBtn({
          show: true,
          x: rect.right - containerRect.left + containerRef.current.scrollLeft - 10,
          y: rect.bottom - containerRect.top + containerRef.current.scrollTop + 6,
        });
        setSelectedText(text);
      } catch (err) {
        console.error(err);
      }
    } else {
      setCommentBtn(null);
    }
  };

  const handleCommentBtnClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (commentBtn) {
      setCommentModal({
        show: true,
        x: commentBtn.x,
        y: commentBtn.y,
      });
      setCommentBtn(null);
      setCommentTitle("");
      setCommentBody("");
    }
  };

  const handleAddCommentSubmit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (commentTitle.trim() && commentBody.trim()) {
      if (onAddComment) {
        onAddComment(commentTitle.trim(), commentBody.trim(), selectedText);
      }
      setCommentModal(null);
      setSelectedText("");
      window.getSelection()?.removeAllRanges();
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCommentModal(null);
    setSelectedText("");
    window.getSelection()?.removeAllRanges();
  };

  // Dynamic calculations from real API course object
  const totalModules = course?.modules?.length ?? 0;
  const totalLessons = React.useMemo(() => {
    if (!course?.modules) return 0;
    return course.modules.reduce((acc, m) => acc + (m.lessons?.length ?? 0), 0);
  }, [course]);

  const totalAssessments = React.useMemo(() => {
    if (!course?.modules) return 0;
    const quizCount = course.modules.reduce(
      (acc, m) => acc + (m.lessons?.filter((l) => l.type === "quiz" || l.type === "assessment")?.length ?? 0),
      0
    );
    return quizCount + (course.final_assessment ? 1 : 0);
  }, [course]);

  const dynamicStatCards = [
    {
      icon: BookSaved,
      value: totalModules > 0 ? "100%" : "No structure",
      label: "Structure",
      iconBg: "bg-[#0063EF1A]",
      iconColor: "var(--sd-blue)",
    },
    {
      icon: BookSaved,
      value: totalModules > 0 ? String(totalModules) : "No modules",
      label: "Total Modules",
      iconBg: "bg-[#0063EF1A]",
      iconColor: "var(--sd-blue)",
    },
    {
      icon: PlayCircle,
      value: totalLessons > 0 ? String(totalLessons) : "No lessons",
      label: "Total Lessons",
      iconBg: "bg-[#0063EF1A]",
      iconColor: "var(--sd-blue)",
    },
    {
      icon: Task,
      value: totalAssessments > 0 ? String(totalAssessments) : "No assessments",
      label: "Total Assessment",
      iconBg: "bg-[#0063EF1A]",
      iconColor: "var(--sd-blue)",
    },
  ];

  const formatDuration = (seconds?: number | null, fallbackMinutes?: number | null) => {
    if (seconds && seconds > 0) {
      const hrs = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      if (hrs > 0) return `${hrs}h ${mins}m`;
      return `${mins}mins`;
    }
    if (fallbackMinutes && fallbackMinutes > 0) {
      return `${fallbackMinutes}mins`;
    }
    return "No duration specified";
  };

  const hasVideo = Boolean(course?.preview_video_url);
  const hasThumbnail = Boolean(course?.thumbnail_url);

  return (
    <div ref={containerRef} className="relative flex flex-col gap-[20px]">
      {/* Course Title */}
      <h1 className="text-[20px] font-bold leading-[28px] text-sd-grey-12">
        {course?.title || "No course title provided"}
      </h1>

      {/* Dynamic Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-[12px]">
        {dynamicStatCards.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Preview Video */}
      <div className="rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 p-[16px]">
        <div className="mb-[12px] text-[14px] font-semibold leading-[20px] text-sd-grey-12">
          Preview Video
        </div>

        <div className="relative overflow-hidden rounded-[10px] border border-sd-grey-3 bg-sd-grey-2">
          {hasVideo ? (
            <video
              src={course!.preview_video_url}
              poster={course?.thumbnail_url || undefined}
              controls
              className="h-[290px] w-full object-cover bg-black"
            />
          ) : hasThumbnail ? (
            <div className="relative h-[290px] w-full bg-sd-grey-3">
              <Image
                src={course!.thumbnail_url}
                alt={course?.title || "Course thumbnail"}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <span className="rounded-full bg-black/60 px-[16px] py-[8px] text-[12px] font-medium text-white backdrop-blur-sm">
                  Thumbnail only (No preview video uploaded)
                </span>
              </div>
            </div>
          ) : (
            <div className="flex h-[240px] flex-col items-center justify-center gap-[10px] bg-sd-grey-2 p-6 text-center">
              <VideoPlay size={40} variant="Linear" color="var(--sd-grey-11)" />
              <span className="text-[14px] font-medium text-sd-grey-12">
                No preview video uploaded
              </span>
              <span className="text-[12px] text-sd-reviewer-muted">
                The creator has not attached a preview video or thumbnail for this course.
              </span>
            </div>
          )}
        </div>

        <div className="mt-[16px] flex flex-wrap items-center gap-[16px] text-[12px] leading-[16px] text-sd-reviewer-muted">
          <span className="flex items-center gap-[6px]">
            <Clock size={16} variant="Linear" color="currentColor" />
            <span>Duration: {formatDuration(course?.planned_duration_seconds, course?.duration_estimate_minutes)}</span>
          </span>
          <span className="flex items-center gap-[6px]">
            <PlayCircle size={16} variant="Linear" color="currentColor" />
            <span>Video status: {hasVideo ? "Uploaded" : "No preview video"}</span>
          </span>
          <span className="flex items-center gap-[6px]">
            <Sound size={16} variant="Linear" color="currentColor" />
            <span>Media: {hasVideo ? "Preview ready" : "No media file"}</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-[12px] rounded-[12px] bg-sd-blue-light px-[16px] py-[14px] text-[14px] leading-[20px] text-sd-grey-12 border-l-2 border-l-sd-blue">
        <InfoCircle size={20} variant="Bulk" color="var(--sd-blue)" className="shrink-0" />
        <span>
          {hasVideo
            ? "Preview video required to be played before approve is enabled."
            : "No preview video has been submitted for this course."}
        </span>
      </div>

      {/* Course Description */}
      <div className="rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 p-[18px]">
        <h2 className="text-[16px] font-semibold leading-[24px] text-sd-grey-12">
          Course Description
        </h2>
        <p
          onMouseUp={handleMouseUp}
          className="mt-[10px] text-[14px] leading-[22px] text-sd-reviewer-muted selection:bg-sd-blue/20"
        >
          {course?.description || "No description has been provided for this course yet."}
        </p>
      </div>

      {/* Learning Objectives */}
      <div className="rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 p-[18px]">
        <h2 className="text-[16px] font-semibold leading-[24px] text-sd-grey-12">
          Learning Objectives
        </h2>
        {course?.learning_objectives && course.learning_objectives.length > 0 ? (
          <ul className="mt-[10px] list-disc list-inside space-y-[6px] text-[14px] leading-[22px] text-sd-reviewer-muted">
            {course.learning_objectives.map((obj, i) => (
              <li key={i}>{obj}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-[10px] text-[14px] leading-[22px] text-sd-reviewer-muted italic">
            No learning objectives specified for this course.
          </p>
        )}
      </div>

      {/* Tags */}
      <div className="rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 p-[18px]">
        <h2 className="text-[16px] font-semibold leading-[24px] text-sd-grey-12">
          Tags
        </h2>
        {course?.tags && course.tags.length > 0 ? (
          <div className="mt-[10px] flex flex-wrap gap-[8px]">
            {course.tags.map((tag, i) => (
              <span
                key={i}
                className="rounded-full bg-sd-grey-2 border border-sd-grey-4 px-[12px] py-[4px] text-[12px] font-medium text-sd-grey-12"
              >
                #{tag}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-[10px] text-[14px] leading-[22px] text-sd-reviewer-muted italic">
            No tags provided for this course.
          </p>
        )}
      </div>

      {/* Modules & Lessons */}
      <div className="flex flex-col gap-[12px]">
        <h2 className="text-[16px] font-semibold leading-[24px] text-sd-grey-12">
          Modules &amp; Lessons
        </h2>

        {course?.modules && course.modules.length > 0 ? (
          <div className="flex flex-col gap-[16px]">
            {course.modules.map((module: AdminCourseModule, index: number) => {
              const isOpen = Boolean(openModules[index]);
              const moduleLessons = module.lessons ?? [];

              return (
                <div key={module.id || index} className="rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleModule(index)}
                    className={cn(
                      "flex w-full items-center justify-between gap-[16px] p-[16px] text-left transition-colors hover:bg-[#E5E5E5]",
                      isOpen ? "bg-[#F0F0F0CC] border-b border-sd-grey-3" : "bg-[#F0F0F0CC]"
                    )}
                  >
                    <div className="flex min-w-0 flex-col gap-[6px]">
                      <span className="text-[15px] font-semibold leading-[22px] text-sd-grey-12 truncate">
                        {module.title || `Module ${index + 1}`}
                      </span>
                      <div className="flex flex-wrap items-center gap-[16px] text-[12px] leading-[18px] text-sd-reviewer-muted">
                        <span className="flex items-center gap-[4px]">
                          <BookSaved size={14} variant="Linear" color="currentColor" />
                          <span>
                            {moduleLessons.length > 0
                              ? `${moduleLessons.length} Lessons`
                              : "No lessons"}
                          </span>
                        </span>
                        <span className="flex items-center gap-[4px]">
                          <Task size={14} variant="Linear" color="currentColor" />
                          <span>
                            {moduleLessons.filter((l) => l.type === "quiz" || l.type === "assessment").length > 0
                              ? `${moduleLessons.filter((l) => l.type === "quiz" || l.type === "assessment").length} Assessments`
                              : "No assessments"}
                          </span>
                        </span>
                      </div>
                    </div>
                    {isOpen ? (
                      <ArrowDown2 size={20} variant="Linear" color="var(--sd-grey-11)" className="shrink-0" />
                    ) : (
                      <ArrowRight2 size={20} variant="Linear" color="var(--sd-grey-11)" className="shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="p-[16px] bg-[#F0F0F0CC] flex flex-col gap-[12px]">
                      {module.description && (
                        <p className="text-[13px] text-sd-reviewer-muted pb-2 border-b border-sd-grey-3">
                          {module.description}
                        </p>
                      )}
                      {moduleLessons.length > 0 ? (
                        moduleLessons.map((lesson, lIdx) => {
                          const Icon =
                            lesson.type === "video"
                              ? VideoPlay
                              : lesson.type === "quiz" || lesson.type === "assessment"
                              ? Task
                              : BookOpen;
                          const dur = lesson.duration_seconds
                            ? `${Math.floor(lesson.duration_seconds / 60)}m`
                            : "No duration";

                          return (
                            <div
                              key={lesson.id || lIdx}
                              className="flex items-center justify-between gap-[16px] rounded-[8px] border border-sd-grey-3 bg-sd-grey-1 p-[14px] transition-colors hover:bg-sd-grey-2"
                            >
                              <div className="flex items-center gap-[12px] min-w-0">
                                <Icon size={20} variant="Linear" color="var(--sd-grey-9)" className="shrink-0" />
                                <div className="flex flex-col gap-[2px] min-w-0">
                                  <span className="text-[14px] font-semibold leading-[20px] text-sd-grey-12 truncate">
                                    {lesson.title || `Lesson ${lIdx + 1}`}
                                  </span>
                                  <div className="flex items-center gap-[8px] text-[12px] leading-[16px] text-sd-reviewer-muted">
                                    <span>{dur}</span>
                                    <span>•</span>
                                    <span className="capitalize">{lesson.type || "Lesson"}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <span className="text-[14px] text-sd-reviewer-muted italic">
                          No lessons in this module
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex h-[110px] items-center justify-center rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 text-[14px] text-sd-reviewer-muted italic">
            No modules have been created for this course yet.
          </div>
        )}
      </div>

      {/* Plagiarism Report */}
      <div className="rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 p-[18px]">
        <h2 className="text-[16px] font-semibold leading-[24px] text-sd-grey-12">
          Plagiarism Report
        </h2>
        <p className="mt-[10px] text-[14px] leading-[22px] text-sd-reviewer-muted italic">
          No plagiarism report available for this course.
        </p>
      </div>

      {/* Popover comment trigger button */}
      {commentBtn && (
        <button
          type="button"
          onClick={handleCommentBtnClick}
          style={{ top: `${commentBtn.y}px`, left: `${commentBtn.x}px` }}
          className="comment-trigger-btn absolute z-50 flex items-center gap-[6px] rounded-full bg-sd-grey-12 px-[10px] py-[4px] text-[12px] font-medium text-white shadow-lg transition-transform hover:scale-105 cursor-pointer"
        >
          <span>Add Note</span>
        </button>
      )}

      {/* Inline Review Comment Popover Modal */}
      {commentModal && (
        <div
          style={{ top: `${commentModal.y}px`, left: `${Math.min(commentModal.x, 300)}px` }}
          className="comment-modal-popover absolute z-50 w-[300px] rounded-[10px] border border-sd-grey-3 bg-white p-[14px] shadow-[0px_8px_24px_rgba(0,0,0,0.15)] flex flex-col gap-[10px]"
        >
          <span className="text-[13px] font-semibold text-sd-grey-12">Add Review Note</span>
          {selectedText && (
            <p className="line-clamp-2 rounded bg-sd-grey-2 p-[6px] text-[11px] italic text-sd-grey-11">
              &quot;{selectedText}&quot;
            </p>
          )}
          <input
            type="text"
            value={commentTitle}
            onChange={(e) => setCommentTitle(e.target.value)}
            placeholder="Tag / Reason code (e.g. SCRIPT_ISSUE)"
            className="rounded-[6px] border border-sd-grey-4 px-[8px] py-[6px] text-[13px] outline-none focus:border-sd-blue"
          />
          <textarea
            rows={3}
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
            placeholder="Write your review comment..."
            className="resize-none rounded-[6px] border border-sd-grey-4 p-[8px] text-[13px] outline-none focus:border-sd-blue"
          />
          <div className="flex justify-end gap-[8px] pt-[4px]">
            <button
              type="button"
              onClick={handleCancel}
              className="px-[10px] py-[4px] text-[12px] text-sd-grey-11 hover:text-sd-grey-12"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddCommentSubmit}
              disabled={!commentBody.trim()}
              className="rounded-[6px] bg-sd-blue px-[12px] py-[4px] text-[12px] font-medium text-white hover:bg-sd-blue-hover disabled:opacity-50"
            >
              Save Note
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
