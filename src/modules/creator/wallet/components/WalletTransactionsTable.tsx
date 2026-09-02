"use client";

import React, { useState } from "react";
import { BaseTable } from "@/components/shared/BaseTable";
import { transactionColumns, Transaction } from "@/modules/creator/dashboard/columns/transactions";
import type { WalletTransactionListParams } from "@/modules/creator/api/transactionsApi";
import { TransactionType, TransactionStatus } from "@/modules/creator/api/transactionsApi";
import { Sort } from "iconsax-react";
import { TransactionDetailsDrawer } from "./TransactionDetailsDrawer";
import { useGetWalletTransactionsQuery } from "@/modules/creator/hooks";

export const WalletTransactionsTable = () => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<WalletTransactionListParams>({});

  const { data: transactionsResponse } = useGetWalletTransactionsQuery(filters);
  const walletTransactions: Transaction[] = transactionsResponse?.data?.results ?? [];

  const handleRowClick = (transaction: Transaction) => {
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
              { label: "Pending", value: TransactionStatus.PENDING },
              { label: "Successful", value: TransactionStatus.COMPLETED },
              { label: "Failed", value: TransactionStatus.FAILED },
            ],
            onValueChange: (val) =>
              setFilters((prev) => ({
                ...prev,
                status: (val as TransactionStatus) || undefined,
              })),
          },
          {
            label: "Type",
            icon: <Sort size={20} variant="Linear" color="#606060" />,
            options: [
              { label: "Credit", value: TransactionType.CREDIT },
              { label: "Withdrawal", value: TransactionType.DEBIT },
            ],
            onValueChange: (val) =>
              setFilters((prev) => ({
                ...prev,
                type: (val as TransactionType) || undefined,
              })),
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
