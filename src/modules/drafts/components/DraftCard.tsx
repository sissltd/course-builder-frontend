"use client";

import React from "react";
import Image from "next/image";
import { More } from "iconsax-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/shared/Button";

export interface Draft {
  id: string;
  title: string;
  description: string;
  date: string;
  thumbnail: string;
}

interface DraftCardProps {
  draft: Draft;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onPreview?: (id: string) => void;
}

export const DraftCard = ({ draft, onEdit, onDelete, onPreview }: DraftCardProps) => {
  return (
    <div className="bg-[#f8f8f8] border border-[#d9d9d9] rounded-[12px] overflow-hidden flex flex-col group transition-all hover: h-full">
      {/* Thumbnail */}
      <div className="h-[153px] relative overflow-hidden bg-sd-grey-3">
        <Image
          src={draft.thumbnail}
          alt={draft.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-[12px] flex flex-col gap-[8px] flex-1">
        <h3 className="text-[16px] font-semibold text-[#202020] leading-[24px] tracking-[-0.32px] line-clamp-1">
          {draft.title}
        </h3>
        <p className="text-[14px] text-[#636363] leading-[20px] tracking-[-0.28px] line-clamp-2 min-h-[40px]">
          {draft.description}
        </p>
      </div>

      {/* Footer */}
      <div className="border-t border-[#f0f0f0] p-[12px] flex items-center justify-between mt-auto">
        <span className="text-[14px] text-[#636363] leading-[20px] tracking-[-0.28px]">
          {draft.date}
        </span>
        
        <div className="flex items-center gap-[12px]">
          <button
            onClick={() => onEdit?.(draft.id)}
            className="h-[32px] px-[12px] rounded-full border border-[#d9d9d9] text-[14px] font-normal text-[#202020] tracking-[-0.28px] hover:bg-white transition-colors"
          >
            Continue editing
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 rounded-full hover:bg-sd-grey-2 transition-colors outline-none">
                <More size={24} variant="Linear" color="#636363" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px] bg-white border border-[#F0F0F0] rounded-[12px] p-[8px] ">
              <DropdownMenuItem 
                className="p-[8px] rounded-[8px] text-[14px] text-[#606060] cursor-pointer hover:bg-[#F5F5F5] focus:bg-[#F5F5F5] outline-none"
                onClick={() => onPreview?.(draft.id)}
              >
                Preview
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="p-[8px] rounded-[8px] text-[14px] text-[#606060] cursor-pointer hover:bg-[#F5F5F5] focus:bg-[#F5F5F5] outline-none"
                onClick={() => onEdit?.(draft.id)}
              >
                Edit draft
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="p-[8px] rounded-[8px] text-[14px] text-[#FF5025] cursor-pointer hover:bg-[#FFF0ED] focus:bg-[#FFF0ED] outline-none"
                onClick={() => onDelete?.(draft.id)}
              >
                Delete draft
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
