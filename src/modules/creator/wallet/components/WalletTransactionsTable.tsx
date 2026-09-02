"use client";

import React, { useState } from "react";
import { BaseTable } from "@/components/shared/BaseTable";
import { transactionColumns } from "@/modules/creator/dashboard/columns/transactions";
import type { WalletTransaction } from "@/modules/creator/api/transactionsApi";
import { Sort } from "iconsax-react";
import { TransactionDetailsDrawer } from "./TransactionDetailsDrawer";
import { useGetWalletTransactionsQuery } from "@/modules/creator/hooks";

export const WalletTransactionsTable = () => {
  const [selectedTransaction, setSelectedTransaction] = useState<WalletTransaction | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data: transactionsResponse } = useGetWalletTransactionsQuery();
  const walletTransactions = transactionsResponse?.data?.results ?? [];

  const handleRowClick = (transaction: WalletTransaction) => {
    setSelectedTransaction(transaction);
    setIsDrawerOpen(true);
  };

  return (
    <>
      <BaseTable
        title="Transactions"
        columns={transactionColumns}
        data={walletTransactions}
        searchPlaceholder="Search transaction"
        filters={[
          {
            label: "Status",
            icon: <Sort size={20} variant="Linear" color="#606060" />,
            options: [
              { label: "Pending", value: "Pending" },
              { label: "Successful", value: "Successful" },
              { label: "Failed", value: "Failed" },
            ],
            onValueChange: (val) => console.log("Status filter:", val),
          },
          {
            label: "Type",
            icon: <Sort size={20} variant="Linear" color="#606060" />,
            options: [
              { label: "Credit", value: "Credit" },
              { label: "Withdrawal", value: "Withdrawal" },
            ],
            onValueChange: (val) => console.log("Type filter:", val),
          },
        ]}
        showDateFilter
        showHeader={false}
        onRowClick={handleRowClick}
      />

      <TransactionDetailsDrawer
        transaction={selectedTransaction}
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
      />
    </>
  );
};
