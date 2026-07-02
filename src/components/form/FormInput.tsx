import React from "react";
import { useFormContext, useController } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormInputProps {
  name: string;
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  placeholder?: string;
  type?: string;
  className?: string;
  containerClassName?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  disabled?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  isSuccess?: boolean;
  isFilled?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  maxLength?: number;
  min?: string;
  max?: string;
}

export const FormInput = ({ name, label, error: externalError, hint, required, placeholder, type = "text", className, containerClassName, leftElement, rightElement, disabled, readOnly, autoFocus, isSuccess, isFilled, value: externalValue, onChange: externalOnChange, onBlur: externalOnBlur, onKeyDown, onFocus: externalOnFocus, maxLength, min, max }: FormInputProps) => {
  let fieldValue = externalValue ?? "";
  let fieldOnChange = externalOnChange || (() => {});
  let fieldOnBlur = externalOnBlur || (() => {});
  let fieldRef: any = undefined;
  let fieldError = externalError;

  try {
    const { control, formState: { errors } } = useFormContext();
    const { field } = useController({ name, control });
    fieldValue = field.value ?? "";
    fieldOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      field.onChange(e);
      externalOnChange?.(e);
    };
    fieldOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      field.onBlur();
      externalOnBlur?.(e);
    };
    fieldRef = field.ref;
    fieldError = fieldError || (errors[name]?.message as string | undefined);
  } catch {
  }

  const [showPassword, setShowPassword] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  const hasValue = isFilled || (fieldValue !== undefined && fieldValue !== "");

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
            (isFocused || hasValue || fieldError || isSuccess) && "border-[1.5px]",
            fieldError && "border-[#FF5025]",
            isSuccess && "border-[#008500]"
          )}>
            {leftElement}
          </div>
        )}
        <Input
          ref={fieldRef}
          type={inputType}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          autoFocus={autoFocus}
          maxLength={maxLength}
          min={min}
          max={max}
          onFocus={(e) => {
            setIsFocused(true);
            externalOnFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            fieldOnBlur(e);
          }}
          value={fieldValue}
          onChange={fieldOnChange}
          onKeyDown={onKeyDown}
          className={cn(
            "h-[44px] bg-sd-grey-1 border-sd-grey-6 px-[16px] py-[12px] text-body-sm placeholder:text-sd-grey-9 tracking-[-0.28px] focus-visible:ring-0 focus-visible:outline-none transition-all",
            hasValue && !isFocused && "border-[1.5px] border-sd-grey-7",
            isFocused && "border-[1.5px] border-sd-blue ring-1 ring-sd-blue/20",
            leftElement && "rounded-l-none",
            (rightElement || isPassword) && "pr-[60px]",
            fieldError && "border-[1.5px] border-[#FF5025] focus-visible:border-[#FF5025] ring-0",
            isSuccess && "border-[1.5px] border-[#008500] focus-visible:border-[#008500] ring-0",
            className
          )}
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
      {fieldError ? (
        <p className="text-caption-xs text-[#FF5025]">{fieldError}</p>
      ) : (
        hint && <p className="text-caption-xs text-sd-grey-11">{hint}</p>
      )}
    </div>
  );
};
