"use client";

import React from "react";
import {
  Eye,
  Copy,
  UserMinus,
  Refresh,
  DirectInbox,
  ShieldSecurity,
  Key,
  Trash,
} from "iconsax-react";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type ActionType =
  | "view"
  | "copy-id"
  | "copy-email"
  | "reactivate"
  | "revoke"
  | "resend";

export interface TeamRow {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  initials: string;
  email: string;
  role: string;
  roleLabel: string;
  /**
   * The RBAC role this person holds, matched from `GET /admin/roles/`.
   *
   * Absent when the roster's `role_label` matches no role on the platform,
   * which is the one case where a role change or a re-invite cannot be sent
   * safely — the roster row itself carries no role id.
   */
  roleId?: string;
  date: string;
  invitationStatus: string;
  userId: string;
}

interface TeamActionMenuProps {
  member: TeamRow;
  isSelf?: boolean;
  isSuperAdmin?: boolean;
  /**
   * Which lifecycle actions the *caller* may perform. Every one of these is a
   * separate permission on the backend, and each endpoint 403s on its own — so
   * they are passed in rather than derived here.
   */
  canFullAccess?: boolean;
  canResetPassword?: boolean;
  canDelete?: boolean;
  onViewDetails: (member: TeamRow) => void;
  onCopyId: (id: string) => void;
  onCopyEmail: (email: string) => void;
  onReactivate: (member: TeamRow) => void;
  onRevoke: (member: TeamRow) => void;
  onResend?: (member: TeamRow) => void;
  onChangeRole?: (member: TeamRow) => void;
  onResetPassword?: (member: TeamRow) => void;
  onDeleteAccount?: (member: TeamRow) => void;
}

