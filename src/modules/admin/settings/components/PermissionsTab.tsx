"use client";

import React from "react";
import { More, TickCircle, Add } from "iconsax-react";

const roles = ["Super Admin", "Admin", "Reviewer (Writer)", "Reviewer (Verifier)", "Reviewer (Approver)", "Creators", "Collaborators"];

const permissionSections = [
  {
    label: "Dashboard",
    items: [
      { label: "View Only", roles: [true, true, true, true, true, true, false] },
      { label: "Limited Access", roles: [false, false, false, false, false, false, true] },
    ],
  },
  {
    label: "Courses",
    items: [
      { label: "Approve Course", roles: [true, true, false, false, true, false, false] },
      { label: "Reject Course", roles: [true, true, false, false, true, false, false] },
      { label: "View Course", roles: [true, true, true, true, true, false, false] },
      { label: "Edit Course", roles: [true, false, true, true, false, false, false] },
      { label: "Create Course", roles: [true, true, true, true, true, true, false] },
      { label: "Assign Course", roles: [true, true, false, false, false, false, false] },
      { label: "Force Course Version Migration", roles: [true, false, false, false, false, false, false] },
      { label: "Set Course Pricing at Approval", roles: [true, true, false, false, true, false, false] },
    ],
  },
  {
    label: "Staff",
    items: [
      { label: "Full Access", roles: [true, true, false, false, false, false, false] },
      { label: "View Only", roles: [false, false, true, true, true, false, false] },
      { label: "View Staff Detail", roles: [true, true, false, false, false, false, false] },
      { label: "Delete Staff", roles: [true, true, false, false, false, false, false] },
      { label: "Add Staff", roles: [true, true, false, false, false, false, false] },
      { label: "Reset password", roles: [true, true, false, false, false, false, false] },
    ],
  },
  {
    label: "Creators",
    items: [
      { label: "View Wallet", roles: [true, true, false, false, false, false, false] },
      { label: "Suspend Account", roles: [true, true, false, false, false, false, false] },
      { label: "Issue Refund", roles: [true, true, false, false, false, false, false] },
      { label: "Approve Account", roles: [true, true, false, false, false, false, false] },
      { label: "View Profile", roles: [true, true, false, false, false, false, false] },
    ],
  },
  {
    label: "Teams",
    items: [
      { label: "Invite Teams", roles: [true, true, false, false, false, false, false] },
      { label: "Suspend Account", roles: [true, true, false, false, false, false, false] },
      { label: "Delete Account", roles: [true, true, false, false, false, false, false] },
      { label: "Reset Password", roles: [true, true, false, false, false, false, false] },
    ],
  },
  {
    label: "APE Pipeline & MIE",
    items: [
      { label: "View APE Pipeline", roles: [true, true, false, false, false, false, false] },
      { label: "Approve MIE Topics Proposals", roles: [true, true, false, false, true, false, false] },
    ],
  },
  {
    label: "Settings",
    items: [
      { label: "Full Access", roles: [true, true, false, false, false, false, false] },
      { label: "Profile", roles: [true, true, true, true, true, true, true] },
      { label: "Company info", roles: [true, true, false, false, false, false, false] },
      { label: "Permissions", roles: [true, false, false, false, false, false, false] },
      { label: "Security", roles: [true, true, false, false, false, false, false] },
    ],
  },
];

const roleCards = [
  { name: "Super Admin", bg: "#F0F0F0" },
  { name: "Admin", bg: "#F0F0F0" },
  { name: "Reviewer (Writer)", bg: "#F0F0F0" },
  { name: "Reviewer (Verifier)", bg: "#F0F0F0" },
  { name: "Reviewer (Approver)", bg: "#F0F0F0" },
  { name: "Creators", bg: "#F0F0F0" },
  { name: "Collaborators", bg: "#F0F0F0" },
];

export const PermissionsTab = () => {
  return (
    <div className="flex flex-col gap-[24px] w-full">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-[24px] font-medium text-[#202020] tracking-[-0.48px] leading-[32px]">Roles &amp; Permissions</h3>
          <p className="text-[16px] font-normal text-[#606060] leading-[24px]">Manage team members, assign roles, and control access levels</p>
        </div>
        <button className="bg-[#0063EF] flex items-center gap-[8px] h-[40px] px-[24px] py-[12px] rounded-[8px] hover:bg-[#0052CC] transition-colors cursor-pointer">
          <Add variant="Linear" size={20} color="#FDFDFD" />
          <span className="text-[14px] font-normal text-[#FDFDFD] tracking-[-0.28px] leading-[20px]">Add role</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-[16px]">
        {roleCards.map((role) => (
          <div key={role.name} className="border border-[#E8E8E8] rounded-[12px] p-[13px] w-[194px]">
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-normal text-[#202020] tracking-[-0.28px] leading-[20px]">{role.name}</span>
              <More variant="Linear" size={24} color="#606060" className="cursor-pointer" />
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[813px]">
          <div className="flex border-b border-[#F0F0F0]">
            <div className="w-[120px] shrink-0" />
            {roles.map((role) => (
              <div key={role} className="flex-1 px-[12px] py-[8px]">
                <span className="text-[14px] font-normal text-[#202020] tracking-[-0.28px] leading-[24px]">{role}</span>
              </div>
            ))}
          </div>

          {permissionSections.map((section) => (
            <div key={section.label} className="border-b border-[#F0F0F0] py-[16px]">
              <span className="text-[14px] font-medium text-[#202020] tracking-[-0.28px] leading-[20px] block mb-[12px]">{section.label}</span>
              {section.items.map((item) => (
                <div key={item.label} className="flex items-center py-[6px]">
                  <div className="w-[120px] shrink-0">
                    <span className="text-[12px] font-normal text-[#606060] tracking-[-0.24px] leading-[16px]">{item.label}</span>
                  </div>
                  {item.roles.map((hasAccess, i) => (
                    <div key={i} className="flex-1 px-[12px]">
                      {hasAccess ? (
                        <div className="border border-[#F0F0F0] rounded-[6px] px-[12px] py-[8px] inline-flex items-center gap-[6px] bg-white hover:bg-sd-grey-1 transition-colors cursor-pointer">
                          <span className="text-[12px] font-normal text-[#202020] tracking-[-0.24px] leading-[16px]">{item.label}</span>
                          <TickCircle variant="Bold" size={16} color="#008500" />
                        </div>
                      ) : (
                        <div className="text-transparent select-none">—</div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button className="bg-[#0063EF] text-white flex items-center gap-[8px] h-[44px] px-[32px] py-[12px] rounded-[8px] hover:bg-[#0052CC] transition-colors cursor-pointer text-[14px] font-normal">
          Save Changes
        </button>
      </div>
    </div>
  );
};
