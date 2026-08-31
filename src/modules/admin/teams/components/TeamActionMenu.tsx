"use client";

import React from "react";
import { Briefcase, Copy, UserMinus, Trash, ArrowRight2, Refresh, UserTick } from "iconsax-react";

export type ActionType = "change-role" | "copy-id" | "suspend" | "delete" | "reinstate" | "revoke";

interface ActionItem {
  icon: React.ReactNode;
  label: string;
  action: ActionType;
  hasArrow: boolean;
  color: string;
  hoverBg: string;
}

const baseItems: ActionItem[] = [
  { icon: <Briefcase variant="Linear" size={16} color="#606060" />, label: "Change role", action: "change-role", hasArrow: true, color: "#606060", hoverBg: "hover:bg-sd-grey-1" },
  { icon: <Copy variant="Linear" size={16} color="#606060" />, label: "Copy user ID", action: "copy-id", hasArrow: false, color: "#606060", hoverBg: "hover:bg-sd-grey-1" },
  { icon: <UserMinus variant="Linear" size={16} color="#F2994A" />, label: "Suspend account", action: "suspend", hasArrow: false, color: "#F2994A", hoverBg: "hover:bg-[#FFF5ED]" },
  { icon: <Trash variant="Linear" size={16} color="#D54800" />, label: "Delete account", action: "delete", hasArrow: false, color: "#D54800", hoverBg: "hover:bg-[#FFF0ED]" },
];

const reinstateItem: ActionItem = {
  icon: <Refresh variant="Linear" size={16} color="#008500" />,
  label: "Reinstate account",
  action: "reinstate",
  hasArrow: false,
  color: "#008500",
  hoverBg: "hover:bg-[#EBF7EE]",
};

const revokeItem: ActionItem = {
  icon: <UserTick variant="Linear" size={16} color="#D54800" />,
  label: "Revoke access",
  action: "revoke",
  hasArrow: false,
  color: "#D54800",
  hoverBg: "hover:bg-[#FFF0ED]",
};

interface TeamActionMenuProps {
  onClose: () => void;
  onAction: (action: ActionType) => void;
  invitationStatus?: string;
}

export const TeamActionMenu = ({ onClose, onAction, invitationStatus }: TeamActionMenuProps) => {
  const items = React.useMemo(() => {
    if (invitationStatus === "PENDING") {
      return baseItems.filter((item) => item.action !== "suspend");
    }
    if (invitationStatus === "REVOKED") {
      return [reinstateItem];
    }
    if (invitationStatus === "ACTIVE") {
      return [...baseItems, revokeItem];
    }
    return baseItems;
  }, [invitationStatus]);

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute top-[40px] right-0 z-50 bg-[#FDFDFD] border-[0.7px] border-[#F0F0F0] rounded-[10px] p-[8px] shadow-[0px_6px_12px_0px_rgba(0,0,0,0.1)] w-[227px]">
        <div className="flex flex-col">
          {items.map((item) => (
            <button
              key={item.label}
              className={`flex items-center justify-between h-[32px] px-[8px] py-[8px] rounded-[8px] transition-colors cursor-pointer w-full ${item.hoverBg}`}
              onClick={() => {
                onAction(item.action);
                onClose();
              }}
            >
              <div className="flex items-center gap-[8px]">
                {item.icon}
                <span className="text-[12px] font-normal leading-[16px]" style={{ color: item.color }}>
                  {item.label}
                </span>
              </div>
              {item.hasArrow && <ArrowRight2 variant="Linear" size={16} color="#606060" />}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
