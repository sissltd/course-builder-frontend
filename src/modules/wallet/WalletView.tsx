import React from "react";
import { BankAccountBanner } from "./components/BankAccountBanner";
import { WalletOverview } from "./components/WalletOverview";
import { WalletTransactionsTable } from "./components/WalletTransactionsTable";

export const WalletView = () => {
  return (
    <div className="flex flex-col gap-[24px] pb-[20px]">
      <BankAccountBanner />
      <WalletOverview />
      <WalletTransactionsTable />
    </div>
  );
};
