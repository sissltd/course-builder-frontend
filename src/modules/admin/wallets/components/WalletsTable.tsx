"use client";

import React, { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { Eye } from "iconsax-react";
import { BaseTable } from "@/components/shared/BaseTable";
import { Pagination } from "@/components/shared/Pagination";
import { useGetAdminWalletsQuery } from "@/redux/slices/adminApi";
import type { WalletItem } from "@/redux/slices/adminApi";
import { WalletDetailDrawer } from "./WalletDetailDrawer";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

const CreatorCell = ({ user }: { user: WalletItem["user"] }) => {
  const fullName = `${user.first_name} ${user.last_name}`.trim() || user.email;
  const initials = (user.first_name?.[0] ?? user.email[0] ?? "?").toUpperCase();
  return (
    <div className="flex items-center gap-[10px]">
      <div className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] text-white text-[12px] font-semibold">
        {initials}
      </div>
      <div className="flex flex-col gap-[2px] min-w-0">
        <span className="text-[14px] font-medium leading-[20px] tracking-[-0.28px] text-sd-grey-12 truncate max-w-[160px]">
          {fullName}
        </span>
        <span className="text-[12px] text-sd-grey-10 leading-[16px] truncate max-w-[160px]">
          {user.email}
        </span>
      </div>
    </div>
  );
};

export const WalletsTable = () => {
  const [page, setPage] = useState(1);
  const [selectedWallet, setSelectedWallet] = useState<WalletItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data, isLoading } = useGetAdminWalletsQuery({ page, size: PAGE_SIZE });

  const wallets = useMemo(() => (data?.data?.results ?? []).flat(), [data]);
  const paginator = data?.data?.paginator;

  const columns: ColumnDef<WalletItem, any>[] = [
    {
      id: "creator",
      header: "Creator",
      cell: ({ row }) => <CreatorCell user={row.original.user} />,
    },
    {
      id: "balance",
      header: "Balance",
      cell: ({ row }) => (
        <span className="text-[14px] font-semibold leading-[20px] tracking-[-0.28px] text-sd-grey-12">
          {row.original.currency === "USD" ? "$" : row.original.currency}
          {parseFloat(row.original.balance).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      id: "currency",
      header: "Currency",
      cell: ({ row }) => (
        <span className="inline-flex items-center rounded-full bg-sd-grey-2 border border-sd-grey-4 px-[10px] py-[2px] text-[12px] font-medium text-sd-grey-11">
          {row.original.currency}
        </span>
      ),
    },
    {
      id: "updated",
      header: "Last Updated",
      cell: ({ row }) => (
        <span className="text-[14px] leading-[20px] tracking-[-0.28px] text-sd-grey-10">
          {format(parseISO(row.original.updated_datetime), "MMM d, yyyy")}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedWallet(row.original);
            setDrawerOpen(true);
          }}
          className="flex items-center gap-[6px] rounded-[8px] border border-sd-grey-4 bg-white px-[10px] py-[6px] text-[12px] font-medium text-sd-grey-11 hover:bg-sd-grey-2 hover:text-sd-grey-12 transition-colors cursor-pointer"
          aria-label="View wallet details"
        >
          <Eye size={14} variant="Linear" color="currentColor" />
          View
        </button>
      ),
    },
  ];

  const skeletonRows: WalletItem[] = Array.from({ length: PAGE_SIZE }, (_, i) => ({
    id: `skeleton-${i}`,
    user: { id: "", email: "loading...", first_name: "", last_name: "" },
    balance: "0.00",
    currency: "USD",
    updated_datetime: new Date().toISOString(),
  }));

  return (
    <>
      <BaseTable
        columns={columns}
        data={isLoading ? skeletonRows : wallets}
        title="Creator Wallets"
        showHeader={false}
        selectable={false}
        showPagination={false}
        searchPlaceholder=""
        emptyText="No wallets found"
        onRowClick={(wallet) => {
          setSelectedWallet(wallet);
          setDrawerOpen(true);
        }}
        rowClassName={cn(isLoading && "animate-pulse opacity-60")}
      />

      {!isLoading && paginator && paginator.total_pages > 1 && (
        <div className="mt-[16px]">
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
        </div>
      )}

      <WalletDetailDrawer
        wallet={selectedWallet}
        isOpen={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </>
  );
};
