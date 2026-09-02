"use client";

import React, { useRef, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { useUploadFile } from "@/modules/shared/uploads/hooks/useUploadFile";
import type { PresignResponse } from "@/lib/api/types";

const DEFAULT_ACCEPT = "image/*,video/*,.pdf,.doc,.docx";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileCategory(type: string): "image" | "video" | "document" {
  if (type.startsWith("image/")) return "image";
  if (type.startsWith("video/")) return "video";
  return "document";
}

const DOCUMENT_ICON = (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8C8C8C" strokeWidth="1.5">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

interface FileInputProps {
  accept?: string;
  folder?: string;
  value?: File | null;
  onChange?: (file: File | null) => void;
  onUploadComplete?: (result: PresignResponse) => void;
  preview?: boolean;
  disabled?: boolean;
  className?: string;
}

export function FileInput({
  accept = DEFAULT_ACCEPT,
  folder,
  value,
  onChange,
  onUploadComplete,
  preview = true,
  disabled = false,
  className,
}: FileInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const { upload, isUploading, progress, error } = useUploadFile();

  const previewUrl = useMemo(() => {
    if (!value || !value.type.startsWith("image/")) return null;
    return URL.createObjectURL(value);
  }, [value]);

  const handleFile = useCallback(
    (file: File) => {
      onChange?.(file);

      if (onUploadComplete) {
        upload(file, { folder }).then(onUploadComplete);
      }
    },
    [onChange, onUploadComplete, upload, folder],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleClick = () => {
    if (!disabled) inputRef.current?.click();
  };

  const category = value ? getFileCategory(value.type) : null;

  return (
    <div className={cn("w-full", className)}>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleClick();
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "border-2 border-dashed rounded-[8px] flex flex-col items-center justify-center p-[24px] cursor-pointer transition-colors",
          isDragOver
            ? "border-[#0063EF] bg-[#F5F9FF]"
            : "border-[#D9D9D9] hover:border-[#0063EF]",
          disabled && "opacity-50 cursor-not-allowed",
          value ? "min-h-[120px]" : "min-h-[188px]",
        )}
      >
        {value && preview ? (
          <div className="flex flex-col items-center gap-[8px]">
            {category === "image" && previewUrl ? (
              <Image
                src={previewUrl}
                alt={value.name}
                width={120}
                height={120}
                className="max-h-[120px] max-w-full rounded-[4px] object-contain"
              />
            ) : category === "video" ? (
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0063EF"
                strokeWidth="2"
              >
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" />
              </svg>
            ) : (
              DOCUMENT_ICON
            )}
            <span className="text-[12px] text-[#606060] max-w-[200px] truncate">
              {value.name}
            </span>
            <span className="text-[11px] text-[#8C8C8C]">
              {formatFileSize(value.size)}
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-[16px] text-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8C8C8C"
              strokeWidth="1.5"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
            <div>
              <p className="text-[14px] text-[#202020] font-medium">
                Click or drag to upload
              </p>
              <p className="text-[12px] text-[#8C8C8C] mt-[4px]">
                Images, videos, or documents
              </p>
            </div>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleInputChange}
          disabled={disabled}
        />
      </div>

      {isUploading && (
        <div className="mt-[12px] flex flex-col gap-[6px]">
          <Progress value={progress} className="h-[6px]" />
          <span className="text-[11px] text-[#8C8C8C] text-right">
            {progress}%
          </span>
        </div>
      )}

      {error && (
        <p className="mt-[8px] text-[12px] text-red-500 text-center">
          {error}
        </p>
      )}
    </div>
  );
}
