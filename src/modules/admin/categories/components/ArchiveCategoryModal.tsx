"use client";

import React from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "@/components/shared/Modal";
import { Button as AppButton } from "@/components/shared/Button";
import { normalizeApiError } from "@/lib/api/errors";
import {
  useArchiveCategoryMutation,
  useUnarchiveCategoryMutation,
} from "@/modules/categories/api/categoriesApi";
import type { Category } from "@/modules/categories/types";

export type ArchiveMode = "archive" | "unarchive";

interface ArchiveCategoryModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  mode?: ArchiveMode;
}

const COPY: Record<
  ArchiveMode,
  { title: string; body: string; confirm: string; success: string; failure: string }
> = {
  archive: {
    title: "Archive this category",
    body: "Are you sure you want to archive this category? Once archived, creators will no longer be able to view or create courses in this category.",
    confirm: "Archive category",
    success: "Category archived",
    failure: "Could not archive category",
  },
  unarchive: {
    title: "Unarchive this category",
    body: "Are you sure you want to unarchive this category? Creators will be able to view and create courses in it again.",
    confirm: "Unarchive category",
    success: "Category unarchived",
    failure: "Could not unarchive category",
  },
};

export const ArchiveCategoryModal = ({
  isOpen,
  onOpenChange,
  category,
  mode = "archive",
}: ArchiveCategoryModalProps) => {
  const [archiveCategory, { isLoading: isArchiving }] = useArchiveCategoryMutation();
  const [unarchiveCategory, { isLoading: isUnarchiving }] = useUnarchiveCategoryMutation();

  const isLoading = isArchiving || isUnarchiving;
  const copy = COPY[mode];

  const handleClose = () => {
    if (isLoading) return;
    onOpenChange(false);
  };

  const handleConfirm = async () => {
    if (!category) return;
    try {
      if (mode === "archive") {
        await archiveCategory(category.id).unwrap();
      } else {
        await unarchiveCategory(category.id).unwrap();
      }
      toast.success(copy.success);
      onOpenChange(false);
    } catch (err) {
 
      const { message } = normalizeApiError(err as never);
      toast.error(message ?? copy.failure);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
      showCloseButton={false}
      className="sm:max-w-[366px] rounded-[16px] border border-sd-grey-3 p-[20px]"
      title={
        <div className="flex items-start justify-between gap-[16px]">
          <span className="text-[20px] font-semibold text-sd-grey-12 leading-[32px] tracking-[-0.4px]">
            {copy.title}
          </span>
          <AppButton
            type="button"
            variant="outline"
            size="icon-sm"
            className="size-[32px] rounded-[10px] border-sd-grey-3 bg-white text-sd-grey-9 hover:bg-sd-grey-2"
            onClick={handleClose}
            aria-label="Close archive category modal"
          >
            <X size={18} />
          </AppButton>
        </div>
      }
    >
      <div className="flex flex-col gap-[22px]">
        <p className="max-w-[310px] text-[14px] font-normal text-sd-grey-11 leading-[20px] tracking-[-0.28px]">
          {copy.body}
        </p>

        <div className="flex gap-[12px]">
          <AppButton
            type="button"
            variant="app-secondary"
            size="app"
            disabled={isLoading}
            onClick={handleConfirm}
            className="h-[44px] min-w-[133px] rounded-[10px] bg-[var(--sd-danger)] px-[20px] text-[14px] font-normal tracking-[-0.28px] hover:bg-[color-mix(in_srgb,var(--sd-danger),black_8%)]"
          >
            {isLoading ? "Working..." : copy.confirm}
          </AppButton>
          <AppButton
            type="button"
            variant="outline"
            size="app"
            disabled={isLoading}
            className="h-[44px] min-w-[133px] rounded-[10px] border-sd-grey-6 bg-white px-[24px] text-[14px] font-normal text-sd-grey-12"
            onClick={handleClose}
          >
            Cancel
          </AppButton>
        </div>
      </div>
    </Modal>
  );
};
