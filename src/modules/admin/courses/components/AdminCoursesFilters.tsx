"use client";

import React from "react";
import { format } from "date-fns";
import {
  ArrowDown2,
  Calendar2,
  Filter,
  SearchNormal1,
  Sort,
  Video,
  VideoSlash,
} from "iconsax-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CourseViewToggle, type CourseViewMode } from "./CourseViewToggle";
import { useGetCategoriesQuery } from "@/modules/creator/courses/api/categoriesApi";

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

export type AdminCoursesTab = "creators" | "ai" | "developer";

interface AdminCoursesFiltersProps {
  activeTab: AdminCoursesTab;
  setActiveTab: (tab: AdminCoursesTab) => void;
  videoFilter: "with" | "without" | null;
  setVideoFilter: (filter: "with" | "without" | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  category: string;
  setCategory: (cat: string) => void;
  difficulty: string;
  setDifficulty: (diff: string) => void;
  fromDate: Date | undefined;
  setFromDate: (date: Date | undefined) => void;
  toDate: Date | undefined;
  setToDate: (date: Date | undefined) => void;
  viewMode: CourseViewMode;
  setViewMode: (mode: CourseViewMode) => void;
}

export const AdminCoursesFilters = ({
  activeTab,
  setActiveTab,
  videoFilter,
  setVideoFilter,
  searchQuery,
  setSearchQuery,
  category,
  setCategory,
  difficulty,
  setDifficulty,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  viewMode,
  setViewMode,
}: AdminCoursesFiltersProps) => {
  const { data: categoriesData } = useGetCategoriesQuery();
  const categories = React.useMemo(() => {
    return categoriesData?.data?.results ?? [];
  }, [categoriesData]);

  const [categorySearch, setCategorySearch] = React.useState("");

  const filteredCategories = React.useMemo(() => {
    if (!categorySearch.trim()) return categories;
    return categories.filter((c) =>
      c.name.toLowerCase().includes(categorySearch.toLowerCase()),
    );
  }, [categories, categorySearch]);

  const selectedCategoryLabel = React.useMemo(() => {
    if (!category || category === "Category" || category === "All") return "Category";
    const match = categories.find((c) => c.id === category || c.name === category);
    return match ? match.name : category;
  }, [category, categories]);

  const difficultyOptions = [
    "All",
    "Beginner",
    "Intermediate",
    "Advanced",
  ];

  const [categoryOpen, setCategoryOpen] = React.useState(false);
  const [difficultyOpen, setDifficultyOpen] = React.useState(false);
  const [dateOpen, setDateOpen] = React.useState(false);
  const [activeDateField, setActiveDateField] = React.useState<"from" | "to" | null>(null);

  const dateLabel = (date: Date | undefined) =>
    date ? format(date, "MM/dd/yyyy") : "Date";

  return (
    <div className="flex flex-col gap-[16px] sm:gap-[20px] w-full">
      {/* Tabs Row — smooth horizontal scroll on mobile, no text wrapping */}
      <div className="flex items-center border-b border-sd-grey-3 w-full overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap">
        <button
          type="button"
          onClick={() => setActiveTab("creators")}
          className={cn(
            "h-[44px] px-[16px] sm:px-[24px] text-[14px] sm:text-[16px] font-medium transition-colors cursor-pointer relative shrink-0 whitespace-nowrap flex items-center justify-center",
            activeTab === "creators"
              ? "text-sd-blue font-semibold"
              : "text-sd-grey-11 hover:text-sd-grey-12",
          )}
        >
          <span>Creator Uploaded</span>
          {activeTab === "creators" && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-sd-blue" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("ai")}
          className={cn(
            "h-[44px] px-[16px] sm:px-[24px] text-[14px] sm:text-[16px] font-medium transition-colors cursor-pointer relative shrink-0 whitespace-nowrap flex items-center justify-center",
            activeTab === "ai"
              ? "text-sd-blue font-semibold"
              : "text-sd-grey-11 hover:text-sd-grey-12",
          )}
        >
          <span>AI Generated</span>
          {activeTab === "ai" && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-sd-blue" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("developer")}
          className={cn(
            "h-[44px] px-[16px] sm:px-[24px] text-[14px] sm:text-[16px] font-medium transition-colors cursor-pointer relative shrink-0 whitespace-nowrap flex items-center justify-center",
            activeTab === "developer"
              ? "text-sd-blue font-semibold"
              : "text-sd-grey-11 hover:text-sd-grey-12",
          )}
        >
          <span>Developer API</span>
          {activeTab === "developer" && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-sd-blue" />
          )}
        </button>
      </div>

      {/* Video Filter Buttons Row — horizontal scrolling chips on mobile */}
      <div className="flex items-center gap-[8px] sm:gap-[12px] w-full overflow-x-auto no-scrollbar whitespace-nowrap py-[2px]">
        <button
          type="button"
          onClick={() => setVideoFilter(videoFilter === "with" ? null : "with")}
          className={cn(
            "flex h-[34px] sm:h-[36px] items-center gap-[6px] sm:gap-[8px] rounded-full border px-[12px] sm:px-[16px] text-[13px] sm:text-[14px] font-normal transition-all cursor-pointer shrink-0 whitespace-nowrap",
            videoFilter === "with"
              ? "bg-[#0063EF1A] border-sd-blue text-sd-blue font-medium"
              : "bg-sd-grey-1 border-sd-grey-3 text-sd-grey-11 hover:bg-sd-grey-2",
          )}
        >
          <Video size={16} variant="Linear" color="currentColor" />
          <span>With video (200)</span>
        </button>

        <button
          type="button"
          onClick={() => setVideoFilter(videoFilter === "without" ? null : "without")}
          className={cn(
            "flex h-[34px] sm:h-[36px] items-center gap-[6px] sm:gap-[8px] rounded-full border px-[12px] sm:px-[16px] text-[13px] sm:text-[14px] font-normal transition-all cursor-pointer shrink-0 whitespace-nowrap",
            videoFilter === "without"
              ? "bg-[#0063EF1A] border-sd-blue text-sd-blue font-medium"
              : "bg-sd-grey-1 border-sd-grey-3 text-sd-grey-11 hover:bg-sd-grey-2",
          )}
        >
          <VideoSlash size={16} variant="Linear" color="currentColor" />
          <span>Without video (24)</span>
        </button>
      </div>

      {/* Filters & Inputs Row */}
      <div className="flex flex-col gap-[10px] sm:flex-row sm:flex-wrap sm:items-center sm:gap-[12px] w-full">
        {/* Search Field */}
        <label className="flex h-[40px] w-full sm:w-[260px] md:w-[320px] items-center gap-[12px] rounded-[10px] border border-sd-grey-6 bg-sd-grey-1 px-[14px] shrink-0">
          <SearchNormal1 size={18} variant="Linear" color="var(--sd-grey-11)" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search course title, ID etc"
            className="w-full bg-transparent text-[14px] font-normal text-sd-grey-12 placeholder:text-sd-muted-text outline-none"
          />
        </label>

        {/* Controls Container: 2-column grid on mobile, inline flex on tablet/desktop */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center gap-[8px] sm:gap-[10px] w-full sm:w-auto sm:flex-1">
          {/* Category Dropdown */}
          <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
            <PopoverTrigger asChild>
              <FilterTrigger
                icon={<Filter size={18} variant="Linear" color="var(--sd-grey-11)" />}
                label={selectedCategoryLabel}
                className="w-full sm:w-[150px] md:w-[170px]"
              />
            </PopoverTrigger>
          <DropdownShell className="w-[280px] px-[8px] py-[10px]">
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
                  setCategory("All");
                  setCategoryOpen(false);
                }}
                aria-pressed={category === "All" || category === "Category"}
                className={cn(
                  "flex h-[34px] items-center rounded-[8px] px-[12px] text-left text-[14px] font-normal cursor-pointer hover:bg-sd-grey-2",
                  category === "All" || category === "Category"
                    ? "font-medium text-sd-blue bg-sd-blue/5"
                    : "text-sd-grey-11",
                )}
              >
                All Categories
              </button>
              {filteredCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setCategory(cat.id);
                    setCategoryOpen(false);
                  }}
                  aria-pressed={category === cat.id}
                  className={cn(
                    "flex h-[34px] items-center rounded-[8px] px-[12px] text-left text-[14px] font-normal truncate cursor-pointer hover:bg-sd-grey-2",
                    category === cat.id
                      ? "font-medium text-sd-blue bg-sd-blue/5"
                      : "text-sd-grey-11",
                  )}
                >
                  <span className="truncate">{cat.name}</span>
                </button>
              ))}
              {filteredCategories.length === 0 && (
                <div className="py-2 text-center text-[12px] text-sd-grey-11">
                  No categories found
                </div>
              )}
            </div>
          </DropdownShell>
        </Popover>

        {/* Difficulty Level Dropdown */}
        <Popover open={difficultyOpen} onOpenChange={setDifficultyOpen}>
          <PopoverTrigger asChild>
            <FilterTrigger
              icon={<Sort size={18} variant="Linear" color="var(--sd-grey-11)" />}
              label={difficulty}
              className="w-full sm:w-[150px] md:w-[170px]"
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
              icon={<Calendar2 size={18} variant="Linear" color="var(--sd-grey-11)" />}
              label={fromDate ? dateLabel(fromDate) : "Date"}
              className="w-full sm:w-[120px] md:w-[140px]"
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

        {/* Table / Grid switch */}
        <div className="flex items-center justify-end sm:ml-auto w-full sm:w-auto">
          <CourseViewToggle value={viewMode} onChange={setViewMode} />
        </div>
      </div>
    </div>
  </div>
);
};
