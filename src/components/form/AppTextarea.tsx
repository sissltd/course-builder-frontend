import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface AppTextareaProps extends React.ComponentProps<typeof Textarea> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  containerClassName?: string;
  isFilled?: boolean;
}

export const AppTextarea = React.forwardRef<HTMLTextAreaElement, AppTextareaProps>(
  ({ label, error, hint, required, className, containerClassName, isFilled, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const hasValue = isFilled || (props.value !== undefined && props.value !== "");

    return (
      <div className={cn("flex flex-col gap-[6px] w-full", containerClassName)}>
        {label && (
          <div className="flex gap-[2px] items-start">
            <Label className="text-body-sm font-normal text-sd-grey-12 tracking-[-0.28px]">
              {label}
              {required && <span className="text-[#FF5025] ml-[2px]">*</span>}
            </Label>
          </div>
        )}
        <Textarea
          ref={ref}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          className={cn(
            "min-h-[140px] bg-sd-grey-1 border-sd-grey-6 px-[16px] py-[12px] text-body-sm placeholder:text-sd-grey-9 tracking-[-0.28px] transition-all resize-none outline-none",
            hasValue && !isFocused && "border-[1.5px] border-sd-grey-7",
            isFocused && "border-[1.5px] border-sd-blue ring-1 ring-sd-blue/20 focus-visible:border-sd-blue focus-visible:ring-1 focus-visible:ring-sd-blue/20",
            error && "border-[#FF5025] focus:border-[#FF5025]",
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-caption-xs text-[#FF5025]">{error}</p>
        ) : (
          hint && <p className="text-caption-xs text-sd-grey-11">{hint}</p>
        )}
      </div>
    );
  }
);

AppTextarea.displayName = "AppTextarea";
