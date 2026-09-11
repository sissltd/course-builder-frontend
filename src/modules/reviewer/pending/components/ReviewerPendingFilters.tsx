"use client";

import React, { useState, useMemo, forwardRef } from "react";
import { format } from "date-fns";
import { ArrowDown2, Calendar2, Filter, SearchNormal1, Sort } from "iconsax-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useGetCategoriesQuery } from "@/modules/creator/courses/api/categoriesApi";

interface TriggerProps {
  icon: React.ReactNode;
  label: string;
  className?: string;
}

export interface ReviewerPendingFiltersProps {
  search?: string;
  onSearchChange?: (search: string) => void;
  category?: string;
  onCategoryChange?: (categoryId: string) => void;
  difficulty?: string;
  onDifficultyChange?: (difficulty: string) => void;
  fromDate?: Date | undefined;
  onFromDateChange?: (date: Date | undefined) => void;
  toDate?: Date | undefined;
  onToDateChange?: (date: Date | undefined) => void;
  secondaryLabel?: string;
  secondaryOptions?: string[];
  onSecondaryChange?: (value: string) => void;
}

const FilterTrigger = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & TriggerProps
>(({ icon, label, className, type = "button", ...props }, ref) => {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "flex h-[40px] items-center gap-[12px] rounded-[10px] border border-sd-grey-6 bg-sd-grey-1 px-[16px] cursor-pointer transition-colors hover:bg-sd-grey-2/50",
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
        "w-[270px] rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 p-[12px] shadow-[0px_8px_24px_rgba(0,0,0,0.18)] z-50",
        className,
      )}
    >
      {children}
    </PopoverContent>
  );
}

const DEFAULT_DIFFICULTY_OPTIONS = [
  { label: "All", value: "" },
  { label: "Beginner", value: "BEGINNER" },
  { label: "Intermediate", value: "INTERMEDIATE" },
  { label: "Advanced", value: "ADVANCED" },
];

