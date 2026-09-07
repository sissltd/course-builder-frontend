"use client";

import React, { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { InfoCircle } from "iconsax-react";
import { BaseTable } from "@/components/shared/BaseTable";
import { Pagination } from "@/components/shared/Pagination";
import { useGetAdminWithdrawalsQuery } from "@/redux/slices/adminApi";
import type { WithdrawalItem, WithdrawalListParams } from "@/redux/slices/adminApi";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

const STATUS_CONFIG: Record<WithdrawalItem["status"], { label: string; className: string; description: string }> = {
  PENDING_CONFIRMATION: {
    label: "Pending OTP",
    className: "bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]",
    description: "Creator has not entered their OTP. Never expires automatically.",
  },
  CONFIRMED: {
    label: "Confirmed",
    className: "bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]",
    description: "Debit applied; awaiting manual bank transfer.",
  },
  EXPIRED: {
    label: "Expired",
    className: "bg-sd-grey-2 text-sd-grey-10 border border-sd-grey-4",
    description: "Request expired.",
  },
};

const StatusBadge = ({ status }: { status: WithdrawalItem["status"] }) => {
  const config = STATUS_CONFIG[status];
  return (
    <div className="flex items-center gap-[6px]">
      <span className={cn("inline-flex items-center rounded-full px-[10px] py-[3px] text-[12px] font-medium leading-[16px]", config.className)}>
        {config.label}
      </span>
      {status === "CONFIRMED" && (
        <span title={config.description}>
          <InfoCircle
            size={14}
            variant="Linear"
            color="var(--sd-grey-10)"
          />
        </span>
      )}
    </div>
  );
};

const CreatorCell = ({ user }: { user: WithdrawalItem["user"] }) => {
  const fullName = `${user.first_name} ${user.last_name}`.trim() || user.email;
  const initials = (user.first_name?.[0] ?? user.email[0] ?? "?").toUpperCase();
  return (
    <div className="flex items-center gap-[8px]">
      <div className="flex size-[28px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#10B981] to-[#3B82F6] text-white text-[10px] font-semibold">
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

export const WithdrawalsTable = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<"" | WithdrawalItem["status"]>("");

  const params: WithdrawalListParams = {
    page,
    size: PAGE_SIZE,
    ...(statusFilter ? { status: statusFilter as WithdrawalItem["status"] } : {}),
  };

  const { data, isLoading } = useGetAdminWithdrawalsQuery(params);

  const withdrawals = useMemo(() => (data?.data?.results ?? []).flat(), [data]);
  const paginator = data?.data?.paginator;

  const columns: ColumnDef<WithdrawalItem, any>[] = [
    {
      id: "creator",
      header: "Creator",
      cell: ({ row }) => <CreatorCell user={row.original.user} />,
    },
    {
      id: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <span className="text-[14px] font-semibold leading-[20px] tracking-[-0.28px] text-sd-grey-12">
          ${parseFloat(row.original.amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: "bank",
      header: "Bank Account",
      cell: ({ row }) => {
        const acct = row.original.payout_account;
        if (!acct) return <span className="text-[13px] text-sd-grey-10">—</span>;
        return (
          <div className="flex flex-col gap-[2px]">
            <span className="text-[13px] font-medium leading-[18px] tracking-[-0.26px] text-sd-grey-12 truncate max-w-[140px]">
              {acct.provider_name}
            </span>
            <span className="font-mono text-[11px] text-sd-grey-10 leading-[15px]">
              {acct.account_number}
            </span>
          </div>
        );
      },
    },
    {
      id: "account_name",
      header: "Account Name",
      cell: ({ row }) => (
        <span className="text-[13px] leading-[18px] tracking-[-0.26px] text-sd-grey-11 truncate max-w-[140px]">
          {row.original.payout_account?.account_name ?? "—"}
        </span>
      ),
    },
    {
      id: "reference",
      header: "Ref",
      cell: ({ row }) => (
        <span className="font-mono text-[11px] text-sd-grey-10 leading-[15px]">
          {row.original.transaction_reference || "—"}
        </span>
      ),
    },
    {
      id: "confirmed_at",
      header: "Confirmed",
      cell: ({ row }) => (
        <span className="text-[13px] leading-[18px] tracking-[-0.26px] text-sd-grey-10 whitespace-nowrap">
          {row.original.confirmed_at
            ? format(parseISO(row.original.confirmed_at), "MMM d, yyyy")
            : "—"}
        </span>
      ),
    },
    {
      id: "created",
      header: "Requested",
      cell: ({ row }) => (
        <span className="text-[13px] leading-[18px] tracking-[-0.26px] text-sd-grey-10 whitespace-nowrap">
          {format(parseISO(row.original.created_datetime), "MMM d, yyyy")}
        </span>
      ),
    },
  ];

  const skeletonRows: WithdrawalItem[] = Array.from({ length: PAGE_SIZE }, (_, i) => ({
    id: `skeleton-${i}`,
    user: { id: "", email: "loading...", first_name: "", last_name: "" },
    amount: "0.00",
    status: "PENDING_CONFIRMATION" as const,
    payout_account: null,
    transaction_reference: "",
    confirmed_at: null,
    created_datetime: new Date().toISOString(),
  }));

  return (
    <div className="flex flex-col gap-[16px]">
      {/* Confirmed status notice */}
      <div className="flex items-start gap-[10px] rounded-[10px] border border-[#BFDBFE] bg-[#EFF6FF] px-[14px] py-[10px]">
        <InfoCircle size={16} variant="Linear" color="#1D4ED8" className="shrink-0 mt-[1px]" />
        <p className="text-[13px] leading-[18px] text-[#1E40AF]">
          <strong>Confirmed</strong> means the creator&apos;s balance was debited — treat it as <em>awaiting manual bank transfer</em>, not as paid. <strong>Pending OTP</strong> requests are never expired automatically.
        </p>
      </div>

      <BaseTable
        columns={columns}
        data={isLoading ? skeletonRows : withdrawals}
        title="Withdrawals"
        showHeader={false}
        selectable={false}
        showPagination={false}
        searchPlaceholder=""
        emptyText="No withdrawal requests found"
        filters={[
          {
            label: "Status",
            value: statusFilter,
            options: [
              { label: "Pending OTP", value: "PENDING_CONFIRMATION" },
              { label: "Confirmed", value: "CONFIRMED" },
              { label: "Expired", value: "EXPIRED" },
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
