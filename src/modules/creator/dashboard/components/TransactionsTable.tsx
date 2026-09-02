"use client";

import React from "react";
import { BaseTable } from "@/components/shared/BaseTable";
import { transactionColumns } from "../columns/transactions";
import { useGetWalletTransactionsQuery } from "@/modules/creator/hooks";

export const TransactionsTable = () => {
  const { data: transactionsResponse } = useGetWalletTransactionsQuery();
  const transactions = transactionsResponse?.data?.results ?? [];

  return (
    <BaseTable
      title="Transaction activity"
      columns={transactionColumns}
      data={transactions}
    />
  );
};
