"use client";

import React, { useState, useRef } from "react";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import { Button } from "@/components/shared/Button";
import { FormInput } from "@/components/form/FormInput";
import { useAppDispatch, useAppSelector } from "@/redux";
import { updateCourseInformation } from "@/redux/slices/courseBuilderSlice";
import { syncSetThumbnail } from "@/redux/slices/builderSync";
import { useUploadFile } from "@/modules/shared/uploads/hooks/useUploadFile";

interface ThumbnailStepProps {
  onNext?: () => void;
  onBack?: () => void;
}

export const ThumbnailStep = ({ onNext, onBack }: ThumbnailStepProps) => {
  const dispatch = useAppDispatch();
  const savedThumbnail = useAppSelector((state) => state.courseBuilder.courseInformation.thumbnail);
  const [thumbnail, setThumbnail] = useState<string | null>(savedThumbnail ?? null);
  const [externalUrl, setExternalUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { upload, isUploading, progress, error: uploadError, reset: resetUpload } = useUploadFile();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await upload(file, { folder: "general" });
      setThumbnail(res.file_url);
      dispatch(updateCourseInformation({ thumbnail: res.file_url }));
      dispatch(syncSetThumbnail({ source: "UPLOAD", file: res.file_url }));
      resetUpload();
    } catch {
      // error handled by useUploadFile
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemove = () => {
    setThumbnail(null);
    dispatch(updateCourseInformation({ thumbnail: "" }));
  };

  const handleSave = () => {
    onNext?.();
  };

  const handleExternalUrlSave = () => {
    if (externalUrl.trim()) {
      setThumbnail(externalUrl);
      dispatch(updateCourseInformation({ thumbnail: externalUrl }));
      dispatch(syncSetThumbnail({ source: "LINK", externalUrl: externalUrl }));
      setExternalUrl("");
    }
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

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Upload Area */}
      <div className="bg-[rgba(240,240,240,0.8)] rounded-[16px] p-[16px] w-full">
        {isUploading ? (
          <div className="bg-[#FCFDFF] border-2 border-[#0A60E1] border-dashed rounded-[8px] h-[289px] flex flex-col items-center justify-center p-[24px] w-full gap-[16px]">
            <div className="w-[48px] h-[48px] border-4 border-[#E8E8E8] border-t-[#0A60E1] rounded-full animate-spin" />
            <p className="text-[16px] font-medium text-[#202020]">Uploading... {progress}%</p>
            <div className="w-[280px] h-[6px] bg-[#E8E8E8] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0A60E1] rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[14px] text-[#636363]">Please do not close this page</p>
          </div>
        ) : thumbnail ? (
          <div className="bg-[#FCFDFF] border-2 border-[#D9D9D9] rounded-[8px] flex flex-col items-center justify-center p-[24px] w-full gap-[12px]">
            <img
              src={thumbnail}
              alt="Thumbnail preview"
              className="max-h-[200px] max-w-full rounded-[8px] object-contain"
            />
            <div className="flex items-center gap-[12px]">
              <Button
                type="button"
                variant="app-outline"
                className="h-[36px] px-[16px] text-[13px] text-[#0A60E1] border-[#0A60E1]"
                onClick={() => fileInputRef.current?.click()}
              >
                Replace
              </Button>
              <Button
                type="button"
                variant="app-outline"
                isGhost
                className="h-[36px] px-[16px] text-[13px] text-[#FF6B00]"
                onClick={handleRemove}
              >
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="bg-[#FCFDFF] border-2 border-[#D9D9D9] border-dashed rounded-[8px] h-[289px] flex flex-col items-center justify-center p-[24px] w-full cursor-pointer hover:border-[#0A60E1] transition-colors"
          >
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
          </div>
        )}
      </div>

      {uploadError && (
        <p className="text-[13px] text-[#FF5025] w-full">{uploadError}</p>
      )}

      {/* External URL */}
      <div className="flex gap-[12px] items-end w-full">
        <div className="flex-1">
          <FormInput
            name="externalUrl"
            label="Or paste an image URL"
            placeholder="https://example.com/image.jpg"
            value={externalUrl}
            onChange={(e) => setExternalUrl(e.target.value)}
          />
        </div>
        <Button
          type="button"
          variant="app-primary"
          className="h-[44px] px-[24px] text-[14px] shrink-0 rounded-[8px]"
          onClick={handleExternalUrlSave}
          disabled={!externalUrl.trim()}
        >
          Add
        </Button>
      </div>

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