export const TeamActionMenu: React.FC<TeamActionMenuProps> = ({
  member,
  isSelf = false,
  isSuperAdmin = false,
  canFullAccess = false,
  canResetPassword = false,
  canDelete = false,
  onViewDetails,
  onCopyId,
  onCopyEmail,
  onReactivate,
  onRevoke,
  onResend,
  onChangeRole,
  onResetPassword,
  onDeleteAccount,
}) => {
  const isRevoked = member.invitationStatus === "REVOKED";
  const isPending = member.invitationStatus === "PENDING";
  const isActive = member.invitationStatus === "ACTIVE";

  // Both the caller's own account and the Super Admin seat are refused by every
  // lifecycle endpoint, so the actions are withheld rather than failing.
  const isProtected = isSelf || isSuperAdmin;

  const showChangeRole = isActive && canFullAccess && !isProtected;
  const showResetPassword = isActive && canResetPassword && !isProtected;
  const showDelete = isActive && canDelete && !isProtected;
  const hasAccountActions = showChangeRole || showResetPassword || showDelete;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          className="size-[32px] rounded-[6px] border border-sd-grey-4 bg-white flex items-center justify-center text-[#606060] hover:text-[#202020] hover:bg-sd-grey-2 transition-colors cursor-pointer"
          aria-label="Staff actions"
        >
          <MoreVertical size={18} className="text-[#606060] shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[200px] p-[6px] bg-white rounded-[10px] border border-sd-grey-4 shadow-lg z-50"
      >
        <DropdownMenuItem
          onClick={() => onViewDetails(member)}
          className="flex items-center gap-[8px] px-[10px] py-[8px] text-[13px] text-sd-grey-12 hover:bg-sd-grey-2 rounded-[6px] cursor-pointer"
        >
          <Eye size={16} variant="Linear" color="#606060" />
          <span>View details</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onCopyId(member.userId)}
          className="flex items-center gap-[8px] px-[10px] py-[8px] text-[13px] text-sd-grey-12 hover:bg-sd-grey-2 rounded-[6px] cursor-pointer"
        >
          <Copy size={16} variant="Linear" color="#606060" />
          <span>Copy user ID</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onCopyEmail(member.email)}
          className="flex items-center gap-[8px] px-[10px] py-[8px] text-[13px] text-sd-grey-12 hover:bg-sd-grey-2 rounded-[6px] cursor-pointer"
        >
          <Copy size={16} variant="Linear" color="#606060" />
          <span>Copy email</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-[4px] bg-sd-grey-3" />

        {/* Status-specific action items */}
        {isRevoked && (
          <>
            {canFullAccess && (
              <DropdownMenuItem
                onClick={() => onReactivate(member)}
                className="flex items-center gap-[8px] px-[10px] py-[8px] text-[13px] text-[#008500] hover:bg-[#EBF7EE] rounded-[6px] cursor-pointer font-medium"
              >
                <Refresh size={16} variant="Linear" color="#008500" />
                <span>Reactivate access</span>
              </DropdownMenuItem>
            )}
            {onResend && (
              <DropdownMenuItem
                onClick={() => onResend(member)}
                disabled={!member.roleId}
                className="flex items-center gap-[8px] px-[10px] py-[8px] text-[13px] text-[#0063EF] hover:bg-[#EBF3FF] rounded-[6px] cursor-pointer"
              >
                <DirectInbox size={16} variant="Linear" color="#0063EF" />
                <span>Re-invite staff</span>
              </DropdownMenuItem>
            )}
          </>
        )}

        {isPending && (
          <>
            {onResend && (
              <DropdownMenuItem
                onClick={() => onResend(member)}
                disabled={!member.roleId}
                className="flex items-center gap-[8px] px-[10px] py-[8px] text-[13px] text-[#0063EF] hover:bg-[#EBF3FF] rounded-[6px] cursor-pointer"
              >
                <Refresh size={16} variant="Linear" color="#0063EF" />
                <span>Resend invitation</span>
              </DropdownMenuItem>
            )}
            {canFullAccess && (
              <DropdownMenuItem
                onClick={() => onRevoke(member)}
                className="flex items-center gap-[8px] px-[10px] py-[8px] text-[13px] text-[#D54800] hover:bg-[#FFF0ED] rounded-[6px] cursor-pointer"
              >
                <UserMinus size={16} variant="Linear" color="#D54800" />
                <span>Revoke invitation</span>
              </DropdownMenuItem>
            )}
          </>
        )}

        {isActive && (
          <>
            {hasAccountActions && (
              <DropdownMenuSeparator className="my-[4px] bg-sd-grey-3" />
            )}

            {showChangeRole && onChangeRole && (
              <DropdownMenuItem
                onClick={() => onChangeRole(member)}
                className="flex items-center gap-[8px] px-[10px] py-[8px] text-[13px] text-sd-grey-12 hover:bg-sd-grey-2 rounded-[6px] cursor-pointer"
              >
                <ShieldSecurity size={16} variant="Linear" color="#606060" />
                <span>Change role</span>
              </DropdownMenuItem>
            )}

            {showResetPassword && onResetPassword && (
              <DropdownMenuItem
                onClick={() => onResetPassword(member)}
                className="flex items-center gap-[8px] px-[10px] py-[8px] text-[13px] text-sd-grey-12 hover:bg-sd-grey-2 rounded-[6px] cursor-pointer"
              >
                <Key size={16} variant="Linear" color="#606060" />
                <span>Reset password</span>
              </DropdownMenuItem>
            )}

            {isProtected ? (
              <div className="px-[10px] py-[6px] text-[12px] text-sd-grey-7 italic">
                {isSelf
                  ? "Your account (Protected)"
                  : "Super Admin (Protected)"}
              </div>
            ) : (
              canFullAccess && (
                <DropdownMenuItem
                  onClick={() => onRevoke(member)}
                  className="flex items-center gap-[8px] px-[10px] py-[8px] text-[13px] text-[#D54800] hover:bg-[#FFF0ED] rounded-[6px] cursor-pointer"
                >
                  <UserMinus size={16} variant="Linear" color="#D54800" />
                  <span>Revoke access</span>
                </DropdownMenuItem>
              )
            )}

            {showDelete && onDeleteAccount && (
              <DropdownMenuItem
                onClick={() => onDeleteAccount(member)}
                className="flex items-center gap-[8px] px-[10px] py-[8px] text-[13px] text-[#D54800] hover:bg-[#FFF0ED] rounded-[6px] cursor-pointer"
              >
                <Trash size={16} variant="Linear" color="#D54800" />
                <span>Delete account</span>
              </DropdownMenuItem>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

