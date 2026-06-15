"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Home2, 
  Book, 
  Note, 
  Profile2User, 
  Wallet, 
  Edit, 
  Notification,
  User,
  Setting2,
  I24Support
} from "iconsax-react";
import { DoubleArrowIcon } from "./icons/DoubleArrowIcon";

const sidebarLinks = [
  { name: "Dashboard", href: "/dashboard", icon: Home2 },
  { name: "My Courses", href: "/courses", icon: Book },
  { name: "Draft", href: "/drafts", icon: Note },
  { name: "Collaborators", href: "/collaborators", icon: Profile2User },
  { name: "Wallet", href: "/wallet", icon: Wallet },
  { name: "Reservation", href: "/reservation", icon: Edit },
  { name: "Notifications", href: "/notifications", icon: Notification },
];

const bottomLinks = [
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Settings", href: "/dashboard/settings", icon: Setting2 },
  { name: "Help", href: "/dashboard/help", icon: I24Support },
];

export const DashboardSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-[205px] h-screen bg-[#FDFDFD] border-r border-[#F0F0F0] flex flex-col fixed left-0 top-0 z-40">
      {/* Logo Section */}
      <div className="h-[60px] flex items-center px-[11px] py-[12px] border-b border-r border-[#F0F0F0]">
        <div className="relative w-[136px] h-[36px] overflow-hidden">
          <Image 
            src="/assets/auth/logo.png" 
            alt="LearnHub" 
            fill 
            className="object-contain scale-[2]"
          />
        </div>
      </div>

      {/* User Info Dropdown - Fixed at top below logo */}
      <div className="px-[11px] pt-[24px] shrink-0">
        <div className="flex items-center justify-between px-[8px] py-[4px] mb-[4px] h-[32px]">
           <div className="flex items-center gap-[8px]">
              <div className="size-[24px] rounded-full bg-sd-grey-6 overflow-hidden relative">
                 <Image 
                   src="https://api.dicebear.com/7.x/avataaars/svg?seed=Emmanuel" 
                   alt="Avatar" 
                   fill 
                   className="object-cover" 
                 />
              </div>
              <span className="text-[14px] font-medium text-[#606060] truncate max-w-[100px] tracking-[-0.28px] leading-[20px]">
                 Osaite Emmanuel
              </span>
           </div>
           <DoubleArrowIcon size={24} />
        </div>
        <div className="h-0 border-t border-[#F0F0F0] w-full mb-[4px]" />
      </div>

      {/* Scrollable Content (Main Navigation, KYC Card) */}
      <div className="flex-1 overflow-y-auto px-[11px] pb-[8px] pt-[16px] flex flex-col justify-between min-h-0
        [&::-webkit-scrollbar]:w-[4px]
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-[#E8E8E8]
        [&::-webkit-scrollbar-thumb]:rounded-full
        hover:[&::-webkit-scrollbar-thumb]:bg-[#C6C6C6]
      ">
        <div className="flex flex-col gap-[16px] pb-[32px]">
          {/* Main Navigation */}
          <nav className="flex flex-col gap-[8px]">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-[8px] px-[8px] py-[8px] rounded-[8px] transition-colors group h-[36px]",
                    isActive 
                      ? "bg-[#DBEBFF] text-[#0A60E1]" 
                      : "text-[#606060] hover:bg-sd-grey-2"
                  )}
                >
                  <Icon 
                    variant={isActive ? "Bold" : "Linear"} 
                    size={20} 
                    color={isActive ? "#0A60E1" : "#606060"}
                  />
                  <span className={cn(
                    "text-[14px] tracking-[-0.28px] leading-[20px]",
                    isActive ? "font-normal" : "font-normal"
                  )}>
                    {link.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* KYC Card */}
        <div className="bg-gradient-to-br from-[#E2ECF6] to-[#F6EAF7] rounded-[16px] p-[20px] shadow-[0px_5px_11px_0px_rgba(0,0,0,0.1)] relative overflow-hidden border border-[#F0F0F0] mx-auto w-[174px] h-[167px] shrink-0 flex flex-col justify-center items-center mt-[24px]">
          <div className="relative z-10 flex flex-col gap-[15px] w-full">
            <div className="flex flex-col gap-[8px]">
              <p className="text-[14px] font-semibold text-[#202020] tracking-[-0.28px] leading-[20px]">KYC Completion</p>
              <p className="text-[12px] text-[#606060] leading-[16px]">
                Unlock full features when you complete your verificaication
              </p>
            </div>
            <button className="w-full h-[32px] border border-[#0063EF] text-[#0063EF] rounded-[8px] text-[12px] font-medium hover:bg-[#0063EF]/5 transition-colors">
              Continue
            </button>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Section (Profile, Settings, Help) */}
      <div className="px-[11px] pb-[24px] pt-[12px] border-t border-[#F0F0F0] shrink-0 flex flex-col gap-[12px]">
        {/* Bottom Navigation */}
        <nav className="flex flex-col">
          {bottomLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "flex items-center gap-[8px] px-[8px] py-[8px] rounded-[8px] transition-colors group h-[36px]",
                  isActive 
                    ? "bg-[#DBEBFF] text-[#0A60E1]" 
                    : "text-[#606060] hover:bg-sd-grey-2"
                )}
              >
                <Icon 
                  variant={isActive ? "Bold" : "Linear"} 
                  size={20} 
                  color={isActive ? "#0A60E1" : "#606060"}
                />
                <span className={cn(
                  "text-[14px] tracking-[-0.28px] leading-[20px]",
                  isActive ? "font-normal" : "font-normal"
                )}>
                  {link.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
