"use client";

import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/shared/Button";
import { FormInput } from "@/components/form/FormInput";
import { FormTextarea } from "@/components/form/FormTextarea";
import { appealSchema, type AppealFormData } from "../utils/validation";

interface AppealFormPageProps {
  onSubmitSuccess: () => void;
}

export const AppealFormPage = ({
  onSubmitSuccess,
}: AppealFormPageProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const methods = useForm<AppealFormData>({
    resolver: zodResolver(appealSchema),
    defaultValues: {
      title: "",
      email: "",
      webLink: "",
      description: "",
    },
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    onSubmitSuccess();
  };

  return (
    <div className="flex flex-col items-center w-full py-[40px] px-[20px]">
      <div className="w-full max-w-[500px] flex flex-col gap-[32px]">
        <h1 className="text-[28px] font-semibold text-[#202020] text-center leading-[36px]">
          Request for an appeal
        </h1>

        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(handleSubmit)}
            className="flex flex-col gap-[24px]"
          >
            <FormInput
              name="title"
              label="Title"
              required
              placeholder="Enter title"
            />
            <FormInput
              name="email"
              label="Email"
              required
              type="email"
              placeholder="Enter email address"
            />
            <FormInput
              name="webLink"
              label="Web link"
              placeholder="Enter address"
              leftElement={
                <span className="text-[14px] text-[#8C8C8C] pr-[8px] border-r border-[#CECECE]">
                  https://
                </span>
              }
            />
            <FormTextarea
              name="description"
              label="Description"
              required
              placeholder="Describe your problem"
              rows={5}
            />
            <Button
              type="submit"
              variant="app-primary"
              size="app"
              isLoading={isSubmitting}
              className="w-full"
            >
              Send request
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};
