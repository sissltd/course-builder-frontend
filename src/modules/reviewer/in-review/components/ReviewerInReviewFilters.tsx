"use client";

import React from "react";
import { format } from "date-fns";
import { ArrowDown2, Calendar2, Filter, SearchNormal1, Sort } from "iconsax-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface TriggerProps {
  icon: React.ReactNode;
  label: string;
  className?: string;
}

const FilterTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & TriggerProps
>(({ icon, label, className, type = "button", ...props }, ref) => {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "flex h-[40px] items-center gap-[12px] rounded-[10px] border border-sd-grey-6 bg-sd-grey-1 px-[16px] cursor-pointer hover:bg-sd-grey-2 transition-colors",
        className,
      )}
      {...props}
    >
      <span className="flex size-[20px] shrink-0 items-center justify-center text-sd-grey-11">
        {icon}
      </span>
      <span className="min-w-0 flex-1 truncate text-left text-[14px] font-normal leading-[20px] text-sd-grey-11">
        {label}
      </span>
      <ArrowDown2 size={16} variant="Linear" color="var(--sd-grey-11)" className="shrink-0" />
    </button>
  );
});

FilterTrigger.displayName = "FilterTrigger";

function DropdownShell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <PopoverContent
      align="start"
      sideOffset={10}
      className={cn(
        "w-[270px] rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 p-[12px] shadow-[0px_8px_24px_rgba(0,0,0,0.18)]",
        className,
      )}
    >
      {children}
    </PopoverContent>
  );
}

