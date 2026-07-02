import React from "react";
import { Button } from "@/components/shared/Button";
import { Add, Magicpen } from "iconsax-react";

export const JourneyCard = () => {
  return (
    <div className="w-full bg-[#FDFDFD] border border-[#C3DEF3] rounded-[16px] p-[20px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.1)] flex items-center justify-between">
      <div className="flex flex-col gap-[6px] max-w-[627px]">
        <h2 className="text-[20px] font-semibold text-[#202020] leading-[28px]">
          Start your journey to building digital courses
        </h2>
        <p className="text-[16px] text-[#636363] leading-[24px]">
          Join thousands of competitors and start creating courses while your earn from it
        </p>
      </div>

      <div className="flex items-center gap-[12px]">
        <a 
          className="border border-[#0063EF] border-solid flex gap-[8px] items-center justify-center px-[24px] py-[12px] relative rounded-[8px] cursor-pointer"
        >
          <Add size={24} color="#0063EF" variant="Linear" />
          <span className="text-[14px] text-[#0063EF] tracking-[-0.28px] font-normal leading-[20px]">
            Create a course
          </span>
        </a>
        <button 
          className="h-[44px] px-[24px] py-[12px] rounded-[8px] flex items-center gap-[8px] relative group transition-all active:scale-95"
        >
          <div aria-hidden className="absolute inset-0 rounded-[8px] transition-opacity" style={{ backgroundImage: "linear-gradient(42.58deg, rgb(0, 99, 239) 7.05%, rgb(250, 133, 0) 98.16%)" }} />
          <div className="relative z-10 flex items-center gap-[8px] text-[#FDFDFD] text-[14px] font-normal tracking-[-0.28px]">
            <Magicpen size={24} variant="Linear" color="#FDFDFD" />
            <span className="text-shadow-[0px_1px_2px_rgba(0,0,0,0.1)]">Create with AI</span>
          </div>
          <div className="absolute inset-0 shadow-[inset_0px_-2px_4px_0px_rgba(255,255,255,0.18),inset_0px_2px_4px_0px_rgba(255,255,255,0.25)] pointer-events-none rounded-[8px]" />
        </button>
      </div>
    </div>
  );
};
