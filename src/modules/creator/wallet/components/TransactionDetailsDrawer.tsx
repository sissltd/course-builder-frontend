"use client";

import React from "react";
import { SideDrawer } from "@/components/shared/SideDrawer";
import { Transaction } from "@/modules/creator/dashboard/columns/transactions";
import { TransactionType, TransactionStatus } from "@/modules/creator/api/transactionsApi";
import { Copy, ArrowDown } from "iconsax-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/shared/Button";

interface TransactionDetailsDrawerProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const InfoRow = ({ label, value, isCopyable }: { label: string; value: string; isCopyable?: boolean }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <div className="flex items-center justify-between py-[12px]">
      <span className="text-[14px] text-[#606060] font-normal leading-[20px]">{label}</span>
      <div className="flex items-center gap-[8px]">
        <span className="text-[14px] text-[#202020] font-medium leading-[20px] text-right">{value}</span>
        {isCopyable && (
          <Copy
            size={18}
            variant="Linear"
            color="#606060"
            className="cursor-pointer hover:text-[#202020] transition-colors"
            onClick={handleCopy}
          />
        )}
      </div>
    </div>
  );
};

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
    <span className={cn("px-[12px] py-[4px] rounded-[6px] text-[14px] font-medium leading-[20px]", styles[status] || "bg-sd-grey-2 text-sd-grey-12")}>
      {statusLabel[status]}
    </span>
  );
};

const TypeChip = ({ type }: { type: TransactionType }) => {
  const styles: Record<string, string> = {
    [TransactionType.CREDIT]: "bg-[#EBF3FF] text-[#0063EF]",
    [TransactionType.DEBIT]: "bg-[#FFF0ED] text-[#F05A25]",
  };

  return (
    <span className={cn("px-[12px] py-[4px] rounded-[6px] text-[14px] font-medium leading-[20px]", styles[type] || "bg-sd-grey-2 text-sd-grey-12")}>
      {typeLabel[type]}
    </span>
  );
};

export const TransactionDetailsDrawer = ({
  transaction,
  isOpen,
  onOpenChange,
}: TransactionDetailsDrawerProps) => {
  if (!transaction) return null;

  const formattedDate = new Date(transaction.created_datetime).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <SideDrawer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Transaction details"
      footer={
        <Button 
          variant="app-primary" 
          className="w-full h-[44px] text-[14px]"
          rightIcon={<ArrowDown size={20} variant="Linear" color="#FFF" />}
        >
          Download receipt
        </Button>
      }
    >
      <div className="flex flex-col gap-[24px]">
        {/* Header Section */}
        <div className="flex items-center justify-between pb-[24px] border-b border-[#F0F0F0]">
          <span className="text-[28px] font-semibold text-[#202020] tracking-[-0.56px]">
            {transaction.type === TransactionType.DEBIT ? "-" : ""}${transaction.amount}
          </span>
          <StatusChip status={transaction.status} />
        </div>

        {/* Transaction Information */}
        <div className="flex flex-col">
          <h3 className="text-[14px] font-semibold text-[#B6B6B6] tracking-[0.7px] uppercase mb-[8px]">
            TRANSACTION INFORMATION
          </h3>
          <div className="flex items-center justify-between py-[12px]">
            <span className="text-[14px] text-[#606060] font-normal leading-[20px]">Type</span>
            <TypeChip type={transaction.type} />
          </div>
          <InfoRow label="Approved date/time" value={formattedDate} />
          <InfoRow label="Reference ID" value={transaction.reference} isCopyable />
          <InfoRow label="Description" value={transaction.course?.title ?? transaction.description} />
          <InfoRow label="Fee" value={`$${transaction.fee}`} />
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-[#F0F0F0] w-full" />

        {/* Recipient Information */}
        <div className="flex flex-col">
          <h3 className="text-[14px] font-semibold text-[#B6B6B6] tracking-[0.7px] uppercase mb-[8px]">
            RECIPIENT INFORMATION
          </h3>
          <InfoRow label="Account name" value={transaction.recipient_account_name || "—"} />
          {transaction.type === TransactionType.DEBIT && (
            <InfoRow label="Account number" value={transaction.recipient_account_number || "—"} isCopyable />
          )}
          {transaction.type === TransactionType.DEBIT && (
            <InfoRow label="Bank name" value={transaction.recipient_provider_name || "—"} />
          )}
          <InfoRow 
            label={transaction.type === TransactionType.DEBIT ? "Payment received" : "Date received"} 
            value={formattedDate} 
          />
        </div>
      </div>
    </SideDrawer>
  );
};
