"use client";

import React, { useState } from "react";
import { Eye, EyeSlash } from "iconsax-react";
import { AppButton } from "@/components/shared/AppButton";
import { ChangeEmailFlow } from "./ChangeEmailFlow";

const PasswordInput = ({ label }: { label: string }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-[8px]">
      <label className="text-[14px] text-[#606060] tracking-[-0.28px] font-medium">{label}</label>
      <div className="flex items-center border border-[#D9D9D9] rounded-[8px] bg-white overflow-hidden h-[44px]">
        <input
          type={show ? "text" : "password"}
          defaultValue="••••••••••••"
          className="flex-1 h-full px-[16px] text-[14px] text-[#202020] outline-none bg-transparent"
        />
        <button
          type="button"
          onClick={() => setShow((p) => !p)}
          className="px-[14px] h-full text-[14px] text-[#606060] hover:text-[#202020] transition-colors shrink-0 flex items-center gap-[4px]"
        >
          {show
            ? <EyeSlash size={16} variant="Linear" color="currentColor" />
            : <Eye size={16} variant="Linear" color="currentColor" />
          }
          <span>{show ? "Hide" : "Hide"}</span>
        </button>
      </div>
    </div>
  );
};

export const LoginSecurityTab = () => {
  const [isChangeEmailOpen, setIsChangeEmailOpen] = useState(false);

  return (
    <div className="flex flex-col gap-[32px]">
      <div className="flex flex-col gap-[8px]">
        <h2 className="text-[24px] font-semibold text-[#202020] tracking-[-0.48px] leading-[32px]">Log in &amp; Security</h2>
        <p className="text-[16px] text-[#636363] leading-[24px]">Manage your email address and password</p>
      </div>

      {/* Email Section */}
      <div className="flex flex-col gap-[16px]">
        <label className="text-[14px] font-semibold text-[#202020] tracking-[-0.28px]">Email address</label>
        <div className="flex flex-col gap-[16px]">
          <input
            readOnly
            defaultValue="emmanuelosaite@gmail.com"
            className="w-full h-[44px] px-[16px] border border-[#D9D9D9] rounded-[8px] text-[14px] text-[#636363] bg-sd-grey-1 outline-none cursor-default"
          />
          <div className="flex justify-end">
            <AppButton 
              variant="app-primary" 
              className="h-[44px] px-[24px] text-[14px]"
              onClick={() => setIsChangeEmailOpen(true)}
            >
              Change email
            </AppButton>
          </div>
        </div>
      </div>

      <div className="h-px bg-[#F0F0F0]" />

      {/* Password Section */}
      <div className="flex flex-col gap-[24px]">
        <p className="text-[16px] font-semibold text-[#202020] tracking-[-0.32px]">Password</p>
        <div className="flex flex-col gap-[20px]">
          <PasswordInput label="Current password" />
          <PasswordInput label="New password" />
          <PasswordInput label="Re-enter new password" />
        </div>
        <div className="flex justify-end">
          <AppButton variant="app-primary" className="h-[44px] px-[24px] text-[14px]">
            Save changes
          </AppButton>
        </div>
      </div>

      <ChangeEmailFlow 
        isOpen={isChangeEmailOpen} 
        onOpenChange={setIsChangeEmailOpen} 
        onSuccess={() => console.log("Email changed")}
      />
    </div>
  );
};
