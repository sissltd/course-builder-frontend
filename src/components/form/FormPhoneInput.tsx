"use client";

import React, { useMemo, useState } from "react";
import PhoneInput, {
  Country,
  Value,
  getCountryCallingCode,
} from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useController, useFormContext, useFormState } from "react-hook-form";
import type { Control, FieldValues } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ArrowDown2 } from "iconsax-react";
import { cn } from "@/lib/utils";

const FLAG_URL = "https://purecatamphetamine.github.io/country-flag-icons/3x2/{XX}.svg";

interface PhoneCountryOption {
  value?: string;
  label: string;
  divider?: boolean;
}

interface PhoneCountrySelectProps {
  value?: string;
  options?: PhoneCountryOption[];
  onChange?: (value?: string) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

const getCallingCode = (country: string) => {
  try {
    return getCountryCallingCode(country as Country);
  } catch {
    return "";
  }
};

const PhoneCountrySelect = ({
  value,
  options = [],
  onChange,
  disabled,
  readOnly,
}: PhoneCountrySelectProps) => {
  const [open, setOpen] = useState(false);

  const selectOptions = useMemo(
    () =>
      options
        .filter((option) => !option.divider && option.value)
        .map((option) => {
          const code = option.value as string;
          let label = option.label;
          try {
            label = `${option.label} (+${getCountryCallingCode(code as Country)})`;
          } catch {}
          return { label, value: code, searchValue: `${label} ${code}` };
        }),
    [options]
  );

  const callingCode = value ? getCallingCode(value) : "";
  const triggerText = value ? (callingCode ? `+${callingCode}` : value) : "Code";

  return (
    <div className="w-[76px] shrink-0 mr-[8px]">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            role="combobox"
            aria-expanded={open}
            disabled={disabled || readOnly}
            className="flex items-center justify-between gap-[4px] w-full h-[44px] text-body-sm tracking-[-0.28px] text-[#202020] disabled:opacity-50"
          >
            <span className="truncate">{triggerText}</span>
            <ArrowDown2
              size={16}
              color="#606060"
              variant="Linear"
              className="shrink-0"
            />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="p-[8px] bg-white border border-[#F0F0F0] rounded-[16px] min-w-[240px] w-max max-w-[320px]"
          align="start"
        >
          <Command className="bg-white">
            <CommandInput placeholder="Search country" className="text-[14px]" />
            <CommandList className="max-h-[300px] overflow-y-auto">
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {selectOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.searchValue}
                    onSelect={() => {
                      onChange?.(option.value === "" ? undefined : option.value);
                      setOpen(false);
                    }}
                    className="text-[14px] text-[#606060] cursor-pointer p-[8px] hover:bg-[#F0F0F0] flex items-center rounded-[8px] gap-[10px]"
                  >
                    <img
                      src={FLAG_URL.replace("{XX}", option.value)}
                      alt={option.label}
                      loading="lazy"
                      className="w-[24px] h-[16px] rounded-[2px] ring-1 ring-black/10 shrink-0 object-cover"
                    />
                    <span className="truncate flex-1">{option.label}</span>
                    <span className="text-sd-grey-11 shrink-0">+{getCallingCode(option.value)}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

interface FormPhoneInputProps {
  name: string;
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  containerClassName?: string;
  defaultCountry?: Country;
  disabled?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  isSuccess?: boolean;
  isFilled?: boolean;
  value?: Value;
  onChange?: (value?: Value) => void;
  onBlur?: () => void;
  onCountryChange?: (country?: Country) => void;
}

export const FormPhoneInput = (props: FormPhoneInputProps) => {
  // `useFormContext` returns null without a `FormProvider` rather than
  // throwing, so calling it is safe; `useController` does need a real control.
  // The two modes are separate components because a try/catch around a
  // conditional hook call breaks the rules of hooks.
  const control = useFormContext()?.control;

  return control ? (
    <ConnectedPhoneInput {...props} control={control} />
  ) : (
    <StandalonePhoneInput {...props} />
  );
};

type ConnectorProps = FormPhoneInputProps & {
  control?: Control<FieldValues>;
};

const ConnectedPhoneInput = ({
  control,
  onChange,
  onBlur,
  onCountryChange,
  error: externalError,
  ...props
}: ConnectorProps) => {
  const { field } = useController({ control, name: props.name });
  const { errors } = useFormState({ control });

  return (
    <PhoneInputView
      {...props}
      error={
        externalError ?? (errors[props.name]?.message as string | undefined)
      }
      value={(field.value as Value) ?? ""}
      onChange={(next) => {
        field.onChange(next ?? "");
        onChange?.(next);
      }}
      onBlur={() => {
        field.onBlur();
        onBlur?.();
      }}
      onCountryChange={onCountryChange ?? (() => {})}
    />
  );
};

const StandalonePhoneInput = ({
  value,
  onChange,
  onBlur,
  onCountryChange,
  ...props
}: ConnectorProps) => (
  <PhoneInputView
    {...props}
    value={value ?? ""}
    onChange={onChange ?? (() => {})}
    onBlur={onBlur ?? (() => {})}
    onCountryChange={onCountryChange ?? (() => {})}
  />
);

type PhoneInputViewProps = Omit<
  ConnectorProps,
  "control" | "value" | "onChange" | "onBlur" | "onCountryChange"
> & {
  value: Value;
  onChange: (value?: Value) => void;
  onBlur: () => void;
  onCountryChange: (country?: Country) => void;
};

const PhoneInputView = ({
  label,
  error: externalError,
  hint,
  required,
  placeholder,
  className,
  containerClassName,
  defaultCountry,
  disabled,
  readOnly,
  autoFocus,
  isSuccess,
  isFilled,
  value,
  onChange,
  onBlur,
  onCountryChange,
}: PhoneInputViewProps) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const hasValue = isFilled || (value !== undefined && value !== "");
  const fieldError = externalError;

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
      <PhoneInput
        className={cn(
          "h-[44px] bg-sd-grey-1 border border-sd-grey-6 rounded-lg pl-[16px] pr-[12px] transition-all",
          hasValue && !isFocused && "border-[1.5px] border-sd-grey-7",
          isFocused && "border-[1.5px] border-sd-blue ring-1 ring-sd-blue/20",
          fieldError && "border-[1.5px] border-[#FF5025]",
          isSuccess && "border-[1.5px] border-[#008500]",
          className
        )}
        numberInputProps={{
          className:
            "h-full bg-transparent min-w-0 flex-1 text-body-sm tracking-[-0.28px] placeholder:text-sd-grey-9 focus-visible:outline-none focus-visible:ring-0",
        }}
        countrySelectComponent={PhoneCountrySelect}
        addInternationalOption={false}
        value={value}
        onChange={onChange}
        defaultCountry={defaultCountry}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        autoFocus={autoFocus}
        onCountryChange={onCountryChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
          onBlur();
        }}
      />
      {fieldError ? (
        <p className="text-caption-xs text-[#FF5025]">{fieldError}</p>
      ) : (
        hint && <p className="text-caption-xs text-sd-grey-11">{hint}</p>
      )}
    </div>
  );
};
