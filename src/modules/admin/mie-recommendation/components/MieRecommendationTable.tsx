"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { CloseCircle, Danger, Filter, Sort, TickCircle, UserSquare } from "iconsax-react";
import { BaseTable } from "@/components/shared/BaseTable";
import { cn } from "@/lib/utils";
import {
  categoryOptions,
  difficultyOptions,
  sourceOptions,
  type MieRecommendation,
} from "../data/mockData";
import {
  DuplicateChip,
  SortableHeader,
  SourcePill,
  StatusPill,
  SubmittedCell,
  fieldValue,
} from "./SharedUI";

interface ColumnOptions {
  clusterSizeFor: (row: MieRecommendation) => number;
  isFirstIn: (row: MieRecommendation) => boolean;
  onCompare: (row: MieRecommendation) => void;
  onApprove: (row: MieRecommendation) => void;
  onReject: (row: MieRecommendation) => void;
  showStatus: boolean;
}

export const mieRecommendationColumns = ({
  clusterSizeFor,
  isFirstIn,
  onCompare,
  onApprove,
  onReject,
  showStatus,
}: ColumnOptions): ColumnDef<MieRecommendation>[] => {
  const columns: ColumnDef<MieRecommendation>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllRowsSelected()}
          onChange={(e) => {
            e.stopPropagation();
            table.getToggleAllRowsSelectedHandler()(e);
          }}
          className="size-[18px] cursor-pointer accent-[#0063EF]"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={(e) => {
            e.stopPropagation();
            row.getToggleSelectedHandler()(e);
          }}
          className="size-[18px] cursor-pointer accent-[#0063EF]"
        />
      ),
      size: 40,
    },
    {
      accessorKey: "topic",
      header: "Topics",
      cell: ({ row }) => {
        const clusterSize = clusterSizeFor(row.original);
        return (
          <div className="flex flex-col gap-[4px]">
            <span className="text-[14px] leading-[20px] tracking-[-0.28px] text-sd-grey-11">
              {row.original.topic}
            </span>
            {clusterSize > 1 && (
              <DuplicateChip count={clusterSize} onClick={() => onCompare(row.original)} />
            )}
          </div>
        );
      },
      size: 250,
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <span className="text-[14px] leading-[20px] tracking-[-0.28px] text-sd-grey-11">
          {row.original.category}
        </span>
      ),
      size: 170,
    },
    {
      id: "source",
      accessorFn: (row) => (row.source.kind === "ai" ? "AI Engine" : row.source.name),
      header: "Recommended by",
      cell: ({ row }) => <SourcePill source={row.original.source} />,
      size: 190,
    },
    {
      accessorKey: "difficultyLevel",
      header: "Difficulty level",
      cell: ({ row }) => (
        <span className="text-[14px] leading-[20px] tracking-[-0.28px] text-sd-grey-11">
          {row.original.difficultyLevel}
        </span>
      ),
      size: 140,
    },
    {
      accessorKey: "demandScore",
      header: "Demand Score",
      cell: ({ row }) => (
        <span className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-success">
          {fieldValue(row.original.demandScore)}
        </span>
      ),
      size: 115,
    },
    {
      accessorKey: "searchesPerMonth",
      header: "Searches Per month",
      cell: ({ row }) => (
        <span className="text-[14px] leading-[20px] tracking-[-0.28px] text-sd-grey-11">
          {fieldValue(row.original.searchesPerMonth)}
        </span>
      ),
      size: 150,
    },
    {
      accessorKey: "submittedAt",
      header: ({ column }) => <SortableHeader column={column} label="Submitted" />,
      sortingFn: (a, b) =>
        new Date(a.original.submittedAt).getTime() -
        new Date(b.original.submittedAt).getTime(),
      cell: ({ row }) => (
        <SubmittedCell
          submittedAt={row.original.submittedAt}
          firstIn={isFirstIn(row.original)}
        />
      ),
      size: 150,
    },
  ];

  if (showStatus) {
    columns.push({
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusPill status={row.original.status} />,
      size: 110,
    });
  }

  columns.push({
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      if (row.original.status !== "pending") {
        return <span className="text-[12px] leading-[16px] text-sd-muted-text">Resolved</span>;
      }
      return (
        <div className="flex items-start gap-[8px]">
          <div
            className="flex h-[32px] cursor-pointer items-center justify-center gap-[8px] rounded-[8px] border border-sd-grey-3 p-[8px] transition-colors hover:bg-sd-grey-1"
            onClick={() => onReject(row.original)}
          >
            <CloseCircle variant="Linear" size={16} color="#D54800" />
            <span className="text-[12px] font-normal leading-[16px] text-sd-grey-12">Reject</span>
          </div>
          <div
            className="flex h-[32px] cursor-pointer items-center justify-center gap-[8px] rounded-[8px] border border-sd-grey-3 p-[8px] transition-colors hover:bg-sd-grey-1"
            onClick={() => onApprove(row.original)}
          >
            <TickCircle variant="Linear" size={16} color="#008500" />
            <span className="text-[12px] font-normal leading-[16px] text-sd-grey-12">
              {row.original.source.kind === "curator" ? "Approve topic" : "Approve"}
            </span>
          </div>
        </div>
      );
    },
    size: 194,
  });

  return columns;
};

