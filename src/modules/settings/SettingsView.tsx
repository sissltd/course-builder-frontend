"use client";

import React, { useState } from "react";
import { SettingsTabNav, SettingsTab } from "./components/SettingsTabNav";
import { AccountSettingsTab } from "./components/AccountSettingsTab";
import { PaymentTab } from "./components/PaymentTab";
import { NotificationsSettingsTab } from "./components/NotificationsSettingsTab";
import { LoginSecurityTab } from "./components/LoginSecurityTab";
import { PrivacyTab } from "./components/PrivacyTab";

const TAB_CONTENT: Record<SettingsTab, React.ReactNode> = {
  account:       <AccountSettingsTab />,
  payment:       <PaymentTab />,
  notifications: <NotificationsSettingsTab />,
  security:      <LoginSecurityTab />,
  privacy:       <PrivacyTab />,
};

export const SettingsView = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("account");

  return (
    <div className="w-full bg-[#FDFDFD] border border-[#F0F0F0] rounded-[20px] flex overflow-hidden min-h-[600px]">
      {/* Left nav */}
      <div className="w-[300px] shrink-0 border-r border-[#F0F0F0] px-[16px] py-[24px]">
        <SettingsTabNav active={activeTab} onChange={setActiveTab} />
      </div>

      {/* Right content */}
      <div className="flex-1 px-[40px] py-[32px] overflow-auto">
        <div className="max-w-[800px] w-full">
          {TAB_CONTENT[activeTab]}
        </div>
      </div>
    </div>
  );
};
