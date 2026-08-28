"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { AdminRoute } from "@/lib/routes";

interface WorkspaceLink {
  href: string;
  label: string;
  description: string;
}

const LINKS: WorkspaceLink[] = [
  {
    href: AdminRoute.MIE_RECOMMENDATION,
    label: "Submissions",
    description: "Review course ideas and record decisions",
  },
  {
    href: AdminRoute.MIE_DEVELOPERS,
    label: "Developers",
    description: "Onboard accounts and issue API keys",
  },
  {
    href: AdminRoute.MIE_REJECTION_REASONS,
    label: "Rejection reasons",
    description: "The taxonomy every rejection draws from",
  },
];

/**
 * Segmented nav across the three MIE admin surfaces. The submissions queue owns
 * the parent route, so it only lights up on an exact match.
 */
export const MieWorkspaceNav = () => {
  const pathname = usePathname();

  return (
    <div className="flex w-fit items-center gap-[4px] rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 p-[4px]">
      {LINKS.map((link) => {
        const active =
          link.href === AdminRoute.MIE_RECOMMENDATION
            ? pathname === link.href
            : pathname === link.href || pathname?.startsWith(`${link.href}/`);

        return (
          <Link
            key={link.href}
            href={link.href}
            title={link.description}
            className={cn(
              "flex h-[36px] items-center rounded-[8px] px-[16px] text-[14px] leading-[20px] tracking-[-0.28px] transition-colors",
              active
                ? "bg-white font-medium text-sd-grey-12 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.08)]"
                : "text-sd-grey-11 hover:bg-sd-grey-2",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
};

/** Page header shared by the three MIE surfaces. */
export const MieWorkspaceHeader = ({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}) => (
  <div className="flex flex-col gap-[16px]">
    <div className="flex flex-wrap items-start justify-between gap-[16px]">
      <div className="flex flex-col gap-[4px]">
        <h1 className="text-[24px] font-semibold leading-[32px] tracking-[-0.48px] text-sd-grey-12">
          {title}
        </h1>
        <p className="text-[14px] leading-[20px] tracking-[-0.28px] text-sd-grey-11">
          {subtitle}
        </p>
      </div>
      {action}
    </div>
    <MieWorkspaceNav />
  </div>
);
