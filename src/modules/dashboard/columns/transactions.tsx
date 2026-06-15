"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Copy } from "iconsax-react";
import { cn } from "@/lib/utils";

export type Transaction = {
  reference: string;
  description: string;
  date: string;
  amount: string;
  status: "Pending" | "Successful" | "Failed";
  type: "Credit" | "Withdrawal";
};

const StatusChip = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    "Successful": "bg-[#f1f8f2] text-[#3c7e44]",
    "Pending": "bg-[#ebf3fe] text-[#0a60e1]",
    "Failed": "bg-[#ffeceb] text-[#fc5049]",
  };

  return (
    <span className={cn("px-2 py-1 rounded-[6px] text-[14px] font-normal tracking-[-0.28px]", styles[status] || "bg-sd-grey-2 text-sd-grey-12")}>
      {status}
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
    accessorKey: "description",
    header: "DESCRIPTION",
  },
  {
    accessorKey: "date",
    header: "DATE",
    cell: ({ row }) => <span className="whitespace-nowrap">{row.getValue("date")}</span>,
  },
  {
    accessorKey: "amount",
    header: "AMOUNT",
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => <StatusChip status={row.getValue("status")} />,
  },
  {
    accessorKey: "type",
    header: "TYPE",
  },
];
