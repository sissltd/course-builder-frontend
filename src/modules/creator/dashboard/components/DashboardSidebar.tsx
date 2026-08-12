"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { CreatorRoute } from "@/lib/routes";
import { signOut, useSession } from "next-auth/react";
import { useAppDispatch } from "@/redux";
import { clearAuth } from "@/redux/slices/authSlice";
import { serverLogout } from "@/modules/auth/actions/logout";
import { 
  Home2, 
  Book, 
  Notepad, 
  Profile2User, 
  Wallet, 
  Edit, 
  Notification,
  User,
  Setting2,
  I24Support,
  CloseCircle,
  Logout,
} from "iconsax-react";
import { DoubleArrowIcon } from "./icons/DoubleArrowIcon";

const sidebarLinks = [
  { name: "Dashboard", href: CreatorRoute.DASHBOARD, icon: Home2 },
  { name: "My Courses", href: CreatorRoute.COURSES, icon: Book },
  { name: "Draft", href: CreatorRoute.DRAFTS, icon: Notepad },
  { name: "Collaborators", href: CreatorRoute.COLLABORATORS, icon: Profile2User },
  { name: "Wallet", href: CreatorRoute.WALLET, icon: Wallet },
  { name: "Reservation", href: CreatorRoute.RESERVATION, icon: Edit },
  { name: "Notifications", href: CreatorRoute.NOTIFICATIONS, icon: Notification },
];

const bottomLinks = [
  { name: "Profile", href: CreatorRoute.PROFILE, icon: User },
  { name: "Settings", href: CreatorRoute.SETTINGS, icon: Setting2 },
  { name: "Help", href: CreatorRoute.HELP, icon: I24Support },
];

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DashboardSidebar = ({ isOpen, onClose }: DashboardSidebarProps) => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const user = session?.user;

  const displayName =
    user?.first_name || user?.last_name
      ? `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim()
      : (user?.email ?? "");
  const avatarSrc =
    user?.avatar_url ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
      user?.email ?? "user",
    )}`;

  const handleLogout = async () => {
    dispatch(clearAuth());
    await serverLogout();
    await signOut({ callbackUrl: "/auth/login" });
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "w-[225px] h-screen bg-[#FDFDFD] border-r border-[#F0F0F0] flex flex-col fixed left-0 top-0 z-40 transition-transform duration-300",
          "[&::-webkit-scrollbar]:w-[6px] md:[&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#D9D9D9] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#C6C6C6]",
          "md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
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
          <button
            onClick={onClose}
            className="md:hidden ml-auto p-1 text-[#606060] hover:text-[#202020] transition-colors cursor-pointer"
            aria-label="Close sidebar"
          >
            <CloseCircle variant="Linear" size={20} color="currentColor" />
          </button>
        </div>

        {/* User Info Dropdown - Fixed at top below logo */}
        <div className="px-[11px] pt-[24px] shrink-0">
          <div className="flex items-center justify-between px-[8px] py-[4px] mb-[4px] h-[32px]">
             <div className="flex items-center gap-[8px]">
                <div className="size-[24px] rounded-full bg-sd-grey-6 overflow-hidden relative">
                   <Image 
                     src={avatarSrc} 
                     alt="Avatar" 
                     fill 
                     className="object-cover" 
                   />
                </div>
                <span className="text-[14px] font-medium text-[#606060] truncate max-w-[100px] tracking-[-0.28px] leading-[20px]">
                   {displayName}
                </span>
             </div>
             <DoubleArrowIcon size={24} />
          </div>
          <div className="h-0 border-t border-[#F0F0F0] w-full mb-[4px]" />
        </div>

        {/* Scrollable Content (Main Navigation, KYC Card) */}
        <div className="flex-1 overflow-y-auto px-[11px] pb-[8px] pt-[16px] flex flex-col justify-between min-h-0">
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
          <div className="bg-gradient-to-br from-[#FAF6FC] via-white to-[#F0F6FE] rounded-[16px] p-[20px] shadow-[0px_5px_11px_0px_rgba(0,0,0,0.1)] relative overflow-hidden border border-[#F0F0F0] mx-auto w-full  shrink-0 flex flex-col justify-center items-center mt-[24px]">
            {/* Illustrations */}
            <div className="absolute top-[-50px] left-[-30px] w-[140px] h-[140px] pointer-events-none opacity-80">
              <Image 
                src="/assets/dashboard/kyc-ellipse-top.png" 
                alt="" 
                fill 
                className="object-contain" 
              />
            </div>
            <div className="absolute top-[-40px] right-[-40px] w-[150px] h-[150px] pointer-events-none opacity-85">
              <Image 
                src="/assets/dashboard/kyc-ellipse-right.png" 
                alt="" 
                fill 
                className="object-contain" 
              />
            </div>

            <div className="relative z-10 flex flex-col gap-[15px] w-full">
              <div className="flex flex-col gap-[8px]">
                <p className="text-[14px] font-semibold text-[#202020] tracking-[-0.28px] leading-[20px]">KYC Completion</p>
                <p className="text-[12px] text-[#606060] leading-[16px]">
                  Unlock full features when you complete your verification
                </p>
              </div>
              <Link href={CreatorRoute.KYC} className="w-full block">
                <button className="w-full h-[32px] border border-[#0063EF] text-[#0063EF] rounded-[8px] text-[12px] font-medium hover:bg-[#0063EF]/5 transition-colors">
                  Continue
                </button>
              </Link>
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
          <button
            onClick={handleLogout}
            className="flex items-center gap-[8px] px-[8px] py-[8px] rounded-[8px] transition-colors group h-[36px] text-[#FF5025] hover:bg-[#FFEBEB] cursor-pointer w-full"
          >
            <Logout variant="Linear" size={20} color="#FF5025" />
            <span className="text-[14px] tracking-[-0.28px] leading-[20px] font-medium">
              Log out
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};
