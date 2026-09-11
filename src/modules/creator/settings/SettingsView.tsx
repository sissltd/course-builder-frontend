"use client";

import React, { useState } from "react";
import { SettingsLayout } from "@/components/shared/SettingsLayout";
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
    <SettingsLayout
      heading="Settings"
      nav={<SettingsTabNav active={activeTab} onChange={setActiveTab} />}
      navClassName="w-full md:w-[300px] px-[16px] py-[24px]"
      contentClassName="px-[40px] py-[32px]"
    >
      <div className="max-w-[800px] w-full">
        {TAB_CONTENT[activeTab]}
      </div>
    </SettingsLayout>
  );
};
