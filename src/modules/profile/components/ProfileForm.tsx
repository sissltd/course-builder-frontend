"use client";

import React from "react";
import { AppButton } from "@/components/shared/AppButton";
import { AppSelect } from "@/components/form/AppSelect";
import { ArrowDown2 } from "iconsax-react";

interface ProfileFormRowProps {
  label: string;
  children: React.ReactNode;
}

const ProfileFormRow = ({ label, children }: ProfileFormRowProps) => (
  <div className="flex items-start gap-[40px] py-[24px] border-b border-[#F0F0F0] last:border-b-0">
    <div className="w-[160px] shrink-0">
      <p className="text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px] font-medium pt-[10px]">{label}</p>
    </div>
    <div className="flex-1 flex flex-col gap-[16px]">{children}</div>
  </div>
);

interface ProfileFormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const ProfileFormInput = ({ label, ...props }: ProfileFormInputProps) => (
  <div className="flex flex-col gap-[6px]">
    {label && (
      <label className="text-[13px] text-[#606060] tracking-[-0.26px] font-medium">{label}</label>
    )}
    <input
      {...props}
      className="w-full h-[44px] px-[16px] border border-[#D9D9D9] rounded-[8px] text-[14px] text-[#202020] placeholder:text-[#B6B6B6] bg-white outline-none focus:border-[#0063EF] transition-colors"
    />
  </div>
);

export const ProfileForm = () => {
  return (
    <div className="flex flex-col">
      {/* Full Name */}
      <ProfileFormRow label="Full name">
        <ProfileFormInput label="Firstname" placeholder="Enter name" />
        <ProfileFormInput label="Last name" placeholder="Enter name" />
      </ProfileFormRow>

      {/* Email */}
      <ProfileFormRow label="Email">
        <ProfileFormInput
          label="Email address"
          type="email"
          placeholder="emmanuelosaite@gmail.com"
          defaultValue="emmanuelosaite@gmail.com"
          readOnly
          className="w-full h-[44px] px-[16px] border border-[#D9D9D9] rounded-[8px] text-[14px] text-[#B6B6B6] bg-[#F9F9F9] outline-none cursor-not-allowed"
        />
      </ProfileFormRow>

      {/* Contact details */}
      <ProfileFormRow label="Contact details">
        <div className="flex flex-col gap-[6px]">
          <label className="text-[13px] text-[#606060] tracking-[-0.26px] font-medium">Phone Number</label>
          <div className="flex items-center gap-[8px]">
            {/* Country code picker */}
            <div className="flex items-center gap-[6px] h-[44px] px-[12px] border border-[#D9D9D9] rounded-[8px] bg-white cursor-pointer select-none min-w-[80px]">
              <span className="text-[14px] text-[#202020] font-medium">NG</span>
              <ArrowDown2 size={14} variant="Linear" color="#606060" />
            </div>
            <input
              type="tel"
              placeholder="9012345678"
              defaultValue="9012345678"
              className="flex-1 h-[44px] px-[16px] border border-[#D9D9D9] rounded-[8px] text-[14px] text-[#202020] placeholder:text-[#B6B6B6] bg-white outline-none focus:border-[#0063EF] transition-colors"
            />
          </div>
        </div>
      </ProfileFormRow>

      {/* Address */}
      <ProfileFormRow label="Address">
        <AppSelect
          label="Country"
          placeholder="Select country"
          options={[
            { label: "Nigeria", value: "NG" },
            { label: "United States", value: "US" },
            { label: "United Kingdom", value: "UK" },
          ]}
          onValueChange={(val) => console.log("Country:", val)}
          triggerClassName="h-[44px]"
        />
        <AppSelect
          label="State"
          placeholder="Select country"
          options={[
            { label: "Lagos", value: "lagos" },
            { label: "Abuja", value: "abuja" },
            { label: "Kano", value: "kano" },
          ]}
          onValueChange={(val) => console.log("State:", val)}
          triggerClassName="h-[44px]"
        />
        <ProfileFormInput label="Address" placeholder="Enter address" />
      </ProfileFormRow>

      {/* Area of Expertise */}
      <ProfileFormRow label="Area of Expertise">
        <AppSelect
          label="Category"
          placeholder="Select area of expertise"
          options={[
            { label: "Information technology", value: "it" },
            { label: "Artificial intelligence", value: "ai" },
            { label: "Cloud computing", value: "cloud" },
            { label: "Cybersecurity", value: "cyber" },
          ]}
          onValueChange={(val) => console.log("Expertise:", val)}
          triggerClassName="h-[44px]"
        />
      </ProfileFormRow>

      {/* Save Button */}
      <div className="flex items-start gap-[40px] pt-[24px]">
        <div className="w-[160px] shrink-0" />
        <div className="flex-1">
          <AppButton
            variant="app-primary"
            className="h-[44px] px-[32px] text-[14px]"
          >
            Save changes
          </AppButton>
        </div>
      </div>
    </div>
  );
};
