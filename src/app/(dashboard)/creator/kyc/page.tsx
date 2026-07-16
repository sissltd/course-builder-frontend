import React, { Suspense } from "react";
import KYCView from "@/modules/creator/kyc/KYCView";

export default function KYCPage() {
  return (
    <Suspense>
      <KYCView />
    </Suspense>
  );
}
