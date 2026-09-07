"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { XIcon } from "lucide-react";
import { CloseCircle } from "iconsax-react";
import { Button } from "@/components/shared/Button";

interface CourseRejectModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  courseTitle?: string;
  courseCount?: number;
  isLoading?: boolean;
  onConfirm: (summary: string) => Promise<void> | void;
}

export const CourseRejectModal: React.FC<CourseRejectModalProps> = ({
  isOpen,
  onOpenChange,
  courseTitle,
  courseCount,
  isLoading = false,
  onConfirm,
}) => {
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary.trim()) {
      setError("Please provide a reason or actionable feedback for rejection.");
      return;
    }
    setError("");
    await onConfirm(summary.trim());
    setSummary("");
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!isLoading) {
          setError("");
          if (!open) setSummary("");
          onOpenChange(open);
        }
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100vw-32px)] gap-0 rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 p-[24px] shadow-[0px_8px_32px_rgba(0,0,0,0.12)] sm:max-w-[500px]"
      >
        <div className="flex items-start justify-between gap-[16px]">
          <div className="flex items-center gap-[10px]">
            <div className="flex size-[36px] shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
              <CloseCircle size={22} variant="Linear" color="currentColor" />
            </div>
            <DialogHeader className="gap-[4px] text-left">
              <DialogTitle className="text-[18px] font-semibold leading-[24px] text-sd-grey-12">
                Reject Course
              </DialogTitle>
              <DialogDescription className="text-[13px] font-normal leading-[18px] text-sd-grey-11">
                {courseCount && courseCount > 1
                  ? `Rejecting ${courseCount} courses and returning them to Draft.`
                  : courseTitle
                  ? `Reverting "${courseTitle}" to Draft for creator revisions.`
                  : "Reverting course to Draft for creator revisions."}
              </DialogDescription>
            </DialogHeader>
          </div>

          <DialogClose asChild>
            <button
              type="button"
              disabled={isLoading}
              className="flex size-[32px] shrink-0 items-center justify-center rounded-[8px] border border-sd-grey-3 text-sd-grey-11 transition-colors hover:bg-sd-grey-2 hover:text-sd-grey-12 cursor-pointer disabled:opacity-50"
              aria-label="Close"
            >
              <XIcon size={18} />
            </button>
          </DialogClose>
        </div>

        <form onSubmit={handleSubmit} className="mt-[20px] flex flex-col gap-[16px]">
          <div className="flex flex-col gap-[6px]">
            <label className="text-[13px] font-medium leading-[18px] text-sd-grey-12">
              Rejection Feedback <span className="text-red-500">*</span>
            </label>
            <p className="text-[12px] text-sd-grey-11">
              Provide clear, actionable feedback explaining why the course was rejected so the creator knows what corrections to make.
            </p>
            <textarea
              value={summary}
              onChange={(e) => {
                setSummary(e.target.value);
                if (error) setError("");
              }}
              rows={4}
              disabled={isLoading}
              placeholder="e.g., Needs clearer module learning objectives and accurate audio captions..."
              className="w-full resize-none rounded-[8px] border border-sd-grey-4 bg-white p-[12px] text-[14px] leading-[20px] text-sd-grey-12 outline-none transition-colors placeholder:text-sd-muted-text focus:border-red-500 disabled:opacity-50"
            />
            {error && <span className="text-[12px] font-medium text-red-500">{error}</span>}
          </div>

          <div className="flex items-center justify-end gap-[10px] pt-[8px]">
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={() => onOpenChange(false)}
              className="h-[40px] px-[18px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !summary.trim()}
              className="h-[40px] bg-red-600 px-[20px] text-white hover:bg-red-700 disabled:opacity-50"
            >
              {isLoading ? "Rejecting..." : "Confirm Rejection"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
