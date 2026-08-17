"use client";

import React from "react";
import { Button } from "@/components/shared/Button";
import { FormInput } from "@/components/form/FormInput";
import { useForm, FormProvider } from "react-hook-form";

export const LoginSecurityTab = () => {
  const methods = useForm({
    defaultValues: {
      "settings-email": "emmanuelosaite@gmail.com",
      "current-password": "",
      "new-password": "",
      "reenter-password": "",
    },
  });

  return (
    <FormProvider {...methods}>
      <div className="flex w-full flex-col gap-[32px]">
        <div className="flex flex-col gap-[8px]">
          <h2 className="text-[22px] font-medium leading-[32px] tracking-[-0.48px] text-sd-grey-12">
            Log in & Security
          </h2>
          <p className="text-[14px] font-normal leading-[24px] tracking-[-0.28px] text-sd-grey-11">
            Manage your email address
          </p>
        </div>

        <div className="flex flex-col gap-[24px]">
          <FormInput
            name="settings-email"
            label="Email address"
            type="email"
          />
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              className="h-[40px] rounded-[8px] border-[#0056D2] px-[20px] text-[14px] font-medium text-[#0056D2] hover:bg-[#0056D2]/5"
            >
              Change email
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-[24px]">
          <h3 className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
            Password
          </h3>

          <FormInput
            name="current-password"
            label="Current password"
            type="password"
            placeholder="Enter your password"
            required
          />

          <FormInput
            name="new-password"
            label="New password"
            type="password"
            placeholder="Enter your new password"
            required
          />

          <FormInput
            name="reenter-password"
            label="Re-enter new password"
            type="password"
            placeholder="Enter your new password"
            required
          />

          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              className="h-[40px] rounded-[8px] border-[#0056D2] px-[20px] text-[14px] font-medium text-[#0056D2] hover:bg-[#0056D2]/5"
            >
              Save changes
            </Button>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};
