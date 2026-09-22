"use client";

import React from "react";
import { Search } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button as AppButton } from "@/components/shared/Button";
import {
  CATEGORY_ICON_OPTIONS,
  CategoryIcon,
  DEFAULT_CATEGORY_ICON,
} from "@/modules/categories/lib/categoryIcons";

interface CategoryIconPickerProps {

  value: string;
  onChange: (name: string) => void;
  disabled?: boolean;
}

export const CategoryIconPicker = ({
  value,
  onChange,
  disabled,
}: CategoryIconPickerProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const filteredOptions = React.useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return CATEGORY_ICON_OPTIONS;
    return CATEGORY_ICON_OPTIONS.filter(
      (option) =>
        option.label.toLowerCase().includes(term) || option.value.includes(term),
    );
  }, [search]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    
    if (!open) setSearch("");
  };

  const handleSelect = (name: string) => {
    onChange(name);
    handleOpenChange(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <AppButton
          type="button"
          variant="outline"
          size="icon"
          disabled={disabled}
          className="size-[48px] rounded-[12px] border-sd-grey-6 bg-white text-sd-grey-10 hover:bg-sd-grey-2"
          aria-label={
            value
              ? `Category icon: ${value}. Change icon`
              : "Select category icon"
          }
        >
          <CategoryIcon name={value} size={18} strokeWidth={1.7} />
        </AppButton>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={8}
        className="pointer-events-auto w-[340px] gap-[10px] rounded-[12px] border border-sd-grey-3 bg-white p-[12px] shadow-[0px_8px_20px_0px_rgba(0,0,0,0.14)]"
      >
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-[10px] top-1/2 -translate-y-1/2 text-sd-grey-9"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search icons"
            aria-label="Search icons"
            className="h-[36px] w-full rounded-[8px] border border-sd-grey-6 bg-white pl-[32px] pr-[10px] text-[13px] tracking-[-0.26px] text-sd-grey-12 placeholder:text-sd-grey-9 focus:border-sd-blue focus:outline-none"
          />
        </div>

        {filteredOptions.length === 0 ? (
          <p className="py-[16px] text-center text-[13px] text-sd-grey-9">
            No icons match “{search}”
          </p>
        ) : (
          <div className="grid max-h-[220px] grid-cols-8 gap-[4px] overflow-y-auto">
            {filteredOptions.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  title={option.label}
                  aria-label={option.label}
                  aria-pressed={isSelected}
                  onClick={() => handleSelect(option.value)}
                  className={`flex size-[32px] items-center justify-center rounded-[8px] transition-colors ${
                    isSelected
                      ? "bg-[var(--sd-blue-light)] text-sd-blue"
                      : "text-sd-grey-11 hover:bg-sd-grey-2"
                  }`}
                >
                  <CategoryIcon name={option.value} size={18} strokeWidth={1.7} />
                </button>
              );
            })}
          </div>
        )}

        <p className="text-[12px] tracking-[-0.24px] text-sd-grey-9">
          {value
            ? `Selected: ${value}`
            : `Defaults to ${DEFAULT_CATEGORY_ICON} if you skip this`}
        </p>
      </PopoverContent>
    </Popover>
  );
};
