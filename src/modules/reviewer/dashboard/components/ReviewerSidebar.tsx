"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ReviewerRoute } from "@/lib/routes";
import {
  Activity,
  CloseCircle,
  Eye,
  Global,
  Home2,
  More,
  Logout,
  Notification,
  Setting2,
  TaskSquare,
  TickCircle,
} from "iconsax-react";

const reviewerLinks = [
  { name: "Overview", href: ReviewerRoute.DASHBOARD, icon: Home2 },
  { name: "Pending", href: ReviewerRoute.PENDING, icon: TaskSquare, count: 20 },
  { name: "Approved Courses", href: ReviewerRoute.APPROVED_COURSES, icon: TickCircle },
  { name: "In review", href: ReviewerRoute.IN_REVIEW, icon: Eye },
  { name: "Published Courses", href: ReviewerRoute.PUBLISHED_COURSES, icon: Global },
];

const systemLinks = [
  { name: "Activity log", href: ReviewerRoute.ACTIVITY_LOG, icon: Activity },
  { name: "Notification", href: ReviewerRoute.NOTIFICATIONS, icon: Notification },
];

const bottomLinks = [
  { name: "Setting", href: ReviewerRoute.SETTINGS, icon: Setting2 },
];

interface ReviewerSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReviewerSidebar = ({ isOpen, onClose }: ReviewerSidebarProps) => {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "w-[237px] h-screen bg-sd-grey-12 flex flex-col fixed left-0 top-0 z-40 overflow-y-auto transition-transform duration-300",
          "[&::-webkit-scrollbar]:w-[6px] md:[&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-sd-grey-11 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-sd-grey-10",
          "md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col gap-[22px] w-full px-[8px] pb-[8px] min-h-full">
          <div className="flex h-[59px] items-center px-[11px] py-[12px] w-full">
            <div className="relative w-[136px] h-[36px] overflow-hidden">
              <Image
                src="/assets/auth/logo.png"
                alt="SoluDesk"
                fill
                className="object-contain scale-[2]"
              />
            </div>
            <button
              onClick={onClose}
              className="md:hidden ml-auto p-1 text-sd-reviewer-muted hover:text-sd-grey-1 transition-colors cursor-pointer"
              aria-label="Close sidebar"
            >
              <CloseCircle variant="Linear" size={20} color="currentColor" />
            </button>
          </div>

          <div className="flex flex-col gap-[16px] w-full">
            <div className="flex flex-col gap-[8px] w-full">
              <div className="flex h-[24px] items-center py-[10px] w-full">
                <span className="text-[12px] font-medium text-sd-reviewer-muted leading-[16px]">
                  Main Menu
                </span>
              </div>
              <div className="flex flex-col w-full">
                {reviewerLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.href);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex h-[36px] items-center justify-between gap-[8px] px-[8px] py-[8px] rounded-[8px]",
                        active
                          ? "bg-sd-grey-3 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1)]"
                          : "",
                      )}
                    >
                      <span className="flex min-w-0 items-center gap-[8px]">
                        <Icon
                          variant={active ? "Bold" : "Linear"}
                          size={20}
                          color={active ? "var(--sd-grey-12)" : "var(--sd-reviewer-muted)"}
                        />
                        <span
                          className={cn(
                            "text-[14px] tracking-[-0.28px] leading-[20px] truncate",
                            active
                              ? "font-medium text-sd-grey-12"
                              : "font-normal text-sd-reviewer-muted",
                          )}
                        >
                          {link.name}
                        </span>
                      </span>
                      {link.count && (
                        <span className="flex h-[20px] w-[24px] items-center justify-center rounded-[4px] bg-sd-grey-11 text-[10px] font-medium text-sd-muted-text leading-[16px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.1)]">
                          {link.count}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-[8px] w-full">
              <div className="border-b-[0.5px] border-sd-grey-11 flex h-[24px] items-center py-[10px] w-full">
                <span className="text-[12px] font-medium text-sd-reviewer-muted leading-[16px]">
                  System
                </span>
              </div>
              <div className="flex flex-col w-full">
                {systemLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.href);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex h-[36px] items-center gap-[8px] px-[8px] py-[8px] rounded-[8px]",
                        active
                          ? "bg-sd-grey-3 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1)]"
                          : "",
                      )}
                    >
                      <Icon
                        variant={active ? "Bold" : "Linear"}
                        size={20}
                        color={active ? "var(--sd-grey-12)" : "var(--sd-reviewer-muted)"}
                      />
                      <span
                        className={cn(
                          "text-[14px] tracking-[-0.28px] leading-[20px]",
                          active
                            ? "font-medium text-sd-grey-12"
                            : "font-normal text-sd-reviewer-muted",
                        )}
                      >
                        {link.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-auto flex w-full flex-col gap-[12px] mb-[24px]">
            <div className="flex flex-col w-full">
              {bottomLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex h-[36px] items-center gap-[8px] px-[8px] py-[8px] rounded-[8px]",
                      active
                        ? "bg-sd-grey-3 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1)]"
                        : "",
                    )}
                  >
                    <Icon
                      variant={active ? "Bold" : "Linear"}
                      size={20}
                      color={active ? "var(--sd-grey-12)" : "var(--sd-reviewer-muted)"}
                    />
                    <span
                      className={cn(
                        "text-[14px] tracking-[-0.28px] leading-[20px]",
                        active
                          ? "font-medium text-sd-grey-12"
                          : "font-normal text-sd-reviewer-muted",
                      )}
                    >
                      {link.name}
                    </span>
                  </Link>
                );
              })}
              <button className="flex h-[36px] items-center gap-[8px] px-[8px] py-[8px] rounded-[8px] cursor-pointer">
                <Logout variant="Linear" size={20} color="var(--sd-reviewer-muted)" />
                <span className="text-[14px] font-normal text-sd-reviewer-muted tracking-[-0.28px] leading-[20px]">
                  Sign out
                </span>
              </button>
            </div>

            <button className="bg-sd-grey-11 hover:bg-sd-grey-10 transition-colors flex flex-col p-[8px] rounded-[12px] w-full cursor-pointer text-left">
              <div className="flex items-center justify-between gap-[8px] w-full">
                <div className="flex items-center gap-[9px] min-w-0">
                  <div className="relative size-[36px] rounded-[8px] overflow-hidden shrink-0">
                    <Image
                      src="/assets/reviewer/reviewer-avatar.jpg"
                      alt="Osaite Emmanuel"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-[4px] min-w-0 w-[100px]">
                    <span className="text-[12px] font-medium text-sd-white leading-[16px] truncate">
                      Osaite Emmanuel
                    </span>
                    <span className="text-[12px] text-sd-muted-text leading-[16px] truncate">
                      Reviewer
                    </span>
                  </div>
                </div>
                <More
                  variant="Linear"
                  size={20}
                  color="var(--sd-muted-text)"
                  className="rotate-90 shrink-0"
                />
              </div>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