interface MieRecommendationTableProps {
  rows: MieRecommendation[];
  clusterSizeFor: (row: MieRecommendation) => number;
  isFirstIn: (row: MieRecommendation) => boolean;
  showStatus: boolean;
  duplicatesOnly: boolean;
  duplicateCount: number;
  onToggleDuplicatesOnly: () => void;
  onCategoryChange: (value: string) => void;
  onDifficultyChange: (value: string) => void;
  onSourceChange: (value: string) => void;
  onCompare: (row: MieRecommendation) => void;
  onApprove: (row: MieRecommendation) => void;
  onReject: (row: MieRecommendation) => void;
  onBulkApprove: (rows: MieRecommendation[]) => void;
  onRowClick: (row: MieRecommendation) => void;
}

export const MieRecommendationTable = ({
  rows,
  clusterSizeFor,
  isFirstIn,
  showStatus,
  duplicatesOnly,
  duplicateCount,
  onToggleDuplicatesOnly,
  onCategoryChange,
  onDifficultyChange,
  onSourceChange,
  onCompare,
  onApprove,
  onReject,
  onBulkApprove,
  onRowClick,
}: MieRecommendationTableProps) => {
  // BaseTable owns row selection internally and reports the selected rows back
  // through onSelectionChange so the bulk action knows what it is acting on.
  const [selectedRows, setSelectedRows] = React.useState<MieRecommendation[]>([]);

  const columns = React.useMemo(
    () =>
      mieRecommendationColumns({
        clusterSizeFor,
        isFirstIn,
        onCompare,
        onApprove,
        onReject,
        showStatus,
      }),
    [clusterSizeFor, isFirstIn, onCompare, onApprove, onReject, showStatus],
  );

  return (
    <BaseTable
      title="MIE Recommendation"
      columns={columns}
      data={rows}
      searchPlaceholder="Search topics or curators"
      rowClassName={(row) =>
        clusterSizeFor(row) > 1 && row.status === "pending"
          ? "!border-l-[3px] !border-l-sd-warning-text bg-sd-warning-bg/40 hover:!bg-sd-warning-bg/60"
          : ""
      }
      filters={[
        {
          label: "Category",
          icon: <Filter size={20} variant="Linear" color="#606060" />,
          options: categoryOptions,
          onValueChange: onCategoryChange,
        },
        {
          label: "Difficulty Level",
          icon: <Sort size={20} variant="Linear" color="#606060" />,
          options: difficultyOptions,
          onValueChange: onDifficultyChange,
        },
        {
          label: "Source",
          icon: <UserSquare size={20} variant="Linear" color="#606060" />,
          options: sourceOptions,
          onValueChange: onSourceChange,
        },
      ]}
      showDateFilter
      dateFilterInline
      showHeader={false}
      showPagination
      onRowClick={onRowClick}
      ignoreRowClickColumns={["select", "actions"]}
      emptyIcon={<Danger size={24} variant="Linear" color="currentColor" />}
      emptyText={
        duplicatesOnly
          ? "No duplicate clashes to resolve"
          : "No recommendations match these filters"
      }
      tableOptions={{
        getRowId: (row) => row.id,
      }}
      toolbarAction={(selectedCount) => (
        <div className="flex items-center gap-[12px]">
          <button
            type="button"
            onClick={onToggleDuplicatesOnly}
            disabled={duplicateCount === 0}
            className={cn(
              "flex h-[40px] items-center gap-[8px] rounded-[8px] border px-[14px] text-[14px] leading-[20px] tracking-[-0.28px] transition-colors",
              duplicateCount === 0
                ? "cursor-not-allowed border-sd-grey-4 bg-white text-sd-muted-text"
                : duplicatesOnly
                  ? "cursor-pointer border-sd-warning-text bg-sd-warning-bg font-medium text-sd-warning-text"
                  : "cursor-pointer border-sd-grey-6 bg-white text-sd-grey-11 hover:bg-sd-grey-1",
            )}
            title="Show only recommendations that clash with another submission"
          >
            <Danger
              variant={duplicatesOnly ? "Bold" : "Linear"}
              size={18}
              color={
                duplicateCount === 0
                  ? "var(--sd-muted-text)"
                  : duplicatesOnly
                    ? "var(--sd-warning-text)"
                    : "var(--sd-grey-11)"
              }
            />
            <span className="whitespace-nowrap">Duplicates only</span>
            {duplicateCount > 0 && (
              <span
                className={cn(
                  "rounded-[6px] px-[6px] py-[1px] text-[12px] font-medium",
                  duplicatesOnly ? "bg-white text-sd-warning-text" : "bg-sd-grey-3 text-sd-grey-11",
                )}
              >
                {duplicateCount}
              </span>
            )}
          </button>

          <button
            disabled={selectedCount === 0}
            onClick={() => onBulkApprove(selectedRows)}
            className={cn(
              "flex h-[40px] items-center gap-[8px] rounded-[8px] px-[20px] py-[10px] text-[14px] font-normal leading-[20px] tracking-[-0.28px] transition-colors",
              selectedCount > 0
                ? "cursor-pointer bg-sd-blue text-white hover:bg-sd-blue-hover"
                : "cursor-not-allowed bg-[#D9D9D9] text-sd-muted-text",
            )}
          >
            Approve
          </button>
        </div>
      )}
      onSelectionChange={setSelectedRows}
    />
  );
};
