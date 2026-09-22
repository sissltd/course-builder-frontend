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
import { useCreateCategoryMutation } from "@/modules/categories/api/categoriesApi";
import {
  TRACK_PREFERENCE_OPTIONS,
  TrackPreference,
  type CategoryWriteRequest,
} from "@/modules/categories/types";
import { CategoryIconPicker } from "./CategoryIconPicker";

interface CreateCategoryModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const EMPTY_FORM = {
  name: "",
  trackPreference: "" as TrackPreference | "",
  beginnerPrice: "",
  intermediatePrice: "",
  advancedPrice: "",
  icon: "",
};

type FormState = typeof EMPTY_FORM;

export const CreateCategoryModal = ({ isOpen, onOpenChange }: CreateCategoryModalProps) => {
  const [createCategory, { isLoading }] = useCreateCategoryMutation();
  const [form, setForm] = React.useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleClose = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    onOpenChange(false);
  };

  /**
   * Client-side pass first so an obviously incomplete form doesn't cost a round
   * trip; server field errors then merge over the top.
   */
  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Category name is required";
    if (!form.beginnerPrice.trim()) next.creator_price_beginner = "Required";
    if (!form.intermediatePrice.trim()) next.creator_price_intermediate = "Required";
    if (!form.advancedPrice.trim()) next.creator_price_advanced = "Required";
    return next;
  };

  const handleCreateCategory = async () => {
    const localErrors = validate();
    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      return;
    }

    const payload: CategoryWriteRequest = {
      name: form.name.trim(),
      creator_price_beginner: form.beginnerPrice.trim(),
      creator_price_intermediate: form.intermediatePrice.trim(),
      creator_price_advanced: form.advancedPrice.trim(),
    };
    if (form.trackPreference) {
      payload.track_preference = form.trackPreference;
    }
    // Optional, so an unset icon is omitted rather than sent as an empty string.
    if (form.icon) {
      payload.icon = form.icon;
    }

    try {
      await createCategory(payload).unwrap();
      toast.success("Category created successfully", {
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
      toast.error(message ?? "Could not create category");
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
      className="sm:max-w-[600px] rounded-[16px] border border-sd-grey-3 p-[20px]"
      title={
        <div className="flex items-start justify-between gap-[16px]">
          <span className="text-[20px] font-semibold text-sd-grey-12 leading-[32px] tracking-[-0.4px]">
            Add new category
          </span>
          <AppButton
            type="button"
            variant="outline"
            size="icon-sm"
            className="size-[32px] rounded-[10px] border-sd-grey-3 bg-white text-sd-grey-9 hover:bg-sd-grey-2"
            onClick={handleClose}
            aria-label="Close create category modal"
          >
            <X size={18} />
          </AppButton>
        </div>
      }
    >
      <div className="flex flex-col gap-[20px]">
        <FormInput
          name="categoryName"
          label="Category name"
          placeholder="Enter name"
          required
          value={form.name}
          error={errors.name}
          disabled={isLoading}
          onChange={(event) => setField("name", event.target.value)}
          className="h-[42px] bg-white"
        />

        <FormSelect
          name="trackPreference"
          label="Track preference"
          value={form.trackPreference}
          onValueChange={(value) =>
            setField("trackPreference", value as TrackPreference)
          }
          options={TRACK_PREFERENCE_OPTIONS.map((option) => ({
            label: option.label,
            value: option.value,
          }))}
          placeholder="Select track"
          triggerClassName="h-[44px] bg-white text-sd-grey-12"
        />

        <div className="flex flex-col gap-[12px]">
          <span className="text-[14px] font-normal text-sd-grey-12 tracking-[-0.28px] leading-[20px]">
            Payout price level <span className="text-sd-danger">*</span>
          </span>
          <div className="grid grid-cols-3 gap-[14px]">
            <FormInput
              name="beginnerPrice"
              label="Beginner"
              placeholder="0.00"
              value={form.beginnerPrice}
              error={errors.creator_price_beginner}
              disabled={isLoading}
              onChange={(event) => setField("beginnerPrice", event.target.value)}
              className="h-[44px] bg-white"
            />
            <FormInput
              name="intermediatePrice"
              label="Intermediate"
              placeholder="0.00"
              value={form.intermediatePrice}
              error={errors.creator_price_intermediate}
              disabled={isLoading}
              onChange={(event) => setField("intermediatePrice", event.target.value)}
              className="h-[44px] bg-white"
            />
            <FormInput
              name="advancedPrice"
              label="Advanced"
              placeholder="0.00"
              value={form.advancedPrice}
              error={errors.creator_price_advanced}
              disabled={isLoading}
              onChange={(event) => setField("advancedPrice", event.target.value)}
              className="h-[44px] bg-white"
            />
          </div>
        </div>

        <div className="flex flex-col gap-[12px]">
          <span className="text-[14px] font-normal text-sd-grey-12 tracking-[-0.28px] leading-[20px]">
            Select category icon
          </span>
          <CategoryIconPicker
            value={form.icon}
            onChange={(icon) => setField("icon", icon)}
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
            onClick={handleCreateCategory}
          >
            {isLoading ? "Adding..." : "Add category"}
          </AppButton>
        </div>
      </div>
    </Modal>
  );
};
