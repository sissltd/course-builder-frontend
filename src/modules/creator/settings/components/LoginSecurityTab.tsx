"use client";

import React, { useState } from "react";
import { Eye, EyeSlash } from "iconsax-react";
import { Button } from "@/components/shared/Button";
import { ChangeEmailFlow } from "./ChangeEmailFlow";
import { useSession } from "next-auth/react";
import { useChangePasswordMutation } from "@/modules/auth/api/accountApi";
import { normalizeApiError } from "@/lib/api/errors";
import { toast } from "sonner";

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

const PasswordInput = ({
  label,
  value,
  onChange,
  placeholder = "Enter password",
}: PasswordInputProps) => {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-[8px]">
      <label className="text-[14px] text-[#606060] tracking-[-0.28px] font-medium">
        {label}
      </label>
      <div className="flex items-center border border-[#D9D9D9] rounded-[8px] bg-white overflow-hidden h-[44px]">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="new-password"
          className="flex-1 h-full px-[16px] text-[14px] text-[#202020] outline-none bg-transparent placeholder:text-[#B6B6B6]"
        />
        <button
          type="button"
          onClick={() => setShow((p) => !p)}
          className="px-[14px] h-full text-[14px] text-[#606060] hover:text-[#202020] transition-colors shrink-0 flex items-center gap-[4px]"
        >
          {show ? (
            <EyeSlash size={16} variant="Linear" color="currentColor" />
          ) : (
            <Eye size={16} variant="Linear" color="currentColor" />
          )}
          <span>{show ? "Hide" : "Show"}</span>
        </button>
      </div>
    </div>
  );
};

export const LoginSecurityTab = () => {
  const { data: session } = useSession();
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [isChangeEmailOpen, setIsChangeEmailOpen] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const email = session?.user?.email ?? "";

  const handleSavePassword = async () => {
    if (!currentPassword) {
      toast.error("Please enter your current password.");
      return;
    }
    if (!newPassword) {
      toast.error("Please enter a new password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }

    try {
      await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      }).unwrap();
      toast.success("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      const { message } = normalizeApiError(error as never);
      toast.error(message ?? "Failed to change password. Please try again.");
    }
  };

  return (
    <div className="flex flex-col gap-[32px]">
      <div className="flex flex-col gap-[8px]">
        <h2 className="text-[24px] font-semibold text-[#202020] tracking-[-0.48px] leading-[32px]">
          Log in &amp; Security
        </h2>
        <p className="text-[16px] text-[#636363] leading-[24px]">
          Manage your email address and password
        </p>
      </div>

      {/* Email Section */}
      <div className="flex flex-col gap-[16px]">
        <label className="text-[14px] font-semibold text-[#202020] tracking-[-0.28px]">
          Email address
        </label>
        <div className="flex flex-col gap-[16px]">
          <input
            readOnly
            value={email}
            className="w-full h-[44px] px-[16px] border border-[#D9D9D9] rounded-[8px] text-[14px] text-[#636363] bg-sd-grey-1 outline-none cursor-default"
          />
          <div className="flex justify-end">
            <Button
              variant="app-primary"
              className="h-[44px] px-[24px] text-[14px]"
              onClick={() => setIsChangeEmailOpen(true)}
            >
              Change email
            </Button>
          </div>
        </div>
      </div>

      <div className="h-px bg-[#F0F0F0]" />

      {/* Password Section */}
      <div className="flex flex-col gap-[24px]">
        <p className="text-[16px] font-semibold text-[#202020] tracking-[-0.32px]">
          Password
        </p>
        <div className="flex flex-col gap-[20px]">
          <PasswordInput
            label="Current password"
            value={currentPassword}
            onChange={setCurrentPassword}
          />
          <PasswordInput
            label="New password"
            value={newPassword}
            onChange={setNewPassword}
          />
          <PasswordInput
            label="Re-enter new password"
            value={confirmPassword}
            onChange={setConfirmPassword}
          />
        </div>
        <div className="flex justify-end">
          <Button
            variant="app-primary"
            className="h-[44px] px-[24px] text-[14px]"
            onClick={handleSavePassword}
            isLoading={isLoading}
          >
            Save changes
          </Button>
        </div>
      </div>

      <ChangeEmailFlow
        isOpen={isChangeEmailOpen}
        onOpenChange={setIsChangeEmailOpen}
        onSuccess={() => {}}
      />
    </div>
  );
};
