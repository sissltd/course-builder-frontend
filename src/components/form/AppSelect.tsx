"use client";

import React, { useState, useRef } from "react";
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
import { TickCircle, ArrowDown2 } from "iconsax-react";

interface AppSelectProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  options: { label: React.ReactNode; value: string; searchValue?: string }[];
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  triggerClassName?: string;
  containerClassName?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyText?: string;
  clearable?: boolean;
  clearLabel?: string;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
}

export const AppSelect = ({
  label,
  error,
  hint,
  required,
  options = [],
  placeholder = "Select an option",
  value,
  onValueChange,
  className,
  triggerClassName,
  containerClassName,
  disabled,
  icon,
  prefix,
  suffix,
  searchable = false,
  searchPlaceholder = "Search...",
  emptyText = "No results found.",
  clearable = false,
  clearLabel = "None",
  hasMore = false,
  isLoadingMore = false,
  onLoadMore,
}: AppSelectProps) => {
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
      value={value}
      onValueChange={(val) => {
        if (val === "none") {
          onValueChange?.("");
        } else {
          onValueChange?.(val);
        }
      }}
      disabled={disabled}
    >
      <SelectTrigger
        className={cn(
          "h-[44px] w-full bg-sd-grey-1 border border-sd-grey-6 px-[16px] py-[12px] text-body-sm tracking-[-0.28px] focus:ring-0 focus:border-sd-grey-7 transition-all flex items-center gap-[8px]",
          value && "border-[1.5px] border-sd-grey-7",
          error && "border-[1.5px] border-[#FF5025] focus:border-[#FF5025]",
          triggerClassName
        )}
      >
        <div className="flex items-center gap-[8px] flex-1 truncate">
          {prefixElement && <div className="shrink-0">{prefixElement}</div>}
          <SelectValue placeholder={placeholder} />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-white border border-[#F0F0F0] rounded-[16px] min-w-[176px] w-max max-w-[320px] p-[8px]">
        {clearable && (
          <SelectItem value="none" className="text-muted-foreground italic flex items-center gap-[20px] p-[8px] pr-[8px] rounded-[8px] hover:bg-[#F0F0F0] cursor-pointer [&_svg]:hidden">
            {clearLabel}
          </SelectItem>
        )}
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value} className="flex items-center gap-[20px] p-[8px] pr-[8px] rounded-[8px] text-[#606060] hover:bg-[#F0F0F0] cursor-pointer text-[14px] [&_svg]:hidden">
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  const renderSearchableSelect = () => {
    const selectedOption = options.find((opt) => opt.value === value);

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
              value && "border-[1.5px] border-sd-grey-7",
              error && "border-[1.5px] border-[#FF5025] focus:border-[#FF5025]",
              triggerClassName
            )}
          >
            <div className="flex items-center gap-[8px] flex-1 truncate text-left">
              {prefixElement && <div className="shrink-0">{prefixElement}</div>}
              <span className="truncate text-[#606060]">{selectedOption ? selectedOption.label : placeholder}</span>
            </div>
            {suffix || <ArrowDown2 size={16} color="#606060" variant="Linear" className="shrink-0 opacity-70" />}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-[8px] bg-white border border-[#F0F0F0] rounded-[16px]  min-w-[176px] w-max max-w-[320px]"
          align="start"
        >
          <Command className="bg-white">
            <CommandInput placeholder={searchPlaceholder} className="text-[14px]" />
            <CommandList className="max-h-[300px] overflow-y-auto">
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {clearable && (
                  <CommandItem
                    value="none"
                    onSelect={() => {
                      onValueChange?.("");
                      setOpen(false);
                    }}
                    className="text-muted-foreground italic text-[14px] cursor-pointer p-[8px] hover:bg-[#F0F0F0] flex items-center rounded-[8px] gap-[20px]"
                  >
                    {clearLabel}
                  </CommandItem>
                )}
                {options.map((option) => {
                  const searchVal = option.searchValue ?? (typeof option.label === "string" ? option.label : String(option.value));
                  return (
                    <CommandItem
                      key={option.value}
                      value={searchVal}
                      onSelect={() => {
                        onValueChange?.(option.value);
                        setOpen(false);
                      }}
                      className="text-[14px] text-[#606060] cursor-pointer p-[8px] hover:bg-[#F0F0F0] flex items-center rounded-[8px] gap-[20px]"
                    >
                      <span className="truncate">{option.label}</span>
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

      {error ? (
        <p className="text-caption-xs text-[#FF5025]">{error}</p>
      ) : (
        hint && <p className="text-caption-xs text-sd-grey-11">{hint}</p>
      )}
    </div>
  );
};
