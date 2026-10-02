"use client";

import React, { useMemo, useState } from "react";
import {
  AdminSettingsTabNav,
  AdminSettingsTab,
  visibleAdminSettingsTabs,
} from "./components/AdminSettingsTabNav";
import { AccountTab } from "./components/AccountTab";
import { AdminNotificationsTab } from "./components/AdminNotificationsTab";
import { PermissionsTab } from "./components/PermissionsTab";
import { PlatformTab } from "./components/PlatformTab";
import { PaymentsTab } from "./components/PaymentsTab";
import { AchievementAwardsTab } from "./components/AchievementAwardsTab";
import { SecuritySettingsTab } from "./components/SecuritySettingsTab";
import { usePermissions } from "@/modules/auth/hooks/usePermissions";

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
  const { can } = usePermissions();

  /*
    Derived rather than reset in an effect: a tab can disappear when a role
    edit lands (the profile is refetched and the permission set shrinks), and
    reading the hidden tab's content would leave the panel on a tab no longer
    in the nav.
  */
  const resolvedTab = useMemo(() => {
    const visible = visibleAdminSettingsTabs(can).map((tab) => tab.id);
    return visible.includes(activeTab) ? activeTab : "account";
  }, [can, activeTab]);

  return (
    <div className="flex min-h-[calc(100vh-132px)] w-full min-w-0 flex-col overflow-hidden md:flex-row">
      <div className="w-full min-w-0 shrink-0 border-b border-sd-grey-3 py-[12px] md:w-[324px] md:border-b-0 md:border-r md:px-[16px] md:py-[20px]">
        <AdminSettingsTabNav active={resolvedTab} onChange={setActiveTab} />
      </div>
      <div className="min-w-0 flex-1 overflow-auto px-[4px] py-[24px] sm:px-[16px] md:px-[34px] md:py-[40px]">
        <div className={resolvedTab === "permissions" ? "w-full max-w-[820px]" : resolvedTab === "achievement-awards" ? "w-full max-w-[760px]" : "w-full max-w-[640px]"}>
          {TAB_CONTENT[resolvedTab]}
        </div>
      </div>
    </div>
  );
};
