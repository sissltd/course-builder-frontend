"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/shared/Button";

interface SupportTabProps {
  onContactSupport?: () => void;
  onCreateTicket?: () => void;
  onRequestAppeal?: () => void;
}

const supportActions = [
  {
    id: "contact",
    title: "Contact support",
    description: "Contact our virtual agent or talk to us here",
    buttonLabel: "Contact us",
    borderColor: "#0A60E1",
    icon: "/assets/help/message-question.svg",
  },
  {
    id: "ticket",
    title: "Create ticket",
    description: "Create a specific ticket to help you resolve your questions",
    buttonLabel: "Create ticket",
    borderColor: "#FF6B00",
    icon: "/assets/help/ticket.svg",
  },
  {
    id: "appeal",
    title: "Request for an appeal",
    description: "Request for an appeal to help resolve a specific problem",
    buttonLabel: "Request appeal",
    borderColor: "#8A38F5",
    icon: "/assets/help/courthouse.svg",
  },
];

export const SupportTab = ({
  onContactSupport,
  onCreateTicket,
  onRequestAppeal,
}: SupportTabProps) => {
  const handlers: Record<string, (() => void) | undefined> = {
    contact: onContactSupport,
    ticket: onCreateTicket,
    appeal: onRequestAppeal,
  };

  return (
    <div className="flex flex-col gap-[32px] w-full">
      <div className="flex flex-col gap-[12px]">
        <h2 className="text-[24px] font-semibold text-[#202020] tracking-[-0.48px] leading-[32px]">
          Support
        </h2>
        <p className="text-[16px] text-[#606060] leading-[24px]">
          Need help? We&apos;re here.
        </p>
      </div>

      <div className="flex flex-col gap-[16px]">
        {supportActions.map((action) => (
          <div
            key={action.id}
            className="flex items-center justify-between gap-[24px]"
          >
            <div className="flex items-center gap-[12px]">
              <div
                className="border-[1.067px] rounded-full size-[40px] flex items-center justify-center p-[10px] shrink-0"
                style={{ borderColor: action.borderColor }}
              >
                <Image
                  src={action.icon}
                  alt={action.title}
                  width={20}
                  height={20}
                  className="shrink-0"
                />
              </div>
              <div className="flex flex-col gap-[4px]">
                <span className="text-[16px] text-[#1E1E1E] tracking-[-0.32px] leading-[24px]">
                  {action.title}
                </span>
                <span className="text-[14px] text-[#6C6C6C] tracking-[-0.28px] leading-[20px]">
                  {action.description}
                </span>
              </div>
            </div>
            <Button
              variant="app-outline"
              size="app"
              className="shrink-0 whitespace-nowrap"
              onClick={() => handlers[action.id]?.()}
            >
              {action.buttonLabel}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
