"use client";

import React, { useState } from "react";
import { Eye, EyeSlash } from "iconsax-react";

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
  return (
    <div className="flex flex-col gap-[28px]">
      <div>
        <h2 className="text-[20px] font-semibold text-[#202020] tracking-[-0.4px] leading-[28px]">Log in &amp; Security</h2>
        <p className="text-[14px] text-[#636363] mt-[4px]">Manage your email address and password</p>
      </div>

      {/* Email */}
      <div className="flex flex-col gap-[8px]">
        <label className="text-[14px] text-[#202020] tracking-[-0.28px] font-semibold">Email address</label>
        <div className="flex items-center gap-[12px]">
          <input
            readOnly
            defaultValue="emmanuelosaite@gmail.com"
            className="flex-1 h-[44px] px-[16px] border border-[#D9D9D9] rounded-[8px] text-[14px] text-[#636363] bg-white outline-none cursor-default"
          />
        </div>
        <div className="flex justify-end">
          <button className="h-[36px] px-[18px] border border-[#0063EF] rounded-[8px] text-[14px] text-[#0063EF] hover:bg-[#EBF3FF] transition-colors font-medium">
            Change email
          </button>
        </div>
      </div>

      <div className="h-px bg-[#F0F0F0]" />

      {/* Password */}
      <div className="flex flex-col gap-[16px]">
        <p className="text-[16px] font-semibold text-[#202020] tracking-[-0.32px]">Password</p>
        <PasswordInput label="Current password" />
        <PasswordInput label="New password" />
        <PasswordInput label="Re-enter new password" />
        <div className="flex justify-end">
          <button className="h-[36px] px-[20px] border border-[#0063EF] rounded-[8px] text-[14px] text-[#0063EF] hover:bg-[#EBF3FF] transition-colors font-medium">
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
};
