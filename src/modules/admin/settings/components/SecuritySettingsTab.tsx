"use client";

import React from "react";
import { Button as AppButton } from "@/components/shared/Button";
import { FormInput } from "@/components/form/FormInput";

export const SecuritySettingsTab = () => {
  const [email, setEmail] = React.useState("emmanuelosaite@gmail.com");
  const [currentPassword, setCurrentPassword] = React.useState("*************");
  const [newPassword, setNewPassword] = React.useState("*************");
  const [confirmPassword, setConfirmPassword] = React.useState("*************");

  return (
    <div className="flex w-full flex-col gap-[34px]">
      <div className="flex flex-col gap-[6px]">
        <h3 className="text-[22px] font-medium text-sd-grey-12 tracking-[-0.44px] leading-[32px]">
          Security
        </h3>
        <p className="text-[14px] font-normal text-sd-grey-11 leading-[24px]">
          Manage your email address
        </p>
      </div>

      <div className="flex flex-col gap-[26px]">
        <div className="flex flex-col gap-[14px]">
          <FormInput
            name="security-email-address"
            label="Email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-[44px] rounded-[10px] border-[1.5px] border-sd-grey-6 bg-white text-[14px] text-sd-grey-12"
          />

          <div className="flex justify-end">
            <AppButton
              type="button"
              variant="outline"
              size="app"
              className="h-[44px] min-w-[134px] rounded-[10px] border-sd-blue bg-white px-[24px] text-[14px] font-normal text-sd-blue hover:bg-sd-blue-light"
            >
              Change email
            </AppButton>
          </div>
        </div>

        <div className="flex flex-col gap-[16px]">
          <h4 className="text-[16px] font-medium text-sd-grey-12 tracking-[-0.32px] leading-[24px]">
            Password
          </h4>

          <div className="flex flex-col gap-[14px]">
            <FormInput
              name="security-current-password"
              label="Current password"
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className="h-[44px] rounded-[10px] border-[1.5px] border-sd-grey-6 bg-white text-[14px] text-sd-grey-12"
            />

            <FormInput
              name="security-new-password"
              label="New password"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="h-[44px] rounded-[10px] border-[1.5px] border-sd-grey-6 bg-white text-[14px] text-sd-grey-12"
            />

            <FormInput
              name="security-confirm-password"
              label="Re-enter new password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="h-[44px] rounded-[10px] border-[1.5px] border-sd-grey-6 bg-white text-[14px] text-sd-grey-12"
            />
          </div>

          <div className="flex justify-end">
            <AppButton
              type="button"
              variant="outline"
              size="app"
              className="h-[44px] min-w-[138px] rounded-[10px] border-sd-blue bg-white px-[24px] text-[14px] font-normal text-sd-blue hover:bg-sd-blue-light"
            >
              Save changes
            </AppButton>
          </div>
        </div>
      </div>
    </div>
  );
};
