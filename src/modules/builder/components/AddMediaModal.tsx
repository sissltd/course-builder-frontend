"use client";

import React, { useState, useRef } from "react";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/shared/Button";
import { cn } from "@/lib/utils";

type MediaSource = "upload" | "drive" | "youtube" | "dropbox";

interface AddMediaModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mediaType: "image" | "video" | "embed";
  onConfirm: (url: string, source: MediaSource) => void;
}

const SOURCE_BUTTONS: { id: MediaSource; label: string }[] = [
  { id: "upload", label: "Upload" },
  { id: "drive", label: "Drive" },
  { id: "youtube", label: "YouTube" },
  { id: "dropbox", label: "Dropbox" },
];

export const AddMediaModal = ({ isOpen, onOpenChange, mediaType, onConfirm }: AddMediaModalProps) => {
  const [activeSource, setActiveSource] = useState<MediaSource>("upload");
  const [linkUrl, setLinkUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const title = mediaType === "image" ? "Add image" : mediaType === "video" ? "Add video" : "Add embed";
  const description = `Add your ${mediaType} or video file.`;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(f);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) {
      setFile(f);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(f);
    }
  };

  const handleSubmit = () => {
    if (activeSource === "upload" && preview) {
      onConfirm(preview, activeSource);
    } else if (linkUrl.trim()) {
      onConfirm(linkUrl.trim(), activeSource);
    }
    handleClose();
  };

  const handleClose = () => {
    setActiveSource("upload");
    setLinkUrl("");
    setFile(null);
    setPreview(null);
    onOpenChange(false);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={handleClose} className="sm:max-w-[500px] p-0 gap-0" showCloseButton={false}>
      {/* Header */}
      <div className="flex items-start justify-between px-[16px] pt-[20px] pb-[16px]">
        <div className="flex flex-col gap-[4px]">
          <h2 className="text-[20px] font-semibold text-[#202020] leading-[28px]">{title}</h2>
          <p className="text-[14px] text-[#606060] leading-[20px]">{description}</p>
        </div>
        <button type="button" onClick={handleClose} className="size-[24px] flex items-center justify-center shrink-0 hover:opacity-70">
          <img src="/images/close-line.svg" alt="Close" className="size-[16px]" />
        </button>
      </div>

      {/* Content */}
      <div className="px-[16px] pb-[16px]">
        <div className="border border-[#E8E8E8] rounded-[16px] p-[16px] bg-white">
          {/* Upload area (only for upload source) */}
          {activeSource === "upload" ? (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-[#D9D9D9] border-dashed rounded-[8px] h-[188px] flex flex-col items-center justify-center p-[24px] cursor-pointer hover:border-[#0A60E1] transition-colors"
            >
              {preview ? (
                <div className="flex flex-col items-center gap-[8px]">
                  {mediaType === "image" ? (
                    <img src={preview} alt="preview" className="max-h-[120px] max-w-full rounded-[4px] object-contain" />
                  ) : (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0A60E1" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg>
                  )}
                  <span className="text-[12px] text-[#606060]">{file?.name}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-[16px] text-center">
                  <img src="/images/image-bold.svg" alt="" className="size-[32px]" />
                  <div>
                    <p className="text-[14px] text-[#202020] font-medium">Click or drag to add {mediaType}</p>
                    <p className="text-[12px] text-[#606060] mt-[4px]">(Media size 1024x700px, Max 5mb)</p>
                  </div>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept={mediaType === "image" ? "image/*" : "video/*"} className="hidden" onChange={handleFileSelect} />
            </div>
          ) : (
            /* Link input for Drive/YouTube/Dropbox sources */
            <div className="border border-[#E8E8E8] rounded-[8px] h-[70px] flex items-center px-[16px]">
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder={`Paste your ${activeSource} link here`}
                className="w-full text-[14px] text-[#202020] border-none outline-none focus:ring-0 bg-transparent placeholder:text-[#8C8C8C]"
              />
            </div>
          )}
        </div>

        {/* Source buttons */}
        <div className="flex gap-[12px] mt-[16px]">
          {SOURCE_BUTTONS.map((src) => (
            <button
              key={src.id}
              type="button"
              onClick={() => setActiveSource(src.id)}
              className={cn(
                "size-[48px] flex items-center justify-center rounded-[8px] border transition-all",
                activeSource === src.id
                  ? "border-[#0A60E1] bg-[#F5F9FF]"
                  : "border-[#E8E8E8] hover:border-[#D9D9D9]"
              )}
              title={src.label}
            >
              {src.id === "upload" && (
                <img src="/images/image-upload.svg" alt="Upload" className="size-[24px]" />
              )}
              {src.id === "drive" && (
                <img src="/images/drive.svg" alt="Drive" className="size-[24px]" />
              )}
              {src.id === "youtube" && (
                <img src="/images/youtube.svg" alt="YouTube" className="size-[24px]" />
              )}
              {src.id === "dropbox" && (
                <img src="/images/dropbox.svg" alt="Dropbox" className="size-[24px]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex gap-[12px] px-[16px] pb-[20px]">
        <Button variant="app-outline" className="flex-1 h-[44px]" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="app-primary"
          className="flex-1 h-[44px]"
          onClick={handleSubmit}
          disabled={activeSource === "upload" ? !preview : !linkUrl.trim()}
        >
          Add
        </Button>
      </div>
    </Modal>
  );
};
