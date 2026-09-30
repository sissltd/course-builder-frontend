"use client";

import React, { useCallback, useState } from "react";
import Image from "next/image";
import { Play, Timer1 } from "iconsax-react";
import { Button } from "@/components/shared/Button";
import { cn } from "@/lib/utils";
import { VideoPlayerModal } from "./VideoPlayerModal";

export interface GuideVideo {
  id: number;
  title: string;
  desc: string;
  duration: string;
  thumb: string;
}

const VIDEOS: GuideVideo[] = [
  {
    id: 1,
    title: "How to create with AI",
    desc: "This video will teach you how to create your course using ai",
    duration: "1hr:32min",
    thumb: "/assets/courses/video-thumb-1.png",
  },
  {
    id: 2,
    title: "How to create a course",
    desc: "This video will guide you on how to create your course manually.",
    duration: "30min",
    thumb: "/assets/courses/video-thumb-2.png",
  },
  {
    id: 3,
    title: "How to import a course",
    desc: "This video will guide you on how to create your course from an existing document.",
    duration: "30min",
    thumb: "/assets/courses/video-thumb-3.png",
  },
];

/** The first guide is already watched on arrival, so the wizard opens at 1 of 3. */
const INITIALLY_COMPLETED_VIDEO_IDS = [VIDEOS[0].id];

// A guide counts as watched once this much of it has played through.
const VIDEO_COMPLETION_THRESHOLD = 90;

// The thumbnail column is a fixed 150px wide, so without this `next/image`
// would offer srcsets sized for the full viewport and fetch a 150px image at
// full-screen width.
const THUMBNAIL_SIZES = "150px";

interface GuideVideosStepProps {
  onBack: () => void;
  onContinue: () => void;
}

