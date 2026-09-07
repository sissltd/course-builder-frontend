"use client";

import React, { useState } from "react";
import { SideDrawer } from "@/components/shared/SideDrawer";
import { TabBar } from "@/components/shared/TabBar";
import { Modal } from "@/components/shared/Modal";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import {
  Briefcase,
  Global,
  Mobile,
  DirectInbox,
  UserOctagon,
  Calendar2,
  Copy,
  Book,
  LoginCurve,
  Chart,
  TickCircle,
  ShieldSecurity,
  UserMinus,
  Setting2,
  Refresh,
} from "iconsax-react";
import { FormSelect } from "@/components/form/FormSelect";
import { toast } from "sonner";
import type { TeamRow } from "./TeamActionMenu";

export type DrawerMember = TeamRow;

interface TeamMemberDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  member: DrawerMember | null;
  isSelf?: boolean;
  isSuperAdmin?: boolean;
  onReactivate?: (member: DrawerMember) => void;
  onRevoke?: (member: DrawerMember) => void;
  onResend?: (member: DrawerMember) => void;
}

type Tab = "overview" | "activities" | "analytics" | "ip-log" | "settings";
type ModalAction = "reset-password" | "delete-account" | "blacklist-ip" | null;

const tabs: { key: Tab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "activities", label: "Activities" },
  { key: "analytics", label: "Analytics" },
  { key: "ip-log", label: "IP Address & Log" },
  { key: "settings", label: "Settings" },
];

const InfoRow = ({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) => (
  <div className="flex items-center gap-[8px]">
    {icon}
    <div className="flex items-center gap-[6px]">{children}</div>
  </div>
);

const CopyButton = ({ text, label }: { text: string; label?: string }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="p-[2px] rounded hover:bg-[#F5F5F5] transition-colors cursor-pointer"
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success(`${label || "Text"} copied to clipboard`);
        setTimeout(() => setCopied(false), 2000);
      }}
      title={`Copy ${label || "text"}`}
    >
      {copied ? (
        <TickCircle variant="Bold" size={14} color="#008500" />
      ) : (
        <Copy variant="Linear" size={14} color="#606060" className="hover:text-[#0063EF]" />
      )}
    </button>
  );
};

const ActivityItem = ({ icon, title, desc, time }: { icon: React.ReactNode; title: string; desc: string; time: string }) => (
  <div className="flex items-center gap-[12px]">
    <div className="size-[40px] bg-[#EBF3FF] rounded-[8px] flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[14px] font-medium text-[#202020] leading-[20px]">{title}</p>
      <p className="text-[12px] text-[#606060] leading-[16px] truncate">{desc}</p>
    </div>
    <span className="text-[12px] text-[#A0A0A0] leading-[16px] shrink-0">{time}</span>
  </div>
);

const successConfig: Record<NonNullable<ModalAction>, { title: string; description: string }> = {
  "reset-password": {
    title: "Password reset!",
    description: "A password reset link has been sent to the user's email address.",
  },
  "delete-account": {
    title: "Account deleted!",
    description: "The account has been permanently deleted.",
  },
  "blacklist-ip": {
    title: "IP blacklisted!",
    description: "The IP address has been blacklisted successfully.",
  },
};

const roleOptions = [
  { label: "Super Admin", value: "Super Admin" },
  { label: "Admin", value: "Admin" },
  { label: "Creator", value: "Creator" },
  { label: "Reviewer (Writer)", value: "Reviewer (Writer)" },
  { label: "Reviewer (Verifier)", value: "Reviewer (Verifier)" },
  { label: "Reviewer (Approver)", value: "Reviewer (Approver)" },
  { label: "Contributor", value: "Contributor" },
];

