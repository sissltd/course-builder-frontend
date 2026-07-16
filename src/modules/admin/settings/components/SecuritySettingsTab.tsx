"use client";

import React from "react";
import { FormSelect } from "@/components/form/FormSelect";
import { Button } from "@/components/shared/Button";

const Toggle = ({ defaultChecked }: { defaultChecked?: boolean }) => (
  <label className="relative inline-flex h-[24px] w-[46px] shrink-0 cursor-pointer items-center">
    <input type="checkbox" defaultChecked={defaultChecked} className="peer sr-only" />
    <span className="absolute inset-0 rounded-full bg-[#D9D9D9] transition-colors peer-checked:bg-[#0063EF]" />
    <span className="absolute left-[2px] top-[2px] size-[20px] rounded-full bg-white shadow transition-transform peer-checked:translate-x-[22px]" />
  </label>
);

const sessionOptions = [
  { label: "30 minutes", value: "30" },
  { label: "1 hour", value: "60" },
  { label: "2 hours", value: "120" },
  { label: "4 hours", value: "240" },
  { label: "8 hours", value: "480" },
];

export const SecuritySettingsTab = () => {
  return (
    <div className="flex flex-col gap-[24px] w-full">
      <div>
        <h3 className="text-[24px] font-medium text-[#202020] tracking-[-0.48px] leading-[32px]">Security Settings</h3>
        <p className="text-[16px] font-normal text-[#606060] leading-[24px]">Manage security policies, authentication, and access controls</p>
      </div>

      <div className="border border-[#F0F0F0] p-[16px] rounded-[12px]">
        <div className="flex flex-col gap-[16px]">
          <FormSelect name="session" label="Session timeout" placeholder="Select timeout duration" options={sessionOptions} />
        </div>
      </div>

      <div className="border border-[#F0F0F0] p-[16px] rounded-[12px]">
        <span className="text-[14px] font-medium text-[#202020] tracking-[-0.28px] leading-[20px] block mb-[20px]">AUTHENTICATION</span>
        <div className="flex flex-col gap-[20px]">
          {[
            { title: "Two-factor authentication (2FA)", desc: "Require 2FA for all admin accounts" },
            { title: "Single sign-on (SSO)", desc: "Allow login via SAML/OIDC identity providers" },
            { title: "IP whitelisting", desc: "Restrict admin access to specific IP addresses" },
            { title: "Password expiry", desc: "Force password change every 90 days" },
          ].map((item) => (
            <div key={item.title} className="flex items-center justify-between">
              <div className="max-w-[436px]">
                <p className="text-[16px] font-normal text-[#202020] tracking-[-0.32px] leading-[24px]">{item.title}</p>
                <p className="text-[14px] font-normal text-[#606060] tracking-[-0.28px] leading-[20px]">{item.desc}</p>
              </div>
              <Toggle />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button className="h-[44px] px-[32px] text-[14px]">Save Changes</Button>
      </div>
    </div>
  );
};
