import React from "react";
import { CollaboratorsView } from "@/modules/collaborators/CollaboratorsView";

export default function CollaboratorsPage() {
  return (
    <div className="flex flex-col gap-[24px]">
      <h1 className="text-[24px] font-semibold text-[#202020] tracking-[-0.48px] leading-[32px]">Collaborators</h1>
      <CollaboratorsView />
    </div>
  );
}
