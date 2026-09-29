"use client";
import React, { useCallback, useState } from "react";
import Image from "next/image";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/shared/Button";
import { Play, Pause, CloseCircle, Video, TickCircle } from "iconsax-react";
import { cn } from "@/lib/utils";

const SOLUDESK_ICON = "/soludeskIcon.png";

const formatTime = (time: number) => {
  if (!Number.isFinite(time) || time < 0) return "00:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

interface VideoPlayerModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  videoUrl?: string;
  thumbnail?: string;
  onEnded?: () => void;
  onProgress?: (percent: number) => void;
  onComplete?: () => void;
  isCompleted?: boolean;
}

export const VideoPlayerModal = ({
  isOpen,
  onOpenChange,
  title,
  videoUrl,
  thumbnail,
  onEnded,
  onProgress,
  onComplete,
  isCompleted = false,
}: VideoPlayerModalProps) => {
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasMediaError, setHasMediaError] = useState(false);

  const hasMedia = Boolean(videoUrl) && !hasMediaError;

  // Without a real source there is nothing to watch, so the guide is marked
  // complete explicitly instead of waiting for a playback event.
  const handleCompleteWithoutMedia = useCallback(() => {
    onComplete?.();
    onOpenChange(false);
  }, [onComplete, onOpenChange]);

  const togglePlay = useCallback(async () => {
    if (!videoEl) return;
    if (!videoEl.paused) {
      videoEl.pause();
      setIsPlaying(false);
      return;
    }
    try {
      await videoEl.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  }, [videoEl]);

  const handleLoadedMetadata = () => {
    setDuration(videoEl?.duration ?? 0);
  };

  const handleTimeUpdate = () => {
    if (!videoEl) return;
    const { currentTime: current, duration: total } = videoEl;
    setCurrentTime(current);
    if (Number.isFinite(total) && total > 0) {
      onProgress?.((current / total) * 100);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(duration);
    onEnded?.();
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      showCloseButton={false}
      className="sm:max-w-[840px] p-[16px] bg-[#FDFDFD] rounded-[16px]"
    >
      <div className="flex flex-col gap-[16px]">
        {/* Video Area */}
        <div className="relative aspect-video rounded-[16px] overflow-hidden bg-black group">
          {hasMedia ? (
            <>
              <video
                ref={setVideoEl}
                src={videoUrl}
                className="w-full h-full object-contain"
                playsInline
                preload="metadata"
                onLoadedMetadata={handleLoadedMetadata}
                onTimeUpdate={handleTimeUpdate}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={handleEnded}
                onError={() => setHasMediaError(true)}
                onClick={togglePlay}
              />

              {/* Overlay when paused or hovered */}
              <div
                className={cn(
                  "absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity cursor-pointer",
                  isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100",
                )}
                onClick={togglePlay}
              >
                <div className="size-[64px] rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                  {isPlaying ? (
                    <Pause size={32} variant="Bold" color="currentColor" />
                  ) : (
                    <Play size={32} variant="Bold" color="currentColor" />
                  )}
                </div>
              </div>

              {/* Bottom Controls Overlay */}
              <div className="absolute bottom-0 left-0 w-full p-[24px] bg-gradient-to-t from-black/80 to-transparent flex flex-col gap-[12px]">
                <div className="flex items-center justify-between text-white text-[14px] font-medium">
                  <span>{title}</span>
                  <div className="flex items-center gap-[4px]">
                    <span>{formatTime(currentTime)}</span>
                    <span>/</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="h-[8px] bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-100"
                    style={{
                      width: `${
                        duration > 0
                          ? Math.min(100, (currentTime / duration) * 100)
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </>
          ) : (
            /* Designed empty state — no real media source is available yet */
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-[12px]">
              {thumbnail && (
                <Image
                  src={thumbnail}
                  alt=""
                  fill
                  className="object-cover opacity-40"
                  sizes="840px"
                />
              )}
              <div className="absolute inset-0 bg-black/50" />
              <div className="relative flex flex-col items-center gap-[12px] px-[24px] text-center">
                <div className="size-[64px] rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                  <Video size={32} variant="Linear" color="currentColor" />
                </div>
                <p className="text-[16px] font-semibold text-white">
                  Video coming soon
                </p>
                <p className="text-[14px] leading-[20px] text-white/70 max-w-[380px]">
                  This guide video has not been uploaded yet. Mark it as
                  completed to keep moving.
                </p>
                <Button
                  type="button"
                  variant="app-primary"
                  onClick={handleCompleteWithoutMedia}
                  data-testid="video-mark-completed"
                  leftIcon={<TickCircle size={18} variant="Bold" color="currentColor" />}
                >
                  {isCompleted ? "Completed" : "Mark as completed"}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[12px]">
            <div className="size-[34px] relative shrink-0">
              <Image
                src={SOLUDESK_ICON}
                alt="SoluDesks"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-[16px] font-semibold text-[#202020] tracking-[-0.32px]">
              {title}
            </span>
          </div>

          <div className="flex items-center gap-[12px]">
            <button
              type="button"
                onClick={() => onOpenChange(false)}
                className="text-[#B6B6B6] hover:text-[#202020] transition-colors"
            >
              <CloseCircle size={32} variant="Bulk" color="currentColor" />
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
