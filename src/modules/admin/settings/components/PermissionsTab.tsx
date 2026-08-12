"use client";

import React from "react";
import { CheckCircle2, MoreHorizontal, X } from "lucide-react";
import { Button as AppButton } from "@/components/shared/Button";
import { Modal } from "@/components/shared/Modal";
import { FormInput } from "@/components/form/FormInput";
import { cn } from "@/lib/utils";

type RoleId =
  | "super-admin"
  | "admin"
  | "reviewer-writer"
  | "reviewer-verifier"
  | "reviewer-approver"
  | "creators"
  | "collaborators";

type PermissionSection = {
  title: string;
  items: string[];
};

type RoleCard = { id: RoleId; label: string };

const initialRoleCards: RoleCard[] = [
  { id: "super-admin", label: "Super Admin" },
  { id: "admin", label: "Admin" },
  { id: "reviewer-writer", label: "Reviewer (Writer)" },
  { id: "reviewer-verifier", label: "Reviewer (Verifier)" },
  { id: "reviewer-approver", label: "Reviewer (Approver)" },
  { id: "creators", label: "Creators" },
  { id: "collaborators", label: "Collaborators" },
];

const permissionsByRole: Record<RoleId, PermissionSection[]> = {
  "super-admin": [
    { title: "Dashboard", items: ["View Only", "Limited Access"] },
    {
      title: "Courses",
      items: [
        "Approve Course",
        "Reject Course",
        "View Course",
        "Edit Course",
        "Create Course",
        "Assign Course",
        "Force Course Version Migration",
        "Set Course Pricing at Approval",
      ],
    },
    { title: "Staff", items: ["Full Access", "View Only", "View Staff Detail", "Delete Staff", "Add Staff", "Reset password"] },
    { title: "Creators", items: ["View Wallet", "Suspend Account", "Issue Refund", "Approve Account", "View Profile"] },
    { title: "Teams", items: ["Invite Teams", "Suspend Account", "Delete Account", "Reset Password"] },
    { title: "APE Pipeline & MIE", items: ["View APE Pipeline", "Approve MIE Topics Proposals"] },
  ],
  admin: [
    { title: "Dashboard", items: ["View Only"] },
    {
      title: "Courses",
      items: [
        "Approve Course",
        "Reject Course",
        "View Course",
        "Create Course",
        "Assign Course",
        "Set Course Pricing at Approval",
      ],
    },
    { title: "Staff", items: ["Full Access", "View Staff Detail", "Add Staff", "Reset password"] },
    { title: "Creators", items: ["View Wallet", "Suspend Account", "Issue Refund", "Approve Account", "View Profile"] },
    { title: "Teams", items: ["Invite Teams", "Suspend Account", "Delete Account", "Reset Password"] },
    { title: "APE Pipeline & MIE", items: ["View APE Pipeline", "Approve MIE Topics Proposals"] },
  ],
  "reviewer-writer": [
    { title: "Dashboard", items: ["View Only"] },
    { title: "Courses", items: ["View Course", "Edit Course", "Create Course"] },
    { title: "Staff", items: ["View Only"] },
    { title: "Creators", items: ["View Profile"] },
    { title: "Teams", items: [] },
    { title: "APE Pipeline & MIE", items: [] },
  ],
  "reviewer-verifier": [
    { title: "Dashboard", items: ["View Only"] },
    { title: "Courses", items: ["View Course", "Edit Course", "Create Course"] },
    { title: "Staff", items: ["View Only"] },
    { title: "Creators", items: ["View Profile"] },
    { title: "Teams", items: [] },
    { title: "APE Pipeline & MIE", items: [] },
  ],
  "reviewer-approver": [
    { title: "Dashboard", items: ["View Only"] },
    { title: "Courses", items: ["Approve Course", "Reject Course", "View Course", "Create Course", "Set Course Pricing at Approval"] },
    { title: "Staff", items: ["View Only"] },
    { title: "Creators", items: ["View Profile"] },
    { title: "Teams", items: [] },
    { title: "APE Pipeline & MIE", items: ["Approve MIE Topics Proposals"] },
  ],
  creators: [
    { title: "Dashboard", items: [] },
    { title: "Courses", items: ["Create Course"] },
    { title: "Staff", items: [] },
    { title: "Creators", items: ["View Wallet", "View Profile"] },
    { title: "Teams", items: [] },
    { title: "APE Pipeline & MIE", items: [] },
  ],
  collaborators: [
    { title: "Dashboard", items: ["Limited Access"] },
    { title: "Courses", items: [] },
    { title: "Staff", items: [] },
    { title: "Creators", items: [] },
    { title: "Teams", items: [] },
    { title: "APE Pipeline & MIE", items: [] },
  ],
};

