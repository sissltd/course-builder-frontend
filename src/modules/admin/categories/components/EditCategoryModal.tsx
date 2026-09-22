"use client";

import React from "react";
import { X } from "lucide-react";
import { TickCircle } from "iconsax-react";
import { toast } from "sonner";
import { Modal } from "@/components/shared/Modal";
import { Button as AppButton } from "@/components/shared/Button";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { normalizeApiError } from "@/lib/api/errors";
import { useUpdateCategoryMutation } from "@/modules/categories/api/categoriesApi";
import {
  TRACK_PREFERENCE_OPTIONS,
  TrackPreference,
  type Category,
  type UpdateCategoryRequest,
} from "@/modules/categories/types";
import { CategoryIconPicker } from "./CategoryIconPicker";

interface EditCategoryModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
}

export const EditCategoryModal = ({ isOpen, onOpenChange, category }: EditCategoryModalProps) => {
  const [updateCategory, { isLoading }] = useUpdateCategoryMutation();

  
  const [name, setName] = React.useState(category?.name ?? "");
  const [trackPreference, setTrackPreference] = React.useState<TrackPreference | "">(
    category?.track_preference ?? "",
  );
  const [beginnerPrice, setBeginnerPrice] = React.useState(
    category?.creator_price_beginner ?? "",
  );
  const [intermediatePrice, setIntermediatePrice] = React.useState(
    category?.creator_price_intermediate ?? "",
  );
  const [advancedPrice, setAdvancedPrice] = React.useState(
    category?.creator_price_advanced ?? "",
  );
  const [icon, setIcon] = React.useState(category?.icon ?? "");
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleClose = () => {
    setErrors({});
    onOpenChange(false);
  };

  const handleSaveChanges = async () => {
    if (!category) return;

    if (!name.trim()) {
      setErrors({ name: "Category name is required" });
      return;
    }

    /*
      Built as a diff so a PATCH carries only what actually changed. Everything
      with an editor is compared against the server value, `icon` included — any
      field left out here would be silently unsaveable.
    */
    const payload: UpdateCategoryRequest = {};
    if (name.trim() !== category.name) payload.name = name.trim();
    if (beginnerPrice !== category.creator_price_beginner) {
      payload.creator_price_beginner = beginnerPrice;
    }
    if (intermediatePrice !== category.creator_price_intermediate) {
      payload.creator_price_intermediate = intermediatePrice;
    }
    if (advancedPrice !== category.creator_price_advanced) {
      payload.creator_price_advanced = advancedPrice;
    }
    if (trackPreference && trackPreference !== category.track_preference) {
      payload.track_preference = trackPreference;
    }
    if (icon !== (category.icon ?? "")) {
      payload.icon = icon;
    }

    if (Object.keys(payload).length === 0) {
      toast.info("No changes to save");
      return;
    }

    try {
      await updateCategory({ id: category.id, body: payload }).unwrap();
      toast.success("Category updated successfully", {
        icon: (
          <div className="flex size-[40px] items-center justify-center rounded-full bg-[var(--sd-success-bg)]">
            <TickCircle variant="Bold" size={20} color="var(--sd-success)" />
          </div>
        ),
        classNames: {
          toast:
            "min-h-[72px] w-[356px] rounded-[16px] border border-sd-grey-3 bg-white px-[16px] py-[12px] shadow-[0px_8px_20px_0px_rgba(0,0,0,0.14)]",
          title:
            "text-[14px] font-normal text-sd-grey-12 leading-[20px] tracking-[-0.28px]",
          icon: "!mr-[10px] !size-auto",
        },
      });
      handleClose();
    } catch (err) {
      const { fieldErrors, message } = normalizeApiError(err as never);
      setErrors(fieldErrors);
      toast.error(message ?? "Could not update category");
    }
  };

  if (!category) return null;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
      showCloseButton={false}
      className="sm:max-w-[600px] rounded-[16px] border border-sd-grey-3 p-[20px]"
      title={
        <div className="flex items-start justify-between gap-[16px]">
          <span className="text-[20px] font-semibold text-sd-grey-12 leading-[32px] tracking-[-0.4px]">
            Edit category
          </span>
          <AppButton
            type="button"
            variant="outline"
            size="icon-sm"
            className="size-[32px] rounded-[10px] border-sd-grey-3 bg-white text-sd-grey-9 hover:bg-sd-grey-2"
            onClick={handleClose}
            aria-label="Close edit category modal"
          >
            <X size={18} />
          </AppButton>
        </div>
      }
    >
      <div className="flex flex-col gap-[20px]">
        <FormInput
          name="editCategoryName"
          label="Category name"
          required
          value={name}
          error={errors.name}
          disabled={isLoading}
          onChange={(event) => setName(event.target.value)}
          className="h-[42px] bg-white"
        />

        <FormSelect
          name="editTrackPreference"
          label="Track preference"
          value={trackPreference}
          onValueChange={(value) => setTrackPreference(value as TrackPreference)}
          options={TRACK_PREFERENCE_OPTIONS.map((option) => ({
            label: option.label,
            value: option.value,
          }))}
          placeholder="Select track"
          triggerClassName="h-[44px] bg-white text-sd-grey-12"
        />

        <div className="flex flex-col gap-[12px]">
          <span className="text-[14px] font-normal text-sd-grey-12 tracking-[-0.28px] leading-[20px]">
            Payout price level
          </span>
          <div className="grid grid-cols-3 gap-[14px]">
            <FormInput
              name="editBeginnerPrice"
              label="Beginner"
              value={beginnerPrice}
              error={errors.creator_price_beginner}
              disabled={isLoading}
              onChange={(event) => setBeginnerPrice(event.target.value)}
              className="h-[44px] bg-white"
            />
            <FormInput
              name="editIntermediatePrice"
              label="Intermediate"
              value={intermediatePrice}
              error={errors.creator_price_intermediate}
              disabled={isLoading}
              onChange={(event) => setIntermediatePrice(event.target.value)}
              className="h-[44px] bg-white"
            />
            <FormInput
              name="editAdvancedPrice"
              label="Advanced"
              value={advancedPrice}
              error={errors.creator_price_advanced}
              disabled={isLoading}
              onChange={(event) => setAdvancedPrice(event.target.value)}
              className="h-[44px] bg-white"
            />
          </div>
        </div>

        <div className="flex flex-col gap-[12px]">
          <span className="text-[14px] font-normal text-sd-grey-12 tracking-[-0.28px] leading-[20px]">
            Select category icon
          </span>
          <CategoryIconPicker
            value={icon}
            onChange={setIcon}
            disabled={isLoading}
          />
        </div>

        <div className="flex gap-[12px] pt-[22px]">
          <AppButton
            type="button"
            variant="outline"
            size="app"
            className="h-[44px] min-w-[132px] rounded-[10px] border-sd-grey-6 bg-white px-[24px] text-[14px] font-normal text-sd-grey-12"
            onClick={handleClose}
          >
            Cancel
          </AppButton>
          <AppButton
            type="button"
            variant="app-primary"
            size="app"
            disabled={isLoading}
            className="h-[44px] min-w-[133px] rounded-[10px] px-[24px] text-[14px] font-normal tracking-[-0.28px]"
            onClick={handleSaveChanges}
          >
            {isLoading ? "Saving..." : "Save changes"}
          </AppButton>
        </div>
      </div>
    </Modal>
  );
};
