import React from "react";
import { useFormContext, useController, useFormState } from "react-hook-form";
import type { Control, FieldValues } from "react-hook-form";
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

export const FormTextarea = (props: FormTextareaProps) => {
  // `useFormContext` returns null without a `FormProvider` rather than
  // throwing, so calling it is safe; `useController` does need a real control.
  // The two modes are separate components because a try/catch around a
  // conditional hook call breaks the rules of hooks.
  const control = useFormContext()?.control;

  return control ? (
    <ConnectedTextarea {...props} control={control} />
  ) : (
    <StandaloneTextarea {...props} />
  );
};

type ConnectorProps = FormTextareaProps & {
  control?: Control<FieldValues>;
};

const ConnectedTextarea = ({
  control,
  onChange,
  onBlur,
  ...props
}: ConnectorProps) => {
  const { field } = useController({ control, name: props.name });
  const { errors } = useFormState({ control });

  return (
    <TextareaView
      {...props}
      value={(field.value as string) ?? ""}
      viewRef={field.ref}
      onChange={(e) => {
        field.onChange(e);
        onChange?.(e);
      }}
      onBlur={(e) => {
        field.onBlur();
        onBlur?.(e);
      }}
      viewError={
        (errors[props.name]?.message as string | undefined) ?? props.error
      }
    />
  );
};

const StandaloneTextarea = ({
  value,
  onChange,
  onBlur,
  ...props
}: ConnectorProps) => (
  <TextareaView
    {...props}
    value={value ?? ""}
    onChange={onChange ?? (() => {})}
    onBlur={onBlur ?? (() => {})}
  />
);

type TextareaViewProps = Omit<
  ConnectorProps,
  "control" | "value" | "onChange" | "onBlur"
> & {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  viewError?: string;
  viewRef?: React.Ref<HTMLTextAreaElement>;
};

const TextareaView = ({
  label, error: externalError, hint, required, placeholder, className,
  containerClassName, rows = 4, disabled, isFilled, maxLength, value, onChange,
  onBlur, viewError, viewRef, onFocus,
}: TextareaViewProps) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const hasValue = isFilled || (value !== undefined && value !== "");
  const fieldError = viewError ?? externalError;

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
        ref={viewRef}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur(e);
        }}
        value={value}
        onChange={onChange}
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
