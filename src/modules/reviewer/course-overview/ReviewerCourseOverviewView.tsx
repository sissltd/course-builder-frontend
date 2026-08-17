"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft2, Copy, More } from "iconsax-react";
import { toast } from "sonner";
import { Button } from "@/components/shared/Button";
import { cn } from "@/lib/utils";
import { ReviewerRoute } from "@/lib/routes";

import { OverviewTab } from "./components/tabs/OverviewTab";
import { ScriptTab } from "./components/tabs/ScriptTab";
import { QuizzesTab } from "./components/tabs/QuizzesTab";
import { MediaTab } from "./components/tabs/MediaTab";
import { PlagiarismTab } from "./components/tabs/PlagiarismTab";
import { ScriptModuleRail, QuizModuleRail, MediaModuleRail } from "./components/SidebarRails";
import { InfoRow } from "./components/SharedUI";
import { creatorInfo, courseInfo } from "./data/mockData";

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
  const [activeTab, setActiveTab] = React.useState<TabKey>("script");
  const [generalComment, setGeneralComment] = React.useState("");
  const [comments, setComments] = React.useState<Array<{
    id: string;
    title: string;
    comment: string;
    highlightedText?: string;
    timestamp: string;
  }>>([
    {
      id: "default-1",
      title: "Script Length",
      comment: "300/500 words below minimum",
      timestamp: "Today, 3:40pm",
    },
  ]);

  const handleAddComment = (title: string, commentText: string, highlightedText?: string) => {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();
    setComments((prev) => [
      {
        id: Date.now().toString(),
        title,
        comment: commentText,
        highlightedText,
        timestamp: `Today, ${formattedTime}`,
      },
      ...prev,
    ]);
  };

  const handleGeneralKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (generalComment.trim()) {
        handleAddComment("General Comment", generalComment.trim());
        setGeneralComment("");
        toast.success("Comment added");
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

  const renderTabContent = () => {
    switch (activeTab) {
      case "script":
        return <ScriptTab />;
      case "quizzes":
        return <QuizzesTab />;
      case "media":
        return <MediaTab />;
      case "plagiarism":
        return <PlagiarismTab />;
      case "overview":
      default:
        return <OverviewTab onAddComment={handleAddComment} />;
    }
  };

  return (
    <div className="min-h-screen bg-sd-grey-1 text-sd-grey-12 flex flex-col">
      <div className="border-b border-sd-grey-3 bg-sd-grey-1 px-[16px] py-[14px] md:px-[24px]">
        <div className="flex items-center justify-between gap-[16px]">
          <div className="flex min-w-0 items-center gap-[12px]">
            <button
              type="button"
              onClick={() => router.push(ReviewerRoute.PENDING)}
              className="flex items-center gap-[8px] text-sd-grey-12 transition-colors hover:text-sd-blue"
            >
              <ArrowLeft2 size={18} variant="Linear" color="currentColor" />
              <span className="text-[14px] font-normal leading-[20px]">Back</span>
            </button>
            <div className="h-[16px] w-px bg-sd-grey-4 hidden md:block" />
            <span className="truncate text-[16px] font-semibold leading-[24px] text-sd-grey-12 hidden md:inline">
              Introduction to computer science
            </span>
          </div>

          <button
            type="button"
            onClick={copyCourseId}
            className="flex items-center gap-[8px] text-sd-grey-11 transition-colors hover:text-sd-grey-12"
          >
            <span className="text-[14px] font-normal leading-[20px]">{courseId}</span>
            <Copy size={18} variant="Linear" color="currentColor" />
          </button>
        </div>
      </div>

      <div className="grid min-h-[calc(100vh-59px)] grid-cols-1 md:grid-cols-[237px_minmax(0,1fr)_326px] flex-1">
        <aside className="border-b border-sd-grey-3 bg-sd-grey-1 px-[18px] py-[16px] md:border-b-0 md:border-r">
          {activeTab === 'script' ? (
            <ScriptModuleRail />
          ) : activeTab === 'quizzes' ? (
            <QuizModuleRail />
          ) : activeTab === 'media' ? (
            <MediaModuleRail />
          ) : (
            <div className="flex flex-col gap-[24px]">
              <section className="flex flex-col gap-[12px]">
                <h2 className="text-[12px] font-semibold uppercase border-b-2 border-sd-grey-3 pb-[18px] leading-[16px] text-sd-grey-12">
                  Creator Information
                </h2>
                <div className="flex flex-col gap-[12px]">
                  {creatorInfo.map((item) => (
                    <InfoRow key={item.label} label={item.label} value={item.value} />
                  ))}
                </div>
              </section>

              <section className="flex flex-col gap-[12px] border-t border-sd-grey-3 pt-[18px]">
                <h2 className="text-[12px] font-semibold uppercase border-b-2 border-sd-grey-3 pb-[18px] leading-[16px] text-sd-grey-12">
                  Course Information
                </h2>
                <div className="flex flex-col gap-[12px]">
                  {courseInfo.map((item) => (
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
                      "relative whitespace-nowrap pt-[14px] pb-[12px] text-[14px] font-normal leading-[20px] transition-colors hover:text-sd-grey-11",
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
            {renderTabContent()}
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
                className="min-h-[96px] w-full resize-none rounded-[8px] border border-sd-grey-3 bg-sd-grey-1 px-[12px] py-[10px] text-[14px] leading-[20px] text-sd-grey-12 outline-none placeholder:text-sd-muted-text"
                placeholder="Add comment on this course (Press Enter to add)"
              />
            </section>

            <div className="flex flex-col gap-[12px] max-h-[350px] overflow-y-auto pr-1">
              {comments.map((c) => (
                <section key={c.id} className="rounded-[8px] border border-sd-grey-3 bg-sd-grey-2 p-[12px] flex flex-col gap-[6px]">
                  <div className="flex items-start justify-between gap-[12px]">
                    <div className="flex flex-col gap-[4px] min-w-0 flex-1">
                      <span className="text-[12px] font-semibold leading-[16px] text-sd-grey-12 truncate">
                        {c.title}
                      </span>
                      <p className="text-[12px] leading-[16px] text-sd-reviewer-muted break-words">
                        {c.comment}
                      </p>
                      {c.highlightedText && (
                        <p className="text-[10px] leading-[14px] text-sd-blue italic border-l border-sd-blue/30 pl-2 mt-1 truncate" title={c.highlightedText}>
                          &ldquo;{c.highlightedText}&rdquo;
                        </p>
                      )}
                      <span className="text-[11px] leading-[14px] text-sd-reviewer-muted mt-[4px]">
                        {c.timestamp}
                      </span>
                    </div>
                    <More size={18} variant="Linear" color="var(--sd-grey-11)" className="shrink-0 cursor-pointer hover:text-sd-grey-12 transition-colors" />
                  </div>
                </section>
              ))}
            </div>

            <div className="flex flex-col gap-[10px] pt-[4px]">
              <Button variant="app-primary" className="h-[44px] w-full rounded-[8px]">
                Approve course
              </Button>
              <Button
                variant="outline"
                className="h-[44px] w-full rounded-[8px] border-[#FF6B00] text-[#FF6B00] hover:bg-sd-danger-soft"
              >
                Reject course
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ReviewerCourseOverviewView;
