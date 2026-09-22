"use client";

import React from "react";
import { toast } from "sonner";
import { Button } from "@/components/shared/Button";
import { FormInput } from "@/components/form/FormInput";
import { useForm, FormProvider } from "react-hook-form";
import { normalizeApiError } from "@/lib/api/errors";
import { useGetMyProfileQuery } from "@/modules/auth/api/profileApi";
import { useChangePasswordMutation } from "@/modules/auth/api/accountApi";
import { useChangeEmailMutation } from "../api/reviewerSettingsApi";

interface EmailFormValues {
  new_email: string;
  password: string;
}

interface PasswordFormValues {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export const LoginSecurityTab = () => {
  const { data: profile } = useGetMyProfileQuery();
  const [changeEmail, { isLoading: isChangingEmail }] = useChangeEmailMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();

  const emailMethods = useForm<EmailFormValues>({
    defaultValues: { new_email: "", password: "" },
  });
  const passwordMethods = useForm<PasswordFormValues>({
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  React.useEffect(() => {
    if (profile?.email) {
      emailMethods.reset({ new_email: profile.email, password: "" });
    }
  }, [profile?.email, emailMethods]);

  const onSubmitEmail = emailMethods.handleSubmit(async (values) => {
    try {
      // Identity is proven with the current password; the confirmation link
      // goes to the new address.
      await changeEmail({
        new_email: values.new_email,
        password: values.password,
      }).unwrap();
      toast.success("Email change requested — check your inbox to confirm");
      emailMethods.reset({ new_email: values.new_email, password: "" });
    } catch (err) {
      const { fieldErrors, message } = normalizeApiError(err as never);
      for (const [field, error] of Object.entries(fieldErrors)) {
        emailMethods.setError(field as keyof EmailFormValues, { message: error });
      }
      toast.error(message ?? "Could not change email");
    }
  });

  const onSubmitPassword = passwordMethods.handleSubmit(async (values) => {
    // The API takes only the two fields — the confirmation is a client check.
    if (values.new_password !== values.confirm_password) {
      passwordMethods.setError("confirm_password", {
        message: "Passwords do not match",
      });
      return;
    }
    try {
      await changePassword({
        current_password: values.current_password,
        new_password: values.new_password,
      }).unwrap();
      toast.success("Password updated");
      passwordMethods.reset();
    } catch (err) {
      const { fieldErrors, message } = normalizeApiError(err as never);
      for (const [field, error] of Object.entries(fieldErrors)) {
        passwordMethods.setError(field as keyof PasswordFormValues, {
          message: error,
        });
      }
      toast.error(message ?? "Could not change password");
    }
  });

  return (
    <div className="flex w-full flex-col gap-[32px]">
      <div className="flex flex-col gap-[8px]">
        <h2 className="text-[22px] font-medium leading-[32px] tracking-[-0.48px] text-sd-grey-12">
          Log in & Security
        </h2>
        <p className="text-[14px] font-normal leading-[24px] tracking-[-0.28px] text-sd-grey-11">
          Manage your email address and password
        </p>
      </div>

      <FormProvider {...emailMethods}>
        <form onSubmit={onSubmitEmail} className="flex flex-col gap-[24px]">
          <FormInput
            name="new_email"
            label="New email address"
            type="email"
            required
          />
          <FormInput
            name="password"
            label="Current password"
            type="password"
            placeholder="Confirm with your password"
            required
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="outline"
              disabled={isChangingEmail || !emailMethods.formState.isDirty}
              className="h-[40px] rounded-[8px] border-[#0056D2] px-[20px] text-[14px] font-medium text-[#0056D2] hover:bg-[#0056D2]/5 disabled:opacity-50"
            >
              {isChangingEmail ? "Changing..." : "Change email"}
            </Button>
          </div>
        </form>
      </FormProvider>

      <FormProvider {...passwordMethods}>
        <form onSubmit={onSubmitPassword} className="flex flex-col gap-[24px]">
          <h3 className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
            Password
          </h3>

          <FormInput
            name="current_password"
            label="Current password"
            type="password"
            placeholder="Enter your password"
            required
          />

          <FormInput
            name="new_password"
            label="New password"
            type="password"
            placeholder="Enter your new password"
            required
          />

          <FormInput
            name="confirm_password"
            label="Re-enter new password"
            type="password"
            placeholder="Enter your new password"
            required
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="outline"
              disabled={isChangingPassword}
              className="h-[40px] rounded-[8px] border-[#0056D2] px-[20px] text-[14px] font-medium text-[#0056D2] hover:bg-[#0056D2]/5 disabled:opacity-50"
            >
              {isChangingPassword ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
