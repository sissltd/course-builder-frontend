"use client";

import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormInput } from "@/components/form/FormInput";
import { Button as AppButton } from "@/components/shared/Button";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { Modal } from "@/components/shared/Modal";
import { normalizeApiError } from "@/lib/api/errors";
import {
  useChangeEmailMutation,
  useChangePasswordMutation,
} from "@/modules/auth/api/accountApi";
import { useGetMyProfileQuery } from "@/modules/auth/api/profileApi";
import { useLogoutAllMutation } from "@/modules/auth/api/sessionApi";
import { MfaSection } from "@/modules/auth/components/MfaSection";
import { useLogout } from "@/modules/auth/hooks/useLogout";

interface EmailFormValues {
  new_email: string;
  password: string;
}

interface PasswordFormValues {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export const SecuritySettingsTab = () => {
  const { data: profile, isLoading: isLoadingProfile } =
    useGetMyProfileQuery();
  const [changeEmail, { isLoading: isChangingEmail }] =
    useChangeEmailMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();
  const [logoutAll, { isLoading: isLoggingOutAll }] = useLogoutAllMutation();
  const [isEmailModalOpen, setIsEmailModalOpen] = React.useState(false);
  const [isLogoutAllOpen, setIsLogoutAllOpen] = React.useState(false);
  const logout = useLogout();

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

  const openEmailModal = () => {
    emailMethods.reset({ new_email: "", password: "" });
    setIsEmailModalOpen(true);
  };

  const onSubmitEmail = emailMethods.handleSubmit(async (values) => {
    try {
      await changeEmail(values).unwrap();
      toast.success("Email change requested — check your inbox to confirm");
      setIsEmailModalOpen(false);
      emailMethods.reset();
    } catch (error) {
      const { fieldErrors, message } = normalizeApiError(error as never);
      for (const [field, fieldMessage] of Object.entries(fieldErrors)) {
        emailMethods.setError(field as keyof EmailFormValues, {
          message: fieldMessage,
        });
      }
      toast.error(message ?? "Could not change email");
    }
  });

  const onSubmitPassword = passwordMethods.handleSubmit(async (values) => {
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
    } catch (error) {
      const { fieldErrors, message } = normalizeApiError(error as never);
      for (const [field, fieldMessage] of Object.entries(fieldErrors)) {
        passwordMethods.setError(field as keyof PasswordFormValues, {
          message: fieldMessage,
        });
      }
      toast.error(message ?? "Could not change password");
    }
  });

  const handleLogoutAll = async () => {
    try {
      await logoutAll().unwrap();
      setIsLogoutAllOpen(false);
      await logout();
    } catch (error) {
      const { message } = normalizeApiError(error as never);
      toast.error(message ?? "Could not sign out of all devices");
    }
  };

