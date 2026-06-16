"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppModal } from "@/components/shared/AppModal";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { AppButton } from "@/components/shared/AppButton";
import { requestTopicSchema, RequestTopicFormData } from "../utils/schemas";

interface RequestTopicModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const CATEGORY_OPTIONS = [
  { label: "Information technology", value: "Information technology" },
  { label: "Artificial intelligence", value: "Artificial intelligence" },
  { label: "Cloud computing", value: "Cloud computing" },
  { label: "Cybersecurity", value: "Cybersecurity" },
];

export const RequestTopicModal = ({ isOpen, onOpenChange, onSuccess }: RequestTopicModalProps) => {
  const methods = useForm<RequestTopicFormData>({
    resolver: zodResolver(requestTopicSchema),
    defaultValues: {
      topicTitle: "",
      category: "",
    },
  });

  const onSubmit = (data: RequestTopicFormData) => {
    console.log("Request Topic Data:", data);
    // Simulate API call
    setTimeout(() => {
      onSuccess();
      methods.reset();
    }, 1000);
  };

  return (
    <AppModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Request topic"
      className="sm:max-w-[500px]"
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-[24px]">
          <FormInput
            name="topicTitle"
            label="Topic Title"
            placeholder="E.g. Introduction to Software Development"
            required
          />
          <FormSelect
            name="category"
            label="Category"
            placeholder="Select category"
            options={CATEGORY_OPTIONS}
            required
          />
          
          <div className="flex gap-[12px] mt-[8px]">
            <AppButton
              type="button"
              variant="app-outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </AppButton>
            <AppButton
              type="submit"
              variant="app-primary"
              className="flex-1"
              isLoading={methods.formState.isSubmitting}
            >
              Request
            </AppButton>
          </div>
        </form>
      </FormProvider>
    </AppModal>
  );
};
