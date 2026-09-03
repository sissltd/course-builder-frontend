"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft2, Copy, More } from "iconsax-react";
import { toast } from "sonner";
import { Button } from "@/components/shared/Button";
import { cn } from "@/lib/utils";
import { ReviewerRoute } from "@/lib/routes";
import { format } from "date-fns";

import { OverviewTab } from "@/modules/admin/course-overview/components/tabs/OverviewTab";
import { ScriptTab } from "@/modules/admin/course-overview/components/tabs/ScriptTab";
import { QuizzesTab } from "@/modules/admin/course-overview/components/tabs/QuizzesTab";
import { MediaTab } from "@/modules/admin/course-overview/components/tabs/MediaTab";
import { PlagiarismTab } from "@/modules/admin/course-overview/components/tabs/PlagiarismTab";
import {
  ScriptModuleRail,
  QuizModuleRail,
  MediaModuleRail,
} from "@/modules/admin/course-overview/components/SidebarRails";
import { InfoRow } from "@/modules/admin/course-overview/components/SharedUI";
import {
  useGetAdminCourseDetailQuery,
  useGetAdminCourseCommentsQuery,
  useAddAdminCourseCommentMutation,
  useContentApproveAdminCourseMutation,
  useQaApproveAdminCourseMutation,
  useContentRejectAdminCourseMutation,
  useQaRejectAdminCourseMutation,
} from "@/redux/slices/adminApi";
import { CourseRejectModal } from "@/modules/admin/courses/components/CourseRejectModal";

interface ReviewerCourseOverviewViewProps {
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

export const ReviewerCourseOverviewView = ({ courseId }: ReviewerCourseOverviewViewProps) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<TabKey>("overview");
  const [generalComment, setGeneralComment] = React.useState("");
  const [isRejectModalOpen, setIsRejectModalOpen] = React.useState(false);

  const {
    data: course,
    isLoading: isCourseLoading,
    error: courseError,
    refetch,
  } = useGetAdminCourseDetailQuery(courseId, { skip: !courseId });

  const {
    data: commentsResponse,
    refetch: refetchComments,
  } = useGetAdminCourseCommentsQuery({ courseId }, { skip: !courseId });

  const [addCommentMutation, { isLoading: isAddingComment }] = useAddAdminCourseCommentMutation();
  const [contentApproveMutation, { isLoading: isApprovingContent }] = useContentApproveAdminCourseMutation();
  const [qaApproveMutation, { isLoading: isApprovingQa }] = useQaApproveAdminCourseMutation();
  const [contentRejectMutation, { isLoading: isRejectingContent }] = useContentRejectAdminCourseMutation();
  const [qaRejectMutation, { isLoading: isRejectingQa }] = useQaRejectAdminCourseMutation();

  const comments = commentsResponse?.data?.results ?? [];
  const isQaStage = course?.status === "QA_REVIEW" || course?.status === "IN_QA" || course?.status === "QA_VERIFICATION";
  const isRejecting = isRejectingContent || isRejectingQa;

  const handleAddComment = async (
    title: string,
    commentText: string,
    highlightedText?: string
  ) => {
    try {
      const fullText = highlightedText
        ? `[Quote: "${highlightedText}"] ${commentText}`
        : commentText;
      const stage = isQaStage ? "QA" : "CONTENT";

      await addCommentMutation({
        courseId,
        body: {
          stage,
          severity: "INFO",
          reason_code: title.toUpperCase().replace(/\s+/g, "_") || "REVIEW_NOTE",
          comment: fullText,
        },
      }).unwrap();

      toast.success("Review note added");
      void refetchComments();
    } catch {
      toast.error("Failed to add comment");
    }
  };

