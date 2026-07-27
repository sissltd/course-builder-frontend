"use client";

import React, { useState } from "react";
import { AdminSettingsTabNav, AdminSettingsTab } from "./components/AdminSettingsTabNav";
import { AccountTab } from "./components/AccountTab";
import { AdminNotificationsTab } from "./components/AdminNotificationsTab";
import { PermissionsTab } from "./components/PermissionsTab";
import { PlatformTab } from "./components/PlatformTab";
import { PaymentsTab } from "./components/PaymentsTab";
import { SecuritySettingsTab } from "./components/SecuritySettingsTab";

const TAB_CONTENT: Record<AdminSettingsTab, React.ReactNode> = {
  account:       <AccountTab />,
  notifications: <AdminNotificationsTab />,
  permissions:   <PermissionsTab />,
  platform:      <PlatformTab />,
  payments:      <PaymentsTab />,
  security:      <SecuritySettingsTab />,
};

export const AdminSettingsView = () => {
  const [activeTab, setActiveTab] = useState<AdminSettingsTab>("account");

  return (
    <div className="w-full bg-[#FDFDFD] border border-[#F0F0F0] rounded-[20px] flex overflow-hidden min-h-[700px]">
      <div className="w-full md:w-[326px] shrink-0 border-r border-[#F0F0F0] px-[16px] py-[20px]">
        <AdminSettingsTabNav active={activeTab} onChange={setActiveTab} />
      </div>
      <div className="flex-1 px-[40px] py-[32px] overflow-auto">
        <div className="w-full max-w-[800px]">
          {TAB_CONTENT[activeTab]}
        </div>
      </div>
    </div>
  );
};
