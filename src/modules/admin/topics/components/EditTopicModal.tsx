"use client";

import React from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "@/components/shared/Modal";
import { Button as AppButton } from "@/components/shared/Button";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { normalizeApiError } from "@/lib/api/errors";
import { useUpdateTopicMutation } from "@/modules/topics/api/topicsApi";
import {
  TOPIC_STATUS_OPTIONS,
  TopicStatus,
  type Topic,
  type UpdateTopicRequest,
} from "@/modules/topics/types";
import {
  useGetCategoryPickerQuery,
  selectActivePickerOptions,
} from "@/modules/categories/api/categoryPickerApi";

interface EditTopicModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  topic: Topic | null;
}

const DECIMAL_PATTERN = /^\d+(\.\d+)?$/;

export const EditTopicModal = ({
  isOpen,
  onOpenChange,
  topic,
}: EditTopicModalProps) => {
  const [updateTopic, { isLoading }] = useUpdateTopicMutation();
  const { data: pickerOptions } = useGetCategoryPickerQuery(undefined, {
    skip: !isOpen,
  });

  const [name, setName] = React.useState(topic?.name ?? "");
  const [category, setCategory] = React.useState(topic?.category.id ?? "");
  const [creatorPrice, setCreatorPrice] = React.useState(
    topic?.creator_price ?? "",
  );
  const [status, setStatus] = React.useState<TopicStatus>(
    topic?.status ?? TopicStatus.ACTIVE,
  );
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleClose = () => {
    setErrors({});
    onOpenChange(false);
  };

  /**
   * The topic's own category is kept in the list even when it is archived —
   * otherwise editing a topic whose category was archived would silently move it
   * to whichever category happened to be first.
   */
  const categoryOptions = React.useMemo(() => {
    const active = selectActivePickerOptions(pickerOptions);
    const options = active.map((option) => ({
      label: option.name,
      value: option.id,
    }));
    if (topic && !active.some((option) => option.id === topic.category.id)) {
      options.unshift({ label: topic.category.name, value: topic.category.id });
    }
    return options;
  }, [pickerOptions, topic]);

  const handleSaveChanges = async () => {
    if (!topic) return;

    const localErrors: Record<string, string> = {};
    if (!name.trim()) localErrors.name = "Topic name is required";
    if (!creatorPrice.trim()) {
      localErrors.creator_price = "Price is required";
    } else if (!DECIMAL_PATTERN.test(creatorPrice.trim())) {
      localErrors.creator_price = "Enter a price like 180.00";
    }
    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      return;
    }

    /*
      Built as a diff so the PATCH carries only what actually changed. Unlike a
      PUT, this leaves every field not named here untouched — importantly the
      category, which a routine reprice has no business rewriting.
    */
    const payload: UpdateTopicRequest = {};
    if (name.trim() !== topic.name) payload.name = name.trim();
    if (creatorPrice.trim() !== topic.creator_price) {
      payload.creator_price = creatorPrice.trim();
    }
    if (category && category !== topic.category.id) payload.category = category;
    if (status !== topic.status) payload.status = status;

    if (Object.keys(payload).length === 0) {
      toast.info("Nothing to save");
      return;
    }

    try {
      await updateTopic({ id: topic.id, body: payload }).unwrap();
      toast.success("Topic updated");
      handleClose();
    } catch (err) {
      const { fieldErrors, message } = normalizeApiError(err as never);
      setErrors(fieldErrors);
      toast.error(message ?? "Could not update topic");
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
            Edit topic
          </span>
          <AppButton
            type="button"
            variant="outline"
            size="icon-sm"
            className="size-[32px] rounded-[10px] border-sd-grey-3 bg-white text-sd-grey-9 hover:bg-sd-grey-2"
            onClick={handleClose}
            aria-label="Close edit topic modal"
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
          value={name}
          error={errors.name}
          disabled={isLoading}
          onChange={(event) => setName(event.target.value)}
          className="h-[44px] bg-white"
        />

        <FormSelect
          name="topicCategory"
          label="Category"
          value={category}
          onValueChange={setCategory}
          options={categoryOptions}
          placeholder="Select category"
          disabled={isLoading}
          error={errors.category}
          triggerClassName="h-[44px] bg-white text-sd-grey-12"
        />

        <FormInput
          name="creatorPrice"
          label="Creator price"
          placeholder="0.00"
          required
          value={creatorPrice}
          error={errors.creator_price}
          disabled={isLoading}
          onChange={(event) => setCreatorPrice(event.target.value)}
          hint="Changes are not retroactive — courses already submitted keep the price they were submitted at."
          className="h-[44px] bg-white"
        />

        <FormSelect
          name="topicStatus"
          label="Status"
          value={status}
          onValueChange={(value) => setStatus(value as TopicStatus)}
          options={TOPIC_STATUS_OPTIONS.map((option) => ({
            label: option.label,
            value: option.value,
          }))}
          disabled={isLoading}
          hint="Inactive stops new submissions. Courses already using this topic are unaffected."
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
            onClick={handleSaveChanges}
          >
            {isLoading ? "Saving..." : "Save changes"}
          </AppButton>
        </div>
      </div>
    </Modal>
  );
};