  return (
    <div className="flex w-full flex-col gap-[34px]">
      <div className="flex flex-col gap-[6px]">
        <h3 className="text-[22px] font-medium leading-[32px] tracking-[-0.44px] text-sd-grey-12">
          Security
        </h3>
        <p className="text-[14px] font-normal leading-[24px] text-sd-grey-11">
          Manage your email address, password and account security
        </p>
      </div>

      <div className="flex flex-col gap-[26px]">
        <div className="flex flex-col gap-[14px]">
          <FormInput
            name="security-email-address"
            label="Email address"
            type="email"
            value={profile?.email ?? ""}
            disabled={isLoadingProfile}
            readOnly
            className="h-[44px] rounded-[10px] border-[1.5px] border-sd-grey-6 bg-sd-grey-2 text-[14px] text-sd-grey-12"
          />

          <div className="flex justify-end">
            <AppButton
              type="button"
              variant="outline"
              size="app"
              disabled={isLoadingProfile}
              onClick={openEmailModal}
              className="h-[44px] min-w-[134px] rounded-[10px] border-sd-blue bg-white px-[24px] text-[14px] font-normal text-sd-blue hover:bg-sd-blue-light"
            >
              Change email
            </AppButton>
          </div>
        </div>

        <FormProvider {...passwordMethods}>
          <form
            onSubmit={onSubmitPassword}
            className="flex flex-col gap-[16px]"
          >
            <h4 className="text-[16px] font-medium leading-[24px] tracking-[-0.32px] text-sd-grey-12">
              Password
            </h4>

            <div className="flex flex-col gap-[14px]">
              <FormInput
                name="current_password"
                label="Current password"
                type="password"
                autoComplete="current-password"
                required
                className="h-[44px] rounded-[10px] border-[1.5px] border-sd-grey-6 bg-white text-[14px] text-sd-grey-12"
              />
              <FormInput
                name="new_password"
                label="New password"
                type="password"
                autoComplete="new-password"
                required
                className="h-[44px] rounded-[10px] border-[1.5px] border-sd-grey-6 bg-white text-[14px] text-sd-grey-12"
              />
              <FormInput
                name="confirm_password"
                label="Re-enter new password"
                type="password"
                autoComplete="new-password"
                required
                className="h-[44px] rounded-[10px] border-[1.5px] border-sd-grey-6 bg-white text-[14px] text-sd-grey-12"
              />
            </div>

            <div className="flex justify-end">
              <AppButton
                type="submit"
                variant="outline"
                size="app"
                disabled={isChangingPassword}
                isLoading={isChangingPassword}
                className="h-[44px] min-w-[138px] rounded-[10px] border-sd-blue bg-white px-[24px] text-[14px] font-normal text-sd-blue hover:bg-sd-blue-light"
              >
                Save changes
              </AppButton>
            </div>
          </form>
        </FormProvider>

        <div className="h-px bg-sd-grey-4" />
        <MfaSection />
        <div className="h-px bg-sd-grey-4" />

        <div className="flex flex-col gap-[16px]">
          <div>
            <h4 className="text-[16px] font-medium leading-[24px] tracking-[-0.32px] text-sd-grey-12">
              Sessions
            </h4>
            <p className="text-[14px] font-normal leading-[20px] text-sd-grey-11">
              Sign out everywhere if you think your account has been
              compromised.
            </p>
          </div>
          <div className="flex justify-end">
            <AppButton
              type="button"
              variant="outline"
              size="app"
              disabled={isLoggingOutAll}
              onClick={() => setIsLogoutAllOpen(true)}
              className="h-[44px] rounded-[10px] border-sd-blue bg-white px-[24px] text-[14px] font-normal text-sd-blue hover:bg-sd-blue-light"
            >
              Log out of all devices
            </AppButton>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isEmailModalOpen}
        onOpenChange={setIsEmailModalOpen}
        title="Change email address"
        description="Enter your new email address and current password."
      >
        <FormProvider {...emailMethods}>
          <form onSubmit={onSubmitEmail} className="flex flex-col gap-[18px]">
            <FormInput
              name="new_email"
              label="New email address"
              type="email"
              autoComplete="email"
              required
            />
            <FormInput
              name="password"
              label="Current password"
              type="password"
              autoComplete="current-password"
              required
            />
            <div className="flex justify-end gap-[12px] pt-[8px]">
              <AppButton
                type="button"
                variant="outline"
                disabled={isChangingEmail}
                onClick={() => setIsEmailModalOpen(false)}
              >
                Cancel
              </AppButton>
              <AppButton
                type="submit"
                variant="app-primary"
                disabled={isChangingEmail}
                isLoading={isChangingEmail}
              >
                Send confirmation
              </AppButton>
            </div>
          </form>
        </FormProvider>
      </Modal>

      <ConfirmModal
        isOpen={isLogoutAllOpen}
        onOpenChange={setIsLogoutAllOpen}
        variant="danger"
        title="Log out of all devices?"
        description="Every session on every device will be ended. You will need to log in again here."
        confirmLabel="Log out everywhere"
        isLoading={isLoggingOutAll}
        onConfirm={() => void handleLogoutAll()}
      />
    </div>
  );
};
