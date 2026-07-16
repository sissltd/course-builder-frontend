import React from "react";
import { NotificationsList } from "./components/NotificationsList";

export const NotificationsView = () => {
  return (
    <div className="flex flex-col gap-[24px] w-full">
      <NotificationsList />
    </div>
  );
};
