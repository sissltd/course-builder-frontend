import React from "react";
import { Checkbox as ShadcnCheckbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface CheckboxProps extends React.ComponentProps<typeof ShadcnCheckbox> {
  label?: string;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ className, label, id, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-start gap-[12px]">
          <ShadcnCheckbox
            ref={ref}
            id={id}
            className={cn(
              "mt-[3px] data-checked:bg-sd-blue data-checked:border-sd-blue border-sd-grey-6",
              className
            )}
            {...props}
          />
          {label && (
            <label
              htmlFor={id}
              className="text-[14px] leading-[20px] text-sd-grey-11 font-medium cursor-pointer select-none"
            >
              {label}
            </label>
          )}
        </div>
        {error && <p className="text-caption-xs text-[#FF5025] ml-[28px]">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
