"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const Switch = ({ checked, onChange, disabled }: SwitchProps) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-sd-blue focus-visible:ring-offset-2",
        checked ? "bg-sd-blue" : "bg-sd-grey-4",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      <span className="sr-only">Toggle switch</span>
      <span
        className={cn(
          "pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
          checked ? "translate-x-[20px]" : "translate-x-0"
        )}
      />
    </button>
  );
};
