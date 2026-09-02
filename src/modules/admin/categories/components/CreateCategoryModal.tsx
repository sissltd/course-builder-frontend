"use client";

import React from "react";
import { SquareTerminal, X } from "lucide-react";
import { TickCircle } from "iconsax-react";
import { toast } from "sonner";
import { Modal } from "@/components/shared/Modal";
import { Button as AppButton } from "@/components/shared/Button";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";

interface CreateCategoryModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const trackOptions = [
  { label: "Creator Preferred", value: "creator-preferred" },
  { label: "AI Preferred", value: "ai-preferred" },
  { label: "Open", value: "open" },
  { label: "Archive", value: "archive" },
];

export const CreateCategoryModal = ({ isOpen, onOpenChange }: CreateCategoryModalProps) => {
  const [categoryName, setCategoryName] = React.useState("");
  const [trackPreference, setTrackPreference] = React.useState("");
  const [beginnerPrice, setBeginnerPrice] = React.useState("₦0.00");
  const [intermediatePrice, setIntermediatePrice] = React.useState("₦0.00");
  const [advancedPrice, setAdvancedPrice] = React.useState("₦0.00");

  const handleClose = () => {
    setCategoryName("");
    setTrackPreference("");
    setBeginnerPrice("₦0.00");
    setIntermediatePrice("₦0.00");
    setAdvancedPrice("₦0.00");
    onOpenChange(false);
  };

  const handleCreateCategory = () => {
    toast.success("Category Created successfully", {
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
          value={categoryName}
          onChange={(event) => setCategoryName(event.target.value)}
          className="h-[42px] bg-white"
        />

        <FormSelect
          name="trackPreference"
          label="Track preference"
          value={trackPreference}
          onValueChange={setTrackPreference}
          options={trackOptions}
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
              value={beginnerPrice}
              onChange={(event) => setBeginnerPrice(event.target.value)}
              className="h-[44px] bg-white"
            />
            <FormInput
              name="intermediatePrice"
              label="Intermediate"
              value={intermediatePrice}
              onChange={(event) => setIntermediatePrice(event.target.value)}
              className="h-[44px] bg-white"
            />
            <FormInput
              name="advancedPrice"
              label="Advanced"
              value={advancedPrice}
              onChange={(event) => setAdvancedPrice(event.target.value)}
              className="h-[44px] bg-white"
            />
          </div>
        </div>

        <div className="flex flex-col gap-[12px]">
          <span className="text-[14px] font-normal text-sd-grey-12 tracking-[-0.28px] leading-[20px]">
            Select category icon
          </span>
          <AppButton
            type="button"
            variant="outline"
            size="icon"
            className="size-[48px] rounded-[12px] border-sd-grey-6 bg-white text-sd-grey-10 hover:bg-sd-grey-2"
            aria-label="Select category icon"
          >
            <SquareTerminal size={18} strokeWidth={1.7} />
          </AppButton>
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
            className="h-[44px] min-w-[133px] rounded-[10px] px-[24px] text-[14px] font-normal tracking-[-0.28px]"
            onClick={handleCreateCategory}
          >
            Add category
          </AppButton>
        </div>
      </div>
    </Modal>
  );
};