const RoleCardMenu = () => (
  <div className="absolute right-0 top-[44px] z-20 w-[148px] rounded-[12px] border border-sd-grey-3 bg-white p-[8px] shadow-[0px_8px_20px_0px_rgba(0,0,0,0.14)]">
    <div className="flex flex-col gap-[2px]">
      <AppButton
        type="button"
        variant="ghost"
        size="sm"
        className="h-[34px] justify-start rounded-[8px] px-[10px] text-[12px] font-normal text-sd-grey-11 hover:bg-sd-grey-1"
      >
        Edit role
      </AppButton>
      <AppButton
        type="button"
        variant="ghost"
        size="sm"
        className="h-[34px] justify-start rounded-[8px] px-[10px] text-[12px] font-normal text-sd-danger hover:bg-sd-danger-soft"
      >
        Delete role
      </AppButton>
    </div>
  </div>
);

const PermissionPill = ({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "inline-flex h-[34px] items-center gap-[8px] rounded-[8px] border px-[12px] text-[14px] font-normal leading-[20px] tracking-[-0.28px] transition-colors cursor-pointer",
      selected
        ? "border-sd-blue bg-sd-blue text-white"
        : "border-sd-grey-3 bg-white text-sd-grey-11 hover:bg-sd-grey-1"
    )}
  >
    <span>{label}</span>
    {selected && <CheckCircle2 size={16} strokeWidth={2} />}
  </button>
);

