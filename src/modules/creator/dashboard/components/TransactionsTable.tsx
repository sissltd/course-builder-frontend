"use client";

import React from "react";
import { BaseTable } from "@/components/shared/BaseTable";
import { transactionColumns, Transaction } from "../columns/transactions";

const transactions: Transaction[] = [
  { reference: "EARSF4FCkeeEqgB5nnLjt32wqMgaFJrNsnT", description: "Fundamentals of programming", date: "23 Mar 2026, 10:34 PM", amount: "$5", status: "Pending", type: "Credit" },
  { reference: "EARSF4FCkeeEqgB5nnLjt32wqMgaFJrNsnT", description: "Version Control and Collaboration", date: "23 Mar 2026, 10:34 PM", amount: "$5", status: "Successful", type: "Withdrawal" },
  { reference: "EARSF4FCkeeEqgB5nnLjt32wqMgaFJrNsnT", description: "Deployment and Maintenance Strategies", date: "23 Mar 2026, 10:34 PM", amount: "$5", status: "Successful", type: "Credit" },
  { reference: "EARSF4FCkeeEqgB5nnLjt32wqMgaFJrNsnT", description: "Deployment and Maintenance Strategies", date: "23 Mar 2026, 10:34 PM", amount: "$5", status: "Failed", type: "Credit" },
  { reference: "EARSF4FCkeeEqgB5nnLjt32wqMgaFJrNsnT", description: "Deployment and Maintenance Strategies", date: "23 Mar 2026, 10:34 PM", amount: "$5", status: "Successful", type: "Credit" },
];

export const TransactionsTable = () => {
  return (
    <BaseTable
      title="Transaction activity"
      columns={transactionColumns}
      data={transactions}
    />
  );
};
