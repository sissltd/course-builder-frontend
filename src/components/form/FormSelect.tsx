import React, { useState, useRef } from "react";
import { useFormContext, useController, useFormState } from "react-hook-form";
import type { Control, FieldValues } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowDown2 } from "iconsax-react";

interface FormSelectOption {
  label: React.ReactNode;
  value: string;
  searchValue?: string;
}

// Radix throws while mounting an item with an empty value, so an option that
// means "no selection" (`value: ""`) is rendered under this sentinel instead
// and mapped back to `""` when it is picked.
const EMPTY_OPTION_VALUE = "__empty_option__";
const CLEAR_OPTION_VALUE = "none";

const toItemValue = (value: string) =>
  value === "" ? EMPTY_OPTION_VALUE : value;

const fromItemValue = (value: string) =>
  value === EMPTY_OPTION_VALUE ? "" : value;

interface FormSelectProps {
  name: string;
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  options: FormSelectOption[];
  placeholder?: string;
  triggerClassName?: string;
  containerClassName?: string;
  disabled?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyText?: string;
  clearable?: boolean;
  clearLabel?: string;
  icon?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  triggerValue?: (option?: FormSelectOption) => React.ReactNode;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
  value?: string;
  onValueChange?: (value: string) => void;
}

export const FormSelect = (props: FormSelectProps) => {
  // `useFormContext` returns null without a `FormProvider` rather than
  // throwing, so calling it is safe; `useController` does need a real control.
  // The two modes are separate components because a try/catch around a
  // conditional hook call breaks the rules of hooks.
  const control = useFormContext()?.control;

  return control ? (
    <ConnectedSelect {...props} control={control} />
  ) : (
    <StandaloneSelect {...props} />
  );
};

type ConnectorProps = FormSelectProps & {
  control?: Control<FieldValues>;
};

const ConnectedSelect = ({
  control,
  value: externalValue,
  onValueChange,
  error: externalError,
  ...props
}: ConnectorProps) => {
  const { field } = useController({ control, name: props.name });
  const { errors } = useFormState({ control });
  const isControlled = externalValue !== undefined;

  return (
    <SelectView
      {...props}
      error={
        externalError ?? (errors[props.name]?.message as string | undefined)
      }
      value={isControlled ? externalValue : ((field.value as string) ?? "")}
      onValueChange={(next) => {
        if (!isControlled) field.onChange(next === "none" ? "" : next);
        onValueChange?.(next);
      }}
    />
  );
};

const StandaloneSelect = ({
  value = "",
  onValueChange,
  ...props
}: ConnectorProps) => (
  <SelectView
    {...props}
    value={value}
    onValueChange={onValueChange ?? (() => {})}
  />
);

type SelectViewProps = Omit<
  ConnectorProps,
  "control" | "onValueChange" | "value"
> & {
  value: string;
  onValueChange: (value: string) => void;
};

