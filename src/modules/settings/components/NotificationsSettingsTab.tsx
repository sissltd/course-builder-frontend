"use client";

import React, { useState } from "react";
import { Book, Sms, Wallet, ReceiptItem, Mobile } from "iconsax-react";
import { cn } from "@/lib/utils";

type Toggle = {
  id: string;
  label: string;
  description: string;
  Icon: React.ElementType;
  defaultOn?: boolean;
};

const toggleItems: Toggle[] = [
  { id: "course",   label: "Course review update",   description: "Get notified when your course is approved",                Icon: Book,        defaultOn: true },
  { id: "email",    label: "Email notifications",     description: "Get regular email updates",                               Icon: Sms,         defaultOn: true },
  { id: "wallet",   label: "Wallet",                  description: "Get notified when your wallet is credited",              Icon: Wallet,      defaultOn: false },
  { id: "payment",  label: "Payment notification",    description: "Allow system to notify you when there's a payment approval", Icon: ReceiptItem, defaultOn: false },
  { id: "push",     label: "Push notification",       description: "Allow system to send push notifications",                Icon: Mobile,      defaultOn: false },
];

const AppToggle = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
  <button
    onClick={onToggle}
    role="switch"
    aria-checked={enabled}
    className={cn(
      "relative inline-flex h-[26px] w-[48px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none",
      enabled ? "bg-[#0063EF]" : "bg-[#D9D9D9]"
    )}
  >
    <span
      className={cn(
        "pointer-events-none inline-block size-[20px] transform rounded-full bg-white shadow-md ring-0 transition-transform duration-200",
        enabled ? "translate-x-[22px]" : "translate-x-[1px]"
      )}
    />
  </button>
);

export const NotificationsSettingsTab = () => {
  const [state, setState] = useState<Record<string, boolean>>(
    Object.fromEntries(toggleItems.map((t) => [t.id, t.defaultOn ?? false]))
  );

  const toggle = (id: string) =>
    setState((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="flex flex-col gap-[24px]">
      <div>
        <h2 className="text-[20px] font-semibold text-[#202020] tracking-[-0.4px] leading-[28px]">Notification settings</h2>
        <p className="text-[14px] text-[#636363] mt-[4px]">Configure your account notifications</p>
      </div>

      <div className="flex flex-col gap-0">
        {toggleItems.map(({ id, label, description, Icon }, i) => (
          <div
            key={id}
            className={cn(
              "flex items-center justify-between gap-[16px] py-[20px]",
              i < toggleItems.length - 1 && "border-b border-[#F0F0F0]"
            )}
          >
            <div className="flex items-start gap-[12px]">
              <div className="size-[36px] rounded-[8px] bg-[#F5F5F5] flex items-center justify-center shrink-0 mt-[2px]">
                <Icon size={18} variant="Linear" color="#606060" />
              </div>
              <div className="flex flex-col gap-[2px]">
                <p className="text-[15px] font-semibold text-[#202020] tracking-[-0.3px]">{label}</p>
                <p className="text-[13px] text-[#636363] leading-[18px]">{description}</p>
              </div>
            </div>
            <AppToggle enabled={state[id]} onToggle={() => toggle(id)} />
          </div>
        ))}
      </div>
    </div>
  );
};
