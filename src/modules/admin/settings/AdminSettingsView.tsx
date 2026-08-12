"use client";

import React, { useState } from "react";
import { AdminSettingsTabNav, AdminSettingsTab } from "./components/AdminSettingsTabNav";
import { AccountTab } from "./components/AccountTab";
import { AdminNotificationsTab } from "./components/AdminNotificationsTab";
import { PermissionsTab } from "./components/PermissionsTab";
import { PlatformTab } from "./components/PlatformTab";
import { PaymentsTab } from "./components/PaymentsTab";
import { AchievementAwardsTab } from "./components/AchievementAwardsTab";
import { SecuritySettingsTab } from "./components/SecuritySettingsTab";

const TAB_CONTENT: Record<AdminSettingsTab, React.ReactNode> = {
  account:       <AccountTab />,
  notifications: <AdminNotificationsTab />,
  permissions:   <PermissionsTab />,
  platform:      <PlatformTab />,
  payments:      <PaymentsTab />,
  "achievement-awards": <AchievementAwardsTab />,
  security:      <SecuritySettingsTab />,
};

export const AdminSettingsView = () => {
  const [activeTab, setActiveTab] = useState<AdminSettingsTab>("account");

  return (
    <div className="flex min-h-[calc(100vh-132px)] w-full overflow-hidden">
      <div className="w-full shrink-0 border-r border-sd-grey-3 px-[16px] py-[20px] md:w-[324px]">
        <AdminSettingsTabNav active={activeTab} onChange={setActiveTab} />
      </div>
      <div className="flex-1 overflow-auto px-[34px] py-[40px]">
        <div className={activeTab === "permissions" ? "w-full max-w-[820px]" : activeTab === "achievement-awards" ? "w-full max-w-[760px]" : "w-full max-w-[640px]"}>
          {TAB_CONTENT[activeTab]}
        </div>
      </div>
    </div>
  );
};