export const ReviewerPendingFilters = ({
  search: controlledSearch,
  onSearchChange,
  category: controlledCategory,
  onCategoryChange,
  difficulty: controlledDifficulty,
  onDifficultyChange,
  fromDate: controlledFromDate,
  onFromDateChange,
  toDate: controlledToDate,
  onToDateChange,
  secondaryLabel = "Difficulty level",
  secondaryOptions,
  onSecondaryChange,
}: ReviewerPendingFiltersProps) => {
  // Fallback local states if not controlled
  const [localSearch, setLocalSearch] = useState("");
  const [localCategory, setLocalCategory] = useState("");
  const [localDifficulty, setLocalDifficulty] = useState("");
  const [localFromDate, setLocalFromDate] = useState<Date | undefined>(undefined);
  const [localToDate, setLocalToDate] = useState<Date | undefined>(undefined);

  const search = controlledSearch !== undefined ? controlledSearch : localSearch;
  const category = controlledCategory !== undefined ? controlledCategory : localCategory;
  const difficulty = controlledDifficulty !== undefined ? controlledDifficulty : localDifficulty;
  const fromDate = controlledFromDate !== undefined ? controlledFromDate : localFromDate;
  const toDate = controlledToDate !== undefined ? controlledToDate : localToDate;

  const handleSearch = (val: string) => {
    if (onSearchChange) onSearchChange(val);
    else setLocalSearch(val);
  };

  const handleCategory = (val: string) => {
    if (onCategoryChange) onCategoryChange(val);
    else setLocalCategory(val);
  };

  const handleDifficulty = (val: string) => {
    if (onDifficultyChange) onDifficultyChange(val);
    else if (onSecondaryChange) onSecondaryChange(val);
    else setLocalDifficulty(val);
  };

  const handleFromDate = (val: Date | undefined) => {
    if (onFromDateChange) onFromDateChange(val);
    else setLocalFromDate(val);
  };

  const handleToDate = (val: Date | undefined) => {
    if (onToDateChange) onToDateChange(val);
    else setLocalToDate(val);
  };

  const { data: categoriesData } = useGetCategoriesQuery();
  const categories = useMemo(() => {
    return categoriesData?.data?.results ?? [];
  }, [categoriesData]);

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [secondaryOpen, setSecondaryOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [activeDateField, setActiveDateField] = useState<"from" | "to" | null>(null);
  const [categorySearch, setCategorySearch] = useState("");
  const [userSearch, setUserSearch] = useState("");

  const filteredCategories = useMemo(() => {
    if (!categorySearch.trim()) return categories;
    return categories.filter((c) =>
      c.name.toLowerCase().includes(categorySearch.toLowerCase()),
    );
  }, [categories, categorySearch]);

  const categoryLabel = useMemo(() => {
    if (!category) return "Category";
    const found = categories.find((c) => c.id === category);
    return found ? found.name : "Category";
  }, [category, categories]);

  const secondaryTriggerLabel = useMemo(() => {
    if (!difficulty) return secondaryLabel;
    if (secondaryOptions) {
      return difficulty;
    }
    const found = DEFAULT_DIFFICULTY_OPTIONS.find((opt) => opt.value === difficulty);
    return found && found.value !== "" ? found.label : secondaryLabel;
  }, [difficulty, secondaryLabel, secondaryOptions]);

  const dateFilterLabel = useMemo(() => {
    if (fromDate && toDate) {
      return `${format(fromDate, "MM/dd")} - ${format(toDate, "MM/dd")}`;
    }
    if (fromDate) {
      return `From ${format(fromDate, "MM/dd")}`;
    }
    if (toDate) {
      return `To ${format(toDate, "MM/dd")}`;
    }
    return "Date";
  }, [fromDate, toDate]);

  const isVerifierDropdown = secondaryLabel === "Verifier";

  return (
    <div className="flex flex-col gap-[16px]">
      <div className="flex flex-wrap items-start gap-[12px]">
        {/* Search */}
        <label className="flex h-[40px] w-full max-w-[487px] items-center gap-[12px] rounded-[10px] border border-sd-grey-6 bg-sd-grey-1 px-[16px]">
          <SearchNormal1 size={20} variant="Linear" color="var(--sd-grey-11)" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search course title, ID etc"
            className="w-full bg-transparent text-[14px] font-normal text-sd-grey-12 placeholder:text-sd-muted-text outline-none"
          />
        </label>

        {/* Category Filter */}
        <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
          <PopoverTrigger asChild>
            <FilterTrigger
              icon={<Filter size={20} variant="Linear" color="var(--sd-grey-11)" />}
              label={categoryLabel}
              className="w-[170px]"
            />
          </PopoverTrigger>
          <DropdownShell className="w-[302px] px-[8px] py-[10px]">
            <label className="flex h-[36px] items-center gap-[10px] rounded-[8px] border border-sd-grey-6 bg-sd-grey-1 px-[12px]">
              <SearchNormal1 size={18} variant="Linear" color="var(--sd-grey-11)" />
              <input
                type="text"
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                placeholder="Search category"
                className="w-full bg-transparent text-[14px] font-normal text-sd-grey-12 placeholder:text-sd-muted-text outline-none"
              />
            </label>
            <div className="mt-[8px] flex max-h-[220px] flex-col overflow-y-auto">
              <button
                type="button"
                onClick={() => {
                  handleCategory("");
                  setCategoryOpen(false);
                }}
                aria-pressed={category === ""}
                className={cn(
                  "flex h-[34px] items-center rounded-[8px] px-[12px] text-left text-[14px] font-normal transition-colors cursor-pointer",
                  category === ""
                    ? "bg-sd-grey-3 text-sd-grey-12 font-medium"
                    : "text-sd-grey-11 hover:bg-sd-grey-2",
                )}
              >
                All Categories
              </button>
              {filteredCategories.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    handleCategory(item.id);
                    setCategoryOpen(false);
                  }}
                  aria-pressed={category === item.id}
                  className={cn(
                    "flex h-[34px] items-center rounded-[8px] px-[12px] text-left text-[14px] font-normal transition-colors cursor-pointer",
                    category === item.id
                      ? "bg-sd-grey-3 text-sd-grey-12 font-medium"
                      : "text-sd-grey-11 hover:bg-sd-grey-2",
                  )}
                >
                  <span className="truncate">{item.name}</span>
                </button>
              ))}
            </div>
          </DropdownShell>
        </Popover>

        {/* Difficulty / Secondary Filter */}
        <Popover open={secondaryOpen} onOpenChange={setSecondaryOpen}>
          <PopoverTrigger asChild>
            <FilterTrigger
              icon={<Sort size={20} variant="Linear" color="var(--sd-grey-11)" />}
              label={secondaryTriggerLabel}
              className={cn("w-[180px]", isVerifierDropdown && "w-[200px]")}
            />
          </PopoverTrigger>
          <DropdownShell
            className={cn(
              "px-[8px] py-[10px]",
              isVerifierDropdown ? "w-[280px]" : "w-[200px]",
            )}
          >
            {isVerifierDropdown ? (
              <>
                <label className="flex h-[36px] items-center gap-[10px] rounded-[8px] border border-sd-grey-6 bg-sd-grey-1 px-[12px]">
                  <SearchNormal1 size={18} variant="Linear" color="var(--sd-grey-11)" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search user"
                    className="w-full bg-transparent text-[14px] font-normal text-sd-grey-12 placeholder:text-sd-muted-text outline-none"
                  />
                </label>
                <div className="mt-[8px] flex max-h-[260px] flex-col overflow-y-auto">
                  <button
                    type="button"
                    onClick={() => {
                      handleDifficulty("");
                      setSecondaryOpen(false);
                    }}
                    className="flex h-[34px] items-center rounded-[8px] px-[12px] text-left text-[14px] font-normal text-sd-grey-11 hover:bg-sd-grey-2 cursor-pointer"
                  >
                    All
                  </button>
                  {(secondaryOptions ?? [])
                    .filter((opt) => opt.toLowerCase().includes(userSearch.toLowerCase()))
                    .map((opt, idx) => {
                      const bgColors = ["bg-[#16A34A]", "bg-[#2563EB]", "bg-[#9333EA]"];
                      const bgColor = bgColors[idx % bgColors.length];
                      const initial = opt.charAt(0).toUpperCase();

                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            handleDifficulty(opt);
                            setSecondaryOpen(false);
                          }}
                          className="flex items-center gap-[12px] rounded-[8px] p-[8px] text-left hover:bg-sd-grey-2 cursor-pointer"
                        >
                          <div
                            className={cn(
                              "flex size-[32px] shrink-0 items-center justify-center rounded-full text-[14px] font-medium text-white",
                              bgColor,
                            )}
                          >
                            {initial}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[14px] font-normal leading-[20px] text-sd-grey-12 truncate">
                              {opt}
                            </span>
                            <span className="text-[12px] font-normal leading-[16px] text-[#888888]">
                              Reviewer (Verifier)
                            </span>
                          </div>
                        </button>
                      );
                    })}
                </div>
              </>
            ) : (
              <div className="flex flex-col">
                {secondaryOptions
                  ? secondaryOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          handleDifficulty(opt === "All" ? "" : opt);
                          setSecondaryOpen(false);
                        }}
                        aria-pressed={difficulty === opt}
                        className={cn(
                          "flex h-[34px] items-center rounded-[8px] px-[12px] text-left text-[14px] font-normal transition-colors cursor-pointer",
                          difficulty === opt
                            ? "bg-sd-grey-3 text-sd-grey-12 font-medium"
                            : "text-sd-grey-11 hover:bg-sd-grey-2",
                        )}
                      >
                        {opt}
                      </button>
                    ))
                  : DEFAULT_DIFFICULTY_OPTIONS.map((option) => (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() => {
                          handleDifficulty(option.value);
                          setSecondaryOpen(false);
                        }}
                        aria-pressed={difficulty === option.value}
                        className={cn(
                          "flex h-[34px] items-center rounded-[8px] px-[12px] text-left text-[14px] font-normal transition-colors cursor-pointer",
                          difficulty === option.value
                            ? "bg-sd-grey-3 text-sd-grey-12 font-medium"
                            : "text-sd-grey-11 hover:bg-sd-grey-2",
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
              </div>
            )}
          </DropdownShell>
        </Popover>

        {/* Date Filter */}
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
              label={dateFilterLabel}
              className="w-[140px]"
              onClick={() => {
                setDateOpen(true);
                setActiveDateField(null);
              }}
            />
          </PopoverTrigger>
          <DropdownShell className="w-[310px] px-[8px] py-[10px]">
            <div className="flex flex-col gap-[10px]">
              <div className="flex items-center justify-between text-[14px] font-normal text-sd-grey-11 leading-[20px]">
                <span>Date range</span>
                {(fromDate || toDate) && (
                  <button
                    type="button"
                    onClick={() => {
                      handleFromDate(undefined);
                      handleToDate(undefined);
                      setActiveDateField(null);
                    }}
                    className="text-[12px] text-sd-blue hover:underline cursor-pointer border-0 bg-transparent"
                  >
                    Clear dates
                  </button>
                )}
              </div>

              {/* From Date Button */}
              <button
                type="button"
                onClick={() =>
                  setActiveDateField((current) => (current === "from" ? null : "from"))
                }
                className={cn(
                  "flex h-[38px] items-center gap-[10px] rounded-[10px] border border-sd-grey-3 bg-sd-grey-1 px-[12px] cursor-pointer",
                  activeDateField === "from" && "border-sd-blue",
                )}
              >
                <span className="text-[14px] font-normal text-sd-grey-12">From</span>
                <span className="text-[14px] font-normal text-sd-muted-text">
                  {fromDate ? format(fromDate, "MM/dd/yyyy") : "Select date"}
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
                      handleFromDate(date);
                      setActiveDateField(null);
                    }}
                  />
                </div>
              )}

              {/* To Date Button */}
              <button
                type="button"
                onClick={() =>
                  setActiveDateField((current) => (current === "to" ? null : "to"))
                }
                className={cn(
                  "flex h-[38px] items-center gap-[10px] rounded-[10px] border border-sd-grey-3 bg-sd-grey-1 px-[12px] cursor-pointer",
                  activeDateField === "to" && "border-sd-blue",
                )}
              >
                <span className="text-[14px] font-normal text-sd-grey-12">To</span>
                <span className="text-[14px] font-normal text-sd-muted-text">
                  {toDate ? format(toDate, "MM/dd/yyyy") : "Select date"}
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
                      handleToDate(date);
                      setActiveDateField(null);
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
