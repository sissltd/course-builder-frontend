"use client";

import React, { useState } from "react";
import { User, UserTick, Designtools, UserOctagon, More, Copy, Filter, Sort, TickCircle } from "iconsax-react";
import { BaseTable } from "@/components/shared/BaseTable";
import { Modal } from "@/components/shared/Modal";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { Button } from "@/components/shared/Button";
import { AddStaffModal } from "@/modules/admin/dashboard/components/AddStaffModal";
import { TeamActionMenu, ActionType } from "./components/TeamActionMenu";
import { TeamMemberDrawer } from "./components/TeamMemberDrawer";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import {
  useGetStaffQuery,
  useSuspendUserMutation,
  useDeactivateUserMutation,
  useReinstateUserMutation,
  useRevokeStaffMutation,
} from "./hooks";
import type { StaffMember } from "./types";

interface TeamRow {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: string;
  date: string;
  invitationStatus: string;
  userId: string;
}

function toInitials(first: string, last: string): string {
  return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();
}

function formatDateTime(dt: string | null): string {
  if (!dt) return "—";
  const d = new Date(dt);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function staffToRow(s: StaffMember): TeamRow {
  return {
    id: s.id,
    name: `${s.first_name} ${s.last_name}`,
    initials: toInitials(s.first_name, s.last_name),
    email: s.email,
    role: s.role_label,
    date: formatDateTime(s.created_datetime),
    invitationStatus: s.invitation_status,
    userId: s.id,
  };
}

const userColors = ["#0A60E1", "#FF8A00", "#00C48C", "#FF3D57", "#7C3AED", "#14B8A6", "#8B5CF6", "#F59E0B"];

const roleOptions = [
  { label: "Writer", value: "STAFF_WRITER" },
  { label: "Verifier", value: "STAFF_VERIFIER" },
  { label: "Approver", value: "STAFF_APPROVER" },
];

const successLabels: Record<string, { title: string; description: string }> = {
  suspend: { title: "Account suspended!", description: "The account has been suspended. They will not be able to access the platform." },
  delete: { title: "Account deleted!", description: "The account has been permanently deleted." },
  "change-role": { title: "Role changed!", description: "The user's role has been updated successfully." },
  reinstate: { title: "Account reinstated!", description: "The account has been reinstated and can access the platform again." },
  revoke: { title: "Access revoked!", description: "The staff member's access has been revoked." },
};

export const TeamsView = () => {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [openMenuRow, setOpenMenuRow] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamRow | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [actionMember, setActionMember] = useState<TeamRow | null>(null);
  const [confirmAction, setConfirmAction] = useState<ActionType | null>(null);
  const [successAction, setSuccessAction] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [showReasonModal, setShowReasonModal] = useState(false);

  const { data: staffData, isLoading } = useGetStaffQuery();
  const [suspendUser] = useSuspendUserMutation();
  const [deactivateUser] = useDeactivateUserMutation();
  const [reinstateUser] = useReinstateUserMutation();
  const [revokeStaff] = useRevokeStaffMutation();

  const rows: TeamRow[] = (staffData ?? []).map(staffToRow);

  const totalStaff = rows.length;
  const totalActive = rows.filter((r) => r.invitationStatus === "ACTIVE").length;
  const totalPending = rows.filter((r) => r.invitationStatus === "PENDING").length;
  const totalRevoked = rows.filter((r) => r.invitationStatus === "REVOKED").length;

  const handleAction = (member: TeamRow, action: ActionType) => {
    setActionMember(member);
    if (action === "copy-id") {
      navigator.clipboard.writeText(member.userId);
      toast.success("User ID copied to clipboard");
      return;
    }
    if (action === "suspend" || action === "delete") {
      setReason("");
      setShowReasonModal(true);
      setConfirmAction(action);
      return;
    }
    if (action === "change-role") {
      // For now treat like a confirmation + success flow
    }
    setConfirmAction(action);
    setReason("");
  };

  const handleReasonConfirm = () => {
    setShowReasonModal(false);
    // The confirmAction is already set, just show the confirmation modal
  };

  const handleConfirm = async () => {
    if (!confirmAction || !actionMember) return;

    try {
      switch (confirmAction) {
        case "suspend":
          await suspendUser({ id: actionMember.id, body: { reason: reason || "Suspended by admin" } }).unwrap();
          break;
        case "delete":
          await deactivateUser({ id: actionMember.id, body: { reason: reason || "Deactivated by admin" } }).unwrap();
          break;
        case "reinstate":
          await reinstateUser(actionMember.id).unwrap();
          break;
        case "revoke":
          await revokeStaff(actionMember.id).unwrap();
          break;
      }
      setConfirmAction(null);
      setTimeout(() => setSuccessAction(confirmAction), 300);
    } catch (err) {
      setConfirmAction(null);
      const data = err as { data?: { errors?: { message: string }[] } };
      const message = data?.data?.errors?.[0]?.message ?? "Action failed";
      toast.error(message);
    }
  };

  const currentSuccess = successAction ? successLabels[successAction] : null;

  const columns: ColumnDef<TeamRow>[] = [
    {
      accessorKey: "name",
      header: "Names",
      cell: ({ row }) => {
        const idx = rows.findIndex((d) => d.id === row.original.id);
        const color = userColors[idx % userColors.length];
        return (
          <div className="flex items-center gap-[8px] w-[216px]">
            <div
              className="size-[32px] rounded-full flex items-center justify-center text-[16px] font-medium text-white shrink-0"
              style={{ backgroundColor: color }}
            >
              {row.original.initials}
            </div>
            <span className="text-[14px] font-normal text-[#202020] tracking-[-0.28px] leading-[20px]">
              {row.original.name}
            </span>
          </div>
        );
      },
      size: 247,
    },
    {
      accessorKey: "email",
      header: "Email address",
      cell: ({ row }) => (
        <span className="text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px]">{row.original.email}</span>
      ),
      size: 206,
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <span className="text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px]">{row.original.role}</span>
      ),
      size: 172,
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => (
        <span className="text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px]">{row.original.date}</span>
      ),
      size: 186,
    },
    {
      accessorKey: "invitationStatus",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.invitationStatus;
        const isActive = status === "ACTIVE";
        const isPending = status === "PENDING";
        return (
          <div className={`inline-flex items-center px-[8px] py-[4px] rounded-[6px] ${
            isActive ? "bg-[#F1F8F2] text-[#3C7E44]"
              : isPending ? "bg-[#FFF5ED] text-[#B54708]"
                : "bg-[#FEF3F2] text-[#B42318]"
          }`}>
            <span className="text-[12px] font-normal leading-[16px]">{status}</span>
          </div>
        );
      },
      size: 120,
    },
    {
      accessorKey: "userId",
      header: "User ID",
      cell: ({ row }) => (
        <div className="flex items-center gap-[10px]">
          <span className="text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px] overflow-hidden text-ellipsis">
            {row.original.userId}
          </span>
          <Copy variant="Linear" size={14} color="#606060" className="cursor-pointer shrink-0 hover:text-[#0063EF]" />
        </div>
      ),
      size: 202,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="relative flex justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenMenuRow(openMenuRow === row.original.userId ? null : row.original.userId);
            }}
            className="p-[6px] rounded-full hover:bg-sd-grey-1 transition-colors cursor-pointer"
          >
            <More variant="Linear" size={24} color="#606060" />
          </button>
          {openMenuRow === row.original.userId && (
            <TeamActionMenu
              onClose={() => setOpenMenuRow(null)}
              onAction={(action) => handleAction(row.original, action)}
              invitationStatus={row.original.invitationStatus}
            />
          )}
        </div>
      ),
      size: 41,
    },
  ];

  const statCards = [
    { icon: <User variant="Bold" size={20} color="#202020" />, label: "Total Staff", value: String(totalStaff) },
    { icon: <UserTick variant="Bold" size={20} color="#202020" />, label: "Active", value: String(totalActive) },
    { icon: <Designtools variant="Bold" size={20} color="#202020" />, label: "Pending", value: String(totalPending) },
    { icon: <UserOctagon variant="Bold" size={20} color="#202020" />, label: "Revoked", value: String(totalRevoked) },
  ];

  return (
    <>
      <AddStaffModal isOpen={isInviteOpen} onOpenChange={setIsInviteOpen} />
      <TeamMemberDrawer
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        member={selectedMember}
      />
      <div className="flex flex-col gap-[24px]">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[24px] font-medium text-[#202020] tracking-[-0.48px] leading-[32px]">Teams</h1>
            <p className="text-[16px] font-normal text-[#606060] leading-[24px]">Manage your teams and their roles</p>
          </div>
          <button
            onClick={() => setIsInviteOpen(true)}
            className="bg-[#0063EF] flex items-center gap-[8px] h-[40px] px-[24px] py-[12px] rounded-[8px] hover:bg-[#0052CC] transition-colors cursor-pointer"
          >
            <span className="text-[16px] font-normal text-[#FDFDFD] tracking-[-0.32px] leading-[24px]">Invite</span>
          </button>
        </div>

        <div className="flex gap-[16px] flex-wrap">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="border border-[#E8E8E8] bg-[#FDFDFD] flex flex-col flex-1 h-[104px] items-start justify-between p-[16px] relative rounded-[12px] shadow-[inset_0px_-4px_8px_0px_rgba(255,255,255,0.2),inset_0px_4px_8px_0px_rgba(255,255,255,0.16)]"
            >
              <div className="flex gap-[8px] items-center">
                {card.icon}
                <span className="text-[14px] font-normal text-[#606060] tracking-[-0.28px] leading-[20px]">{card.label}</span>
              </div>
              <span className="text-[28px] font-medium text-[#202020] tracking-[-0.56px] leading-[32px]">{card.value}</span>
            </div>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-sd-grey-3 border-t-[#0063EF]" />
          </div>
        ) : (
          <BaseTable
            title="Teams"
            columns={columns}
            data={rows}
            searchPlaceholder="Search names, email etc"
            filters={[
              {
                label: "Role",
                icon: <Filter size={20} variant="Linear" color="#606060" />,
                searchable: true,
                searchPlaceholder: "Search role",
                options: roleOptions.map((r) => ({ label: r.label, value: r.value })),
                onValueChange: () => {},
              },
              {
                label: "Sort",
                icon: <Sort size={20} variant="Linear" color="#606060" />,
                options: [
                  { label: "Newest", value: "newest" },
                  { label: "Oldest", value: "oldest" },
                  { label: "A-Z", value: "az" },
                ],
                onValueChange: () => {},
              },
            ]}
            showDateFilter
            dateFilterInline
            showHeader={false}
            showPagination={false}
            ignoreRowClickColumns={["actions"]}
            onRowClick={(member) => {
              setSelectedMember(member);
              setIsDrawerOpen(true);
            }}
          />
        )}
      </div>

      {/* Reason Input Modal */}
      <Modal
        isOpen={showReasonModal}
        onOpenChange={(open) => {
          if (!open) {
            setShowReasonModal(false);
            setConfirmAction(null);
          }
        }}
        title={confirmAction === "suspend" ? "Suspend account?" : "Deactivate account?"}
        className="sm:max-w-[500px]"
      >
        <div className="flex flex-col gap-[16px]">
          <p className="text-[14px] text-[#606060] leading-[20px]">
            {confirmAction === "suspend"
              ? `Are you sure you want to suspend ${actionMember?.name || "this user"}?`
              : `Are you sure you want to deactivate ${actionMember?.name || "this user"}? This action is permanent.`}
          </p>
          <div className="flex flex-col gap-[8px]">
            <label className="text-[14px] font-medium text-[#202020]">Reason</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={confirmAction === "suspend" ? "Enter reason for suspension..." : "Enter reason for deactivation..."}
              className="w-full h-[80px] border border-[#E8E8E8] rounded-[8px] p-[12px] text-[14px] text-[#202020] resize-none focus:outline-none focus:border-[#0063EF]"
            />
          </div>
          <div className="flex gap-[12px]">
            <Button
              variant="outline"
              className="flex-1 h-[44px] text-[14px]"
              onClick={() => {
                setShowReasonModal(false);
                setConfirmAction(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant={confirmAction === "suspend" ? "destructive" : "destructive"}
              className="flex-1 h-[44px] text-[14px]"
              onClick={handleReasonConfirm}
            >
              Continue
            </Button>
          </div>
        </div>
      </Modal>

      {/* Confirmation Modals */}
      <ConfirmModal
        isOpen={confirmAction === "suspend" && !showReasonModal}
        onOpenChange={(open) => { if (!open) setConfirmAction(null); }}
        title="Suspend account?"
        description={`Are you sure you want to suspend ${actionMember?.name || "this user"}? They will lose access to the platform.`}
        confirmLabel="Yes, suspend"
        variant="danger"
        onConfirm={handleConfirm}
      />
      <ConfirmModal
        isOpen={confirmAction === "delete" && !showReasonModal}
        onOpenChange={(open) => { if (!open) setConfirmAction(null); }}
        title="Deactivate account?"
        description={`This action is permanent and cannot be undone. ${actionMember?.name || "This user"} will lose all access.`}
        confirmLabel="Yes, deactivate"
        variant="danger"
        onConfirm={handleConfirm}
      />
      <ConfirmModal
        isOpen={confirmAction === "change-role"}
        onOpenChange={(open) => { if (!open) setConfirmAction(null); }}
        title="Change role?"
        description={`Are you sure you want to change the role for ${actionMember?.name || "this user"}?`}
        confirmLabel="Yes, change"
        variant="primary"
        onConfirm={handleConfirm}
      />
      <ConfirmModal
        isOpen={confirmAction === "reinstate"}
        onOpenChange={(open) => { if (!open) setConfirmAction(null); }}
        title="Reinstate account?"
        description={`Are you sure you want to reinstate ${actionMember?.name || "this user"}? They will regain access to the platform.`}
        confirmLabel="Yes, reinstate"
        variant="primary"
        onConfirm={handleConfirm}
      />
      <ConfirmModal
        isOpen={confirmAction === "revoke"}
        onOpenChange={(open) => { if (!open) setConfirmAction(null); }}
        title="Revoke access?"
        description={`Are you sure you want to revoke access for ${actionMember?.name || "this user"}? They will no longer be able to sign in.`}
        confirmLabel="Yes, revoke"
        variant="danger"
        onConfirm={handleConfirm}
      />

      {/* Success Modals */}
      {currentSuccess && (
        <Modal
          isOpen={!!successAction}
          onOpenChange={(open) => { if (!open) setSuccessAction(null); }}
        >
          <div className="flex flex-col items-center gap-[16px] text-center">
            <div className="size-[80px] rounded-full bg-[#EBF7EE] flex items-center justify-center">
              <TickCircle variant="Bold" size={48} color="#008500" />
            </div>
            <div className="flex flex-col gap-[4px]">
              <span className="text-[28px] font-semibold text-[#202020] leading-tight">{currentSuccess.title}</span>
              <p className="text-[14px] text-[#606060] leading-normal max-w-[320px]">{currentSuccess.description}</p>
            </div>
            <button
              onClick={() => setSuccessAction(null)}
              className="w-full h-[44px] bg-[#0063EF] text-white text-[14px] font-medium rounded-[8px] hover:bg-[#0052CC] transition-colors cursor-pointer mt-[8px]"
            >
              Done
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};
