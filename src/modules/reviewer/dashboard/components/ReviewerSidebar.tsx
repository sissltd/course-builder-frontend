"use client";

import React, { useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useAppDispatch } from "@/redux";
import { clearAuth } from "@/redux/slices/authSlice";
import { serverLogout } from "@/modules/auth/actions/logout";
import { useLogoutMutation } from "@/modules/auth/api/sessionApi";
import { useGetMyProfileQuery } from "@/modules/auth/api/profileApi";
import { usePermissions } from "@/modules/auth/hooks/usePermissions";
import { useGetReviewerOverviewQuery } from "../hooks";
import { useGetReviewQueuePendingQuery } from "@/modules/reviewer/api/reviewQueueApi";
import {
  REVIEWER_ACCESS,
  canOpenReviewerEntry,
  type ReviewerAccessEntry,
} from "@/modules/reviewer/access";
import { cn } from "@/lib/utils";
import { ReviewerRoute } from "@/lib/routes";
import { toast } from "sonner";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CloseCircle, Logout, Setting2 } from "iconsax-react";

/*
  The links themselves now live in `@/modules/reviewer/access`, so the sidebar
  and the route guard cannot disagree about who may open what. This renders
  whichever entries the table allows — the badge is the only thing the table
  doesn't carry, so it is attached here.
*/
const SidebarLink = ({
  link,
  count,
  pathname,
}: {
  link: ReviewerAccessEntry;
  count?: number;
  pathname: string | null;
}) => {
  const Icon = link.icon;
  // Sub-routes (e.g. a course opened from a row) keep their parent lit.
  const active =
    pathname === link.href || (pathname?.startsWith(`${link.href}/`) ?? false);

  return (
    <Link
      href={link.href}
      className={cn(
        // `justify-between` unconditionally: with a badge it pins the count to
        // the right edge, and with one child the label still starts left.
        "flex h-[36px] items-center justify-between gap-[8px] px-[8px] py-[8px] rounded-[8px]",
        active ? "bg-sd-grey-3 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1)]" : "",
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
      {count !== undefined && count !== null && count > 0 && (
        <span className="flex h-[20px] min-w-[24px] px-[5px] items-center justify-center rounded-[4px] bg-sd-grey-11 text-[10px] font-medium text-sd-muted-text leading-[16px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.1)]">
          {count > 999 ? "999+" : count}
        </span>
      )}
    </Link>
  );
};

function formatRole(role?: string): string {
  switch (role?.toUpperCase()) {
    case "STAFF_WRITER":
      return "Reviewer (Writer)";
    case "STAFF_VERIFIER":
      return "Reviewer (Verifier)";
    case "STAFF_APPROVER":
      return "Reviewer (Approver)";
    case "AI_REVIEWER":
      return "AI Reviewer";
    case "QA_REVIEWER":
      return "QA Reviewer";
    case "REVIEWER":
      return "Reviewer";
    case "SUPER_ADMIN":
      return "Super Admin";
    case "ADMIN":
      return "Admin";
    case "COURSE_CREATOR":
      return "Course Creator";
    default:
      return role
        ? role.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
        : "Reviewer";
  }
}

interface ReviewerSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

/*
  The Overview row, hoisted so the skip below reads the same rule the nav does
  rather than restating the seat list.
*/
const OVERVIEW_ENTRY = REVIEWER_ACCESS.find(
  (entry) => entry.href === ReviewerRoute.DASHBOARD,
);

export const ReviewerSidebar = ({ isOpen, onClose }: ReviewerSidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const user = session?.user;

  const { canAny, role } = usePermissions();

  /*
    `/reviewer/overview/` is Creator Reviewer or Verifier only, enforced in the
    service layer. Approvers and QA Reviewers are full members of this dashboard
    but get a 403 from it, so the request is skipped for them rather than fired
    and discarded — the badge falls back to the pending-queue count below.
  */
  const canReadOverview =
    !OVERVIEW_ENTRY || canOpenReviewerEntry(OVERVIEW_ENTRY, canAny, role);

  const { data: profile, isLoading: isProfileLoading } = useGetMyProfileQuery();
  const { data: overview } = useGetReviewerOverviewQuery(undefined, {
    skip: !canReadOverview,
  });
  const { data: pendingData } = useGetReviewQueuePendingQuery();
  const [logoutApi, { isLoading: isLoggingOut }] = useLogoutMutation();

  const pendingCount =
    overview?.queue?.SUBMITTED ??
    pendingData?.data?.paginator?.count ??
    overview?.courses_in_queue;

  /*
    Filtered in render rather than stored, exactly as AdminSidebar does: `canAny`
    fails closed until the profile resolves, so the first paint legitimately has
    no permissions and the list fills in when they arrive — no effect, no flash
    of a remembered list.
  */
  const visible = useCallback(
    (group: ReviewerAccessEntry["group"]) =>
      REVIEWER_ACCESS.filter(
        (entry) =>
          entry.group === group &&
          canOpenReviewerEntry(entry, canAny, role),
      ),
    [canAny, role],
  );

  const reviewerLinks = useMemo(() => visible("review"), [visible]);
  const systemLinks = useMemo(() => visible("system"), [visible]);
  const bottomLinks = useMemo(() => visible("footer"), [visible]);

  const displayName =
    profile?.full_name ||
    (profile?.first_name || profile?.last_name
      ? `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim()
      : user?.first_name || user?.email || "Reviewer");

  const rawRole = profile?.role || user?.role || "Reviewer";
  const roleTitle = formatRole(rawRole);
  const profileEmail = profile?.email || user?.email || "";

  const avatarSrc =
    profile?.avatar_url ||
    user?.avatar_url ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
      profileEmail || "reviewer"
    )}`;

  const initials =
    ((profile?.first_name?.[0] || user?.first_name?.[0] || "R") +
      (profile?.last_name?.[0] || user?.last_name?.[0] || "V")).toUpperCase();

  const handleLogout = async () => {
    try {
      const refreshToken = (session as any)?.refreshToken;
      if (refreshToken) {
        try {
          await logoutApi({ refresh: refreshToken }).unwrap();
        } catch {
          // ignore error if token already expired
        }
      }
      await serverLogout();
    } catch {
      // fallback
    } finally {
      dispatch(clearAuth());
      toast.success("Signed out successfully");
      await signOut({ callbackUrl: "/auth/login" });
    }
  };

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
                {reviewerLinks.map((link) => (
                  <SidebarLink
                    key={link.href}
                    link={link}
                    pathname={pathname}
                    count={
                      link.href === ReviewerRoute.PENDING ? pendingCount : undefined
                    }
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-[8px] w-full">
              <div className="border-b-[0.5px] border-sd-grey-11 flex h-[24px] items-center py-[10px] w-full">
                <span className="text-[12px] font-medium text-sd-reviewer-muted leading-[16px]">
                  System
                </span>
              </div>
              <div className="flex flex-col w-full">
                {systemLinks.map((link) => (
                  <SidebarLink
                    key={link.href}
                    link={link}
                    pathname={pathname}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-auto flex w-full flex-col gap-[12px] mb-[24px]">
            <div className="flex flex-col w-full">
              {bottomLinks.map((link) => (
                <SidebarLink key={link.href} link={link} pathname={pathname} />
              ))}
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex h-[36px] items-center gap-[8px] px-[8px] py-[8px] rounded-[8px] hover:bg-sd-grey-11 transition-colors cursor-pointer w-full text-left"
              >
                <Logout variant="Linear" size={20} color="var(--sd-reviewer-muted)" />
                <span className="text-[14px] font-normal text-sd-reviewer-muted tracking-[-0.28px] leading-[20px]">
                  {isLoggingOut ? "Signing out..." : "Sign out"}
                </span>
              </button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="bg-sd-grey-11 hover:bg-sd-grey-10 transition-colors flex flex-col p-[8px] rounded-[12px] w-full cursor-pointer text-left focus:outline-none"
                  aria-label="User profile menu"
                >
                  <div className="flex items-center justify-between gap-[8px] w-full">
                    <div className="flex items-center gap-[9px] min-w-0 flex-1">
                      <div className="relative size-[36px] rounded-[8px] overflow-hidden shrink-0 bg-sd-grey-9 flex items-center justify-center">
                        {avatarSrc ? (
                          <Image
                            src={avatarSrc}
                            alt={displayName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-[12px] font-semibold text-white">
                            {initials}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col gap-[2px] min-w-0 flex-1">
                        <span
                          className="text-[12px] font-medium text-sd-white leading-[16px] truncate"
                          title={displayName}
                        >
                          {isProfileLoading ? "Loading..." : displayName}
                        </span>
                        <span
                          className="text-[11px] text-sd-muted-text leading-[14px] truncate"
                          title={roleTitle}
                        >
                          {roleTitle}
                        </span>
                      </div>
                    </div>
                    <MoreVertical
                      size={18}
                      className="text-sd-muted-text shrink-0"
                    />
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                side="top"
                className="w-[220px] p-[6px] bg-white rounded-[10px] border border-sd-grey-4 shadow-lg z-50 mb-[6px]"
              >
                <div className="px-[10px] py-[8px] border-b border-sd-grey-3 mb-[4px]">
                  <p className="text-[13px] font-medium text-[#202020] truncate">{displayName}</p>
                  <p className="text-[11px] text-[#606060] truncate">{profileEmail}</p>
                  <span className="inline-block mt-[4px] px-[6px] py-[2px] bg-[#F1F8F2] text-[#3C7E44] text-[10px] font-medium rounded">
                    {roleTitle}
                  </span>
                </div>
                <DropdownMenuItem
                  onClick={() => router.push(ReviewerRoute.SETTINGS)}
                  className="flex items-center gap-[8px] px-[10px] py-[8px] text-[13px] text-sd-grey-12 hover:bg-sd-grey-2 rounded-[6px] cursor-pointer"
                >
                  <Setting2 size={16} variant="Linear" color="#606060" />
                  <span>Account Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-[4px] bg-sd-grey-3" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-[8px] px-[10px] py-[8px] text-[13px] text-[#D54800] hover:bg-[#FFF0ED] rounded-[6px] cursor-pointer font-medium"
                >
                  <Logout size={16} variant="Linear" color="#D54800" />
                  <span>{isLoggingOut ? "Signing out..." : "Sign out"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>
    </>
  );
};
