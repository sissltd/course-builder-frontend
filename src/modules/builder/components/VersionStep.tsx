"use client";

import React from "react";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSelect } from "@/components/form/FormSelect";
import { Button } from "@/components/shared/Button";
import { useAppDispatch, useAppSelector } from "@/redux";
import { setVersion } from "@/redux/slices/courseBuilderSlice";
import { versionSchema, VersionFormData } from "../utils/schemas";

interface VersionStepProps {
  onNext?: () => void;
  onBack?: () => void;
}

export const VersionStep = ({ onNext, onBack }: VersionStepProps) => {
  const dispatch = useAppDispatch();
  const currentVersion = useAppSelector((state) => state.courseBuilder.version);

  const methods = useForm<VersionFormData>({
    resolver: zodResolver(versionSchema),
    mode: "onBlur",
    values: {
      version: currentVersion,
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = (data: VersionFormData) => {
    dispatch(setVersion(data.version));
    onNext?.();
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="w-[739px] max-w-full bg-[#FDFDFD] px-[24px] py-[40px] flex flex-col gap-[40px] mx-auto pb-[100px]">
        
        {/* Title / Description */}
        <div className="flex flex-col gap-[12px]">
          <h2 className="text-[24px] font-semibold text-[#202020] tracking-[-0.48px] leading-[32px]">Versioning</h2>
          <p className="text-[16px] text-[#606060] leading-[24px]">
            Assign a version to this course
          </p>
        </div>

        {/* Dropdown Container */}
        <FormSelect 
          name="version"
          placeholder="Select version"
          options={[
            { label: "v1.0", value: "v1.0" },
            { label: "v1.1", value: "v1.1" },
            { label: "v2.0", value: "v2.0" },
          ]}
          triggerClassName="h-[44px] bg-white border-[#D9D9D9] text-[#202020]"
        />

        {/* Footer Navigation */}
        <div className="flex items-center justify-between w-full pt-[24px]">
          <Button 
            variant="app-outline"
            onClick={onBack}
            leftIcon={<ArrowLeft2 size={24} variant="Linear" color="#0A60E1" />}
          >
            Go back
          </Button>
          <Button 
            variant="app-primary"
            type="submit"
            rightIcon={<ArrowRight2 size={24} variant="Linear" color="#FFFFFF" />}
          >
            Save & continue
          </Button>
        </div>

      </form>
    </FormProvider>
  );
};
