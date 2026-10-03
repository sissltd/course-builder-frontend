"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  I24Support,
  Menu,
  Notification,
  SearchNormal1,
  Setting2,
  Timer,
} from "iconsax-react";
import { ReviewerRoute } from "@/lib/routes";
import { GlobalSearch } from "@/components/shared/GlobalSearch";

interface ReviewerHeaderProps {
  title?: string;
  onToggleSidebar?: () => void;
}

export const ReviewerHeader = ({
  title = "REVIEWER DASHBOARD",
  onToggleSidebar,
}: ReviewerHeaderProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="h-[59px] bg-sd-grey-1 border-b border-sd-grey-3 flex items-center px-[12px] md:px-[40px] sticky top-0 z-30 ml-0 md:ml-[237px] gap-[10px]">
      <button
        onClick={onToggleSidebar}
        className="md:hidden hover:bg-sd-grey-2 rounded-lg transition-colors cursor-pointer shrink-0 flex items-center justify-center size-[32px]"
        aria-label="Toggle sidebar"
      >
        <Menu variant="Linear" size={20} color="var(--sd-reviewer-muted)" />
      </button>

      {!isSearchOpen && (
        <div className="border-r border-sd-muted-text pr-[8px] flex items-center justify-center">
          <span className="text-[14px] font-medium text-sd-grey-12 tracking-[-0.28px] leading-[20px] whitespace-nowrap">
            {title}
          </span>
        </div>
      )}

      {!isSearchOpen && (
        <div className="hidden w-[142px] items-center gap-[8px] sm:flex">
          <Timer variant="Bulk" size={18} color="var(--sd-reviewer-orange)" />
          <span className="text-[14px] font-normal text-sd-reviewer-muted tracking-[-0.28px] leading-[20px] whitespace-nowrap">
            05:32:04 min
          </span>
        </div>
      )}

      <div className="flex flex-1 items-center justify-end gap-[12px] min-w-0">
        {isSearchOpen ? (
          <GlobalSearch
            workspace="reviewer"
            placeholder="Search courses"
            autoFocus
            onClose={() => setIsSearchOpen(false)}
            className="w-full max-w-[420px] animate-in fade-in slide-in-from-right-2"
          />
        ) : (
          <>
            <Link
              href={`${ReviewerRoute.HELP}?tab=support`}
              aria-label="Open help and support"
              className="hidden sm:flex items-center gap-[8px] border border-sd-grey-3 rounded-[6px] px-[8px] py-[4px] h-[32px] hover:bg-sd-grey-2 transition-colors cursor-pointer"
            >
              <I24Support variant="Linear" size={20} color="var(--sd-reviewer-muted)" />
              <span className="text-[12px] font-normal text-sd-reviewer-muted tracking-[-0.24px] leading-[16px] whitespace-nowrap">
                Help and support
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Open search"
              className="border border-sd-grey-3 rounded-[6px] p-[4px] size-[32px] flex items-center justify-center hover:bg-sd-grey-2 transition-colors cursor-pointer"
            >
              <SearchNormal1
                variant="Linear"
                size={20}
                color="var(--sd-reviewer-muted)"
              />
            </button>

            <Link
              href={ReviewerRoute.NOTIFICATIONS}
              aria-label="Open notifications"
              className="border border-sd-grey-3 rounded-[6px] p-[4px] size-[32px] flex items-center justify-center hover:bg-sd-grey-2 transition-colors cursor-pointer"
            >
              <Notification variant="Linear" size={20} color="var(--sd-reviewer-muted)" />
            </Link>

            <Link
              href={ReviewerRoute.SETTINGS}
              aria-label="Open settings"
              className="border border-sd-grey-3 rounded-[6px] p-[4px] size-[32px] flex items-center justify-center hover:bg-sd-grey-2 transition-colors cursor-pointer"
            >
              <Setting2 variant="Linear" size={20} color="var(--sd-reviewer-muted)" />
            </Link>
          </>
        )}
      </div>
    </header>
  );
};
