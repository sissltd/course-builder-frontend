"use client";

import React from "react";
import { X } from "lucide-react";
import { Modal } from "@/components/shared/Modal";
import { Button as AppButton } from "@/components/shared/Button";

interface ArchiveCategoryModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  categoryName?: string;
}

export const ArchiveCategoryModal = ({
  isOpen,
  onOpenChange,
  categoryName,
}: ArchiveCategoryModalProps) => {
  const handleClose = () => {
    onOpenChange(false);
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
            Archive this category
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
          Are you sure you want to archive this category? Once archived, creators will no longer be able to view or create course in this category
          {categoryName ? `.` : "."}
        </p>

        <div className="flex gap-[12px]">
          <AppButton
            type="button"
            variant="app-secondary"
            size="app"
            className="h-[44px] min-w-[133px] rounded-[10px] bg-[var(--sd-danger)] px-[20px] text-[14px] font-normal tracking-[-0.28px] hover:bg-[color-mix(in_srgb,var(--sd-danger),black_8%)]"
          >
            Archive category
          </AppButton>
          <AppButton
            type="button"
            variant="outline"
            size="app"
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