export const ReviewerInReviewFilters = () => {
  const categoryOptions = [
    "All",
    "Software Engineering",
    "Artificial Intelligence",
    "Leadership",
    "Finance",
    "Robotics",
  ];

  const difficultyOptions = [
    "All",
    "Beginner",
    "Intermediate",
    "Advanced",
  ];

  const reviewerOptions = [
    "All",
    "Osaite Emmanuel",
    "Ada Johnson",
    "Micheal Chen",
  ];

  const [categoryOpen, setCategoryOpen] = React.useState(false);
  const [difficultyOpen, setDifficultyOpen] = React.useState(false);
  const [reviewerOpen, setReviewerOpen] = React.useState(false);
  const [dateOpen, setDateOpen] = React.useState(false);

  const [category, setCategory] = React.useState("Category");
  const [difficulty, setDifficulty] = React.useState("Intermediate");
  const [reviewer, setReviewer] = React.useState("Reviewer");

  const [fromDate, setFromDate] = React.useState<Date | undefined>(undefined);
  const [toDate, setToDate] = React.useState<Date | undefined>(undefined);
  const [activeDateField, setActiveDateField] = React.useState<"from" | "to" | null>(null);

  const dateLabel = (date: Date | undefined) =>
    date ? format(date, "MM/dd/yyyy") : "10/10/2025";

  return (
    <div className="flex flex-col gap-[16px] w-full">
      <div className="flex flex-wrap items-center gap-[12px] w-full">
        {/* Search Field */}
        <label className="flex h-[40px] w-full max-w-[320px] sm:max-w-[400px] items-center gap-[12px] rounded-[10px] border border-sd-grey-6 bg-sd-grey-1 px-[16px]">
          <SearchNormal1 size={20} variant="Linear" color="var(--sd-grey-11)" />
          <input
            type="text"
            placeholder="Search course title, ID etc"
            className="w-full bg-transparent text-[14px] font-normal text-sd-grey-12 placeholder:text-sd-muted-text outline-none"
          />
        </label>

        {/* Category Dropdown */}
        <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
          <PopoverTrigger asChild>
            <FilterTrigger
              icon={<Filter size={20} variant="Linear" color="var(--sd-grey-11)" />}
              label={category}
              className="w-[150px]"
            />
          </PopoverTrigger>
          <DropdownShell className="w-[280px] px-[8px] py-[10px]">
            <label className="flex h-[36px] items-center gap-[10px] rounded-[8px] border border-sd-grey-6 bg-sd-grey-1 px-[12px]">
              <SearchNormal1 size={18} variant="Linear" color="var(--sd-grey-11)" />
              <input
                type="text"
                placeholder="Search category"
                className="w-full bg-transparent text-[14px] font-normal text-sd-grey-12 placeholder:text-sd-muted-text outline-none"
              />
            </label>
            <div className="mt-[8px] flex flex-col">
              {categoryOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setCategory(option);
                    setCategoryOpen(false);
                  }}
                  aria-pressed={category === option}
                  className="flex h-[34px] items-center rounded-[8px] px-[12px] text-left text-[14px] font-normal text-sd-grey-11 hover:bg-sd-grey-2 cursor-pointer"
                >
                  {option}
                </button>
              ))}
            </div>
          </DropdownShell>
        </Popover>

        {/* Difficulty Level Dropdown */}
        <Popover open={difficultyOpen} onOpenChange={setDifficultyOpen}>
          <PopoverTrigger asChild>
            <FilterTrigger
              icon={<Sort size={20} variant="Linear" color="var(--sd-grey-11)" />}
              label={difficulty}
              className="w-[170px]"
            />
          </PopoverTrigger>
          <DropdownShell className="w-[220px] px-[8px] py-[10px]">
            <div className="flex flex-col">
              {difficultyOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setDifficulty(option);
                    setDifficultyOpen(false);
                  }}
                  aria-pressed={difficulty === option}
                  className="flex h-[34px] items-center rounded-[8px] px-[12px] text-left text-[14px] font-normal text-sd-grey-11 hover:bg-sd-grey-2 cursor-pointer"
                >
                  {option}
                </button>
              ))}
            </div>
          </DropdownShell>
        </Popover>

        {/* Reviewer Dropdown */}
        <Popover open={reviewerOpen} onOpenChange={setReviewerOpen}>
          <PopoverTrigger asChild>
            <FilterTrigger
              icon={<Sort size={20} variant="Linear" color="var(--sd-grey-11)" />}
              label={reviewer}
              className="w-[160px]"
            />
          </PopoverTrigger>
          <DropdownShell className="w-[240px] px-[8px] py-[10px]">
            <label className="flex h-[36px] items-center gap-[10px] rounded-[8px] border border-sd-grey-6 bg-sd-grey-1 px-[12px]">
              <SearchNormal1 size={18} variant="Linear" color="var(--sd-grey-11)" />
              <input
                type="text"
                placeholder="Search user"
                className="w-full bg-transparent text-[14px] font-normal text-sd-grey-12 placeholder:text-sd-muted-text outline-none"
              />
            </label>
            <div className="mt-[8px] flex max-h-[260px] flex-col overflow-y-auto">
              {reviewerOptions.map((option, idx) => {
                if (option === "All") {
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setReviewer(option);
                        setReviewerOpen(false);
                      }}
                      aria-pressed={reviewer === option}
                      className="flex h-[34px] items-center rounded-[8px] px-[12px] text-left text-[14px] font-normal text-sd-grey-11 hover:bg-sd-grey-2 cursor-pointer"
                    >
                      {option}
                    </button>
                  );
                }

                const bgColors = ["bg-[#16A34A]", "bg-[#2563EB]", "bg-[#9333EA]"];
                const bgColor = bgColors[idx % bgColors.length];
                const initial = option.charAt(0).toUpperCase();

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setReviewer(option);
                      setReviewerOpen(false);
                    }}
                    aria-pressed={reviewer === option}
                    className="flex items-center gap-[12px] rounded-[8px] p-[8px] text-left hover:bg-sd-grey-2 cursor-pointer"
                  >
                    <div className={cn("flex size-[32px] shrink-0 items-center justify-center rounded-full text-[14px] font-medium text-white", bgColor)}>
                      {initial}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] font-normal leading-[20px] text-sd-grey-12">
                        {option}
                      </span>
                      <span className="text-[12px] font-normal leading-[16px] text-[#888888]">
                        Reviewer (Verifier)
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </DropdownShell>
        </Popover>

        {/* Date Dropdown */}
        <Popover
          open={dateOpen}
          onOpenChange={(open) => {
            setDateOpen(open);
            if (!open) {
              setActiveDateField(null);
            }
          }}
        >
          <PopoverTrigger asChild>
            <FilterTrigger
              icon={<Calendar2 size={20} variant="Linear" color="var(--sd-grey-11)" />}
              label="Date"
              className="w-[122px]"
              onClick={() => {
                setDateOpen(true);
                setActiveDateField(null);
              }}
            />
          </PopoverTrigger>
          <DropdownShell className="w-[310px] px-[8px] py-[10px]">
            <div className="flex flex-col gap-[10px]">
              <div className="text-[14px] font-normal text-sd-grey-11 leading-[20px]">
                Date range
              </div>

              <button
                type="button"
                onClick={() =>
                  setActiveDateField((current) => (current === "from" ? null : "from"))
                }
                className="flex h-[38px] items-center gap-[10px] rounded-[10px] border border-sd-grey-3 bg-sd-grey-1 px-[12px] cursor-pointer"
              >
                <span className="text-[14px] font-normal text-sd-grey-12">From</span>
                <span className="text-[14px] font-normal text-sd-muted-text">
                  {dateLabel(fromDate)}
                </span>
                <Calendar2
                  size={18}
                  variant="Linear"
                  color="var(--sd-grey-11)"
                  className="ml-auto shrink-0"
                />
              </button>

              {activeDateField === "from" && (
                <div className="rounded-[10px] border border-sd-grey-3 bg-sd-grey-1 p-[6px]">
                  <Calendar
                    mode="single"
                    selected={fromDate}
                    onSelect={(date) => {
                      setFromDate(date);
                      if (date) {
                        setActiveDateField(null);
                      }
                    }}
                  />
                </div>
              )}

              <button
                type="button"
                onClick={() =>
                  setActiveDateField((current) => (current === "to" ? null : "to"))
                }
                className="flex h-[38px] items-center gap-[10px] rounded-[10px] border border-sd-grey-3 bg-sd-grey-1 px-[12px] cursor-pointer"
              >
                <span className="text-[14px] font-normal text-sd-grey-12">To</span>
                <span className="text-[14px] font-normal text-sd-muted-text">
                  {dateLabel(toDate)}
                </span>
                <Calendar2
                  size={18}
                  variant="Linear"
                  color="var(--sd-grey-11)"
                  className="ml-auto shrink-0"
                />
              </button>

              {activeDateField === "to" && (
                <div className="rounded-[10px] border border-sd-grey-3 bg-sd-grey-1 p-[6px]">
                  <Calendar
                    mode="single"
                    selected={toDate}
                    onSelect={(date) => {
                      setToDate(date);
                      if (date) {
                        setActiveDateField(null);
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </DropdownShell>
        </Popover>
      </div>
    </div>
  );
};
