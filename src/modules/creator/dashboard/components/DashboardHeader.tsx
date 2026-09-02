"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
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
  Logout,
  Menu,
  MoreSquare,
} from "iconsax-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreatorRoute } from "@/lib/routes";
import { signOut, useSession } from "next-auth/react";
import { useAppDispatch } from "@/redux";
import { clearAuth } from "@/redux/slices/authSlice";
import { serverLogout } from "@/modules/auth/actions/logout";

interface DashboardHeaderProps {
  onToggleSidebar?: () => void;
}

function formatDateTime(date: Date): string {
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${day} ${month} ${year}, ${hours}:${minutes}`;
}

export const DashboardHeader = ({ onToggleSidebar }: DashboardHeaderProps) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

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
    <header className="h-[60px] bg-[#FDFDFD] border-b border-[#F0F0F0] flex items-center justify-between px-[12px] md:px-[19px] sticky top-0 z-30 ml-0 md:ml-[225px]">
      {/* Left: Hamburger + Date */}
      <div className="flex items-center gap-[12px]">
        <button
          onClick={onToggleSidebar}
          className="md:hidden hover:bg-sd-grey-2 rounded-lg transition-colors cursor-pointer shrink-0 flex items-center justify-center size-[32px]"
          aria-label="Toggle sidebar"
        >
          <Menu variant="Linear" size={20} color="#636363" />
        </button>
        <div className="text-[16px] text-[#636363] tracking-[-0.32px] font-normal leading-[24px] hidden md:block">
          {formatDateTime(now)}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-[12px] md:gap-[15px]">
        {/* Mobile: search icon + more popover */}
        <div className="flex md:hidden items-center gap-[8px]">
          {isSearchExpanded ? (
            <div className="flex items-center gap-2 px-[12px] py-[6px] bg-[#FCFDFF] border border-[#0063EF] rounded-full h-[36px] w-[200px] transition-all duration-300 animate-in fade-in slide-in-from-right-2">
              <SearchNormal1 size={18} color="#606060" variant="Linear" />
              <input 
                type="text" 
                placeholder="Courses" 
                autoFocus
                className="w-full bg-transparent outline-none text-[14px] text-[#202020] placeholder:text-[#B6B6B6]"
              />
              <button 
                onClick={() => setIsSearchExpanded(false)}
                className="text-[#606060] hover:text-[#202020] transition-colors flex items-center justify-center cursor-pointer"
              >
                <span className="text-[20px] leading-none">&times;</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsSearchExpanded(true)}
              className="p-2 hover:bg-sd-grey-2 rounded-lg transition-colors cursor-pointer"
            >
              <SearchNormal1 size={20} color="#636363" variant="Linear" />
            </button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 hover:bg-sd-grey-2 rounded-lg transition-colors cursor-pointer">
                <MoreSquare variant="Linear" size={20} color="#636363" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[220px] bg-white border border-[#F0F0F0] rounded-[16px] p-[8px] mt-[8px]" align="end">
              <DropdownMenuItem asChild>
                <Link href={CreatorRoute.NOTIFICATIONS} className="flex items-center gap-[8px] p-[8px] rounded-[8px] text-[#606060] hover:bg-[#F0F0F0] cursor-pointer text-[14px]">
                  <Notification size={20} color="#606060" variant="Bold" />
                  <span>Notifications</span>
                  <span className="ml-auto size-2 bg-red-500 rounded-full" />
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={CreatorRoute.PROFILE} className="flex items-center gap-[8px] p-[8px] rounded-[8px] text-[#606060] hover:bg-[#F0F0F0] cursor-pointer text-[14px]">
                  <User size={20} color="#606060" variant="Linear" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={CreatorRoute.WALLET} className="flex items-center gap-[8px] p-[8px] rounded-[8px] text-[#606060] hover:bg-[#F0F0F0] cursor-pointer text-[14px]">
                  <Wallet size={20} color="#606060" variant="Linear" />
                  <span>Wallet</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#F0F0F0] my-[6px]" />
              <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-[8px] p-[8px] rounded-[8px] text-[#FF5025] hover:bg-[#FFEBEB] cursor-pointer text-[14px]">
                <Logout size={20} color="#FF5025" variant="Linear" />
                <span className="font-medium">Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Desktop: Learn about us dropdown */}
        <div className="hidden md:flex items-center gap-[15px]">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 px-[12px] py-[8px] bg-[#FCFDFF] border border-[#F0F0F0] rounded-full cursor-pointer hover:bg-sd-blue/10 transition-colors outline-none">
                <Book size={18} color="#606060" variant="Linear" />
                <span className="text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px]">Learn about us</span>
                <ArrowDown2 size={18} color="#606060" variant="Linear" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[180px] bg-white border border-[#F0F0F0] rounded-[16px] p-[8px]  mt-[8px]" align="start">
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
            {isSearchExpanded ? (
              <div className="flex items-center gap-2 px-[12px] py-[6px] bg-[#FCFDFF] border border-[#0063EF] rounded-full h-[36px] w-[240px] transition-all duration-300 animate-in fade-in slide-in-from-right-2">
                <SearchNormal1 size={18} color="#606060" variant="Linear" />
                <input 
                  type="text" 
                  placeholder="Courses" 
                  autoFocus
                  className="w-full bg-transparent outline-none text-[14px] text-[#202020] placeholder:text-[#B6B6B6]"
                />
                <button 
                  onClick={() => setIsSearchExpanded(false)}
                  className="text-[#606060] hover:text-[#202020] transition-colors flex items-center justify-center cursor-pointer"
                >
                  <span className="text-[20px] leading-none">&times;</span>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsSearchExpanded(true)}
                className="p-1 hover:bg-sd-grey-2 rounded-full transition-colors cursor-pointer"
              >
                <SearchNormal1 size={20} color="#202020" variant="Linear" />
              </button>
            )}
            <Link href={CreatorRoute.NOTIFICATIONS} className="relative cursor-pointer flex items-center justify-center p-1">
              <Notification size={20} color="#202020" variant="Bold" />
              <span className="absolute top-1 right-1 size-2 bg-red-500 rounded-full border border-white" />
            </Link>
          </div>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-[8px] p-[4px] bg-[#F0F0F0] rounded-[322px] cursor-pointer hover:bg-[#E0E0E0] transition-colors h-[32px] outline-none">
                 <div className="size-[24px] rounded-full bg-sd-grey-6 overflow-hidden relative">
                    <Image 
                      src={avatarSrc} 
                      alt="Avatar" 
                      fill 
                      className="object-cover" 
                    />
                 </div>
                 <ArrowDown2 size={18} color="#606060" variant="Linear" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[220px] bg-white border border-[#F0F0F0] rounded-[16px] p-[8px]  mt-[8px]" align="end">
              <div className="flex items-center gap-[8px] p-[8px]">
                <div className="size-[32px] rounded-full bg-sd-grey-6 overflow-hidden relative">
                   <Image 
                     src={avatarSrc} 
                     alt="Avatar" 
                     fill 
                     className="object-cover" 
                   />
                </div>
                <span className="text-[14px] font-semibold text-[#202020] tracking-[-0.28px]">
                   {displayName}
                </span>
              </div>
              
              <DropdownMenuSeparator className="bg-[#F0F0F0] my-[6px]" />
              
              <DropdownMenuItem asChild>
                <Link href={CreatorRoute.PROFILE} className="flex items-center gap-[8px] p-[8px] rounded-[8px] text-[#606060] hover:bg-[#F0F0F0] cursor-pointer text-[14px] w-full">
                  <User size={20} color="#606060" variant="Linear" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link href={CreatorRoute.WALLET} className="flex items-center gap-[8px] p-[8px] rounded-[8px] text-[#606060] hover:bg-[#F0F0F0] cursor-pointer text-[14px] w-full">
                  <Wallet size={20} color="#606060" variant="Linear" />
                  <span>Wallet</span>
                </Link>
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
              
              <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-[8px] p-[8px] rounded-[8px] text-[#FF5025] hover:bg-[#FFEBEB] cursor-pointer text-[14px]">
                <Logout size={20} color="#FF5025" variant="Linear" />
                <span className="font-medium">Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
