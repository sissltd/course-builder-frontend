"use client";

import React, { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { InfoCircle } from "iconsax-react";
import { BaseTable } from "@/components/shared/BaseTable";
import { Pagination } from "@/components/shared/Pagination";
import { useGetAdminTransactionsQuery } from "@/redux/slices/adminApi";
import type { TransactionItem, TransactionListParams } from "@/redux/slices/adminApi";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

const TYPE_CONFIG = {
  CREDIT: { label: "Credit", className: "bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]" },
  DEBIT: { label: "Debit", className: "bg-[#FEF2F2] text-[#B91C1C] border border-[#FCA5A5]" },
};

const STATUS_CONFIG = {
  COMPLETED: { label: "Completed", className: "bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]" },
  PENDING: { label: "Pending", className: "bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]" },
  FAILED: { label: "Failed", className: "bg-[#FEF2F2] text-[#B91C1C] border border-[#FCA5A5]" },
};

const StatusBadge = ({ config }: { config: { label: string; className: string } }) => (
  <span className={cn("inline-flex items-center rounded-full px-[10px] py-[3px] text-[12px] font-medium leading-[16px]", config.className)}>
    {config.label}
  </span>
);

const CreatorCell = ({ user }: { user: TransactionItem["user"] }) => {
  const fullName = `${user.first_name} ${user.last_name}`.trim() || user.email;
  const initials = (user.first_name?.[0] ?? user.email[0] ?? "?").toUpperCase();
  return (
    <div className="flex items-center gap-[8px]">
      <div className="flex size-[28px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] text-white text-[10px] font-semibold">
        {initials}
      </div>
      <div className="flex flex-col gap-[1px] min-w-0">
        <span className="text-[13px] font-medium leading-[18px] tracking-[-0.26px] text-sd-grey-12 truncate max-w-[130px]">
          {fullName}
        </span>
        <span className="text-[11px] text-sd-grey-10 leading-[15px] truncate max-w-[130px]">
          {user.email}
        </span>
      </div>
    </div>
  );
};

interface TransactionsTableProps {
  userFilter?: string;
}

export const TransactionsTable = ({ userFilter }: TransactionsTableProps) => {
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<"" | "CREDIT" | "DEBIT">("");
  const [statusFilter, setStatusFilter] = useState<"" | "PENDING" | "COMPLETED" | "FAILED">("");

  const params: TransactionListParams = {
    page,
    size: PAGE_SIZE,
    ...(userFilter ? { user: userFilter } : {}),
    ...(typeFilter ? { type: typeFilter as "CREDIT" | "DEBIT" } : {}),
    ...(statusFilter ? { status: statusFilter as "PENDING" | "COMPLETED" | "FAILED" } : {}),
  };

  const { data, isLoading } = useGetAdminTransactionsQuery(params);

  const transactions = useMemo(() => (data?.data?.results ?? []).flat(), [data]);
  const paginator = data?.data?.paginator;

  const columns: ColumnDef<TransactionItem, any>[] = [
    {
      id: "reference",
      header: "Reference",
      cell: ({ row }) => (
        <span className="font-mono text-[12px] text-sd-grey-11 leading-[18px]">
          {row.original.reference}
        </span>
      ),
    },
    {
      id: "creator",
      header: "Creator",
      cell: ({ row }) => <CreatorCell user={row.original.user} />,
    },
    {
      id: "type",
      header: "Type",
      cell: ({ row }) => (
        <StatusBadge config={TYPE_CONFIG[row.original.type]} />
      ),
    },
    {
      id: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <span className={cn(
          "text-[14px] font-semibold leading-[20px] tracking-[-0.28px]",
          row.original.type === "CREDIT" ? "text-[#047857]" : "text-[#B91C1C]"
        )}>
          {row.original.type === "CREDIT" ? "+" : "−"}${parseFloat(row.original.amount).toFixed(2)}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="flex items-center gap-[6px]">
          <StatusBadge config={STATUS_CONFIG[row.original.status]} />
          {row.original.status === "PENDING" && row.original.type === "DEBIT" && (
            <span title="Awaiting manual bank transfer — payout settlement is not yet automated">
              <InfoCircle
                size={14}
                variant="Linear"
                color="var(--sd-grey-10)"
                className="shrink-0"
              />
            </span>
          )}
        </div>
      ),
    },
    {
      id: "description",
      header: "Description",
      cell: ({ row }) => (
        <span className="text-[13px] leading-[18px] tracking-[-0.26px] text-sd-grey-11 line-clamp-2 max-w-[200px]">
          {row.original.description || "—"}
        </span>
      ),
    },
    {
      id: "course",
      header: "Course",
      cell: ({ row }) => (
        <span className="text-[13px] leading-[18px] tracking-[-0.26px] text-sd-grey-10 truncate max-w-[140px]">
          {row.original.course?.title ?? "—"}
        </span>
      ),
    },
    {
      id: "date",
      header: "Date",
      cell: ({ row }) => (
        <span className="text-[13px] leading-[18px] tracking-[-0.26px] text-sd-grey-10 whitespace-nowrap">
          {format(parseISO(row.original.created_datetime), "MMM d, yyyy")}
        </span>
      ),
    },
  ];

  const skeletonRows: TransactionItem[] = Array.from({ length: PAGE_SIZE }, (_, i) => ({
    id: `skeleton-${i}`,
    user: { id: "", email: "loading...", first_name: "", last_name: "" },
    reference: "TXN-LOADING",
    course: null,
    amount: "0.00",
    fee: "0.00",
    type: "CREDIT" as const,
    status: "PENDING" as const,
    description: "",
    recipient_account_name: "",
    recipient_account_number: "",
    recipient_provider_name: "",
    created_datetime: new Date().toISOString(),
  }));

  return (
    <div className="flex flex-col gap-[16px]">
      {/* Pending debit notice */}
      <div className="flex items-start gap-[10px] rounded-[10px] border border-[#FDE68A] bg-[#FFFBEB] px-[14px] py-[10px]">
        <InfoCircle size={16} variant="Linear" color="#B45309" className="shrink-0 mt-[1px]" />
        <p className="text-[13px] leading-[18px] text-[#92400E]">
          A long-standing <strong>PENDING</strong> debit simply means payout settlement is not yet automated — it is expected, not a stuck record.
        </p>
      </div>

      <BaseTable
        columns={columns}
        data={isLoading ? skeletonRows : transactions}
        title="Transactions"
        showHeader={false}
        selectable={false}
        showPagination={false}
        searchPlaceholder=""
        emptyText="No transactions found"
        filters={[
          {
            label: "Type",
            value: typeFilter,
            options: [
              { label: "Credit", value: "CREDIT" },
              { label: "Debit", value: "DEBIT" },
            ],
            onValueChange: (v) => { setTypeFilter(v as typeof typeFilter); setPage(1); },
            clearable: true,
            clearLabel: "All Types",
          },
          {
            label: "Status",
            value: statusFilter,
            options: [
              { label: "Completed", value: "COMPLETED" },
              { label: "Pending", value: "PENDING" },
              { label: "Failed", value: "FAILED" },
            ],
            onValueChange: (v) => { setStatusFilter(v as typeof statusFilter); setPage(1); },
            clearable: true,
            clearLabel: "All Statuses",
          },
        ]}
        rowClassName={cn(isLoading && "animate-pulse opacity-60")}
      />

      {!isLoading && paginator && paginator.total_pages > 1 && (
        <Pagination
          pageIndex={page - 1}
          pageSize={PAGE_SIZE}
          pageCount={paginator.total_pages}
          canPreviousPage={page > 1}
          canNextPage={page < paginator.total_pages}
          previousPage={() => setPage((p) => Math.max(1, p - 1))}
          nextPage={() => setPage((p) => Math.min(paginator.total_pages, p + 1))}
          setPageIndex={(idx) => setPage(idx + 1)}
          setPageSize={() => {}}
        />
      )}
    </div>
  );
};
