"use client";

import React from "react";
import { ChevronDown, Trash2 } from "lucide-react";
import { Button as AppButton } from "@/components/shared/Button";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";

const timezoneOptions = [
  { label: "WAT - UTC+1 (lagos)", value: "WAT - UTC+1 (lagos)" },
  { label: "GMT - UTC+0 (London)", value: "GMT - UTC+0 (London)" },
  { label: "EST - UTC-5 (New York)", value: "EST - UTC-5 (New York)" },
];

export const AccountTab = () => {
  return (
    <div className="flex w-full flex-col gap-[38px]">
      <div className="flex flex-col gap-[18px]">
        <div className="flex items-center gap-[10px]">
          <div className="flex size-[56px] shrink-0 items-center justify-center rounded-full bg-sd-grey-12">
            <span className="text-[18px] font-normal leading-[28px] tracking-[-0.36px] text-sd-grey-1">OE</span>
          </div>

          <div className="flex items-center gap-[10px]">
            <AppButton
              type="button"
              variant="outline"
              size="sm"
              className="h-[32px] rounded-[8px] border-sd-grey-3 bg-white px-[12px] text-[12px] font-normal text-sd-grey-12 hover:bg-sd-grey-2"
            >
              Upload
            </AppButton>

            <AppButton
              type="button"
              variant="ghost"
              size="icon-sm"
              className="size-[32px] rounded-[8px] bg-sd-grey-3 text-sd-grey-11 hover:bg-sd-grey-4"
              aria-label="Delete profile photo"
            >
              <Trash2 size={16} strokeWidth={1.8} />
            </AppButton>
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
          <p className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
            Member since 25 April, 2026
          </p>
        </div>
      </div>

      <div className="rounded-[16px] border border-sd-grey-3 bg-white p-[14px]">
        <div className="flex items-center justify-between gap-[16px]">
          <span className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">Role</span>
          <div className="flex h-[42px] min-w-[110px] items-center justify-center rounded-[10px] border border-sd-grey-6 bg-white px-[24px] text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
            Reviewer
          </div>
        </div>
      </div>

      <div className="rounded-[16px] border border-sd-grey-3 bg-white px-[14px] py-[16px]">
        <div className="flex flex-col gap-[16px]">
          <FormInput
            name="admin-settings-email"
            label="Enter email address"
            value="emmanuelosaite@gmail.com"
            readOnly
            className="h-[44px] rounded-[10px] border-[1.5px] border-sd-grey-6 bg-white text-[14px] text-sd-grey-12"
          />

          <FormInput
            name="admin-settings-first-name"
            label="First name"
            value="Emmanuel"
            readOnly
            className="h-[44px] rounded-[10px] border-[1.5px] border-sd-grey-6 bg-white text-[14px] text-sd-grey-12"
          />

          <FormInput
            name="admin-settings-last-name"
            label="Last name"
            value="Osaite"
            readOnly
            className="h-[44px] rounded-[10px] border-[1.5px] border-sd-grey-6 bg-white text-[14px] text-sd-grey-12"
          />

          <FormSelect
            name="admin-settings-timezone"
            label="Timezone"
            value="WAT - UTC+1 (lagos)"
            options={timezoneOptions}
            triggerClassName="h-[44px] rounded-[10px] border-[1.5px] border-sd-grey-6 bg-white text-sd-grey-12 hover:bg-white"
            suffix={<ChevronDown size={22} strokeWidth={1.8} className="text-sd-grey-11" />}
          />
        </div>
      </div>
    </div>
  );
};
