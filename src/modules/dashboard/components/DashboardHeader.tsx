"use client";

import React from "react";
import Image from "next/image";
import { 
  SearchNormal1, 
  Notification, 
  ArrowDown2,
  Book,
  User,
  Wallet,
  Export,
  UserAdd,
  ArrowRight2,
  Logout
} from "iconsax-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const DashboardHeader = () => {
  return (
    <header className="h-[60px] bg-[#FDFDFD] border-b border-[#F0F0F0] flex items-center justify-between px-[19px] sticky top-0 z-30 ml-[205px]">
      {/* Left: Date */}
      <div className="text-[16px] text-[#636363] tracking-[-0.32px] font-normal leading-[24px]">
        21 August 2024, 14:00
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-[15px]">
        {/* Learn about us dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 px-[12px] py-[8px] bg-[#FCFDFF] border border-[#F0F0F0] rounded-full cursor-pointer hover:bg-sd-blue/10 transition-colors outline-none">
              <Book size={18} color="#606060" variant="Linear" />
              <span className="text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px]">Learn about us</span>
              <ArrowDown2 size={18} color="#606060" variant="Linear" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[180px] bg-white border border-[#F0F0F0] rounded-[16px] p-[8px] shadow-md mt-[8px]" align="start">
            <DropdownMenuItem className="flex items-center gap-[8px] p-[8px] rounded-[8px] text-[#606060] hover:bg-[#F0F0F0] cursor-pointer text-[14px]">
              <span>Documentation</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-[8px] p-[8px] rounded-[8px] text-[#606060] hover:bg-[#F0F0F0] cursor-pointer text-[14px]">
              <span>Help Center</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-[8px] p-[8px] rounded-[8px] text-[#606060] hover:bg-[#F0F0F0] cursor-pointer text-[14px]">
              <span>Send Feedback</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Search & Notifications */}
        <div className="flex items-center gap-[12px]">
          <button className="p-1 hover:bg-sd-grey-2 rounded-full transition-colors">
            <SearchNormal1 size={20} color="#202020" variant="Linear" />
          </button>
          <div className="relative cursor-pointer">
            <Notification size={20} color="#202020" variant="Bold" />
            <span className="absolute top-0 right-0 size-2 bg-red-500 rounded-full border border-white" />
          </div>
        </div>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-[8px] p-[4px] bg-[#F0F0F0] rounded-[322px] cursor-pointer hover:bg-[#E0E0E0] transition-colors h-[32px] outline-none">
               <div className="size-[24px] rounded-full bg-sd-grey-6 overflow-hidden relative">
                  <Image 
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Emmanuel" 
                    alt="Avatar" 
                    fill 
                    className="object-cover" 
                  />
               </div>
               <ArrowDown2 size={18} color="#606060" variant="Linear" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[220px] bg-white border border-[#F0F0F0] rounded-[16px] p-[8px] shadow-md mt-[8px]" align="end">
            <div className="flex items-center gap-[8px] p-[8px]">
              <div className="size-[32px] rounded-full bg-sd-grey-6 overflow-hidden relative">
                 <Image 
                   src="https://api.dicebear.com/7.x/avataaars/svg?seed=Emmanuel" 
                   alt="Avatar" 
                   fill 
                   className="object-cover" 
                 />
              </div>
              <span className="text-[14px] font-semibold text-[#202020] tracking-[-0.28px]">
                 Osaite Emmanuel
              </span>
            </div>
            
            <DropdownMenuSeparator className="bg-[#F0F0F0] my-[6px]" />
            
            <DropdownMenuItem className="flex items-center gap-[8px] p-[8px] rounded-[8px] text-[#606060] hover:bg-[#F0F0F0] cursor-pointer text-[14px]">
              <User size={20} color="#606060" variant="Linear" />
              <span>Profile</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem className="flex items-center gap-[8px] p-[8px] rounded-[8px] text-[#606060] hover:bg-[#F0F0F0] cursor-pointer text-[14px]">
              <Wallet size={20} color="#606060" variant="Linear" />
              <span>Wallet</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="bg-[#F0F0F0] my-[6px]" />
            
            <DropdownMenuItem className="flex items-center justify-between p-[8px] rounded-[8px] text-[#606060] hover:bg-[#F0F0F0] cursor-pointer text-[14px]">
              <div className="flex items-center gap-[8px]">
                <Export size={20} color="#606060" variant="Linear" />
                <span>Share profile</span>
              </div>
              <ArrowRight2 size={16} color="#606060" variant="Linear" />
            </DropdownMenuItem>
            
            <DropdownMenuItem className="flex items-center justify-between p-[8px] rounded-[8px] text-[#606060] hover:bg-[#F0F0F0] cursor-pointer text-[14px]">
              <div className="flex items-center gap-[8px]">
                <UserAdd size={20} color="#606060" variant="Linear" />
                <span>Invite</span>
              </div>
              <ArrowRight2 size={16} color="#606060" variant="Linear" />
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="bg-[#F0F0F0] my-[6px]" />
            
            <DropdownMenuItem className="flex items-center gap-[8px] p-[8px] rounded-[8px] text-[#FF5025] hover:bg-[#FFEBEB] cursor-pointer text-[14px]">
              <Logout size={20} color="#FF5025" variant="Linear" />
              <span className="font-medium">Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
