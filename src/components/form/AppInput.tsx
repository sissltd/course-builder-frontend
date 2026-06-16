import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface AppInputProps extends React.ComponentProps<typeof Input> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  containerClassName?: string;
  isSuccess?: boolean;
  isFilled?: boolean;
}

export const AppInput = React.forwardRef<HTMLInputElement, AppInputProps>(
  (
    {
      label,
      error,
      hint,
      required,
      className,
      type,
      leftElement,
      rightElement,
      containerClassName,
      isSuccess,
      isFilled,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

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
        <div className="relative flex items-stretch">
          {leftElement && (
            <div className={cn(
              "flex items-center px-[16px] bg-sd-grey-2 border border-r-0 border-sd-grey-6 rounded-l-lg text-sd-grey-11 text-body-sm shrink-0 transition-all",
              (isFocused || hasValue || error || isSuccess) && "border-[1.5px]",
              error && "border-[#FF5025]",
              isSuccess && "border-[#008500]"
            )}>
              {leftElement}
            </div>
          )}
          <Input
            ref={ref}
            type={inputType}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            className={cn(
              "h-[44px] bg-sd-grey-1 border-sd-grey-6 px-[16px] py-[12px] text-body-sm placeholder:text-sd-grey-9 tracking-[-0.28px] focus-visible:ring-0 focus-visible:outline-none transition-all",
              hasValue && !isFocused && "border-[1.5px] border-sd-grey-7",
              isFocused && "border-[1.5px] border-sd-blue ring-1 ring-sd-blue/20",
              leftElement && "rounded-l-none",
              (rightElement || isPassword) && "pr-[60px]",
              error && "border-[1.5px] border-[#FF5025] focus-visible:border-[#FF5025] ring-0",
              isSuccess && "border-[1.5px] border-[#008500] focus-visible:border-[#008500] ring-0",
              className
            )}
            {...props}
          />
          {isPassword ? (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-[16px] top-1/2 -translate-y-1/2 text-[14px] text-sd-grey-11 underline cursor-pointer hover:text-sd-grey-12 font-sans"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          ) : (
            rightElement && (
              <div className="absolute right-[16px] top-1/2 -translate-y-1/2 z-10 flex items-center justify-center">
                {rightElement}
              </div>
            )
          )}
        </div>
        {error ? (
          <p className="text-caption-xs text-[#FF5025]">{error}</p>
        ) : (
          hint && <p className="text-caption-xs text-sd-grey-11">{hint}</p>
        )}
      </div>
    );
  }
);

AppInput.displayName = "AppInput";
