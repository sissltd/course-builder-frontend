"use client";

import React from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "@/components/shared/Modal";
import { Button as AppButton } from "@/components/shared/Button";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { normalizeApiError } from "@/lib/api/errors";
import { useCreateTopicMutation } from "@/modules/topics/api/topicsApi";
import {
  TOPIC_STATUS_OPTIONS,
  TopicStatus,
  type TopicWriteRequest,
} from "@/modules/topics/types";
import {
  useGetCategoryPickerQuery,
  selectActivePickerOptions,
} from "@/modules/categories/api/categoryPickerApi";

interface CreateTopicModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const EMPTY_FORM = {
  name: "",
  category: "",
  creatorPrice: "",
  status: TopicStatus.ACTIVE as TopicStatus,
};

type FormState = typeof EMPTY_FORM;

/** A decimal string — the API takes `"180.00"`, not a number. */
const DECIMAL_PATTERN = /^\d+(\.\d+)?$/;

export const CreateTopicModal = ({
  isOpen,
  onOpenChange,
}: CreateTopicModalProps) => {
  const [createTopic, { isLoading }] = useCreateTopicMutation();
  const { data: pickerOptions } = useGetCategoryPickerQuery(undefined, {
    skip: !isOpen,
  });

  const [form, setForm] = React.useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleClose = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    onOpenChange(false);
  };

  // Archived categories come back from the picker too, and a topic cannot be
  // created under one.
  const categoryOptions = selectActivePickerOptions(pickerOptions).map(
    (category) => ({ label: category.name, value: category.id }),
  );

  /**
   * Client-side pass first so an obviously incomplete form doesn't cost a round
   * trip; server field errors then merge over the top.
   */
  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Topic name is required";
    if (!form.category) next.category = "Category is required";
    if (!form.creatorPrice.trim()) {
      next.creator_price = "Price is required";
    } else if (!DECIMAL_PATTERN.test(form.creatorPrice.trim())) {
      next.creator_price = "Enter a price like 180.00";
    }
    return next;
  };

  const handleCreateTopic = async () => {
    const localErrors = validate();
    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      return;
    }

    const payload: TopicWriteRequest = {
      name: form.name.trim(),
      category: form.category,
      creator_price: form.creatorPrice.trim(),
      status: form.status,
    };

    try {
      await createTopic(payload).unwrap();
      toast.success("Topic created");
      handleClose();
    } catch (err) {
      const { fieldErrors, message } = normalizeApiError(err as never);
      setErrors(fieldErrors);
      toast.error(message ?? "Could not create topic");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
      showCloseButton={false}
      className="sm:max-w-[520px] rounded-[16px] border border-sd-grey-3 p-[20px]"
      title={
        <div className="flex items-start justify-between gap-[16px]">
          <span className="text-[20px] font-semibold text-sd-grey-12 leading-[32px] tracking-[-0.4px]">
            Create topic
          </span>
          <AppButton
            type="button"
            variant="outline"
            size="icon-sm"
            className="size-[32px] rounded-[10px] border-sd-grey-3 bg-white text-sd-grey-9 hover:bg-sd-grey-2"
            onClick={handleClose}
            aria-label="Close create topic modal"
          >
            <X size={18} />
          </AppButton>
        </div>
      }
    >
      <div className="flex flex-col gap-[20px]">
        <FormInput
          name="topicName"
          label="Topic name"
          placeholder="E.g. Django REST Framework"
          required
          value={form.name}
          error={errors.name}
          disabled={isLoading}
          onChange={(event) => setField("name", event.target.value)}
          className="h-[44px] bg-white"
        />

        <FormSelect
          name="topicCategory"
          label="Category"
          required
          value={form.category}
          onValueChange={(value) => setField("category", value)}
          options={categoryOptions}
          placeholder={
            categoryOptions.length === 0
              ? "No active category available"
              : "Select category"
          }
          disabled={isLoading || categoryOptions.length === 0}
          error={errors.category}
          triggerClassName="h-[44px] bg-white text-sd-grey-12"
        />

        <FormInput
          name="creatorPrice"
          label="Creator price"
          placeholder="0.00"
          required
          value={form.creatorPrice}
          error={errors.creator_price}
          disabled={isLoading}
          onChange={(event) => setField("creatorPrice", event.target.value)}
          hint="Paid for a course submitted under this topic. Overrides the category price when set, and changes apply only to courses submitted afterwards."
          className="h-[44px] bg-white"
        />

        <FormSelect
          name="topicStatus"
          label="Status"
          value={form.status}
          onValueChange={(value) => setField("status", value as TopicStatus)}
          options={TOPIC_STATUS_OPTIONS.map((option) => ({
            label: option.label,
            value: option.value,
          }))}
          disabled={isLoading}
          triggerClassName="h-[44px] bg-white text-sd-grey-12"
        />

        <div className="flex gap-[12px] pt-[4px]">
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
            onClick={handleCreateTopic}
          >
            {isLoading ? "Creating..." : "Create topic"}
          </AppButton>
        </div>
      </div>
    </Modal>
  );
};
