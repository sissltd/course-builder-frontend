"use client";

import React, { useState } from "react";
import { SearchNormal1 } from "iconsax-react";
import Image from "next/image";

interface KnowledgeBaseCategoryPageProps {
  category: string;
  onArticleSelect?: (articleId: string) => void;
}

const articles = [
  { id: "1", title: "How to structure a course; module and lessons", type: "Watch and learn" },
  { id: "2", title: "How to pass the plagiarism check", type: "Watch and learn" },
  { id: "3", title: "Script writing standards", type: "Watch and learn" },
  { id: "4", title: "Quiz and assessment requirements", type: "Watch and learn" },
  { id: "5", title: "Video and media requirements", type: "Watch and learn" },
  { id: "6", title: "Setting up your account", type: "Watch and learn" },
  { id: "7", title: "Subtitle and caption guide", type: "Watch and learn" },
  { id: "8", title: "Setting up your account", type: "Watch and learn" },
];

const categoryLabels: Record<string, string> = {
  "course-creation": "Course creation",
  "submission-review": "Submission & review",
  "topic-reservation": "Topic reservation",
  "wallet-payments": "Wallet & payments",
  "creator-tier-pricing": "Creator tier pricing",
  "draft-management": "Draft management",
  onboarding: "Onboarding & getting started",
};

export const KnowledgeBaseCategoryPage = ({
  category,
  onArticleSelect,
}: KnowledgeBaseCategoryPageProps) => {
  const [search, setSearch] = useState("");
  const label = categoryLabels[category] || category;

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center w-full py-[40px] px-[20px]">
      <div className="w-full max-w-[700px] flex flex-col gap-[32px]">
        <h1 className="text-[28px] font-semibold text-[#202020] text-center leading-[36px]">
          {label}
        </h1>

        <div className="border border-[#D9D9D9] rounded-[8px] flex items-center gap-[12px] px-[16px] py-[10px] w-full">
          <SearchNormal1 size={20} color="#B6B6B6" variant="Linear" />
          <input
            type="text"
            placeholder="Search knowledge base"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-[16px] text-[#B6B6B6] leading-[24px] outline-none bg-transparent w-full placeholder:text-[#B6B6B6]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[32px] gap-y-[8px]">
          {filteredArticles.map((article) => (
            <button
              key={article.id}
              onClick={() => onArticleSelect?.(article.id)}
              className="flex items-center gap-[12px] p-[12px] rounded-[8px] hover:bg-sd-grey-1 transition-colors text-left"
            >
              <div className="border-[1.067px] border-[#0A60E1] rounded-full size-[40px] flex items-center justify-center p-[10px] shrink-0">
                <Image
                  src="/assets/help/document-text.svg"
                  alt="Article"
                  width={20}
                  height={20}
                  className="shrink-0"
                />
              </div>
              <div className="flex flex-col gap-[4px] min-w-0">
                <span className="text-[16px] text-[#1E1E1E] tracking-[-0.32px] leading-[24px] truncate">
                  {article.title}
                </span>
                <span className="text-[14px] text-[#6C6C6C] tracking-[-0.28px] leading-[20px]">
                  {article.type}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
