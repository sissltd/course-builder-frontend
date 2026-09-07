"use client";

import React from "react";
import Image from "next/image";
import { PlayCircle, VideoPlay, Timer1, Monitor, VolumeHigh } from "iconsax-react";
import { LibraryBig } from "lucide-react";
import type { AdminCourseDetail } from "@/redux/slices/adminApi";

interface MediaTabProps {
  course?: AdminCourseDetail;
}

export const MediaTab = ({ course }: MediaTabProps) => {
  const videoLessons = React.useMemo(() => {
    if (!course?.modules) return [];
    return course.modules.flatMap(
      (m) => (m.lessons ?? []).filter((l) => l.type === "video")
    );
  }, [course]);

  const hasVideo = Boolean(course?.preview_video_url);
  const hasThumbnail = Boolean(course?.thumbnail_url);
  const totalVideos = videoLessons.length + (hasVideo ? 1 : 0);

  const durationStr = course?.planned_duration_seconds
    ? `${Math.floor(course.planned_duration_seconds / 3600)}h ${Math.floor((course.planned_duration_seconds % 3600) / 60)}m`
    : course?.duration_estimate_minutes
    ? `${course.duration_estimate_minutes}m`
    : "No duration specified";

  if (totalVideos === 0 && !hasThumbnail) {
    return (
      <div className="flex h-[280px] flex-col items-center justify-center gap-[12px] rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 p-6 text-center">
        <VideoPlay size={40} variant="Linear" color="var(--sd-grey-11)" />
        <span className="text-[15px] font-semibold text-sd-grey-12">
          No media files available
        </span>
        <span className="text-[13px] text-sd-reviewer-muted max-w-[420px]">
          No preview video, lesson videos, or media attachments have been uploaded for this course.
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[20px]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[12px]">
        {[
          { label: "Total Videos", value: totalVideos > 0 ? String(totalVideos) : "No videos", icon: VideoPlay },
          { label: "Total Duration", value: durationStr, icon: LibraryBig },
          { label: "Course Status", value: course?.status || "No status", icon: PlayCircle },
        ].map((stat) => (
          <div key={stat.label} className="flex min-h-[58px] items-center gap-[12px] rounded-[10px] border border-sd-grey-3 bg-sd-grey-1 px-[14px] py-[12px] shadow-[0_1px_0_rgba(0,0,0,0.02)]">
            <div className="flex size-[36px] items-center justify-center rounded-[8px] border border-sd-blue-light text-sd-blue bg-white">
              <stat.icon size={20} color="currentColor" />
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="text-[18px] font-semibold leading-[24px] text-sd-grey-12 truncate">
                {stat.value}
              </span>
              <span className="text-[12px] leading-[16px] text-sd-reviewer-muted">
                {stat.label}
              </span>
            </div>
          </div>
        ))}
      </div>

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
              className="h-[360px] w-full object-cover bg-black"
            />
          ) : hasThumbnail ? (
            <div className="relative h-[360px] w-full bg-sd-grey-3">
              <Image
                src={course!.thumbnail_url}
                alt={course?.title || "Media preview"}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <span className="rounded-full bg-black/60 px-[16px] py-[8px] text-[13px] font-medium text-white backdrop-blur-sm">
                  Thumbnail only (No preview video uploaded)
                </span>
              </div>
            </div>
          ) : (
            <div className="flex h-[240px] flex-col items-center justify-center gap-[8px] text-center p-6 text-sd-reviewer-muted">
              <VideoPlay size={36} variant="Linear" color="var(--sd-grey-11)" />
              <span>No preview video uploaded</span>
            </div>
          )}
        </div>

        <div className="mt-[16px] flex flex-wrap items-center gap-[24px] text-[12px] font-medium leading-[16px] text-sd-grey-12">
          <span className="flex items-center gap-[6px]">
            <Timer1 size={16} variant="Linear" color="var(--sd-reviewer-muted)" />
            <span>Duration: <span className="font-normal text-sd-reviewer-muted ml-[2px]">{durationStr}</span></span>
          </span>
          <span className="flex items-center gap-[6px]">
            <Monitor size={16} variant="Linear" color="var(--sd-reviewer-muted)" />
            <span>Resolution: <span className="font-normal text-sd-reviewer-muted ml-[2px]">{hasVideo ? "1080p (Standard)" : "No video"}</span></span>
          </span>
          <span className="flex items-center gap-[6px]">
            <VolumeHigh size={16} variant="Linear" color="var(--sd-reviewer-muted)" />
            <span>Audio Quality: <span className="font-normal text-sd-reviewer-muted ml-[2px]">{hasVideo ? "Standard" : "No audio"}</span></span>
          </span>
        </div>
      </div>

      {/* Video Lessons List */}
      <div className="rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 p-[18px]">
        <h2 className="text-[16px] font-semibold leading-[24px] text-sd-grey-12">
          Video Lessons ({videoLessons.length})
        </h2>
        {videoLessons.length > 0 ? (
          <div className="mt-[12px] flex flex-col gap-[8px]">
            {videoLessons.map((lesson, idx) => (
              <div
                key={lesson.id || idx}
                className="flex items-center justify-between rounded-[8px] border border-sd-grey-3 bg-sd-grey-2/60 p-[12px]"
              >
                <div className="flex items-center gap-[10px]">
                  <PlayCircle size={18} variant="Linear" color="var(--sd-blue)" />
                  <span className="text-[14px] font-medium text-sd-grey-12">
                    {lesson.title}
                  </span>
                </div>
                <span className="text-[12px] text-sd-reviewer-muted">
                  {lesson.duration_seconds
                    ? `${Math.floor(lesson.duration_seconds / 60)} mins`
                    : "No duration specified"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-[10px] text-[14px] leading-[22px] text-sd-reviewer-muted italic">
            No video lessons included in course modules.
          </p>
        )}
      </div>

      {/* Media Properties */}
      <div className="rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 p-[18px]">
        <h2 className="text-[16px] font-semibold leading-[24px] text-sd-grey-12">
          Media properties
        </h2>
        <div className="mt-[16px] grid grid-cols-1 md:grid-cols-3 gap-[16px]">
          {[
            { label: "Preview Video", value: hasVideo ? "Uploaded" : "No preview video", status: hasVideo ? "Pass" : "Missing" },
            { label: "Thumbnail", value: hasThumbnail ? "Uploaded" : "No thumbnail", status: hasThumbnail ? "Pass" : "Missing" },
            { label: "Video Lessons", value: videoLessons.length > 0 ? `${videoLessons.length} lessons` : "No video lessons", status: videoLessons.length > 0 ? "Pass" : "Missing" },
            { label: "Duration", value: durationStr, status: course?.planned_duration_seconds ? "Pass" : "Missing" },
            { label: "Course Status", value: course?.status || "No status", status: "Pass" },
            { label: "SRT Captions", value: "No captions uploaded", status: "Missing" },
          ].map((prop) => (
            <div key={prop.label} className="flex items-center justify-between rounded-[8px] border border-sd-grey-3 bg-sd-grey-1 p-[12px]">
              <div className="flex flex-col gap-[4px]">
                <span className="text-[12px] font-medium text-sd-grey-12">{prop.label}</span>
                <span className="text-[12px] font-normal text-sd-reviewer-muted">{prop.value}</span>
              </div>
              <span className={`rounded-[4px] px-[8px] py-[2px] text-[10px] font-semibold uppercase ${prop.status === "Pass" ? "bg-[#EAFBF3] text-[#16A34A]" : "bg-sd-grey-3 text-sd-grey-11"}`}>
                {prop.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
