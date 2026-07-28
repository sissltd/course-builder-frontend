"use client";

import React from "react";
import { PauseCircle, StopCircle, Eye } from "iconsax-react";

export type ProductionAction = "stop" | "pause" | "view";

interface ProductionActionsMenuProps {
  onClose: () => void;
  onAction: (action: ProductionAction) => void;
}

export const ProductionActionsMenu = ({ onClose, onAction }: ProductionActionsMenuProps) => {
  const items: { icon: React.ReactNode; label: string; action: ProductionAction; color: string; hoverBg: string }[] = [
    { icon: <Eye variant="Linear" size={16} color="#606060" />, label: "View details", action: "view", color: "#606060", hoverBg: "hover:bg-sd-grey-1" },
    { icon: <PauseCircle variant="Linear" size={16} color="#F2994A" />, label: "Pause", action: "pause", color: "#F2994A", hoverBg: "hover:bg-[#FFF5ED]" },
    { icon: <StopCircle variant="Linear" size={16} color="#D54800" />, label: "Stop production", action: "stop", color: "#D54800", hoverBg: "hover:bg-[#FFF0ED]" },
  ];

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute top-[40px] right-0 z-50 bg-[#FDFDFD] border-[0.7px] border-[#F0F0F0] rounded-[10px] p-[8px] shadow-[0px_6px_12px_0px_rgba(0,0,0,0.1)] w-[200px]">
        <div className="flex flex-col">
          {items.map((item) => (
            <button
              key={item.label}
              className={`flex items-center gap-[8px] h-[32px] px-[8px] py-[8px] rounded-[8px] transition-colors cursor-pointer w-full ${item.hoverBg}`}
              onClick={() => { onAction(item.action); onClose(); }}
            >
              {item.icon}
              <span className="text-[12px] font-normal leading-[16px]" style={{ color: item.color }}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
