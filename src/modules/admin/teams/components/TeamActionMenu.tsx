"use client";

import React from "react";
import { Briefcase, Copy, UserMinus, Trash, ArrowRight2 } from "iconsax-react";

interface TeamActionMenuProps {
  onClose: () => void;
}

export const TeamActionMenu = ({ onClose }: TeamActionMenuProps) => {
  const items = [
    { icon: <Briefcase variant="Linear" size={16} color="#606060" />, label: "Change role", hasArrow: true },
    { icon: <Copy variant="Linear" size={16} color="#606060" />, label: "Copy user ID", hasArrow: false },
    { icon: <UserMinus variant="Linear" size={16} color="#606060" />, label: "Suspend account", hasArrow: false },
    { icon: <Trash variant="Linear" size={16} color="#606060" />, label: "Delete account", hasArrow: false },
  ];

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute top-[40px] right-0 z-50 bg-[#FDFDFD] border-[0.7px] border-[#F0F0F0] rounded-[10px] p-[8px] shadow-[0px_6px_12px_0px_rgba(0,0,0,0.1)] w-[227px]">
        <div className="flex flex-col">
          {items.map((item) => (
            <button
              key={item.label}
              className="flex items-center justify-between h-[32px] px-[8px] py-[8px] rounded-[8px] hover:bg-sd-grey-1 transition-colors cursor-pointer w-full"
              onClick={onClose}
            >
              <div className="flex items-center gap-[8px]">
                {item.icon}
                <span className="text-[12px] font-normal text-[#606060] leading-[16px]">{item.label}</span>
              </div>
              {item.hasArrow && <ArrowRight2 variant="Linear" size={16} color="#606060" />}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
