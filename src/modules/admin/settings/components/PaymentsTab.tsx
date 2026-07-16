"use client";

import React from "react";
import { FormSelect } from "@/components/form/FormSelect";
import { Button } from "@/components/shared/Button";

const currencyOptions = [
  { label: "USD - US Dollar", value: "usd" },
  { label: "EUR - Euro", value: "eur" },
  { label: "GBP - British Pound", value: "gbp" },
  { label: "NGN - Nigerian Naira", value: "ngn" },
];

const commissionOptions = [
  { label: "5%", value: "5" },
  { label: "10%", value: "10" },
  { label: "15%", value: "15" },
  { label: "20%", value: "20" },
  { label: "25%", value: "25" },
];

export const PaymentsTab = () => {
  return (
    <div className="flex flex-col gap-[24px] w-full">
      <div>
        <h3 className="text-[24px] font-medium text-[#202020] tracking-[-0.48px] leading-[32px]">Payment Settings</h3>
        <p className="text-[16px] font-normal text-[#606060] leading-[24px]">Configure payment methods, commission rates, and payout schedules</p>
      </div>

      <div className="border border-[#F0F0F0] p-[16px] rounded-[12px]">
        <div className="flex flex-col gap-[16px]">
          <FormSelect name="currency" label="Default currency" placeholder="Select currency" options={currencyOptions} />
          <FormSelect name="commission" label="Platform commission rate" placeholder="Select commission rate" options={commissionOptions} />
        </div>
      </div>

      <div className="border border-[#F0F0F0] p-[16px] rounded-[12px]">
        <span className="text-[14px] font-medium text-[#202020] tracking-[-0.28px] leading-[20px] block mb-[20px]">PAYOUT SCHEDULE</span>
        <div className="flex flex-col gap-[20px]">
          {[
            { title: "Weekly payouts", desc: "Process creator payouts every week" },
            { title: "Bi-weekly payouts", desc: "Process creator payouts every two weeks" },
            { title: "Monthly payouts", desc: "Process creator payouts once a month" },
          ].map((item) => (
            <label key={item.title} className="flex items-center gap-[12px] cursor-pointer">
              <input type="radio" name="payout" className="size-[18px] accent-[#0063EF] cursor-pointer" />
              <div>
                <p className="text-[16px] font-normal text-[#202020] tracking-[-0.32px] leading-[24px]">{item.title}</p>
                <p className="text-[14px] font-normal text-[#606060] tracking-[-0.28px] leading-[20px]">{item.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button className="h-[44px] px-[32px] text-[14px]">Save Changes</Button>
      </div>
    </div>
  );
};
