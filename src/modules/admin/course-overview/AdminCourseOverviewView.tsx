"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft2, Copy, More } from "iconsax-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Button } from "@/components/shared/Button";
import { cn } from "@/lib/utils";
import { AdminRoute } from "@/lib/routes";

import { OverviewTab } from "./components/tabs/OverviewTab";
import { ScriptTab } from "./components/tabs/ScriptTab";
import { QuizzesTab } from "./components/tabs/QuizzesTab";
import { MediaTab } from "./components/tabs/MediaTab";
import { PlagiarismTab } from "./components/tabs/PlagiarismTab";
import { ScriptModuleRail, QuizModuleRail, MediaModuleRail } from "./components/SidebarRails";
import { InfoRow } from "./components/SharedUI";
import {
  useGetAdminCourseDetailQuery,
  useClaimAdminCourseMutation,
  useApproveAdminCourseMutation,
  useGetAdminCourseCommentsQuery,
  useAddAdminCourseCommentMutation,
  useContentApproveAdminCourseMutation,
  useContentRejectAdminCourseMutation,
  useQaApproveAdminCourseMutation,
  useQaClaimAdminCourseMutation,
  useQaRejectAdminCourseMutation,
} from "@/redux/slices/adminApi";
import { CourseRejectModal } from "../courses/components/CourseRejectModal";

interface AdminCourseOverviewViewProps {
  courseId: string;
}

type TabKey = "overview" | "script" | "quizzes" | "media" | "plagiarism";

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "overview", label: "Course Overview" },
  { key: "script", label: "Script" },
  { key: "quizzes", label: "Quizzes" },
  { key: "media", label: "Media" },
  { key: "plagiarism", label: "Plagiarism" },
];