export const PermissionsTab = () => {
  const [roleCards, setRoleCards] = React.useState<RoleCard[]>(initialRoleCards);
  const [activeRole, setActiveRole] = React.useState<RoleId>("super-admin");
  const [openMenuRole, setOpenMenuRole] = React.useState<RoleId | null>(null);
  const [rolePermissions, setRolePermissions] = React.useState<Record<RoleId, PermissionSection[]>>(permissionsByRole);
  const [isAddRoleOpen, setIsAddRoleOpen] = React.useState(false);
  const [roleTitle, setRoleTitle] = React.useState("");

  const sections = rolePermissions[activeRole];
  const activeItems = new Set(sections.flatMap((section) => section.items));

  const handleTogglePermission = (sectionTitle: string, itemLabel: string) => {
    setRolePermissions((current) => ({
      ...current,
      [activeRole]: current[activeRole].map((section) => {
        if (section.title !== sectionTitle) {
          return section;
        }

        const exists = section.items.includes(itemLabel);

        return {
          ...section,
          items: exists
            ? section.items.filter((item) => item !== itemLabel)
            : [...section.items, itemLabel],
        };
      }),
    }));
  };

  const handleSaveRole = () => {
    const trimmedTitle = roleTitle.trim();

    if (!trimmedTitle) return;

    const nextId = `custom-${Date.now()}` as RoleId;
    const emptySections = permissionSourceSections().map((section) => ({ ...section, items: [] }));

    setRoleCards((current) => [...current, { id: nextId, label: trimmedTitle }]);
    setRolePermissions((current) => ({
      ...current,
      [nextId]: emptySections,
    }));
    setActiveRole(nextId);
    setRoleTitle("");
    setIsAddRoleOpen(false);
  };

  return (
    <>
      <Modal
        isOpen={isAddRoleOpen}
        onOpenChange={(open) => {
          setIsAddRoleOpen(open);
          if (!open) {
            setRoleTitle("");
          }
        }}
        showCloseButton={false}
        className="sm:max-w-[600px] rounded-[16px] border border-sd-grey-3 bg-white p-[20px]"
        title={
          <div className="flex items-start justify-between gap-[16px]">
            <span className="text-[20px] font-semibold text-sd-grey-12 leading-[32px] tracking-[-0.4px]">
              Add new role
            </span>
            <AppButton
              type="button"
              variant="outline"
              size="icon-sm"
              className="size-[32px] rounded-[10px] border-sd-grey-3 bg-white text-sd-grey-9 hover:bg-sd-grey-2"
              onClick={() => {
                setIsAddRoleOpen(false);
                setRoleTitle("");
              }}
              aria-label="Close add role modal"
            >
              <X size={18} />
            </AppButton>
          </div>
        }
      >
        <div className="flex flex-col gap-[40px] pt-[4px]">
          <FormInput
            name="addRoleTitle"
            label="Role Title"
            placeholder="Enter name"
            value={roleTitle}
            onChange={(event) => setRoleTitle(event.target.value)}
            className="h-[44px] rounded-[10px] border-[1.5px] border-sd-grey-6 bg-white text-[14px] text-sd-grey-12"
          />

          <div className="flex gap-[12px]">
            <AppButton
              type="button"
              variant="outline"
              size="app"
              className="h-[44px] min-w-[134px] rounded-[10px] border-sd-grey-6 bg-white px-[24px] text-[14px] font-normal text-sd-grey-12"
              onClick={() => {
                setIsAddRoleOpen(false);
                setRoleTitle("");
              }}
            >
              Cancel
            </AppButton>
            <AppButton
              type="button"
              variant="app-primary"
              size="app"
              className="h-[44px] min-w-[134px] rounded-[10px] px-[24px] text-[14px] font-normal tracking-[-0.28px]"
              onClick={handleSaveRole}
            >
              Save
            </AppButton>
          </div>
        </div>
      </Modal>

      <div className="flex w-full flex-col gap-[34px]">
      <div className="flex items-start justify-between gap-[16px]">
        <div className="flex flex-col gap-[6px]">
          <h3 className="text-[22px] font-medium text-sd-grey-12 tracking-[-0.44px] leading-[32px]">
            Roles &amp; Permissions
          </h3>
          <p className="text-[14px] font-normal text-sd-grey-11 leading-[24px]">
            Manage team members, assign roles, and control access levels
          </p>
        </div>

        <AppButton
          type="button"
          variant="app-primary"
          size="app"
          className="h-[40px] rounded-[10px] px-[24px] text-[14px] font-normal tracking-[-0.28px]"
          onClick={() => setIsAddRoleOpen(true)}
        >
          Add Role
        </AppButton>
      </div>

      <div className="grid grid-cols-4 gap-[12px]">
        {roleCards.map((role) => (
          <div
            key={role.id}
            className="relative flex h-[42px] items-center justify-between rounded-[10px] border border-sd-grey-3 bg-white px-[12px]"
          >
            <button
              type="button"
              onClick={() => setActiveRole(role.id)}
              className={cn(
                "flex-1 whitespace-nowrap pr-[10px] text-left text-[14px] font-normal leading-[20px] tracking-[-0.28px] cursor-pointer",
                activeRole === role.id ? "text-sd-grey-12" : "text-sd-grey-14"
              )}
            >
              {role.label}
            </button>

            <button
              type="button"
              onClick={() => setOpenMenuRole((current) => (current === role.id ? null : role.id))}
              className="ml-[10px] text-sd-grey-11"
              aria-label={`${role.label} menu`}
            >
              <MoreHorizontal size={18} strokeWidth={2} />
            </button>

            {openMenuRole === role.id && (
              <>
                <button
                  type="button"
                  className="fixed inset-0 z-10 cursor-default"
                  onClick={() => setOpenMenuRole(null)}
                  aria-label="Close role menu"
                />
                <RoleCardMenu />
              </>
            )}
          </div>
        ))}
      </div>

      <div className="overflow-x-auto border-b border-sd-grey-3">
        <div className="flex min-w-max items-end gap-[10px]">
          {roleCards.map((role) => {
            const isActive = activeRole === role.id;

            return (
              <button
                key={role.id}
                type="button"
                onClick={() => setActiveRole(role.id)}
                className={cn(
                  "relative h-[40px] shrink-0 px-[12px] text-[14px] font-normal leading-[20px] tracking-[-0.28px] cursor-pointer",
                  isActive ? "text-sd-grey-12" : "text-sd-muted-text"
                )}
              >
                {role.label}
                {isActive && <span className="absolute inset-x-0 bottom-[-1px] h-[2px] bg-sd-grey-12" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-[22px]">
        {sections.map((section) => (
          <div key={section.title} className="flex flex-col gap-[12px]">
            <h4 className="text-[14px] font-medium text-sd-grey-12 leading-[24px] tracking-[-0.28px]">
              {section.title}
            </h4>

            <div className="flex flex-wrap gap-[12px]">
              {section.items.length > 0 ? (
                permissionSource(section.title).map((item) => (
                  <PermissionPill
                    key={item}
                    label={item}
                    selected={activeItems.has(item)}
                    onClick={() => handleTogglePermission(section.title, item)}
                  />
                ))
              ) : (
                <span className="text-[14px] font-normal text-sd-muted-text leading-[20px] tracking-[-0.28px]">
                  No permission
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      </div>
    </>
  );
};

function permissionSource(sectionTitle: string) {
  const source: Record<string, string[]> = {
    Dashboard: ["View Only", "Limited Access"],
    Courses: [
      "Approve Course",
      "Reject Course",
      "View Course",
      "Edit Course",
      "Create Course",
      "Assign Course",
      "Force Course Version Migration",
      "Set Course Pricing at Approval",
    ],
    Staff: ["Full Access", "View Only", "View Staff Detail", "Delete Staff", "Add Staff", "Reset password"],
    Creators: ["View Wallet", "Suspend Account", "Issue Refund", "Approve Account", "View Profile"],
    Teams: ["Invite Teams", "Suspend Account", "Delete Account", "Reset Password"],
    "APE Pipeline & MIE": ["View APE Pipeline", "Approve MIE Topics Proposals"],
  };

  return source[sectionTitle] ?? [];
}

function permissionSourceSections(): PermissionSection[] {
  return [
    { title: "Dashboard", items: [] },
    { title: "Courses", items: [] },
    { title: "Staff", items: [] },
    { title: "Creators", items: [] },
    { title: "Teams", items: [] },
    { title: "APE Pipeline & MIE", items: [] },
  ];
}