export const GuideVideosStep = ({
  onBack,
  onContinue,
}: GuideVideosStepProps) => {
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(
    VIDEOS[0].id,
  );
  const [activeVideo, setActiveVideo] = useState<GuideVideo | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  // Bumped on every play so the player remounts with a clean timeline.
  const [playbackKey, setPlaybackKey] = useState(0);
  const [completedVideos, setCompletedVideos] = useState<number[]>(
    INITIALLY_COMPLETED_VIDEO_IDS,
  );

  const markVideoCompleted = useCallback((videoId: number) => {
    setCompletedVideos((current) =>
      current.includes(videoId) ? current : [...current, videoId],
    );
  }, []);

  // The whole card is the play control — a guide only needs a click anywhere
  // on it to start, not precision on the 32px glyph.
  const handleVideoPlay = useCallback((video: GuideVideo) => {
    setSelectedVideoId(video.id);
    setActiveVideo(video);
    setPlaybackKey((key) => key + 1);
    setIsPlayerOpen(true);
  }, []);

  const handleVideoProgress = useCallback(
    (videoId: number, percent: number) => {
      if (percent >= VIDEO_COMPLETION_THRESHOLD) {
        markVideoCompleted(videoId);
      }
    },
    [markVideoCompleted],
  );

  const isAllVideosCompleted = completedVideos.length === VIDEOS.length;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] animate-in fade-in duration-500">
      <div className="text-center mb-[40px]">
        <h1 className="text-[32px] font-bold text-[#202020] font-quicksand mb-[12px]">Complete course</h1>
        <p className="text-[16px] text-[#636363] max-w-[440px] mx-auto leading-[24px]">
          Begin your journey as a course creator by finishing our SoluDesks guide on building courses
        </p>
      </div>

      <div className="w-full max-w-[600px] flex flex-col gap-[40px]">
        <div className="flex flex-col gap-[20px]">
          {VIDEOS.map((video) => {
            const isDone = completedVideos.includes(video.id);
            const isSelected = selectedVideoId === video.id;
            return (
              <div
                key={video.id}
                role="button"
                tabIndex={0}
                // Clicking anywhere on the card plays it, so the play glyph is
                // decoration rather than a hit target of its own. `aria-current`
                // marks the open guide; `aria-pressed` would claim a toggle
                // state this does not have. No `aria-label` — naming the card
                // would hide the description and completion status it contains.
                aria-current={isSelected ? "true" : undefined}
                data-testid={`video-play-${video.id}`}
                onClick={() => handleVideoPlay(video)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleVideoPlay(video);
                  }
                }}
                data-selected={isSelected ? "true" : "false"}
                className={cn(
                  "rounded-[16px] border bg-[#f8f8f8] flex items-stretch overflow-hidden transition-all cursor-pointer group min-h-[120px] outline-none focus-visible:ring-2 focus-visible:ring-sd-blue focus-visible:ring-offset-2",
                  isSelected
                    ? "border-sd-blue ring-1 ring-sd-blue"
                    : "border-[#d9d9d9] hover:border-sd-blue/50"
                )}
              >
                <div className="w-[150px] relative shrink-0">
                  <Image
                    src={video.thumb}
                    alt={video.title}
                    fill
                    sizes={THUMBNAIL_SIZES}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <span
                      aria-hidden="true"
                      className="size-[32px] rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white group-hover:bg-white/30 transition-colors"
                    >
                      <Play size={16} variant="Bold" color="currentColor" />
                    </span>
                  </div>
                </div>
                <div className="flex-1 flex flex-col p-[12px] gap-[8px]">
                  <h3 className="text-[16px] font-semibold text-[#202020] line-clamp-1">{video.title}</h3>
                  <p className="text-[14px] text-[#636363] leading-[20px] line-clamp-2 text-ellipsis overflow-hidden">{video.desc}</p>

                  <div className="flex items-center gap-[12px] mt-auto">
                    <div
                      className={cn(
                        "px-[12px] py-[4px] rounded-full text-[14px] font-normal leading-[20px] tracking-[-0.28px]",
                        isDone ? "bg-[#E6F9EF] text-[#008500]" : "bg-[#F0F0F0] text-[#202020]"
                      )}
                    >
                      {isDone ? "Completed" : "Not completed"}
                    </div>
                    <div className="flex items-center gap-[4px] px-[8px] py-[4px] border border-[#d9d9d9] rounded-full">
                      <Timer1 size={18} variant="Linear" color="#636363" />
                      <span className="text-[14px] text-[#636363] tracking-[-0.28px]">{video.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-[12px]">
          <p className="text-[14px] leading-[20px] text-[#636363]">
            {isAllVideosCompleted
              ? "All guide videos are completed. You can continue."
              : `Watch all ${VIDEOS.length} guide videos to continue — ${completedVideos.length} of ${VIDEOS.length} completed.`}
          </p>

          <div className="flex items-center gap-[16px]">
            <Button
              type="button"
              variant="app-outline"
              className="flex-1 h-[44px] text-sd-blue border-sd-blue"
              onClick={onBack}
            >
              Back
            </Button>
            <Button
              type="button"
              variant="app-primary"
              className={cn("flex-1 h-[44px]", !isAllVideosCompleted && "bg-[#CECECE] border-[#CECECE] text-[#636363] hover:bg-[#CECECE] cursor-not-allowed")}
              disabled={!isAllVideosCompleted}
              onClick={onContinue}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>

      {activeVideo && (
        <VideoPlayerModal
          key={`${activeVideo.id}-${playbackKey}`}
          isOpen={isPlayerOpen}
          onOpenChange={setIsPlayerOpen}
          title={activeVideo.title}
          thumbnail={activeVideo.thumb}
          onEnded={() => markVideoCompleted(activeVideo.id)}
          onComplete={() => markVideoCompleted(activeVideo.id)}
          isCompleted={completedVideos.includes(activeVideo.id)}
          onProgress={(percent) => handleVideoProgress(activeVideo.id, percent)}
        />
      )}
    </div>
  );
};

export default GuideVideosStep;
