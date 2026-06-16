"use client";

import React, { useState } from "react";
import { BaseTable } from "@/components/shared/BaseTable";
import { transactionColumns, Transaction } from "@/modules/dashboard/columns/transactions";
import { Sort } from "iconsax-react";
import { TransactionDetailsDrawer } from "./TransactionDetailsDrawer";

const walletTransactions: Transaction[] = [
  { reference: "EARSF4FCkeeEqgB5n...", description: "Fundamentals of programming", date: "23 Mar 2026, 10:34 PM", amount: "$5", status: "Pending", type: "Credit" },
  { reference: "EARSF4FCkeeEqgB5n...", description: "Version Control and Collaboration", date: "23 Mar 2026, 10:34 PM", amount: "$500", status: "Successful", type: "Withdrawal" },
  { reference: "EARSF4FCkeeEqgB5n...", description: "Deployment and Maintenance Strategies", date: "23 Mar 2026, 10:34 PM", amount: "$5", status: "Successful", type: "Credit" },
  { reference: "EARSF4FCkeeEqgB5n...", description: "Deployment and Maintenance Strategies", date: "23 Mar 2026, 10:34 PM", amount: "$5", status: "Failed", type: "Credit" },
  { reference: "EARSF4FCkeeEqgB5n...", description: "Deployment and Maintenance Strategies", date: "23 Mar 2026, 10:34 PM", amount: "$5", status: "Failed", type: "Credit" },
  { reference: "EARSF4FCkeeEqgB5n...", description: "Deployment and Maintenance Strategies", date: "23 Mar 2026, 10:34 PM", amount: "$5", status: "Successful", type: "Credit" },
];

export const WalletTransactionsTable = () => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
