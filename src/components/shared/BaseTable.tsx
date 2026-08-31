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
import { FormSelect } from "@/components/form/FormSelect";
import { SearchNormal1, ArrowLeft, Calendar2, FolderOpen } from "iconsax-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Pagination } from "@/components/shared/Pagination";

interface BaseTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  title: string;
  className?: string;
  toolbarClassName?: string;
  contentClassName?: string;
  headerRowClassName?: string;
  headerCellClassName?: string;
  /** Static classes, or a per-row resolver for conditional row styling. */
  rowClassName?: string | ((row: TData) => string);
  cellClassName?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  filters?: {
    label: string;
    icon?: React.ReactNode;
    options: { label: string; value: string }[];
    onValueChange: (value: string) => void;
    searchable?: boolean;
    searchPlaceholder?: string;
    /** Pass to make the filter controlled so the trigger reflects the active value. */
    value?: string;
    clearable?: boolean;
    clearLabel?: string;
  }[];
  showDateFilter?: boolean;
  dateFilterInline?: boolean;
  selectedDate?: Date;
  onDateChange?: (date: Date | undefined) => void;
  toolbarAction?: React.ReactNode | ((selectedCount: number) => React.ReactNode);
  selectable?: boolean;
  selectionAction?: React.ReactNode | ((selectedCount: number) => React.ReactNode);
  showPagination?: boolean;
  showHeader?: boolean;
  emptyIcon?: React.ReactNode;
  emptyText?: string;
  topContent?: React.ReactNode;
  onRowClick?: (row: TData) => void;
  ignoreRowClickColumns?: string[];
  /**
   * Reports the currently selected rows so callers can drive bulk actions.
   * Must be referentially stable (e.g. a `useState` setter or a `useCallback`).
   */
  onSelectionChange?: (rows: TData[]) => void;
  tableOptions?: Partial<TableOptions<TData>>;
}

