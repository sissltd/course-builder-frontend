"use client";

import React from "react";
import { Element3, RowVertical } from "iconsax-react";
import { cn } from "@/lib/utils";

export type CourseViewMode = "table" | "grid";

const OPTIONS: {
  key: CourseViewMode;
  label: string;
  Icon: typeof Element3;
}[] = [
  { key: "table", label: "Table", Icon: RowVertical },
  { key: "grid", label: "Grid", Icon: Element3 },
];

export const CourseViewToggle = ({
  value,
  onChange,
}: {
  value: CourseViewMode;
  onChange: (mode: CourseViewMode) => void;
}) => (
  <div
    role="group"
    aria-label="Course view"
    className="flex h-[40px] shrink-0 items-center gap-[4px] rounded-[10px] border border-sd-grey-6 bg-sd-grey-2 p-[4px]"
  >
    {OPTIONS.map(({ key, label, Icon }) => {
      const active = value === key;
      return (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          aria-pressed={active}
          title={`${label} view`}
          className={cn(
            "flex h-[32px] items-center gap-[6px] rounded-[8px] px-[12px] text-[14px] font-normal leading-[20px] transition-colors cursor-pointer",
            active
              ? "bg-sd-grey-1 font-medium text-sd-grey-12 shadow-[0px_1px_2px_rgba(0,0,0,0.06)]"
              : "text-sd-grey-11 hover:text-sd-grey-12",
          )}
        >
          <Icon
            size={18}
            variant={active ? "Bold" : "Linear"}
            color={active ? "var(--sd-blue)" : "var(--sd-grey-11)"}
          />
          <span className="hidden sm:inline">{label}</span>
        </button>
      );
    })}
  </div>
);