  const handleGeneralKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (generalComment.trim() && !isAddingComment) {
        const text = generalComment.trim();
        setGeneralComment("");
        await handleAddComment("General Comment", text);
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

  const handleApprove = async () => {
    try {
      if (isQaStage) {
        await qaApproveMutation({ id: courseId }).unwrap();
        toast.success("QA approved successfully");
      } else {
        await contentApproveMutation({ id: courseId }).unwrap();
        toast.success("Content approved successfully");
      }
      void refetch();
    } catch (err: unknown) {
      const apiErr = err as { data?: { message?: string } };
      toast.error(apiErr?.data?.message || "Failed to approve course");
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
      setIsRejectModalOpen(false);
      void refetch();
    } catch (err: unknown) {
      const apiErr = err as { data?: { message?: string } };
      toast.error(apiErr?.data?.message || "Failed to reject course");
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
      value: course?.created_datetime
        ? format(new Date(course.created_datetime), "dd MMM yyyy")
        : "No creation date",
    },
    {
      label: "Terms accepted",
      value: course?.terms_accepted_at
        ? format(new Date(course.terms_accepted_at), "dd MMM yyyy")
        : "No terms acceptance date",
    },
    {
      label: "Submitted date",
      value: course?.submitted_at
        ? format(new Date(course.submitted_at), "dd MMM yyyy")
        : "No submission date",
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
      {/* Header */}
      <div className="border-b border-sd-grey-3 bg-sd-grey-1 px-[16px] py-[14px] md:px-[24px]">
        <div className="flex items-center justify-between gap-[16px]">
          <div className="flex min-w-0 items-center gap-[12px]">
            <button
              type="button"
              onClick={() => router.push(ReviewerRoute.PENDING)}
              className="flex items-center gap-[8px] text-sd-grey-12 transition-colors hover:text-sd-blue cursor-pointer"
            >
              <ArrowLeft2 size={18} variant="Linear" color="currentColor" />
              <span className="text-[14px] font-normal leading-[20px]">Back</span>
            </button>
            <div className="h-[16px] w-px bg-sd-grey-4 hidden md:block" />
            <span className="truncate text-[16px] font-semibold leading-[24px] text-sd-grey-12 hidden md:inline">
              {isCourseLoading ? "Loading course..." : course?.title || "No course title"}
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
        {/* Left Sidebar */}
        <aside className="border-b border-sd-grey-3 bg-sd-grey-1 px-[18px] py-[16px] md:border-b-0 md:border-r">
          {activeTab === "script" ? (
            <ScriptModuleRail course={course} />
          ) : activeTab === "quizzes" ? (
            <QuizModuleRail course={course} />
          ) : activeTab === "media" ? (
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

        {/* Center Main Tab Content */}
        <main className="flex min-w-0 flex-1 flex-col bg-sd-grey-1">
          <div className="border-b border-sd-grey-3 bg-sd-grey-1 px-[16px] md:px-[24px]">
            <div className="flex items-center gap-[24px] overflow-x-auto no-scrollbar">
              {tabs.map((tab) => {
                const active = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={cn(
                      "relative whitespace-nowrap pt-[14px] pb-[12px] text-[14px] font-normal leading-[20px] transition-colors hover:text-sd-grey-11 cursor-pointer",
                      active ? "text-sd-grey-12 font-medium" : "text-sd-muted-text"
                    )}
                  >
                    {tab.label}
                    {active && <span className="absolute inset-x-0 bottom-0 h-[2px] bg-sd-blue" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div
            className={cn(
              "flex-1",
              activeTab === "script" || activeTab === "quizzes" || activeTab === "media"
                ? "px-[23px] pb-[80px] pt-[28px]"
                : "bg-sd-grey-2 px-[16px] py-[16px] md:px-[18px] md:py-[18px]"
            )}
          >
            {isCourseLoading ? (
              <div className="flex h-[200px] items-center justify-center text-sd-grey-11 text-[14px]">
                Loading course details...
              </div>
            ) : courseError ? (
              <div className="flex h-[200px] flex-col items-center justify-center gap-[8px] text-sd-danger text-[14px]">
                Failed to load course details.
              </div>
            ) : (
              renderTabContent()
            )}
          </div>
        </main>

        {/* Right Sidebar */}
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
                placeholder={
                  isAddingComment
                    ? "Adding comment..."
                    : "Add comment on this course (Press Enter to add)"
                }
              />
            </section>

            <div className="flex flex-col gap-[12px] max-h-[350px] overflow-y-auto pr-1">
              {comments.length === 0 ? (
                <div className="py-4 text-center text-[12px] text-sd-grey-11">
                  No review notes recorded yet.
                </div>
              ) : (
                comments.map((c) => (
                  <section
                    key={c.id}
                    className="rounded-[8px] border border-sd-grey-3 bg-sd-grey-2 p-[12px] flex flex-col gap-[6px]"
                  >
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
                          {c.created_datetime
                            ? format(new Date(c.created_datetime), "dd MMM, hh:mmaaa")
                            : "Recorded"}
                        </span>
                      </div>
                      <More
                        size={18}
                        variant="Linear"
                        color="var(--sd-grey-11)"
                        className="shrink-0 cursor-pointer hover:text-sd-grey-12 transition-colors"
                      />
                    </div>
                  </section>
                ))
              )}
            </div>

            <div className="flex flex-col gap-[10px] pt-[4px]">
              <Button
                variant="app-primary"
                disabled={isApprovingContent || isApprovingQa}
                onClick={handleApprove}
                className="h-[44px] w-full rounded-[8px] cursor-pointer"
              >
                {isApprovingContent || isApprovingQa
                  ? "Approving..."
                  : isQaStage
                  ? "QA Approve"
                  : "Approve Content"}
              </Button>
              <Button
                variant="outline"
                disabled={isRejecting}
                onClick={() => setIsRejectModalOpen(true)}
                className="h-[44px] w-full rounded-[8px] border-[#FF6B00] text-[#FF6B00] hover:bg-sd-danger-soft cursor-pointer"
              >
                Reject course
              </Button>
            </div>
          </div>
        </aside>
      </div>

      {/* Course Rejection Feedback Modal */}
      <CourseRejectModal
        isOpen={isRejectModalOpen}
        onOpenChange={setIsRejectModalOpen}
        courseTitle={course?.title}
        isLoading={isRejecting}
        onConfirm={handleConfirmReject}
      />
    </div>
  );
};

export default ReviewerCourseOverviewView;
