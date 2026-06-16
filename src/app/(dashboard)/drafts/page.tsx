import React from "react";
import { DraftsView } from "@/modules/drafts/DraftsView";

export default function DraftsPage() {
  return (
    <div className="flex flex-col gap-[24px]">
      <h1 className="text-[24px] font-semibold text-[#202020] tracking-[-0.48px] leading-[32px]">Drafts</h1>
      <DraftsView />
    </div>
  );
}
