"use client";

import React, { useState } from "react";
import { ArrowDown2, DirectInbox } from "iconsax-react";
import { Switch } from "./Switch";
import { Button } from "@/components/shared/Button";

export const NotificationsTab = () => {
  const [newCourse, setNewCourse] = useState(true);
  const [escalation, setEscalation] = useState(false);
  const [creatorFeedback, setCreatorFeedback] = useState(true);

  const [slaAmber, setSlaAmber] = useState(true);
  const [slaRed, setSlaRed] = useState(true);
  const [slaBreached, setSlaBreached] = useState(true);

  const [inAppNotification, setInAppNotification] = useState(true);

  return (
    <div className="flex w-full flex-col gap-[24px]">
      <div className="flex flex-col gap-[8px]">
        <h2 className="text-[22px] font-medium leading-[32px] tracking-[-0.48px] text-sd-grey-12">
          Notification settings
        </h2>
        <p className="text-[14px] font-normal leading-[24px] tracking-[-0.28px] text-sd-grey-11">
          Configure how your events demonstrate
        </p>
      </div>

      <div className="flex flex-col gap-[24px] rounded-[12px] border border-sd-grey-3 p-[24px]">
        <h3 className="mb-[20px] block text-[14px] font-medium uppercase leading-[20px] tracking-[-0.28px] text-sd-grey-12">
          QUEUE AND ASSIGNED ALERTS
        </h3>

        {/* New course assigned to me */}
        <div className="flex items-center justify-between gap-[24px]">
          <div className="flex flex-col gap-[4px]">
            <span className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
              New course assigned to me
            </span>
            <span className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
              Get notified when your course is assigned to you
            </span>
          </div>
          <Switch checked={newCourse} onChange={setNewCourse} />
        </div>

        {/* Escalation assigned to me */}
        <div className="flex items-center justify-between gap-[24px]">
          <div className="flex flex-col gap-[4px]">
            <span className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
              Escalation assigned to me
            </span>
            <span className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
              QA Reviewer only -
            </span>
          </div>
          <Switch checked={escalation} onChange={setEscalation} />
        </div>

        {/* Creator feedback */}
        <div className="flex items-center justify-between gap-[24px]">
          <div className="flex flex-col gap-[4px]">
            <span className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
              Creator feedback
            </span>
            <span className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
              When a creator appeals for a course
            </span>
          </div>
          <Switch checked={creatorFeedback} onChange={setCreatorFeedback} />
        </div>
      </div>

      <div className="flex flex-col gap-[24px] rounded-[12px] border border-sd-grey-3 p-[24px]">
        <h3 className="mb-[20px] block text-[14px] font-medium uppercase leading-[20px] tracking-[-0.28px] text-sd-grey-12">
          SLA ALERTS
        </h3>

        {/* SLA Amber Warning */}
        <div className="flex items-center justify-between gap-[24px]">
          <div className="flex flex-col gap-[4px]">
            <span className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
              SLA Amber Warning
            </span>
            <span className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
              When a course in your queue hits the amber threshold
            </span>
          </div>
          <Switch checked={slaAmber} onChange={setSlaAmber} />
        </div>

        {/* SLA Red Critical Alert */}
        <div className="flex items-center justify-between gap-[24px]">
          <div className="flex flex-col gap-[4px]">
            <span className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
              SLA Red Critical Alert
            </span>
            <span className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
              When a course hits critical threshold
            </span>
          </div>
          <Switch checked={slaRed} onChange={setSlaRed} />
        </div>

        {/* SLA Breached */}
        <div className="flex items-center justify-between gap-[24px]">
          <div className="flex flex-col gap-[4px]">
            <span className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
              SLA Breached
            </span>
            <span className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
              Fires immediately when 48h window is missed
            </span>
          </div>
          <Switch checked={slaBreached} onChange={setSlaBreached} />
        </div>
      </div>

      <div className="flex flex-col gap-[24px] rounded-[12px] border border-sd-grey-3 p-[24px]">
        <h3 className="mb-[20px] block text-[14px] font-medium uppercase leading-[20px] tracking-[-0.28px] text-sd-grey-12">
          SLA THRESHOLDS
        </h3>

        {/* Amber warning */}
        <div className="flex items-center justify-between gap-[24px]">
          <div className="flex flex-col gap-[4px]">
            <span className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
              Amber warning
            </span>
            <span className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
              Configure alert threshold
            </span>
          </div>
          <div className="relative flex w-[120px] items-center">
            <select className="flex h-[40px] w-full appearance-none rounded-[8px] border border-sd-grey-4 bg-white pl-[16px] pr-[36px] text-[14px] font-normal text-sd-grey-11 outline-none focus:border-sd-blue cursor-pointer">
              <option value="36h">36h</option>
              <option value="24h">24h</option>
              <option value="48h">48h</option>
            </select>
            <ArrowDown2
              size={18}
              variant="Linear"
              color="var(--sd-grey-11)"
              className="absolute right-[12px] pointer-events-none"
            />
          </div>
        </div>

        {/* Red Critical Threshold */}
        <div className="flex items-center justify-between gap-[24px]">
          <div className="flex flex-col gap-[4px]">
            <span className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
              Red Critical Threshold
            </span>
            <span className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
              Configure how you receive upate
            </span>
          </div>
          <div className="relative flex w-[120px] items-center">
            <select className="flex h-[40px] w-full appearance-none rounded-[8px] border border-sd-grey-4 bg-white pl-[16px] pr-[36px] text-[14px] font-normal text-sd-grey-11 outline-none focus:border-sd-blue cursor-pointer">
              <option value="36h">36h</option>
              <option value="24h">24h</option>
              <option value="48h">48h</option>
            </select>
            <ArrowDown2
              size={18}
              variant="Linear"
              color="var(--sd-grey-11)"
              className="absolute right-[12px] pointer-events-none"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-[24px] px-[8px] pt-[8px]">
        <div className="flex items-center gap-[16px]">
          <DirectInbox size={24} variant="Linear" color="var(--sd-grey-11)" />
          <div className="flex flex-col gap-[2px]">
            <span className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
              In-app notification
            </span>
            <span className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
              Configure how you receive upate
            </span>
          </div>
        </div>
        <Switch checked={inAppNotification} onChange={setInAppNotification} />
      </div>

      <div className="flex justify-end pt-[8px]">
        <Button
          type="button"
          size="app"
          className="h-[44px] rounded-[8px] bg-[#0056D2] px-[24px] text-[14px] font-medium text-white hover:bg-[#0047B8]"
        >
          Save changes
        </Button>
      </div>
    </div>
  );
};
