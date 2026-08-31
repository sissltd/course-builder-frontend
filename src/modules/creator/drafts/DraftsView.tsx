"use client";

import React, { useState } from "react";
import { SearchNormal1, Sort, ArrowDown2 } from "iconsax-react";
import { DraftCard } from "./components/DraftCard";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetCoursesQuery } from "@/modules/creator/courses/hooks";
import { CourseStatus } from "@/modules/creator/courses/types";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { CreatorRoute } from "@/lib/routes";
import { Button } from "@/components/shared/Button";
import { CloseCircle } from "iconsax-react";

export const DraftsView = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Last modified");

  const { data: response, isLoading, error } = useGetCoursesQuery({
    status: CourseStatus.DRAFT,
    size: 50,
    ...(search && { search }),
  });

  const courses = response?.data?.results ?? [];

  const drafts = courses.map((course) => ({
    id: course.id,
    title: course.title,
    description: "",
    date: format(new Date(course.created_datetime), "d MMM yyyy"),
    thumbnail: "/assets/drafts/draft-thumb-1.png",
  }));

  const handleDelete = (id: string) => {
    console.log("Delete draft", id);
  };

  const handleEdit = (id: string) => {
    router.push(`${CreatorRoute.COURSES_BUILDER}?id=${id}`);
  };

  const handlePreview = (id: string) => {
    console.log("Preview draft", id);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <CloseCircle size={48} variant="Bulk" color="#FF5025" />
        <p className="text-[16px] text-[#606060]">
          Failed to load drafts. Please try again.
        </p>
        <Button
          variant="app-primary"
          onClick={() => window.location.reload()}
          className="h-[40px]"
        >
          Retry
        </Button>
      </div>
    );
  }

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
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-sd-grey-3 border-t-sd-blue" />
        </div>
      ) : drafts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[16px]">
          {drafts.map((draft) => (
            <DraftCard
              key={draft.id}
              draft={draft}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onPreview={handlePreview}
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
            <p className="text-[12px] text-[#606060] tracking-[0] w-full max-w-[366px]">
              Your unpublished courses will appear here
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