export function BaseTable<TData, TValue>({
  columns,
  data,
  title,
  className,
  toolbarClassName,
  contentClassName,
  headerRowClassName,
  headerCellClassName,
  rowClassName,
  cellClassName,
  searchPlaceholder = "Search...",
  onSearchChange,
  filters,
  showDateFilter = false,
  dateFilterInline = false,
  selectedDate,
  onDateChange,
  toolbarAction,
  selectable = true,
  selectionAction,
  showPagination = false,
  showHeader = true,
  emptyIcon,
  emptyText,
  topContent,
  onRowClick,
  ignoreRowClickColumns,
  onSelectionChange,
  tableOptions,
}: BaseTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const selectedCount = Object.keys(rowSelection).filter((k) => rowSelection[k]).length;
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
    onRowSelectionChange: setRowSelection,
    enableRowSelection: selectable,
    ...tableOptions,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      rowSelection,
      ...tableOptions?.state,
    },
  });

  React.useEffect(() => {
    onSelectionChange?.(table.getSelectedRowModel().rows.map((row) => row.original));
  }, [rowSelection, table, onSelectionChange]);

  return (
    <div className={cn("w-full bg-sd-grey-1 border border-sd-grey-3 rounded-[20px] p-[16px] flex flex-col gap-[20px]", className)}>
      {/* Header */}
      {showHeader && (
        <div className="flex items-start justify-between w-full">
          <div className="bg-sd-header-bg p-[10px] rounded-[12px]">
             <span className="text-[16px] font-semibold text-sd-grey-11 tracking-[-0.32px] leading-[24px] whitespace-nowrap">{title}</span>
          </div>
          <div className="bg-sd-header-bg p-[10px] rounded-[12px] flex items-center gap-[8px] cursor-pointer group">
            <span className="text-[14px] text-sd-grey-11 tracking-[-0.28px] leading-[20px]">See all</span>
            <ArrowLeft size={20} variant="Linear" color="var(--sd-grey-11)" className="rotate-180" />
          </div>
        </div>
      )}

      {/* Toolbar */}
      {(searchPlaceholder || filters?.length || showDateFilter || toolbarAction) && (
        <div className={cn("flex flex-col gap-[16px]", toolbarClassName)}>
          <div className="flex items-center justify-between gap-[16px] w-full">
            <div className="flex items-center gap-[12px] flex-1 flex-wrap">
              {searchPlaceholder && (
                <div className="relative w-full max-w-[308px]">
                  <SearchNormal1 
                    size={20} 
                    variant="Linear" 
                    color="var(--sd-muted-text)" 
                    className="absolute left-[16px] top-1/2 -translate-y-1/2 pointer-events-none"
                  />
                  <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={globalFilter ?? ""}
                    onChange={(e) => {
                      setGlobalFilter(e.target.value);
                      onSearchChange?.(e.target.value);
                    }}
                    className="w-full h-[40px] pl-[44px] pr-[16px] border border-sd-grey-6 rounded-[8px] text-[14px] text-sd-grey-12 placeholder:text-sd-muted-text bg-white outline-none focus:border-sd-blue transition-colors"
                  />
                </div>
              )}
              
              {filters?.map((filter, index) => (
                <div key={index} className="min-w-[120px]">
                  <FormSelect
                    placeholder={filter.label}
                    options={filter.options}
                    value={filter.value}
                    onValueChange={filter.onValueChange}
                    triggerClassName="h-[40px] px-[16px] border-sd-grey-6 bg-white text-[14px] text-sd-grey-11 tracking-[-0.28px]"
                    icon={filter.icon}
                    name="tableFilter"
                    searchable={filter.searchable}
                    searchPlaceholder={filter.searchPlaceholder}
                    clearable={filter.clearable}
                    clearLabel={filter.clearLabel}
                  />
                </div>
              ))}

              {showDateFilter && dateFilterInline && (
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex items-center gap-[8px] px-[16px] py-[10px] border border-sd-grey-6 rounded-[8px] bg-white cursor-pointer hover:bg-sd-grey-1 transition-colors h-[40px] outline-none select-none">
                      <Calendar2 size={20} variant="Linear" color="var(--sd-grey-11)" />
                      <span className="text-[14px] text-sd-grey-11 tracking-[-0.28px] leading-[20px] whitespace-nowrap">
                        {activeDate ? format(activeDate, "dd MMM yyyy") : "Date"}
                      </span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white border border-sd-grey-3 rounded-[12px] " align="start">
                    <Calendar
                      mode="single"
                      selected={activeDate}
                      onSelect={handleDateSelect}
                    />
                  </PopoverContent>
                </Popover>
              )}
            </div>

            {!dateFilterInline && showDateFilter && (
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-[8px] px-[16px] py-[10px] border border-sd-grey-6 rounded-[8px] bg-white cursor-pointer hover:bg-sd-grey-1 transition-colors h-[40px] outline-none select-none">
                    <Calendar2 size={20} variant="Linear" color="var(--sd-grey-11)" />
                    <span className="text-[14px] text-sd-grey-11 tracking-[-0.28px] leading-[20px] whitespace-nowrap">
                      {activeDate ? format(activeDate, "dd MMM yyyy") : "Date"}
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white border border-sd-grey-3 rounded-[12px] " align="end">
                  <Calendar
                    mode="single"
                    selected={activeDate}
                    onSelect={handleDateSelect}
                  />
                </PopoverContent>
              </Popover>
            )}
            {toolbarAction && (
              <div className="shrink-0">
                {typeof toolbarAction === "function" ? toolbarAction(selectedCount) : toolbarAction}
              </div>
            )}
          </div>
        </div>
      )}

      {topContent}

      {/* Table */}
      <div className={cn("overflow-x-auto", contentClassName)}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className={cn("hover:bg-transparent border-b border-sd-grey-3", headerRowClassName)}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className={cn("text-[14px] font-semibold text-sd-muted-text h-[48px] px-[16px] tracking-[-0.28px] whitespace-nowrap bg-sd-grey-1", headerCellClassName)}>
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
                    "h-[56px] border-b border-sd-grey-3 hover:bg-sd-grey-1/30 data-[state=selected]:bg-sd-blue-light",
                    typeof rowClassName === "function" ? rowClassName(row.original) : rowClassName,
                    onRowClick && "cursor-pointer"
                  )}
                  onClick={(e) => {
                    const target = e.target as HTMLElement;
                    if (target.tagName === "INPUT" || target.closest("input")) return;
                    const cellEl = target.closest("[data-column-id]") as HTMLElement | null;
                    if (cellEl && ignoreRowClickColumns?.includes(cellEl.dataset.columnId ?? "")) return;
                    onRowClick?.(row.original);
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} data-column-id={cell.column.id} className={cn("text-[14px] text-sd-grey-11 px-[16px] tracking-[-0.28px]", cellClassName)}>
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
        <Pagination
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

      {/* Selection Action Bar */}
      {selectedCount > 0 && selectionAction && (
        <div className="flex items-center justify-between px-[16px] py-[12px] border-t border-sd-grey-3 bg-sd-footer-bg rounded-b-[20px]">
          <span className="text-[14px] text-sd-grey-11 tracking-[-0.28px] leading-[20px]">{selectedCount} selected</span>
          <div className="flex items-center gap-[8px]">
            {typeof selectionAction === "function" ? selectionAction(selectedCount) : selectionAction}
          </div>
        </div>
      )}
    </div>
  );
}
