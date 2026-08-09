import React, { Suspense } from "react";
import type { Metadata } from "next";
import KYCView from "@/modules/creator/kyc/KYCView";

export const metadata: Metadata = {
  title: "KYC",
};

export default function KYCPage() {
  return (
    <Suspense>
      <KYCView />
    </Suspense>
  );
}