const SelectView = ({
  label, error: externalError, hint, required, options = [],
  placeholder = "Select an option", triggerClassName, containerClassName,
  disabled, searchable = false, searchPlaceholder = "Search...",
  emptyText = "No results found.", clearable = false, clearLabel = "None", icon,
  prefix, suffix, triggerValue, hasMore = false, isLoadingMore = false,
  onLoadMore, value, onValueChange,
}: SelectViewProps) => {
  const fieldValue = value;
  const fieldOnChange = onValueChange;
  const fieldError = externalError;

  const [open, setOpen] = useState(false);
  const [triggerWidth, setTriggerWidth] = useState<number>(0);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen && triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth);
    }
    setOpen(isOpen);
  };

  const prefixElement = prefix || icon;

  const renderSelect = () => (
    <Select
      value={fieldValue}
      onValueChange={(val) => {
        if (val === CLEAR_OPTION_VALUE) {
          fieldOnChange("");
        } else {
          fieldOnChange(fromItemValue(val));
        }
      }}
      disabled={disabled}
    >
      <SelectTrigger
        className={cn(
          "h-[44px] w-full bg-sd-grey-1 border border-sd-grey-6 px-[16px] py-[12px] text-body-sm tracking-[-0.28px] focus:ring-0 focus:border-sd-grey-7 transition-all flex items-center gap-[8px]",
          fieldValue && "border-[1.5px] border-sd-grey-7",
          fieldError && "border-[1.5px] border-[#FF5025] focus:border-[#FF5025]",
          triggerClassName
        )}
      >
        <div className="flex items-center gap-[8px] flex-1 truncate">
          {prefixElement && <div className="shrink-0">{prefixElement}</div>}
          <SelectValue placeholder={placeholder} />
        </div>
      </SelectTrigger>
      <SelectContent position="popper" className="bg-white border border-[#F0F0F0] rounded-[16px] w-[var(--radix-select-trigger-width)] min-w-[176px] p-[8px] pl-[16px]">
        {clearable && (
          <SelectItem value={CLEAR_OPTION_VALUE} className="text-muted-foreground italic flex items-center gap-[20px] p-[8px] pr-[8px] rounded-[8px] hover:bg-[#F0F0F0] cursor-pointer [&_svg]:hidden">
            <span className="truncate min-w-0 w-full">{clearLabel}</span>
          </SelectItem>
        )}
        {options.map((option) => (
          <SelectItem key={option.value} value={toItemValue(option.value)} className="flex items-center gap-[20px] p-[8px] pr-[8px] rounded-[8px] text-[#606060] hover:bg-[#F0F0F0] cursor-pointer text-[14px] [&_svg]:hidden">
            <span className="truncate min-w-0 w-full">{option.label}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  const renderSearchableSelect = () => {
    const selectedOption = options.find((opt) => opt.value === fieldValue);

    return (
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            ref={triggerRef}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "h-[44px] w-full bg-sd-grey-1 border border-sd-grey-6 px-[16px] py-[12px] text-body-sm tracking-[-0.28px] focus:ring-0 focus:border-sd-grey-7 transition-all flex items-center justify-between gap-[8px] font-normal hover:bg-sd-grey-2",
              fieldValue && "border-[1.5px] border-sd-grey-7",
              fieldError && "border-[1.5px] border-[#FF5025] focus:border-[#FF5025]",
              triggerClassName
            )}
          >
            <div className="flex items-center gap-[8px] flex-1 truncate text-left">
              {prefixElement && <div className="shrink-0">{prefixElement}</div>}
              <span className="truncate text-[#606060]">{triggerValue ? triggerValue(selectedOption) : selectedOption ? selectedOption.label : placeholder}</span>
            </div>
            {suffix || <ArrowDown2 size={16} color="#606060" variant="Linear" className="shrink-0 opacity-70" />}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-[8px] bg-white border border-[#F0F0F0] rounded-[16px] min-w-[176px]"
          style={{ width: triggerWidth || undefined }}
          align="start"
        >
          <Command className="bg-white">
            <CommandInput placeholder={searchPlaceholder} className="text-[14px]" />
            <CommandList className="max-h-[300px] overflow-y-auto">
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {clearable && (
                  <CommandItem
                    value={CLEAR_OPTION_VALUE}
                    onSelect={() => {
                      fieldOnChange("");
                      setOpen(false);
                    }}
                    className="text-muted-foreground italic text-[14px] cursor-pointer p-[8px] hover:bg-[#F0F0F0] flex items-center rounded-[8px] gap-[20px]"
                  >
                    <span className="truncate min-w-0 flex-1">{clearLabel}</span>
                  </CommandItem>
                )}
                {options.map((option) => {
                  const searchVal = option.searchValue ?? (typeof option.label === "string" ? option.label : String(option.value));
                  return (
                    <CommandItem
                      key={option.value}
                      value={searchVal}
                      onSelect={() => {
                        fieldOnChange(option.value);
                        setOpen(false);
                      }}
                      className="text-[14px] text-[#606060] cursor-pointer p-[8px] hover:bg-[#F0F0F0] flex items-center rounded-[8px] gap-[20px]"
                    >
                      <span className="truncate min-w-0 flex-1">{option.label}</span>
                    </CommandItem>
                  );
                })}
                {hasMore && onLoadMore && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full mt-1 text-[#0A60E1] hover:text-[#0A60E1]/80 hover:bg-[#F5F9FF] h-[36px] text-[12px]"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onLoadMore();
                    }}
                    disabled={isLoadingMore}
                  >
                    {isLoadingMore ? "Loading..." : "Show more"}
                  </Button>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  };

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

      {searchable ? renderSearchableSelect() : renderSelect()}

      {fieldError ? (
        <p className="text-caption-xs text-[#FF5025]">{fieldError}</p>
      ) : (
        hint && <p className="text-caption-xs text-sd-grey-11">{hint}</p>
      )}
    </div>
  );
};
