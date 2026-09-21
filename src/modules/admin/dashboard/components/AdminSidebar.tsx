"use client";

import React, { useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
import { useAppDispatch } from "@/redux";
import { clearAuth } from "@/redux/slices/authSlice";
import { serverLogout } from "@/modules/auth/actions/logout";
import { usePermissions } from "@/modules/auth/hooks/usePermissions";
import { ADMIN_ACCESS, type AdminAccessEntry } from "@/modules/admin/access";
import {
  Logout,
  CloseCircle,
} from "iconsax-react";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SidebarGroup = ({
  label,
  links,
  pathname,
}: {
  label: string;
  links: readonly AdminAccessEntry[];
  pathname: string | null;
}) => {
  // Sub-routes (e.g. /admin/mie-recommendation/developers) keep their parent lit.
  const isActive = (href: string) =>
    pathname === href || (pathname?.startsWith(`${href}/`) ?? false);

  if (links.length === 0) return null;

  return (
    <div className="flex flex-col gap-[8px] w-full">
      <div className="border-b-[0.5px] border-[#636363] flex h-[24px] items-center py-[10px] w-full">
        <span className="text-[12px] font-medium text-[#606060] leading-[16px]">
          {label}
        </span>
      </div>
      <div className="flex flex-col gap-[4px] w-full">
        {links.map((link) => {
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
                  : "hover:bg-[#2A2A2A]",
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
                  active ? "font-medium text-[#202020]" : "font-normal text-[#606060]",
                )}
              >
                {link.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const user = session?.user;
  const { canAny, roleLabel } = usePermissions();

  /*
    Filtered in render rather than stored: `canAny` fails closed until the
    profile resolves, so the first paint legitimately has no permissions and the
    list fills in when they arrive — no effect, no flash of a remembered list.
  */
  const visible = useCallback(
    (group: AdminAccessEntry["group"]) =>
      ADMIN_ACCESS.filter(
        (entry) =>
          entry.group === group &&
          (!entry.permissions || canAny(entry.permissions)),
      ),
    [canAny],
  );

  const shownAdminLinks = useMemo(() => visible("admin"), [visible]);
  const shownCoursesLinks = useMemo(() => visible("courses"), [visible]);
  const shownSystemLinks = useMemo(() => visible("system"), [visible]);

  const displayName =
    user?.first_name || user?.last_name
      ? `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim()
      : (user?.email ?? "");
  const avatarSrc =
    user?.avatar_url ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
      user?.email ?? "admin",
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
          "w-[237px] h-screen bg-[#202020] flex flex-col fixed left-0 top-0 z-40 overflow-y-auto transition-transform duration-300",
          "[&::-webkit-scrollbar]:w-[6px] md:[&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#636363] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#808080]",
          "md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
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
            <button
              onClick={onClose}
              className="md:hidden ml-auto p-1 text-[#606060] hover:text-white transition-colors cursor-pointer"
              aria-label="Close sidebar"
            >
              <CloseCircle variant="Linear" size={20} color="currentColor" />
            </button>
          </div>

          <div className="flex flex-col gap-[16px] w-full">
            <SidebarGroup label="Admin" links={shownAdminLinks} pathname={pathname} />
            <SidebarGroup label="Courses" links={shownCoursesLinks} pathname={pathname} />
            <SidebarGroup label="System" links={shownSystemLinks} pathname={pathname} />
          </div>

          <div className="flex flex-col gap-[12px] w-full mt-auto">
            <button onClick={handleLogout} className="flex flex-col w-full cursor-pointer">
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
                      src={avatarSrc}
                      alt="Avatar"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-[4px]">
                    <span className="text-[12px] font-medium text-[#F2F2F2] leading-[16px]">
                      {displayName}
                    </span>
                    <span className="text-[12px] font-normal text-[#B6B6B6] leading-[16px]">
                      {roleLabel ?? "Admin"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
