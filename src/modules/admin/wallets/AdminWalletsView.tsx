"use client";

import React, { useState } from "react";
import { Wallet, Receipt21, ArrowSwapHorizontal, TickCircle, CloseCircle, Clock } from "iconsax-react";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/shared/StatCard";
import { useGetAdminOverviewQuery } from "@/redux/slices/adminApi";
import { WalletsTable } from "./components/WalletsTable";
import { TransactionsTable } from "./components/TransactionsTable";
import { WithdrawalsTable } from "./components/WithdrawalsTable";

type TabId = "wallets" | "transactions" | "withdrawals";

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "wallets", label: "Wallets", icon: Wallet },
  { id: "transactions", label: "Transactions", icon: ArrowSwapHorizontal },
  { id: "withdrawals", label: "Withdrawals", icon: Receipt21 },
];

export const AdminWalletsView = () => {
  const [activeTab, setActiveTab] = useState<TabId>("wallets");
  const { data: overview } = useGetAdminOverviewQuery();

  const walletTotals = overview?.wallet_totals;
  const withdrawalCounts = overview?.withdrawals;

  return (
    <div className="flex flex-col gap-[24px]">
      {/* Stat Cards */}
      <div className="flex flex-wrap gap-[12px]">
        <StatCard
          label="Balance Held"
          value={walletTotals ? `$${parseFloat(walletTotals.balance_held).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—"}
          icon={<Wallet size={20} variant="Bold" color="#3B82F6" />}
        />
        <StatCard
          label="Total Credited"
          value={walletTotals ? `$${parseFloat(walletTotals.total_credited).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—"}
          icon={<TickCircle size={20} variant="Bold" color="#10B981" />}
        />
        <StatCard
          label="Awaiting Payout"
          value={walletTotals ? `$${parseFloat(walletTotals.awaiting_payout).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—"}
          icon={<Clock size={20} variant="Bold" color="#F59E0B" />}
        />
        <StatCard
          label="Confirmed Withdrawals"
          value={withdrawalCounts ? String(withdrawalCounts.CONFIRMED) : "—"}
          icon={<Receipt21 size={20} variant="Bold" color="#8B5CF6" />}
        />
        <StatCard
          label="Pending OTP"
          value={withdrawalCounts ? String(withdrawalCounts.PENDING_CONFIRMATION) : "—"}
          icon={<CloseCircle size={20} variant="Bold" color="#EF4444" />}
        />
      </div>

      {/* Tab Bar */}
      <div className="flex items-center gap-[4px] overflow-x-auto rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 p-[4px] w-fit">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            id={`wallets-tab-${id}`}
            onClick={() => setActiveTab(id)}
            className={cn(
              "flex items-center gap-[7px] rounded-[9px] px-[14px] py-[8px] text-[14px] font-medium tracking-[-0.28px] leading-[20px] transition-all whitespace-nowrap cursor-pointer",
              activeTab === id
                ? "bg-white text-sd-grey-12 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.1)]"
                : "text-sd-grey-10 hover:text-sd-grey-12 hover:bg-white/50"
            )}
          >
            <Icon
              size={16}
              variant={activeTab === id ? "Bold" : "Linear"}
              color={activeTab === id ? "var(--sd-grey-12)" : "var(--sd-grey-10)"}
            />
            {label}
            {/* Count badges from overview */}
            {id === "withdrawals" && withdrawalCounts && (
              <span className={cn(
                "inline-flex items-center justify-center rounded-full min-w-[18px] h-[18px] px-[4px] text-[10px] font-semibold",
                activeTab === id
                  ? "bg-sd-grey-3 text-sd-grey-11"
                  : "bg-sd-grey-3/70 text-sd-grey-10"
              )}>
                {withdrawalCounts.PENDING_CONFIRMATION + withdrawalCounts.CONFIRMED}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "wallets" && <WalletsTable />}
        {activeTab === "transactions" && <TransactionsTable />}
        {activeTab === "withdrawals" && <WithdrawalsTable />}
      </div>
    </div>
  );
};
