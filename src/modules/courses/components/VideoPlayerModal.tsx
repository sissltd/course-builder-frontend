"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import { Modal } from "@/components/shared/Modal";
import { Play, Pause, CloseCircle } from "iconsax-react";
import { cn } from "@/lib/utils";

interface VideoPlayerModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  videoUrl?: string;
  thumbnail?: string;
}

export const VideoPlayerModal = ({
  isOpen,
  onOpenChange,
  title,
  videoUrl,
  thumbnail,
}: VideoPlayerModalProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setProgress((current / total) * 100);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
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
          <video
            ref={videoRef}
            src={videoUrl || "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"}
            className="w-full h-full object-contain"
            loop
            onTimeUpdate={handleTimeUpdate}
            onClick={togglePlay}
          />
          
          {/* Overlay when paused or hovered */}
          <div 
            className={cn(
               "absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity cursor-pointer",
               isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"
            )}
            onClick={togglePlay}
          >
            <div className="size-[64px] rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
              {isPlaying ? <Pause size={32} variant="Bold" color="currentColor" /> : <Play size={32} variant="Bold" color="currentColor" />}
            </div>
          </div>

          {/* Bottom Controls Overlay */}
          <div className="absolute bottom-0 left-0 w-full p-[24px] bg-gradient-to-t from-black/80 to-transparent flex flex-col gap-[12px]">
            <div className="flex items-center justify-between text-white text-[14px] font-medium">
              <span>{title}</span>
              <div className="flex items-center gap-[4px]">
                <span>{videoRef.current ? formatTime(videoRef.current.currentTime) : "00:00"}</span>
                <span>/</span>
                <span>{videoRef.current ? formatTime(videoRef.current.duration || 0) : "00:00"}</span>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="h-[8px] bg-white/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-100" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[12px]">
            <div className="size-[34px] relative">
               <Image src="/soludeskIcon.png" alt="Soludesk" fill className="object-contain" />
            </div>
            <span className="text-[16px] font-semibold text-[#202020] tracking-[-0.32px]">{title}</span>
          </div>

          <div className="flex items-center gap-[12px]">
            <button 
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
