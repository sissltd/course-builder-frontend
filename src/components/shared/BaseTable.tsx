"use client";

import React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnFiltersState,
  TableOptions,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AppSelect } from "@/components/form/AppSelect";
import { SearchNormal1, ArrowLeft, Calendar2, FolderOpen } from "iconsax-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { AppPagination } from "@/components/shared/AppPagination";

interface BaseTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  title: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  filters?: {
    label: string;
    icon?: React.ReactNode;
    options: { label: string; value: string }[];
    onValueChange: (value: string) => void;
  }[];
  showDateFilter?: boolean;
  selectedDate?: Date;
  onDateChange?: (date: Date | undefined) => void;
  showPagination?: boolean;
  showHeader?: boolean;
  emptyIcon?: React.ReactNode;
  emptyText?: string;
  onRowClick?: (row: TData) => void;
  tableOptions?: Partial<TableOptions<TData>>;
}

export function BaseTable<TData, TValue>({
  columns,
  data,
  title,
  searchPlaceholder = "Search...",
  onSearchChange,
  filters,
  showDateFilter = false,
  selectedDate,
  onDateChange,
  showPagination = false,
  showHeader = true,
  emptyIcon,
  emptyText,
  onRowClick,
  tableOptions,
}: BaseTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [localDate, setLocalDate] = React.useState<Date | undefined>(undefined);

  const activeDate = selectedDate !== undefined ? selectedDate : localDate;

  const handleDateSelect = (date: Date | undefined) => {
    if (selectedDate === undefined) {
      setLocalDate(date);
    }
    if (onDateChange) {
      onDateChange(date);
    }
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    ...tableOptions,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      ...tableOptions?.state,
    },
  });

  return (
    <div className="w-full bg-[#FDFDFD] border border-[#F0F0F0] rounded-[20px] p-[16px] flex flex-col gap-[20px]">
      {/* Header */}
      {showHeader && (
        <div className="flex items-start justify-between w-full">
          <div className="bg-[#FCFDFF] p-[10px] rounded-[12px]">
             <span className="text-[16px] font-semibold text-[#606060] tracking-[-0.32px] leading-[24px] whitespace-nowrap">{title}</span>
          </div>
          <div className="bg-[#FCFDFF] p-[10px] rounded-[12px] flex items-center gap-[8px] cursor-pointer group">
            <span className="text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px]">See all</span>
            <ArrowLeft size={20} variant="Linear" color="#606060" className="rotate-180" />
          </div>
        </div>
      )}

      {/* Toolbar */}
      {(searchPlaceholder || filters?.length || showDateFilter) && (
        <div className="flex flex-col gap-[16px]">
          <div className="flex items-center justify-between gap-[16px] w-full">
            <div className="flex items-center gap-[12px] flex-1">
              {searchPlaceholder && (
                <div className="relative w-full max-w-[308px]">
                  <SearchNormal1 
                    size={20} 
                    variant="Linear" 
                    color="#B6B6B6" 
                    className="absolute left-[16px] top-1/2 -translate-y-1/2 pointer-events-none"
                  />
                  <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={globalFilter ?? ""}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="w-full h-[40px] pl-[44px] pr-[16px] border border-[#D9D9D9] rounded-[8px] text-[14px] text-[#202020] placeholder:text-[#B6B6B6] bg-white outline-none focus:border-[#0063EF] transition-colors"
                  />
                </div>
              )}
              
              {filters?.map((filter, index) => (
                <div key={index} className="min-w-[120px]">
                  <AppSelect
                    placeholder={filter.label}
                    options={filter.options}
                    onValueChange={filter.onValueChange}
                    triggerClassName="h-[40px] px-[16px] border-[#D9D9D9] bg-white text-[14px] text-[#606060] tracking-[-0.28px]"
                    icon={filter.icon}
                  />
                </div>
              ))}
            </div>

            {showDateFilter && (
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-[8px] px-[16px] py-[10px] border border-[#D9D9D9] rounded-[8px] bg-white cursor-pointer hover:bg-sd-grey-1 transition-colors h-[40px] outline-none select-none">
                    <Calendar2 size={20} variant="Linear" color="#606060" />
                    <span className="text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px] whitespace-nowrap">
                      {activeDate ? format(activeDate, "dd MMM yyyy") : "Date"}
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white border border-[#F0F0F0] rounded-[12px] " align="end">
                  <Calendar
                    mode="single"
                    selected={activeDate}
                    onSelect={handleDateSelect}
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-b border-[#F0F0F0]">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-[14px] font-semibold text-[#B6B6B6] h-[48px] px-[16px] tracking-[-0.28px] whitespace-nowrap bg-[#FDFDFD]">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    "h-[56px] border-b border-[#F0F0F0] hover:bg-sd-grey-1/30",
                    onRowClick && "cursor-pointer"
                  )}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-[14px] text-[#606060] px-[16px] tracking-[-0.28px]">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent border-none">
                <TableCell colSpan={columns.length} className="h-[280px] text-center border-none">
                  <div className="flex flex-col items-center justify-center gap-[12px] py-[32px]">
                    <div className="size-[48px] rounded-full bg-sd-grey-2 flex items-center justify-center text-sd-grey-11">
                      {emptyIcon || <FolderOpen size={24} variant="Linear" color="currentColor" />}
                    </div>
                    <span className="text-[14px] text-sd-grey-11 font-medium tracking-[-0.28px]">
                      {emptyText || "No results found"}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {showPagination && (
        <AppPagination
          pageIndex={table.getState().pagination.pageIndex}
          pageSize={table.getState().pagination.pageSize}
          pageCount={table.getPageCount()}
          canPreviousPage={table.getCanPreviousPage()}
          canNextPage={table.getCanNextPage()}
          previousPage={table.previousPage}
          nextPage={table.nextPage}
          setPageIndex={table.setPageIndex}
          setPageSize={table.setPageSize}
        />
      )}
    </div>
  );
}
