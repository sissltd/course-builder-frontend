"use client";

import React, { useState } from "react";
import Image from "next/image";
import { SearchNormal1 } from "iconsax-react";

export type KnowledgeBaseCategory =
  | "course-creation"
  | "submission-review"
  | "topic-reservation"
  | "wallet-payments"
  | "creator-tier-pricing"
  | "draft-management"
  | "onboarding";

interface KnowledgeBaseTabProps {
  onCategorySelect?: (category: KnowledgeBaseCategory) => void;
}

const categories: {
  id: KnowledgeBaseCategory;
  label: string;
  icon: string;
}[] = [
  { id: "course-creation", label: "Course creation", icon: "/assets/help/book.svg" },
  { id: "submission-review", label: "Submission & review", icon: "/assets/help/eye.svg" },
  { id: "topic-reservation", label: "Topic reservation", icon: "/assets/help/text.svg" },
  { id: "wallet-payments", label: "Wallet & payments", icon: "/assets/help/wallet.svg" },
  { id: "creator-tier-pricing", label: "Creator tier pricing", icon: "/assets/help/money.svg" },
  { id: "draft-management", label: "Draft management", icon: "/assets/help/folder.svg" },
  { id: "onboarding", label: "Onboarding & getting started", icon: "/assets/help/list-check.svg" },
];

export const KnowledgeBaseTab = ({
  onCategorySelect,
}: KnowledgeBaseTabProps) => {
  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col gap-[32px] w-full">
      <div className="flex flex-col gap-[12px]">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-[12px]">
            <h2 className="text-[24px] font-semibold text-[#202020] tracking-[-0.48px] leading-[32px]">
              Knowledge base
            </h2>
            <p className="text-[16px] text-[#606060] leading-[24px]">
              Browse through our category of popular questions
            </p>
          </div>
          <div className="border border-[#D9D9D9] rounded-[8px] flex items-center gap-[12px] px-[16px] py-[10px] w-[244px]">
            <SearchNormal1 size={20} color="#B6B6B6" variant="Linear" />
            <input
              type="text"
              placeholder="Search knowledge base"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-[16px] text-[#B6B6B6] leading-[24px] outline-none bg-transparent w-full placeholder:text-[#B6B6B6]"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-[24px]">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect?.(category.id)}
            className="flex flex-col items-center gap-[17px] p-[20px] rounded-[16px] hover:bg-sd-grey-1 transition-colors cursor-pointer"
          >
            <div className="border-[1.067px] border-[#0A60E1] rounded-full size-[40px] flex items-center justify-center p-[10px]">
              <Image
                src={category.icon}
                alt={category.label}
                width={20}
                height={20}
                className="shrink-0"
              />
            </div>
            <span className="text-[14px] text-[#606060] leading-[20px] tracking-[-0.28px] text-center">
              {category.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
