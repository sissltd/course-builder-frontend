"use client";

import React from "react";
import { SideDrawer } from "@/components/shared/SideDrawer";
import { Transaction } from "@/modules/dashboard/columns/transactions";
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

const StatusChip = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    "Successful": "bg-[#f1f8f2] text-[#3c7e44]",
    "Pending": "bg-[#ebf3fe] text-[#0a60e1]",
    "Failed": "bg-[#ffeceb] text-[#fc5049]",
  };

  return (
    <span className={cn("px-[12px] py-[4px] rounded-[6px] text-[14px] font-medium leading-[20px]", styles[status] || "bg-sd-grey-2 text-sd-grey-12")}>
      {status}
    </span>
  );
};

const TypeChip = ({ type }: { type: string }) => {
  const styles: Record<string, string> = {
    "Credit": "bg-[#EBF3FF] text-[#0063EF]",
    "Withdrawal": "bg-[#FFF0ED] text-[#F05A25]",
  };

  return (
    <span className={cn("px-[12px] py-[4px] rounded-[6px] text-[14px] font-medium leading-[20px]", styles[type] || "bg-sd-grey-2 text-sd-grey-12")}>
      {type}
    </span>
  );
};

export const TransactionDetailsDrawer = ({
  transaction,
  isOpen,
  onOpenChange,
}: TransactionDetailsDrawerProps) => {
  if (!transaction) return null;

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
            {transaction.type === "Withdrawal" ? "-" : ""}{transaction.amount}
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
          <InfoRow label="Approved date/time" value={transaction.date} />
          <InfoRow label="Reference ID" value={transaction.reference} isCopyable />
          <InfoRow label="Description" value={transaction.description} />
          <InfoRow label="Fee" value="$0.00" />
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-[#F0F0F0] w-full" />

        {/* Recipient Information */}
        <div className="flex flex-col">
          <h3 className="text-[14px] font-semibold text-[#B6B6B6] tracking-[0.7px] uppercase mb-[8px]">
            RECIPIENT INFORMATION
          </h3>
          <InfoRow label="Account name" value="Osaite Emmanuel" />
          {transaction.type === "Withdrawal" && (
            <InfoRow label="Account number" value="1110003893" isCopyable />
          )}
          {transaction.type === "Withdrawal" && (
            <InfoRow label="Bank name" value="Access Bank" />
          )}
          <InfoRow label="Account ID" value="Td4fJcvnJ88-04924945" isCopyable />
          <InfoRow label="Reference code" value="Td4fJcvnJ88-04924945" isCopyable />
          <InfoRow 
            label={transaction.type === "Withdrawal" ? "Payment received" : "Date received"} 
            value={transaction.date} 
          />
        </div>
      </div>
    </SideDrawer>
  );
};
