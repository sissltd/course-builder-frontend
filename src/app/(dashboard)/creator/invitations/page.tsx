import { Suspense } from "react";
import type { Metadata } from "next";

import { InvitationsView } from "@/modules/creator/invitations/InvitationsView";

export const metadata: Metadata = {
  title: "Invitations",
  description:
    "Invite people to your workspace and manage the invitations you have sent.",
};

export default function CreatorInvitationsPage() {
  return (
    <div className="flex flex-col gap-[24px]">
      <h1 className="text-[24px] font-semibold text-[#202020] tracking-[-0.48px] leading-[32px]">
        Invitations
      </h1>
      <Suspense
        fallback={
          <div className="flex items-center gap-[10px] py-[40px]">
            <span className="size-4 animate-spin rounded-full border-2 border-[#0063EF] border-t-transparent" />
            <span className="text-[14px] text-[#636363]">Loading invitations...</span>
          </div>
        }
      >
        <InvitationsView />
      </Suspense>
    </div>
  );
}
