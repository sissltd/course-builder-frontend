"use client";

import React, { useState } from "react";
import { SideDrawer } from "@/components/shared/SideDrawer";
import { TabBar } from "@/components/shared/TabBar";
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
} from "iconsax-react";

interface TeamMember {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: string;
  date: string;
  status: string;
  userId: string;
}

type Tab = "overview" | "activities" | "analytics" | "ip-log" | "settings";

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

const CopyButton = () => (
  <Copy variant="Linear" size={14} color="#606060" className="cursor-pointer shrink-0 hover:text-[#0063EF]" />
);

interface TeamMemberDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  member: TeamMember | null;
}

export const TeamMemberDrawer = ({ isOpen, onOpenChange, member }: TeamMemberDrawerProps) => {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  if (!member) return null;

  return (
    <SideDrawer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Team member information"
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
              <span className="inline-flex items-center px-[8px] py-[2px] rounded-[6px] bg-[#F1F8F2] text-[#3C7E44] text-[12px] font-normal leading-[16px]">
                Active
              </span>
            </div>
            <span className="text-[14px] text-[#606060] leading-[20px]">{member.email}</span>
          </div>
        </div>
      </div>

      <TabBar tabs={tabs} activeKey={activeTab} onChange={(key) => setActiveTab(key as Tab)} />

      {/* Overview Content */}
      {activeTab === "overview" && (
        <div className="flex flex-col gap-[32px] pt-[24px]">
          {/* Personal Info */}
          <div className="flex flex-col gap-[20px]">
            <InfoRow icon={<Briefcase variant="Linear" size={20} color="#606060" />}>
              <span className="text-[14px] text-[#202020] leading-[20px]">{member.role}</span>
            </InfoRow>
            <InfoRow icon={<Global variant="Linear" size={20} color="#606060" />}>
              <span className="text-[14px] text-[#202020] leading-[20px]">Nigerian</span>
            </InfoRow>
            <InfoRow icon={<Mobile variant="Linear" size={20} color="#606060" />}>
              <span className="text-[14px] text-[#202020] leading-[20px]">+234 901234567</span>
              <CopyButton />
            </InfoRow>
            <InfoRow icon={<DirectInbox variant="Linear" size={20} color="#606060" />}>
              <span className="text-[14px] text-[#202020] leading-[20px]">{member.email}</span>
              <CopyButton />
            </InfoRow>
            <InfoRow icon={<UserOctagon variant="Linear" size={20} color="#606060" />}>
              <span className="text-[14px] text-[#202020] leading-[20px]">{member.userId}</span>
              <CopyButton />
            </InfoRow>
            <InfoRow icon={<Calendar2 variant="Linear" size={20} color="#606060" />}>
              <span className="text-[14px] text-[#202020] leading-[20px]">{member.date}</span>
            </InfoRow>
          </div>

          {/* Activity */}
          <div className="flex flex-col gap-[16px]">
            <div className="flex items-center gap-[8px]">
              <TickCircle variant="Linear" size={20} color="#202020" />
              <span className="text-[16px] font-semibold text-[#202020] leading-[24px]">Activity</span>
            </div>
            <div className="flex flex-col gap-[12px]">
              {[
                { icon: <Book variant="Linear" size={20} color="#0063EF" />, title: "Approve Course", desc: "Introduction to computer", time: "15 minutes ago" },
                { icon: <Book variant="Linear" size={20} color="#0063EF" />, title: "Approved Course", desc: "Python Learning and Computing", time: "15 minutes ago" },
                { icon: <Book variant="Linear" size={20} color="#0063EF" />, title: "Approved Course", desc: "Python Learning and Computing", time: "15 minutes ago" },
                { icon: <LoginCurve variant="Linear" size={20} color="#0063EF" />, title: "Logged in", desc: "Introduction to computer", time: "15 minutes ago" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-[12px]">
                  <div className="size-[40px] bg-[#EBF3FF] rounded-[8px] flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-[#202020] leading-[20px]">{item.title}</p>
                    <p className="text-[12px] text-[#606060] leading-[16px] truncate">{item.desc}</p>
                  </div>
                  <span className="text-[12px] text-[#A0A0A0] leading-[16px] shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Analytics */}
          <div className="flex flex-col gap-[16px]">
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

          {/* IP Address & Log */}
          <div className="flex flex-col gap-[16px]">
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
                <div className="flex items-center gap-[8px]">
                  <div>
                    <p className="text-[14px] text-[#202020] leading-[20px]">IP Address</p>
                    <p className="text-[12px] text-[#606060] leading-[16px]">192.127.001.001</p>
                  </div>
                  <span className="inline-flex items-center px-[8px] py-[2px] rounded-[6px] bg-[#F1F8F2] text-[#3C7E44] text-[12px] font-normal leading-[16px]">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-[12px] pb-[24px]">
            <button className="flex-1 h-[48px] bg-[#0063EF] text-white text-[14px] font-medium rounded-[8px] hover:bg-[#0052CC] transition-colors cursor-pointer">
              Suspend account
            </button>
            <button className="flex-1 h-[48px] border border-[#D9D9D9] text-[#606060] text-[14px] font-medium rounded-[8px] hover:bg-[#F5F5F5] transition-colors cursor-pointer">
              Remove member
            </button>
          </div>
        </div>
      )}

      {/* Placeholder content for inactive tabs */}
      {activeTab !== "overview" && (
        <div className="flex items-center justify-center h-[200px] text-[14px] text-[#A0A0A0]">
          {activeTab === "activities" && "Activities"
          || activeTab === "analytics" && "Analytics"
          || activeTab === "ip-log" && "IP Address & Log"
          || "Settings"} tab content
        </div>
      )}
    </SideDrawer>
  );
};
