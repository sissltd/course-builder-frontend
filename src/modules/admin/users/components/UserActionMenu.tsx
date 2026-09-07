"use client";

import React from "react";
import { Eye, Copy, UserMinus, Trash, Refresh } from "iconsax-react";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AdminUser } from "@/modules/admin/teams/types";

interface UserActionMenuProps {
  user: AdminUser;
  onViewDetails: (user: AdminUser) => void;
  onCopyId: (id: string) => void;
  onCopyEmail: (email: string) => void;
  onSuspend: (user: AdminUser) => void;
  onDeactivate: (user: AdminUser) => void;
  onReinstate: (user: AdminUser) => void;
}

export const UserActionMenu: React.FC<UserActionMenuProps> = ({
  user,
  onViewDetails,
  onCopyId,
  onCopyEmail,
  onSuspend,
  onDeactivate,
  onReinstate,
}) => {
  const isSuspended = user.status === "SUSPENDED";
  const isDeactivated = user.status === "DEACTIVATED";
  const canReinstate = isSuspended || isDeactivated || !user.is_active;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="size-[32px] rounded-[6px] border border-sd-grey-4 bg-white flex items-center justify-center text-[#606060] hover:text-[#202020] hover:bg-sd-grey-2 transition-colors cursor-pointer"
          aria-label="User actions"
        >
          <MoreVertical size={18} className="text-[#606060] shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px] p-[6px] bg-white rounded-[10px] border border-sd-grey-4 shadow-lg z-50">
        <DropdownMenuItem
          onClick={() => onViewDetails(user)}
          className="flex items-center gap-[8px] px-[10px] py-[8px] text-[13px] text-sd-grey-12 hover:bg-sd-grey-2 rounded-[6px] cursor-pointer"
        >
          <Eye size={16} variant="Linear" color="#606060" />
          <span>View full profile</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onCopyId(user.id)}
          className="flex items-center gap-[8px] px-[10px] py-[8px] text-[13px] text-sd-grey-12 hover:bg-sd-grey-2 rounded-[6px] cursor-pointer"
        >
          <Copy size={16} variant="Linear" color="#606060" />
          <span>Copy User ID</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onCopyEmail(user.email)}
          className="flex items-center gap-[8px] px-[10px] py-[8px] text-[13px] text-sd-grey-12 hover:bg-sd-grey-2 rounded-[6px] cursor-pointer"
        >
          <Copy size={16} variant="Linear" color="#606060" />
          <span>Copy email</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-[4px] bg-sd-grey-3" />

        {canReinstate ? (
          <DropdownMenuItem
            onClick={() => onReinstate(user)}
            className="flex items-center gap-[8px] px-[10px] py-[8px] text-[13px] text-[#008500] hover:bg-[#EBF7EE] rounded-[6px] cursor-pointer font-medium"
          >
            <Refresh size={16} variant="Linear" color="#008500" />
            <span>Reinstate account</span>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={() => onSuspend(user)}
            className="flex items-center gap-[8px] px-[10px] py-[8px] text-[13px] text-[#F2994A] hover:bg-[#FFF5ED] rounded-[6px] cursor-pointer"
          >
            <UserMinus size={16} variant="Linear" color="#F2994A" />
            <span>Suspend account</span>
          </DropdownMenuItem>
        )}

        {!isDeactivated && (
          <DropdownMenuItem
            onClick={() => onDeactivate(user)}
            className="flex items-center gap-[8px] px-[10px] py-[8px] text-[13px] text-[#D54800] hover:bg-[#FFF0ED] rounded-[6px] cursor-pointer"
          >
            <Trash size={16} variant="Linear" color="#D54800" />
            <span>Deactivate account</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
