import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface AppCheckboxProps extends React.ComponentProps<typeof Checkbox> {
  label?: string;
  error?: string;
}

export const AppCheckbox = React.forwardRef<HTMLButtonElement, AppCheckboxProps>(
  ({ className, label, id, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-start gap-[12px]">
          <Checkbox
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

AppCheckbox.displayName = "AppCheckbox";
