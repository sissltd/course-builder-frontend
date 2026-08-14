"use client";

import React from "react";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { Trash, ArrowDown2 } from "iconsax-react";
import { useForm, FormProvider } from "react-hook-form";

export const AccountTab = () => {
  const methods = useForm({
    defaultValues: {
      email: "emmanuelosaite@gmail.com",
      first_name: "Emmanuel",
      last_name: "Osaite",
      timezone: "WAT - UTC+1 (Lagos)",
    },
  });

  return (
    <FormProvider {...methods}>
      <div className="flex w-full flex-col gap-[32px]">
        {/* Profile Header */}
        <div className="flex flex-col gap-[16px]">
          <div className="flex items-center gap-[12px]">
            <div className="flex size-[56px] items-center justify-center rounded-full bg-sd-grey-12 text-[18px] font-normal leading-[28px] tracking-[-0.36px] text-white">
              OE
            </div>
            <div className="flex items-center gap-[8px]">
              <button
                type="button"
                className="flex h-[32px] items-center justify-center rounded-[8px] border border-sd-grey-3 bg-white px-[12px] text-[14px] font-normal text-sd-grey-12 hover:bg-sd-grey-2"
              >
                Upload
              </button>
              <button
                type="button"
                className="flex size-[32px] items-center justify-center rounded-[8px] bg-sd-grey-3 text-sd-grey-11 hover:bg-sd-grey-4"
                aria-label="Delete profile photo"
              >
                <Trash size={16} variant="Linear" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-[4px]">
            <div className="flex items-center gap-[8px]">
              <h3 className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
                Osaite Emmanuel
              </h3>
              <span className="rounded-[8px] bg-sd-warning-bg px-[10px] py-[4px] text-[12px] font-medium leading-[16px] text-sd-warning-text">
                Unavailable
              </span>
            </div>
            <span className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
              Member since 25 April, 2026
            </span>
          </div>
        </div>

        {/* Role & Track Info */}
        <div className="flex flex-col gap-[16px]">
          <div className="flex items-center justify-between rounded-[12px] border border-sd-grey-3 p-[16px]">
            <div className="flex flex-col gap-[2px]">
              <span className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
                Role
              </span>
              <span className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
                Set by admin
              </span>
            </div>
            <div className="flex items-center justify-center rounded-[8px] border border-sd-grey-4 bg-sd-grey-1 px-[16px] py-[6px] text-[14px] font-normal text-sd-grey-11">
              Reviewer
            </div>
          </div>

          <div className="flex items-center justify-between rounded-[12px] border border-sd-grey-3 p-[16px]">
            <div className="flex flex-col gap-[2px]">
              <span className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
                Assigned Track
              </span>
              <span className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
                Set by admin
              </span>
            </div>
            <div className="flex items-center justify-center rounded-[8px] border border-sd-grey-4 bg-sd-grey-1 px-[16px] py-[6px] text-[14px] font-normal text-sd-grey-11">
              Creator track
            </div>
          </div>
        </div>

        {/* Personal Info Form */}
        <div className="flex flex-col gap-[24px] rounded-[12px] border border-sd-grey-3 p-[24px]">
          <FormInput
            name="email"
            label="Email address"
            type="email"
          />

          <FormInput
            name="first_name"
            label="First name"
          />

          <FormInput
            name="last_name"
            label="Last name"
          />

          <FormInput
            name="timezone"
            label="Timezone"
            rightElement={
              <ArrowDown2
                size={18}
                variant="Linear"
                color="var(--sd-grey-11)"
                className="pointer-events-none"
              />
            }
          />
        </div>
      </div>
    </FormProvider>
  );
};