export const AdminCourseOverviewView = ({ courseId }: AdminCourseOverviewViewProps) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<TabKey>("overview");
  const [generalComment, setGeneralComment] = React.useState("");
  const [rejectModalOpen, setRejectModalOpen] = React.useState(false);

  // Endpoint 2: Retrieve full course details
  const { data: course, isLoading, error } = useGetAdminCourseDetailQuery(courseId);

  // Content Review stage mutations
  const [contentApproveMutation, { isLoading: isContentApproving }] =
    useContentApproveAdminCourseMutation();
  const [contentRejectMutation, { isLoading: isContentRejecting }] =
    useContentRejectAdminCourseMutation();
  const [claimCourseMutation, { isLoading: isClaiming }] = useClaimAdminCourseMutation();

  // QA stage mutations
  const [qaApproveMutation, { isLoading: isQaApproving }] = useQaApproveAdminCourseMutation();
  const [qaClaimMutation, { isLoading: isQaClaiming }] = useQaClaimAdminCourseMutation();
  const [qaRejectMutation, { isLoading: isQaRejecting }] = useQaRejectAdminCourseMutation();

  // Comments queries and mutations
  const { data: commentsData } = useGetAdminCourseCommentsQuery({ courseId });
  const comments = React.useMemo(() => commentsData?.data?.results ?? [], [commentsData]);
  const [addCommentMutation, { isLoading: isAddingComment }] = useAddAdminCourseCommentMutation();

  const isQaStage = course?.status === "QA_VERIFICATION";
  const isApproving = isContentApproving || isQaApproving;
  const isRejecting = isContentRejecting || isQaRejecting;
  const isClaimInProgress = isClaiming || isQaClaiming;

  const handleClaim = async () => {
    try {
      if (isQaStage) {
        await qaClaimMutation(courseId).unwrap();
        toast.success("Claimed course for QA verification");
      } else {
        await claimCourseMutation(courseId).unwrap();
        toast.success("Course review claimed successfully");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || err?.data?.errors?.[0]?.message || "Could not claim course");
    }
  };

  const handleApprove = async () => {
    try {
      if (isQaStage) {
        await qaApproveMutation({
          id: courseId,
          feedback: { summary: "QA verification passed and verified." },
        }).unwrap();
        toast.success("Course approved through QA quality gate");
      } else {
        await contentApproveMutation({
          id: courseId,
          feedback: { summary: "Content is complete and approved." },
        }).unwrap();
        toast.success("Course content approved and moved to QA verification");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || err?.data?.errors?.[0]?.message || "Could not approve course");
    }
  };

  const handleConfirmReject = async (summary: string) => {
    try {
      if (isQaStage) {
        await qaRejectMutation({
          id: courseId,
          feedback: { summary },
        }).unwrap();
        toast.success("Course rejected at QA stage and reverted to Draft");
      } else {
        await contentRejectMutation({
          id: courseId,
          feedback: { summary },
        }).unwrap();
        toast.success("Course rejected at content stage and reverted to Draft");
      }
      setRejectModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || err?.data?.errors?.[0]?.message || "Could not reject course");
    }
  };

  const handleAddComment = async (title: string, commentText: string, highlightedText?: string) => {
    try {
      await addCommentMutation({
        courseId,
        body: {
          stage: course?.status === "QA_VERIFICATION" ? "QA" : "CONTENT",
          severity: "INFO",
          reason_code: title.toUpperCase().replace(/\s+/g, "_") || "REVIEW_NOTE",
          comment: highlightedText ? `"${highlightedText}": ${commentText}` : commentText,
        },
      }).unwrap();
      toast.success("Comment added");
    } catch (err: any) {
      toast.error(err?.data?.message || err?.data?.errors?.[0]?.message || "Could not add comment");
    }
  };

  const handleGeneralKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const text = generalComment.trim();
      if (!text) return;
      try {
        await addCommentMutation({
          courseId,
          body: {
            stage: course?.status === "QA_VERIFICATION" ? "QA" : "CONTENT",
            severity: "INFO",
            reason_code: "REVIEW_NOTE",
            comment: text,
          },
        }).unwrap();
        setGeneralComment("");
        toast.success("Review note added");
      } catch (err: any) {
        toast.error(err?.data?.message || err?.data?.errors?.[0]?.message || "Could not add comment");
      }
    }
  };

  const copyCourseId = async () => {
    try {
      await navigator.clipboard.writeText(courseId);
      toast.success("Course ID copied");
    } catch {
      toast.error("Could not copy course ID");
    }
  };

  const formatSource = (source?: string | null) => {
    if (!source) return "No source specified";
    if (source === "CREATOR_UPLOADED" || source === "CREATOR") return "Creator Uploaded";
    if (source === "AI_GENERATED" || source === "AI") return "AI Generated";
    if (source === "DEVELOPER_API") return "Developer API";
    return source;
  };

  const creatorDetails = [
    { label: "Source", value: formatSource(course?.source) },
    {
      label: "Date created",
      value: course?.created_datetime ? format(new Date(course.created_datetime), "dd MMM yyyy") : "No creation date",
    },
    {
      label: "Terms accepted",
      value: course?.terms_accepted_at ? format(new Date(course.terms_accepted_at), "dd MMM yyyy") : "No terms acceptance date",
    },
    {
      label: "Submitted date",
      value: course?.submitted_at ? format(new Date(course.submitted_at), "dd MMM yyyy") : "No submission date",
    },
  ];

  const courseDetails = [
    { label: "Category", value: course?.category?.name || "No category" },
    { label: "Topic", value: course?.topic?.name || "No topic" },
    { label: "Difficulty", value: course?.difficulty_level || "No difficulty specified" },
    {
      label: "Modules",
      value: course?.modules && course.modules.length > 0 ? `${course.modules.length} Modules` : "No modules",
    },
    {
      label: "Duration",
      value: course?.planned_duration_seconds
        ? `${Math.floor(course.planned_duration_seconds / 3600)}h ${Math.floor((course.planned_duration_seconds % 3600) / 60)}m`
        : course?.duration_estimate_minutes
        ? `${course.duration_estimate_minutes}m`
        : "No duration specified",
    },
    { label: "Status", value: course?.status || "No status" },
    {
      label: "Version",
      value:
        typeof course?.version === "object" && course?.version?.label
          ? course.version.label
          : typeof course?.version === "string"
          ? course.version
          : "No version specified",
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "script":
        return <ScriptTab course={course} />;
      case "quizzes":
        return <QuizzesTab course={course} />;
      case "media":
        return <MediaTab course={course} />;
      case "plagiarism":
        return <PlagiarismTab course={course} />;
      case "overview":
      default:
        return <OverviewTab course={course} onAddComment={handleAddComment} />;
    }
  };

  return (
    <div className="min-h-screen bg-sd-grey-1 text-sd-grey-12 flex flex-col">
      <div className="border-b border-sd-grey-3 bg-sd-grey-1 px-[16px] py-[14px] md:px-[24px]">
        <div className="flex items-center justify-between gap-[16px]">
          <div className="flex min-w-0 items-center gap-[12px]">
            <button
              type="button"
              onClick={() => router.push(AdminRoute.COURSES)}
              className="flex items-center gap-[8px] text-sd-grey-12 transition-colors hover:text-sd-blue cursor-pointer"
            >
              <ArrowLeft2 size={18} variant="Linear" color="currentColor" />
              <span className="text-[14px] font-normal leading-[20px]">Back</span>
            </button>
            <div className="h-[16px] w-px bg-sd-grey-4 hidden md:block" />
            <span className="truncate text-[16px] font-semibold leading-[24px] text-sd-grey-12 hidden md:inline">
              {isLoading ? "Loading course..." : course?.title || "Course Overview"}
            </span>
            {course?.status && (
              <span className="rounded-full bg-sd-blue/10 px-[10px] py-[2px] text-[12px] font-medium text-sd-blue hidden sm:inline">
                {course.status}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={copyCourseId}
            className="flex items-center gap-[8px] text-sd-grey-11 transition-colors hover:text-sd-grey-12 cursor-pointer"
          >
            <span className="text-[14px] font-normal leading-[20px]">{courseId}</span>
            <Copy size={18} variant="Linear" color="currentColor" />
          </button>
        </div>
      </div>

      <div className="grid min-h-[calc(100vh-59px)] grid-cols-1 md:grid-cols-[237px_minmax(0,1fr)_326px] flex-1">
        <aside className="border-b border-sd-grey-3 bg-sd-grey-1 px-[18px] py-[16px] md:border-b-0 md:border-r">
          {activeTab === 'script' ? (
            <ScriptModuleRail course={course} />
          ) : activeTab === 'quizzes' ? (
            <QuizModuleRail course={course} />
          ) : activeTab === 'media' ? (
            <MediaModuleRail course={course} />
          ) : (
            <div className="flex flex-col gap-[24px]">
              <section className="flex flex-col gap-[12px]">
                <h2 className="text-[12px] font-semibold uppercase border-b-2 border-sd-grey-3 pb-[18px] leading-[16px] text-sd-grey-12">
                  Creator Information
                </h2>
                <div className="flex flex-col gap-[12px]">
                  {creatorDetails.map((item) => (
                    <InfoRow key={item.label} label={item.label} value={item.value} />
                  ))}
                </div>
              </section>

              <section className="flex flex-col gap-[12px] border-t border-sd-grey-3 pt-[18px]">
                <h2 className="text-[12px] font-semibold uppercase border-b-2 border-sd-grey-3 pb-[18px] leading-[16px] text-sd-grey-12">
                  Course Information
                </h2>
                <div className="flex flex-col gap-[12px]">
                  {courseDetails.map((item) => (
                    <InfoRow key={item.label} label={item.label} value={item.value} />
                  ))}
                </div>
              </section>
            </div>
          )}
        </aside>

        <main className="flex flex-col overflow-y-auto bg-sd-grey-1">
          <div className="bg-sd-grey-1 border-b border-sd-grey-3 px-[16px] md:px-[18px] shrink-0 sticky top-0 z-10">
            <div className="flex items-center gap-[20px] overflow-x-auto">
              {tabs.map((tab) => {
                const active = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={cn(
                      "relative whitespace-nowrap pt-[14px] pb-[12px] text-[14px] font-normal leading-[20px] transition-colors hover:text-sd-grey-11 cursor-pointer",
                      active ? "text-sd-grey-12 font-medium" : "text-sd-muted-text",
                    )}
                  >
                    {tab.label}
                    {active && <span className="absolute inset-x-0 bottom-0 h-[2px] bg-sd-grey-12" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div
            className={cn(
              "flex-1",
              activeTab === "script"
                || activeTab === "quizzes"
                || activeTab === "media"
                ? "px-[23px] pb-[80px] pt-[28px]"
                : "bg-sd-grey-2 px-[16px] py-[16px] md:px-[18px] md:py-[18px]",
            )}
          >
            {isLoading ? (
              <div className="flex h-[200px] items-center justify-center text-sd-grey-11 text-[14px]">
                Loading course details...
              </div>
            ) : error ? (
              <div className="flex h-[200px] flex-col items-center justify-center gap-[8px] text-sd-danger text-[14px]">
                Failed to load course details.
              </div>
            ) : (
              renderTabContent()
            )}
          </div>
        </main>

        <aside className="border-t border-sd-grey-3 bg-sd-grey-1 px-[20px] py-[20px] md:border-l md:border-t-0">
          <div className="flex flex-col gap-[16px]">
            <section className="flex flex-col gap-[10px]">
              <h2 className="text-[16px] font-semibold leading-[24px] text-sd-grey-12">
                Review note
              </h2>
              <p className="text-[12px] leading-[16px] text-sd-reviewer-muted">
                Comments you add will appear here
              </p>
              <textarea
                value={generalComment}
                onChange={(e) => setGeneralComment(e.target.value)}
                onKeyDown={handleGeneralKeyDown}
                disabled={isAddingComment}
                className="min-h-[96px] w-full resize-none rounded-[8px] border border-sd-grey-3 bg-sd-grey-1 px-[12px] py-[10px] text-[14px] leading-[20px] text-sd-grey-12 outline-none placeholder:text-sd-muted-text disabled:opacity-50"
                placeholder={isAddingComment ? "Adding comment..." : "Add comment on this course (Press Enter to add)"}
              />
            </section>

            <div className="flex flex-col gap-[12px] max-h-[350px] overflow-y-auto pr-1">
              {comments.length === 0 ? (
                <div className="py-4 text-center text-[12px] text-sd-grey-11">
                  No review notes recorded yet.
                </div>
              ) : (
                comments.map((c) => (
                  <section key={c.id} className="rounded-[8px] border border-sd-grey-3 bg-sd-grey-2 p-[12px] flex flex-col gap-[6px]">
                    <div className="flex items-start justify-between gap-[12px]">
                      <div className="flex flex-col gap-[4px] min-w-0 flex-1">
                        <div className="flex items-center gap-[6px]">
                          <span className="text-[12px] font-semibold leading-[16px] text-sd-grey-12 truncate">
                            {c.reason_code || "Review Note"}
                          </span>
                          {c.stage && (
                            <span className="rounded bg-sd-blue/10 px-[6px] py-[1px] text-[10px] font-medium text-sd-blue">
                              {c.stage}
                            </span>
                          )}
                        </div>
                        <p className="text-[12px] leading-[16px] text-sd-reviewer-muted break-words">
                          {c.comment}
                        </p>
                        <span className="text-[11px] leading-[14px] text-sd-reviewer-muted mt-[4px]">
                          {c.created_datetime ? format(new Date(c.created_datetime), "dd MMM yyyy, hh:mma") : "Recent"}
                        </span>
                      </div>
                      <More size={18} variant="Linear" color="var(--sd-grey-11)" className="shrink-0 cursor-pointer hover:text-sd-grey-12 transition-colors" />
                    </div>
                  </section>
                ))
              )}
            </div>

            <div className="flex flex-col gap-[10px] pt-[4px]">
              {(course?.status === "SUBMITTED" || (isQaStage && !course?.approved_at)) && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={isClaimInProgress}
                  onClick={handleClaim}
                  className="h-[44px] w-full rounded-[8px] border-sd-blue text-sd-blue hover:bg-sd-blue/5 transition-colors cursor-pointer"
                >
                  {isClaimInProgress
                    ? "Claiming..."
                    : isQaStage
                    ? "Claim for QA review"
                    : "Claim course review"}
                </Button>
              )}
              <Button
                type="button"
                variant="app-primary"
                disabled={isApproving || course?.status === "APPROVED"}
                onClick={handleApprove}
                className="h-[44px] w-full rounded-[8px]"
              >
                {isApproving
                  ? "Approving..."
                  : course?.status === "APPROVED"
                  ? "Course Approved"
                  : isQaStage
                  ? "Approve QA & Credit Creator"
                  : "Approve Content"}
              </Button>
              {course?.status !== "APPROVED" && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={isRejecting}
                  onClick={() => setRejectModalOpen(true)}
                  className="h-[44px] w-full rounded-[8px] border-[#FF6B00] text-[#FF6B00] hover:bg-sd-danger-soft transition-colors cursor-pointer"
                >
                  {isQaStage ? "Reject at QA stage" : "Reject course"}
                </Button>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* Course Rejection Feedback Modal */}
      <CourseRejectModal
        isOpen={rejectModalOpen}
        onOpenChange={setRejectModalOpen}
        courseTitle={course?.title}
        isLoading={isRejecting}
        onConfirm={handleConfirmReject}
      />
    </div>
  );
};
