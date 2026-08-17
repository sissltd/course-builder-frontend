"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { ArrowDown2, Calendar } from "iconsax-react";
import { Switch } from "./Switch";

export const AvailabilityTab = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [autoReturn, setAutoReturn] = useState(false);

  return (
    <div className="flex w-full flex-col gap-[24px]">
      <div className="flex flex-col gap-[8px]">
        <h2 className="text-[22px] font-medium leading-[32px] tracking-[-0.48px] text-sd-grey-12">
          Availability
        </h2>
        <p className="text-[14px] font-normal leading-[24px] tracking-[-0.28px] text-sd-grey-11">
          Control whether courses are assigned to your queue.
        </p>
      </div>

      <div className="flex flex-col gap-[24px] rounded-[12px] border border-sd-grey-3 p-[24px]">
        {/* Availability Status */}
        <div className="flex items-center justify-between gap-[24px]">
          <div className="flex flex-col gap-[4px]">
            <span className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
              Availability Status
            </span>
            <span className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
              Toggle to set your availability status
            </span>
          </div>
          <Switch checked={isAvailable} onChange={setIsAvailable} />
        </div>

        {/* Inputs */}
        <div className="flex items-start gap-[16px]">
          <div className="flex flex-1 flex-col gap-[8px]">
            <label className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
              Reason for unavailability
            </label>
            <div className="relative flex items-center">
              <select className="flex h-[44px] w-full appearance-none rounded-[8px] border border-sd-grey-4 bg-white pl-[16px] pr-[40px] text-[14px] font-normal text-sd-grey-11 outline-none focus:border-sd-blue cursor-pointer">
                <option value="" disabled selected hidden>
                  Select option
                </option>
                <option value="vacation">On Vacation</option>
                <option value="sick">Sick Leave</option>
                <option value="other">Other</option>
              </select>
              <ArrowDown2
                size={18}
                variant="Linear"
                color="var(--sd-grey-11)"
                className="absolute right-[16px] pointer-events-none"
              />
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-[8px]">
            <label className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
              Return date
            </label>
            <div className="relative flex items-center">
              <Input
                type="text"
                placeholder="00/00/0000"
                className="flex h-[44px] w-full rounded-[8px] border border-sd-grey-4 bg-white pl-[16px] pr-[40px] text-[14px] font-normal text-sd-grey-11 outline-none focus:border-sd-blue"
              />
              <Calendar
                size={18}
                variant="Linear"
                color="var(--sd-grey-11)"
                className="absolute right-[16px] pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Auto-return */}
        <div className="flex items-center justify-between gap-[24px]">
          <div className="flex flex-col gap-[4px]">
            <span className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
              Auto-return on return date
            </span>
            <span className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
              Automatically set availability back to active on the return date
            </span>
          </div>
          <Switch checked={autoReturn} onChange={setAutoReturn} />
        </div>
      </div>
    </div>
  );
};
