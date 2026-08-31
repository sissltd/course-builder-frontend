"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/shared/Modal";
import { FormInput } from "@/components/form/FormInput";
import { Button } from "@/components/shared/Button";
import { requestCategorySchema, RequestCategoryFormData } from "../utils/schemas";

interface RequestTopicModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const RequestTopicModal = ({ isOpen, onOpenChange, onSuccess }: RequestTopicModalProps) => {
  const methods = useForm<RequestCategoryFormData>({
    resolver: zodResolver(requestCategorySchema),
    defaultValues: {
      categoryName: "",
    },
  });

  const onSubmit = (data: RequestCategoryFormData) => {
    console.log("Request Category Data:", data);
    // Simulate API call
    setTimeout(() => {
      onSuccess();
      methods.reset();
    }, 1000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Request category"
      className="sm:max-w-[500px]"
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-[24px]">
          <FormInput
            name="categoryName"
            label="Category Name"
            placeholder="E.g. Software Development"
            required
          />
          
          <div className="flex gap-[12px] mt-[8px]">
            <Button
              type="button"
              variant="app-outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="app-primary"
              className="flex-1"
              isLoading={methods.formState.isSubmitting}
            >
              Request
            </Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};
