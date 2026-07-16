"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { AdminRoutes } from "@/lib/routes";
import {
  Home2,
  Graph,
  Global,
  Profile2User,
  Book,
  Box,
  Category,
  Notification,
  Activity,
  Setting2,
  Logout,
  TickCircle,
} from "iconsax-react";

const adminLinks = [
  { name: "Overview", href: AdminRoutes.OVERVIEW, icon: Home2 },
  { name: "Analytics", href: AdminRoutes.ANALYTICS, icon: Graph },
  { name: "MIE Recommendation", href: AdminRoutes.MIE_RECOMMENDATION, icon: TickCircle },
  { name: "System Health", href: AdminRoutes.SYSTEM_HEALTH, icon: Global },
  { name: "APE Pipeline", href: AdminRoutes.APE_PIPELINE, icon: Box },
  { name: "Teams", href: AdminRoutes.TEAMS, icon: Profile2User },
];

const coursesLinks = [
  { name: "Courses", href: AdminRoutes.COURSES, icon: Book },
  { name: "Production", href: AdminRoutes.PRODUCTION, icon: Box },
  { name: "Published", href: AdminRoutes.PUBLISHED, icon: Global },
  { name: "Reservation", href: AdminRoutes.RESERVATION, icon: TickCircle },
  { name: "Categories", href: AdminRoutes.CATEGORIES, icon: Category },
];

const systemLinks = [
  { name: "Notification", href: AdminRoutes.NOTIFICATIONS, icon: Notification },
  { name: "Activity Log", href: AdminRoutes.ACTIVITY_LOG, icon: Activity },
  { name: "Setting", href: AdminRoutes.SETTINGS, icon: Setting2 },
];

export const AdminSidebar = () => {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="w-[237px] h-screen bg-[#202020] flex flex-col fixed left-0 top-0 z-40 overflow-y-auto">
      <div className="flex flex-col gap-[22px] w-full px-[8px] pb-[120px]">
        <div className="flex h-[59px] items-center px-[11px] py-[12px] w-full">
          <div className="relative w-[136px] h-[36px] overflow-hidden">
            <Image
              src="/assets/auth/logo.png"
              alt="learnHub"
              fill
              className="object-contain scale-[2] brightness-0 invert"
            />
          </div>
        </div>

        <div className="flex flex-col gap-[16px] w-full">
          <div className="flex flex-col gap-[8px] w-full">
            <div className="flex h-[24px] items-center py-[10px] w-full">
              <span className="text-[12px] font-medium text-[#606060] leading-[16px]">Admin</span>
            </div>
            <div className="flex flex-col gap-[4px] w-full">
              {adminLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex h-[36px] items-center gap-[8px] px-[8px] py-[8px] rounded-[8px] transition-colors",
                      active
                        ? "bg-[#F0F0F0] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1)]"
                        : "hover:bg-[#2A2A2A]"
                    )}
                  >
                    <Icon
                      variant={active ? "Bold" : "Linear"}
                      size={20}
                      color={active ? "#202020" : "#606060"}
                    />
                    <span
                      className={cn(
                        "text-[14px] tracking-[-0.28px] leading-[20px]",
                        active ? "font-medium text-[#202020]" : "font-normal text-[#606060]"
                      )}
                    >
                      {link.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-[8px] w-full">
            <div className="border-b-[0.5px] border-[#636363] flex h-[24px] items-center py-[10px] w-full">
              <span className="text-[12px] font-medium text-[#606060] leading-[16px]">Courses</span>
            </div>
            <div className="flex flex-col gap-[4px] w-full">
              {coursesLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex h-[36px] items-center gap-[8px] px-[8px] py-[8px] rounded-[8px] transition-colors",
                      active
                        ? "bg-[#F0F0F0] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1)]"
                        : "hover:bg-[#2A2A2A]"
                    )}
                  >
                    <Icon
                      variant={active ? "Bold" : "Linear"}
                      size={20}
                      color={active ? "#202020" : "#606060"}
                    />
                    <span
                      className={cn(
                        "text-[14px] tracking-[-0.28px] leading-[20px]",
                        active ? "font-medium text-[#202020]" : "font-normal text-[#606060]"
                      )}
                    >
                      {link.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-[8px] w-full">
            <div className="border-b-[0.5px] border-[#636363] flex h-[24px] items-center py-[10px] w-full">
              <span className="text-[12px] font-medium text-[#606060] leading-[16px]">System</span>
            </div>
            <div className="flex flex-col gap-[4px] w-full">
              {systemLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex h-[36px] items-center gap-[8px] px-[8px] py-[8px] rounded-[8px] transition-colors",
                      active
                        ? "bg-[#F0F0F0] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1)]"
                        : "hover:bg-[#2A2A2A]"
                    )}
                  >
                    <Icon
                      variant={active ? "Bold" : "Linear"}
                      size={20}
                      color={active ? "#202020" : "#606060"}
                    />
                    <span
                      className={cn(
                        "text-[14px] tracking-[-0.28px] leading-[20px]",
                        active ? "font-medium text-[#202020]" : "font-normal text-[#606060]"
                      )}
                    >
                      {link.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-[12px] w-full mt-auto">
          <button className="flex flex-col w-full cursor-pointer">
            <div className="flex h-[36px] items-center gap-[8px] px-[8px] py-[8px] rounded-[8px] hover:bg-[#2A2A2A]">
              <Logout variant="Linear" size={20} color="#FF5025" />
              <span className="text-[14px] font-normal text-[#FF5025] tracking-[-0.28px] leading-[20px]">
                Sign out
              </span>
            </div>
          </button>

          <div className="bg-[#636363] flex flex-col p-[8px] rounded-[8px] w-full">
            <div className="flex items-center justify-between w-full">
              <div className="flex gap-[9px] items-center">
                <div className="size-[36px] rounded-[8px] overflow-hidden relative">
                  <Image
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Emmanuel"
                    alt="Avatar"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-[4px]">
                  <span className="text-[12px] font-medium text-[#F2F2F2] leading-[16px]">
                    Osaite Emmanuel
                  </span>
                  <span className="text-[12px] font-normal text-[#B6B6B6] leading-[16px]">
                    Admin
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
