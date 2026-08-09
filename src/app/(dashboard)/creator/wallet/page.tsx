import React from "react";
import { WalletView } from "@/modules/creator/wallet/WalletView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wallet",
};

export default function WalletPage() {
  return (
    <div className="flex flex-col gap-[24px]">
      <h1 className="text-[24px] font-semibold text-[#202020] tracking-[-0.48px] leading-[32px]">Wallet</h1>
      <WalletView />
    </div>
  );
}
