"use client";

import React from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { SheetClose } from "@/components/ui/sheet";
import { SideDrawer } from "@/components/shared/SideDrawer";
import { Button as AppButton } from "@/components/shared/Button";
import { FormInput } from "@/components/form/FormInput";
import {
  CATEGORY_STATUS_LABELS,
  TRACK_PREFERENCE_LABELS,
  type Category,
} from "@/modules/categories/types";
import { formatCategoryDate, formatNaira } from "@/modules/categories/lib/format";
import { CategoryIcon } from "@/modules/categories/lib/categoryIcons";

interface CategoryDetailsDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  onEdit?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  canPrevious?: boolean;
  canNext?: boolean;
}

/**
 * Read-only. The drawer previously held an editable draft that nothing ever
 * saved; editing is what the footer button (and the row action menu) is for, so
 * the fields here are display-only.
 */
export const CategoryDetailsDrawer = ({
  isOpen,
  onOpenChange,
  category,
  onEdit,
  onPrevious,
  onNext,
  canPrevious = false,
  canNext = false,
}: CategoryDetailsDrawerProps) => {
  if (!category) return null;

  return (
    <SideDrawer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      showCloseButton={false}
      className="!w-full md:!w-[34%] md:!max-w-[34%]"
      title={
        <div className="flex items-center justify-between gap-[16px]">
          <span className="text-[22px] font-semibold text-sd-grey-12 leading-[32px] tracking-[-0.44px]">
            {category.name}
          </span>
          <div className="flex items-center gap-[10px]">
            <AppButton
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={onPrevious}
              disabled={!canPrevious}
              className="size-[32px] rounded-[10px] border-sd-grey-3 bg-white text-sd-grey-9 hover:bg-sd-grey-2"
              aria-label="Previous category"
            >
              <ChevronLeft size={18} />
            </AppButton>
            <AppButton
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={onNext}
              disabled={!canNext}
              className="size-[32px] rounded-[10px] border-sd-grey-3 bg-white text-sd-grey-9 hover:bg-sd-grey-2"
              aria-label="Next category"
            >
              <ChevronRight size={18} />
            </AppButton>
            <SheetClose asChild>
              <AppButton
                type="button"
                variant="outline"
                size="icon-sm"
                className="size-[32px] rounded-[10px] border-sd-grey-3 bg-white text-sd-grey-9 hover:bg-sd-grey-2"
                aria-label="Close category drawer"
              >
                <X size={18} />
              </AppButton>
            </SheetClose>
          </div>
        </div>
      }
      footer={
        <AppButton
          variant="app-primary"
          size="app"
          className="h-[44px] w-full rounded-[10px] text-[14px] font-normal tracking-[-0.28px]"
          onClick={onEdit}
        >
          Edit category
        </AppButton>
      }
    >
      <div className="flex flex-col gap-[20px]">
        <FormInput
          name="categoryName"
          label="Category name"
          value={category.name}
          readOnly
          className="h-[42px] bg-white"
        />

        <FormInput
          name="trackPreference"
          label="Track preference"
          value={
            TRACK_PREFERENCE_LABELS[category.track_preference] ??
            category.track_preference
          }
          readOnly
          className="h-[42px] bg-white"
        />

        <FormInput
          name="status"
          label="Status"
          value={CATEGORY_STATUS_LABELS[category.status] ?? category.status}
          readOnly
          className="h-[42px] bg-white"
        />

        <div className="flex flex-col gap-[12px]">
          <span className="text-[14px] font-normal text-sd-grey-12 tracking-[-0.28px] leading-[20px]">
            Payout price level
          </span>
          <div className="grid grid-cols-3 gap-[16px]">
            <FormInput
              name="beginnerPrice"
              label="Beginner"
              value={formatNaira(category.creator_price_beginner)}
              readOnly
              className="h-[42px] bg-white"
            />
            <FormInput
              name="intermediatePrice"
              label="Intermediate"
              value={formatNaira(category.creator_price_intermediate)}
              readOnly
              className="h-[42px] bg-white"
            />
            <FormInput
              name="advancedPrice"
              label="Advanced"
              value={formatNaira(category.creator_price_advanced)}
              readOnly
              className="h-[42px] bg-white"
            />
          </div>
        </div>

        <div className="flex flex-col gap-[12px]">
          <span className="text-[14px] font-normal text-sd-grey-12 tracking-[-0.28px] leading-[20px]">
            Total courses
          </span>
          <span className="text-[16px] font-medium leading-[24px] tracking-[-0.32px] text-sd-grey-12">
            {category.total_courses}
          </span>
        </div>

        <div className="flex flex-col gap-[12px]">
          <span className="text-[14px] font-normal text-sd-grey-12 tracking-[-0.28px] leading-[20px]">
            Date created
          </span>
          <span className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
            {formatCategoryDate(category.created_datetime)}
          </span>
        </div>

        <div className="flex flex-col gap-[12px]">
          <span className="text-[14px] font-normal text-sd-grey-12 tracking-[-0.28px] leading-[20px]">
            Category icon
          </span>
          {/* Read-only; icons are chosen through the footer's Edit category button. */}
          <div
            className="flex size-[48px] items-center justify-center rounded-[12px] border border-sd-grey-6 bg-white text-sd-grey-10"
            aria-label={`${category.name} icon`}
          >
            <CategoryIcon name={category.icon} size={18} strokeWidth={1.7} />
          </div>
        </div>
      </div>
    </SideDrawer>
  );
};
