"use client";

import React from "react";
import { SideDrawer } from "@/components/shared/SideDrawer";
import { Copy, Book } from "iconsax-react";

interface PublishedCourse {
  id: string;
  title: string;
  creator: string;
  creatorId: string;
  courseId: string;
  category: string;
  difficulty: string;
  source: string;
  priceSoluDesks: string;
  priceCoursera: string;
  priceUdemy: string;
  approvedBy: string;
  dateApproved: string;
  dateCreated: string;
}

interface PublishedDetailsDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  course: PublishedCourse | null;
}

const InfoRow = ({ label, value, onCopy }: { label: string; value: string; onCopy?: () => void }) => (
  <div className="flex items-center justify-between w-full">
    <span className="text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px]">{label}</span>
    <div className="flex items-center gap-[8px]">
      <span className="text-[16px] text-[#202020] tracking-[-0.32px] leading-[24px]">{value}</span>
      {onCopy && (
        <button onClick={onCopy} className="cursor-pointer hover:text-[#0063EF] transition-colors">
          <Copy variant="Linear" size={20} color="#606060" />
        </button>
      )}
    </div>
  </div>
);

export const PublishedDetailsDrawer = ({ isOpen, onOpenChange, course }: PublishedDetailsDrawerProps) => {
  if (!course) return null;

  return (
    <SideDrawer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Course Information"
    >
      {/* COURSE INFORMATION */}
      <div className="flex flex-col gap-[16px] pb-[20px] border-b border-[#E8E8E8]">
        <span className="text-[14px] font-medium text-[#202020] tracking-[-0.28px] leading-[20px]">COURSE INFORMATION</span>
        <InfoRow label="Course Title" value={course.title} />
        <InfoRow label="Category" value={course.category} />
        <InfoRow label="Difficulty Level" value={course.difficulty} />
        <InfoRow label="Course ID" value={course.courseId} onCopy={() => navigator.clipboard.writeText(course.courseId)} />
        <InfoRow label="Source" value={course.source} />
      </div>

      {/* OWNER'S INFORMATION */}
      <div className="flex flex-col gap-[16px] py-[20px] border-b border-[#E8E8E8]">
        <span className="text-[14px] font-medium text-[#202020] tracking-[-0.28px] leading-[20px]">OWNER'S INFORMATION</span>
        <InfoRow label="Creator" value={course.creator} />
        <InfoRow label="User ID" value={course.creatorId} onCopy={() => navigator.clipboard.writeText(course.creatorId)} />
        <InfoRow label="Date Created" value={course.dateCreated} />
      </div>

      {/* PRICE INFORMATION */}
      <div className="flex flex-col gap-[16px] pt-[20px]">
        <span className="text-[14px] font-medium text-[#202020] tracking-[-0.28px] leading-[20px]">PRICE INFORMATION</span>
        <div className="flex flex-col gap-[12px]">
          <div className="flex items-center gap-[16px] p-[12px] bg-[#F9FAFB] rounded-[8px]">
            <div className="size-[40px] bg-[#EBF3FF] rounded-[8px] flex items-center justify-center shrink-0">
              <Book variant="Linear" size={22} color="#0063EF" />
            </div>
            <div>
              <p className="text-[14px] text-[#202020] leading-[20px]">SoluDesks</p>
              <p className="text-[16px] font-medium text-[#202020] leading-[24px]">{course.priceSoluDesks}</p>
            </div>
          </div>
          <div className="flex items-center gap-[16px] p-[12px] bg-[#F9FAFB] rounded-[8px]">
            <div className="size-[40px] bg-[#FFF5ED] rounded-[8px] flex items-center justify-center shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#F05A25"/>
                <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" fill="white" opacity="0.4"/>
              </svg>
            </div>
            <div>
              <p className="text-[14px] text-[#202020] leading-[20px]">Coursera Marketplace</p>
              <p className="text-[16px] font-medium text-[#202020] leading-[24px]">{course.priceCoursera}</p>
            </div>
          </div>
          <div className="flex items-center gap-[16px] p-[12px] bg-[#F9FAFB] rounded-[8px]">
            <div className="size-[40px] bg-[#F0F0F0] rounded-[8px] flex items-center justify-center shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="4" width="20" height="16" rx="2" fill="#636363" opacity="0.3"/>
                <path d="M8 8h8M8 12h8M8 16h5" stroke="#636363" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <p className="text-[14px] text-[#202020] leading-[20px]">Udemy Marketplace</p>
              <p className="text-[16px] font-medium text-[#202020] leading-[24px]">{course.priceUdemy}</p>
            </div>
          </div>
        </div>
      </div>
    </SideDrawer>
  );
};
