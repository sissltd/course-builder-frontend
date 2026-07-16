"use client";

import React, { useState } from "react";
import { SearchNormal1, Sort, ArrowDown2, FolderOpen } from "iconsax-react";
import { DraftCard, Draft } from "./components/DraftCard";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const initialDrafts: Draft[] = [
  {
    id: "1",
    title: "How to create with AI",
    description: "This video will teach you how to create your course using ai",
    date: "3 April 2026",
    thumbnail: "/assets/drafts/draft-thumb-1.png",
  },
  {
    id: "2",
    title: "Mastering AI in Design",
    description: "Explore techniques to enhance your design workflow with AI tools.",
    date: "3 April 2026",
    thumbnail: "/assets/drafts/draft-thumb-1.png",
  },
  {
    id: "3",
    title: "AI for Content Creation",
    description: "Learn how to generate engaging content effortlessly using artificial intelligence.",
    date: "3 April 2026",
    thumbnail: "/assets/drafts/draft-thumb-1.png",
  },
  {
    id: "4",
    title: "Advanced Prompt Engineering",
    description: "Master the art of crafting perfect prompts for various AI models.",
    date: "4 April 2026",
    thumbnail: "/assets/drafts/draft-thumb-1.png",
  },
  {
    id: "5",
    title: "AI-Powered Marketing",
    description: "Leverage AI to supercharge your marketing campaigns and reach.",
    date: "5 April 2026",
    thumbnail: "/assets/drafts/draft-thumb-1.png",
  },
];

export const DraftsView = () => {
  const [drafts, setDrafts] = useState<Draft[]>(initialDrafts);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Last modified");

  const filteredDrafts = drafts.filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setDrafts((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="flex flex-col gap-[24px]">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-[16px]">
        <div className="relative w-full max-w-[308px]">
          <SearchNormal1
            size={20}
            variant="Linear"
            color="#B6B6B6"
            className="absolute left-[16px] top-1/2 -translate-y-1/2 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search draft"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-[40px] pl-[44px] pr-[16px] border border-[#D9D9D9] rounded-[8px] text-[14px] text-[#202020] placeholder:text-[#B6B6B6] bg-white outline-none focus:border-[#0063EF] transition-colors"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-[8px] px-[16px] py-[10px] border border-[#D9D9D9] rounded-[8px] bg-white hover:bg-sd-grey-1 transition-colors h-[40px] outline-none">
              <Sort size={20} variant="Linear" color="#606060" />
              <span className="text-[14px] text-[#606060] font-medium tracking-[-0.28px]">
                {sortBy}
              </span>
              <ArrowDown2 size={20} variant="Linear" color="#606060" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px] bg-white border border-[#F0F0F0] rounded-[12px] p-[8px] ">
            {["Last modified", "Date created", "Newest first", "Oldest first"].map((option) => (
              <DropdownMenuItem
                key={option}
                onClick={() => setSortBy(option)}
                className="p-[8px] rounded-[8px] text-[14px] text-[#606060] cursor-pointer hover:bg-[#F5F5F5] focus:bg-[#F5F5F5] outline-none"
              >
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Grid */}
      {filteredDrafts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[16px]">
          {filteredDrafts.map((draft) => (
            <DraftCard
              key={draft.id}
              draft={draft}
              onDelete={handleDelete}
              onEdit={(id) => console.log("Edit", id)}
              onPreview={(id) => console.log("Preview", id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-[100px] gap-[24px]">
          <div className="relative size-[72px]">
            <Image
              src="/assets/drafts/empty-drafts.png"
              alt="Empty drafts"
              fill
              className="object-contain"
            />
          </div>
          <div className="flex flex-col items-center gap-[8px] text-center">
            <h3 className="text-[20px] font-medium text-[#202020] tracking-[0]">Drafts</h3>
            <p className="text-[12px] text-[#606060] tracking-[0] w-[366px]">
              Your unpublished courses will appear here
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
