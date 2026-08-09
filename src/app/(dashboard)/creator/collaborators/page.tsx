import React from "react";
import { CollaboratorsView } from "@/modules/creator/collaborators/CollaboratorsView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collaborators",
};

export default function CollaboratorsPage() {
  return (
    <div className="flex flex-col gap-[24px]">
      <h1 className="text-[24px] font-semibold text-[#202020] tracking-[-0.48px] leading-[32px]">Collaborators</h1>
      <CollaboratorsView />
    </div>
  );
}
