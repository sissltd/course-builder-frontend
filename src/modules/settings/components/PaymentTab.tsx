import React from "react";
import { Card, Wallet, ReceiptItem } from "iconsax-react";

export const PaymentTab = () => {
  return (
    <div className="flex flex-col gap-[28px]">
      <div>
        <h2 className="text-[20px] font-semibold text-[#202020] tracking-[-0.4px] leading-[28px]">Payment settings</h2>
        <p className="text-[14px] text-[#636363] mt-[4px]">Manage your payment methods and bank accounts</p>
      </div>

      <div className="h-px bg-[#F0F0F0]" />

      {/* Bank account */}
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-[12px]">
          <div className="size-[40px] rounded-[8px] bg-[#EBF3FF] flex items-center justify-center shrink-0">
            <Card size={22} variant="Bulk" color="#0063EF" />
          </div>
          <div className="flex flex-col gap-[2px]">
            <p className="text-[15px] font-semibold text-[#202020] tracking-[-0.3px]">Bank account</p>
            <p className="text-[14px] text-[#636363]">No bank account linked yet</p>
          </div>
        </div>
        <button className="h-[36px] px-[18px] border border-[#0063EF] rounded-[8px] text-[14px] text-[#0063EF] hover:bg-[#EBF3FF] transition-colors font-medium whitespace-nowrap">
          Add account
        </button>
      </div>

      <div className="h-px bg-[#F0F0F0]" />

      {/* Wallet */}
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-[12px]">
          <div className="size-[40px] rounded-[8px] bg-[#EBF7EE] flex items-center justify-center shrink-0">
            <Wallet size={22} variant="Bulk" color="#27AE60" />
          </div>
          <div className="flex flex-col gap-[2px]">
            <p className="text-[15px] font-semibold text-[#202020] tracking-[-0.3px]">Wallet balance</p>
            <p className="text-[14px] text-[#636363]">$456,000.00 available</p>
          </div>
        </div>
        <button className="h-[36px] px-[18px] border border-[#D9D9D9] rounded-[8px] text-[14px] text-[#606060] hover:bg-[#F5F5F5] transition-colors font-medium whitespace-nowrap">
          Withdraw
        </button>
      </div>

      <div className="h-px bg-[#F0F0F0]" />

      {/* Transaction history */}
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-[12px]">
          <div className="size-[40px] rounded-[8px] bg-[#FFF0ED] flex items-center justify-center shrink-0">
            <ReceiptItem size={22} variant="Bulk" color="#F05A25" />
          </div>
          <div className="flex flex-col gap-[2px]">
            <p className="text-[15px] font-semibold text-[#202020] tracking-[-0.3px]">Transaction history</p>
            <p className="text-[14px] text-[#636363]">View all your past transactions</p>
          </div>
        </div>
        <button className="h-[36px] px-[18px] border border-[#D9D9D9] rounded-[8px] text-[14px] text-[#606060] hover:bg-[#F5F5F5] transition-colors font-medium whitespace-nowrap">
          View all
        </button>
      </div>
    </div>
  );
};
