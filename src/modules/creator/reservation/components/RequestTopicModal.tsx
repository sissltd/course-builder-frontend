"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/shared/Modal";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { Button } from "@/components/shared/Button";
import { requestCategorySchema, RequestCategoryFormData } from "../utils/schemas";
import { useCreateTopicReservationMutation } from "../hooks";
import { useGetCategoriesQuery } from "@/modules/creator/courses/hooks";
import { CategoryStatus } from "@/modules/creator/courses/types/category";

interface RequestTopicModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const RequestTopicModal = ({ isOpen, onOpenChange, onSuccess }: RequestTopicModalProps) => {
  const [createReservation, { isLoading }] = useCreateTopicReservationMutation();
  const { data: categoriesResponse } = useGetCategoriesQuery({ status: CategoryStatus.ACTIVE });

  const methods = useForm<RequestCategoryFormData>({
    resolver: zodResolver(requestCategorySchema),
    defaultValues: {
      name: "",
      category: "",
    },
  });

  const categoryOptions = categoriesResponse?.data?.results?.map((cat) => ({
    label: cat.name,
    value: cat.id,
  })) ?? [];

  const onSubmit = async (data: RequestCategoryFormData) => {
    try {
      await createReservation(data).unwrap();
      onSuccess();
      methods.reset();
    } catch {
      // error handled by RTK Query
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Request topic"
      className="sm:max-w-[500px]"
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-[24px]">
          <FormInput
            name="name"
            label="Topic Name"
            placeholder="E.g. Fundamentals of Programming"
            required
          />

          <FormSelect
            name="category"
            label="Category"
            placeholder="Select a category"
            options={categoryOptions}
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
              isLoading={isLoading}
            >
              Request
            </Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};
