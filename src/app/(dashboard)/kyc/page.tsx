import React, { Suspense } from "react";
import KYCView from "@/modules/kyc/KYCView";

export default function KYCPage() {
  return (
    <Suspense>
      <KYCView />
    </Suspense>
  );
}
