import React from "react";
import { useFormContext, useController } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormTextareaProps {
  name: string;
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  containerClassName?: string;
  rows?: number;
  disabled?: boolean;
  isFilled?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  maxLength?: number;
}

export const FormTextarea = ({ name, label, error: externalError, hint, required, placeholder, className, containerClassName, rows = 4, disabled, isFilled, value: externalValue, onChange: externalOnChange, onBlur: externalOnBlur, onFocus: externalOnFocus, maxLength }: FormTextareaProps) => {
  let fieldValue = externalValue ?? "";
  let fieldOnChange = externalOnChange || (() => {});
  let fieldOnBlur = externalOnBlur || (() => {});
  let fieldRef: any = undefined;
  let fieldError = externalError;

  try {
    const { control, formState: { errors } } = useFormContext();
    const { field } = useController({ name, control });
    fieldValue = field.value ?? "";
    fieldOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      field.onChange(e);
      externalOnChange?.(e);
    };
    fieldOnBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      field.onBlur();
      externalOnBlur?.(e);
    };
    fieldRef = field.ref;
    fieldError = fieldError || (errors[name]?.message as string | undefined);
  } catch {}

  const [isFocused, setIsFocused] = React.useState(false);
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
      <Textarea
        ref={fieldRef}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
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
        className={cn(
          "min-h-[140px] bg-sd-grey-1 border-sd-grey-6 px-[16px] py-[12px] text-body-sm placeholder:text-sd-grey-9 tracking-[-0.28px] transition-all resize-none outline-none",
          hasValue && !isFocused && "border-[1.5px] border-sd-grey-7",
          isFocused && "border-[1.5px] border-sd-blue ring-1 ring-sd-blue/20 focus-visible:border-sd-blue focus-visible:ring-1 focus-visible:ring-sd-blue/20",
          fieldError && "border-[#FF5025] focus:border-[#FF5025]",
          className
        )}
      />
      {fieldError ? (
        <p className="text-caption-xs text-[#FF5025]">{fieldError}</p>
      ) : (
        hint && <p className="text-caption-xs text-sd-grey-11">{hint}</p>
      )}
    </div>
  );
};
