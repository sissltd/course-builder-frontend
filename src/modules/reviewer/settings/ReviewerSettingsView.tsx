"use client";

import React, { useState } from "react";
import { Timer1 } from "iconsax-react";
import { ReviewerSettingsTabNav, ReviewerSettingsTab } from "./components/ReviewerSettingsTabNav";
import { AccountTab } from "./components/AccountTab";
import { AvailabilityTab } from "./components/AvailabilityTab";
import { QueueBehaviourTab } from "./components/QueueBehaviourTab";
import { NotificationsTab } from "./components/NotificationsTab";
import { LoginSecurityTab } from "./components/LoginSecurityTab";
import { DataPrivacyTab } from "./components/DataPrivacyTab";

const TAB_CONTENT: Record<ReviewerSettingsTab, React.ReactNode> = {
  account: <AccountTab />,
  availability: <AvailabilityTab />,
  "queue-behaviour": <QueueBehaviourTab />,
  notifications: <NotificationsTab />,
  "login-security": <LoginSecurityTab />,
  "data-privacy": <DataPrivacyTab />,
};

export const ReviewerSettingsView = () => {
  const [activeTab, setActiveTab] = useState<ReviewerSettingsTab>("account");

  return (
    <div className="flex h-full w-full flex-col">


      <div className="flex min-h-[calc(100vh-140px)] w-full flex-1 overflow-hidden">
        {/* Sidebar Nav */}
        <div className="w-full shrink-0 border-r border-sd-grey-3 px-[16px] py-[24px] md:w-[324px]">
          <ReviewerSettingsTabNav active={activeTab} onChange={setActiveTab} />
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-auto px-[40px] py-[40px]">
          <div className="w-full max-w-[640px]">
            {TAB_CONTENT[activeTab]}
          </div>
        </div>
      </div>
    </div>
  );
};
