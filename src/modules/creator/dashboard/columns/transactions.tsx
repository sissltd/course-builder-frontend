"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Copy } from "iconsax-react";
import { cn } from "@/lib/utils";
import type { WalletTransaction } from "@/modules/creator/api/transactionsApi";
import { TransactionType, TransactionStatus } from "@/modules/creator/api/transactionsApi";

export type Transaction = WalletTransaction;

const statusLabel: Record<TransactionStatus, string> = {
  [TransactionStatus.COMPLETED]: "Successful",
  [TransactionStatus.PENDING]: "Pending",
  [TransactionStatus.FAILED]: "Failed",
};

const typeLabel: Record<TransactionType, string> = {
  [TransactionType.CREDIT]: "Credit",
  [TransactionType.DEBIT]: "Withdrawal",
};

const StatusChip = ({ status }: { status: TransactionStatus }) => {
  const styles: Record<string, string> = {
    [TransactionStatus.COMPLETED]: "bg-[#f1f8f2] text-[#3c7e44]",
    [TransactionStatus.PENDING]: "bg-[#ebf3fe] text-[#0a60e1]",
    [TransactionStatus.FAILED]: "bg-[#ffeceb] text-[#fc5049]",
  };

  return (
    <span className={cn("px-2 py-1 rounded-[6px] text-[14px] font-normal tracking-[-0.28px]", styles[status] || "bg-sd-grey-2 text-sd-grey-12")}>
      {statusLabel[status]}
    </span>
  );
};

export const transactionColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "reference",
    header: "REFERENCE",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 max-w-[200px]">
        <span className="truncate">{row.getValue("reference")}</span>
        <Copy size={16} variant="Linear" color="#606060" className="shrink-0 cursor-pointer hover:text-sd-grey-12" />
      </div>
    ),
  },
  {
    accessorFn: (row) => row.course?.title ?? row.description,
    id: "description",
    header: "DESCRIPTION",
    cell: ({ row }) => (
      <span>{row.original.course?.title ?? row.original.description}</span>
    ),
  },
  {
    accessorKey: "created_datetime",
    header: "DATE",
    cell: ({ row }) => (
      <span className="whitespace-nowrap">
        {new Date(row.getValue("created_datetime")).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    ),
  },
  {
    accessorKey: "amount",
    header: "AMOUNT",
    cell: ({ row }) => (
      <span>₦{row.original.amount}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => <StatusChip status={row.original.status} />,
  },
  {
    accessorKey: "type",
    header: "TYPE",
    cell: ({ row }) => (
      <span>{typeLabel[row.original.type]}</span>
    ),
  },
];
