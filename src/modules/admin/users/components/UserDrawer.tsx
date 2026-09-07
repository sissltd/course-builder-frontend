"use client";

import React, { useState } from "react";
import { SideDrawer } from "@/components/shared/SideDrawer";
import {
  Briefcase,
  Global,
  DirectInbox,
  UserOctagon,
  Calendar2,
  LoginCurve,
  ShieldSecurity,
  Copy,
  TickCircle,
  UserMinus,
  Trash,
  Refresh,
} from "iconsax-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useGetUserQuery } from "@/redux/slices/adminApi";
import type { AdminUser } from "@/modules/admin/teams/types";

interface UserDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: AdminUser | null;
  onSuspend: (user: AdminUser) => void;
  onDeactivate: (user: AdminUser) => void;
  onReinstate: (user: AdminUser) => void;
}

function toInitials(first?: string, last?: string): string {
  const f = first?.[0] ?? "";
  const l = last?.[0] ?? "";
  return (f + l).toUpperCase() || "U";
}

function formatDate(dt?: string | null): string {
  if (!dt) return "Never";
  try {
    const d = new Date(dt);
    if (isNaN(d.getTime())) return "—";
    return format(d, "dd MMM yyyy, HH:mm");
  } catch {
    return dt;
  }
}

const InfoRow = ({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) => (
  <div className="flex items-center gap-[12px] py-[6px]">
    <div className="size-[20px] flex items-center justify-center shrink-0">{icon}</div>
    <div className="flex items-center justify-between flex-1 min-w-0">{children}</div>
  </div>
);

export const UserDrawer: React.FC<UserDrawerProps> = ({
  isOpen,
  onOpenChange,
  user: initialUser,
  onSuspend,
  onDeactivate,
  onReinstate,
}) => {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const userId = initialUser?.id;

  // Retrieve user by ID when opening detail panel (Endpoint 2: GET /api/v1/users/admin/{id}/)
  const { data: fetchedUser, isLoading: isFetchingUser } = useGetUserQuery(userId || "", {
    skip: !isOpen || !userId,
  });

  const user = fetchedUser || initialUser;

  const initials = toInitials(user?.first_name, user?.last_name);
  const fullName = `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || "User Profile";
  const isSuspended = user?.status === "SUSPENDED";
  const isDeactivated = user?.status === "DEACTIVATED";
  const isPending = user?.status === "PENDING_VERIFICATION";
  const isActive = user?.status === "ACTIVE";
  const canReinstate = isSuspended || isDeactivated || !user?.is_active;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 1500);
  };

  return (
    <SideDrawer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="User account details"
      footer={
        user ? (
          <div className="flex gap-[12px] w-full">
            {canReinstate ? (
              <button
                type="button"
                onClick={() => onReinstate(user)}
                className="flex-1 h-[44px] bg-[#0063EF] flex items-center justify-center gap-[8px] rounded-[8px] hover:bg-[#0052CC] transition-colors cursor-pointer"
              >
                <Refresh variant="Linear" size={18} color="#FDFDFD" />
                <span className="text-[14px] font-medium text-[#FDFDFD]">Reinstate Account</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onSuspend(user)}
                className="flex-1 h-[44px] border border-[#E8E8E8] bg-white flex items-center justify-center gap-[8px] rounded-[8px] hover:bg-sd-grey-1 transition-colors cursor-pointer"
              >
                <UserMinus variant="Linear" size={18} color="#606060" />
                <span className="text-[14px] font-medium text-[#606060]">Suspend</span>
              </button>
            )}

            {!isDeactivated && (
              <button
                type="button"
                onClick={() => onDeactivate(user)}
                className="flex-1 h-[44px] border border-[#D54800] flex items-center justify-center gap-[8px] rounded-[8px] hover:bg-[#FFF0ED] transition-colors cursor-pointer"
              >
                <Trash variant="Linear" size={18} color="#D54800" />
                <span className="text-[14px] font-medium text-[#D54800]">Deactivate</span>
              </button>
            )}
          </div>
        ) : null
      }
    >
      {isFetchingUser && !user ? (
        <div className="flex items-center justify-center py-24">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-sd-grey-3 border-t-[#0063EF]" />
        </div>
      ) : user ? (
        <>
          {/* Profile Header */}
          <div className="flex flex-col gap-[16px] pb-[20px] border-b border-[#F0F0F0]">
            <div className="flex items-center gap-[12px]">
              <div className="size-[46px] rounded-full bg-[#0A60E1] flex items-center justify-center text-[18px] font-semibold text-white shrink-0">
                {initials}
              </div>
              <div className="flex flex-col gap-[4px] min-w-0">
                <div className="flex items-center gap-[8px]">
                  <span className="text-[18px] font-semibold text-[#202020] leading-[24px] truncate">
                    {fullName}
                  </span>
                  <span
                    className={`inline-flex items-center px-[8px] py-[2px] rounded-[6px] text-[12px] font-normal leading-[16px] ${
                      isActive
                        ? "bg-[#F1F8F2] text-[#3C7E44]"
                        : isPending
                        ? "bg-[#FFF5ED] text-[#B54708]"
                        : "bg-[#FEF3F2] text-[#B42318]"
                    }`}
                  >
                    {user.status_label || user.status}
                  </span>
                </div>
                <span className="text-[14px] text-[#606060] leading-[20px] truncate">{user.email}</span>
              </div>
            </div>
          </div>

          {/* Account Details List */}
          <div className="flex flex-col gap-[16px] pt-[20px]">
            <InfoRow icon={<Briefcase variant="Linear" size={20} color="#606060" />}>
              <span className="text-[13px] text-[#606060]">Role</span>
              <span className="text-[14px] text-[#202020]">{user.role_label || user.role}</span>
            </InfoRow>

            <InfoRow icon={<DirectInbox variant="Linear" size={20} color="#606060" />}>
              <span className="text-[13px] text-[#606060]">Email</span>
              <div className="flex items-center gap-[8px]">
                <span className="text-[14px] text-[#202020]">{user.email}</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(user.email, "Email")}
                  className="cursor-pointer shrink-0 text-[#606060] hover:text-[#0063EF] transition-colors p-[2px]"
                  title="Copy email to clipboard"
                >
                  {copiedText === user.email ? (
                    <TickCircle variant="Bold" size={16} color="#059669" />
                  ) : (
                    <Copy variant="Linear" size={16} color="#606060" />
                  )}
                </button>
              </div>
            </InfoRow>

            <InfoRow icon={<UserOctagon variant="Linear" size={20} color="#606060" />}>
              <span className="text-[13px] text-[#606060]">User ID</span>
              <div className="flex items-center gap-[8px]">
                <span className="text-[14px] text-[#202020] truncate max-w-[180px] font-mono text-[12px]">
                  {user.id}
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(user.id, "User ID")}
                  className="cursor-pointer shrink-0 text-[#606060] hover:text-[#0063EF] transition-colors p-[2px]"
                  title="Copy User ID to clipboard"
                >
                  {copiedText === user.id ? (
                    <TickCircle variant="Bold" size={16} color="#059669" />
                  ) : (
                    <Copy variant="Linear" size={16} color="#606060" />
                  )}
                </button>
              </div>
            </InfoRow>

            <InfoRow icon={<Global variant="Linear" size={20} color="#606060" />}>
              <span className="text-[13px] text-[#606060]">Country</span>
              <span className="text-[14px] text-[#202020]">{user.country || "—"}</span>
            </InfoRow>

            <InfoRow icon={<Calendar2 variant="Linear" size={20} color="#606060" />}>
              <span className="text-[13px] text-[#606060]">Date Joined</span>
              <span className="text-[14px] text-[#202020]">{formatDate(user.created_datetime)}</span>
            </InfoRow>

            <InfoRow icon={<LoginCurve variant="Linear" size={20} color="#606060" />}>
              <span className="text-[13px] text-[#606060]">Last Login</span>
              <span className="text-[14px] text-[#202020]">{formatDate(user.last_login)}</span>
            </InfoRow>

            <InfoRow icon={<ShieldSecurity variant="Linear" size={20} color="#606060" />}>
              <span className="text-[13px] text-[#606060]">Authentication Gate</span>
              <span className="text-[14px] text-[#202020]">
                {user.is_active ? "Login Allowed" : "Login Blocked"}
              </span>
            </InfoRow>

            {user.is_locked && (
              <InfoRow icon={<ShieldSecurity variant="Linear" size={20} color="#D54800" />}>
                <span className="text-[13px] text-[#606060]">Lockout State</span>
                <span className="text-[14px] text-[#D54800]">Account Locked</span>
              </InfoRow>
            )}
          </div>
        </>
      ) : null}
    </SideDrawer>
  );
};
