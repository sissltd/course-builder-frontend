"use client";

import React, { useState } from "react";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import { Button } from "@/components/shared/Button";
import { AddMediaModal } from "./AddMediaModal";
import { useAppDispatch, useAppSelector } from "@/redux";
import { updateCourseInformation } from "@/redux/slices/courseBuilderSlice";

interface ThumbnailStepProps {
  onNext?: () => void;
  onBack?: () => void;
}

export const ThumbnailStep = ({ onNext, onBack }: ThumbnailStepProps) => {
  const dispatch = useAppDispatch();
  const savedThumbnail = useAppSelector((state) => state.courseBuilder.courseInformation.thumbnail);
  const [thumbnail, setThumbnail] = useState<string | null>(savedThumbnail ?? null);
  const [showMediaModal, setShowMediaModal] = useState(false);

  const handleMediaConfirm = (url: string, source: string) => {
    setThumbnail(url);
    dispatch(updateCourseInformation({ thumbnail: url }));
    setShowMediaModal(false);
  };

  const handleRemove = () => {
    setThumbnail(null);
    dispatch(updateCourseInformation({ thumbnail: "" }));
  };

  const handleSave = () => {
    if (thumbnail) {
      dispatch(updateCourseInformation({ thumbnail }));
    }
    onNext?.();
  };

  return (
    <div className="w-[739px] max-w-full bg-[#FDFDFD] px-[24px] py-[40px] flex flex-col gap-[40px] mx-auto pb-[100px]">
      {/* Title Section */}
      <div className="flex flex-col gap-[12px] w-full">
        <h2 className="text-[24px] font-medium text-[#202020] leading-[32px] tracking-[-0.48px]">
          Thumbnail
        </h2>
        <p className="text-[16px] text-[#606060] leading-[24px] font-normal">
          Upload a cover image for this course
        </p>
      </div>

      {/* Upload Area */}
      <div className="bg-[rgba(240,240,240,0.8)] rounded-[16px] p-[16px] w-full">
        <div
          onClick={() => setShowMediaModal(true)}
          className="bg-[#FCFDFF] border-2 border-[#D9D9D9] border-dashed rounded-[8px] h-[289px] flex flex-col items-center justify-center p-[24px] w-full cursor-pointer hover:border-[#0A60E1] transition-colors"
        >
          {thumbnail ? (
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <img
                src={thumbnail}
                alt="Thumbnail preview"
                className="max-h-[200px] max-w-full rounded-[8px] object-contain"
              />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleRemove(); }}
                className="mt-[12px] text-[14px] text-[#FF5025] underline hover:text-[#d9441f] transition-colors"
              >
                Remove image
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-[8px] text-center w-full">
              <p className="text-[20px] font-medium text-[#202020] leading-[28px]">
                Add Media
              </p>
              <p className="text-[14px] text-[#636363] tracking-[-0.28px] leading-[20px]">
                Drag or <span className="text-[#0a60e1]">click to upload</span> your cover Image file
              </p>
              <p className="text-[14px] text-[#202020] tracking-[-0.28px] leading-[20px]">
                (Jpeg, png minimum size: 1280 × 720 pixels (16:9 aspect ratio))
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Learn more link */}
      <button
        type="button"
        onClick={() => setShowMediaModal(true)}
        className="text-[16px] text-[#606060] leading-[24px] font-normal text-left hover:text-[#0A60E1] transition-colors cursor-pointer"
      >
        Learn more about updating your cover image
      </button>

      {/* Add Media Modal */}
      <AddMediaModal
        isOpen={showMediaModal}
        onOpenChange={setShowMediaModal}
        mediaType="image"
        onConfirm={handleMediaConfirm}
      />

      {/* Footer Navigation */}
      <div className="flex items-center justify-between w-full pt-[24px] border-t border-[#F0F0F0]">
        <Button
          variant="app-outline"
          onClick={onBack}
          leftIcon={<ArrowLeft2 size={24} variant="Linear" color="#0A60E1" />}
        >
          Go back
        </Button>
        <Button
          variant="app-primary"
          onClick={handleSave}
          rightIcon={<ArrowRight2 size={24} variant="Linear" color="#FFFFFF" />}
        >
          Save & continue
        </Button>
      </div>
    </div>
  );
};
