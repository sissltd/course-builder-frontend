"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  SearchNormal1,
  Notification,
  I24Support,
  Setting2,
  MoreSquare,
  Menu,
} from "iconsax-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "next-auth/react";

interface AdminHeaderProps {
  title?: string;
  onToggleSidebar?: () => void;
}

export const AdminHeader = ({ title, onToggleSidebar }: AdminHeaderProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;

  const displayName =
    user?.first_name || user?.last_name
      ? `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim()
      : (user?.email ?? "");
  const avatarSrc =
    user?.avatar_url ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
      user?.email ?? "admin",
    )}`;

  return (
    <header className="h-[59px] bg-[#FDFDFD] border-b border-[#F0F0F0] flex items-center px-[12px] md:px-[24px] sticky top-0 z-30 ml-0 md:ml-[237px] gap-[12px] md:gap-[24px]">
      <button
        onClick={onToggleSidebar}
        className="md:hidden hover:bg-sd-grey-2 rounded-lg transition-colors cursor-pointer shrink-0 flex items-center justify-center size-[32px]"
        aria-label="Toggle sidebar"
      >
        <Menu variant="Linear" size={20} color="#606060" />
      </button>

      {isSearchOpen ? (
        <div className="flex-1 flex items-center gap-[8px] bg-[#FCFDFF] border border-[#0063EF] rounded-full px-[12px] py-[8px] h-[36px] md:hidden animate-in fade-in slide-in-from-right-2">
          <SearchNormal1 variant="Linear" size={18} color="#606060" />
          <input
            type="text"
            placeholder="Search admin"
            autoFocus
            className="w-full bg-transparent outline-none text-[14px] text-[#202020] placeholder:text-[#B6B6B6]"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-[#606060] hover:text-[#202020] transition-colors cursor-pointer shrink-0 text-[20px] leading-none"
          >
            &times;
          </button>
        </div>
      ) : (
        <span className="text-[14px] font-medium text-[#202020] tracking-[-0.28px] leading-[20px] min-w-[100px]">
          {title}
        </span>
      )}

      {/* Desktop: center search bar */}
      <div className="hidden md:flex flex-1 justify-center">
        <div className="flex items-center gap-[8px] bg-[#FCFDFF] border border-[#F0F0F0] rounded-full px-[12px] py-[8px] h-[36px] w-[264px]">
          <SearchNormal1 variant="Linear" size={18} color="#606060" />
          <input
            type="text"
            placeholder="Search admin"
            className="w-full bg-transparent outline-none text-[14px] text-[#202020] placeholder:text-[#B6B6B6]"
          />
        </div>
      </div>

      {/* Mobile: collapsed actions */}
      <div className="flex md:hidden items-center gap-[8px] ml-auto">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="p-2 hover:bg-sd-grey-2 rounded-lg transition-colors cursor-pointer"
        >
          <SearchNormal1 variant="Linear" size={20} color="#202020" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 hover:bg-sd-grey-2 rounded-lg transition-colors cursor-pointer">
              <MoreSquare variant="Linear" size={20} color="#202020" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[220px] bg-white border border-[#F0F0F0] rounded-[16px] p-[8px] mt-[8px]" align="end">
            <DropdownMenuItem className="flex items-center gap-[8px] p-[8px] rounded-[8px] text-[#606060] hover:bg-[#F0F0F0] cursor-pointer text-[14px]">
              <I24Support variant="Linear" size={20} color="#606060" />
              <span>Help and support</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-[8px] p-[8px] rounded-[8px] text-[#606060] hover:bg-[#F0F0F0] cursor-pointer text-[14px] relative">
              <Notification variant="Linear" size={20} color="#606060" />
              <span>Notifications</span>
              <span className="ml-auto size-2 bg-red-500 rounded-full" />
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-[8px] p-[8px] rounded-[8px] text-[#606060] hover:bg-[#F0F0F0] cursor-pointer text-[14px]">
              <Setting2 variant="Linear" size={20} color="#606060" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#F0F0F0] my-[6px]" />
            <div className="flex items-center gap-[8px] p-[8px]">
              <div className="size-[28px] rounded-full bg-[#7B7272] overflow-hidden relative shrink-0">
                <Image
                  src={avatarSrc}
                  alt="Avatar"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-medium text-[#202020] leading-[20px]">{displayName}</span>
                <span className="text-[12px] text-[#606060] leading-[16px]">Admin</span>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop: full actions */}
      <div className="hidden md:flex items-center gap-[12px]">
        <button className="flex items-center gap-[8px] border border-[#F0F0F0] rounded-[6px] px-[8px] py-[4px] h-[32px] hover:bg-sd-grey-2 transition-colors cursor-pointer">
          <I24Support variant="Linear" size={20} color="#606060" />
          <span className="text-[12px] font-normal text-[#606060] tracking-[-0.28px] leading-[16px]">
            Help and support
          </span>
        </button>

        <button className="border border-[#F0F0F0] rounded-[6px] p-[4px] size-[32px] flex items-center justify-center hover:bg-sd-grey-2 transition-colors cursor-pointer relative">
          <Notification variant="Linear" size={20} color="#606060" />
          <span className="absolute top-[6px] right-[6px] size-2 bg-red-500 rounded-full border border-white" />
        </button>

        <button className="border border-[#F0F0F0] rounded-[6px] p-[4px] size-[32px] flex items-center justify-center hover:bg-sd-grey-2 transition-colors cursor-pointer">
          <Setting2 variant="Linear" size={20} color="#606060" />
        </button>

        <div className="border border-[#F0F0F0] rounded-full p-[4px] size-[32px] flex items-center justify-center cursor-pointer">
          <div className="size-[20px] rounded-full bg-[#7B7272] overflow-hidden relative">
            <Image
              src={avatarSrc}
              alt="Avatar"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
