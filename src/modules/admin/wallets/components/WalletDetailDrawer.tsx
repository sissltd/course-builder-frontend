"use client";

import React, { useState } from "react";
import { format, parseISO } from "date-fns";
import { Copy, ArrowLeft, ArrowRight2 } from "iconsax-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { SideDrawer } from "@/components/shared/SideDrawer";
import { useGetAdminTransactionsQuery } from "@/redux/slices/adminApi";
import type { WalletItem, TransactionItem } from "@/redux/slices/adminApi";

interface WalletDetailDrawerProps {
  wallet: WalletItem | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const TX_TYPE_CONFIG = {
  CREDIT: { label: "Credit", className: "bg-[#ECFDF5] text-[#047857]" },
  DEBIT: { label: "Debit", className: "bg-[#FEF2F2] text-[#B91C1C]" },
};

const TX_STATUS_CONFIG = {
  COMPLETED: { label: "Completed", className: "bg-[#ECFDF5] text-[#047857]" },
  PENDING: { label: "Pending", className: "bg-[#FFFBEB] text-[#B45309]" },
  FAILED: { label: "Failed", className: "bg-[#FEF2F2] text-[#B91C1C]" },
};

const DetailRow = ({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) => (
  <div className="flex items-start justify-between gap-[16px] py-[10px] border-b border-sd-grey-3 last:border-0">
    <span className="shrink-0 text-[13px] font-normal leading-[18px] tracking-[-0.26px] text-sd-grey-10">
      {label}
    </span>
    <span className={cn("text-[13px] font-medium leading-[18px] tracking-[-0.26px] text-sd-grey-12 text-right break-all", mono && "font-mono text-[12px]")}>
      {value}
    </span>
  </div>
);

const TxRow = ({ tx }: { tx: TransactionItem }) => {
  const typeConfig = TX_TYPE_CONFIG[tx.type];
  const statusConfig = TX_STATUS_CONFIG[tx.status];
  const isCredit = tx.type === "CREDIT";

  return (
    <div className="flex items-start gap-[12px] py-[12px] border-b border-sd-grey-3 last:border-0">
      {/* Amount indicator */}
      <div className={cn(
        "flex size-[36px] shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
        isCredit ? "bg-[#ECFDF5] text-[#047857]" : "bg-[#FEF2F2] text-[#B91C1C]"
      )}>
        {isCredit ? "+" : "−"}
      </div>

      <div className="flex flex-1 flex-col gap-[4px] min-w-0">
        <div className="flex items-start justify-between gap-[8px]">
          <p className="text-[13px] font-medium leading-[18px] tracking-[-0.26px] text-sd-grey-12 line-clamp-1">
            {tx.description || tx.reference}
          </p>
          <span className={cn("text-[13px] font-semibold leading-[18px] tracking-[-0.26px] shrink-0", isCredit ? "text-[#047857]" : "text-[#B91C1C]")}>
            {isCredit ? "+" : "−"}${parseFloat(tx.amount).toFixed(2)}
          </span>
        </div>
        <div className="flex items-center gap-[8px]">
          <span className={cn("inline-flex items-center rounded-full px-[8px] py-[2px] text-[11px] font-medium", statusConfig.className)}>
            {statusConfig.label}
            {tx.status === "PENDING" && tx.type === "DEBIT" && " (awaiting bank transfer)"}
          </span>
          <span className="text-[11px] text-sd-grey-10 leading-[16px]">
            {format(parseISO(tx.created_datetime), "MMM d, yyyy")}
          </span>
        </div>
        {tx.course && (
          <p className="text-[11px] text-sd-grey-10 leading-[16px] truncate">
            Course: {tx.course.title}
          </p>
        )}
      </div>
    </div>
  );
};

export const WalletDetailDrawer = ({ wallet, isOpen, onOpenChange }: WalletDetailDrawerProps) => {
  const [txPage, setTxPage] = useState(1);

  const { data: txData, isLoading: txLoading } = useGetAdminTransactionsQuery(
    wallet ? { user: wallet.user.id, page: txPage, size: 5 } : undefined,
    { skip: !wallet }
  );

  if (!wallet) return null;

  const fullName = `${wallet.user.first_name} ${wallet.user.last_name}`.trim() || wallet.user.email;
  const transactions = (txData?.data?.results ?? []).flat();
  const paginator = txData?.data?.paginator;

  const copyId = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied`);
    } catch {
      toast.error("Could not copy");
    }
  };

  return (
    <SideDrawer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      side="right"
      showCloseButton={false}
      className="!w-full !max-w-full shadow-[0px_8px_16px_0px_rgba(0,0,0,0.1)] md:!w-[440px] md:!max-w-[440px]"
      headerClassName="border-sd-grey-6 px-[20px]"
      contentClassName="px-[20px] pb-[24px] pt-[20px]"
      title={
        <div className="flex w-full items-center justify-between gap-[16px]">
          <span className="truncate text-[20px] font-semibold leading-[28px] text-sd-grey-12">
            Wallet Details
          </span>
        </div>
      }
    >
      {/* Creator info */}
      <div className="mb-[20px] flex items-center gap-[12px]">
        <div className="flex size-[48px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] text-white text-[18px] font-semibold">
          {wallet.user.first_name?.[0]?.toUpperCase() || wallet.user.email[0]?.toUpperCase()}
        </div>
        <div className="flex flex-col gap-[2px] min-w-0">
          <p className="text-[16px] font-semibold leading-[22px] tracking-[-0.32px] text-sd-grey-12 truncate">
            {fullName}
          </p>
          <p className="text-[13px] text-sd-grey-10 leading-[18px] truncate">{wallet.user.email}</p>
        </div>
      </div>

      {/* Balance card */}
      <div className="mb-[20px] rounded-[16px] bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-[20px] text-white">
        <p className="text-[12px] font-medium uppercase tracking-[0.5px] text-white/60 mb-[8px]">
          Current Balance
        </p>
        <p className="text-[36px] font-bold leading-[44px] tracking-[-1px]">
          {wallet.currency === "USD" ? "$" : wallet.currency}{parseFloat(wallet.balance).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <p className="text-[12px] text-white/50 mt-[8px]">
          Last updated {format(parseISO(wallet.updated_datetime), "MMM d, yyyy · h:mm a")}
        </p>
      </div>

      {/* Details */}
      <div className="mb-[20px] rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 px-[16px]">
        <DetailRow label="Wallet ID" value={wallet.id} mono />
        <div className="flex items-start justify-between gap-[16px] py-[10px] border-b border-sd-grey-3">
          <span className="shrink-0 text-[13px] font-normal leading-[18px] tracking-[-0.26px] text-sd-grey-10">User ID</span>
          <div className="flex items-center gap-[6px]">
            <span className="font-mono text-[12px] font-medium leading-[18px] text-sd-grey-12 text-right break-all">{wallet.user.id}</span>
            <button
              type="button"
              onClick={() => copyId(wallet.user.id, "User ID")}
              className="shrink-0 text-sd-grey-10 hover:text-sd-grey-12 transition-colors cursor-pointer"
              aria-label="Copy user ID"
            >
              <Copy size={14} variant="Linear" color="currentColor" />
            </button>
          </div>
        </div>
        <DetailRow label="Currency" value={wallet.currency} />
      </div>

      {/* Transactions */}
      <div>
        <div className="flex items-center justify-between mb-[12px]">
          <h3 className="text-[15px] font-semibold leading-[22px] tracking-[-0.3px] text-sd-grey-12">
            Transaction History
          </h3>
          {paginator && (
            <span className="text-[12px] text-sd-grey-10">{paginator.count} total</span>
          )}
        </div>

        {txLoading && (
          <div className="flex flex-col gap-[10px]">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[64px] rounded-[8px] bg-sd-grey-2 animate-pulse" />
            ))}
          </div>
        )}

        {!txLoading && transactions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-[40px] text-center">
            <div className="size-[44px] rounded-full bg-sd-grey-2 flex items-center justify-center mb-[12px]">
              <ArrowRight2 size={20} variant="Linear" color="var(--sd-grey-10)" />
            </div>
            <p className="text-[13px] text-sd-grey-10">No transactions yet</p>
          </div>
        )}

        {!txLoading && transactions.length > 0 && (
          <div className="rounded-[12px] border border-sd-grey-3 bg-white px-[12px]">
            {transactions.map((tx) => (
              <TxRow key={tx.id} tx={tx} />
            ))}
          </div>
        )}

        {/* Mini pagination */}
        {paginator && paginator.total_pages > 1 && (
          <div className="flex items-center justify-between mt-[12px]">
            <button
              type="button"
              onClick={() => setTxPage((p) => Math.max(1, p - 1))}
              disabled={txPage === 1}
              className={cn(
                "flex items-center gap-[4px] text-[12px] font-medium px-[10px] py-[6px] rounded-[8px] transition-colors",
                txPage === 1 ? "text-sd-grey-8 cursor-not-allowed" : "text-sd-grey-11 hover:bg-sd-grey-2 cursor-pointer"
              )}
            >
              <ArrowLeft size={14} variant="Linear" color="currentColor" />
              Prev
            </button>
            <span className="text-[12px] text-sd-grey-10">
              {txPage} / {paginator.total_pages}
            </span>
            <button
              type="button"
              onClick={() => setTxPage((p) => Math.min(paginator.total_pages, p + 1))}
              disabled={txPage === paginator.total_pages}
              className={cn(
                "flex items-center gap-[4px] text-[12px] font-medium px-[10px] py-[6px] rounded-[8px] transition-colors",
                txPage === paginator.total_pages ? "text-sd-grey-8 cursor-not-allowed" : "text-sd-grey-11 hover:bg-sd-grey-2 cursor-pointer"
              )}
            >
              Next
              <ArrowRight2 size={14} variant="Linear" color="currentColor" />
            </button>
          </div>
        )}
      </div>
    </SideDrawer>
  );
};