export const TeamMemberDrawer = ({
  isOpen,
  onOpenChange,
  member,
  isSelf = false,
  isSuperAdmin = false,
  onReactivate,
  onRevoke,
  onResend,
}: TeamMemberDrawerProps) => {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [confirmAction, setConfirmAction] = useState<ModalAction>(null);
  const [successAction, setSuccessAction] = useState<ModalAction>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");

  if (!member) return null;

  const handleConfirm = () => {
    if (confirmAction) {
      setConfirmAction(null);
      setTimeout(() => setSuccessAction(confirmAction), 300);
    }
  };

  const currentSuccess = successAction ? successConfig[successAction] : null;

  return (
    <>
      <SideDrawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Team member information"
        footer={
          <div className="flex gap-[12px] w-full">
            {member.invitationStatus === "REVOKED" ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    onOpenChange(false);
                    onReactivate?.(member);
                  }}
                  className="flex-1 h-[44px] bg-[#0063EF] flex items-center justify-center gap-[8px] rounded-[8px] hover:bg-[#0052CC] transition-colors cursor-pointer"
                >
                  <Refresh variant="Linear" size={18} color="#FDFDFD" />
                  <span className="text-[14px] font-medium text-[#FDFDFD]">Reactivate Access</span>
                </button>
                {onResend && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenChange(false);
                      onResend?.(member);
                    }}
                    className="h-[44px] px-[16px] border border-sd-grey-4 flex items-center justify-center gap-[8px] rounded-[8px] hover:bg-sd-grey-2 transition-colors cursor-pointer"
                  >
                    <DirectInbox variant="Linear" size={18} color="#606060" />
                    <span className="text-[14px] font-medium text-[#606060]">Re-invite</span>
                  </button>
                )}
              </>
            ) : member.invitationStatus === "PENDING" ? (
              <>
                {onResend && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenChange(false);
                      onResend?.(member);
                    }}
                    className="flex-1 h-[44px] bg-[#0063EF] flex items-center justify-center gap-[8px] rounded-[8px] hover:bg-[#0052CC] transition-colors cursor-pointer"
                  >
                    <Refresh variant="Linear" size={18} color="#FDFDFD" />
                    <span className="text-[14px] font-medium text-[#FDFDFD]">Resend Invitation</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    onOpenChange(false);
                    onRevoke?.(member);
                  }}
                  className="h-[44px] px-[16px] border border-[#D54800] flex items-center justify-center gap-[8px] rounded-[8px] hover:bg-[#FFF0ED] transition-colors cursor-pointer"
                >
                  <UserMinus variant="Linear" size={18} color="#D54800" />
                  <span className="text-[14px] font-medium text-[#D54800]">Revoke</span>
                </button>
              </>
            ) : isSelf || isSuperAdmin ? (
              <div className="w-full py-[10px] px-[14px] bg-[#F5F5F5] rounded-[8px] text-center text-[13px] text-[#606060]">
                {isSelf
                  ? "You cannot revoke your own account."
                  : "The Super Admin seat is protected and cannot be revoked."}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onOpenChange(false);
                  onRevoke?.(member);
                }}
                className="flex-1 h-[44px] border border-[#D54800] flex items-center justify-center gap-[8px] rounded-[8px] hover:bg-[#FFF0ED] transition-colors cursor-pointer"
              >
                <UserMinus variant="Linear" size={18} color="#D54800" />
                <span className="text-[14px] font-medium text-[#D54800]">Revoke Access</span>
              </button>
            )}
          </div>
        }
      >
        {/* Profile Header */}
        <div className="flex flex-col gap-[16px] pb-[24px] border-b border-[#F0F0F0]">
          <div className="flex items-center gap-[12px]">
            <div className="size-[46px] rounded-full bg-[#0A60E1] flex items-center justify-center text-[20px] font-semibold text-white shrink-0">
              {member.initials}
            </div>
            <div className="flex flex-col gap-[4px]">
              <div className="flex items-center gap-[8px]">
                <span className="text-[20px] font-semibold text-[#202020] leading-[28px]">{member.name}</span>
                {member.invitationStatus === "ACTIVE" ? (
                  <span className="inline-flex items-center px-[8px] py-[2px] rounded-[6px] bg-[#F1F8F2] text-[#3C7E44] text-[12px] font-normal leading-[16px]">
                    Active
                  </span>
                ) : member.invitationStatus === "PENDING" ? (
                  <span className="inline-flex items-center px-[8px] py-[2px] rounded-[6px] bg-[#FFF5ED] text-[#B54708] text-[12px] font-normal leading-[16px]">
                    Pending
                  </span>
                ) : (
                  <span className="inline-flex items-center px-[8px] py-[2px] rounded-[6px] bg-[#FEF3F2] text-[#B42318] text-[12px] font-normal leading-[16px]">
                    Revoked
                  </span>
                )}
              </div>
              <span className="text-[14px] text-[#606060] leading-[20px]">{member.email}</span>
            </div>
          </div>
        </div>

        <TabBar tabs={tabs} activeKey={activeTab} onChange={(key) => setActiveTab(key as Tab)} />

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="flex flex-col gap-[20px] pt-[24px]">
            <InfoRow icon={<Briefcase variant="Linear" size={20} color="#606060" />}>
              <span className="text-[14px] text-[#202020] leading-[20px]">{member.roleLabel || member.role}</span>
            </InfoRow>
            <InfoRow icon={<Global variant="Linear" size={20} color="#606060" />}>
              <span className="text-[14px] text-[#202020] leading-[20px]">Nigerian</span>
            </InfoRow>
            <InfoRow icon={<Mobile variant="Linear" size={20} color="#606060" />}>
              <span className="text-[14px] text-[#202020] leading-[20px]">+234 901234567</span>
              <CopyButton text="+234 901234567" label="Phone number" />
            </InfoRow>
            <InfoRow icon={<DirectInbox variant="Linear" size={20} color="#606060" />}>
              <span className="text-[14px] text-[#202020] leading-[20px]">{member.email}</span>
              <CopyButton text={member.email} label="Email" />
            </InfoRow>
            <InfoRow icon={<UserOctagon variant="Linear" size={20} color="#606060" />}>
              <span className="text-[14px] text-[#202020] leading-[20px] font-mono">{member.userId}</span>
              <CopyButton text={member.userId} label="User ID" />
            </InfoRow>
            <InfoRow icon={<Calendar2 variant="Linear" size={20} color="#606060" />}>
              <span className="text-[14px] text-[#202020] leading-[20px]">{member.date}</span>
            </InfoRow>
          </div>
        )}

        {/* Activities Tab */}
        {activeTab === "activities" && (
          <div className="flex flex-col gap-[16px] pt-[24px]">
            <div className="flex items-center gap-[8px]">
              <TickCircle variant="Linear" size={20} color="#202020" />
              <span className="text-[16px] font-semibold text-[#202020] leading-[24px]">Activity</span>
            </div>
            <div className="flex flex-col gap-[12px]">
              <ActivityItem icon={<Book variant="Linear" size={20} color="#0063EF" />} title="Approve Course" desc="Introduction to computer" time="15 minutes ago" />
              <ActivityItem icon={<Book variant="Linear" size={20} color="#0063EF" />} title="Approved Course" desc="Python Learning and Computing" time="15 minutes ago" />
              <ActivityItem icon={<Book variant="Linear" size={20} color="#0063EF" />} title="Approved Course" desc="Python Learning and Computing" time="15 minutes ago" />
              <ActivityItem icon={<LoginCurve variant="Linear" size={20} color="#0063EF" />} title="Logged in" desc="Introduction to computer" time="15 minutes ago" />
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="flex flex-col gap-[16px] pt-[24px]">
            <div className="flex items-center gap-[8px]">
              <Chart variant="Linear" size={20} color="#202020" />
              <span className="text-[16px] font-semibold text-[#202020] leading-[24px]">Analytics</span>
            </div>
            <div className="flex gap-[12px]">
              <div className="flex-1 border border-[#E8E8E8] rounded-[12px] p-[16px] bg-[#FDFDFD]">
                <div className="flex items-center gap-[8px] mb-[12px]">
                  <Book variant="Linear" size={16} color="#606060" />
                  <span className="text-[12px] text-[#606060] leading-[16px]">Course Reviewed</span>
                </div>
                <span className="text-[24px] font-medium text-[#202020] leading-[32px]">156/200</span>
              </div>
              <div className="flex-1 border border-[#E8E8E8] rounded-[12px] p-[16px] bg-[#FDFDFD]">
                <div className="flex items-center gap-[8px] mb-[12px]">
                  <Chart variant="Linear" size={16} color="#606060" />
                  <span className="text-[12px] text-[#606060] leading-[16px]">Approval Rate</span>
                </div>
                <span className="text-[24px] font-medium text-[#202020] leading-[32px]">80.4%</span>
              </div>
            </div>
          </div>
        )}

        {/* IP Address & Log Tab */}
        {activeTab === "ip-log" && (
          <div className="flex flex-col gap-[16px] pt-[24px]">
            <div className="flex items-center gap-[8px]">
              <Global variant="Linear" size={20} color="#202020" />
              <span className="text-[16px] font-semibold text-[#202020] leading-[24px]">IP Address &amp; Log</span>
            </div>
            <div className="flex flex-col gap-[16px]">
              <div className="flex items-center gap-[12px]">
                <div className="size-[40px] bg-[#F5F5F5] rounded-[8px] flex items-center justify-center shrink-0">
                  <Mobile variant="Linear" size={20} color="#606060" />
                </div>
                <div>
                  <p className="text-[14px] text-[#202020] leading-[20px]">Lagos, Nigeria</p>
                  <p className="text-[12px] text-[#606060] leading-[16px]">MacBook Pro</p>
                </div>
              </div>
              <div className="flex items-center gap-[12px]">
                <div className="size-[40px] bg-[#F5F5F5] rounded-[8px] flex items-center justify-center shrink-0">
                  <Global variant="Linear" size={20} color="#606060" />
                </div>
                <div className="flex items-center gap-[8px] flex-1">
                  <div>
                    <p className="text-[14px] text-[#202020] leading-[20px]">IP Address</p>
                    <p className="text-[12px] text-[#606060] leading-[16px]">192.127.001.001</p>
                  </div>
                  <span className="inline-flex items-center px-[8px] py-[2px] rounded-[6px] bg-[#F1F8F2] text-[#3C7E44] text-[12px] font-normal leading-[16px]">
                    Active
                  </span>
                </div>
                <button
                  onClick={() => setConfirmAction("blacklist-ip")}
                  className="h-[44px] border border-[#0063EF] text-[#0063EF] text-[14px] font-normal rounded-[8px] px-[24px] hover:bg-[#EBF3FF] transition-colors cursor-pointer shrink-0"
                >
                  Blacklist IP
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="flex flex-col gap-[20px] pt-[24px]">
            <div className="flex items-center gap-[8px]">
              <Setting2 variant="Linear" size={20} color="#202020" />
              <span className="text-[16px] font-semibold text-[#202020] leading-[24px]">Settings</span>
            </div>
            <FormSelect
              name="role"
              label="Role"
              placeholder={member.role}
              options={roleOptions}
              value={selectedRole}
              onValueChange={setSelectedRole}
            />
          </div>
        )}
      </SideDrawer>

      {/* Confirmation Modals */}
      <ConfirmModal
        isOpen={confirmAction === "reset-password"}
        onOpenChange={(open) => { if (!open) setConfirmAction(null); }}
        title="Reset password?"
        description="Are you sure you want to reset this user's password? A reset link will be sent to their email."
        confirmLabel="Yes, reset"
        variant="primary"
        onConfirm={handleConfirm}
      />
      <ConfirmModal
        isOpen={confirmAction === "delete-account"}
        onOpenChange={(open) => { if (!open) setConfirmAction(null); }}
        title="Delete account?"
        description="This action is permanent and cannot be undone. The user will lose all access to their account."
        confirmLabel="Yes, delete"
        variant="danger"
        onConfirm={handleConfirm}
      />
      <ConfirmModal
        isOpen={confirmAction === "blacklist-ip"}
        onOpenChange={(open) => { if (!open) setConfirmAction(null); }}
        title="Blacklist IP?"
        description="This IP address will be blocked from accessing the platform. You can reverse this later."
        confirmLabel="Yes, blacklist"
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
