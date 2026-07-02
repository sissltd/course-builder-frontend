"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
  password: string;
  confirmPassword?: string;
}

interface Requirement {
  label: string;
  met: boolean;
}

export const PasswordStrength = ({ password, confirmPassword }: PasswordStrengthProps) => {
  const requirements: Requirement[] = [
    { label: "minimum 8 characters", met: password.length >= 8 },
    { label: "one number", met: /\d/.test(password) },
    { label: "one uppercase character", met: /[A-Z]/.test(password) },
    { label: "one lowercase character", met: /[a-z]/.test(password) },
  ];

  if (confirmPassword !== undefined) {
    requirements.push({
      label: "passwords match",
      met: password.length > 0 && password === confirmPassword,
    });
  }

  return (
    <div className="flex flex-col gap-[4px]">
      {requirements.map((req) => (
        <div key={req.label} className="flex items-center gap-[8px]">
          <span
            className={cn(
              "size-[6px] rounded-full shrink-0 transition-colors duration-200",
              req.met ? "bg-[#22C55E]" : "bg-sd-grey-8"
            )}
          />
          <span
            className={cn(
              "text-caption-xs transition-colors duration-200 leading-[16px]",
              req.met ? "text-[#22C55E] font-medium" : "text-sd-grey-11"
            )}
          >
            {req.label}
          </span>
        </div>
      ))}
    </div>
  );
};
