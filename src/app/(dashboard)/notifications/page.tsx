import React from "react";
import { NotificationsView } from "@/modules/notifications/NotificationsView";

export default function NotificationsPage() {
  return (
    <div className="flex flex-col gap-[24px]">
      <h1 className="text-[24px] font-semibold text-[#202020] tracking-[-0.48px] leading-[32px]">Notifications</h1>
      <NotificationsView />
    </div>
  );
}
